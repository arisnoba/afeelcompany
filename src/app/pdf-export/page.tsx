/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react';

import type { PdfClientBrand, PdfPortfolioItem } from '@/types/pdf';

import { BrochureSheet } from './_components/BrochureSheet';
import { PdfContactMap } from './_components/PdfContactMap';
import { PdfPreviewWorkspace } from './_components/PdfPreviewWorkspace';
import { getPdfDocument } from './_lib/get-pdf-document';

export const dynamic = 'force-dynamic';

// ── Items per page ──────────────────────────
const WORK_PER_PAGE = 8; // 4×2 grid
const CLIENT_PER_PAGE = 42; // 6×4 grid
const ABOUT_INTRO_LIMIT = 380;
const ABOUT_STORY_LIMIT = 520;
const ABOUT_CONTINUATION_LIMIT = 760;

const ABOUT_EDGE_ITEMS = [
	{
		title: 'Strategic Curation',
		headline: '기획된 우연',
		description: '브랜드 이미지에 부합하는 셀럽을 매칭합니다.',
	},
	{
		title: 'Endless Archive',
		headline: '꼼꼼한 기록',
		description: '노출 현황을 누락 없이 실시간으로 공유합니다.',
	},
	{
		title: 'Proven Impact',
		headline: '확실한 결과',
		description: '판매 성과와 지표로 이어지는 작업을 지향합니다.',
	},
] as const;

const ABOUT_FOCUS_ITEMS = [
	{
		label: 'Positioning',
		value: '브랜드 포지셔닝',
	},
	{
		label: 'Placement',
		value: '에디토리얼 플레이스먼트',
	},
	{
		label: 'Archive',
		value: '아카이브 관리',
	},
] as const;

const ABOUT_STORY_LINES = [
	'의류 협찬에서 끝내지 않습니다.',
	'스타의 이미지와 브랜드의 미학을 먼저 읽습니다.',
	'그 만남이 자연스러운 콘텐츠가 되도록 배치합니다.',
	'숫자를 부풀리기보다, 실제로 일어나는 일에 집중합니다.',
] as const;

const ABOUT_SERVICE_ITEMS = [
	{
		title: 'Brand Positioning',
		headline: '브랜드 포지셔닝',
		description: '브랜드의 지향점에 맞춰 노출 전략을 수립합니다.',
	},
	{
		title: 'Editorial Placement',
		headline: '에디토리얼 플레이스먼트',
		description: '매체 특성에 맞는 적합한 스타일링과 협찬을 진행합니다.',
	},
	{
		title: 'Digital Strategy',
		headline: '디지털 전략',
		description: '데이터를 바탕으로 검색량 및 판매 전환에 기여합니다.',
	},
	{
		title: 'Archive Management',
		headline: '아카이브 관리',
		description: '모든 활동 내역을 기록하여 체계적으로 관리합니다.',
	},
] as const;

const ABOUT_SOCIAL_PROOF_LINES = ['새로운 시즌 PR을 준비하는 브랜드.', '의류 협찬 및 스타일링이 필요한 관계자.', '어필컴퍼니로 문의해 주시기 바랍니다.'] as const;

const WORKFLOW_STEPS = [
	{ label: 'STEP 01', title: 'STRATEGY', description: '브랜드 분석 및\n목표 설정' },
	{ label: 'STEP 02', title: 'MATCHING', description: '아티스트 큐레이션 및\n리스트 확정' },
	{ label: 'STEP 03', title: 'EXECUTION', description: '현장 협찬 실행 및\n제품 핸들링' },
	{ label: 'STEP 04', title: 'EXPOSURE', description: '다양한 미디어 채널\n노출 확인' },
	{ label: 'STEP 05', title: 'ANALYSIS', description: '성과 데이터 분석 및\n사후 리포트' },
] as const;

const CONTACT_ADDRESS_URL = 'https://naver.me/5WUmv4Fu';

// ── Utilities ───────────────────────────────

function chunk<T>(array: T[], size: number): T[][] {
	const result: T[][] = [];
	for (let i = 0; i < array.length; i += size) {
		result.push(array.slice(i, i + size));
	}
	return result;
}

