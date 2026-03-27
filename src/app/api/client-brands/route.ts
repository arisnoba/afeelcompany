import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'
import { uploadPublicImage } from '@/lib/blob'

interface ClientBrandRow {
  id: string
  name: string
  logo_url: string | null
  sort_order: number
  is_active: boolean
}

function mapBrandRow(row: ClientBrandRow) {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  }
}

export async function GET(): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const result = await sql<ClientBrandRow>`
    SELECT id, name, logo_url, sort_order, is_active
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
  const sortOrderRaw = formData.get('sortOrder')?.toString()
  const isActive = formData.get('isActive')?.toString() === 'true'
  const file = formData.get('logo')

  if (!name || !sortOrderRaw || !(file instanceof File)) {
    return Response.json({ success: false, error: 'INVALID_FORM_DATA' }, { status: 400 })
  }

  const sortOrder = Number(sortOrderRaw)

  if (!Number.isFinite(sortOrder)) {
    return Response.json({ success: false, error: 'INVALID_SORT_ORDER' }, { status: 400 })
  }

  try {
    const uploaded = await uploadPublicImage(file, 'brands')
    const result = await sql<ClientBrandRow>`
      INSERT INTO client_brands (name, logo_url, sort_order, is_active)
      VALUES (${name}, ${uploaded.url}, ${sortOrder}, ${isActive})
      RETURNING id, name, logo_url, sort_order, is_active
    `

    return Response.json({
      success: true,
      data: mapBrandRow(result.rows[0]),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'BRAND_CREATE_FAILED'
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
