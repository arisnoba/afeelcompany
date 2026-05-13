import Link from 'next/link';
import type { Metadata } from 'next';

import { AnimatedPageTitle } from '@/components/ui/animated-page-title';
import { LOCALE_LANG_TAGS, type Locale, getLocalizedPath } from '@/i18n/config';
import { SITE_NAME, createPageMetadata, toAbsoluteUrl } from '@/lib/seo';

const PAGE_PATH = '/kpop-celebrity-placement';

const metadata = {
	title: '韩流明星造型协赞与韩国艺人品牌合作',
	description:
		'AFEEL COMPANY 帮助中国时尚品牌连接韩国韩流明星、K-pop 艺人与演员资源，提供服装、配饰、鞋履等造型协赞、品牌曝光、媒体露出确认与执行报告。',
	keywords: [
		'韩国明星服装赞助',
		'韩流明星造型协赞',
		'K-pop明星造型协赞',
		'韩国艺人品牌合作',
		'韩国演员品牌合作',
		'韩国明星穿搭曝光',
		'韩国明星同款推广',
		'韩国娱乐圈品牌推广',
		'韩国明星配饰赞助',
		'Korean celebrity product placement',
		'K-pop star product placement',
		'Korean celebrity fashion PR',
		'Hallyu star fashion sponsorship',
		'Korean actor styling placement',
		'Korean celebrity seeding agency',
		'fashion PR agency Korea',
	],
};

const searchTerms = ['韩国明星服装赞助', 'K-pop明星造型协赞', '韩国艺人品牌合作', '韩国明星穿搭曝光', '韩国明星同款推广', '韩国明星配饰赞助'];

const processSteps = [
	{ label: '01', title: '品牌分析', description: '确认品牌定位、目标艺人气质、产品类别与希望获得的曝光场景。' },
	{ label: '02', title: '艺人匹配', description: '根据品牌风格筛选适合的韩流明星、K-pop 艺人、演员及造型场景。' },
	{ label: '03', title: '产品执行', description: '协助沟通造型需求、产品寄送、样衣管理和现场协赞执行。' },
	{ label: '04', title: '曝光确认', description: '追踪社交媒体、节目、活动、机场穿搭和媒体图片中的实际露出。' },
	{ label: '05', title: '结果报告', description: '整理曝光记录、图片链接、艺人信息与后续合作建议，形成执行报告。' },
];

const serviceItems = [
	{ title: '服装协赞', description: '女装、男装、设计师品牌和季节性系列的艺人造型协赞。' },
	{ title: '配饰与鞋履', description: '包袋、鞋履、饰品等更适合造型露出的单品协作。' },
	{ title: '品牌曝光管理', description: '围绕明星穿搭、社交媒体传播和媒体报道确认真实曝光。' },
	{ title: '韩国本地执行', description: '以首尔为基础处理沟通、产品流转、造型团队协作和记录归档。' },
];

const faqItems = [
	{
		question: '中国品牌可以通过 AFEEL COMPANY 接触 K-pop 明星协赞吗？',
		answer: '可以。我们会先判断品牌定位、产品类别和目标艺人风格，再评估适合的韩国艺人造型协赞路径。',
	},
	{
		question: '适合哪些品牌咨询？',
		answer: '服装、配饰、鞋履、美妆和生活方式品牌都可以咨询，尤其适合希望通过韩国艺人穿搭获得品牌曝光的中国品牌。',
	},
	{
		question: '合作后会提供曝光记录吗？',
		answer: '会。我们会整理媒体露出、社交平台链接、图片记录和后续建议，方便品牌内部复盘和二次传播。',
	},
];

export function getKpopPlacementMetadata(locale: Locale): Metadata {
	const pageMetadata = createPageMetadata({
		title: metadata.title,
		description: metadata.description,
		path: PAGE_PATH,
		keywords: metadata.keywords,
		locale,
	});

	const localizedPath = getLocalizedPath(locale, PAGE_PATH);

	return {
		...pageMetadata,
		alternates: {
			canonical: localizedPath,
			languages: {
				zh: localizedPath,
				'x-default': localizedPath,
			},
		},
	};
}

