import { sql } from '@/lib/db'
import { InstagramQueueTable } from '@/components/admin/InstagramQueueTable'
import { AdminPageIntro } from '@/components/admin/AdminPageIntro'

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

interface PortfolioOptionRow {
  id: string
  title: string
  brand_name: string
}

export default async function AdminInstagramPage() {
  const [queueResult, portfolioResult] = await Promise.all([
    sql<QueueRow>`
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
    `,
    sql<PortfolioOptionRow>`
      SELECT id, title, brand_name
      FROM portfolio_items
      ORDER BY sort_order ASC, created_at DESC
    `,
  ])

  return (
    <div className="grid gap-6">
      <AdminPageIntro
        eyebrow="인스타 큐"
        title="인스타그램 큐 관리"
        description="포트폴리오 이미지를 큐로 연결하고 수동 publish 버튼으로 실제 게시 시도를 기록합니다."
        aside={
          <div>캡션과 연결 자산을 확인한 뒤 publish를 실행하세요.</div>
        }
      />

      <InstagramQueueTable
        initialQueue={queueResult.rows.map((row) => ({
          id: row.id,
          portfolioItemId: row.portfolio_item_id,
          caption: row.caption ?? '',
          status: row.status,
          publishedAt: row.published_at,
          externalPostId: row.external_post_id,
          title: row.title,
          imageUrl: row.image_url,
        }))}
        portfolioOptions={portfolioResult.rows.map((row) => ({
          id: row.id,
          label: `${row.brand_name} / ${row.title}`,
        }))}
      />
    </div>
  )
}
