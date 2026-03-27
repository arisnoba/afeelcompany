import { PortfolioGalleryClient } from '@/components/site/PortfolioGalleryClient'
import { getPublicPortfolioItems } from '@/lib/site'

export default async function PortfolioPage() {
  const items = await getPublicPortfolioItems()

  return (
    <div className="grid gap-8 py-8 sm:gap-10 sm:py-10 lg:gap-14 lg:py-14">
      <section className="grid gap-6 rounded-[2rem] border border-stone-900/10 bg-white/74 px-6 py-8 shadow-[0_22px_60px_rgba(56,36,19,0.08)] backdrop-blur-sm sm:px-8 lg:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.36em] text-stone-500">
            Portfolio
          </p>
          <h1 className="mt-4 text-4xl tracking-[-0.05em] text-stone-950 sm:text-5xl">
            PORTFOLIO
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-stone-700 sm:text-lg">
            카테고리별 포트폴리오를 한 화면에서 정리하고, 선택한 작업을 작은 라이트박스에서 바로 확인할 수 있도록 구성했습니다.
          </p>
        </div>

        <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
          카테고리별 포트폴리오
        </p>
      </section>

      <PortfolioGalleryClient items={items} />
    </div>
  )
}
