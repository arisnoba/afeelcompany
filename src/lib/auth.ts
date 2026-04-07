import 'server-only'

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { sql } from '@/lib/db'
import type { AdminUserSummary } from '@/types/admin'

export const ADMIN_SESSION_COOKIE = 'afeel_admin_session'

const INITIAL_ADMIN_EMAIL = 'arisnoba@gmail.com'
const PASSWORD_HASH_PREFIX = 'scrypt'
const PASSWORD_KEY_LENGTH = 64
const PASSWORD_MIN_LENGTH = 10
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000

let adminSchemaPromise: Promise<void> | null = null

interface AdminUserRow {
  id: string
  email: string
  password_hash: string
  is_active: boolean
  created_at: string
}

interface AdminCountRow {
  count: string
}

interface AdminSessionRow {
  id: string
  email: string
  is_active: boolean
}

export interface AdminSession {
  adminId: string
  email: string
}

function normalizeAdminEmail(value: string): string {
  return value.trim().toLowerCase()
}

function isEqual(left: string | Buffer, right: string | Buffer): boolean {
  const leftBuffer = typeof left === 'string' ? Buffer.from(left) : left
  const rightBuffer = typeof right === 'string' ? Buffer.from(right) : right

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

function isValidAdminEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function validateAdminPassword(value: string): boolean {
  return value.length >= PASSWORD_MIN_LENGTH
}

function getBootstrapPassword(): string | null {
  return process.env.ADMIN_PASSWORD ?? null
}

function getSessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? null
}

function hashPassword(value: string): string {
  const salt = randomBytes(16)
  const hash = scryptSync(value, salt, PASSWORD_KEY_LENGTH)

  return `${PASSWORD_HASH_PREFIX}:${salt.toString('hex')}:${hash.toString('hex')}`
}

function verifyPasswordHash(input: string, storedHash: string): boolean {
  const [scheme, saltHex, hashHex] = storedHash.split(':')

  if (scheme !== PASSWORD_HASH_PREFIX || !saltHex || !hashHex) {
    return false
  }

  const storedHashBuffer = Buffer.from(hashHex, 'hex')
  const derivedHash = scryptSync(
    input,
    Buffer.from(saltHex, 'hex'),
    storedHashBuffer.length
  )

  return isEqual(derivedHash, storedHashBuffer)
}

function mapAdminUser(
  row: Pick<AdminUserRow, 'id' | 'email' | 'is_active' | 'created_at'>
): AdminUserSummary {
  return {
    id: row.id,
    email: row.email,
    isActive: row.is_active,
    createdAt: row.created_at,
  }
}

