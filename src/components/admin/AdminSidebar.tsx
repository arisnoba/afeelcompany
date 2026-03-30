'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2,
  Camera,
  ImageUp,
  Images,
  LayoutDashboard,
} from 'lucide-react'

import { LogoutButton } from '@/app/admin/_components/LogoutButton'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'

import { ADMIN_NAV_ITEMS, isAdminHrefActive } from './admin-navigation'

const NAV_ICONS = {
  '/admin': LayoutDashboard,
  '/admin/upload': ImageUp,
  '/admin/portfolio': Images,
  '/admin/profile': Building2,
  '/admin/instagram': Camera,
} as const

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex size-8 items-center justify-center rounded-md border bg-background text-xs font-semibold">
            AF
          </div>
          <div className="grid flex-1 text-left group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">AFEEL Admin</span>
            <span className="text-xs text-muted-foreground">콘텐츠 운영</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>관리</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_NAV_ITEMS.map((item) => {
                const isActive = isAdminHrefActive(pathname, item.href)
                const Icon = NAV_ICONS[item.href as keyof typeof NAV_ICONS]

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {isActive ? <SidebarMenuBadge>현재</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>메모</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="rounded-lg border bg-background p-3 text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
              업로드, 포트폴리오, 인스타 큐가 같은 데이터를 공유합니다.
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <LogoutButton
          variant="ghost"
          className="w-full justify-start"
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
