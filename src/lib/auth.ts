import { createHmac, timingSafeEqual } from 'node:crypto'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const ADMIN_SESSION_COOKIE = 'afeel_admin_session'

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7
const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000

function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD ?? null
}

function signSession(expiresAt: string, password: string): string {
  return createHmac('sha256', password).update(expiresAt).digest('hex')
}

function isEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function verifyAdminPassword(input: string): boolean {
  const password = getAdminPassword()

  if (!password) {
    return false
  }

  return isEqual(input, password)
}

export async function createAdminSession(): Promise<void> {
  const password = getAdminPassword()

  if (!password) {
    throw new Error('ADMIN_PASSWORD is not configured')
  }

  const expiresAt = String(Date.now() + SESSION_MAX_AGE_MS)
  const signature = signSession(expiresAt, password)
  const cookieStore = await cookies()

  cookieStore.set(ADMIN_SESSION_COOKIE, `${expiresAt}.${signature}`, {
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

export async function isAdminAuthenticated(): Promise<boolean> {
  const password = getAdminPassword()

  if (!password) {
    return false
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

  if (!token) {
    return false
  }

  const [expiresAt, signature] = token.split('.')

  if (!expiresAt || !signature) {
    return false
  }

  const parsedExpiresAt = Number(expiresAt)

  if (!Number.isFinite(parsedExpiresAt) || parsedExpiresAt <= Date.now()) {
    return false
  }

  const expectedSignature = signSession(expiresAt, password)
  return isEqual(signature, expectedSignature)
}

export async function requireAdminSession(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }
}
