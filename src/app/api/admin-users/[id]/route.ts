import { getAdminSession, setAdminUserActive } from '@/lib/auth'
import { readJsonBody } from '@/lib/read-json-body'
import type { AdminUserMutationErrorCode } from '@/types/admin'

export async function PATCH(
  request: Request,
  context: RouteContext<'/api/admin-users/[id]'>
): Promise<Response> {
  const session = await getAdminSession()

  if (!session) {
    return Response.json(
      { success: false, error: 'UNAUTHORIZED' satisfies AdminUserMutationErrorCode },
      { status: 401 }
    )
  }

  const { id } = await context.params
  const body = await readJsonBody(request, 1024) as { isActive?: unknown } | null

  if (typeof body?.isActive !== 'boolean') {
    return Response.json(
      { success: false, error: 'ADMIN_NOT_FOUND' satisfies AdminUserMutationErrorCode },
      { status: 400 }
    )
  }

  try {
    const admin = await setAdminUserActive(id, body.isActive)
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
