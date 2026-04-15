'use client'

import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Layout,
  List,
  Loader2,
} from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type PreviewMode = 'scroll' | 'slide'

function getSectionLabel(id: string): string {
  if (id === 'cover') return 'Cover'
  if (id === 'about') return 'About'
  if (id === 'contact') return 'Contact'

  const aboutMatch = id.match(/^about-(\d+)-(\d+)$/)
  if (aboutMatch) return `About ${aboutMatch[1]}/${aboutMatch[2]}`

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
  const [downloading, setDownloading] = useState(false)

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

  async function handleDownload() {
    setDownloading(true)
    try {
      const res = await fetch('/api/pdf')
      if (!res.ok) throw new Error('PDF 생성 실패')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'afeel-company-brochure.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // fallback: browser print
      setPendingPrint(true)
      handleModeChange('scroll')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <>
      <div className="screen-only sticky top-3 z-30 px-3">
        <div className="mx-auto flex w-full max-w-[1400px] justify-center">
          <div className="grid w-full max-w-[1000px] grid-cols-[1fr_auto_1fr] items-center border border-black/15 bg-white/85 px-4 py-1.5 backdrop-blur-xl">
            {/* Left: Index & Label (Stable Column) */}
            <div className="flex min-w-0 items-center gap-3 overflow-hidden pr-4">
              <div className="flex shrink-0 items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-black/50">
                <span className="text-black/25">PG.</span>
                <span className="tabular-nums">
                  {String(activeIndex + 1).padStart(2, '0')}
                  <span className="mx-1 text-black/20">/</span>
                  {String(sections.length).padStart(2, '0')}
                </span>
              </div>
              <span className="h-3 w-px shrink-0 bg-black/10" />
              <span className="truncate text-[9px] font-semibold uppercase tracking-[0.15em] text-black/40">
                {getSectionLabel(activeSection)}
              </span>
            </div>

            {/* Center: Mode Switch & Navigation (Grouped & Centered) */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-black/10 p-0.5">
                <button
                  type="button"
                  onClick={() => handleModeChange('scroll')}
                  className={cn(
                    'flex min-h-[30px] items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-wider transition',
                    mode === 'scroll'
                      ? 'bg-black text-white'
                      : 'text-black/40 hover:bg-black/5 hover:text-black'
                  )}
                >
                  <List size={12} strokeWidth={1.5} />
                  <span>Scroll</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('slide')}
                  className={cn(
                    'flex min-h-[30px] items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-wider transition',
                    mode === 'slide'
                      ? 'bg-black text-white'
                      : 'text-black/40 hover:bg-black/5 hover:text-black'
                  )}
                >
                  <Layout size={12} strokeWidth={1.5} />
                  <span>Slide</span>
                </button>
              </div>

              <div className="flex items-center gap-0.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-xs"
                  onClick={() => moveSection(-1)}
                  disabled={activeIndex === 0}
                  className="size-8 rounded-none border-black/10 bg-white hover:bg-black hover:text-white"
                >
                  <ArrowLeft size={14} strokeWidth={1.5} />
                  <span className="sr-only">Prev</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-xs"
                  onClick={() => moveSection(1)}
                  disabled={activeIndex === sections.length - 1}
                  className="size-8 rounded-none border-black/10 bg-white hover:bg-black hover:text-white"
                >
                  <ArrowRight size={14} strokeWidth={1.5} />
                  <span className="sr-only">Next</span>
                </Button>
              </div>
            </div>

            {/* Right: Download (Stable Column) */}
            <div className="flex justify-end pl-4">
              <Button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="h-8 min-w-[120px] rounded-none bg-[#274133] px-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white hover:bg-[#1e3227]"
              >
                {downloading ? (
                  <Loader2 className="animate-spin" size={12} strokeWidth={1.5} />
                ) : (
                  <Download size={12} strokeWidth={1.5} />
                )}
                <span>{downloading ? 'WAIT...' : 'Download'}</span>
              </Button>
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
