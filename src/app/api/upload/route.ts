import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'
import { uploadPublicImage } from '@/lib/blob'
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

interface PortfolioUploadRow {
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

function normalizePortfolioUrl(input: string | null): string | null {
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

function mapPortfolioRow(row: PortfolioUploadRow): PortfolioAdminItem {
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

export async function POST(request: Request): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const formData = await request.formData()
  const normalFile = formData.get('normalFile')
  const hoverFile = formData.get('hoverFile')
  const title = formData.get('title')?.toString().trim()
  const brandName = formData.get('brandName')?.toString().trim()
  const celebrityName = formData.get('celebrityName')?.toString().trim() || null
  const category = formData.get('category')?.toString().trim()
  const instagramUrlRaw = formData.get('instagramUrl')?.toString() ?? null
  const showOnWeb = toBoolean(formData.get('showOnWeb'))
  const showOnPdf = toBoolean(formData.get('showOnPdf'))

  if (!(normalFile instanceof File) || !(hoverFile instanceof File)) {
    return Response.json(
      { success: false, error: 'NORMAL_AND_HOVER_FILES_REQUIRED' },
      { status: 400 }
    )
  }

  if (!title || !brandName || !category || showOnWeb === null || showOnPdf === null) {
    return Response.json({ success: false, error: 'INVALID_FORM_DATA' }, { status: 400 })
  }

  if (!isSerializedPortfolioCategories(category)) {
    return Response.json({ success: false, error: 'INVALID_CATEGORY' }, { status: 400 })
  }

  try {
    const instagramUrl = normalizePortfolioUrl(instagramUrlRaw)
    const [uploadedNormal, uploadedHover] = await Promise.all([
      uploadPublicImage(normalFile, 'portfolio'),
      uploadPublicImage(hoverFile, 'portfolio'),
    ])
    const result = await sql<PortfolioUploadRow>`
      INSERT INTO portfolio_items (
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
      )
      VALUES (
        ${title},
        ${brandName},
        ${celebrityName},
        ${category},
        ${instagramUrl},
        ${uploadedNormal.url},
        ${uploadedHover.url},
        ${showOnWeb},
        ${showOnPdf},
        (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM portfolio_items)
      )
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

    return Response.json({
      success: true,
      data: result.rows[0] ? mapPortfolioRow(result.rows[0]) : undefined,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UPLOAD_FAILED'
    const status = message.includes('인스타그램') ? 400 : 500
    return Response.json({ success: false, error: message }, { status })
  }
}