function normalizeAboutText(text: string): string {
	const normalized = text
		.replace(/\r\n?/g, '\n')
		.split(/\n{2,}/)
		.map(paragraph => paragraph.replace(/\s+/g, ' ').trim())
		.filter(Boolean)
		.join('\n\n');

	return normalized || text.replace(/\s+/g, ' ').trim();
}

function takeTextChunk(text: string, limit: number): [string, string] {
	if (text.length <= limit) {
		return [text.trim(), ''];
	}

	const breakpoints = ['\n\n', '. ', '! ', '? ', '.\n', '!\n', '?\n', '다. ', '요. ', ' '];
	let splitIndex = -1;

	for (const breakpoint of breakpoints) {
		const index = text.lastIndexOf(breakpoint, limit);

		if (index >= Math.floor(limit * 0.55)) {
			splitIndex = index + breakpoint.length;
			break;
		}
	}

	if (splitIndex === -1) {
		splitIndex = limit;
	}

	return [text.slice(0, splitIndex).trim(), text.slice(splitIndex).trim()];
}

function toParagraphs(text: string): string[] {
	return text
		.split(/\n+/)
		.map(paragraph => paragraph.trim())
		.filter(Boolean);
}

function getStoryCards(pageNum: number): string[] {
	const start = ((pageNum - 1) * 2) % ABOUT_STORY_LINES.length;
	return [ABOUT_STORY_LINES[start], ABOUT_STORY_LINES[(start + 1) % ABOUT_STORY_LINES.length]];
}

function getMailtoHref(email: string): string {
	return `mailto:${email.trim()}`;
}

function getTelHref(phone: string): string {
	const normalized = phone.replace(/[^\d+]/g, '');
	return `tel:${normalized}`;
}

function splitAboutNarrative(text: string) {
	const normalized = normalizeAboutText(text);
	const [introText, afterIntro] = takeTextChunk(normalized, ABOUT_INTRO_LIMIT);
	const [storyText, afterStory] = afterIntro ? takeTextChunk(afterIntro, ABOUT_STORY_LIMIT) : ['효과적인 노출로 브랜드 인지도를 높이는 데 집중합니다.', ''];

	const continuations: string[] = [];
	let remaining = afterStory;

	while (remaining) {
		const [pageText, rest] = takeTextChunk(remaining, ABOUT_CONTINUATION_LIMIT);
		continuations.push(pageText);
		remaining = rest;
	}

	return {
		introParagraphs: toParagraphs(introText),
		storyParagraphs: toParagraphs(storyText),
		continuationParagraphs: continuations.map(toParagraphs),
	};
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
	paragraphs,
	pageNum,
	totalPages,
}: AboutPageProps & {
	paragraphs: string[];
}) {
	return (
		<AboutPageFrame label="About AFEEL" pageNum={pageNum} totalPages={totalPages}>
			<div className="grid h-full gap-10" style={{ gridTemplateColumns: '42% 58%' }}>
				{/* Left: Identity */}
				<div className="flex flex-col justify-between border-r border-stone-900/8 pr-8">
					<div className="grid gap-5">
						<p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">Results, not promises.</p>
						<h2 className="text-[3rem] leading-[0.93] tracking-[-0.065em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
							스타일링 협찬을 통해
							<br />
							브랜드의 가시성을
							<br />
							<span className="italic text-[#715a3e]">높입니다.</span>
						</h2>
						<p className="text-[12px] leading-7 text-stone-600">스타일링 협찬을 통해 브랜드의 가시성을 높입니다.</p>
					</div>

					<div className="grid gap-px overflow-hidden border border-stone-900/8 bg-stone-900/8">
						{ABOUT_FOCUS_ITEMS.map(item => (
							<div key={item.label} className="grid gap-1 bg-[#faf7f3] px-5 py-4">
								<p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-stone-400">{item.label}</p>
								<p className="text-[12px] font-medium leading-5 text-stone-800">{item.value}</p>
							</div>
						))}
					</div>
				</div>

				{/* Right: Editorial text */}
				<div className="flex h-full flex-col justify-between pl-2">
					<div className="grid gap-5">
						<div className="flex items-center gap-3">
							<span className="h-px w-4 bg-stone-300" />
							<p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-stone-400">Editorial Note</p>
						</div>
						<div className="h-px bg-stone-900/8" />
						{paragraphs.map((paragraph, index) => (
							<p key={`intro-${index}`} className="text-[13.5px] leading-[2.05] text-stone-600">
								{paragraph}
							</p>
						))}
					</div>

					<div className="flex items-center justify-between border-t border-stone-900/8 pt-4">
						<p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-stone-400">Fashion PR Editorial Archive</p>
						<p className="text-[9px] uppercase tracking-[0.24em] text-stone-300">afeelcompany.com</p>
					</div>
				</div>
			</div>
		</AboutPageFrame>
	);
}

