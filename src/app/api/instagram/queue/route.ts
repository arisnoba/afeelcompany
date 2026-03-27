import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

interface QueueRow {
  id: string
  portfolio_item_id: string | null
  caption: string | null
  status: 'draft' | 'pending' | 'published' | 'failed'
  published_at: string | null
  external_post_id: string | null
  title: string | null
  image_url: string | null
}

function mapQueueRow(row: QueueRow) {
  return {
    id: row.id,
    portfolioItemId: row.portfolio_item_id,
    caption: row.caption ?? '',
    status: row.status,
    publishedAt: row.published_at,
    externalPostId: row.external_post_id,
    title: row.title,
    imageUrl: row.image_url,
  }
}

export async function GET(): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const result = await sql<QueueRow>`
    SELECT
      iq.id,
      iq.portfolio_item_id,
      iq.caption,
      iq.status,
      iq.published_at,
      iq.external_post_id,
      pi.title,
      pi.image_url
    FROM instagram_queue iq
    LEFT JOIN portfolio_items pi
      ON pi.id = iq.portfolio_item_id
    ORDER BY iq.created_at DESC
  `

  return Response.json({
    success: true,
    data: result.rows.map(mapQueueRow),
  })
}

export async function POST(request: Request): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const body = (await request.json()) as {
    portfolioItemId?: string
    caption?: string
  }

  if (!body.portfolioItemId || typeof body.caption !== 'string') {
    return Response.json({ success: false, error: 'INVALID_PAYLOAD' }, { status: 400 })
  }

  const existing = await sql<{ id: string }>`
    SELECT id
    FROM instagram_queue
    WHERE portfolio_item_id = ${body.portfolioItemId}
    ORDER BY created_at DESC
    LIMIT 1
  `

  if (existing.rows[0]) {
    const updated = await sql<QueueRow>`
      UPDATE instagram_queue
      SET
        caption = ${body.caption},
        status = 'draft',
        published_at = NULL,
        external_post_id = NULL,
        updated_at = NOW()
      WHERE id = ${existing.rows[0].id}
      RETURNING
        id,
        portfolio_item_id,
        caption,
        status,
        published_at,
        external_post_id,
        NULL::TEXT AS title,
        NULL::TEXT AS image_url
    `

    return Response.json({
      success: true,
      data: mapQueueRow(updated.rows[0]),
    })
  }

  const inserted = await sql<QueueRow>`
    INSERT INTO instagram_queue (portfolio_item_id, caption, status)
    VALUES (${body.portfolioItemId}, ${body.caption}, 'draft')
    RETURNING
      id,
      portfolio_item_id,
      caption,
      status,
      published_at,
      external_post_id,
      NULL::TEXT AS title,
      NULL::TEXT AS image_url
  `

  return Response.json({
    success: true,
    data: mapQueueRow(inserted.rows[0]),
  })
}
