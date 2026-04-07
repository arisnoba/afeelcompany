import { del } from '@vercel/blob'

import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'
import {
  isSerializedPortfolioCategories,
  type PortfolioAdminItem,
} from '@/types/portfolio'

interface PortfolioMutationBody {
  title?: string
  brandName?: string
  celebrityName?: string | null
  category?: string
  instagramUrl?: string | null
  showOnWeb?: boolean
  showOnPdf?: boolean
  sortOrder?: number
}

interface PortfolioMutationRow {
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

function normalizePortfolioUrl(input: string | null | undefined): string | null {
  if (!input) {
    return null
  }

  const trimmed = input.trim()

  if (!trimmed) {
    return null
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  const url = new URL(withProtocol)

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('인스타그램 URL은 http 또는 https 주소만 사용할 수 있습니다.')
  }

  if (!(url.hostname === 'instagram.com' || url.hostname.endsWith('.instagram.com'))) {
    throw new Error('인스타그램 게시물 URL만 사용할 수 있습니다.')
  }

  return url.toString()
}

function mapPortfolioRow(row: PortfolioMutationRow): PortfolioAdminItem {
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

export async function PATCH(
  request: Request,
  ctx: RouteContext<'/api/portfolio/[id]'>
): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const { id } = await ctx.params
  const body = (await request.json()) as PortfolioMutationBody

  if (
    !body.title ||
    !body.brandName ||
    !body.category ||
    !isSerializedPortfolioCategories(body.category) ||
    typeof body.showOnWeb !== 'boolean' ||
    typeof body.showOnPdf !== 'boolean' ||
    typeof body.sortOrder !== 'number'
  ) {
    return Response.json({ success: false, error: 'INVALID_PAYLOAD' }, { status: 400 })
  }

  try {
    const instagramUrl = normalizePortfolioUrl(body.instagramUrl)
    const result = await sql<PortfolioMutationRow>`
      UPDATE portfolio_items
      SET
        title = ${body.title.trim()},
        brand_name = ${body.brandName.trim()},
        celebrity_name = ${body.celebrityName?.trim() || null},
        category = ${body.category.trim()},
        instagram_url = ${instagramUrl},
        show_on_web = ${body.showOnWeb},
        show_on_pdf = ${body.showOnPdf},
        sort_order = ${body.sortOrder},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING
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
    `

    if (!result.rows[0]) {
      return Response.json({ success: false, error: 'NOT_FOUND' }, { status: 404 })
    }

    return Response.json({
      success: true,
      data: mapPortfolioRow(result.rows[0]),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UPDATE_FAILED'
    const status = message.includes('인스타그램') ? 400 : 500
    return Response.json({ success: false, error: message }, { status })
  }
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<'/api/portfolio/[id]'>
): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const { id } = await ctx.params
  const current = await sql<{ image_url: string; thumbnail_url: string | null }>`
    SELECT image_url, thumbnail_url
    FROM portfolio_items
    WHERE id = ${id}
    LIMIT 1
  `

  const row = current.rows[0]

  if (!row) {
    return Response.json({ success: false, error: 'NOT_FOUND' }, { status: 404 })
  }

  const pathsToDelete = Array.from(
    new Set([row.image_url, row.thumbnail_url].filter((value): value is string => Boolean(value)))
  )

  if (pathsToDelete.length > 0) {
    await del(pathsToDelete)
  }

  await sql`
    DELETE FROM portfolio_items
    WHERE id = ${id}
  `

  return Response.json({ success: true })
}
