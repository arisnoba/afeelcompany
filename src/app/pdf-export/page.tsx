/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react'

import type { PdfClientBrand, PdfPortfolioItem } from '@/types/pdf'

import { BrochureSheet } from './_components/BrochureSheet'
import { PdfPreviewWorkspace } from './_components/PdfPreviewWorkspace'
import { getPdfDocument } from './_lib/get-pdf-document'

export const dynamic = 'force-dynamic'

// ── Items per page ──────────────────────────
const WORK_PER_PAGE = 6    // 3×2 grid
const CLIENT_PER_PAGE = 12 // 4×3 grid
const ABOUT_INTRO_LIMIT = 380
const ABOUT_STORY_LIMIT = 520
const ABOUT_CONTINUATION_LIMIT = 760

const ABOUT_EDGE_ITEMS = [
  {
    title: 'Strategic Curation',
    headline: '기획된 우연',
    description: '브랜드의 미학과 셀럽의 이미지를 맞물리게 설계합니다.',
  },
  {
    title: 'Endless Archive',
    headline: '집요한 기록',
    description: '노출 장면을 축적해 다음 협업의 신뢰 자산으로 남깁니다.',
  },
  {
    title: 'Proven Impact',
    headline: '확실한 결과',
    description: '검색량 증가와 재고 소진으로 이어진 장면을 만듭니다.',
  },
] as const

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
] as const

const ABOUT_STORY_LINES = [
  '의류 협찬에서 끝내지 않습니다.',
  '스타의 이미지와 브랜드의 미학을 먼저 읽습니다.',
  '그 만남이 자연스러운 콘텐츠가 되도록 배치합니다.',
  '숫자를 부풀리기보다, 실제로 일어나는 일에 집중합니다.',
] as const

const ABOUT_MILESTONES = [
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
] as const

const ABOUT_SERVICE_ITEMS = [
  {
    title: 'Brand Positioning',
    headline: '브랜드 포지셔닝',
    description: '브랜드가 어떤 이미지로 기억되어야 할지를 먼저 정리합니다.',
  },
  {
    title: 'Editorial Placement',
    headline: '에디토리얼 플레이스먼트',
    description: '드라마, 예능, 화보, SNS에서 자연스럽게 보이는 장면을 기획합니다.',
  },
  {
    title: 'Digital Strategy',
    headline: '디지털 전략',
    description: '플랫폼별 소비 흐름을 읽고 실제 검색과 구매로 이어지는 노출 경로를 설계합니다.',
  },
  {
    title: 'Archive Management',
    headline: '아카이브 관리',
    description: '방송과 SNS, 미디어 노출을 기록해 다음 협업의 실질적 레퍼런스로 보존합니다.',
  },
] as const

const ABOUT_SOCIAL_PROOF_LINES = [
  '다음 시즌의 메가 히트를 준비하는 브랜드 매니저.',
  '완벽한 레드카펫 룩이 당장 필요한 스타일리스트.',
  '어필컴퍼니와 함께 시작하세요.',
] as const

// ── Utilities ───────────────────────────────

function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

function normalizeAboutText(text: string): string {
  const normalized = text
    .replace(/\r\n?/g, '\n')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n\n')

  return normalized || text.replace(/\s+/g, ' ').trim()
}

function takeTextChunk(text: string, limit: number): [string, string] {
  if (text.length <= limit) {
    return [text.trim(), '']
  }

  const breakpoints = ['\n\n', '. ', '! ', '? ', '.\n', '!\n', '?\n', '다. ', '요. ', ' ']
  let splitIndex = -1

  for (const breakpoint of breakpoints) {
    const index = text.lastIndexOf(breakpoint, limit)

    if (index >= Math.floor(limit * 0.55)) {
      splitIndex = index + breakpoint.length
      break
    }
  }

  if (splitIndex === -1) {
    splitIndex = limit
  }

  return [text.slice(0, splitIndex).trim(), text.slice(splitIndex).trim()]
}

function toParagraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

function getStoryCards(pageNum: number): string[] {
  const start = ((pageNum - 1) * 2) % ABOUT_STORY_LINES.length
  return [
    ABOUT_STORY_LINES[start],
    ABOUT_STORY_LINES[(start + 1) % ABOUT_STORY_LINES.length],
  ]
}

function splitAboutNarrative(text: string) {
  const normalized = normalizeAboutText(text)
  const [introText, afterIntro] = takeTextChunk(normalized, ABOUT_INTRO_LIMIT)
  const [storyText, afterStory] = afterIntro
    ? takeTextChunk(afterIntro, ABOUT_STORY_LIMIT)
    : [
        '텍스트가 한 줄씩 드러나듯, 어필컴퍼니의 철학도 결과로 증명됩니다. 브랜드와 셀럽의 한 장면이 대중의 열망으로 번지는 순간을 중심에 둡니다.',
        '',
      ]

  const continuations: string[] = []
  let remaining = afterStory

  while (remaining) {
    const [pageText, rest] = takeTextChunk(remaining, ABOUT_CONTINUATION_LIMIT)
    continuations.push(pageText)
    remaining = rest
  }

  return {
    introParagraphs: toParagraphs(introText),
    storyParagraphs: toParagraphs(storyText),
    continuationParagraphs: continuations.map(toParagraphs),
  }
}

interface PdfImageProps {
  src: string | null | undefined
  alt: string
  className: string
}

function PdfImage({ src, alt, className }: PdfImageProps) {
  if (!src) {
    return (
      <div className={`${className} flex items-center justify-center border border-dashed border-stone-200 bg-stone-50 text-[10px] font-medium uppercase tracking-[0.24em] text-stone-300`}>
        NO IMAGE
      </div>
    )
  }
  return <img src={src} alt={alt} data-pdf-image className={className} />
}

// ── Section renderers ───────────────────────

interface AboutPageProps {
  pageNum: number
  totalPages: number
}

function AboutPageFrame({
  label,
  pageNum,
  totalPages,
  children,
}: AboutPageProps & {
  label: string
  children: ReactNode
}) {
  return (
    <div className="relative h-full overflow-hidden bg-[linear-gradient(180deg,#f7f1ea_0%,#fcfaf7_18%,#f3ece5_100%)] text-stone-950">
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(117,90,62,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(117,90,62,0.05)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute inset-x-[22%] top-0 h-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9),transparent_72%)] blur-3xl" />

      <div className="relative z-10 flex h-full flex-col px-10 py-9">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#715a3e]" />
            <p className="text-[9px] font-semibold uppercase tracking-[0.36em] text-[#715a3e]">{label}</p>
          </div>
          <p className="text-[9px] uppercase tracking-[0.24em] text-stone-400">
            {totalPages > 1 ? `${pageNum} / ${totalPages}` : 'Editorial Profile'}
          </p>
        </div>

        <div className="flex-1 pt-6">{children}</div>
      </div>
    </div>
  )
}

// ── Footer bar shared by text-heavy about pages ─

