'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
	{ href: '/', label: 'HOME' },
	{ href: '/about', label: 'ABOUT' },
	{ href: '/portfolio', label: 'PORTFOLIO' },
	{ href: '/contact', label: 'CONTACT' },
];

function isNavItemActive(pathname: string, href: string) {
	if (href === '/') {
		return pathname === href;
	}

	return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const isHome = pathname === '/';
	const showSolidHeader = !isHome || isScrolled || mobileOpen;

	useEffect(() => {
		if (!isHome) {
			return;
		}

		const handleScroll = () => {
			setIsScrolled(window.scrollY > 12);
		};

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [isHome]);

	return (
		<header
			className={`z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
				showSolidHeader ? 'border-b border-stone-200/60 bg-[#fcf9f8]/82 backdrop-blur-[20px]' : 'border-b border-transparent bg-transparent backdrop-blur-0'
			} ${isHome ? 'fixed inset-x-0 top-0' : 'sticky top-0'}`}>
			<div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-4 py-4 sm:px-6 md:py-5 lg:px-10 lg:py-6">
				<Link href="/" className="text-stone-950">
					<span className="sr-only text-[1.9rem] leading-none tracking-[-0.06em] [font-family:var(--font-newsreader)]">AFEELCOMPANY</span>
					<Image src="/images/symbol.svg" alt="afeelcompany" width={32} height={32} className="invert" style={{ height: 'auto' }} />
				</Link>

				<nav className="hidden items-center gap-10 md:flex">
					{NAV_ITEMS.map(item => {
						const isActive = isNavItemActive(pathname, item.href);

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`text-sm font-semibold transition-colors duration-300 ${isActive ? 'font-semibold text-[#274133]' : 'text-stone-500 hover:text-[#274133]'}`}>
								{item.label}
							</Link>
						);
					})}
				</nav>

				<button
					type="button"
					className="inline-flex h-11 w-11 items-center justify-center text-stone-700 transition hover:text-[#274133] md:hidden"
					aria-expanded={mobileOpen}
					aria-controls="site-mobile-nav"
					aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
					onClick={() => setMobileOpen(open => !open)}>
					{mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
				</button>
			</div>

			{mobileOpen ? (
				<div id="site-mobile-nav" className="border-t border-stone-200/60 bg-[#fcf9f8]/95 md:hidden">
					<nav className="mx-auto grid w-full max-w-screen-2xl gap-1 px-4 py-4 sm:px-6">
						{NAV_ITEMS.map(item => {
							const isActive = isNavItemActive(pathname, item.href);

							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setMobileOpen(false)}
									className={`px-1 py-3 text-sm font-semibold transition-colors ${isActive ? 'font-semibold text-[#274133]' : 'text-stone-600 font-semibold hover:text-[#274133]'}`}>
									{item.label}
								</Link>
							);
						})}
					</nav>
				</div>
			) : null}
		</header>
	);
}
