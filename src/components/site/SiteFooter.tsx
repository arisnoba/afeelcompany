import Link from 'next/link';
import Image from 'next/image';

import { DEFAULT_LOCALE, type Locale, getLocalizedPath } from '@/i18n/config';
import { getSiteDictionary } from '@/i18n/site-copy';
import { getLocalizedSiteAddress } from '@/lib/site-address';
import { getLocalizedPublicAboutCopy } from '@/lib/company-copy';
import { INSTAGRAM_PROFILE_URL } from '@/lib/site';
import type { SiteCompanyProfile } from '@/types/site';

interface SiteFooterProps {
	profile: SiteCompanyProfile;
	locale?: Locale;
}

function renderValue(value: string, fallback: string) {
	return value || fallback;
}

const STUDIO_LINKS = [
	{ href: '/about', key: 'about' as const },
	{ href: '/portfolio', key: 'portfolio' as const },
	{ href: '/contact', key: 'contact' as const },
];

export function SiteFooter({ profile, locale = DEFAULT_LOCALE }: SiteFooterProps) {
	const dictionary = getSiteDictionary(locale);
	const description = getLocalizedPublicAboutCopy(locale, profile.aboutText);
	const address = getLocalizedSiteAddress(locale, profile.address);
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
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-stone-400">{dictionary.footer.addressLabel}</p>
						<p className="whitespace-pre-line text-[1.02rem] leading-normal text-stone-800">{renderValue(address, dictionary.footer.pendingLabel)}</p>
					</div>
					<div className="grid gap-4">
						<p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-stone-400">{dictionary.footer.inquiriesLabel}</p>
						<div className="grid gap-1 text-[1.02rem] leading-normal text-stone-800">
							{phone ? (
								<a href={`tel:${phone}`} className="transition hover:text-stone-950">
									{phone}
								</a>
							) : (
								<p>{renderValue(phone, dictionary.footer.pendingLabel)}</p>
							)}
							{email ? (
								<a href={`mailto:${email}`} className="transition hover:text-stone-950">
									{email}
								</a>
							) : (
								<p>{renderValue(email, dictionary.footer.pendingLabel)}</p>
							)}
						</div>
					</div>
				</div>

				<div className="grid content-start gap-4">
					<p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-stone-400">{dictionary.footer.siteLabel}</p>
					<ul className="grid gap-4 text-sm font-semibold uppercase tracking-wider text-stone-700">
						{STUDIO_LINKS.map(item => (
							<li key={item.href}>
								<Link href={getLocalizedPath(locale, item.href)} className="transition hover:text-stone-950">
									{dictionary.nav[item.key]}
								</Link>
							</li>
						))}
					</ul>
				</div>

				<div className="grid content-start gap-4">
					<p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-stone-400">{dictionary.footer.connectLabel}</p>
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
				<p>{dictionary.footer.digitalArchiveLabel}</p>
			</div>
		</footer>
	);
}
