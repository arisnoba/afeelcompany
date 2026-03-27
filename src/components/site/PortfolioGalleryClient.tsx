'use client'

import Image from 'next/image'
import { useState } from 'react'

import { PortfolioLightbox } from '@/components/site/PortfolioLightbox'
import { PORTFOLIO_CATEGORIES } from '@/types/portfolio'
import type { PublicPortfolioItem } from '@/types/site'

const FILTER_ALL = '전체'

interface PortfolioGalleryClientProps {
  items: PublicPortfolioItem[]
}

export function PortfolioGalleryClient({ items }: PortfolioGalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState(FILTER_ALL)
  const [activeItemId, setActiveItemId] = useState<string | null>(null)

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

  const activeItem =
    filteredItems.find((item) => item.id === activeItemId) ?? null

  return (
    <section className="grid gap-6 rounded-[2rem] border border-stone-900/8 bg-white/72 px-6 py-7 shadow-[0_22px_60px_rgba(56,36,19,0.08)] backdrop-blur-sm sm:px-8">
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => {
          const isActive = filter === selectedCategory

          return (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setSelectedCategory(filter)
                setActiveItemId(null)
              }}
              className={`inline-flex h-11 items-center rounded-full border px-4 text-sm transition ${
                isActive
                  ? 'border-stone-950 bg-stone-950 text-stone-50'
                  : 'border-stone-900/10 bg-stone-100 text-stone-700 hover:border-stone-900/20 hover:bg-stone-200'
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveItemId(item.id)}
              className="group overflow-hidden rounded-[1.75rem] border border-stone-900/8 bg-stone-100 text-left shadow-[0_18px_48px_rgba(56,36,19,0.06)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(56,36,19,0.12)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-200">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>
              <div className="grid gap-2 px-5 py-5">
                <p className="text-[0.7rem] uppercase tracking-[0.34em] text-stone-500">
                  {item.category}
                </p>
                <h2 className="text-2xl tracking-[-0.04em] text-stone-950">
                  {item.title}
                </h2>
                <p className="text-sm text-stone-600">{item.brandName}</p>
              </div>
            </button>
          ))}
        </div>
      )}

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
