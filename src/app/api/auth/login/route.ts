import {
  authenticateAdmin,
  createAdminSession,
  isAdminBootstrapConfigured,
} from '@/lib/auth'
import type { AdminLoginErrorCode } from '@/types/admin'

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as {
    email?: string
    password?: string
  }

  if (!body.email || !body.password) {
    return Response.json(
      { success: false, error: 'INVALID_CREDENTIALS' satisfies AdminLoginErrorCode },
      { status: 401 }
    )
  }

  if (!(await isAdminBootstrapConfigured())) {
    return Response.json(
      {
        success: false,
        error: 'BOOTSTRAP_PASSWORD_NOT_CONFIGURED' satisfies AdminLoginErrorCode,
      },
      { status: 500 }
    )
  }

  const session = await authenticateAdmin(body.email, body.password)

  if (!session) {
    return Response.json(
      { success: false, error: 'INVALID_CREDENTIALS' satisfies AdminLoginErrorCode },
      { status: 401 }
    )
  }

  try {
    await createAdminSession(session.adminId)
  } catch {
    return Response.json(
      {
        success: false,
        error: 'SESSION_SECRET_NOT_CONFIGURED' satisfies AdminLoginErrorCode,
      },
      { status: 500 }
    )
  }

  return Response.json({ success: true })
}
