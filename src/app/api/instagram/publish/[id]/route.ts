import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'
import { createMediaContainer, publishMediaContainer } from '@/lib/instagram'

interface QueuePublishRow {
  id: string
  caption: string | null
  image_url: string | null
}

export async function POST(
  _request: Request,
  ctx: RouteContext<'/api/instagram/publish/[id]'>
): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const { id } = await ctx.params
  const queueResult = await sql<QueuePublishRow>`
    SELECT iq.id, iq.caption, pi.image_url
    FROM instagram_queue iq
    LEFT JOIN portfolio_items pi
      ON pi.id = iq.portfolio_item_id
    WHERE iq.id = ${id}
    LIMIT 1
  `

  const queueItem = queueResult.rows[0]

  if (!queueItem || !queueItem.image_url) {
    return Response.json({ success: false, error: 'QUEUE_ITEM_NOT_FOUND' }, { status: 404 })
  }

  await sql`
    UPDATE instagram_queue
    SET status = 'pending', updated_at = NOW()
    WHERE id = ${id}
  `

  try {
    const container = await createMediaContainer(queueItem.image_url, queueItem.caption ?? '')
    const published = await publishMediaContainer(container.id)

    await sql`
      UPDATE instagram_queue
      SET
        status = 'published',
        published_at = NOW(),
        external_post_id = ${published.id},
        updated_at = NOW()
      WHERE id = ${id}
    `

    return Response.json({
      success: true,
      data: {
        externalPostId: published.id,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'PUBLISH_FAILED'

    await sql`
      UPDATE instagram_queue
      SET
        status = 'failed',
        updated_at = NOW()
      WHERE id = ${id}
    `

    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
