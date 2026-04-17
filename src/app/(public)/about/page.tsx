import type { Metadata } from 'next';
import Link from 'next/link';

import { ClientLogoMarquee } from '@/components/site/ClientLogoMarquee';
import { WorkflowBeam } from '@/components/site/WorkflowBeam';
import { AnimatedPageTitle } from '@/components/ui/animated-page-title';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextRevealByWord } from '@/components/ui/text-reveal';
import { getBrandsWithLogos } from '@/lib/client-brands';
import { createPageMetadata } from '@/lib/seo';
import { getSiteClientBrands } from '@/lib/site';

const STORY_LINES = [
	'의류 협찬에서 끝내지 않습니다.',
	'스타의 이미지와 브랜드의 미학을 먼저 읽습니다.',
	'그 만남이 자연스러운 콘텐츠가 되도록 배치합니다.',
	'숫자를 부풀리기보다, 실제로 일어나는 일에 집중합니다.',
	'브랜드와 스타일리스트들이',
	'우리를 찾는 이유입니다.',
];

const MOMENTUM_MILESTONES = [
	{
		year: '2018.04',
		title: '새로운 기준의 시작',
		description: '어필컴퍼니 설립',
	},
	{
		year: '2018.07',
		title: "tvN '김비서가 왜 그럴까' 황보라",
		description: '소피앤테일러 투피스 완판',
	},
	{
		year: '2019',
		title: "tvN '검색어를 입력하세요 WWW' 임수정",
		description: '코르카 청바지 완판',
	},
	{
		year: '2020.07',
		title: "tvN '사이코지만 괜찮아' 서예지",
		description: '고이우 귀걸이 W컨셉 1위',
	},
	{
		year: '2021.01',
		title: '제35회 골든디스크어워즈 아이유',
		description: '브리아나 부츠 완판',
	},
	{
		year: '2021',
		title: '이커머스 플랫폼 랭킹 장악',
		description: '무신사/W컨셉 베스트셀러 견인',
	},
	{
		year: '2025 현재',
		title: '글로벌 포트폴리오 구축',
		description: '글로벌 K-POP 아티스트와 최정상 배우 스타일링 축적',
	},
];

const SERVICE_ITEMS = [
	{
		title: 'Brand Positioning',
		headline: '브랜드 포지셔닝',
		description: '브랜드가 어떤 이미지로 기억되어야 할지를 먼저 정리합니다. 단순 노출이 아닌, 인식을 만드는 방향으로 작업합니다.',
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
				<circle cx="12" cy="12" r="10" />
				<circle cx="12" cy="12" r="6" />
				<circle cx="12" cy="12" r="2" />
			</svg>
		),
	},
	{
		title: 'Editorial Placement',
		headline: '에디토리얼 플레이스먼트',
		description: '드라마, 예능, 화보, SNS — 각 채널에서 브랜드가 자연스럽게 보이는 장면을 직접 기획합니다.',
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
				<rect x="3" y="3" width="18" height="18" rx="1" />
				<path d="M3 9h18M9 21V9" />
			</svg>
		),
	},
	{
		title: 'Digital Strategy',
		headline: '디지털 전략',
		description: '플랫폼별 소비자 흐름을 파악해 브랜드 노출 경로를 설계합니다. 실제로 검색량이 늘고 재고가 소진되는 결과로 이어진 작업들이 있습니다.',
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
				<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
			</svg>
		),
	},
	{
		title: 'Archive Management',
		headline: '아카이브 관리',
		description: '방송, SNS, 미디어 노출을 빠짐없이 기록하고 보존합니다. 쌓인 아카이브는 다음 협업을 위한 실질적인 레퍼런스가 됩니다.',
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
				<polyline points="21 8 21 21 3 21 3 8" />
				<rect x="1" y="3" width="22" height="5" />
				<line x1="10" y1="12" x2="14" y2="12" />
			</svg>
		),
	},
];

const EDGE_ITEMS = [
	{
		title: 'Strategic Curation',
		headline: '기획된 우연',
		description: '우연한 노출은 없습니다. 브랜드의 미학과 셀럽의 이미지를 매칭해 대중이 주목하는 순간을 만듭니다.',
	},
	{
		title: 'Endless Archive',
		headline: '집요한 기록',
		description: '트렌드는 사라지고 기록은 남습니다. 모든 미디어 노출을 꼼꼼히 추적해 레퍼런스로 보존합니다.',
	},
	{
		title: 'Proven Impact',
		headline: '확실한 결과',
		description: '사진 한 장에서 끝나지 않습니다. 검색량 증가, 재고 소진 — 실제 판매 지표로 이어진 작업을 합니다.',
	},
];

