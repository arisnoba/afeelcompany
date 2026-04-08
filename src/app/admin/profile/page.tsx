import { sql } from '@/lib/db';
import { ProfileEditor } from '@/app/admin/profile/_components/ProfileEditor';
import { AdminPageIntro } from '@/components/admin/AdminPageIntro';

interface CompanyProfileRow {
	about_text: string | null;
	contact_email: string | null;
	contact_phone: string | null;
	address: string | null;
}

export default async function AdminProfilePage() {
	const profileResult = await sql<CompanyProfileRow>`
    SELECT about_text, contact_email, contact_phone, address
    FROM company_profile
    ORDER BY updated_at DESC
    LIMIT 1
  `;

	const profile = profileResult.rows[0];

	return (
		<div className="grid gap-6">
			<AdminPageIntro
				eyebrow="회사 정보"
				title="회사 프로필 관리"
				description="여기서 저장한 회사 소개와 연락처는 `/pdf-export`와 웹 공용 데이터로 바로 반영됩니다."
				aside={<div>클라이언트 로고와 URL 관리는 별도 `클라이언트 관리` 메뉴에서 처리합니다.</div>}
			/>

			<ProfileEditor
				initialProfile={{
					aboutText: profile?.about_text ?? '',
					contactEmail: profile?.contact_email ?? '',
					contactPhone: profile?.contact_phone ?? '',
					address: profile?.address ?? '',
				}}
			/>
		</div>
	);
}
