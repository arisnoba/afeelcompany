import Image from 'next/image'

import { formatPortfolioCategories } from '@/types/portfolio'
import type { PublicPortfolioItem } from '@/types/site'

interface PortfolioPreviewGridProps {
  items: PublicPortfolioItem[]
}

export function PortfolioPreviewGrid({ items }: PortfolioPreviewGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-sm text-stone-500">
        표시할 포트폴리오가 아직 없습니다.
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.slice(0, 6).map((item, index) => (
        <article
          key={item.id}
          className={`group overflow-hidden rounded-[1.75rem] border border-stone-900/8 bg-stone-100 shadow-[0_18px_48px_rgba(56,36,19,0.06)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(56,36,19,0.12)] ${
            index === 0 ? 'md:col-span-2 xl:col-span-1' : ''
          }`}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-stone-200">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
            {item.hoverImageUrl ? (
              <Image
                src={item.hoverImageUrl}
                alt={`${item.title} hover`}
                fill
                className="object-cover opacity-0 transition duration-500 group-hover:opacity-100 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            ) : null}
          </div>
          <div className="grid gap-2 px-5 py-5">
            <p className="text-[0.7rem] uppercase tracking-[0.34em] text-stone-500">
              {formatPortfolioCategories(item.category)}
            </p>
            <h3 className="text-2xl tracking-[-0.04em] text-stone-950">
              {item.title}
            </h3>
            <p className="text-sm text-stone-600">{item.brandName}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
