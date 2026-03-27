import { del } from '@vercel/blob'

import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

interface BrandPatchPayload {
  name?: string
  sortOrder?: number
  isActive?: boolean
}

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

export async function PATCH(
  request: Request,
  ctx: RouteContext<'/api/client-brands/[id]'>
): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const { id } = await ctx.params
  const body = (await request.json()) as BrandPatchPayload

  if (
    typeof body.name !== 'string' ||
    typeof body.sortOrder !== 'number' ||
    typeof body.isActive !== 'boolean'
  ) {
    return Response.json({ success: false, error: 'INVALID_PAYLOAD' }, { status: 400 })
  }

  const result = await sql<ClientBrandRow>`
    UPDATE client_brands
    SET
      name = ${body.name.trim()},
      sort_order = ${body.sortOrder},
      is_active = ${body.isActive}
    WHERE id = ${id}
    RETURNING id, name, logo_url, sort_order, is_active
  `

  if (!result.rows[0]) {
    return Response.json({ success: false, error: 'NOT_FOUND' }, { status: 404 })
  }

  return Response.json({
    success: true,
    data: mapBrandRow(result.rows[0]),
  })
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

  if (brand.logo_url) {
    await del(brand.logo_url)
  }

  await sql`
    DELETE FROM client_brands
    WHERE id = ${id}
  `

  return Response.json({ success: true })
}
