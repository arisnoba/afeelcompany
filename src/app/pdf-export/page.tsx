/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react';

import { DEFAULT_LOCALE, isLocale, type Locale } from '@/i18n/config';
import { getSiteDictionary } from '@/i18n/site-copy';
import type { PdfClientBrand, PdfPortfolioItem } from '@/types/pdf';

import { BrochureSheet } from './_components/BrochureSheet';
import { PdfContactMap } from './_components/PdfContactMap';
import { PdfPreviewWorkspace } from './_components/PdfPreviewWorkspace';
import { getPdfDocument } from './_lib/get-pdf-document';

export const dynamic = 'force-dynamic';

// ── Items per page ──────────────────────────
const WORK_PER_PAGE = 8; // 4×2 grid
const CLIENT_PER_PAGE = 42; // 6×4 grid

const CONTACT_ADDRESS_URL = 'https://naver.me/5WUmv4Fu';

type PdfSearchParams = {
	locale?: string | string[];
};

type PdfAboutCopy = ReturnType<typeof getSiteDictionary>['about'];

// ── Utilities ───────────────────────────────

function chunk<T>(array: T[], size: number): T[][] {
	const result: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size));
	}
	return result;
}

function resolveLocale(value: string | string[] | undefined): Locale {
	const locale = Array.isArray(value) ? value[0] : value;
	return locale && isLocale(locale) ? locale : DEFAULT_LOCALE;
}

function getMailtoHref(email: string): string {
	return `mailto:${email.trim()}`;
}

function getTelHref(phone: string): string {
	const normalized = phone.replace(/[^\d+]/g, '');
	return `tel:${normalized}`;
}

interface PdfImageProps {
	src: string | null | undefined;
	alt: string;
	className: string;
}

function PdfImage({ src, alt, className }: PdfImageProps) {
	if (!src) {
		return (
			<div className={`${className} flex items-center justify-center border border-dashed border-stone-200 bg-stone-50 text-[10px] font-medium uppercase tracking-[0.24em] text-stone-300`}>
				NO IMAGE
			</div>
		);
	}
	return <img src={src} alt={alt} data-pdf-image className={className} />;
}

// ── Section renderers ───────────────────────

interface AboutPageProps {
	pageNum: number;
	totalPages: number;
}

function AboutPageFrame({
	label,
	pageNum,
	totalPages,
	children,
}: AboutPageProps & {
	label: string;
	children: ReactNode;
}) {
	return (
		<div className="relative z-10 flex h-full flex-col px-10 py-9">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="h-px w-6 bg-[#715a3e]" />
					<p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#715a3e]">{label}</p>
				</div>
				<p className="text-[9px] uppercase tracking-[0.24em] text-stone-400">{totalPages > 1 ? `${pageNum} / ${totalPages}` : 'Editorial Profile'}</p>
			</div>

			<div className="flex-1 pt-6">{children}</div>
		</div>
	);
}

// ── Footer bar shared by text-heavy about pages ─

function AboutIntroPage({
	copy,
	locale,
	pageNum,
	totalPages,
}: AboutPageProps & {
	copy: PdfAboutCopy;
	locale: Locale;
}) {
	const storyLines = locale === DEFAULT_LOCALE ? [copy.storyLines.slice(0, 2).join(' '), copy.storyLines.slice(2, 4).join(' '), copy.storyLines.slice(4).join(' ')] : copy.storyLines;

	return (
		<AboutPageFrame label="About AFEEL" pageNum={pageNum} totalPages={totalPages}>
			<div className="h-full">
				<div className="flex w-full h-full flex-col justify-between">
					<div className="grid gap-5">
						<h2 className="text-[7.5rem] leading-[0.93] tracking-[-0.065em] text-stone-950 font-light" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
							{copy.heroTitleLines.map((line, index) => (
								<span key={`${line.text}-${index}`}>
									{line.text}
									{index < copy.heroTitleLines.length - 1 ? <br /> : null}
								</span>
							))}
						</h2>
						<p className="text-base leading-7 text-stone-600">{copy.heroDescription}</p>
					</div>
					<div className="grid gap-5">
						<h2 className="text-[2rem] font-light leading-[1.4em] tracking-[-0.02em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
							{storyLines.map((line, index) => (
								<span key={`${line}-${index}`}>
									{line}
									{index < storyLines.length - 1 ? <br /> : null}
								</span>
							))}
						</h2>
					</div>
				</div>
			</div>
		</AboutPageFrame>
	);
}