function buildKpopPlacementJsonLd(locale: Locale) {
	const pageUrl = toAbsoluteUrl(getLocalizedPath(locale, PAGE_PATH));
	const serviceId = `${pageUrl}#service`;

	return [
		{
			'@context': 'https://schema.org',
			'@type': 'Service',
			'@id': serviceId,
			name: metadata.title,
			description: metadata.description,
			provider: {
				'@type': 'Organization',
				name: SITE_NAME,
				url: toAbsoluteUrl('/'),
			},
			areaServed: ['China', 'South Korea'],
			serviceType: ['韩流明星造型协赞', 'K-pop明星造型协赞', '韩国艺人品牌合作', '韩国明星服装赞助', 'Korean celebrity fashion PR', 'K-pop star product placement'],
			availableLanguage: ['zh-Hans', 'ko', 'en'],
			url: pageUrl,
		},
		{
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: faqItems.map(item => ({
				'@type': 'Question',
				name: item.question,
				acceptedAnswer: {
					'@type': 'Answer',
					text: item.answer,
				},
			})),
		},
		{
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: metadata.title,
			description: metadata.description,
			url: pageUrl,
			inLanguage: LOCALE_LANG_TAGS[locale],
			mainEntity: {
				'@id': serviceId,
			},
		},
	];
}

