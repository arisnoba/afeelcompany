import Link from 'next/link';

import type { Locale } from '@/i18n/config';
import { getLocalizedPath } from '@/i18n/config';
import { getSiteDictionary } from '@/i18n/site-copy';

const QUICK_LINKS = [
	{ path: '/about', key: 'about' as const },
	{ path: '/portfolio', key: 'portfolio' as const },
	{ path: '/contact', key: 'contact' as const },
];

interface NotFoundContentProps {
	locale: Locale;
}

export function NotFoundContent({ locale }: NotFoundContentProps) {
	const dictionary = getSiteDictionary(locale);
	const copy = dictionary.notFound;

	return (
		<section className="mx-auto flex min-h-[68vh] w-full max-w-6xl flex-col justify-center px-5 py-24 sm:px-8 lg:px-10">
			<div className="max-w-2xl">
				<p className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">404</p>
				<h1 className="mt-6 text-4xl font-semibold leading-tight text-stone-950 sm:text-6xl">{copy.title}</h1>
				<p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">{copy.description}</p>
				<div className="mt-10 flex flex-wrap gap-3">
					<Link
						href={getLocalizedPath(locale, '/')}
						className="inline-flex h-11 items-center justify-center border border-stone-950 bg-stone-950 px-5 text-sm font-semibold text-white transition hover:bg-stone-800"
					>
						{copy.homeLabel}
					</Link>
					{QUICK_LINKS.map(link => (
						<Link
							key={link.path}
							href={getLocalizedPath(locale, link.path)}
							className="inline-flex h-11 items-center justify-center border border-stone-300 px-5 text-sm font-semibold text-stone-950 transition hover:border-stone-950"
						>
							{dictionary.nav[link.key]}
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