function AboutIntroPage({
  paragraphs,
  pageNum,
  totalPages,
}: AboutPageProps & {
  paragraphs: string[]
}) {
  return (
    <AboutPageFrame label="About AFEEL" pageNum={pageNum} totalPages={totalPages}>
      <div className="grid h-full gap-10" style={{ gridTemplateColumns: '42% 58%' }}>
        {/* Left: Identity */}
        <div className="flex flex-col justify-between border-r border-stone-900/8 pr-8">
          <div className="grid gap-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">
              Real impact. Measured differently.
            </p>
            <h2
              className="text-[3rem] leading-[0.93] tracking-[-0.065em] text-stone-950"
              style={{ fontFamily: 'var(--font-brochure-serif)' }}
            >
              브랜드와 셀럽이
              <br />
              자연스럽게 만나는
              <br />
              <span className="italic text-[#715a3e]">장면</span>을 설계합니다.
            </h2>
            <p className="text-[12px] leading-7 text-stone-600">
              소개 페이지의 에디토리얼 톤을 그대로 가져와, 브로셔에서도 같은 시선과 같은 호흡으로 브랜드 이야기를 이어갑니다.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-stone-900/8 bg-stone-900/8">
            {ABOUT_FOCUS_ITEMS.map((item) => (
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
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-stone-400">
              Fashion PR Editorial Archive
            </p>
            <p className="text-[9px] uppercase tracking-[0.24em] text-stone-300">afeelcompany.com</p>
          </div>
        </div>
      </div>
    </AboutPageFrame>
  )
}

function AboutStoryPage({
  paragraphs,
  pageNum,
  totalPages,
}: AboutPageProps & {
  paragraphs: string[]
}) {
  return (
    <AboutPageFrame label="How We Work" pageNum={pageNum} totalPages={totalPages}>
      <div className="grid h-full gap-10" style={{ gridTemplateColumns: '38% 62%' }}>
        {/* Left: Philosophy */}
        <div className="flex flex-col justify-between border-r border-stone-900/8 pr-8">
          <div className="grid gap-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">How We Work</p>
            <h2
              className="text-[2.6rem] leading-[0.98] tracking-[-0.06em] text-stone-950"
              style={{ fontFamily: 'var(--font-brochure-serif)' }}
            >
              텍스트가
              <br />
              한 줄씩
              <br />
              드러나듯.
            </h2>
            <p className="text-[11px] leading-6 text-stone-600">
              브랜드와 셀럽의 한 장면이 대중의 열망으로 번지는 순간을 중심에 둡니다.
            </p>
          </div>

          <div className="grid gap-3 border-t border-stone-900/8 pt-5">
            {ABOUT_STORY_LINES.map((line) => (
              <div key={line} className="flex items-start gap-3">
                <span className="mt-[9px] h-px w-3 shrink-0 bg-[#715a3e]" />
                <p className="text-[11px] leading-6 text-stone-600">{line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Story text */}
        <div className="flex h-full flex-col justify-between pl-2">
          <div className="grid gap-5">
            <div className="flex items-center gap-3">
              <span className="h-px w-4 bg-stone-300" />
              <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-stone-400">Editorial Philosophy</p>
            </div>
            <div className="h-px bg-stone-900/8" />
            {paragraphs.map((paragraph, index) => (
              <p key={`story-${index}`} className="text-[13.5px] leading-[2.05] text-stone-600">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-stone-900/8 pt-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-stone-400">Editorial Philosophy</p>
            <p className="text-[9px] uppercase tracking-[0.24em] text-stone-300">afeelcompany.com</p>
          </div>
        </div>
      </div>
    </AboutPageFrame>
  )
}

function AboutContinuationPage({
  paragraphs,
  pageNum,
  totalPages,
}: AboutPageProps & {
  paragraphs: string[]
}) {
  const storyCards = getStoryCards(pageNum)

  return (
    <AboutPageFrame label="Story Continuation" pageNum={pageNum} totalPages={totalPages}>
      <div className="grid h-full gap-8" style={{ gridTemplateColumns: '28% 72%' }}>
        <div className="flex flex-col justify-between border-r border-stone-900/8 pr-6">
          <div className="grid gap-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-stone-400">Continuation</p>
            <h2
              className="text-[2.3rem] leading-[1.02] tracking-[-0.055em] text-stone-950"
              style={{ fontFamily: 'var(--font-brochure-serif)' }}
            >
              The
              <br />
              Accumulation
              <br />
              Line
            </h2>
            <p className="text-[11px] leading-6 text-stone-600">
              소개문이 길어지더라도 페이지를 나눠 읽는 리듬을 유지합니다.
            </p>
          </div>

          <div className="grid gap-3 border-t border-stone-900/8 pt-4">
            {storyCards.map((line) => (
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
  )
}

function AboutTimelinePage({ pageNum, totalPages }: AboutPageProps) {
  return (
    <AboutPageFrame label="Work History" pageNum={pageNum} totalPages={totalPages}>
      <div className="grid h-full gap-10" style={{ gridTemplateColumns: '28% 72%' }}>
        {/* Left */}
        <div className="flex flex-col justify-between border-r border-stone-900/8 pr-6">
          <div className="grid gap-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">Work History</p>
            <h2
              className="text-[2.85rem] leading-[0.98] tracking-[-0.06em] text-stone-950"
              style={{ fontFamily: 'var(--font-brochure-serif)' }}
            >
              The
              <br />
              Accumulation
              <br />
              Line
            </h2>
            <p className="text-[11px] leading-6 text-stone-600">어떤 브랜드, 어떤 배우, 어떤 결과였는지.</p>
          </div>

          <div className="grid gap-2 border-t border-stone-900/8 pt-4">
            <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-stone-400">Archive View</p>
            <p className="text-[11px] leading-6 text-stone-600">
              한 번의 노출을 이벤트로 끝내지 않고, 다음 제안서와 다음 협업으로 이어지는 축적의 흐름으로 관리합니다.
            </p>
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="relative pl-6">
          <div className="absolute left-[10px] top-2 h-[calc(100%-16px)] w-px bg-stone-900/15" />
          <div className="grid h-full grid-cols-2 gap-3 content-start">
            {ABOUT_MILESTONES.map((milestone) => (
              <article
                key={`${milestone.year}-${milestone.title}`}
                className="relative ml-4 border border-stone-900/8 bg-white px-5 py-4"
              >
                <div className="absolute -left-[22px] top-5 h-2.5 w-2.5 rounded-full bg-[#715a3e]" />
                <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#715a3e]">{milestone.year}</p>
                <h3
                  className="mt-2 text-[16px] leading-[1.2] tracking-[-0.04em] text-stone-950"
                  style={{ fontFamily: 'var(--font-brochure-serif)' }}
                >
                  {milestone.title}
                </h3>
                <p className="mt-1.5 text-[10px] leading-5 text-stone-600">{milestone.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </AboutPageFrame>
  )
}

function AboutExpertisePage({ pageNum, totalPages }: AboutPageProps) {
  return (
    <AboutPageFrame label="Core Expertise" pageNum={pageNum} totalPages={totalPages}>
      <div className="flex h-full flex-col gap-6">
        <div className="grid gap-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">Core Expertise</p>
          <div className="flex items-end justify-between gap-8">
            <h2
              className="text-[3rem] leading-[0.95] tracking-[-0.06em] text-stone-950"
              style={{ fontFamily: 'var(--font-brochure-serif)' }}
            >
              What We Do
            </h2>
            <p className="max-w-[34ch] text-right text-[12px] leading-7 text-stone-600">
              포지셔닝에서 아카이빙까지, 브랜드와 셀럽이 만나는 모든 접점을 함께 다룹니다.
            </p>
          </div>
        </div>

        <div className="grid flex-1 gap-px overflow-hidden border border-stone-900/8 bg-stone-900/8" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {ABOUT_SERVICE_ITEMS.map((item) => (
            <article key={item.title} className="grid content-start gap-4 bg-[#faf7f3] p-7">
              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-stone-400">{item.title}</p>
              <h3
                className="text-[26px] leading-none tracking-[-0.05em] text-stone-950"
                style={{ fontFamily: 'var(--font-brochure-serif)' }}
              >
                {item.headline}
              </h3>
              <p className="text-[12px] leading-7 text-stone-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </AboutPageFrame>
  )
}

function AboutEdgePage({ pageNum, totalPages }: AboutPageProps) {
  return (
    <AboutPageFrame label="Why AFEEL" pageNum={pageNum} totalPages={totalPages}>
      <div className="flex h-full flex-col gap-5">
        <div className="grid gap-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">Our Edge</p>
          <div className="flex items-end justify-between gap-8">
            <h2
              className="text-[3rem] leading-[0.95] tracking-[-0.06em] text-stone-950"
              style={{ fontFamily: 'var(--font-brochure-serif)' }}
            >
              Why AFEEL
            </h2>
            <p className="max-w-[34ch] text-right text-[12px] leading-7 text-stone-600">
              미학, 기록, 그리고 상업적 결과를 함께 생각합니다.
            </p>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden border border-stone-900/8 bg-stone-900/8 md:grid-cols-3">
          {ABOUT_EDGE_ITEMS.map((item) => (
            <article key={item.title} className="grid content-start gap-4 bg-[#faf7f3] p-7">
              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-stone-400">{item.title}</p>
              <h3
                className="text-[26px] leading-none tracking-[-0.05em] text-stone-950"
                style={{ fontFamily: 'var(--font-brochure-serif)' }}
              >
                {item.headline}
              </h3>
              <p className="text-[12px] leading-7 text-stone-600">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-4 bg-stone-950 px-8 py-7 text-white">
          <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#ccead6]">Target Alignment</p>
          <div className="grid gap-1">
            {ABOUT_SOCIAL_PROOF_LINES.map((line) => (
              <p
                key={line}
                className="text-[22px] leading-tight tracking-[-0.04em]"
                style={{ fontFamily: 'var(--font-brochure-serif)' }}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>
    </AboutPageFrame>
  )
}

interface WorkSheetProps {
  items: PdfPortfolioItem[]
  pageNum: number
  totalPages: number
}

function WorkSheet({ items, pageNum, totalPages }: WorkSheetProps) {
  return (
    <div className="flex h-full flex-col px-8 py-7">
      <div className="mb-5 flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-[#715a3e]" />
          <p className="text-[9px] font-medium uppercase tracking-[0.36em] text-stone-400">Work</p>
        </div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-stone-300">
          {totalPages > 1 ? `${pageNum} / ${totalPages}` : 'Selected Portfolio'}
        </p>
      </div>

      <div
        className="grid flex-1 gap-4"
        style={{
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: items.length > 3 ? '1fr 1fr' : '1fr',
        }}
      >
        {items.map((item) => (
          <article
            key={item.id}
            className="avoid-break flex h-full min-h-0 flex-col overflow-hidden border border-stone-900/8 bg-white shadow-[0_16px_28px_rgba(28,25,23,0.06)]"
          >
            <div className="relative flex-1 min-h-0 bg-stone-100">
              <PdfImage
                src={item.imageUrl}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-contain object-center p-2"
              />
            </div>

            <div className="grid gap-1 border-t border-stone-900/8 bg-[#fcfaf7] px-4 py-3 text-stone-950">
              {item.brandLogoUrl ? (
                <img
                  src={item.brandLogoUrl}
                  alt={`${item.brandName} logo`}
                  className="h-4 max-w-[96px] object-contain object-left"
                />
              ) : (
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                  {item.brandName}
                </p>
              )}
              <p
                className="text-[16px] leading-tight tracking-[-0.04em] text-stone-950"
                style={{ fontFamily: 'var(--font-brochure-serif)' }}
              >
                {item.celebrityName ?? item.title}
              </p>
              {item.celebrityName ? (
                <p className="text-[9px] leading-4 text-stone-500">{item.title}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

interface ClientSheetProps {
  brands: PdfClientBrand[]
  pageNum: number
  totalPages: number
  totalBrands: number
}

function ClientSheet({ brands, pageNum, totalPages, totalBrands }: ClientSheetProps) {
  return (
    <div className="flex h-full flex-col px-8 py-7">
      <div className="mb-5 flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-[#715a3e]" />
          <p className="text-[9px] font-medium uppercase tracking-[0.36em] text-stone-400">Client</p>
        </div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-stone-300">
          {totalPages > 1 ? `${pageNum} / ${totalPages}  ·  ${totalBrands} Brands` : `${totalBrands} Brands`}
        </p>
      </div>

      <div
        className="grid flex-1 gap-3"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: '1fr',
        }}
      >
        {brands.map((brand) => (
          <article
            key={brand.id}
            className="avoid-break flex flex-col items-center justify-center gap-3 overflow-hidden border border-stone-900/8 bg-white px-4 py-4"
          >
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name} className="h-10 w-full object-contain" />
            ) : (
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                {brand.name}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────

export default async function PdfExportPage() {
  const brochure = await getPdfDocument()

  const aboutNarrative = splitAboutNarrative(brochure.aboutText)
  const workChunks = chunk(brochure.workItems, WORK_PER_PAGE)
  const clientChunks = chunk(brochure.clientBrands, CLIENT_PER_PAGE)

  const sections: { id: string; node: ReactNode }[] = []

  // Cover
  sections.push({
    id: 'cover',
    node: (
      <BrochureSheet sectionId="cover">
        <div className="grid h-full" style={{ gridTemplateColumns: '38% 62%' }}>
          <div className="relative overflow-hidden">
            <PdfImage
              src={brochure.heroImageUrl}
              alt={`${brochure.title} cover`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex h-full flex-col justify-between px-12 py-10">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#715a3e]" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.44em] text-[#715a3e]">
                Fashion PR Agency
              </span>
            </div>
            <div className="grid gap-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-stone-400">
                Company Brochure
              </p>
              <h1
                className="text-[4.2rem] leading-[0.92] tracking-[-0.04em] text-stone-950"
                style={{ fontFamily: 'var(--font-brochure-serif)' }}
              >
                AFEEL<br />
                <span className="italic">Company.</span>
              </h1>
              <p className="mt-2 max-w-[34ch] text-[13px] leading-7 text-stone-500">
                브랜드와 셀럽의 접점을 설계하고,<br />
                한 번 정리한 포트폴리오를 웹·소개서·소셜까지 이어 붙이는 패션 PR 스튜디오.
              </p>
            </div>
            <div className="flex items-end justify-between border-t border-stone-100 pt-6">
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
  })

  // About
  const aboutSections: { key: string; render: (pageNum: number, totalPages: number) => ReactNode }[] = [
    {
      key: 'intro',
      render: (pageNum, totalPages) => (
        <AboutIntroPage
          paragraphs={aboutNarrative.introParagraphs}
          pageNum={pageNum}
          totalPages={totalPages}
        />
      ),
    },
    {
      key: 'story',
      render: (pageNum, totalPages) => (
        <AboutStoryPage
          paragraphs={aboutNarrative.storyParagraphs}
          pageNum={pageNum}
          totalPages={totalPages}
        />
      ),
    },
    ...aboutNarrative.continuationParagraphs.map((paragraphs, index) => ({
      key: `continuation-${index + 1}`,
      render: (pageNum: number, totalPages: number) => (
        <AboutContinuationPage paragraphs={paragraphs} pageNum={pageNum} totalPages={totalPages} />
      ),
    })),
    {
      key: 'timeline',
      render: (pageNum, totalPages) => (
        <AboutTimelinePage pageNum={pageNum} totalPages={totalPages} />
      ),
    },
    {
      key: 'expertise',
      render: (pageNum, totalPages) => (
        <AboutExpertisePage pageNum={pageNum} totalPages={totalPages} />
      ),
    },
    {
      key: 'edge',
      render: (pageNum, totalPages) => (
        <AboutEdgePage pageNum={pageNum} totalPages={totalPages} />
      ),
    },
  ]

  aboutSections.forEach((section, index) => {
    const pageNum = index + 1
    const totalPages = aboutSections.length
    const sectionId = `about-${pageNum}-${totalPages}`

    sections.push({
      id: sectionId,
      node: (
        <BrochureSheet sectionId={sectionId}>
          {section.render(pageNum, totalPages)}
        </BrochureSheet>
      ),
    })
  })

  // Work — one page per chunk of 4
  workChunks.forEach((items, i) => {
    const pageNum = i + 1
    const totalPages = workChunks.length
    sections.push({
      id: `work-${pageNum}-${totalPages}`,
      node: (
        <BrochureSheet sectionId={`work-${pageNum}-${totalPages}`}>
          <WorkSheet items={items} pageNum={pageNum} totalPages={totalPages} />
        </BrochureSheet>
      ),
    })
  })

  // Client — one page per chunk of 12
  clientChunks.forEach((brands, i) => {
    const pageNum = i + 1
    const totalPages = clientChunks.length
    sections.push({
      id: `client-${pageNum}-${totalPages}`,
      node: (
        <BrochureSheet sectionId={`client-${pageNum}-${totalPages}`}>
          <ClientSheet
            brands={brands}
            pageNum={pageNum}
            totalPages={totalPages}
            totalBrands={brochure.clientBrands.length}
          />
        </BrochureSheet>
      ),
    })
  })

  // Contact
  sections.push({
    id: 'contact',
    node: (
      <BrochureSheet sectionId="contact">
        <div className="grid h-full" style={{ gridTemplateColumns: '52% 48%' }}>
          <div className="flex flex-col justify-between bg-stone-950 px-12 py-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[#715a3e]" />
              <p className="text-[9px] font-medium uppercase tracking-[0.36em] text-stone-500">Contact</p>
            </div>
            <div className="grid gap-5">
              <h2
                className="text-[2.8rem] leading-[1.04] tracking-[-0.03em] text-white"
                style={{ fontFamily: 'var(--font-brochure-serif)' }}
              >
                브랜드의 이야기를<br />
                <span className="italic text-stone-400">함께</span> 써드립니다.
              </h2>
              <p className="text-[11px] leading-7 text-stone-500">
                어필컴퍼니는 패션 브랜드와 셀럽 사이의 접점을 설계합니다.<br />
                새로운 협업이나 PR 문의는 아래 연락처로 보내주세요.
              </p>
            </div>
            <p className="text-[9px] uppercase tracking-[0.24em] text-stone-700">
              AFEEL Company · Seoul, Korea
            </p>
          </div>
          <div className="flex flex-col justify-center px-12 py-10">
            <dl className="grid gap-7">
              <div className="grid gap-1.5">
                <dt className="text-[9px] uppercase tracking-[0.32em] text-stone-400">이메일</dt>
                <dd className="text-[18px] font-medium text-stone-950">{brochure.contact.email}</dd>
              </div>
              <div className="h-px bg-stone-100" />
              <div className="grid gap-1.5">
                <dt className="text-[9px] uppercase tracking-[0.32em] text-stone-400">전화</dt>
                <dd className="text-[18px] font-medium text-stone-950">{brochure.contact.phone}</dd>
              </div>
              <div className="h-px bg-stone-100" />
              <div className="grid gap-1.5">
                <dt className="text-[9px] uppercase tracking-[0.32em] text-stone-400">주소</dt>
                <dd className="text-[18px] font-medium text-stone-950">{brochure.contact.address}</dd>
              </div>
            </dl>
            <div className="mt-8 flex items-center gap-3 border-t border-stone-100 pt-6">
              <span className="h-px w-6 bg-[#715a3e]" />
              <p className="text-[9px] uppercase tracking-[0.24em] text-stone-400">afeelcompany.com</p>
            </div>
          </div>
        </div>
      </BrochureSheet>
    ),
  })

  return <PdfPreviewWorkspace sections={sections} />
}