export const metadata: Metadata = createPageMetadata({
	title: '회사 소개',
	description: 'AFEEL Company의 패션 PR 철학, 브랜드 포지셔닝 방식, 셀럽 협업 이력과 핵심 서비스를 소개합니다.',
	path: '/about',
	keywords: ['회사 소개', '패션 PR 회사', '브랜드 포지셔닝'],
});

export default async function AboutPage() {
	const brands = await getSiteClientBrands();

	const rollingBrands = getBrandsWithLogos(brands);
	const storyRevealText = STORY_LINES.join('\n');

	return (
		<>
			<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
				<div className="grid gap-24 py-10 sm:gap-28 sm:py-14 lg:gap-48 lg:py-20">
					<header className="grid gap-10">
						<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">About AFEEL</p>

						<div className="grid gap-6">
							<AnimatedPageTitle
								lines={[{ text: 'Real impact.' }, { text: 'Measured differently.' }]}
								className="text-5xl font-light leading-[0.92] tracking-[-0.07em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-7xl lg:text-[7rem]"
							/>
							<p className="max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl sm:leading-9">
								스타와 브랜드가 자연스럽게 연결되는 장면을 만들고, <br />그 경험이 신뢰로 쌓이도록 함께 일합니다.
							</p>
						</div>
					</header>
				</div>
			</div>

			<section className="relative overflow-hidden border-y border-stone-900/8 bg-[linear-gradient(180deg,#f7f1ea_0%,#fcfaf7_18%,#f3ece5_100%)]">
				<div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(117,90,62,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(117,90,62,0.05)_1px,transparent_1px)] [background-size:28px_28px]" />
				<div className="absolute inset-x-[22%] top-0 h-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9),transparent_72%)] blur-3xl" />
				<div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
					<div className="grid justify-items-center gap-6 px-4 pt-12 text-center sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
						<p className="text-[0.68rem] font-semibold uppercase tracking-[0.36em] text-[#715a3e]">How We Work</p>
						<p className="max-w-2xl text-sm leading-5 text-stone-600 sm:text-base sm:leading-8 text-balance">브랜드와 셀럽의 한 장면이 대중의 열망으로 번지는 순간을 중심에 둡니다.</p>
					</div>
					<div className="overflow-hidden">
						<TextRevealByWord text={storyRevealText} className="h-[95vh]" />
					</div>
				</div>
			</section>

			<div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
				<div className="grid gap-24 py-10 sm:gap-28 sm:py-14 lg:gap-48 lg:py-20">
					{/* <section className="grid gap-10 lg:grid-cols-2 lg:gap-0">
						<div className="grid gap-4 lg:sticky lg:top-32 lg:self-start">
							<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">Work History</p>
							<AnimatedPageTitle
								as="h2"
								lines={[{ text: 'The Accumulation Line' }]}
								delay={0.04}
								duration={0.42}
								className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl"
							/>
							<p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg text-balance">어떤 브랜드, 어떤 배우, 어떤 결과였는지.</p>
						</div>

						<div className="relative">
							<div className="absolute left-[5px] top-0 h-full w-px bg-stone-900/15" />

							<div className="grid gap-6">
								{MOMENTUM_MILESTONES.map((milestone, index) => (
									<BlurFade key={milestone.year} delay={Math.min(index * 0.06, 0.3)} className="ml-8">
										<article className="relative border border-stone-900/8 bg-white px-6 py-5">
											<div className="absolute -left-[2em] top-5 h-2.5 w-2.5 rounded-full bg-[#715a3e]" />
											<p className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">{milestone.year}</p>
											<h3 className="mt-2 text-xl tracking-[-0.04em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-2xl">{milestone.title}</h3>
											<p className="mt-2 text-sm leading-7 text-stone-600">{milestone.description}</p>
										</article>
									</BlurFade>
								))}
							</div>
						</div>
					</section> */}

					<section className="grid gap-10">
						<div className="grid gap-5 md:grid-cols-2 md:items-end">
							<div className="grid gap-4">
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">Our Process</p>
								<AnimatedPageTitle
									as="h2"
									lines={[{ text: 'How It Works' }]}
									delay={0.04}
									duration={0.42}
									className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl"
								/>
							</div>
							<p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg text-balance">브랜드 분석부터 성과 리포트까지, 어필컴퍼니의 5단계 협업 프로세스입니다.</p>
						</div>

						<WorkflowBeam />
					</section>

					<section className="grid gap-10">
						<div className="grid gap-5 md:grid-cols-2 md:items-end">
							<div className="grid gap-4">
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">Core Expertise</p>
								<AnimatedPageTitle
									as="h2"
									lines={[{ text: 'What We Do' }]}
									delay={0.04}
									duration={0.42}
									className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl"
								/>
							</div>
							<p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">포지셔닝에서 아카이빙까지, 브랜드와 셀럽이 만나는 모든 접점을 함께 다룹니다.</p>
						</div>

						<div className="grid gap-px overflow-hidden border border-stone-900/8 bg-stone-900/8 sm:grid-cols-2">
							{SERVICE_ITEMS.map(item => (
								<article key={item.title} className="grid gap-6 bg-[#faf7f3] p-7 sm:p-8">
									<div className="flex items-center gap-4">
										<div className="flex h-10 w-10 items-center justify-center border border-stone-900/10 bg-white text-[#715a3e]">{item.icon}</div>
										<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">{item.title}</p>
									</div>
									<h3 className="text-2xl tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-3xl">{item.headline}</h3>
									<p className="text-sm leading-8 text-stone-600 sm:text-base text-balance">{item.description}</p>
								</article>
							))}
						</div>
					</section>

					<section className="grid gap-10">
						<div className="grid gap-5 md:grid-cols-2 md:items-end">
							<div className="grid gap-4">
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">Our Edge</p>
								<AnimatedPageTitle
									as="h2"
									lines={[{ text: 'Why AFEEL' }]}
									delay={0.04}
									duration={0.42}
									className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl"
								/>
							</div>
							<p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">미학, 기록, 그리고 상업적 결과를 함께 생각합니다.</p>
						</div>

						<div className="grid gap-px overflow-hidden border border-stone-900/8 bg-stone-900/8 md:grid-cols-3">
							{EDGE_ITEMS.map(item => (
								<article key={item.title} className="grid gap-5 bg-[#faf7f3] p-7 sm:p-8">
									<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">{item.title}</p>
									<h3 className="text-3xl tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)]">{item.headline}</h3>
									<p className="text-sm leading-8 text-stone-600 sm:text-base">{item.description}</p>
								</article>
							))}
						</div>
					</section>

					<section className="grid gap-10">
						<div className="grid gap-5 md:grid-cols-2 md:items-end">
							<div className="grid gap-4">
								<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">Social Proof</p>
								<AnimatedPageTitle
									as="h2"
									lines={[{ text: 'Our Clients' }]}
									delay={0.04}
									duration={0.42}
									className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl"
								/>
							</div>
							<p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg text-balance">숫자를 대신할 수 있는 가장 좋은 신뢰 신호는 함께 일하고 있는 얼굴입니다.</p>
						</div>

						<ClientLogoMarquee
							brands={rollingBrands}
							className="relative overflow-hidden border-y border-stone-900/8 py-7 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
							trackClassName="about-logo-marquee-track flex min-w-max items-center gap-10 sm:gap-14"
							logoClassName="relative h-8 w-24 shrink-0 opacity-70 transition hover:opacity-100 sm:h-10 sm:w-32"
							imageClassName="object-contain grayscale"
						/>

						<div className="grid gap-6 bg-stone-950 px-8 py-10 text-white sm:px-10">
							<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#ccead6]">Target Alignment</p>
							<p className="max-w-4xl text-2xl leading-tight tracking-[-0.04em] [font-family:var(--font-newsreader)] sm:text-3xl">
								다음 시즌의 메가 히트를 준비하는 브랜드 매니저.
								<br /> 완벽한 레드카펫 룩이 당장 필요한 스타일리스트.
								<br /> 어필컴퍼니와 함께 시작하세요.
							</p>
							<div>
								<Link
									href="/contact"
									className="inline-flex items-center justify-center border border-white/16 bg-white/8 px-8 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/14">
									Inquire for Collaboration
								</Link>
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	);
}
