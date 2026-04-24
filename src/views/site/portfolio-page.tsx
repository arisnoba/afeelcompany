import type { Metadata } from 'next';

import { PortfolioGalleryClient } from '@/components/site/PortfolioGalleryClient';
import { AnimatedPageTitle } from '@/components/ui/animated-page-title';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { getSiteDictionary } from '@/i18n/site-copy';
import { createPageMetadata } from '@/lib/seo';
import { getPublicPortfolioItems } from '@/lib/site';

export function getPortfolioMetadata(locale: Locale): Metadata {
	const copy = getSiteDictionary(locale).portfolio.metadata;

	return createPageMetadata({
		title: copy.title,
		description: copy.description,
		path: '/portfolio',
		keywords: copy.keywords,
		locale,
	});
}

export async function PortfolioPageView({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
	const copy = getSiteDictionary(locale).portfolio;
	const items = await getPublicPortfolioItems();

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
				</section>

				<PortfolioGalleryClient
					items={items}
					filterAllLabel={copy.filterAllLabel}
					pageLabel={copy.pageLabel}
					emptySelectionLabel={copy.emptySelectionLabel}
					categoryLabels={copy.categoryLabels}
					celebrityLabel={copy.celebrityLabel}
					defaultTitle={copy.defaultTitle}
				/>
			</div>
		</div>
	);
}
