import { clearAdminSession } from '@/lib/auth'

export async function POST(): Promise<Response> {
  await clearAdminSession()
  return Response.json({ success: true })
}
