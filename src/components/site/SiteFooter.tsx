import Link from 'next/link';
import Image from 'next/image';

import { PUBLIC_ABOUT_COPY } from '@/lib/company-copy';
import { INSTAGRAM_PROFILE_URL } from '@/lib/site';
import type { SiteCompanyProfile } from '@/types/site';

interface SiteFooterProps {
	profile: SiteCompanyProfile;
}

function renderValue(value: string) {
	return value || '정보를 준비 중입니다.';
}

const STUDIO_LINKS = [
	{ href: '/about', label: 'about' },
	{ href: '/portfolio', label: 'portfolio' },
	{ href: '/contact', label: 'contact' },
];

export function SiteFooter({ profile }: SiteFooterProps) {
	const description = profile.aboutText || PUBLIC_ABOUT_COPY;
	const phone = profile.contactPhone.trim();
	const email = profile.contactEmail.trim();
	const connectLinks = [
		{ href: INSTAGRAM_PROFILE_URL, label: 'Instagram', external: true },
		{ href: `https://blog.naver.com/afeelcompany`, label: 'Blog', external: true },
	];

	return (
		<footer className="border-t border-stone-900/8 bg-[#faf7f3] text-stone-900">
			<div className="mx-auto grid w-full max-w-screen-2xl gap-14 px-6 py-20 md:grid-cols-2 md:gap-x-12 md:px-12 md:py-24 xl:grid-cols-[minmax(0,1.4fr)_minmax(260px,1.15fr)_180px_180px] xl:gap-x-16">
				<div className="grid content-start gap-5">
					<span className="text-2xl tracking-[-0.05em] [font-family:var(--font-newsreader)]">
						<Image src="/images/logo.svg" alt="afeelcompany" width={229} height={20} className="h-6 w-auto invert" />
					</span>
					<p className="max-w-md text-[1.02rem] leading-normal text-stone-500">{description}</p>
				</div>

				<div className="grid content-start gap-12">
					<div className="grid gap-4">
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-stone-400">address</p>
						<p className="whitespace-pre-line text-[1.02rem] leading-normal text-stone-800">{renderValue(profile.address)}</p>
					</div>
					<div className="grid gap-4">
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-stone-400">Inquiries</p>
						<div className="grid gap-1 text-[1.02rem] leading-normal text-stone-800">
							{phone ? (
								<a href={`tel:${phone}`} className="transition hover:text-stone-950">
									{phone}
								</a>
							) : (
								<p>{renderValue(phone)}</p>
							)}
							{email ? (
								<a href={`mailto:${email}`} className="transition hover:text-stone-950">
									{email}
								</a>
							) : (
								<p>{renderValue(email)}</p>
							)}
						</div>
					</div>
				</div>

				<div className="grid content-start gap-4">
					<p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-stone-400">Site</p>
					<ul className="grid gap-4 text-sm font-semibold uppercase tracking-wider text-stone-700">
						{STUDIO_LINKS.map(item => (
							<li key={item.href}>
								<Link href={item.href} className="transition hover:text-stone-950">
									{item.label}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div className="grid content-start gap-4">
					<p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-stone-400">Connect</p>
					<ul className="grid gap-4 text-sm font-semibold uppercase tracking-wider text-stone-700">
						{connectLinks.map(item => (
							<li key={item.href}>
								{item.external ? (
									<a
										href={item.href}
										target={item.href.startsWith('http') ? '_blank' : undefined}
										rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
										className="transition hover:text-stone-950">
										{item.label}
									</a>
								) : (
									<Link href={item.href} className="transition hover:text-stone-950">
										{item.label}
									</Link>
								)}
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 border-t border-stone-900/8 px-6 py-8 text-[0.62rem] uppercase tracking-[0.24em] text-stone-400 md:flex-row md:items-center md:justify-between md:px-12">
				<p>© {new Date().getFullYear()} AFEELCOMPANY. All Rights Reserved.</p>
				<p>Digital Archive</p>
			</div>
		</footer>
	);
}
