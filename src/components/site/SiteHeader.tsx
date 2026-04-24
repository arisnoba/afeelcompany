'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { DEFAULT_LOCALE, LOCALES, LOCALE_LABELS, type Locale, getLocalizedPath, stripLocaleFromPathname } from '@/i18n/config';
import { getSiteDictionary } from '@/i18n/site-copy';

function isNavItemActive(pathname: string, href: string) {
	const normalizedPath = stripLocaleFromPathname(pathname);

	if (href === '/') {
		return normalizedPath === href;
	}

	return normalizedPath === href || normalizedPath.startsWith(`${href}/`);
}

interface SiteHeaderProps {
	locale?: Locale;
}

export function SiteHeader({ locale = DEFAULT_LOCALE }: SiteHeaderProps) {
	const dictionary = getSiteDictionary(locale);
	const navItems = [
		{ href: '/', label: dictionary.nav.home },
		{ href: '/about', label: dictionary.nav.about },
		{ href: '/partner', label: dictionary.nav.partner },
		{ href: '/portfolio', label: dictionary.nav.portfolio },
		{ href: '/contact', label: dictionary.nav.contact },
	];
	const pathname = usePathname();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const isHome = stripLocaleFromPathname(pathname) === '/';
	const showSolidHeader = !isHome || isScrolled || mobileOpen;
	const basePath = stripLocaleFromPathname(pathname);

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
				<Link href={getLocalizedPath(locale, '/')} className="text-stone-950">
					<span className="sr-only text-[1.9rem] leading-none tracking-[-0.06em] [font-family:var(--font-newsreader)]">AFEELCOMPANY</span>
					<Image src="/images/symbol.svg" alt="afeelcompany" width={33} height={30} className="h-5 w-auto invert md:h-8" priority />
				</Link>

				<nav className="hidden items-center gap-10 md:flex">
					{navItems.map(item => {
						const isActive = isNavItemActive(pathname, item.href);

						return (
							<Link
								key={item.href}
								href={getLocalizedPath(locale, item.href)}
								className={`text-sm font-semibold transition-colors duration-300 ${isActive ? 'font-semibold text-[#274133]' : 'text-stone-500 hover:text-[#274133]'}`}>
								{item.label}
							</Link>
						);
					})}
				</nav>

				<div className="hidden items-center gap-3 md:flex">
					<span className="sr-only">{dictionary.languageSwitcherLabel}</span>
					{LOCALES.map(nextLocale => {
						const href = getLocalizedPath(nextLocale, basePath);
						const isActive = locale === nextLocale;

						return (
							<Link
								key={nextLocale}
								href={href}
								aria-current={isActive ? 'page' : undefined}
								className={`text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition ${
									isActive ? 'text-[#274133]' : 'text-stone-400 hover:text-[#274133]'
								}`}>
								{LOCALE_LABELS[nextLocale]}
							</Link>
						);
					})}
				</div>

				<div className="flex items-center gap-4 md:hidden">
					<div className="flex items-center gap-2">
						{LOCALES.map(nextLocale => {
							const href = getLocalizedPath(nextLocale, basePath);
							const isActive = locale === nextLocale;

							return (
								<Link
									key={nextLocale}
									href={href}
									aria-current={isActive ? 'page' : undefined}
									className={`text-[0.64rem] font-semibold uppercase tracking-[0.18em] ${
										isActive ? 'text-[#274133]' : 'text-stone-400'
									}`}>
									{LOCALE_LABELS[nextLocale]}
								</Link>
							);
						})}
					</div>

					<button
						type="button"
						className="inline-flex h-11 w-11 items-center justify-center text-stone-700 transition hover:text-[#274133]"
						aria-expanded={mobileOpen}
						aria-controls="site-mobile-nav"
						aria-label={mobileOpen ? dictionary.menuCloseLabel : dictionary.menuOpenLabel}
						onClick={() => setMobileOpen(open => !open)}>
						{mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
					</button>
				</div>
			</div>

			{mobileOpen ? (
				<div id="site-mobile-nav" className="border-t border-stone-200/60 bg-[#fcf9f8]/95 md:hidden">
					<nav className="mx-auto grid w-full max-w-screen-2xl gap-1 px-4 py-4 sm:px-6">
						{navItems.map(item => {
							const isActive = isNavItemActive(pathname, item.href);

							return (
								<Link
									key={item.href}
									href={getLocalizedPath(locale, item.href)}
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
