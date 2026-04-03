import { AdminPageIntro } from '@/components/admin/AdminPageIntro'
import { ClientBrandTable } from '@/components/admin/ClientBrandTable'
import { sql } from '@/lib/db'
import type { ClientBrandAdminItem } from '@/types/client-brand'

interface ClientBrandRow {
  id: string
  name: string
  logo_url: string | null
  brand_url: string | null
  sort_order: number
  is_active: boolean
}

function mapClientBrandRow(row: ClientBrandRow): ClientBrandAdminItem {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url,
    brandUrl: row.brand_url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  }
}

export default async function AdminClientsPage() {
  const result = await sql<ClientBrandRow>`
    SELECT id, name, logo_url, brand_url, sort_order, is_active
    FROM client_brands
    ORDER BY sort_order ASC, created_at ASC
  `

  return (
    <div className="grid gap-6">
      <AdminPageIntro
        eyebrow="클라이언트"
        title="클라이언트 관리"
        description="브랜드 리스트를 테이블에서 확인하고, 신규 등록과 기존 수정은 우측 패널에서 같은 흐름으로 처리합니다."
        aside={
          <div>
            브랜드 URL은 선택 입력이며, 활성 상태의 로고는 웹과 제안서 출력 흐름에서
            함께 사용됩니다.
          </div>
        }
      />

      <ClientBrandTable initialItems={result.rows.map(mapClientBrandRow)} />
    </div>
  )
}
