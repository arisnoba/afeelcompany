import { del } from '@vercel/blob'

import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'
import { uploadPublicImage } from '@/lib/blob'
import type { ClientBrandAdminItem } from '@/types/client-brand'

interface ClientBrandRow {
  id: string
  name: string
  logo_url: string | null
  brand_url: string | null
  sort_order: number
  is_active: boolean
}

function normalizeBrandUrl(input: string | null): string | null {
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
    throw new Error('브랜드 URL은 http 또는 https 주소만 사용할 수 있습니다.')
  }

  return url.toString()
}

function mapBrandRow(row: ClientBrandRow): ClientBrandAdminItem {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    brandUrl: row.brand_url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  }
}

export async function PATCH(
  request: Request,
  ctx: RouteContext<'/api/client-brands/[id]'>
): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const { id } = await ctx.params
  const current = await sql<ClientBrandRow>`
    SELECT id, name, logo_url, brand_url, sort_order, is_active
    FROM client_brands
    WHERE id = ${id}
    LIMIT 1
  `

  const brand = current.rows[0]

  if (!brand) {
    return Response.json({ success: false, error: 'NOT_FOUND' }, { status: 404 })
  }

  const formData = await request.formData()
  const name = formData.get('name')?.toString().trim()
  const brandUrlRaw = formData.get('brandUrl')?.toString() ?? null
  const isActiveRaw = formData.get('isActive')?.toString()
  const file = formData.get('logo')

  if (!name || (file !== null && !(file instanceof File))) {
    return Response.json({ success: false, error: 'INVALID_PAYLOAD' }, { status: 400 })
  }

  if (isActiveRaw !== 'true' && isActiveRaw !== 'false') {
    return Response.json({ success: false, error: 'INVALID_PAYLOAD' }, { status: 400 })
  }

  try {
    const brandUrl = normalizeBrandUrl(brandUrlRaw)
    let logoUrl = brand.logo_url
    let previousLogoUrl: string | null = null

    if (file instanceof File && file.size > 0) {
      const uploaded = await uploadPublicImage(file, 'brands')
      logoUrl = uploaded.url
      previousLogoUrl = brand.logo_url
    }

    const result = await sql<ClientBrandRow>`
      UPDATE client_brands
      SET
        name = ${name},
        logo_url = ${logoUrl},
        brand_url = ${brandUrl},
        is_active = ${isActiveRaw === 'true'},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, name, logo_url, brand_url, sort_order, is_active
    `

    await sql`
      UPDATE portfolio_items
      SET
        brand_name = ${name},
        updated_at = NOW()
      WHERE client_brand_id = ${id}
    `

    if (previousLogoUrl) {
      await del(previousLogoUrl)
    }

    return Response.json({
      success: true,
      data: mapBrandRow(result.rows[0]),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'BRAND_UPDATE_FAILED'
    const status = message.includes('브랜드 URL') ? 400 : 500
    return Response.json({ success: false, error: message }, { status })
  }
}

export async function DELETE(
  _request: Request,
  ctx: RouteContext<'/api/client-brands/[id]'>
): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const { id } = await ctx.params
  const current = await sql<{ logo_url: string | null }>`
    SELECT logo_url
    FROM client_brands
    WHERE id = ${id}
    LIMIT 1
  `

  const brand = current.rows[0]

  if (!brand) {
    return Response.json({ success: false, error: 'NOT_FOUND' }, { status: 404 })
  }

  const linkedPortfolioCount = await sql<{ count: string }>`
    SELECT COUNT(*)::text AS count
    FROM portfolio_items
    WHERE client_brand_id = ${id}
  `

  if (Number(linkedPortfolioCount.rows[0]?.count ?? '0') > 0) {
    return Response.json(
      {
        success: false,
        error: '파트너에 연결된 포트폴리오가 있어 삭제할 수 없습니다.',
      },
      { status: 409 }
    )
  }

  if (brand.logo_url) {
    await del(brand.logo_url)
  }

  await sql`
    DELETE FROM client_brands
    WHERE id = ${id}
  `

  return Response.json({ success: true })
}
