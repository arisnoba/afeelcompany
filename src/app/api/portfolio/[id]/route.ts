import { del } from '@vercel/blob'

import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'
import { uploadPublicImage } from '@/lib/blob'
import {
  getClientBrandOptionById,
  resolvePortfolioHoverImageUrl,
} from '@/lib/portfolio-brand'
import {
  isSerializedPortfolioCategories,
  type PortfolioAdminItem,
} from '@/types/portfolio'

function toBoolean(value: FormDataEntryValue | null): boolean | null {
  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return null
}

interface PortfolioMutationRow {
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

export async function PATCH(
  request: Request,
  ctx: RouteContext<'/api/portfolio/[id]'>
): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const { id } = await ctx.params
  const current = await sql<{
    id: string
    client_brand_id: string | null
    thumbnail_url: string | null
  }>`
    SELECT id, client_brand_id, thumbnail_url
    FROM portfolio_items
    WHERE id = ${id}
    LIMIT 1
  `

  const existingItem = current.rows[0]

  if (!existingItem) {
    return Response.json({ success: false, error: 'NOT_FOUND' }, { status: 404 })
  }

  const formData = await request.formData()
  const title = formData.get('title')?.toString().trim()
  const clientBrandId = formData.get('clientBrandId')?.toString().trim() || null
  const brandName = formData.get('brandName')?.toString().trim() || null
  const celebrityName = formData.get('celebrityName')?.toString().trim() || null
  const category = formData.get('category')?.toString().trim()
  const instagramUrlRaw = formData.get('instagramUrl')?.toString() ?? null
  const showOnWeb = toBoolean(formData.get('showOnWeb'))
  const showOnPdf = toBoolean(formData.get('showOnPdf'))
  const sortOrderRaw = formData.get('sortOrder')?.toString()
  const hoverFile = formData.get('hoverFile')
  const sortOrder = sortOrderRaw ? Number.parseInt(sortOrderRaw, 10) : Number.NaN

  if (
    !title ||
    !category ||
    !isSerializedPortfolioCategories(category) ||
    typeof showOnWeb !== 'boolean' ||
    typeof showOnPdf !== 'boolean' ||
    !Number.isFinite(sortOrder) ||
    (hoverFile !== null && !(hoverFile instanceof File))
  ) {
    return Response.json({ success: false, error: 'INVALID_PAYLOAD' }, { status: 400 })
  }

  try {
    let resolvedBrandName = brandName
    let resolvedClientBrandId: string | null = null
    let managedBrandLogoUrl: string | null = null

    if (clientBrandId) {
      const selectedBrand = await getClientBrandOptionById(clientBrandId)

      if (!selectedBrand || !selectedBrand.isActive) {
        return Response.json(
          { success: false, error: 'INVALID_CLIENT_BRAND' },
          { status: 400 }
        )
      }

      if (!selectedBrand.logoUrl) {
        return Response.json(
          {
            success: false,
            error: '선택한 파트너에 로고가 없습니다. 파트너 관리에서 로고를 먼저 등록해 주세요.',
          },
          { status: 400 }
        )
      }

      resolvedBrandName = selectedBrand.name
      resolvedClientBrandId = selectedBrand.id
      managedBrandLogoUrl = selectedBrand.logoUrl
    } else {
      if (!resolvedBrandName) {
        return Response.json(
          { success: false, error: 'EXCEPTION_BRAND_NAME_REQUIRED' },
          { status: 400 }
        )
      }

      const hasExistingCustomHover =
        !existingItem.client_brand_id && Boolean(existingItem.thumbnail_url)
      const hasNewHoverFile = hoverFile instanceof File && hoverFile.size > 0

      if (!hasExistingCustomHover && !hasNewHoverFile) {
        return Response.json(
          { success: false, error: 'EXCEPTION_BRAND_REQUIRES_HOVER_IMAGE' },
          { status: 400 }
        )
      }
    }

    const instagramUrl = normalizePortfolioUrl(instagramUrlRaw)
    let nextThumbnailUrl = existingItem.thumbnail_url
    let previousThumbnailUrlToDelete: string | null = null

    if (hoverFile instanceof File && hoverFile.size > 0) {
      const uploadedHover = await uploadPublicImage(hoverFile, 'portfolio')
      nextThumbnailUrl = uploadedHover.url
      previousThumbnailUrlToDelete = existingItem.thumbnail_url
    } else if (managedBrandLogoUrl) {
      nextThumbnailUrl = null
      previousThumbnailUrlToDelete = existingItem.thumbnail_url
    }

    const result = await sql<PortfolioMutationRow>`
      UPDATE portfolio_items
      SET
        title = ${title},
        client_brand_id = ${resolvedClientBrandId},
        brand_name = ${resolvedBrandName},
        celebrity_name = ${celebrityName},
        category = ${category},
        instagram_url = ${instagramUrl},
        thumbnail_url = ${nextThumbnailUrl},
        show_on_web = ${showOnWeb},
        show_on_pdf = ${showOnPdf},
        sort_order = ${sortOrder},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING
        id,
        title,
        client_brand_id,
        ${managedBrandLogoUrl}::text AS client_brand_logo_url,
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
      return Response.json({ success: false, error: 'UPDATE_FAILED' }, { status: 500 })
    }

    if (previousThumbnailUrlToDelete && previousThumbnailUrlToDelete !== nextThumbnailUrl) {
      await del(previousThumbnailUrlToDelete)
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
