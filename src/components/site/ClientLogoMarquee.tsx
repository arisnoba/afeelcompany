import Image from 'next/image'

import type { SiteClientBrand } from '@/types/site'

interface ClientLogoMarqueeProps {
  brands: SiteClientBrand[]
  className?: string
  trackClassName?: string
  logoClassName?: string
  imageClassName?: string
  emptyClassName?: string
  emptyLabel?: string
}

export function ClientLogoMarquee({
  brands,
  className,
  trackClassName,
  logoClassName,
  imageClassName,
  emptyClassName,
  emptyLabel = '등록된 클라이언트 로고가 아직 없습니다.',
}: ClientLogoMarqueeProps) {
  if (brands.length === 0) {
    return (
      <p className={emptyClassName ?? 'py-6 text-center text-sm text-stone-500'}>
        {emptyLabel}
      </p>
    )
  }

  return (
    <div className={className}>
      <div className={trackClassName}>
        {[...brands, ...brands].map((brand, index) => {
          if (!brand.logoUrl) {
            return null
          }

          return (
            <div
              key={`${brand.id}-${index}`}
              className={logoClassName ?? 'relative h-10 w-32 shrink-0 opacity-70 transition hover:opacity-100'}
            >
              <Image
                src={brand.logoUrl}
                alt={brand.name}
                fill
                unoptimized
                className={imageClassName ?? 'object-contain grayscale'}
                sizes="128px"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