// 각 단계의 강조선 위치 (top, %) — 왼쪽에서 오른쪽으로 점진적으로 상승
const STEP_LINE_TOPS = ['70%', '58%', '44%', '32%', '18%'] as const;

function AboutStoryPage({
	copy,
	pageNum,
	totalPages,
}: AboutPageProps & {
	copy: PdfAboutCopy;
}) {
	return (
		<AboutPageFrame label={copy.processEyebrow} pageNum={pageNum} totalPages={totalPages}>
			<div className="flex h-full flex-col gap-20">
				{/* Header */}
				<div className="flex flex-col gap-4">
					<h2 className="text-7xl font-light leading-[0.95] tracking-[-0.06em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
						{copy.processTitle}
					</h2>
					<p className="text-lg leading-7 text-stone-600">{copy.processDescription}</p>
				</div>

				{/* 점진적 상승 단계 컬럼 */}
				<div className="relative flex flex-1">
					{copy.workflowSteps.map((step, index) => (
						<div key={step.title} className="relative flex w-full pl-2 flex-col justify-between border-l border-stone-100">
							{/* 단계 번호 — 상단 */}
							<p className="left-2 text-sm font-semibold tracking-[0.22em] text-stone-300">{String(index + 1).padStart(2, '0')}</p>

							{/* 강조선 — 단계마다 높이 다름 */}
							<div className="absolute left-2 right-2 inset-0 h-px bg-[#715a3e]" style={{ top: STEP_LINE_TOPS[index] }} />

							{/* 콘텐츠 — 강조선 바로 아래 */}
							<div className="absolute inset-x-2" style={{ top: `calc(${STEP_LINE_TOPS[index]} + 20px)` }}>
								<p className="text-lg font-medium whitespace-pre-line leading-tight text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
									{step.description}
								</p>
								{/* <p className="mt-1.5 whitespace-pre-line text-[9px] leading-[1.6] text-stone-500">{step.description}</p> */}
							</div>

							{/* 단계 레이블 — 하단 */}
							<p className="text-xs tracking-widest text-stone-400">{step.title}</p>
						</div>
					))}
				</div>
			</div>
		</AboutPageFrame>
	);
}

function AboutExpertisePage({ copy, pageNum, totalPages }: AboutPageProps & { copy: PdfAboutCopy }) {
	return (
		<AboutPageFrame label={copy.expertiseEyebrow} pageNum={pageNum} totalPages={totalPages}>
			<div className="flex h-full flex-col gap-20">
				<div className="flex flex-col gap-8">
					<h2 className="text-7xl font-light leading-[0.95] tracking-[-0.06em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
						{copy.expertiseTitle}
					</h2>
					<p className="text-base leading-7 text-stone-600">{copy.expertiseDescription}</p>
				</div>

				<div className="grid flex-1 gap-px overflow-hidden border border-stone-900/8 bg-stone-900/8" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
					{copy.serviceItems.map(item => (
						<article key={item.title} className="grid content-start gap-4 bg-[#faf7f3] p-8">
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">{item.title}</p>
							<h3 className="text-3xl font-light leading-none tracking-[-0.05em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
								{item.headline}
							</h3>
							<p className="text-base leading-7 text-stone-600">{item.description}</p>
						</article>
					))}
				</div>
			</div>
		</AboutPageFrame>
	);
}

