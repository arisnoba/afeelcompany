'use client'

import { usePathname } from 'next/navigation'

import { SidebarTrigger } from '@/components/ui/sidebar'

import { getAdminNavItem } from './admin-navigation'

export function AdminTopbar() {
  const pathname = usePathname()
  const currentItem = getAdminNavItem(pathname)

  return (
    <div className="sticky top-0 z-20 border-b border-black/6 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-[0.16em] text-[#0f7b54] uppercase">
            Admin
          </p>
          <p className="text-sm font-medium text-foreground">{currentItem.label}</p>
          <p className="truncate text-xs text-muted-foreground">
            {currentItem.description}
          </p>
        </div>
      </div>
    </div>
  )
}
