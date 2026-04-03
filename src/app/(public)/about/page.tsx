import Link from 'next/link'

import { BrandLogoGrid } from '@/components/site/BrandLogoGrid'
import { getSiteClientBrands, getSiteCompanyProfile } from '@/lib/site'

const FALLBACK_ABOUT =
  '어필컴퍼니는 브랜드 이미지와 셀럽 노출의 접점을 설계하고, 축적된 작업물을 한 번의 업데이트로 여러 채널에 연결하는 방식을 지향합니다.'

const SERVICES = [
  {
    title: 'PR & Communications',
    description:
      '브랜드의 결을 해치지 않으면서도 더 넓은 장면으로 확장되는 커뮤니케이션 시나리오를 설계합니다.',
  },
  {
    title: 'Event Management',
    description:
      '런칭, 프레젠테이션, 프레스 이벤트를 하나의 인상으로 읽히도록 현장 경험과 공개 결과물을 함께 정리합니다.',
  },
  {
    title: 'Digital Strategy',
    description:
      '포트폴리오, 소개서, 인스타그램 아카이브가 같은 목소리를 유지하도록 디지털 접점을 정교하게 연결합니다.',
  },
]

const WORKING_METHOD = [
  {
    label: 'Observation',
    description: '브랜드와 셀럽, 매체 접점에서 무엇이 실제로 인상을 남기는지 먼저 읽어냅니다.',
  },
  {
    label: 'Composition',
    description: '보이는 결과만이 아니라 과정과 맥락까지 포함한 공개용 서사를 설계합니다.',
  },
  {
    label: 'Continuity',
    description: '한 번 정리된 결과가 포트폴리오, 소개서, 소셜 아카이브로 이어지게 유지합니다.',
  },
]

export default async function AboutPage() {
  const [profile, brands] = await Promise.all([
    getSiteCompanyProfile(),
    getSiteClientBrands(),
  ])

  const aboutText = profile.aboutText || FALLBACK_ABOUT

  return (
    <div className="grid gap-24 py-10 sm:gap-28 sm:py-14 lg:gap-32 lg:py-20">
      <header className="grid gap-8">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">
          The Collective
        </p>
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="grid gap-6 md:col-span-8">
            <h1 className="text-5xl font-light leading-[0.92] tracking-[-0.06em] [font-family:var(--font-newsreader)] sm:text-7xl lg:text-[7rem]">
              Curating
              <br />
              the Invisible
            </h1>
          </div>
          <div className="grid gap-4 md:col-span-4 md:pb-3">
            <p className="text-base leading-8 text-stone-600 sm:text-lg">
              보이지 않는 인상과 맥락을 읽고, 브랜드의 서사를 더 정교한 공개 아카이브로
              정리합니다.
            </p>
          </div>
        </div>
      </header>

      <section className="relative grid gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)] md:items-end">
        <div className="relative min-h-[24rem] overflow-hidden bg-[#f0eded] sm:min-h-[30rem]">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(17,24,39,0.28),transparent_38%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.52),transparent_36%),linear-gradient(180deg,rgba(39,65,51,0.18),rgba(17,24,39,0.04))]" />
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.42)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="absolute inset-x-0 bottom-0 grid gap-3 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-6 py-8 text-white sm:px-10 sm:py-10">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-white/65">
              Editorial Atmosphere
            </p>
            <p className="max-w-lg text-2xl leading-tight [font-family:var(--font-newsreader)] sm:text-4xl">
              Prestige is often built in the layer beneath the obvious.
            </p>
          </div>
        </div>

        <div className="md:-ml-20 md:mb-10">
          <div className="grid gap-6 bg-[#eae7e7] p-8 sm:p-10 md:p-12">
            <h2 className="text-4xl italic leading-none tracking-[-0.05em] text-stone-900 [font-family:var(--font-newsreader)] sm:text-5xl">
              Our Vision
            </h2>
            <p className="text-base leading-8 text-stone-600 sm:text-lg">
              {aboutText}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f3f2] px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid w-full max-w-screen-2xl gap-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="text-4xl leading-none tracking-[-0.05em] text-stone-900 [font-family:var(--font-newsreader)] sm:text-5xl">
              Strategic Prowess
            </h2>
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-stone-400">
              Services Portfolio
            </span>
          </div>

          <div className="grid gap-10 md:grid-cols-3 md:gap-12">
            {SERVICES.map((service) => (
              <article key={service.title} className="grid gap-4 pt-8">
                <h3 className="text-2xl leading-tight text-[#274133] [font-family:var(--font-newsreader)]">
                  {service.title}
                </h3>
                <p className="text-sm leading-8 text-stone-600 sm:text-base">
                  {service.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-10">
        <div className="grid gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(280px,1.1fr)] md:items-start">
          <div className="grid gap-4">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">
              Working Method
            </p>
            <h2 className="text-4xl leading-none tracking-[-0.05em] text-stone-900 [font-family:var(--font-newsreader)] sm:text-5xl">
              Precision behind the surface.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
            어필컴퍼니의 작업은 결과물만 만드는 방식이 아니라, 브랜드의 현재 위치와 이후
            장면까지 함께 설계하는 방식에 가깝습니다.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          {WORKING_METHOD.map((item, index) => (
            <article key={item.label} className="grid gap-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-stone-400">
                {String(index + 1).padStart(2, '0')} {item.label}
              </p>
              <p className="text-lg leading-8 text-stone-700">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6">
        <div className="grid gap-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">
            Clients
          </p>
          <h2 className="text-4xl leading-none tracking-[-0.05em] text-stone-900 [font-family:var(--font-newsreader)] sm:text-5xl">
            Collective Partners
          </h2>
        </div>
        <BrandLogoGrid brands={brands} />
      </section>

      <section className="bg-stone-950 px-8 py-16 text-center text-white sm:px-12 sm:py-20">
        <div className="mx-auto grid max-w-3xl justify-items-center gap-8">
          <h2 className="text-4xl italic leading-none tracking-[-0.05em] [font-family:var(--font-newsreader)] sm:text-5xl">
            Begin the Dialogue
          </h2>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-[#274133] px-10 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-[#ccead6] transition hover:bg-[#5f7b6b] hover:text-white"
          >
            Inquire for Collaboration
          </Link>
        </div>
      </section>
    </div>
  )
}