function AboutEdgePage({ copy, pageNum, totalPages }: AboutPageProps & { copy: PdfAboutCopy }) {
	return (
		<AboutPageFrame label={copy.edgeEyebrow} pageNum={pageNum} totalPages={totalPages}>
			<div className="flex h-full flex-col gap-5 justify-between">
				<div className="grid gap-4">
					<div className="flex items-end justify-between gap-8">
						<h2 className="text-7xl font-light leading-[0.95] tracking-[-0.06em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
							{copy.edgeTitle}
						</h2>
						<p className="text-right text-[12px] leading-7 text-stone-600">{copy.edgeDescription}</p>
					</div>
				</div>

				<div className="grid gap-px overflow-hidden border border-stone-900/8 bg-stone-900/8 md:grid-cols-3">
					{copy.edgeItems.map(item => (
						<article key={item.title} className="grid content-start gap-4 bg-[#faf7f3] p-8">
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">{item.title}</p>
							<h3 className="text-2xl font-light leading-none tracking-[-0.05em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
								{item.headline}
							</h3>
							<p className="text-base leading-7 text-stone-600">{item.description}</p>
						</article>
					))}
				</div>
			</div>
		</AboutPageFrame>
	);
}

interface WorkSheetProps {
	items: PdfPortfolioItem[];
	pageNum: number;
	totalPages: number;
}

function WorkSheet({ items, pageNum, totalPages }: WorkSheetProps) {
	return (
		<div className="flex h-full flex-col px-8 py-7">
			<div className="mb-5 flex items-center justify-between border-b border-stone-100 pb-4">
				<div className="flex items-center gap-3">
					<span className="h-px w-6 bg-[#715a3e]" />
					<p className="text-[9px] font-medium uppercase tracking-[0.36em] text-stone-400">Work</p>
				</div>
				<p className="text-[9px] uppercase tracking-[0.2em] text-stone-300">{totalPages > 1 ? `${pageNum} / ${totalPages}` : 'Selected Portfolio'}</p>
			</div>

			<div
				className="grid flex-1 gap-4"
				style={{
					gridTemplateColumns: 'repeat(4, 1fr)',
					gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
				}}>
				{items.map(item => (
					<article key={item.id} className="avoid-break flex h-full min-h-0 flex-col overflow-hidden border border-stone-900/8 bg-white">
						<div className="relative flex-1 min-h-0 bg-stone-100">
							<PdfImage src={item.imageUrl} alt={item.title} className="absolute inset-0 h-full w-full object-cover object-center" />
						</div>

						<div className="grid gap-1 border-t border-stone-900/8 bg-[#fcfaf7] px-4 py-3 text-stone-950">
							<p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#715a3e]">{item.brandName}</p>
							<p className="text-[16px] font-light leading-tight tracking-[-0.04em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
								{item.celebrityName ?? item.title}
							</p>
							{/* {item.celebrityName ? <p className="text-[9px] leading-4 text-stone-500">{item.title}</p> : null} */}
						</div>
					</article>
				))}
			</div>
		</div>
	);
}

interface ClientSheetProps {
	brands: PdfClientBrand[];
	pageNum: number;
	totalPages: number;
	totalBrands: number;
}

function ClientSheet({ brands, pageNum, totalPages, totalBrands }: ClientSheetProps) {
	return (
		<div className="flex h-full flex-col px-8 py-7">
			<div className="mb-5 flex items-center justify-between border-b border-stone-100 pb-4">
				<div className="flex items-center gap-3">
					<span className="h-px w-6 bg-[#715a3e]" />
					<p className="text-[9px] font-medium uppercase tracking-[0.36em] text-stone-400">Client</p>
				</div>
				<p className="text-[9px] uppercase tracking-[0.2em] text-stone-300">{totalPages > 1 ? `${pageNum} / ${totalPages}  ·  ${totalBrands} Brands` : `${totalBrands} Brands`}</p>
			</div>

			<div
				className="grid flex-1 gap-3"
				style={{
					gridTemplateColumns: 'repeat(6, 1fr)',
					gridAutoRows: '1fr',
				}}>
				{brands.map(brand => (
					<article key={brand.id} className="avoid-break flex flex-col items-center justify-center gap-2 overflow-hidden  bg-white h-full">
						{brand.logoUrl ? (
							<img src={brand.logoUrl} alt={brand.name} className="h-20 w-full object-cover" />
						) : (
							<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">{brand.name}</p>
						)}
					</article>
				))}
			</div>
		</div>
	);
}