// 각 단계의 강조선 위치 (top, %) — 왼쪽에서 오른쪽으로 점진적으로 상승
const STEP_LINE_TOPS = ['70%', '58%', '44%', '32%', '18%'] as const;

function AboutStoryPage({
	pageNum,
	totalPages,
}: AboutPageProps & {
	paragraphs: string[];
}) {
	return (
		<AboutPageFrame label="Our Process" pageNum={pageNum} totalPages={totalPages}>
			<div className="flex h-full flex-col gap-20">
				{/* Header */}
				<div className="flex flex-col gap-4">
					<h2 className="text-5xl leading-[0.95] tracking-[-0.06em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
						How It Works
					</h2>
					<p className="text-lg leading-7 text-stone-600">브랜드 분석부터 성과 리포트까지, 어필컴퍼니의 5단계 협업 프로세스입니다.</p>
				</div>

				{/* 점진적 상승 단계 컬럼 */}
				<div className="relative flex flex-1">
					{WORKFLOW_STEPS.map((step, index) => (
						<div key={step.title} className="relative flex w-full pl-2 flex-col justify-between border-l border-stone-100">
							{/* 단계 번호 — 상단 */}
							<p className="left-2 text-sm font-semibold tracking-[0.22em] text-stone-300">{String(index + 1).padStart(2, '0')}</p>

							{/* 강조선 — 단계마다 높이 다름 */}
							<div className="absolute left-2 right-2 inset-0 h-[1.5px] bg-[#715a3e]" style={{ top: STEP_LINE_TOPS[index] }} />

							{/* 콘텐츠 — 강조선 바로 아래 */}
							<div className="absolute inset-x-2" style={{ top: `calc(${STEP_LINE_TOPS[index]} + 20px)` }}>
								<p className="text-lg font-semibold whitespace-pre-line leading-tight text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
									{step.description}
								</p>
								{/* <p className="mt-1.5 whitespace-pre-line text-[9px] leading-[1.6] text-stone-500">{step.description}</p> */}
							</div>

							{/* 단계 레이블 — 하단 */}
							<p className="text-sm tracking-widest text-stone-400">{step.title}</p>
						</div>
					))}
				</div>
			</div>
		</AboutPageFrame>
	);
}

function AboutContinuationPage({
	paragraphs,
	pageNum,
	totalPages,
}: AboutPageProps & {
	paragraphs: string[];
}) {
	const storyCards = getStoryCards(pageNum);

	return (
		<AboutPageFrame label="Story Continuation" pageNum={pageNum} totalPages={totalPages}>
			<div className="grid h-full gap-8" style={{ gridTemplateColumns: '28% 72%' }}>
				<div className="flex flex-col justify-between border-r border-stone-900/8 pr-6">
					<div className="grid gap-4">
						<p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-stone-400">Continuation</p>
						<h2 className="text-[2.3rem] leading-[1.02] tracking-[-0.055em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
							Story
							<br />
							Continuation
						</h2>
						<p className="text-[11px] leading-6 text-stone-600">소개문이 길어지더라도 페이지를 나눠 읽는 리듬을 유지합니다.</p>
					</div>

					<div className="grid gap-3 border-t border-stone-900/8 pt-4">
						{storyCards.map(line => (
							<div key={line} className="flex items-start gap-3">
								<span className="mt-[9px] h-px w-3 shrink-0 bg-[#715a3e]" />
								<p className="text-[10px] leading-5 text-stone-600">{line}</p>
							</div>
						))}
					</div>
				</div>

				{/* Right */}
				<div className="flex h-full flex-col justify-between pl-4">
					<div className="grid gap-5">
						<div className="flex items-center gap-3">
							<span className="h-px w-4 bg-stone-300" />
							<p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-stone-400">Story Continued</p>
						</div>
						<div className="h-px bg-stone-900/8" />
						{paragraphs.map((paragraph, index) => (
							<p key={`continuation-${index}`} className="text-[13.5px] leading-[2.05] text-stone-600">
								{paragraph}
							</p>
						))}
					</div>

					<div className="flex items-center justify-between border-t border-stone-900/8 pt-4">
						<p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-stone-400">Fashion PR Editorial Archive</p>
						<p className="text-[9px] uppercase tracking-[0.24em] text-stone-300">afeelcompany.com</p>
					</div>
				</div>
			</div>
		</AboutPageFrame>
	);
}

