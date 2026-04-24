import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { ClientLogoMarquee } from '@/components/site/ClientLogoMarquee';
import { ResponsiveStoryReveal } from '@/components/site/ResponsiveStoryReveal';
import { WorkflowBeam } from '@/components/site/WorkflowBeam';
import { AnimatedPageTitle } from '@/components/ui/animated-page-title';
import { TextRevealByWord } from '@/components/ui/text-reveal';
import { DEFAULT_LOCALE, type Locale, getLocalizedPath } from '@/i18n/config';
import { getSiteDictionary } from '@/i18n/site-copy';
import { getBrandsWithLogos } from '@/lib/client-brands';
import { createPageMetadata } from '@/lib/seo';
import { getSiteClientBrands } from '@/lib/site';

function CircleIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
			<circle cx="12" cy="12" r="10" />
			<circle cx="12" cy="12" r="6" />
			<circle cx="12" cy="12" r="2" />
		</svg>
	);
}

function GridIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
			<rect x="3" y="3" width="18" height="18" rx="1" />
			<path d="M3 9h18M9 21V9" />
		</svg>
	);
}

function ChartIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
			<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
		</svg>
	);
}

function ArchiveIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
			<polyline points="21 8 21 21 3 21 3 8" />
			<rect x="1" y="3" width="22" height="5" />
			<line x1="10" y1="12" x2="14" y2="12" />
		</svg>
	);
}

const SERVICE_ICONS = [<CircleIcon key="positioning" />, <GridIcon key="placement" />, <ChartIcon key="strategy" />, <ArchiveIcon key="archive" />];

export function getAboutMetadata(locale: Locale): Metadata {
	const copy = getSiteDictionary(locale).about.metadata;

	return createPageMetadata({
		title: copy.title,
		description: copy.description,
		path: '/about',
		keywords: copy.keywords,
		locale,
	});
}