async function ensureAdminSchema(): Promise<void> {
  if (!adminSchemaPromise) {
    adminSchemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS admin_users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `

      await sql`
        CREATE INDEX IF NOT EXISTS admin_users_email_idx
        ON admin_users (email)
      `
    })()
  }

  return adminSchemaPromise
}

async function bootstrapInitialAdmin(): Promise<void> {
  await ensureAdminSchema()

  const existingAdminCount = await sql<AdminCountRow>`
    SELECT COUNT(*)::text AS count
    FROM admin_users
  `

  if (Number(existingAdminCount.rows[0]?.count ?? '0') > 0) {
    return
  }

  const bootstrapPassword = getBootstrapPassword()

  if (!bootstrapPassword) {
    return
  }

  await sql`
    INSERT INTO admin_users (email, password_hash)
    VALUES (${INITIAL_ADMIN_EMAIL}, ${hashPassword(bootstrapPassword)})
    ON CONFLICT (email) DO NOTHING
  `
}

async function ensureAdminAuthReady(): Promise<void> {
  await ensureAdminSchema()
  await bootstrapInitialAdmin()
}

async function getAdminUserByEmail(email: string): Promise<AdminUserRow | null> {
  await ensureAdminAuthReady()

  const result = await sql<AdminUserRow>`
    SELECT id, email, password_hash, is_active, created_at
    FROM admin_users
    WHERE email = ${normalizeAdminEmail(email)}
    LIMIT 1
  `

  return result.rows[0] ?? null
}

async function getAdminUserById(adminId: string): Promise<AdminSessionRow | null> {
  await ensureAdminAuthReady()

  const result = await sql<AdminSessionRow>`
    SELECT id, email, is_active
    FROM admin_users
    WHERE id = ${adminId}
    LIMIT 1
  `

  return result.rows[0] ?? null
}

async function countActiveAdmins(): Promise<number> {
  await ensureAdminAuthReady()

  const result = await sql<AdminCountRow>`
    SELECT COUNT(*)::text AS count
    FROM admin_users
    WHERE is_active = true
  `

  return Number(result.rows[0]?.count ?? '0')
}

function signSession(adminId: string, expiresAt: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(`${adminId}.${expiresAt}`)
    .digest('hex')
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<AdminSession | null> {
  const admin = await getAdminUserByEmail(email)

  if (!admin || !admin.is_active) {
    return null
  }

  if (!verifyPasswordHash(password, admin.password_hash)) {
    return null
  }

  return {
    adminId: admin.id,
    email: admin.email,
  }
}

export async function createAdminSession(adminId: string): Promise<void> {
  const secret = getSessionSecret()

  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is not configured')
  }

  const expiresAt = String(Date.now() + SESSION_MAX_AGE_MS)
  const signature = signSession(adminId, expiresAt, secret)
  const cookieStore = await cookies()

  cookieStore.set(ADMIN_SESSION_COOKIE, `${adminId}.${expiresAt}.${signature}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const secret = getSessionSecret()

  if (!secret) {
    return null
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

  if (!token) {
    return null
  }

  const [adminId, expiresAt, signature] = token.split('.')

  if (!adminId || !expiresAt || !signature) {
    return null
  }

  const parsedExpiresAt = Number(expiresAt)

  if (!Number.isFinite(parsedExpiresAt) || parsedExpiresAt <= Date.now()) {
    return null
  }

  const expectedSignature = signSession(adminId, expiresAt, secret)

  if (!isEqual(signature, expectedSignature)) {
    return null
  }

  const admin = await getAdminUserById(adminId)

  if (!admin || !admin.is_active) {
    return null
  }

  return {
    adminId: admin.id,
    email: admin.email,
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return Boolean(await getAdminSession())
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession()

  if (!session) {
    redirect('/admin/login')
  }

  return session
}

export async function isAdminBootstrapConfigured(): Promise<boolean> {
  await ensureAdminAuthReady()

  const result = await sql<AdminCountRow>`
    SELECT COUNT(*)::text AS count
    FROM admin_users
  `

  return Number(result.rows[0]?.count ?? '0') > 0 || Boolean(getBootstrapPassword())
}

export async function listAdminUsers(): Promise<AdminUserSummary[]> {
  await ensureAdminAuthReady()

  const result = await sql<AdminUserRow>`
    SELECT id, email, password_hash, is_active, created_at
    FROM admin_users
    ORDER BY created_at ASC
  `

  return result.rows.map(mapAdminUser)
}

export async function createAdminUser(
  email: string,
  password: string
): Promise<AdminUserSummary> {
  await ensureAdminAuthReady()

  const normalizedEmail = normalizeAdminEmail(email)

  if (!isValidAdminEmail(normalizedEmail)) {
    throw new Error('INVALID_EMAIL')
  }

  if (!validateAdminPassword(password)) {
    throw new Error('PASSWORD_TOO_SHORT')
  }

  const result = await sql<AdminUserRow>`
    INSERT INTO admin_users (email, password_hash)
    VALUES (${normalizedEmail}, ${hashPassword(password)})
    ON CONFLICT (email) DO NOTHING
    RETURNING id, email, password_hash, is_active, created_at
  `

  const createdAdmin = result.rows[0]

  if (!createdAdmin) {
    throw new Error('EMAIL_ALREADY_EXISTS')
  }

  return mapAdminUser(createdAdmin)
}

export async function setAdminUserActive(
  adminId: string,
  isActive: boolean,
  currentAdminId: string
): Promise<AdminUserSummary> {
  await ensureAdminAuthReady()

  if (!isActive && adminId === currentAdminId) {
    throw new Error('CANNOT_DEACTIVATE_SELF')
  }

  const targetAdmin = await getAdminUserById(adminId)

  if (!targetAdmin) {
    throw new Error('ADMIN_NOT_FOUND')
  }

  if (!isActive && targetAdmin.is_active && (await countActiveAdmins()) <= 1) {
    throw new Error('LAST_ACTIVE_ADMIN')
  }

  const result = await sql<AdminUserRow>`
    UPDATE admin_users
    SET is_active = ${isActive}, updated_at = NOW()
    WHERE id = ${adminId}
    RETURNING id, email, password_hash, is_active, created_at
  `

  const updatedAdmin = result.rows[0]

  if (!updatedAdmin) {
    throw new Error('ADMIN_NOT_FOUND')
  }

  return mapAdminUser(updatedAdmin)
}
