'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

import { PortfolioLightbox } from '@/components/site/PortfolioLightbox'
import { PORTFOLIO_CATEGORIES } from '@/types/portfolio'
import type { PublicPortfolioItem } from '@/types/site'

const FILTER_ALL = '전체'
const INITIAL_VISIBLE_COUNT = 6
const LOAD_MORE_COUNT = 6

interface PortfolioGalleryClientProps {
  items: PublicPortfolioItem[]
}

export function PortfolioGalleryClient({ items }: PortfolioGalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState(FILTER_ALL)
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)

  const filters = [
    FILTER_ALL,
    ...PORTFOLIO_CATEGORIES.filter((category) =>
      items.some((item) => item.category === category)
    ),
  ]

  const filteredItems =
    selectedCategory === '전체'
      ? items
      : items.filter((item) => item.category === selectedCategory)

  const visibleItems = filteredItems.slice(0, visibleCount)
  const activeItem =
    filteredItems.find((item) => item.id === activeItemId) ?? null
  const canLoadMore = visibleCount < filteredItems.length

  return (
    <section className="grid gap-10">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        {filters.map((filter) => {
          const isActive = filter === selectedCategory

          return (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setSelectedCategory(filter)
                setActiveItemId(null)
                setVisibleCount(INITIAL_VISIBLE_COUNT)
              }}
              className={`border-b pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.26em] transition ${
                isActive
                  ? 'border-stone-950 text-stone-950'
                  : 'border-transparent text-stone-400 hover:text-stone-950'
              }`}
            >
              {filter}
            </button>
          )
        })}
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-sm text-stone-500">
          선택한 카테고리에 해당하는 작업이 없습니다.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveItemId(item.id)}
              className="group relative aspect-square overflow-hidden bg-stone-200 text-left"
            >
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-1000 group-hover:scale-[1.05]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.2)_40%,rgba(0,0,0,0.62)_100%)]" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/16 px-8 text-center opacity-0 transition duration-500 group-hover:opacity-100">
                <div className="translate-y-4 transition duration-500 group-hover:translate-y-0">
                  <h2 className="text-3xl tracking-[-0.05em] text-white [font-family:var(--font-newsreader)] sm:text-4xl">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-[0.62rem] font-semibold uppercase tracking-[0.32em] text-white/80">
                    {item.brandName}
                  </p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 grid gap-1 px-5 py-5 text-white sm:px-6 sm:py-6">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-white/72">
                  {item.category}
                </p>
                <p className="text-lg tracking-[-0.04em] text-white [font-family:var(--font-newsreader)] sm:text-xl">
                  {item.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {canLoadMore ? (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setVisibleCount((current) => current + LOAD_MORE_COUNT)}
            className="inline-flex items-center gap-3 bg-[#274133] px-8 py-4 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#e8f1ec] transition hover:bg-[#496455]"
          >
            Load More Archives
            <ChevronRight className="size-4" />
          </button>
        </div>
      ) : null}

      <PortfolioLightbox
        item={activeItem}
        open={activeItem !== null}
        onOpenChange={(open) => {
          if (!open) {
            setActiveItemId(null)
          }
        }}
      />
    </section>
  )
}
