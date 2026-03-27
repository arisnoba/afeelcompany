import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

interface ReorderRequestBody {
  items?: Array<{
    id: string
    sortOrder: number
  }>
}

export async function POST(request: Request): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const body = (await request.json()) as ReorderRequestBody

  if (!body.items || body.items.length === 0) {
    return Response.json({ success: false, error: 'INVALID_PAYLOAD' }, { status: 400 })
  }

  await Promise.all(
    body.items.map((item) =>
      sql`
        UPDATE portfolio_items
        SET sort_order = ${item.sortOrder}, updated_at = NOW()
        WHERE id = ${item.id}
      `
    )
  )

  return Response.json({ success: true })
}
