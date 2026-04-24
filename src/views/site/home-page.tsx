import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

import { ClientLogoMarquee } from '@/components/site/ClientLogoMarquee';
import { PortfolioPreviewGrid } from '@/components/site/PortfolioPreviewGrid';
import { AnimatedPageTitle } from '@/components/ui/animated-page-title';
import { ShaderGodrays } from '@/components/ui/shader-godrays';
import { DEFAULT_LOCALE, type Locale, getLocalizedPath } from '@/i18n/config';
import { getSiteDictionary } from '@/i18n/site-copy';
import { getBrandsWithLogos } from '@/lib/client-brands';
import { getLocalizedPublicAboutCopy } from '@/lib/company-copy';
import { createPageMetadata } from '@/lib/seo';
import { getFeaturedPortfolio, getSiteClientBrands, getSiteCompanyProfile } from '@/lib/site';

export function getHomeMetadata(locale: Locale): Metadata {
	const copy = getSiteDictionary(locale).home.metadata;

	return createPageMetadata({
		title: copy.title,
		description: copy.description,
		path: '/',
		keywords: copy.keywords,
		locale,
	});
}

export async function HomePageView({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
	const dictionary = getSiteDictionary(locale);
	const copy = dictionary.home;
	const [profile, featuredItems, clientBrands] = await Promise.all([getSiteCompanyProfile(), getFeaturedPortfolio(12), getSiteClientBrands()]);

	const heroBody = getLocalizedPublicAboutCopy(locale, profile.aboutText);
	const clientLogoBrands = getBrandsWithLogos(clientBrands);
	const portfolioHref = getLocalizedPath(locale, '/portfolio');
	const portfolioLinkClassName =
		'hidden md:inline-flex items-center gap-3 border border-stone-900/10 bg-white/70 px-6 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-stone-900 transition hover:border-stone-900/20 hover:bg-white';

	return (
		<>
			<section className="relative overflow-hidden bg-stone-900/8 pb-16 pt-24 sm:pb-24 sm:pt-40 lg:pb-32 lg:pt-44">
				<ShaderGodrays className="opacity-90 mask-[radial-gradient(120%_90%_at_50%_4%,black_0%,black_48%,transparent_100%)]" />
				<div className="absolute inset-0 opacity-35 mask-[radial-gradient(rgba(117,90,62,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(117,90,62,0.06)_1px,transparent_1px)] mask-size-[32px_32px]" />
				<div className="absolute -right-16 top-24 h-80 w-80 rounded-full bg-white/30 blur-3xl" />
				<div className="absolute inset-x-[18%] top-0 h-40 bg-[radial-gradient(circle_at_center,rgba(255,251,245,0.88),transparent_72%)] blur-2xl" />

				<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
					<div className="relative z-10 grid gap-20 py-10 sm:py-14 lg:py-16">
						<div className="flex items-center gap-4">
							<span className="h-px w-14 bg-[#715a3e]" />
							<span className="text-[0.62rem] font-semibold uppercase tracking-[0.4em] text-[#715a3e]"> {copy.heroBadge}</span>
						</div>

						<div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.42fr)] lg:items-end">
							<AnimatedPageTitle
								lines={copy.heroTitleLines}
								className="max-w-5xl text-[clamp(3.4rem,9vw,7.8rem)] font-light leading-[0.93] tracking-[-0.07em] text-stone-950 [font-family:var(--font-newsreader)]"
							/>

							<div className="grid gap-8 md:grid-cols-12 md:items-end">
								<div className="grid gap-6 md:col-span-12">
									<p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg sm:leading-9">{heroBody}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
				<div className="grid gap-24 py-16 sm:gap-28 sm:py-24 lg:gap-32 lg:py-40">
					<section className="grid gap-12">
						<div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
							<AnimatedPageTitle
								as="h2"
								lines={[{ text: copy.selectedWorkTitle }]}
								delay={0.04}
								duration={0.42}
								className="mt-4 text-4xl tracking-[-0.06em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl md:text-6xl"
							/>
							<Link href={portfolioHref} className={portfolioLinkClassName} aria-label={copy.portfolioLinkLabel}>
								{copy.portfolioLinkLabel}
								<ChevronRight className="size-4" />
							</Link>
						</div>

						{featuredItems.length === 0 ? (
							<div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-sm text-stone-500">{copy.emptyPortfolioLabel}</div>
						) : (
							<div className="grid gap-8">
								<PortfolioPreviewGrid items={featuredItems} href={portfolioHref} emptyLabel={copy.emptyPortfolioLabel} />
								<div className="flex justify-center">
									<Link href={portfolioHref} className={portfolioLinkClassName}>
										{copy.portfolioLinkLabel}
										<ChevronRight className="size-4" />
									</Link>
								</div>
							</div>
						)}
					</section>

					<section className="grid gap-12 border-t border-stone-900/8 pt-20">
						<div className="grid justify-items-center gap-4 text-center">
							<AnimatedPageTitle
								as="h2"
								lines={[{ text: copy.clientsTitle }]}
								delay={0.04}
								duration={0.42}
								className="text-4xl tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl"
							/>
						</div>

						<div className="grid gap-6 sm:gap-8">
							<ClientLogoMarquee
								brands={clientLogoBrands.filter((_, i) => i % 2 === 0)}
								emptyLabel={dictionary.partner.emptyLogoLabel}
								className="relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
								trackClassName="home-marquee-track flex min-w-max items-center gap-10 whitespace-nowrap py-2 sm:gap-16"
								logoClassName="relative h-10 w-28 shrink-0 opacity-70 transition hover:opacity-100 sm:h-16 sm:w-36"
								imageClassName="object-cover grayscale"
							/>
							<ClientLogoMarquee
								brands={clientLogoBrands.filter((_, i) => i % 2 !== 0)}
								emptyLabel={dictionary.partner.emptyLogoLabel}
								className="relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
								trackClassName="home-marquee-track-reverse flex min-w-max items-center gap-10 whitespace-nowrap py-2 sm:gap-16"
								logoClassName="relative h-10 w-28 shrink-0 opacity-70 transition hover:opacity-100 sm:h-16 sm:w-36"
								imageClassName="object-cover grayscale"
							/>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}
