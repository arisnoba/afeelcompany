import { AdminAccountsManager } from '@/app/admin/accounts/_components/AdminAccountsManager'
import { AdminPageIntro } from '@/components/admin/AdminPageIntro'
import { getAdminSession, listAdminUsers } from '@/lib/auth'

export default async function AdminAccountsPage() {
  const [session, admins] = await Promise.all([getAdminSession(), listAdminUsers()])

  if (!session) {
    return null
  }

  return (
    <div className="grid gap-6">
      <AdminPageIntro
        eyebrow="관리자 계정"
        title="접근 계정 관리"
        description="관리자 이메일과 비밀번호 해시 기반으로 접근 가능한 계정을 등록하고 비활성화할 수 있습니다."
        aside={
          <div>
            초기 관리자 ID는 `arisnoba@gmail.com`으로 부트스트랩되며, 최초 비밀번호는 현재
            `ADMIN_PASSWORD` 환경변수를 그대로 사용합니다.
          </div>
        }
      />

      <AdminAccountsManager initialAdmins={admins} currentAdminId={session.adminId} />
    </div>
  )
}