export function KpopPlacementPageView({ locale }: { locale: Locale }) {
	const contactHref = getLocalizedPath(locale, '/contact');
	const portfolioHref = getLocalizedPath(locale, '/portfolio');
	const aboutHref = getLocalizedPath(locale, '/about');
	const jsonLd = JSON.stringify(buildKpopPlacementJsonLd(locale)).replace(/</g, '\\u003c');

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

			<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
				<header className="grid gap-12 py-20 sm:py-24 lg:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.62fr)] lg:items-end lg:gap-16 lg:py-36">
					<div className="grid gap-8">
						<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">China Brand Desk</p>
						<AnimatedPageTitle
							lines={[{ text: 'K-pop明星' }, { text: '造型协赞.' }]}
							className="max-w-5xl text-[clamp(3.3rem,8vw,7.2rem)] font-light leading-[0.94] tracking-[-0.07em] text-stone-950 [font-family:var(--font-newsreader)]"
						/>
					</div>

					<div className="grid gap-8 border-t border-stone-900/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
						<p className="text-lg leading-8 text-stone-600 sm:text-xl sm:leading-9">
							AFEEL COMPANY 帮助中国时尚品牌进入韩国明星造型场景。我们连接韩流明星、K-pop 艺人、演员与造型团队，执行服装、配饰、鞋履等协赞，并确认真实曝光结果。
						</p>
						<div className="flex flex-wrap gap-3">
							<Link
								href={contactHref}
								className="inline-flex h-12 items-center justify-center bg-stone-950 px-6 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-stone-800 active:translate-y-px">
								咨询合作
							</Link>
							<Link
								href={portfolioHref}
								className="inline-flex h-12 items-center justify-center border border-stone-300 px-6 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-stone-950 transition hover:border-stone-950 active:translate-y-px">
								查看案例
							</Link>
						</div>
					</div>
				</header>

				<section className="border-y border-stone-900/8 bg-[#faf7f3] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
					<div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-start">
						<div className="grid gap-3">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">Search Intent</p>
							<h2 className="text-3xl font-light leading-tight tracking-[-0.04em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-4xl">中国品牌会怎样搜索？</h2>
						</div>
						<div className="flex flex-wrap gap-3">
							{searchTerms.map(term => (
								<span key={term} className="border border-stone-900/10 bg-white/70 px-4 py-3 text-sm font-medium text-stone-700">
									{term}
								</span>
							))}
						</div>
					</div>
				</section>

				<div className="grid gap-24 py-16 sm:gap-28 sm:py-24 lg:gap-36 lg:py-36">
					<section className="grid gap-10">
						<div className="grid gap-4 md:grid-cols-[0.74fr_1fr] md:items-end">
							<div className="grid gap-4">
								<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">What We Handle</p>
								<h2 className="text-4xl font-light leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl">从产品到曝光的韩国本地执行</h2>
							</div>
							<p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
								协赞不是简单寄出产品。关键在于品牌调性、艺人风格、造型场景和曝光记录是否能连成完整链路。
							</p>
						</div>

						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.05fr_0.82fr_1.05fr_0.82fr]">
							{serviceItems.map((item, index) => (
								<article key={item.title} className="grid min-h-48 content-between border border-stone-900/10 bg-white p-6">
									<p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-stone-400">0{index + 1}</p>
									<div className="grid gap-3">
										<h3 className="text-2xl font-light tracking-[-0.04em] text-stone-950 [font-family:var(--font-newsreader)]">{item.title}</h3>
										<p className="text-sm leading-6 text-stone-600">{item.description}</p>
									</div>
								</article>
							))}
						</div>
					</section>

					<section className="grid gap-10">
						<div className="grid gap-4 md:grid-cols-[0.82fr_1fr] md:items-end">
							<h2 className="text-4xl font-light leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl">合作流程</h2>
							<p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">从前期判断到结果归档，流程以可确认的执行记录为中心。</p>
						</div>

						<div className="grid divide-y divide-stone-900/10 border-y border-stone-900/10">
							{processSteps.map(step => (
								<article key={step.label} className="grid gap-5 py-7 md:grid-cols-[8rem_0.45fr_1fr] md:items-start md:gap-8">
									<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">STEP {step.label}</p>
									<h3 className="text-xl font-semibold tracking-[-0.02em] text-stone-950">{step.title}</h3>
									<p className="max-w-3xl text-base leading-7 text-stone-600">{step.description}</p>
								</article>
							))}
						</div>
					</section>

					<section className="grid gap-10 lg:grid-cols-[0.86fr_1fr] lg:items-start">
						<div className="sticky top-28 grid gap-5 self-start">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">FAQ</p>
							<h2 className="text-4xl font-light leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl">中国品牌常见问题</h2>
						</div>

						<div className="grid gap-4">
							{faqItems.map(item => (
								<article key={item.question} className="border border-stone-900/10 bg-[#faf7f3] p-6 sm:p-8">
									<h3 className="text-lg font-semibold leading-7 text-stone-950">{item.question}</h3>
									<p className="mt-4 text-base leading-7 text-stone-600">{item.answer}</p>
								</article>
							))}
						</div>
					</section>

					<section className="relative overflow-hidden bg-stone-950 px-6 py-12 text-white sm:px-10 sm:py-14">
						<div className="pointer-events-none absolute right-[-6rem] top-[-8rem] h-72 w-72 rounded-full border border-white/8" />
						<div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
							<div className="grid gap-4">
								<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#ccead6]">For China Brands</p>
								<p className="max-w-4xl text-2xl leading-snug tracking-[-0.04em] [font-family:var(--font-newsreader)] sm:text-3xl">
									如果你的品牌希望通过韩国韩流明星、K-pop 艺人或演员穿搭获得真实曝光，请先发送品牌资料、产品类别和目标合作方向。
								</p>
							</div>
							<div className="flex flex-wrap gap-3">
								<Link href={aboutHref} className="inline-flex h-12 items-center justify-center border border-white/16 px-6 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-white/10 active:translate-y-px">
									了解 AFEEL
								</Link>
								<Link href={contactHref} className="inline-flex h-12 items-center justify-center bg-white px-6 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-stone-950 transition hover:bg-stone-100 active:translate-y-px">
									提交咨询
								</Link>
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}
