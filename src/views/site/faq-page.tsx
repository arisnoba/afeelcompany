import { Plus } from 'lucide-react';

import { CollaborationCta } from '@/components/site/CollaborationCta';
import { AnimatedPageTitle } from '@/components/ui/animated-page-title';
import { FAQ_PAGE_COPY, getPublishedFaqGroups } from '@/content/faq';
import { DEFAULT_LOCALE, LOCALE_LANG_TAGS, getLocalizedPath, type Locale } from '@/i18n/config';
import { WEBSITE_ID, createPageMetadata, toAbsoluteUrl } from '@/lib/seo';

export function getFaqMetadata(locale: Locale) {
	const copy = FAQ_PAGE_COPY[locale];
	return createPageMetadata({ title: copy.title, description: copy.description, path: '/faq', locale });
}

export function FaqPageView({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
	const copy = FAQ_PAGE_COPY[locale];
	const groups = getPublishedFaqGroups(locale);
	const pageUrl = toAbsoluteUrl(getLocalizedPath(locale, '/faq'));
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		'@id': `${pageUrl}#faq`,
		url: pageUrl,
		name: copy.title,
		description: copy.description,
		inLanguage: LOCALE_LANG_TAGS[locale],
		isPartOf: { '@id': WEBSITE_ID },
		mainEntity: groups.flatMap(group => group.items.map(item => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: { '@type': 'Answer', text: item.answer.join('\n\n') },
		}))),
	};

	return (
		<div className={`mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10 ${locale === 'ko' ? 'break-keep' : '[word-break:normal]'}`}>
			{groups.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />}
			<div className="grid gap-14 py-12 sm:gap-16 sm:py-16 lg:gap-20 lg:py-20">
				<header className="block space-y-6">
					<div>
						<AnimatedPageTitle
							lines={copy.heading.split('\n').map(text => ({ text }))}
							className="mt-5 text-5xl font-light leading-none tracking-[-0.07em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-6xl md:text-7xl"
						/>
					</div>
					<p className="whitespace-pre-line text-base leading-8 text-stone-600 sm:text-lg sm:leading-9">{copy.intro}</p>
				</header>

				<div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:gap-20">
					{groups.length > 0 && (
						<nav aria-label={copy.categoryLabel} className="self-start lg:sticky lg:top-32">
							<p className="mb-5 text-xs font-semibold tracking-wide text-stone-500">{copy.categoryLabel}</p>
							<ul className="flex flex-wrap gap-2 lg:grid">
								{groups.map(group => (
									<li key={group.id}>
										<a href={`#${group.id}`} className="inline-flex items-center bg-[#f6f3f2] px-4 py-2 text-sm text-stone-700 transition-colors hover:bg-[#eae7e5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#274133] lg:bg-transparent lg:px-0 lg:font-semibold lg:hover:bg-transparent lg:hover:text-[#274133]">{group.label}</a>
									</li>
								))}
							</ul>
						</nav>
					)}

					<div className="grid min-w-0 gap-14 sm:gap-20">
						{groups.map(group => (
							<section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="scroll-mt-32">
								<div className="mb-6 flex items-baseline gap-4">
									<h2 id={`${group.id}-title`} className="text-xl sm:text-2xl font-semibold tracking-[-0.03em]">{group.label}</h2>
								</div>
								<div className="border-t border-stone-200">
									{group.items.map(item => (
										<details key={item.id} id={`question-${item.id}`} name="faq" className="group scroll-mt-32 border-b border-stone-200">
											<summary className="relative cursor-pointer list-none py-6 pr-10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#274133] [&::-webkit-details-marker]:hidden">
												<h3 className="text-base font-normal leading-7 tracking-[-0.02em] group-open:font-semibold sm:text-lg">{item.question}</h3>
												<Plus aria-hidden="true" className="absolute right-0 top-7 size-4 text-[#274133] transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none" strokeWidth={1.5} />
											</summary>
											<div className="grid gap-2 pb-7 pr-10 text-base leading-8 text-stone-600">
												{item.answer.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
											</div>
										</details>
									))}
								</div>
							</section>
						))}
					</div>
				</div>

				<CollaborationCta locale={locale} />
			</div>
		</div>
	);
}
