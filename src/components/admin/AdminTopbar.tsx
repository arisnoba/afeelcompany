'use client'

import { usePathname } from 'next/navigation'

import { SidebarTrigger } from '@/components/ui/sidebar'

import { getAdminNavItem } from './admin-navigation'

export function AdminTopbar() {
  const pathname = usePathname()
  const currentItem = getAdminNavItem(pathname)

  return (
    <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{currentItem.label}</p>
          <p className="truncate text-xs text-muted-foreground">
            {currentItem.description}
          </p>
        </div>
      </div>
    </div>
  )
}
