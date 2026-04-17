'use client';

import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

const WORKFLOW_STEPS = [
	{ label: 'STEP 01', title: 'STRATEGY', description: '브랜드 분석 및\n목표 설정' },
	{ label: 'STEP 02', title: 'MATCHING', description: '아티스트 큐레이션 및\n리스트 확정' },
	{ label: 'STEP 03', title: 'EXECUTION', description: '현장 협찬 실행 및\n제품 핸들링' },
	{ label: 'STEP 04', title: 'EXPOSURE', description: '다양한 미디어 채널\n노출 확인' },
	{ label: 'STEP 05', title: 'ANALYSIS', description: '성과 데이터 분석 및\n사후 리포트' },
] as const;

// ─── 공통 SVG 스타일 상수 ───────────────────────────────────────────────────
// vectorEffect="non-scaling-stroke" → preserveAspectRatio="none"로 인한
// 비균일 스케일에서도 strokeWidth를 CSS 픽셀로 고정해 일관성을 유지
const RAIL_PROPS = {
	fill: 'none',
	stroke: 'rgba(41,37,36,0.10)',
	strokeWidth: '1', // 모든 레이아웃에서 1px
	strokeLinecap: 'round' as const,
	strokeLinejoin: 'round' as const,
	vectorEffect: 'non-scaling-stroke' as const,
};

const BEAM_PROPS = {
	fill: 'none',
	stroke: '#715a3e',
	strokeWidth: '1.5', // 모든 레이아웃에서 1.5px
	strokeLinecap: 'round' as const,
	strokeLinejoin: 'round' as const,
	vectorEffect: 'non-scaling-stroke' as const,
};

function StepNode({ label, title, description, className }: { label: string; title: string; description: string; className?: string }) {
	return (
		<article className={cn('relative z-10 flex flex-col items-center justify-center border border-stone-900/10 bg-[#faf7f3] px-5 py-8 text-center', className)}>
			<p className="text-[0.55rem] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">{label}</p>
			<h3 className="mt-3 text-[1rem] font-semibold uppercase tracking-[0.11em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-[1.08rem]">{title}</h3>
			<p className="mt-2 whitespace-pre-line text-sm leading-6 text-stone-500">{description}</p>
		</article>
	);
}

/**
 * FlowPath — 복잡한 SVG 경로 위에 얇은 rail 선과 이동하는 beam 세그먼트를 렌더링
 *
 * @param dash   - 세그먼트 길이 (SVG 좌표 단위). 이 값만으로 경로 대비 비율을 조정
 * @param gap    - 세그먼트 사이 간격 (gap > pathLength 이면 단일 세그먼트만 보임)
 * @param duration - 한 사이클(세그먼트 한 번 순환) 시간(초)
 *
 * strokeDashoffset 범위 = -(dash + gap) : 한 패턴 길이만큼 이동 = 1 사이클
 * pathLength prop 미사용 → Framer Motion 특수 prop 충돌 없음, duration이 직접 속도를 제어
 */
function FlowPath({ d, viewBox, className, dash, gap, duration }: { d: string; viewBox: string; className?: string; dash: number; gap: number; duration: number }) {
	const pattern = dash + gap;
	return (
		<svg aria-hidden viewBox={viewBox} preserveAspectRatio="none" className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}>
			<path d={d} {...RAIL_PROPS} />
			<motion.path d={d} {...BEAM_PROPS} strokeDasharray={`${dash} ${gap}`} animate={{ strokeDashoffset: [0, -pattern] }} transition={{ duration, repeat: Infinity, ease: 'linear' }} />
		</svg>
	);
}

/**
 * MobileConnector — 모바일 카드 사이 수직 연결선
 * viewBox="0 0 1 20", height=20px → y-scale = 1 (1 SVG unit = 1 CSS px)
 * 같은 vectorEffect를 사용해 strokeWidth를 1px / 1.5px 로 통일
 */
