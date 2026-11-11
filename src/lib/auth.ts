import 'server-only'

import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { VercelPoolClient } from '@vercel/postgres'
import { sql } from '@/lib/db'
import type { AdminUserSummary } from '@/types/admin'

export const ADMIN_SESSION_COOKIE = 'afeel_admin_session'

const INITIAL_ADMIN_EMAIL = 'arisnoba@gmail.com'
const PASSWORD_HASH_PREFIX = 'scrypt'
const PASSWORD_KEY_LENGTH = 64
const PASSWORD_MIN_LENGTH = 10
export const MAX_ADMIN_PASSWORD_LENGTH = 4096
export const MAX_ADMIN_EMAIL_LENGTH = 254
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7
const deriveKey = promisify(scrypt)

let adminSchemaPromise: Promise<void> | null = null

interface AdminUserRow {
  id: string
  email: string
  password_hash: string
  session_version?: string
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
  return value.length <= MAX_ADMIN_EMAIL_LENGTH && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function validateAdminPassword(value: string): boolean {
  return value.length >= PASSWORD_MIN_LENGTH
}

function getBootstrapPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD
  return password && password.length <= MAX_ADMIN_PASSWORD_LENGTH ? password : null
}

async function hashPassword(value: string): Promise<string> {
  const salt = randomBytes(16)
  const hash = await deriveKey(value, salt, PASSWORD_KEY_LENGTH) as Buffer

  return `${PASSWORD_HASH_PREFIX}:${salt.toString('hex')}:${hash.toString('hex')}`
}

