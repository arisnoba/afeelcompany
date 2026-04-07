import { sql } from '@/lib/db'
import { PortfolioTable } from '@/components/admin/PortfolioTable'
import { AdminPageIntro } from '@/components/admin/AdminPageIntro'
import type { PortfolioAdminItem } from '@/types/portfolio'

interface PortfolioPageRow {
  id: string
  title: string
  brand_name: string
  celebrity_name: string | null
  category: string
  instagram_url: string | null
  image_url: string
  thumbnail_url: string | null
  show_on_web: boolean
  show_on_pdf: boolean
  sort_order: number
}

function mapPortfolioRow(row: PortfolioPageRow): PortfolioAdminItem {
  return {
    id: row.id,
    title: row.title,
    brandName: row.brand_name,
    celebrityName: row.celebrity_name,
    category: row.category,
    instagramUrl: row.instagram_url,
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url,
    hoverImageUrl: row.thumbnail_url,
    showOnWeb: row.show_on_web,
    showOnPdf: row.show_on_pdf,
    sortOrder: row.sort_order,
  }
}

export default async function AdminPortfolioPage() {
  const result = await sql<PortfolioPageRow>`
    SELECT
      id,
      title,
      brand_name,
      celebrity_name,
      category,
      instagram_url,
      image_url,
      thumbnail_url,
      show_on_web,
      show_on_pdf,
      sort_order
    FROM portfolio_items
    ORDER BY sort_order ASC, created_at DESC
  `

  return (
    <div className="grid gap-6">
      <AdminPageIntro
        eyebrow="포트폴리오"
        title="포트폴리오 관리"
        description="목록에서 항목을 선택하면 우측 패널이 열리고, 새 등록부터 수정까지 같은 흐름 안에서 처리할 수 있습니다."
        aside={
          <div>
            `showOnWeb`, `showOnPdf`, `sortOrder`는 DB 필드와 1:1로 연결되며,
            정렬 저장 전까지는 목록에서만 임시 순서가 반영됩니다.
          </div>
        }
      />

      <PortfolioTable initialItems={result.rows.map(mapPortfolioRow)} />
    </div>
  )
}
