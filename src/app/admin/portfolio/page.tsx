import Link from 'next/link'

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
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url,
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
        description="업로드된 항목을 수정하고 웹/PDF 노출 여부와 정렬 순서를 운영 기준에 맞게 조정합니다."
        action={
          <Link
            href="/admin/upload"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            새 항목 업로드
          </Link>
        }
        aside={
          <div>`showOnWeb`, `showOnPdf`, `sortOrder`는 DB 필드와 1:1로 연결됩니다.</div>
        }
      />

      <PortfolioTable initialItems={result.rows.map(mapPortfolioRow)} />
    </div>
  )
}
