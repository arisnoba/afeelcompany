import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'
import { uploadPublicImage } from '@/lib/blob'
import { PORTFOLIO_CATEGORIES, type PortfolioCategory } from '@/types/portfolio'

function toBoolean(value: FormDataEntryValue | null): boolean | null {
  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return null
}

function isPortfolioCategory(value: string): value is PortfolioCategory {
  return PORTFOLIO_CATEGORIES.some((category) => category === value)
}

export async function POST(request: Request): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  const title = formData.get('title')?.toString().trim()
  const brandName = formData.get('brandName')?.toString().trim()
  const celebrityName = formData.get('celebrityName')?.toString().trim() || null
  const category = formData.get('category')?.toString().trim()
  const showOnWeb = toBoolean(formData.get('showOnWeb'))
  const showOnPdf = toBoolean(formData.get('showOnPdf'))

  if (!(file instanceof File)) {
    return Response.json({ success: false, error: 'FILE_REQUIRED' }, { status: 400 })
  }

  if (!title || !brandName || !category || showOnWeb === null || showOnPdf === null) {
    return Response.json({ success: false, error: 'INVALID_FORM_DATA' }, { status: 400 })
  }

  if (!isPortfolioCategory(category)) {
    return Response.json({ success: false, error: 'INVALID_CATEGORY' }, { status: 400 })
  }

  try {
    const uploaded = await uploadPublicImage(file, 'portfolio')
    const result = await sql<{ id: string }>`
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
        ${uploaded.url},
        ${uploaded.url},
        ${showOnWeb},
        ${showOnPdf},
        ${0}
      )
      RETURNING id
    `

    return Response.json({
      success: true,
      data: {
        id: result.rows[0]?.id,
        imageUrl: uploaded.url,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'UPLOAD_FAILED'
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
