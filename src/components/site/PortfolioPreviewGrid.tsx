import Link from 'next/link'
import Image from 'next/image'

import type { PublicPortfolioItem } from '@/types/site'

interface PortfolioPreviewGridProps {
  items: PublicPortfolioItem[]
  href?: string
}

export function PortfolioPreviewGrid({
  items,
  href = '/portfolio',
}: PortfolioPreviewGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-sm text-stone-500">
        표시할 포트폴리오가 아직 없습니다.
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.slice(0, 6).map((item, index) => (
        <Link
          key={item.id}
          href={href}
          className="group relative aspect-square overflow-hidden bg-stone-200"
        >
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.05]"
              loading={index < 3 ? 'eager' : 'lazy'}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
            {item.hoverImageUrl ? (
              <Image
                src={item.hoverImageUrl}
                alt={`${item.title} hover`}
                fill
                className="object-cover opacity-0 transition duration-300 group-hover:opacity-100"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            ) : null}
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.54)_100%)] transition duration-500 group-hover:opacity-0" />
          <div className="absolute inset-x-0 bottom-0 grid gap-1 px-5 py-5 text-white transition duration-500 group-hover:opacity-0 sm:px-6 sm:py-6">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-white/72">
              {item.brandName}
            </p>
            <p className="text-lg tracking-[-0.04em] text-white [font-family:var(--font-newsreader)] sm:text-xl">
              {item.celebrityName ?? item.title}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