function MobileConnector({ duration }: { duration: number }) {
	// 경로 길이 = 20 SVG units = 20px (y-scale = 1이므로)
	// dash=5px, gap=15px → 단일 세그먼트 한 사이클에 duration초
	const dash = 5;
	const gap = 15;
	const pattern = dash + gap; // = 20 (경로 전체 길이와 동일 → 동기화)
	return (
		<svg aria-hidden width="100%" height="20" viewBox="0 0 1 20" preserveAspectRatio="none" className="block">
			<line x1="0.5" y1="0" x2="0.5" y2="20" {...RAIL_PROPS} />
			<motion.line
				x1="0.5"
				y1="0"
				x2="0.5"
				y2="20"
				{...BEAM_PROPS}
				strokeDasharray={`${dash} ${gap}`}
				animate={{ strokeDashoffset: [0, -pattern] }}
				transition={{ duration, repeat: Infinity, ease: 'linear' }}
			/>
		</svg>
	);
}

export function WorkflowBeam({ className }: { className?: string }) {
	return (
		<div className={cn('w-full', className)}>
			{/* ── Desktop (lg+) ── 5열, 수평 경로 길이 = 80 SVG units */}
			<div className="relative hidden overflow-hidden bg-white lg:block">
				<FlowPath
					d="M 10 50 H 90"
					viewBox="0 0 100 100"
					dash={5} // 세그먼트: gap(100) > 경로(80) → 단일 세그먼트만 보임
					gap={15}
					duration={1.4}
				/>
				<div className="relative grid grid-cols-5 gap-4 xl:gap-5">
					{WORKFLOW_STEPS.map(step => (
						<StepNode key={step.title} label={step.label} title={step.title} description={step.description} className="min-h-[10.75rem]" />
					))}
				</div>
			</div>

			{/* ── Tablet (md ~ lg) ── 3+2열, ㄷ자 경로 길이 = 62+48+52 = 162 SVG units */}
			<div className="relative hidden min-h-[25rem] overflow-hidden border border-stone-900/8 bg-white px-5 py-6 md:block lg:hidden">
				<FlowPath
					d="M 18 27 H 80 V 75 H 28"
					viewBox="0 0 100 100"
					dash={4} // gap(200) > 경로(162) → 단일 세그먼트만 보임
					gap={200}
					duration={2.6}
				/>
				<div className="relative grid grid-cols-3 gap-4">
					<StepNode label={WORKFLOW_STEPS[0].label} title={WORKFLOW_STEPS[0].title} description={WORKFLOW_STEPS[0].description} className="min-h-[10.25rem]" />
					<StepNode label={WORKFLOW_STEPS[1].label} title={WORKFLOW_STEPS[1].title} description={WORKFLOW_STEPS[1].description} className="min-h-[10.25rem]" />
					<StepNode label={WORKFLOW_STEPS[2].label} title={WORKFLOW_STEPS[2].title} description={WORKFLOW_STEPS[2].description} className="min-h-[10.25rem]" />
				</div>
				<div className="relative mt-10 grid grid-cols-2 gap-4 px-[4%]">
					<StepNode label={WORKFLOW_STEPS[4].label} title={WORKFLOW_STEPS[4].title} description={WORKFLOW_STEPS[4].description} className="min-h-[10.25rem]" />
					<StepNode label={WORKFLOW_STEPS[3].label} title={WORKFLOW_STEPS[3].title} description={WORKFLOW_STEPS[3].description} className="min-h-[10.25rem]" />
				</div>
			</div>

			{/* ── Mobile (<md) ── 수직 리스트 + 카드 사이 20px 수직 connector */}
			<div className="flex flex-col md:hidden">
				{WORKFLOW_STEPS.map((step, index) => (
					<div key={step.title}>
						<article className="relative border border-stone-900/10 bg-[#faf7f3] px-5 py-5">
							<div className="relative ml-6">
								<div className="absolute -left-[2.1rem] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-[#715a3e]/20 bg-white text-[0.58rem] font-semibold tracking-[0.18em] text-[#715a3e]">
									{String(index + 1).padStart(2, '0')}
								</div>
								<p className="text-[0.52rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">{step.label}</p>
								<h3 className="mt-2 text-[1rem] font-semibold uppercase tracking-[0.11em] text-stone-950 [font-family:var(--font-newsreader)]">{step.title}</h3>
								<p className="mt-2 whitespace-pre-line text-sm leading-6 text-stone-500">{step.description}</p>
							</div>
						</article>
						{index < WORKFLOW_STEPS.length - 1 && <MobileConnector duration={0.9} />}
					</div>
				))}
			</div>
		</div>
	);
}
