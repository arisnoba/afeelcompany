import { BrandLogoGrid } from '@/components/site/BrandLogoGrid'
import { getSiteClientBrands, getSiteCompanyProfile } from '@/lib/site'

const FALLBACK_ABOUT =
  '어필컴퍼니는 브랜드 이미지와 셀럽 노출의 접점을 설계하고, 축적된 작업물을 한 번의 업데이트로 여러 채널에 연결하는 방식을 지향합니다.'

export default async function AboutPage() {
  const [profile, brands] = await Promise.all([
    getSiteCompanyProfile(),
    getSiteClientBrands(),
  ])

  return (
    <div className="grid gap-8 py-8 sm:gap-10 sm:py-10 lg:gap-14 lg:py-14">
      <section className="grid gap-8 rounded-[2rem] border border-stone-900/10 bg-white/74 px-6 py-8 shadow-[0_22px_60px_rgba(56,36,19,0.08)] backdrop-blur-sm lg:grid-cols-[minmax(0,1.2fr)_280px] lg:px-10 lg:py-10">
        <div>
          <p className="text-xs uppercase tracking-[0.36em] text-stone-500">
            About
          </p>
          <h1 className="mt-4 text-4xl tracking-[-0.05em] text-stone-950 sm:text-5xl">
            회사 소개
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-stone-700 sm:text-lg">
            {profile.aboutText || FALLBACK_ABOUT}
          </p>
        </div>

        <div className="grid gap-4 rounded-[1.75rem] border border-stone-900/10 bg-stone-950 px-5 py-6 text-stone-100">
          <p className="text-[0.7rem] uppercase tracking-[0.36em] text-stone-400">
            Working Method
          </p>
          <div className="grid gap-3 text-sm leading-6 text-stone-300">
            <p>브랜드 맥락과 셀럽 접점을 먼저 정리합니다.</p>
            <p>작업물은 포트폴리오, 소개서, 인스타그램 흐름으로 함께 확장됩니다.</p>
            <p>운영 데이터는 내부 관리자 화면과 동일한 소스에서 직접 읽습니다.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 rounded-[2rem] border border-stone-900/8 bg-stone-950 px-6 py-7 text-stone-50 shadow-[0_30px_90px_rgba(26,18,10,0.18)] sm:px-8 sm:py-8">
        <div>
          <p className="text-xs uppercase tracking-[0.36em] text-stone-400">
            Clients
          </p>
          <h2 className="mt-3 text-3xl tracking-[-0.05em] text-white sm:text-4xl">
            함께한 브랜드
          </h2>
        </div>

        <BrandLogoGrid brands={brands} />
      </section>
    </div>
  )
}
