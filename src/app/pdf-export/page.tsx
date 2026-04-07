/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react'

import { formatPortfolioCategories } from '@/types/portfolio'
import type { PdfClientBrand, PdfPortfolioItem } from '@/types/pdf'

import { BrochureSheet } from './_components/BrochureSheet'
import { PdfPreviewWorkspace } from './_components/PdfPreviewWorkspace'
import { getPdfDocument } from './_lib/get-pdf-document'

export const dynamic = 'force-dynamic'

// ── Items per page ──────────────────────────
const WORK_PER_PAGE = 4    // 2×2 grid
const CLIENT_PER_PAGE = 12 // 4×3 grid

// ── Utilities ───────────────────────────────

function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

interface PdfImageProps {
  src: string | null | undefined
  alt: string
  className: string
}

function PdfImage({ src, alt, className }: PdfImageProps) {
  if (!src) {
    return (
      <div className={`${className} flex items-center justify-center border border-dashed border-stone-200 bg-stone-50 text-[10px] font-medium uppercase tracking-[0.24em] text-stone-300`}>
        NO IMAGE
      </div>
    )
  }
  return <img src={src} alt={alt} data-pdf-image className={className} />
}

// ── Section renderers ───────────────────────

interface WorkSheetProps {
  items: PdfPortfolioItem[]
  pageNum: number
  totalPages: number
}

