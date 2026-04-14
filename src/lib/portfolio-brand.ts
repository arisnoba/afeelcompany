import { sql } from '@/lib/db'
import type { ClientBrandOption } from '@/types/client-brand'

interface ClientBrandLookupRow {
  id: string
  name: string
  logo_url: string | null
  is_active: boolean
}

function mapClientBrandOption(row: ClientBrandLookupRow): ClientBrandOption {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    isActive: row.is_active,
  }
}

export async function getClientBrandOptionById(
  id: string
): Promise<ClientBrandOption | null> {
  const result = await sql<ClientBrandLookupRow>`
    SELECT id, name, logo_url, is_active
    FROM client_brands
    WHERE id = ${id}
    LIMIT 1
  `

  return result.rows[0] ? mapClientBrandOption(result.rows[0]) : null
}

export function resolvePortfolioHoverImageUrl(
  clientBrandLogoUrl: string | null,
  thumbnailUrl: string | null
) {
  return clientBrandLogoUrl ?? thumbnailUrl
}
