import type { Metadata } from 'next';

import { BrandLogoGrid } from '@/components/site/BrandLogoGrid';
import { AnimatedPageTitle } from '@/components/ui/animated-page-title';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { getSiteDictionary } from '@/i18n/site-copy';
import { getBrandsWithLogos } from '@/lib/client-brands';
import { createPageMetadata } from '@/lib/seo';
import { getSiteClientBrands } from '@/lib/site';

export function getPartnerMetadata(locale: Locale): Metadata {
	const copy = getSiteDictionary(locale).partner.metadata;

	return createPageMetadata({
		title: copy.title,
		description: copy.description,
		path: '/partner',
		keywords: copy.keywords,
		locale,
	});
}

export async function PartnerPageView({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
	const copy = getSiteDictionary(locale).partner;
	const brands = getBrandsWithLogos(await getSiteClientBrands());

	return (
		<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
			<div className="grid gap-14 py-12 sm:gap-16 sm:py-16 lg:gap-20 lg:py-20">
				<section className="block space-y-6">
					<div>
						<AnimatedPageTitle
							lines={copy.titleLines}
							className="mt-5 text-5xl font-light leading-none tracking-[-0.07em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-6xl md:text-7xl"
						/>
					</div>

					<p className="max-w-xl text-base leading-8 text-stone-600 sm:text-lg sm:leading-9">{copy.description}</p>
				</section>

				<section className="grid gap-6 bg-white p-6 sm:p-8 lg:p-10">
					<BrandLogoGrid brands={brands} emptyLabel={copy.emptyLogoLabel} />
				</section>
			</div>
		</div>
	);
}
