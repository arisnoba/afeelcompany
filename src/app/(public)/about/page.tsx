import Link from 'next/link';

import { ClientLogoMarquee } from '@/components/site/ClientLogoMarquee';
import { TextRevealByWord } from '@/components/ui/text-reveal';
import { getBrandsWithLogos } from '@/lib/client-brands';
import { getSiteClientBrands } from '@/lib/site';

const STORY_LINES = [
	'옷을 협찬하는 것에서 끝나지 않습니다.',
	'스타의 분위기에 맞는 핏을 찾는 일부터 시작합니다.',
	'그 한 장면이 사람들의 관심으로 이어지도록 설계합니다.',
	'지표를 꾸미기보다, 실제로 일어나는 일에 집중합니다.',
	'오늘도 더 많은 브랜드와 스타일리스트가',
	'우리를 찾고 있다는 것이 그 증거입니다.',
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
		description: '브랜드의 미학과 정체성을 정확히 읽고, 대중의 인식 속에 가장 이상적인 자리를 설계합니다. 단순 노출이 아닌 브랜드 이미지의 전략적 구축을 목표로 합니다.',
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
		description: '드라마, 예능, 화보, SNS까지 모든 미디어 채널에서 브랜드가 가장 빛나는 씬(Scene)을 직접 기획하고 배치합니다. 우연한 노출은 없습니다.',
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
		description: '온라인 플랫폼의 알고리즘과 소비자 행동 데이터를 분석해 바이럴 확산 경로를 설계합니다. 연관 검색어 장악과 플랫폼 품절 대란이 전략의 결과물입니다.',
		icon: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
				<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
			</svg>
		),
	},
	{
		title: 'Archive Management',
		headline: '아카이브 관리',
		description: '모든 방송, SNS, 미디어 노출을 실시간으로 추적하고 영구 보존합니다. 트렌드는 휘발되지만 축적된 기록은 다음 캠페인의 가장 강력한 자산이 됩니다.',
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
		description: '우연한 노출은 없습니다. 브랜드의 미학과 셀럽의 페르소나를 예리하게 매칭해 대중의 시선을 사로잡는 결정적 씬(Scene)을 만듭니다.',
	},
	{
		title: 'Endless Archive',
		headline: '집요한 기록',
		description: '트렌드는 휘발되지만 기록은 남습니다. 모든 방송, SNS, 미디어 노출을 실시간으로 추적하고 바이럴 자산으로 영구히 보존합니다.',
	},
	{
		title: 'Proven Impact',
		headline: '확실한 결과',
		description: '단순히 예쁜 사진 한 장을 넘어서, 연관 검색어 장악과 플랫폼 품절 대란이라는 실질적인 상업적 임팩트로 증명합니다.',
	},
];

