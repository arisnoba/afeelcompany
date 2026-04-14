import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'
import { resolvePortfolioHoverImageUrl } from '@/lib/portfolio-brand'
import type { PortfolioAdminItem } from '@/types/portfolio'

interface PortfolioListRow {
  id: string
  title: string
  client_brand_id: string | null
  client_brand_logo_url: string | null
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

function mapPortfolioRow(row: PortfolioListRow): PortfolioAdminItem {
  return {
    id: row.id,
    title: row.title,
    clientBrandId: row.client_brand_id,
    clientBrandLogoUrl: row.client_brand_logo_url,
    brandName: row.brand_name,
    celebrityName: row.celebrity_name,
    category: row.category,
    instagramUrl: row.instagram_url,
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url,
    hoverImageUrl: resolvePortfolioHoverImageUrl(
      row.client_brand_logo_url,
      row.thumbnail_url
    ),
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
      p.id,
      p.title,
      p.client_brand_id,
      cb.logo_url AS client_brand_logo_url,
      p.brand_name,
      p.celebrity_name,
      p.category,
      p.instagram_url,
      p.image_url,
      p.thumbnail_url,
      p.show_on_web,
      p.show_on_pdf,
      p.sort_order
    FROM portfolio_items AS p
    LEFT JOIN client_brands AS cb
      ON cb.id = p.client_brand_id
    ORDER BY p.sort_order ASC, p.created_at DESC
  `

  return Response.json({
    success: true,
    data: result.rows.map(mapPortfolioRow),
  })
}
