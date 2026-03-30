import { Geist, Geist_Mono } from 'next/font/google'

import { requireAdminSession } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

export const dynamic = 'force-dynamic'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-admin-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-admin-mono',
})

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
        className={`${geist.variable} ${geistMono.variable} min-h-[100dvh] bg-muted/30 font-[family-name:var(--font-admin-sans)] text-foreground`}
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
