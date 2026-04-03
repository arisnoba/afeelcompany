'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Camera, FileOutput, Images, LayoutDashboard } from 'lucide-react';

import { LogoutButton } from '@/app/admin/_components/LogoutButton';
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
} from '@/components/ui/sidebar';

import { ADMIN_NAV_ITEMS, isAdminHrefActive } from './admin-navigation';

const NAV_ICONS = {
	'/admin': LayoutDashboard,
	'/admin/portfolio': Images,
	'/admin/export': FileOutput,
	'/admin/profile': Building2,
	'/admin/instagram': Camera,
} as const;

export function AdminSidebar() {
	const pathname = usePathname();

	return (
		<Sidebar variant="inset" collapsible="icon" className="border-r border-black/6 bg-white/90 backdrop-blur">
			<SidebarHeader>
				<div className="flex items-center gap-3 px-2 py-2">
					<div className="flex size-9 items-center justify-center rounded-2xl border border-[#18e299]/30 bg-[#18e299]/12 text-xs font-semibold text-[#0f7b54]">AF</div>
					<div className="grid flex-1 text-left group-data-[collapsible=icon]:hidden">
						<span className="text-sm font-semibold">AFEEL Admin</span>
						<span className="text-xs text-muted-foreground">콘텐츠 라이브러리</span>
					</div>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>관리</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{ADMIN_NAV_ITEMS.map(item => {
								const isActive = isAdminHrefActive(pathname, item.href);
								const Icon = NAV_ICONS[item.href as keyof typeof NAV_ICONS];

								return (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton render={<Link href={item.href} />} isActive={isActive} tooltip={item.label}>
											<Icon />
											<span>{item.label}</span>
										</SidebarMenuButton>
										{isActive ? <SidebarMenuBadge>현재</SidebarMenuBadge> : null}
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator />

				<SidebarGroup>
					<SidebarGroupLabel>메모</SidebarGroupLabel>
					<SidebarGroupContent>
						<div className="rounded-sm border border-black/6 bg-[#fbfdfb] p-3 text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
							포트폴리오 등록은 목록 우측 패널에서 바로 시작할 수 있습니다.
						</div>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<LogoutButton variant="ghost" className="w-full justify-start" />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
