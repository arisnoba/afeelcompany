'use client'

import Image from 'next/image'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatPortfolioCategories } from '@/types/portfolio'
import type { PublicPortfolioItem } from '@/types/site'

interface PortfolioLightboxProps {
  item: PublicPortfolioItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PortfolioLightbox({
  item,
  open,
  onOpenChange,
}: PortfolioLightboxProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-[min(960px,calc(100%-2rem))] overflow-hidden rounded-[1.75rem] border border-stone-900/10 bg-[#f5efe6] p-0 text-stone-950">
        {item ? (
          <div className="grid gap-0 md:grid-cols-[minmax(0,1.1fr)_320px]">
            <div className="relative min-h-[360px] bg-stone-200">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>

            <div className="grid gap-5 px-6 py-6 sm:px-7 sm:py-7">
              <div className="grid gap-3">
                <p className="text-[0.7rem] uppercase tracking-[0.34em] text-stone-500">
                  {formatPortfolioCategories(item.category)}
                </p>
                <DialogTitle className="text-3xl tracking-[-0.05em] text-stone-950">
                  {item.title}
                </DialogTitle>
                <DialogDescription className="text-base leading-7 text-stone-700">
                  {item.brandName}
                </DialogDescription>
              </div>

              <div className="grid gap-4 text-sm text-stone-700">
                <div className="grid gap-1">
                  <span className="text-[0.7rem] uppercase tracking-[0.3em] text-stone-500">
                    Brand
                  </span>
                  <span>{item.brandName}</span>
                </div>
                <div className="grid gap-1">
                  <span className="text-[0.7rem] uppercase tracking-[0.3em] text-stone-500">
                    Category
                  </span>
                  <span>{formatPortfolioCategories(item.category)}</span>
                </div>
                {item.celebrityName ? (
                  <div className="grid gap-1">
                    <span className="text-[0.7rem] uppercase tracking-[0.3em] text-stone-500">
                      Celebrity
                    </span>
                    <span>{item.celebrityName}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
