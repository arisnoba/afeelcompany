import { createAdminSession, verifyAdminPassword } from '@/lib/auth'

export async function POST(request: Request): Promise<Response> {
  const password = process.env.ADMIN_PASSWORD

  if (!password) {
    return Response.json(
      { success: false, error: 'PASSWORD_NOT_CONFIGURED' },
      { status: 500 }
    )
  }

  const body = (await request.json()) as { password?: string }

  if (!body.password || !verifyAdminPassword(body.password)) {
    return Response.json(
      { success: false, error: 'INVALID_PASSWORD' },
      { status: 401 }
    )
  }

  await createAdminSession()
  return Response.json({ success: true })
}
