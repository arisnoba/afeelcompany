import Link from 'next/link'

import { sql } from '@/lib/db'
import { PortfolioTable } from '@/components/admin/PortfolioTable'
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
      <section className="rounded-[32px] bg-white p-8 shadow-sm ring-1 ring-stone-950/8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
              Portfolio
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950">
              포트폴리오 정리
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
              업로드된 항목을 수정하고, 웹/PDF 노출 여부와 정렬 순서를 운영 기준에 맞게 조정합니다.
            </p>
          </div>

          <Link
            href="/admin/upload"
            className="inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            새 항목 업로드
          </Link>
        </div>
      </section>

      <PortfolioTable initialItems={result.rows.map(mapPortfolioRow)} />
    </div>
  )
}