export default async function AboutPage() {
	const brands = await getSiteClientBrands();

	const rollingBrands = getBrandsWithLogos(brands);
	const storyRevealText = STORY_LINES.join(' ');

	return (
		<div className="grid gap-24 py-10 sm:gap-28 sm:py-14 lg:gap-48 lg:py-20">
			<header className="grid gap-10">
				<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">About AFEEL</p>

				<div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.7fr)] md:items-end">
					<div className="grid gap-6">
						<h1 className="text-5xl font-light leading-[0.92] tracking-[-0.07em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-7xl lg:text-[7rem]">
							True impact,
							<br />
							beyond the numbers.
						</h1>
						<p className="max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl sm:leading-9">
							트렌드의 시작, 스타와 브랜드가 만나는 완벽한 씬(Scene)을 설계하며
							<br /> 무형의 모멘텀을 축적 가능한 신뢰로 바꾸는 방식으로 움직입니다.
						</p>
					</div>
				</div>
			</header>

			<section className="relative ml-[calc(50%-50vw)] w-screen overflow-hidden border-y border-stone-900/8 bg-[linear-gradient(180deg,#f7f1ea_0%,#fcfaf7_18%,#f3ece5_100%)]">
				<div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(117,90,62,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(117,90,62,0.05)_1px,transparent_1px)] [background-size:28px_28px]" />
				<div className="absolute inset-x-[22%] top-0 h-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9),transparent_72%)] blur-3xl" />
				<div className="relative z-10 mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-10">
					<div className="grid justify-items-center gap-6 px-4 pt-12 text-center sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
						<p className="text-[0.68rem] font-semibold uppercase tracking-[0.36em] text-[#715a3e]">Our Story & Philosophy</p>
						<p className="max-w-2xl text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
							텍스트가 한 줄씩 드러나듯, 어필컴퍼니의 철학도 결과로 증명됩니다. 브랜드와 셀럽의 한 장면이 대중의 열망으로 번지는 순간을 중심에 둡니다.
						</p>
					</div>
					<div className="overflow-hidden">
						<TextRevealByWord text={storyRevealText} className="h-[95vh]" />
					</div>
				</div>
			</section>

			<section className="grid gap-10 lg:grid-cols-2 lg:gap-0">
				<div className="grid gap-4 lg:sticky lg:top-32 lg:self-start">
					<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">Visualizing Momentum</p>
					<h2 className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl">The Accumulation Line</h2>
					<p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
						수치 그래프 대신 시간을 시각화합니다. 쌓여온 사례의 밀도, 연결된 이름의 압력, 그리고 계속 상승하는 현상을 하나의 흐름으로 보여줍니다.
					</p>
				</div>

				<div className="relative">
					<div className="absolute left-[5px] top-0 h-full w-px bg-stone-900/15" />

					<div className="grid gap-6">
						{MOMENTUM_MILESTONES.map(milestone => (
							<article key={milestone.year} className="relative ml-8 border border-stone-900/8 bg-white px-6 py-5">
								<div className="absolute -left-[1.625rem] top-5 h-2.5 w-2.5 rounded-full bg-[#715a3e]" />
								<p className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">{milestone.year}</p>
								<h3 className="mt-2 text-xl tracking-[-0.04em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-2xl">{milestone.title}</h3>
								<p className="mt-2 text-sm leading-7 text-stone-600">{milestone.description}</p>
							</article>
						))}
					</div>
				</div>
			</section>

			<section className="grid gap-10">
				<div className="grid gap-5 md:grid-cols-2 md:items-end">
					<div className="grid gap-4">
						<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">Core Expertise</p>
						<h2 className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl">
							Service
							<br />
							Excellence.
						</h2>
					</div>
					<p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
						브랜드 포지셔닝부터 디지털 전략까지, 어필컴퍼니의 4가지 핵심 서비스는 하나의 목표로 수렴합니다. 브랜드와 셀럽이 만나는 최적의 접점을 설계하고, 그 결과를 지속 가능한 자산으로
						축적합니다.
					</p>
				</div>

				<div className="grid gap-px overflow-hidden border border-stone-900/8 bg-stone-900/8 sm:grid-cols-2">
					{SERVICE_ITEMS.map(item => (
						<article key={item.title} className="grid gap-6 bg-[#faf7f3] p-7 sm:p-8">
							<div className="flex items-center gap-4">
								<div className="flex h-10 w-10 items-center justify-center border border-stone-900/10 bg-white text-[#715a3e]">{item.icon}</div>
								<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">{item.title}</p>
							</div>
							<h3 className="text-2xl tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-3xl">{item.headline}</h3>
							<p className="text-sm leading-8 text-stone-600 sm:text-base">{item.description}</p>
						</article>
					))}
				</div>
			</section>

			<section className="grid gap-10">
				<div className="grid gap-5 md:grid-cols-2 md:items-end">
					<div className="grid gap-4">
						<p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">Our Edge</p>
						<h2 className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl">Why AFEEL</h2>
					</div>
					<p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
						타깃이 가장 궁금해하는 질문에는 짧고 단단한 단어로 답합니다. 미학, 기록, 상업적 결과까지 전부 연결하는 팀이라는 점이 우리의 차별점입니다.
					</p>
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
						<h2 className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl">Trusted by the Best</h2>
					</div>
					<p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">숫자를 대신할 수 있는 가장 좋은 신뢰 신호는 함께 일하고 있는 얼굴입니다.</p>
				</div>

				<ClientLogoMarquee
					brands={rollingBrands}
					className="relative overflow-hidden border-y border-stone-900/8 py-7 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
					trackClassName="about-logo-marquee-track flex min-w-max items-center gap-14"
					logoClassName="relative h-10 w-32 shrink-0 opacity-70 transition hover:opacity-100"
					imageClassName="object-contain grayscale"
				/>

				<div className="grid gap-6 bg-stone-950 px-8 py-10 text-white sm:px-10">
					<p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#ccead6]">Target Alignment</p>
					<p className="max-w-4xl text-2xl leading-tight tracking-[-0.04em] [font-family:var(--font-newsreader)] sm:text-3xl">
						다음 시즌의 메가 히트를 준비하는 브랜드 매니저.
						<br /> 완벽한 레드카펫 룩이 당장 필요한 스타일리스트.
						<br /> 어필컴퍼니는 당신의 가장 든든하고 확실한 파트너입니다.
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
	);
}
