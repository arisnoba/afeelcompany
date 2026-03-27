import { sql } from '@/lib/db'
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

function mapWorkItems(rows: PortfolioItemRow[]): PdfPortfolioItem[] {
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    brandName: row.brand_name,
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
        SELECT id, title, brand_name, celebrity_name, category, image_url, thumbnail_url, show_on_pdf, sort_order
        FROM portfolio_items
        WHERE show_on_pdf = true
        ORDER BY sort_order ASC, created_at DESC
        LIMIT 8
      `,
      sql<ClientBrandRow>`
        SELECT id, name, logo_url, sort_order
        FROM client_brands
        WHERE is_active = true
        ORDER BY sort_order ASC, created_at ASC
        LIMIT 12
      `,
    ])

    if (workResult.rows.length === 0) {
      return pdfFixtureDocument
    }

    const profile = profileResult.rows[0]
    const workItems = mapWorkItems(workResult.rows)
    const clientBrands = mapClientBrands(brandResult.rows)

    return {
      title: pdfFixtureDocument.title,
      issueDate: pdfFixtureDocument.issueDate,
      heroImageUrl: pdfFixtureDocument.heroImageUrl,
      aboutText: profile?.about_text ?? pdfFixtureDocument.aboutText,
      contact: {
        email: profile?.contact_email ?? pdfFixtureDocument.contact.email,
        phone: profile?.contact_phone ?? pdfFixtureDocument.contact.phone,
        address: profile?.address ?? pdfFixtureDocument.contact.address,
      },
      workItems,
      clientBrands: clientBrands.length > 0 ? clientBrands : pdfFixtureDocument.clientBrands,
      sectionOrder: SECTION_ORDER,
    }
  } catch {
    return pdfFixtureDocument
  }
}