export async function AboutPageView({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
	const dictionary = getSiteDictionary(locale);
	const copy = dictionary.about;
	const isEnglish = locale === 'en';
	const brands = await getSiteClientBrands();
	const rollingBrands = getBrandsWithLogos(brands);
	const storyRevealText = copy.storyLines.join('\n');
	const mobileEnglishStoryRevealText = [
		'We do more than',
		'dress talent.',
		'We study the texture',
		'between star and brand.',
		'Naturally, never forced,',
		'focused on real response',
		'over vanity metrics.',
		'The brands that work with us',
		'long term know exactly why',
		'they come back.',
	].join('\n');
	const contactHref = getLocalizedPath(locale, '/contact');

	return (
		<>
			<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
				<header className="grid gap-10 py-20 lg:py-48">
					<div className="grid gap-6">
						<AnimatedPageTitle
							lines={copy.heroTitleLines}
							className="text-5xl font-light leading-[0.92] tracking-[-0.07em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-7xl lg:text-[7rem]"
						/>
						<p className="max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl sm:leading-9">{copy.heroDescription}</p>
					</div>
				</header>
			</div>

			<section className="relative overflow-hidden border-y border-stone-900/8 bg-[linear-gradient(180deg,#f7f1ea_0%,#fcfaf7_18%,#f3ece5_100%)]">
				<div className="absolute inset-0 bg-[linear-gradient(rgba(117,90,62,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(117,90,62,0.05)_1px,transparent_1px)] bg-size-[28px_28px] opacity-45" />

				<div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
					<div className="overflow-hidden">
						{isEnglish ? (
							<ResponsiveStoryReveal desktopText={storyRevealText} mobileText={mobileEnglishStoryRevealText} />
						) : (
							<TextRevealByWord text={storyRevealText} className="h-[90vh]" />
						)}
					</div>
				</div>
			</section>

			<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
				<div className="grid gap-24 py-10 sm:gap-28 sm:py-14 lg:gap-48 lg:py-40">
					<section className="grid gap-10">
						<div className="grid gap-5 md:grid-cols-2 md:items-end">
							<div className="grid gap-10">
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">{copy.processEyebrow}</p>
								<AnimatedPageTitle
									as="h2"
									lines={[{ text: copy.processTitle }]}
									delay={0.04}
									duration={0.42}
									className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl"
								/>
							</div>
							<p className="max-w-2xl text-base text-balance leading-relaxed text-stone-600 sm:text-lg">{copy.processDescription}</p>
						</div>

						<WorkflowBeam steps={copy.workflowSteps} />
					</section>

					<section className="grid gap-10">
						<div className="grid gap-5 md:grid-cols-2 md:items-end">
							<div className="grid gap-10">
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">{copy.expertiseEyebrow}</p>
								<AnimatedPageTitle
									as="h2"
									lines={[{ text: copy.expertiseTitle }]}
									delay={0.04}
									duration={0.42}
									className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl"
								/>
							</div>
							<p className="max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">{copy.expertiseDescription}</p>
						</div>

						<div className="grid gap-px overflow-hidden border border-stone-900/8 bg-stone-900/8 sm:grid-cols-2">
							{copy.serviceItems.map((item, index) => (
								<article key={item.title} className="grid gap-6 bg-[#faf7f3] p-7 sm:p-8">
									<div className="flex items-center gap-4">
										<div className="flex h-10 w-10 items-center justify-center border border-stone-900/10 bg-white text-[#715a3e]">{SERVICE_ICONS[index]}</div>
										<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">{item.title}</p>
									</div>
									<h3 className="text-2xl tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-3xl">{item.headline}</h3>
									<p className="text-sm text-balance leading-8 text-stone-600 sm:text-base">{item.description}</p>
								</article>
							))}
						</div>
					</section>

					<section className="grid gap-10">
						<div className="grid gap-5 md:grid-cols-2 md:items-end">
							<div className="grid gap-10">
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">{copy.edgeEyebrow}</p>
								<AnimatedPageTitle
									as="h2"
									lines={[{ text: copy.edgeTitle }]}
									delay={0.04}
									duration={0.42}
									className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl"
								/>
							</div>
							<p className="max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">{copy.edgeDescription}</p>
						</div>

						<div className="grid gap-px overflow-hidden border border-stone-900/8 bg-stone-900/8 md:grid-cols-3">
							{copy.edgeItems.map(item => (
								<article key={item.title} className="grid gap-5 bg-[#faf7f3] p-7 sm:p-8">
									<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">{item.title}</p>
									<h3 className="text-3xl tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)]">{item.headline}</h3>
									<p className="text-sm leading-8 text-stone-600 sm:text-base">{item.description}</p>
								</article>
							))}
						</div>
					</section>

					<section className="grid gap-18 md:gap-24">
						<div className="grid gap-5 md:grid-cols-2 md:items-end">
							<div className="grid gap-10">
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">{copy.clientsEyebrow}</p>
								<AnimatedPageTitle
									as="h2"
									lines={[{ text: copy.clientsTitle }]}
									delay={0.04}
									duration={0.42}
									className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl"
								/>
							</div>
							<p className="max-w-2xl text-base text-balance leading-relaxed text-stone-600 sm:text-lg">{copy.clientsDescription}</p>
						</div>

						<div className="grid gap-4 sm:gap-6">
							<ClientLogoMarquee
								brands={rollingBrands.filter((_, i) => i % 2 === 0)}
								emptyLabel={dictionary.partner.emptyLogoLabel}
								className="relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
								trackClassName="about-logo-marquee-track flex min-w-max items-center gap-10 sm:gap-14"
								logoClassName="relative h-10 w-24 shrink-0 opacity-70 transition hover:opacity-100 sm:h-16 sm:w-32"
								imageClassName="object-cover grayscale"
							/>
							<ClientLogoMarquee
								brands={rollingBrands.filter((_, i) => i % 2 !== 0)}
								emptyLabel={dictionary.partner.emptyLogoLabel}
								className="relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
								trackClassName="about-logo-marquee-track-reverse flex min-w-max items-center gap-10 sm:gap-14"
								logoClassName="relative h-10 w-24 shrink-0 opacity-70 transition hover:opacity-100 sm:h-16 sm:w-32"
								imageClassName="object-cover grayscale"
							/>
						</div>

						<div className="relative grid gap-6 overflow-hidden bg-stone-950 px-8 py-10 text-white sm:px-10">
							<div className="pointer-events-none absolute right-0 top-0 h-full select-none opacity-5">
								<Image src="/images/symbol.svg" alt="" width={33} height={30} priority className="h-full w-auto object-contain brightness-0 invert" />
							</div>

							<div className="relative z-10 grid gap-6">
								<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#ccead6]">{copy.collaborationEyebrow}</p>
								<p className="max-w-4xl text-2xl leading-snug tracking-[-0.04em] [font-family:var(--font-newsreader)] sm:text-3xl">
									{copy.collaborationBody[0]}
									<br /> {copy.collaborationBody[1]}
								</p>
								<div>
									<Link
										href={contactHref}
										className="inline-flex items-center justify-center border border-white/16 bg-white/8 px-8 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/14">
										{copy.collaborationCta}
									</Link>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}
