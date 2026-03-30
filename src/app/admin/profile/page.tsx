import { sql } from '@/lib/db'
import { BrandManager } from '@/components/admin/BrandManager'
import { ProfileEditor } from '@/app/admin/profile/_components/ProfileEditor'
import { AdminPageIntro } from '@/components/admin/AdminPageIntro'

interface CompanyProfileRow {
  about_text: string | null
  contact_email: string | null
  contact_phone: string | null
  address: string | null
}

interface ClientBrandRow {
  id: string
  name: string
  logo_url: string | null
  sort_order: number
  is_active: boolean
}

export default async function AdminProfilePage() {
  const [profileResult, brandResult] = await Promise.all([
    sql<CompanyProfileRow>`
      SELECT about_text, contact_email, contact_phone, address
      FROM company_profile
      ORDER BY updated_at DESC
      LIMIT 1
    `,
    sql<ClientBrandRow>`
      SELECT id, name, logo_url, sort_order, is_active
      FROM client_brands
      ORDER BY sort_order ASC, created_at ASC
    `,
  ])

  const profile = profileResult.rows[0]

  return (
    <div className="grid gap-6">
      <AdminPageIntro
        eyebrow="회사 정보"
        title="회사 프로필과 브랜드 관리"
        description="여기서 저장한 회사 소개와 브랜드 로고는 `/pdf-export`가 우선적으로 읽는 데이터입니다."
        aside={
          <div>브랜드 로고 순서는 제안서와 웹 노출 순서에도 영향을 줍니다.</div>
        }
      />

      <ProfileEditor
        initialProfile={{
          aboutText: profile?.about_text ?? '',
          contactEmail: profile?.contact_email ?? '',
          contactPhone: profile?.contact_phone ?? '',
          address: profile?.address ?? '',
        }}
      />

      <BrandManager
        initialBrands={brandResult.rows.map((row) => ({
          id: row.id,
          name: row.name,
          logoUrl: row.logo_url,
          sortOrder: row.sort_order,
          isActive: row.is_active,
        }))}
      />
    </div>
  )
}
