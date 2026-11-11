import { createAdminUser, getAdminSession, listAdminUsers } from '@/lib/auth'
import { readJsonBody } from '@/lib/read-json-body'
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

  const body = await readJsonBody(request, 32_768) as { email?: unknown; password?: unknown } | null

  try {
    const admin = await createAdminUser(
      typeof body?.email === 'string' ? body.email : '',
      typeof body?.password === 'string' ? body.password : '',
    )
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
      { status: error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 400 }
    )
  }
}
