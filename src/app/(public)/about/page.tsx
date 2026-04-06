import Image from 'next/image'
import Link from 'next/link'

import { getSiteClientBrands, getSiteCompanyProfile } from '@/lib/site'
import type { SiteClientBrand } from '@/types/site'

const FALLBACK_ABOUT =
  '어필컴퍼니는 브랜드 이미지와 셀럽 노출의 접점을 설계하고, 축적된 작업물을 한 번의 업데이트로 여러 채널에 연결하는 방식을 지향합니다.'

const STORY_LINES = [
  '2018년 봄, 어필컴퍼니는 단순한 목표 하나로 시작했습니다.',
  "'우리가 가장 잘하는 일을, 가장 확실하게 하자.'",
  '우리는 그저 옷을 협찬하는 데 그치지 않습니다.',
  '스타의 고유한 분위기에 완벽히 맞는 핏을 찾습니다.',
  '그 찰나의 순간이 대중의 열망으로 번지도록 설계합니다.',
  '화려한 지표를 꾸며내기보다 현상 그 자체에 집중합니다.',
  '어제보다 오늘 더 많은 브랜드가 품절 대란을 겪고,',
  '더 많은 스타일리스트가 우리를 찾는 흐름을 증명합니다.',
]

const MOMENTUM_MILESTONES = [
  {
    year: '2018.04',
    title: '새로운 기준의 시작',
    description: '어필컴퍼니 설립',
  },
  {
    year: '2019',
    title: '드라마 패션의 판도를 바꾸다',
    description: '주요 완판 사례 릴레이 시작',
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
]

const EDGE_ITEMS = [
  {
    title: 'Strategic Curation',
    headline: '기획된 우연',
    description:
      '우연한 노출은 없습니다. 브랜드의 미학과 셀럽의 페르소나를 예리하게 매칭해 대중의 시선을 사로잡는 결정적 씬(Scene)을 만듭니다.',
  },
  {
    title: 'Endless Archive',
    headline: '집요한 기록',
    description:
      '트렌드는 휘발되지만 기록은 남습니다. 모든 방송, SNS, 미디어 노출을 실시간으로 추적하고 바이럴 자산으로 영구히 보존합니다.',
  },
  {
    title: 'Proven Impact',
    headline: '확실한 결과',
    description:
      '단순히 예쁜 사진 한 장을 넘어서, 연관 검색어 장악과 플랫폼 품절 대란이라는 실질적인 상업적 임팩트로 증명합니다.',
  },
]

const FALLBACK_NETWORK_NAMES = [
  'SHIFT',
  'HAVISM',
  'LUCIE RYU',
  'GLOBAL K-POP',
  'TOP ACTOR',
  'LEAD STYLIST',
  'FASHION EDITOR',
  'RUNWAY BRAND',
  'BESTSELLER DROP',
  'RED CARPET',
  'DRAMA FASHION',
  'ARCHIVE SIGNAL',
]

function buildNetworkNames(brands: SiteClientBrand[]) {
  const names = brands
    .map((brand) => brand.name.trim())
    .filter(Boolean)
    .map((name) => name.toUpperCase())

  const merged = [...names, ...FALLBACK_NETWORK_NAMES]

  return Array.from(new Set(merged))
}

function chunkNames(names: string[], size: number) {
  const chunks: string[][] = []

  for (let index = 0; index < names.length; index += size) {
    chunks.push(names.slice(index, index + size))
  }

  return chunks
}

function renderBrandMark(brand: SiteClientBrand, index: number) {
  if (brand.logoUrl) {
    return (
      <div
        key={`${brand.id}-${index}`}
        className="relative h-10 w-32 shrink-0 opacity-70 transition hover:opacity-100"
      >
        <Image
          src={brand.logoUrl}
          alt={brand.name}
          fill
          className="object-contain grayscale"
          sizes="128px"
        />
      </div>
    )
  }

  return (
    <span
      key={`${brand.id}-${index}`}
      className="shrink-0 text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-stone-400"
    >
      {brand.name}
    </span>
  )
}

export default async function AboutPage() {
  const [profile, brands] = await Promise.all([
    getSiteCompanyProfile(),
    getSiteClientBrands(),
  ])

  const aboutText = profile.aboutText || FALLBACK_ABOUT
  const networkNames = buildNetworkNames(brands)
  const nameColumns = chunkNames(networkNames, Math.ceil(networkNames.length / 3))
  const rollingBrands = brands.length > 0 ? brands : []

  return (
    <div className="grid gap-24 py-10 sm:gap-28 sm:py-14 lg:gap-32 lg:py-20">
      <header className="grid gap-10">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">
          About AFEEL
        </p>

        <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.7fr)] md:items-end">
          <div className="grid gap-6">
            <h1 className="text-5xl font-light leading-[0.92] tracking-[-0.07em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-7xl lg:text-[7rem]">
              숫자로는 담을 수 없는
              <br />
              진짜 영향력.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-600 sm:text-xl sm:leading-9">
              성장의 속도보다 중요한 것은 시장이 체감하는 기세입니다. 어필컴퍼니는
              무형의 모멘텀을 축적 가능한 신뢰로 바꾸는 방식으로 움직입니다.
            </p>
          </div>

          <div className="grid gap-4 border-l border-stone-900/8 pl-6">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">
              Philosophy Note
            </p>
            <p className="text-sm leading-7 text-stone-600">{aboutText}</p>
          </div>
        </div>
      </header>

      <section className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.7fr)] md:items-start">
        <div className="relative overflow-hidden border border-stone-900/8 bg-[linear-gradient(135deg,#f4f0ec_0%,#faf6f3_46%,#efebe7_100%)] px-7 py-10 sm:px-10 sm:py-12">
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(117,90,62,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(117,90,62,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="relative z-10 grid gap-4">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#715a3e]">
              Our Story & Philosophy
            </p>

            <div className="grid gap-3">
              {STORY_LINES.map((line, index) => (
                <p
                  key={line}
                  className={`max-w-3xl ${
                    index === 1
                      ? 'text-2xl italic leading-tight text-stone-950 [font-family:var(--font-newsreader)] sm:text-3xl'
                      : 'text-lg leading-8 text-stone-700 sm:text-[1.38rem] sm:leading-9'
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        <aside className="grid gap-5 bg-[#f6f1ec] p-8 sm:p-10">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">
            Working Principle
          </p>
          <p className="text-3xl italic leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)]">
            One idea.
            <br />
            One line.
          </p>
          <p className="text-sm leading-7 text-stone-600">
            선언은 짧고, 실행은 집요하게. 브랜드와 스타일리스트가 필요로 하는 것은
            과장된 수치가 아니라 반복해서 체감되는 결과입니다.
          </p>
          <div className="border-t border-stone-900/8 pt-5 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-stone-500">
            Momentum over vanity metrics
          </div>
        </aside>
      </section>

      <section className="relative overflow-hidden border border-stone-900/8 bg-stone-950 px-6 py-14 text-white sm:px-10 sm:py-18 lg:px-12 lg:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(95,123,107,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_28%)]" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="grid h-full grid-cols-2 gap-4 px-4 opacity-18 md:grid-cols-3">
            {nameColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="relative overflow-hidden">
                <div
                  className={
                    columnIndex % 2 === 0
                      ? 'about-rise-track flex flex-col gap-5 py-2'
                      : 'about-rise-track-reverse flex flex-col gap-5 py-2'
                  }
                >
                  {[...column, ...column].map((name, nameIndex) => (
                    <span
                      key={`${name}-${nameIndex}`}
                      className={`whitespace-nowrap font-semibold uppercase text-white/70 ${
                        nameIndex % 3 === 0
                          ? 'text-[0.68rem] tracking-[0.38em]'
                          : nameIndex % 3 === 1
                            ? 'text-[1.05rem] tracking-[0.18em] [font-family:var(--font-newsreader)]'
                            : 'text-[0.78rem] tracking-[0.3em]'
                      }`}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 grid gap-12 lg:grid-cols-[minmax(280px,0.42fr)_minmax(0,1fr)]">
          <div className="grid gap-5">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#ccead6]">
              Visualizing Momentum
            </p>
            <h2 className="text-4xl leading-none tracking-[-0.06em] text-white [font-family:var(--font-newsreader)] sm:text-5xl">
              The Accumulation Line
            </h2>
            <p className="max-w-md text-sm leading-7 text-stone-300 sm:text-base">
              수치 그래프 대신 시간을 시각화합니다. 쌓여온 사례의 밀도, 연결된 이름의
              압력, 그리고 계속 상승하는 현상을 하나의 흐름으로 보여줍니다.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-0 h-full w-px bg-white/14 sm:left-4" />
            <div className="grid gap-10">
              {MOMENTUM_MILESTONES.map((milestone, index) => (
                <article
                  key={milestone.year}
                  className={`relative ml-10 max-w-2xl border border-white/10 bg-white/6 p-6 backdrop-blur-sm sm:ml-14 sm:p-7 ${
                    index % 2 === 1 ? 'lg:ml-24' : ''
                  }`}
                >
                  <div className="absolute -left-[2.15rem] top-7 h-3 w-3 rounded-full border border-[#ccead6] bg-[#ccead6] shadow-[0_0_18px_rgba(204,234,214,0.7)] sm:-left-[2.85rem]" />
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#ccead6]">
                    {milestone.year}
                  </p>
                  <h3 className="mt-3 text-2xl tracking-[-0.04em] text-white [font-family:var(--font-newsreader)] sm:text-3xl">
                    {milestone.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-300 sm:text-base">
                    {milestone.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-0 overflow-hidden border border-stone-900/8 md:grid-cols-2">
        <div className="grid place-content-center bg-stone-950 p-12 text-center text-white sm:p-16">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#ccead6]">
            Core Expertise
          </p>
          <h2 className="mt-6 text-5xl italic tracking-[-0.05em] [font-family:var(--font-newsreader)] sm:text-6xl lg:text-7xl">
            Service<br />Excellence.
          </h2>
        </div>
        <div className="grid content-center bg-[#faf7f3] px-8 py-10 sm:px-12 sm:py-16">
          <ul className="grid gap-0">
            {[
              'Brand Positioning',
              'Editorial Placement',
              'Digital Strategy',
              'Archive Management',
            ].map((service, index) => (
              <li
                key={service}
                className="group flex items-baseline gap-6 border-b border-stone-900/10 py-6 transition-colors first:border-t hover:border-stone-400"
              >
                <span className="text-[0.62rem] font-semibold text-stone-400">0{index + 1}</span>
                <span className="text-2xl tracking-[-0.03em] text-stone-800 [font-family:var(--font-newsreader)] transition-transform duration-500 group-hover:translate-x-3 sm:text-3xl">
                  {service}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-10">
        <div className="grid gap-5 md:grid-cols-[minmax(0,0.95fr)_minmax(280px,1.05fr)] md:items-end">
          <div className="grid gap-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">
              Our Edge
            </p>
            <h2 className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl">
              Why AFEEL
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
            타깃이 가장 궁금해하는 질문에는 짧고 단단한 단어로 답합니다. 미학, 기록,
            상업적 결과까지 전부 연결하는 팀이라는 점이 우리의 차별점입니다.
          </p>
        </div>

        <div className="grid gap-px overflow-hidden border border-stone-900/8 bg-stone-900/8 md:grid-cols-3">
          {EDGE_ITEMS.map((item) => (
            <article key={item.title} className="grid gap-5 bg-[#faf7f3] p-7 sm:p-8">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">
                {item.title}
              </p>
              <h3 className="text-3xl tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)]">
                {item.headline}
              </h3>
              <p className="text-sm leading-8 text-stone-600 sm:text-base">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-10 border border-stone-900/8 bg-[#f5f1ec] px-6 py-12 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
        <div className="grid gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(280px,1.1fr)] md:items-end">
          <div className="grid gap-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">
              Social Proof
            </p>
            <h2 className="text-4xl leading-none tracking-[-0.05em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-5xl">
              Trusted by the Best
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
            숫자를 대신할 수 있는 가장 좋은 신뢰 신호는 함께 일하고 있는 얼굴입니다.
            다음 시즌의 메가 히트를 준비하는 브랜드와, 완벽한 룩이 필요한 스타일리스트가
            같은 이유로 어필컴퍼니를 찾습니다.
          </p>
        </div>

        <div className="relative overflow-hidden border-y border-stone-900/8 py-7 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="about-logo-marquee-track flex min-w-max items-center gap-14">
            {rollingBrands.length > 0
              ? [...rollingBrands, ...rollingBrands].map((brand, index) =>
                  renderBrandMark(brand, index)
                )
              : [...networkNames, ...networkNames].map((name, index) => (
                  <span
                    key={`${name}-${index}`}
                    className="shrink-0 text-[0.82rem] font-semibold uppercase tracking-[0.32em] text-stone-400"
                  >
                    {name}
                  </span>
                ))}
          </div>
        </div>

        <div className="grid gap-6 bg-stone-950 px-8 py-10 text-white sm:px-10">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-[#ccead6]">
            Target Alignment
          </p>
          <p className="max-w-4xl text-2xl leading-tight tracking-[-0.04em] [font-family:var(--font-newsreader)] sm:text-3xl">
            다음 시즌의 메가 히트를 준비하는 브랜드 매니저. 완벽한 레드카펫 룩이 당장
            필요한 스타일리스트. 어필컴퍼니는 당신의 가장 든든하고 확실한 파트너입니다.
          </p>
          <div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-white/16 bg-white/8 px-8 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/14"
            >
              Inquire for Collaboration
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
