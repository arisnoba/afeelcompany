import { buildBrandLogoUrlMap, findBrandLogoUrl, getBrandsWithLogos } from '@/lib/client-brands'
import { resolvePublicAboutCopy } from '@/lib/company-copy'
import { sql } from '@/lib/db'
import { resolvePortfolioHoverImageUrl } from '@/lib/portfolio-brand'
import type { PdfClientBrand, PdfDocument, PdfPortfolioItem } from '@/types/pdf'

import { pdfFixtureDocument } from './pdf-fixtures'

const SECTION_ORDER: PdfDocument['sectionOrder'] = ['cover', 'about', 'work', 'client', 'contact']

interface CompanyProfileRow {
  about_text: string | null
  contact_email: string | null
  contact_phone: string | null
  address: string | null
  pdf_sections: unknown
}

interface PortfolioItemRow {
  id: string
  title: string
  client_brand_id: string | null
  client_brand_logo_url: string | null
  brand_name: string
  celebrity_name: string | null
  category: string
  image_url: string
  thumbnail_url: string | null
  show_on_pdf: boolean
  sort_order: number
}

interface ClientBrandRow {
  id: string
  name: string
  logo_url: string | null
  sort_order: number
}

function mapWorkItems(rows: PortfolioItemRow[], brandLogoUrlMap: Map<string, string>): PdfPortfolioItem[] {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    clientBrandId: row.client_brand_id,
    brandName: row.brand_name,
    brandLogoUrl:
      resolvePortfolioHoverImageUrl(
        row.client_brand_logo_url,
        row.thumbnail_url
      ) ?? findBrandLogoUrl(row.brand_name, brandLogoUrlMap),
    celebrityName: row.celebrity_name,
    category: row.category,
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url,
    showOnPdf: row.show_on_pdf,
    sortOrder: row.sort_order,
  }))
}

function mapClientBrands(rows: ClientBrandRow[]): PdfClientBrand[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    sortOrder: row.sort_order,
  }))
}

export async function getPdfDocument(): Promise<PdfDocument> {
  try {
    const [profileResult, workResult, brandResult] = await Promise.all([
      sql<CompanyProfileRow>`
        SELECT about_text, contact_email, contact_phone, address, pdf_sections
        FROM company_profile
        ORDER BY updated_at DESC
        LIMIT 1
      `,
      sql<PortfolioItemRow>`
        SELECT
          p.id,
          p.title,
          p.client_brand_id,
          cb.logo_url AS client_brand_logo_url,
          p.brand_name,
          p.celebrity_name,
          p.category,
          p.image_url,
          p.thumbnail_url,
          p.show_on_pdf,
          p.sort_order
        FROM portfolio_items AS p
        LEFT JOIN client_brands AS cb
          ON cb.id = p.client_brand_id
        WHERE show_on_pdf = true
        ORDER BY p.sort_order ASC, p.created_at DESC
        LIMIT 200
      `,
      sql<ClientBrandRow>`
        SELECT id, name, logo_url, sort_order
        FROM client_brands
        WHERE is_active = true
        ORDER BY sort_order ASC, created_at ASC
        LIMIT 200
      `,
    ])

    if (workResult.rows.length === 0) {
      return pdfFixtureDocument
    }

    const profile = profileResult.rows[0]
    // PDF에서는 로고 없는 브랜드도 이름으로 표시하므로 전체를 사용
    const allClientBrands = mapClientBrands(brandResult.rows)
    const brandLogoUrlMap = buildBrandLogoUrlMap(getBrandsWithLogos(allClientBrands))
    const workItems = mapWorkItems(workResult.rows, brandLogoUrlMap)

    return {
      title: pdfFixtureDocument.title,
      issueDate: pdfFixtureDocument.issueDate,
      heroImageUrl: pdfFixtureDocument.heroImageUrl,
      aboutText: resolvePublicAboutCopy(profile?.about_text ?? pdfFixtureDocument.aboutText),
      contact: {
        email: profile?.contact_email ?? pdfFixtureDocument.contact.email,
        phone: profile?.contact_phone ?? pdfFixtureDocument.contact.phone,
        address: profile?.address ?? pdfFixtureDocument.contact.address,
      },
      workItems,
      clientBrands: allClientBrands.length > 0 ? allClientBrands : pdfFixtureDocument.clientBrands,
      sectionOrder: SECTION_ORDER,
    }
  } catch {
    return pdfFixtureDocument
  }
}