function AboutExpertisePage({ pageNum, totalPages }: AboutPageProps) {
	return (
		<AboutPageFrame label="Core Expertise" pageNum={pageNum} totalPages={totalPages}>
			<div className="flex h-full flex-col gap-20">
				<div className="grid gap-4">
					<div className="flex items-end justify-between gap-8">
						<h2 className="text-[3rem] leading-[0.95] tracking-[-0.06em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
							What We Do
						</h2>
						<p className="max-w-[34ch] text-right text-[12px] leading-7 text-stone-600">포지셔닝에서 아카이빙까지, 브랜드와 셀럽이 만나는 모든 접점을 함께 다룹니다.</p>
					</div>
				</div>

				<div className="grid flex-1 gap-px overflow-hidden border border-stone-900/8 bg-stone-900/8" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
					{ABOUT_SERVICE_ITEMS.map(item => (
						<article key={item.title} className="grid content-start gap-4 bg-[#faf7f3] p-8">
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">{item.title}</p>
							<h3 className="text-3xl leading-none tracking-[-0.05em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
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

function AboutEdgePage({ pageNum, totalPages }: AboutPageProps) {
	return (
		<AboutPageFrame label="Our Edge" pageNum={pageNum} totalPages={totalPages}>
			<div className="flex h-full flex-col gap-5 justify-between">
				<div className="grid gap-4">
					<div className="flex items-end justify-between gap-8">
						<h2 className="text-[3rem] leading-[0.95] tracking-[-0.06em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
							Why AFEEL
						</h2>
						<p className="max-w-[34ch] text-right text-[12px] leading-7 text-stone-600">미학, 기록, 그리고 상업적 결과를 함께 생각합니다.</p>
					</div>
				</div>

				<div className="grid gap-px overflow-hidden border border-stone-900/8 bg-stone-900/8 md:grid-cols-3">
					{ABOUT_EDGE_ITEMS.map(item => (
						<article key={item.title} className="grid content-start gap-4 bg-[#faf7f3] p-8">
							<p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">{item.title}</p>
							<h3 className="text-2xl leading-none tracking-[-0.05em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
								{item.headline}
							</h3>
							<p className="text-base leading-7 text-stone-600">{item.description}</p>
						</article>
					))}
				</div>

				{/* <div className="grid gap-4 bg-stone-950 px-8 py-7 text-white">
					<p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#ccead6]">Target Alignment</p>
					<div className="grid gap-1">
						{ABOUT_SOCIAL_PROOF_LINES.map(line => (
							<p key={line} className="text-[22px] leading-tight tracking-[-0.04em]" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
								{line}
							</p>
						))}
					</div>
				</div> */}
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
							<p className="text-[16px] leading-tight tracking-[-0.04em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
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

export default async function PdfExportPage() {
	const brochure = await getPdfDocument();

	const aboutNarrative = splitAboutNarrative(brochure.aboutText);
	const workChunks = chunk(brochure.workItems, WORK_PER_PAGE);
	const clientChunks = chunk(brochure.clientBrands, CLIENT_PER_PAGE);

	const sections: { id: string; node: ReactNode }[] = [];

	// Cover
	sections.push({
		id: 'cover',
		node: (
			<BrochureSheet sectionId="cover">
				<div className="relative h-full overflow-hidden">
					{/* <div className="absolute inset-y-0 left-0 w-[55%]" /> */}

					{/* Content grid */}
					<div className="relative z-10 grid h-full" style={{ gridTemplateColumns: '55% 45%' }}>
						{/* Left: Text */}
						<div className="flex h-full flex-col justify-between px-12 py-10">
							<div className="flex items-center gap-4">
								<span className="h-px w-10 bg-[#715a3e]" />
								<span className="text-[9px] font-semibold uppercase tracking-[0.44em] text-[#715a3e]">Afeel Company</span>
							</div>

							<div className="grid gap-5">
								{/* <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-stone-400">Company Brochure</p> */}
								<h1 className="text-9xl leading-[0.91] tracking-[-0.05em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
									Fashion PR
									<br />
									<span className="italic text-[#715a3e]">& Styling.</span>
								</h1>
								<p className="max-w-[32ch] text-base leading-7 text-stone-600">브랜드와 셀럽을 잇는 순간을 설계합니다.</p>
							</div>

							<div className="flex items-end justify-between border-t border-stone-900/8 pt-6">
								<div>
									<p className="text-[9px] uppercase tracking-[0.28em] text-stone-400">Issue Date</p>
									<p className="mt-1 text-[15px] font-medium text-stone-950">{brochure.issueDate}</p>
								</div>
								<p className="text-[9px] uppercase tracking-[0.24em] text-stone-300">afeelcompany.com</p>
							</div>
						</div>

						{/* Right: Hero image */}
						<div className="relative opacity-5">
							<PdfImage src={brochure.heroImageUrl} alt={`${brochure.title}`} className="h-full w-full object-contain invert " />
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
			render: (pageNum, totalPages) => <AboutIntroPage paragraphs={aboutNarrative.introParagraphs} pageNum={pageNum} totalPages={totalPages} />,
		},
		{
			key: 'story',
			render: (pageNum, totalPages) => <AboutStoryPage paragraphs={aboutNarrative.storyParagraphs} pageNum={pageNum} totalPages={totalPages} />,
		},
		...aboutNarrative.continuationParagraphs.map((paragraphs, index) => ({
			key: `continuation-${index + 1}`,
			render: (pageNum: number, totalPages: number) => <AboutContinuationPage paragraphs={paragraphs} pageNum={pageNum} totalPages={totalPages} />,
		})),
		{
			key: 'expertise',
			render: (pageNum, totalPages) => <AboutExpertisePage pageNum={pageNum} totalPages={totalPages} />,
		},
		{
			key: 'edge',
			render: (pageNum, totalPages) => <AboutEdgePage pageNum={pageNum} totalPages={totalPages} />,
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
							<h2 className="text-[2.6rem] leading-[0.95] tracking-[-0.06em] text-stone-950" style={{ fontFamily: 'var(--font-brochure-serif)' }}>
								Get In Touch.
							</h2>
						</div>

						<dl className="grid gap-7">
							<div className="grid gap-1.5">
								<dt className="text-[9px] uppercase tracking-[0.32em] text-stone-400">이메일</dt>
								<dd>
									<a href={getMailtoHref(brochure.contact.email)} className="text-[18px] font-medium text-stone-950 underline decoration-stone-300 underline-offset-4">
										{brochure.contact.email}
									</a>
								</dd>
							</div>
							<div className="h-px bg-stone-100" />
							<div className="grid gap-1.5">
								<dt className="text-[9px] uppercase tracking-[0.32em] text-stone-400">전화</dt>
								<dd>
									<a href={getTelHref(brochure.contact.phone)} className="text-[18px] font-medium text-stone-950 underline decoration-stone-300 underline-offset-4">
										{brochure.contact.phone}
									</a>
								</dd>
							</div>
							<div className="h-px bg-stone-100" />
							<div className="grid gap-1.5">
								<dt className="text-[9px] uppercase tracking-[0.32em] text-stone-400">주소</dt>
								<dd>
									<a href={CONTACT_ADDRESS_URL} target="_blank" rel="noreferrer" className="text-[18px] font-medium text-stone-950 underline decoration-stone-300 underline-offset-4">
										{brochure.contact.address}
									</a>
								</dd>
							</div>
							<div className="h-px bg-stone-100" />
							<div className="grid gap-1.5">
								<dt className="text-[9px] uppercase tracking-[0.32em] text-stone-400">웹사이트</dt>
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

	return <PdfPreviewWorkspace sections={sections} />;
}
