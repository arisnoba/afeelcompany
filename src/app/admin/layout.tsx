import { requireAdminSession } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await requireAdminSession()

  return (
    <TooltipProvider>
      <SidebarProvider
        defaultOpen
        className="min-h-[100dvh] bg-[radial-gradient(circle_at_top_left,rgba(24,226,153,0.09),transparent_24%),linear-gradient(180deg,#fcfffd_0%,#f8fbf9_100%)] text-foreground"
      >
        <AdminSidebar />

        <SidebarInset className="min-h-[100dvh]">
          <AdminTopbar />
          <div className="flex flex-1 flex-col">
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 md:px-6">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