async function verifyPasswordHash(input: string, storedHash: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = storedHash.split(':')

  if (scheme !== PASSWORD_HASH_PREFIX || !/^[0-9a-f]{32}$/.test(saltHex ?? '') || !/^[0-9a-f]{128}$/.test(hashHex ?? '')) {
    return false
  }

  const storedHashBuffer = Buffer.from(hashHex, 'hex')
  const derivedHash = await deriveKey(
    input,
    Buffer.from(saltHex, 'hex'),
    PASSWORD_KEY_LENGTH
  ) as Buffer

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

      await sql`
        CREATE TABLE IF NOT EXISTS admin_sessions (
          token_hash TEXT PRIMARY KEY,
          admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
          expires_at TIMESTAMPTZ NOT NULL
        )
      `

      await sql`
        CREATE INDEX IF NOT EXISTS admin_sessions_admin_id_idx ON admin_sessions (admin_id)
      `

      await sql`
        CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx ON admin_sessions (expires_at)
      `
    })().catch(error => {
      adminSchemaPromise = null
      throw error
    })
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
    VALUES (${INITIAL_ADMIN_EMAIL}, ${await hashPassword(bootstrapPassword)})
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
    SELECT id, email, password_hash, is_active, created_at, updated_at::text AS session_version
    FROM admin_users
    WHERE email = ${normalizeAdminEmail(email)}
    LIMIT 1
  `

  return result.rows[0] ?? null
}

function sessionTokenHash(token: string | undefined): string | null {
  return token && /^[a-f0-9]{64}$/.test(token)
    ? createHash('sha256').update(token).digest('hex')
    : null
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<(AdminSession & { sessionVersion: string }) | null> {
  const admin = await getAdminUserByEmail(email)
  if (!admin?.is_active || !admin.session_version || !(await verifyPasswordHash(password, admin.password_hash))) {
    return null
  }

  return { adminId: admin.id, email: admin.email, sessionVersion: admin.session_version }
}

export async function createAdminSession(adminId: string, sessionVersion: string): Promise<boolean> {
  const token = randomBytes(32).toString('hex')
  const tokenHash = sessionTokenHash(token)

  await sql`DELETE FROM admin_sessions WHERE expires_at <= NOW()`
  const result = await sql`
    INSERT INTO admin_sessions (token_hash, admin_id, expires_at)
    SELECT ${tokenHash}, id, NOW() + ${SESSION_MAX_AGE_SECONDS} * INTERVAL '1 second'
    FROM admin_users
    WHERE id = ${adminId} AND is_active AND updated_at::text = ${sessionVersion}
    FOR SHARE
  `

  if (!result.rowCount) return false

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return true
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value
  const tokenHash = sessionTokenHash(token)
  if (tokenHash) {
    await ensureAdminSchema()
    await sql`DELETE FROM admin_sessions WHERE token_hash = ${tokenHash}`
  }
  if (token) cookieStore.delete(ADMIN_SESSION_COOKIE)
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const tokenHash = sessionTokenHash(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)
  if (!tokenHash) return null

  await ensureAdminSchema()
  const result = await sql<AdminSessionRow>`
    SELECT admin_users.id, admin_users.email, admin_users.is_active
    FROM admin_sessions
    JOIN admin_users ON admin_users.id = admin_sessions.admin_id
    WHERE admin_sessions.token_hash = ${tokenHash}
      AND admin_sessions.expires_at > NOW()
      AND admin_users.is_active
  `
  const admin = result.rows[0]
  return admin ? { adminId: admin.id, email: admin.email } : null
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
  if (password.length > MAX_ADMIN_PASSWORD_LENGTH) throw new Error('PASSWORD_TOO_LONG')

  const passwordHash = await hashPassword(password)
  return withLockedAdmin(async client => {
    const result = await client.sql<AdminUserRow>`
      INSERT INTO admin_users (email, password_hash)
      VALUES (${normalizedEmail}, ${passwordHash})
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, password_hash, is_active, created_at
    `

    if (!result.rows[0]) throw new Error('EMAIL_ALREADY_EXISTS')
    return mapAdminUser(result.rows[0])
  })
}

async function withLockedAdmin<T>(
  mutate: (client: VercelPoolClient, adminId: string) => Promise<T>,
): Promise<T> {
  const tokenHash = sessionTokenHash((await cookies()).get(ADMIN_SESSION_COOKIE)?.value)
  if (!tokenHash) throw new Error('UNAUTHORIZED')

  const client = await sql.connect()
  try {
    await client.query('BEGIN')
    await client.query('LOCK TABLE admin_users IN SHARE ROW EXCLUSIVE MODE')

    const actor = await client.sql<AdminSessionRow>`
      SELECT admin_users.id, admin_users.email, admin_users.is_active
      FROM admin_sessions
      JOIN admin_users ON admin_users.id = admin_sessions.admin_id
      WHERE admin_sessions.token_hash = ${tokenHash}
        AND admin_sessions.expires_at > clock_timestamp()
        AND admin_users.is_active
      FOR SHARE OF admin_sessions
    `
    if (!actor.rows[0]) throw new Error('UNAUTHORIZED')

    const result = await mutate(client, actor.rows[0].id)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

export async function setAdminUserActive(adminId: string, isActive: boolean): Promise<AdminUserSummary> {
  return withLockedAdmin(async (client, currentAdminId) => {
    if (!isActive && adminId === currentAdminId) throw new Error('CANNOT_DEACTIVATE_SELF')

    const target = await client.sql<AdminSessionRow>`
      SELECT id, email, is_active FROM admin_users WHERE id = ${adminId}
    `
    if (!target.rows[0]) throw new Error('ADMIN_NOT_FOUND')

    if (!isActive && target.rows[0].is_active) {
      const count = await client.sql<AdminCountRow>`
        SELECT COUNT(*)::text AS count FROM admin_users WHERE is_active
      `
      if (Number(count.rows[0]?.count ?? '0') <= 1) throw new Error('LAST_ACTIVE_ADMIN')
    }

    const result = await client.sql<AdminUserRow>`
      UPDATE admin_users
      SET is_active = ${isActive}, updated_at = clock_timestamp()
      WHERE id = ${adminId}
      RETURNING id, email, password_hash, is_active, created_at
    `

    if (!isActive) {
      await client.sql`DELETE FROM admin_sessions WHERE admin_id = ${adminId}`
    }

    return mapAdminUser(result.rows[0])
  })
}
