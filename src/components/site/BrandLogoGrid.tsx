import Image from 'next/image'

import type { SiteClientBrand } from '@/types/site'

interface BrandLogoGridProps {
  brands: SiteClientBrand[]
}

export function BrandLogoGrid({ brands }: BrandLogoGridProps) {
  if (brands.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-white/16 bg-white/5 px-6 py-16 text-center text-sm text-stone-300">
        등록된 브랜드 로고가 아직 없습니다.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {brands.map((brand) => (
        <article
          key={brand.id}
          className="grid min-h-36 place-items-center rounded-[1.5rem] border border-white/10 bg-white px-4 py-6 shadow-[0_18px_48px_rgba(13,10,6,0.16)]"
        >
          {brand.logoUrl ? (
            <div className="relative h-16 w-full">
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          ) : (
            <span className="text-sm text-stone-500">{brand.name}</span>
          )}
        </article>
      ))}
    </div>
  )
}
