import { PortfolioGalleryClient } from '@/components/site/PortfolioGalleryClient'
import { getPublicPortfolioItems } from '@/lib/site'

export default async function PortfolioPage() {
  const items = await getPublicPortfolioItems()

  return (
    <div className="grid gap-14 py-12 sm:gap-16 sm:py-16 lg:gap-20 lg:py-20">
      <section className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[#715a3e]">
            Archives
          </p>
          <h1 className="mt-5 text-5xl font-light leading-none tracking-[-0.07em] text-stone-950 [font-family:var(--font-newsreader)] sm:text-6xl md:text-7xl">
            Selected Works
          </h1>
        </div>

        <p className="max-w-xl text-sm leading-7 text-stone-500 sm:text-base">
          카테고리별 작업을 정제된 3열 그리드로 정리했습니다. 카드 선택 시 기존
          라이트박스에서 상세 이미지를 이어서 확인할 수 있습니다.
        </p>
      </section>

      <PortfolioGalleryClient items={items} />
    </div>
  )
}
