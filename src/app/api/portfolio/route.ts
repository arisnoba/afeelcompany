import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'
import type { PortfolioAdminItem } from '@/types/portfolio'

interface PortfolioListRow {
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

function mapPortfolioRow(row: PortfolioListRow): PortfolioAdminItem {
  return {
    id: row.id,
    title: row.title,
    brandName: row.brand_name,
    celebrityName: row.celebrity_name,
    category: row.category,
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url,
    hoverImageUrl: row.thumbnail_url,
    showOnWeb: row.show_on_web,
    showOnPdf: row.show_on_pdf,
    sortOrder: row.sort_order,
  }
}

export async function GET(): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const result = await sql<PortfolioListRow>`
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

  return Response.json({
    success: true,
    data: result.rows.map(mapPortfolioRow),
  })
}