// ── Page ────────────────────────────────────

export default async function PdfExportPage({ searchParams }: { searchParams?: Promise<PdfSearchParams> }) {
	const resolvedSearchParams = await searchParams;
	const locale = resolveLocale(resolvedSearchParams?.locale);
	const dictionary = getSiteDictionary(locale);
	const brochure = await getPdfDocument(locale);

	const workChunks = chunk(brochure.workItems, WORK_PER_PAGE);
	const clientChunks = chunk(brochure.clientBrands, CLIENT_PER_PAGE);

	const sections: { id: string; node: ReactNode }[] = [];

	// Cover
	sections.push({
		id: 'cover',
		node: (
			<BrochureSheet sectionId="cover">
				<div className="relative h-full overflow-hidden">
					{/* Background Logo */}
					<div className="absolute inset-y-0 right-0 h-full w-full opacity-[0.05] flex justify-end">
						<PdfImage src={brochure.heroImageUrl} alt={`${brochure.title}`} className="h-full w-full object-contain invert" />
					</div>

					{/* Content */}
					<div className="relative z-10 flex h-full flex-col justify-between px-12 py-10">
						<div className="flex items-center gap-4">
							<span className="h-px w-10 bg-[#715a3e]" />
							<span className="text-[9px] font-semibold uppercase tracking-[0.44em] text-[#715a3e]">Afeel Company</span>
						</div>

						<div className="grid gap-5">
							<h1 className="w-full text-9xl leading-[0.91] tracking-[-0.05em] font-light text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
								Fashion PR
								<br />
								<span className="italic text-[#715a3e] font-light">& Styling.</span>
							</h1>
							<p className="max-w-[32ch] text-base leading-7 text-stone-600">{dictionary.home.metadata.description}</p>
						</div>

						<div className="flex items-end justify-between border-t border-stone-900/8 pt-6">
							<div>
								<p className="text-[9px] uppercase tracking-[0.28em] text-stone-400">Issue Date</p>
								<p className="mt-1 text-[15px] font-medium text-stone-950">{brochure.issueDate}</p>
							</div>
							<p className="text-[9px] uppercase tracking-[0.24em] text-stone-300">afeelcompany.com</p>
						</div>
					</div>
				</div>
			</BrochureSheet>
		),
	});

	// About
	const aboutSections: { key: string; render: (pageNum: number, totalPages: number) => ReactNode }[] = [
		{
			key: 'intro',
			render: (pageNum, totalPages) => <AboutIntroPage copy={dictionary.about} locale={locale} pageNum={pageNum} totalPages={totalPages} />,
		},
		{
			key: 'story',
			render: (pageNum, totalPages) => <AboutStoryPage copy={dictionary.about} pageNum={pageNum} totalPages={totalPages} />,
		},
		{
			key: 'expertise',
			render: (pageNum, totalPages) => <AboutExpertisePage copy={dictionary.about} pageNum={pageNum} totalPages={totalPages} />,
		},
		{
			key: 'edge',
			render: (pageNum, totalPages) => <AboutEdgePage copy={dictionary.about} pageNum={pageNum} totalPages={totalPages} />,
		},
	];

	aboutSections.forEach((section, index) => {
		const pageNum = index + 1;
		const totalPages = aboutSections.length;
		const sectionId = `about-${pageNum}-${totalPages}`;

		sections.push({
			id: sectionId,
			node: <BrochureSheet sectionId={sectionId}>{section.render(pageNum, totalPages)}</BrochureSheet>,
		});
	});

	// Work — one page per 4×2 chunk
	workChunks.forEach((items, i) => {
		const pageNum = i + 1;
		const totalPages = workChunks.length;
		sections.push({
			id: `work-${pageNum}-${totalPages}`,
			node: (
				<BrochureSheet sectionId={`work-${pageNum}-${totalPages}`}>
					<WorkSheet items={items} pageNum={pageNum} totalPages={totalPages} />
				</BrochureSheet>
			),
		});
	});

	// Client — one page per chunk of 12
	clientChunks.forEach((brands, i) => {
		const pageNum = i + 1;
		const totalPages = clientChunks.length;
		sections.push({
			id: `client-${pageNum}-${totalPages}`,
			node: (
				<BrochureSheet sectionId={`client-${pageNum}-${totalPages}`}>
					<ClientSheet brands={brands} pageNum={pageNum} totalPages={totalPages} totalBrands={brochure.clientBrands.length} />
				</BrochureSheet>
			),
		});
	});

	// Contact
	const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();

	sections.push({
		id: 'contact',
		node: (
			<BrochureSheet sectionId="contact">
				<div className="grid h-full" style={{ gridTemplateColumns: '50% 50%' }}>
					{/* Left: Contact details */}
					<div className="flex flex-col justify-between px-12 py-10 border-r border-stone-900/8">
						<div className="grid gap-2">
							<div className="flex items-center gap-3">
								<span className="h-px w-6 bg-[#715a3e]" />
								<p className="text-[9px] font-medium uppercase tracking-[0.36em] text-stone-400">Contact</p>
							</div>
							<h2 className="text-[2.6rem] font-light leading-[0.95] tracking-[-0.06em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
								Get In Touch.
							</h2>
						</div>

						<dl className="grid gap-7">
							<div className="grid gap-1.5">
								<dt className="text-[9px] uppercase tracking-[0.32em] text-stone-400">{dictionary.contact.emailLabel}</dt>
								<dd>
									<a href={getMailtoHref(brochure.contact.email)} className="text-[18px] font-medium text-stone-950 underline decoration-stone-300 underline-offset-4">
										{brochure.contact.email}
									</a>
								</dd>
							</div>
							<div className="h-px bg-stone-100" />
							<div className="grid gap-1.5">
								<dt className="text-[9px] uppercase tracking-[0.32em] text-stone-400">{dictionary.contact.directLabel}</dt>
								<dd>
									<a href={getTelHref(brochure.contact.phone)} className="text-[18px] font-medium text-stone-950 underline decoration-stone-300 underline-offset-4">
										{brochure.contact.phone}
									</a>
								</dd>
							</div>
							<div className="h-px bg-stone-100" />
							<div className="grid gap-1.5">
								<dt className="text-[9px] uppercase tracking-[0.32em] text-stone-400">{dictionary.contact.addressLabel}</dt>
								<dd>
									<a href={CONTACT_ADDRESS_URL} target="_blank" rel="noreferrer" className="text-[18px] font-medium text-stone-950 underline decoration-stone-300 underline-offset-4">
										{brochure.contact.address}
									</a>
								</dd>
							</div>
							<div className="h-px bg-stone-100" />
							<div className="grid gap-1.5">
								<dt className="text-[9px] uppercase tracking-[0.32em] text-stone-400">{dictionary.footer.siteLabel}</dt>
								<dd>
									<a href="https://afeelcompany.com" className="text-[18px] font-medium text-stone-950 underline decoration-stone-300 underline-offset-4">
										afeelcompany.com
									</a>
								</dd>
							</div>
						</dl>

						<p className="text-[9px] uppercase tracking-[0.24em] text-stone-300">AFEEL Company · Seoul, Korea</p>
					</div>

					{/* Right: Map */}
					<div className="relative overflow-hidden">
						<PdfContactMap address={brochure.contact.address} apiKey={googleMapsApiKey} />
					</div>
				</div>
			</BrochureSheet>
		),
	});

	return <PdfPreviewWorkspace sections={sections} locale={locale} />;
}
