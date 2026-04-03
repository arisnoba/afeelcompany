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

export async function GET(): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const result = await sql<ClientBrandRow>`
    SELECT id, name, logo_url, brand_url, sort_order, is_active
    FROM client_brands
    ORDER BY sort_order ASC, created_at ASC
  `

  return Response.json({
    success: true,
    data: result.rows.map(mapBrandRow),
  })
}

export async function POST(request: Request): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const formData = await request.formData()
  const name = formData.get('name')?.toString().trim()
  const brandUrlRaw = formData.get('brandUrl')?.toString() ?? null
  const isActive = formData.get('isActive')?.toString() === 'true'
  const file = formData.get('logo')

  if (!name || !(file instanceof File)) {
    return Response.json({ success: false, error: 'INVALID_FORM_DATA' }, { status: 400 })
  }

  try {
    const brandUrl = normalizeBrandUrl(brandUrlRaw)
    const uploaded = await uploadPublicImage(file, 'brands')
    const result = await sql<ClientBrandRow>`
      INSERT INTO client_brands (name, logo_url, brand_url, sort_order, is_active)
      VALUES (
        ${name},
        ${uploaded.url},
        ${brandUrl},
        (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM client_brands),
        ${isActive}
      )
      RETURNING id, name, logo_url, brand_url, sort_order, is_active
    `

    return Response.json({
      success: true,
      data: mapBrandRow(result.rows[0]),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'BRAND_CREATE_FAILED'
    const status = message.includes('브랜드 URL') ? 400 : 500
    return Response.json({ success: false, error: message }, { status })
  }
}
