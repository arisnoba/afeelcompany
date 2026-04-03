import Link from 'next/link';

import { INSTAGRAM_PROFILE_URL } from '@/lib/site';
import type { SiteCompanyProfile } from '@/types/site';

interface SiteFooterProps {
	profile: SiteCompanyProfile;
}

function renderValue(value: string) {
	return value || '정보를 준비 중입니다.';
}

const STUDIO_LINKS = [
	{ href: '/about', label: 'About' },
	{ href: '/portfolio', label: 'Portfolio' },
	{ href: '/contact', label: 'Contact' },
];

export function SiteFooter({ profile }: SiteFooterProps) {
	const description = profile.aboutText || '브랜드의 이미지를 축적하고 전달하는 에디토리얼 아카이브를 운영합니다.';
	const phone = profile.contactPhone.trim();
	const email = profile.contactEmail.trim();
	const connectLinks = [
		{ href: '/feed', label: 'Feed', external: false },
		{ href: INSTAGRAM_PROFILE_URL, label: 'Instagram', external: true },
		...(email ? [{ href: `mailto:${email}`, label: 'Email', external: true }] : [{ href: '/contact', label: 'Contact', external: false }]),
	];

	return (
		<footer className="border-t border-stone-900/10 bg-[#faf8f4] pb-10 pt-20 text-stone-900 sm:pt-24">
			<div className="mx-auto grid w-full max-w-screen-2xl gap-16 px-6 md:grid-cols-3 md:gap-20 md:px-12">
				<div className="grid gap-6">
					<span className="text-2xl tracking-[-0.05em] [font-family:var(--font-newsreader)]">AFEELCOMPANY</span>
					<p className="max-w-xs text-sm leading-7 text-stone-500">{description}</p>
				</div>

				<div className="grid gap-8">
					<div className="grid gap-2">
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">Address</p>
						<p className="whitespace-pre-line text-sm leading-7 text-stone-800">{renderValue(profile.address)}</p>
					</div>
					<div className="grid gap-2">
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">Inquiries</p>
						<div className="grid gap-1 text-sm leading-7 text-stone-800">
							{phone ? (
								<a href={`tel:${phone}`} className="transition hover:text-[#274133]">
									{phone}
								</a>
							) : (
								<p>{renderValue(phone)}</p>
							)}
							{email ? (
								<a href={`mailto:${email}`} className="transition hover:text-[#274133]">
									{email}
								</a>
							) : (
								<p>{renderValue(email)}</p>
							)}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-8">
					<div className="grid gap-4">
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">Studio</p>
						<ul className="grid gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-stone-700">
							{STUDIO_LINKS.map(item => (
								<li key={item.href}>
									<Link href={item.href} className="transition hover:text-[#274133]">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="grid gap-4">
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">Connect</p>
						<ul className="grid gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-stone-700">
							{connectLinks.map(item => (
								<li key={item.href}>
									{item.external ? (
										<a
											href={item.href}
											target={item.href.startsWith('http') ? '_blank' : undefined}
											rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
											className="transition hover:text-[#274133]">
											{item.label}
										</a>
									) : (
										<Link href={item.href} className="transition hover:text-[#274133]">
											{item.label}
										</Link>
									)}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			<div className="mx-auto mt-16 flex w-full max-w-screen-2xl flex-col gap-4 border-t border-stone-900/10 px-6 pt-8 text-[0.62rem] uppercase tracking-[0.24em] text-stone-400 md:flex-row md:items-center md:justify-between md:px-12">
				<p>© {new Date().getFullYear()} AFEELCOMPANY. ALL RIGHTS RESERVED.</p>
				<p>Site by Digital Atelier</p>
			</div>
		</footer>
	);
}
