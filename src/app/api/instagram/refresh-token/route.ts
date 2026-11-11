import { isAdminAuthenticated } from '@/lib/auth'
import { refreshToken } from '@/lib/instagram'

/** Manually refresh the configured Instagram token and report its expiry. */
export async function POST(): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) {
    return Response.json(
      { success: false, error: 'INSTAGRAM_ACCESS_TOKEN environment variable is not set' },
      { status: 500 }
    )
  }

  try {
    const { access_token: refreshedToken, expires_in: expiresIn } = await refreshToken(token)
    if (!Number.isSafeInteger(expiresIn) || expiresIn <= 0) {
      return Response.json({ success: false, error: 'TOKEN_REFRESH_FAILED' }, { status: 500 })
    }

    if (refreshedToken !== token) {
      return Response.json(
        { success: false, error: 'TOKEN_REPLACEMENT_REQUIRED' },
        { status: 409 }
      )
    }

    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

    return Response.json({
      success: true,
      data: { expires_in: expiresIn, expires_at: expiresAt },
    })
  } catch {
    return Response.json({ success: false, error: 'TOKEN_REFRESH_FAILED' }, { status: 500 })
  }
}