function WorkSheet({ items, pageNum, totalPages }: WorkSheetProps) {
  return (
    <div className="flex h-full flex-col px-8 py-7">
      <div className="mb-5 flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-[#715a3e]" />
          <p className="text-[9px] font-medium uppercase tracking-[0.36em] text-stone-400">Work</p>
        </div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-stone-300">
          {totalPages > 1 ? `${pageNum} / ${totalPages}` : 'Selected Portfolio'}
        </p>
      </div>

      <div
        className="grid flex-1 gap-4"
        style={{
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: items.length > 2 ? '1fr 1fr' : '1fr',
        }}
      >
        {items.map((item) => (
          <article
            key={item.id}
            className="avoid-break flex overflow-hidden rounded-[14px] border border-stone-100 bg-stone-50"
          >
            <div className="relative w-[38%] shrink-0 overflow-hidden">
              <PdfImage src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between px-5 py-4">
              <div className="grid gap-2">
                {item.brandLogoUrl ? (
                  <img
                    src={item.brandLogoUrl}
                    alt={`${item.brandName} logo`}
                    className="h-6 max-w-[110px] object-contain object-left"
                  />
                ) : (
                  <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-stone-500">
                    {item.brandName}
                  </p>
                )}
                <h2 className="text-[15px] font-medium leading-snug text-stone-950">{item.title}</h2>
                {item.celebrityName ? (
                  <p className="text-[10px] text-stone-500">{item.celebrityName}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <span className="h-px w-4 bg-[#715a3e]" />
                <p className="text-[9px] uppercase tracking-[0.24em] text-stone-400">
                  {formatPortfolioCategories(item.category)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

interface ClientSheetProps {
  brands: PdfClientBrand[]
  pageNum: number
  totalPages: number
  totalBrands: number
}

function ClientSheet({ brands, pageNum, totalPages, totalBrands }: ClientSheetProps) {
  return (
    <div className="flex h-full flex-col px-8 py-7">
      <div className="mb-5 flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-[#715a3e]" />
          <p className="text-[9px] font-medium uppercase tracking-[0.36em] text-stone-400">Client</p>
        </div>
        <p className="text-[9px] uppercase tracking-[0.2em] text-stone-300">
          {totalPages > 1 ? `${pageNum} / ${totalPages}  ·  ${totalBrands} Brands` : `${totalBrands} Brands`}
        </p>
      </div>

      <div
        className="grid flex-1 gap-3"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: '1fr',
        }}
      >
        {brands.map((brand) => (
          <article
            key={brand.id}
            className="avoid-break flex flex-col items-center justify-center gap-3 overflow-hidden rounded-[12px] border border-stone-100 bg-stone-50 px-4 py-4"
          >
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name} className="h-10 w-full object-contain" />
            ) : (
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">
                {brand.name}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

// ── Page ────────────────────────────────────

export default async function PdfExportPage() {
  const brochure = await getPdfDocument()

  const workChunks = chunk(brochure.workItems, WORK_PER_PAGE)
  const clientChunks = chunk(brochure.clientBrands, CLIENT_PER_PAGE)

  const sections: { id: string; node: ReactNode }[] = []

  // Cover
  sections.push({
    id: 'cover',
    node: (
      <BrochureSheet sectionId="cover">
        <div className="grid h-full" style={{ gridTemplateColumns: '38% 62%' }}>
          <div className="relative overflow-hidden">
            <PdfImage
              src={brochure.heroImageUrl}
              alt={`${brochure.title} cover`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex h-full flex-col justify-between px-12 py-10">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-[#715a3e]" />
              <span className="text-[9px] font-semibold uppercase tracking-[0.44em] text-[#715a3e]">
                Fashion PR Agency
              </span>
            </div>
            <div className="grid gap-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-stone-400">
                Company Brochure
              </p>
              <h1
                className="text-[4.2rem] leading-[0.92] tracking-[-0.04em] text-stone-950"
                style={{ fontFamily: 'var(--font-brochure-serif)' }}
              >
                AFEEL<br />
                <span className="italic">Company.</span>
              </h1>
              <p className="mt-2 max-w-[34ch] text-[13px] leading-7 text-stone-500">
                브랜드와 셀럽의 접점을 설계하고,<br />
                한 번 정리한 포트폴리오를 웹·소개서·소셜까지 이어 붙이는 패션 PR 스튜디오.
              </p>
            </div>
            <div className="flex items-end justify-between border-t border-stone-100 pt-6">
              <div>
                <p className="text-[9px] uppercase tracking-[0.28em] text-stone-400">Issue Date</p>
                <p className="mt-1 text-[15px] font-medium text-stone-950">{brochure.issueDate}</p>
              </div>
              <p className="text-[9px] uppercase tracking-[0.24em] text-stone-300">afeelcompany.com</p>
            </div>
          </div>
        </div>
      </BrochureSheet>
    ),
  })

  // About
  sections.push({
    id: 'about',
    node: (
      <BrochureSheet sectionId="about">
        <div className="grid h-full" style={{ gridTemplateColumns: '40% 60%' }}>
          <div className="flex flex-col justify-between bg-stone-950 px-10 py-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[#715a3e]" />
              <p className="text-[9px] font-medium uppercase tracking-[0.36em] text-stone-500">About</p>
            </div>
            <div className="grid gap-5">
              <h2
                className="text-[2.6rem] leading-[1.05] tracking-[-0.03em] text-white"
                style={{ fontFamily: 'var(--font-brochure-serif)' }}
              >
                브랜드와 셀럽을<br />
                <span className="italic text-stone-400">연결하는</span><br />
                패션 PR.
              </h2>
              <p className="text-[11px] leading-6 text-stone-500">
                원소스 멀티유즈 전략으로 포트폴리오 한 번으로<br />
                웹·소개서·소셜까지 모두 커버합니다.
              </p>
            </div>
            <p className="text-[9px] uppercase tracking-[0.24em] text-stone-700">AFEEL Company</p>
          </div>
          <div className="flex flex-col justify-center px-12 py-10">
            <div className="grid gap-8">
              <p className="text-[15px] leading-9 text-stone-600">{brochure.aboutText}</p>
              <div className="grid gap-3">
                <div className="h-px bg-stone-100" />
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.28em] text-stone-400">Services</p>
                    <p className="mt-1 text-[11px] font-medium text-stone-800">PR 기획 · 스타일링 · 소개서 제작</p>
                  </div>
                  <div className="h-8 w-px bg-stone-100" />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.28em] text-stone-400">Focus</p>
                    <p className="mt-1 text-[11px] font-medium text-stone-800">패션 브랜드 × 셀럽 연결</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BrochureSheet>
    ),
  })

  // Work — one page per chunk of 4
  workChunks.forEach((items, i) => {
    const pageNum = i + 1
    const totalPages = workChunks.length
    sections.push({
      id: `work-${pageNum}-${totalPages}`,
      node: (
        <BrochureSheet sectionId={`work-${pageNum}-${totalPages}`}>
          <WorkSheet items={items} pageNum={pageNum} totalPages={totalPages} />
        </BrochureSheet>
      ),
    })
  })

  // Client — one page per chunk of 12
  clientChunks.forEach((brands, i) => {
    const pageNum = i + 1
    const totalPages = clientChunks.length
    sections.push({
      id: `client-${pageNum}-${totalPages}`,
      node: (
        <BrochureSheet sectionId={`client-${pageNum}-${totalPages}`}>
          <ClientSheet
            brands={brands}
            pageNum={pageNum}
            totalPages={totalPages}
            totalBrands={brochure.clientBrands.length}
          />
        </BrochureSheet>
      ),
    })
  })

  // Contact
  sections.push({
    id: 'contact',
    node: (
      <BrochureSheet sectionId="contact">
        <div className="grid h-full" style={{ gridTemplateColumns: '52% 48%' }}>
          <div className="flex flex-col justify-between bg-stone-950 px-12 py-10">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-[#715a3e]" />
              <p className="text-[9px] font-medium uppercase tracking-[0.36em] text-stone-500">Contact</p>
            </div>
            <div className="grid gap-5">
              <h2
                className="text-[2.8rem] leading-[1.04] tracking-[-0.03em] text-white"
                style={{ fontFamily: 'var(--font-brochure-serif)' }}
              >
                브랜드의 이야기를<br />
                <span className="italic text-stone-400">함께</span> 써드립니다.
              </h2>
              <p className="text-[11px] leading-7 text-stone-500">
                어필컴퍼니는 패션 브랜드와 셀럽 사이의 접점을 설계합니다.<br />
                새로운 협업이나 PR 문의는 아래 연락처로 보내주세요.
              </p>
            </div>
            <p className="text-[9px] uppercase tracking-[0.24em] text-stone-700">
              AFEEL Company · Seoul, Korea
            </p>
          </div>
          <div className="flex flex-col justify-center px-12 py-10">
            <dl className="grid gap-7">
              <div className="grid gap-1.5">
                <dt className="text-[9px] uppercase tracking-[0.32em] text-stone-400">이메일</dt>
                <dd className="text-[18px] font-medium text-stone-950">{brochure.contact.email}</dd>
              </div>
              <div className="h-px bg-stone-100" />
              <div className="grid gap-1.5">
                <dt className="text-[9px] uppercase tracking-[0.32em] text-stone-400">전화</dt>
                <dd className="text-[18px] font-medium text-stone-950">{brochure.contact.phone}</dd>
              </div>
              <div className="h-px bg-stone-100" />
              <div className="grid gap-1.5">
                <dt className="text-[9px] uppercase tracking-[0.32em] text-stone-400">주소</dt>
                <dd className="text-[18px] font-medium text-stone-950">{brochure.contact.address}</dd>
              </div>
            </dl>
            <div className="mt-8 flex items-center gap-3 border-t border-stone-100 pt-6">
              <span className="h-px w-6 bg-[#715a3e]" />
              <p className="text-[9px] uppercase tracking-[0.24em] text-stone-400">afeelcompany.com</p>
            </div>
          </div>
        </div>
      </BrochureSheet>
    ),
  })

  return <PdfPreviewWorkspace sections={sections} />
}
