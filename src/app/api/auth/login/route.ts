import {
  authenticateAdmin,
  createAdminSession,
  isAdminBootstrapConfigured,
  MAX_ADMIN_EMAIL_LENGTH,
  MAX_ADMIN_PASSWORD_LENGTH,
} from '@/lib/auth'
import { readJsonBody } from '@/lib/read-json-body'
import { requestBudgetBucket, requestClient, reserveRequestBudget } from '@/lib/request-budget'
import type { AdminLoginErrorCode } from '@/types/admin'

let activeLoginChecks = 0

function tooManyRequests(retryAfter: string) {
  return Response.json(
    { success: false, error: 'RATE_LIMITED' satisfies AdminLoginErrorCode },
    { status: 429, headers: { 'Retry-After': retryAfter } },
  )
}

export async function POST(request: Request): Promise<Response> {
  const body = await readJsonBody(request, 32_768) as { email?: unknown; password?: unknown } | null
  if (typeof body?.email !== 'string' || !body.email.trim() || body.email.trim().length > MAX_ADMIN_EMAIL_LENGTH ||
      typeof body.password !== 'string' || !body.password || body.password.length > MAX_ADMIN_PASSWORD_LENGTH) {
    return Response.json(
      { success: false, error: 'INVALID_CREDENTIALS' satisfies AdminLoginErrorCode },
      { status: 401 }
    )
  }

  if (activeLoginChecks >= 4) return tooManyRequests('2')
  activeLoginChecks++
  try {
    const client = requestClient(request)
    const bucket = requestBudgetBucket(client ? `ip:${client}` : `email:${body.email.trim().toLowerCase()}`)
    if (!(await reserveRequestBudget(`admin-login:${bucket}`, 10, 60))) {
      return tooManyRequests('60')
    }
    return await verifyCredentials(body.email, body.password)
  } finally {
    activeLoginChecks--
  }
}

async function verifyCredentials(email: string, password: string): Promise<Response> {
  if (!(await isAdminBootstrapConfigured())) {
    return Response.json(
      {
        success: false,
        error: 'BOOTSTRAP_PASSWORD_NOT_CONFIGURED' satisfies AdminLoginErrorCode,
      },
      { status: 500 },
    )
  }

  const session = await authenticateAdmin(email, password)
  if (!session) {
    return Response.json(
      { success: false, error: 'INVALID_CREDENTIALS' satisfies AdminLoginErrorCode },
      { status: 401 },
    )
  }

  try {
    if (!(await createAdminSession(session.adminId, session.sessionVersion))) {
      return Response.json({ success: false, error: 'INVALID_CREDENTIALS' }, { status: 401 })
    }
  } catch {
    return Response.json(
      {
        success: false,
        error: 'SESSION_CREATION_FAILED' satisfies AdminLoginErrorCode,
      },
      { status: 500 }
    )
  }

  return Response.json({ success: true })
}
