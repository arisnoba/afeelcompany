import { createAdminUser, getAdminSession, listAdminUsers } from '@/lib/auth'
import type { AdminUserMutationErrorCode } from '@/types/admin'

export async function GET(): Promise<Response> {
  const session = await getAdminSession()

  if (!session) {
    return Response.json(
      { success: false, error: 'UNAUTHORIZED' satisfies AdminUserMutationErrorCode },
      { status: 401 }
    )
  }

  return Response.json({
    success: true,
    admins: await listAdminUsers(),
    currentAdminId: session.adminId,
  })
}

export async function POST(request: Request): Promise<Response> {
  const session = await getAdminSession()

  if (!session) {
    return Response.json(
      { success: false, error: 'UNAUTHORIZED' satisfies AdminUserMutationErrorCode },
      { status: 401 }
    )
  }

  const body = (await request.json()) as {
    email?: string
    password?: string
  }

  try {
    const admin = await createAdminUser(body.email ?? '', body.password ?? '')
    return Response.json({ success: true, admin })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? (error.message as AdminUserMutationErrorCode)
            : 'ADMIN_NOT_FOUND',
      },
      { status: 400 }
    )
  }
}
