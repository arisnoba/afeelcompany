import { AdminAccountsManager } from '@/app/admin/accounts/_components/AdminAccountsManager'
import { getAdminSession, listAdminUsers } from '@/lib/auth'

export default async function AdminAccountsPage() {
  const [session, admins] = await Promise.all([getAdminSession(), listAdminUsers()])

  if (!session) {
    return null
  }

  return (
    <AdminAccountsManager initialAdmins={admins} currentAdminId={session.adminId} />
  )
}
