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
  image_url: string
  thumbnail_url: string | null
  show_on_web: boolean
  show_on_pdf: boolean
  sort_order: number
}

function mapPortfolioRow(row: PortfolioUploadRow): PortfolioAdminItem {
  return {
    id: row.id,
    title: row.title,
    brandName: row.brand_name,
    celebrityName: row.celebrity_name,
    category: row.category,
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
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
