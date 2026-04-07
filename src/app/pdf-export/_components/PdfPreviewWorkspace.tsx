'use client'

import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  GalleryHorizontal,
  ScrollText,
} from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PreviewMode = 'scroll' | 'slide'

function getSectionLabel(id: string): string {
  if (id === 'cover') return 'Cover'
  if (id === 'about') return 'About'
  if (id === 'contact') return 'Contact'

  const workMatch = id.match(/^work-(\d+)-(\d+)$/)
  if (workMatch) return `Work ${workMatch[1]}/${workMatch[2]}`

  const clientMatch = id.match(/^client-(\d+)-(\d+)$/)
  if (clientMatch) return `Client ${clientMatch[1]}/${clientMatch[2]}`

  return id
}

interface PdfPreviewSection {
  id: string
  node: ReactNode
}

interface PdfPreviewWorkspaceProps {
  sections: PdfPreviewSection[]
}

export function PdfPreviewWorkspace({ sections }: PdfPreviewWorkspaceProps) {
  const [mode, setMode] = useState<PreviewMode>('scroll')
  const [activeIndex, setActiveIndex] = useState(0)
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [pendingPrint, setPendingPrint] = useState(false)

  const activeSection = sections[activeIndex]?.id ?? sections[0]?.id ?? 'cover'
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections])

  useEffect(() => {
    if (mode !== 'scroll') {
      return
    }

    const sectionElements = sectionIds
      .map((sectionId) =>
        document.querySelector<HTMLElement>(`[data-section="${sectionId}"]`)
      )
      .filter((element): element is HTMLElement => Boolean(element))

    if (sectionElements.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]

        const nextSectionId = visibleEntry?.target.getAttribute('data-section')

        if (!nextSectionId) {
          return
        }

        const nextIndex = sectionIds.findIndex((sectionId) => sectionId === nextSectionId)

        if (nextIndex >= 0) {
          setActiveIndex(nextIndex)
        }
      },
      {
        rootMargin: '-18% 0px -45% 0px',
        threshold: [0.2, 0.45, 0.7],
      }
    )

    sectionElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [mode, sectionIds])

  useEffect(() => {
    if (mode !== 'slide' || !swiper) {
      return
    }

    swiper.slideTo(activeIndex)
  }, [activeIndex, mode, swiper])

  useEffect(() => {
    if (!pendingPrint || mode !== 'scroll') {
      return
    }

    let cancelled = false

    const printDocument = async () => {
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => resolve())
        })
      })

      await document.fonts.ready

      const images = Array.from(
        document.querySelectorAll('img[data-pdf-image]')
      ) as HTMLImageElement[]

      await Promise.all(
        images.map(async (image) => {
          try {
            await image.decode()
          } catch {
            return
          }
        })
      )

      if (cancelled) {
        return
      }

      setPendingPrint(false)
      window.print()
    }

    void printDocument()

    return () => {
      cancelled = true
    }
  }, [mode, pendingPrint])

  function scrollToSection(index: number) {
    const sectionId = sectionIds[index]

    if (!sectionId) {
      return
    }

    const target = document.querySelector<HTMLElement>(`[data-section="${sectionId}"]`)

    if (!target) {
      return
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  function moveSection(direction: -1 | 1) {
    const nextIndex = activeIndex + direction

    if (nextIndex < 0 || nextIndex >= sections.length) {
      return
    }

    setActiveIndex(nextIndex)

    if (mode === 'slide') {
      swiper?.slideTo(nextIndex)
      return
    }

    scrollToSection(nextIndex)
  }

  function handleModeChange(nextMode: PreviewMode) {
    setMode(nextMode)

    if (nextMode === 'slide') {
      swiper?.slideTo(activeIndex)
      return
    }

    window.requestAnimationFrame(() => {
      scrollToSection(activeIndex)
    })
  }

  function handlePrintPreview() {
    handleModeChange('scroll')
  }

  function handleDownload() {
    setPendingPrint(true)
    handleModeChange('scroll')
  }

  return (
    <>
      <div className="screen-only sticky top-3 z-30 px-3">
        <div className="mx-auto flex w-full max-w-[1400px] justify-center">
          <div className="flex w-full max-w-[980px] flex-wrap items-center justify-center gap-2 rounded-[24px] border border-black/10 bg-white/78 px-2.5 py-2 shadow-[0_10px_28px_rgba(17,17,17,0.08)] backdrop-blur-xl">
            <div className="flex items-center gap-2 rounded-full bg-black/[0.035] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-black/50">
              <span>PDF</span>
              <span className="text-black/25">/</span>
              <span>
                {String(activeIndex + 1).padStart(2, '0')} of{' '}
                {String(sections.length).padStart(2, '0')}
              </span>
              <span className="hidden text-black/25 sm:inline">/</span>
              <span className="hidden sm:inline">{getSectionLabel(activeSection)}</span>
            </div>

            <div className="flex items-center rounded-full border border-black/10 bg-white p-1">
              <button
                type="button"
                onClick={() => handleModeChange('scroll')}
                className={cn(
                  'flex min-h-10 items-center gap-2 rounded-full px-3 text-sm transition',
                  mode === 'scroll'
                    ? 'bg-black text-white'
                    : 'text-black/55 hover:text-black'
                )}
              >
                <ScrollText />
                <span>스크롤</span>
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('slide')}
                className={cn(
                  'flex min-h-10 items-center gap-2 rounded-full px-3 text-sm transition',
                  mode === 'slide'
                    ? 'bg-black text-white'
                    : 'text-black/55 hover:text-black'
                )}
              >
                <GalleryHorizontal />
                <span>슬라이드</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => moveSection(-1)}
                disabled={activeIndex === 0}
                className="rounded-full bg-white/88"
              >
                <ChevronLeft />
                <span className="sr-only">이전</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => moveSection(1)}
                disabled={activeIndex === sections.length - 1}
                className="rounded-full bg-white/88"
              >
                <ChevronRight />
                <span className="sr-only">다음</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintPreview}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'min-h-10 rounded-full bg-white/88 px-3'
                )}
              >
                <Eye data-icon="inline-start" />
                <span className="hidden sm:inline">인쇄 미리보기</span>
                <span className="sm:hidden">미리보기</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className={cn(buttonVariants({ size: 'sm' }), 'min-h-10 rounded-full px-3')}
              >
                <Download data-icon="inline-start" />
                <span>다운로드</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {mode === 'slide' ? (
        <div className="pdf-slide-shell">
          <Swiper
            slidesPerView={1}
            spaceBetween={0}
            className="pdf-swiper"
            style={{ height: '100%' }}
            onSwiper={setSwiper}
            onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
          >
            {sections.map((section) => (
              <SwiperSlide key={section.id} className="pdf-swiper-slide">
                {section.node}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <main className="pdf-document">
          {sections.map((section) => (
            <Fragment key={section.id}>{section.node}</Fragment>
          ))}
        </main>
      )}
    </>
  )
}
