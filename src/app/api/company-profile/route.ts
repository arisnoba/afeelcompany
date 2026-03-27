import { sql } from '@/lib/db'
import { isAdminAuthenticated } from '@/lib/auth'

interface CompanyProfileRow {
  id: string
  about_text: string | null
  contact_email: string | null
  contact_phone: string | null
  address: string | null
}

interface CompanyProfilePayload {
  aboutText?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
}

export async function GET(): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const result = await sql<CompanyProfileRow>`
    SELECT id, about_text, contact_email, contact_phone, address
    FROM company_profile
    ORDER BY updated_at DESC
    LIMIT 1
  `

  const profile = result.rows[0]

  return Response.json({
    success: true,
    data: {
      aboutText: profile?.about_text ?? '',
      contactEmail: profile?.contact_email ?? '',
      contactPhone: profile?.contact_phone ?? '',
      address: profile?.address ?? '',
    },
  })
}

export async function PUT(request: Request): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

  const body = (await request.json()) as CompanyProfilePayload

  if (
    typeof body.aboutText !== 'string' ||
    typeof body.contactEmail !== 'string' ||
    typeof body.contactPhone !== 'string' ||
    typeof body.address !== 'string'
  ) {
    return Response.json({ success: false, error: 'INVALID_PAYLOAD' }, { status: 400 })
  }

  const existing = await sql<{ id: string }>`
    SELECT id
    FROM company_profile
    ORDER BY updated_at DESC
    LIMIT 1
  `

  if (existing.rows[0]) {
    await sql`
      UPDATE company_profile
      SET
        about_text = ${body.aboutText},
        contact_email = ${body.contactEmail},
        contact_phone = ${body.contactPhone},
        address = ${body.address},
        updated_at = NOW()
      WHERE id = ${existing.rows[0].id}
    `
  } else {
    await sql`
      INSERT INTO company_profile (about_text, contact_email, contact_phone, address)
      VALUES (${body.aboutText}, ${body.contactEmail}, ${body.contactPhone}, ${body.address})
    `
  }

  return Response.json({ success: true })
}
