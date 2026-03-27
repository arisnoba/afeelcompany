/* eslint-disable @next/next/no-img-element */
import { AutoPrintOnLoad } from './_components/AutoPrintOnLoad'
import { BrochureSheet } from './_components/BrochureSheet'
import { PrintToolbar } from './_components/PrintToolbar'
import { getPdfDocument } from './_lib/get-pdf-document'

export const dynamic = 'force-dynamic'

interface PdfImageProps {
  src: string | null | undefined
  alt: string
  className: string
}

function PdfImage({ src, alt, className }: PdfImageProps) {
  if (!src) {
    return (
      <div className={`${className} flex items-center justify-center rounded-[20px] border border-dashed border-black/20 bg-black/[0.03] text-xs font-medium tracking-[0.24em] text-black/40`}>
        IMAGE MISSING
      </div>
    )
  }

  return <img src={src} alt={alt} data-pdf-image className={className} />
}

export default async function PdfExportPage() {
  const brochure = await getPdfDocument()

  return (
    <>
      <AutoPrintOnLoad />
      <PrintToolbar />
      <main className="pdf-document">
        <BrochureSheet sectionId="cover">
          <div className="grid min-h-full gap-8 md:grid-cols-[1.15fr_0.85fr]">
            <div className="flex flex-col justify-between rounded-[24px] bg-[#f0ece3] p-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.32em] text-black/40">Company Brochure</p>
                <h1 className="mt-4 max-w-[12ch] text-5xl font-semibold leading-[1.02] text-black">
                  {brochure.title}
                </h1>
              </div>
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.24em] text-black/45">Issue Date</p>
                <p className="text-xl font-medium text-black">{brochure.issueDate}</p>
              </div>
            </div>
            <PdfImage
              src={brochure.heroImageUrl}
              alt={`${brochure.title} cover hero`}
              className="h-full min-h-[420px] w-full rounded-[24px] object-cover"
            />
          </div>
        </BrochureSheet>

        <BrochureSheet sectionId="about" title="ABOUT">
          <div className="grid min-h-full gap-8 md:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[24px] bg-black p-8 text-white">
              <p className="text-sm uppercase tracking-[0.32em] text-white/55">ABOUT</p>
              <p className="mt-6 text-3xl font-semibold leading-tight">
                원소스 멀티유즈를 위한 패션 PR 브로셔 스파이크
              </p>
            </div>
            <div className="flex items-center rounded-[24px] border border-black/10 bg-[#faf7f2] p-8">
              <p className="text-lg leading-9 text-black/72">{brochure.aboutText}</p>
            </div>
          </div>
        </BrochureSheet>

        <BrochureSheet sectionId="work" title="WORK">
          <div className="grid gap-5 md:grid-cols-2">
            {brochure.workItems.slice(0, 4).map((item) => (
              <article
                key={item.id}
                className="avoid-break overflow-hidden rounded-[22px] border border-black/10 bg-[#fbf8f3]"
              >
                <PdfImage
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-[280px] w-full object-cover"
                />
                <div className="space-y-2 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-black/45">{item.brandName}</p>
                  <h2 className="text-xl font-semibold text-black">{item.title}</h2>
                  <p className="text-sm text-black/55">{item.category}</p>
                </div>
              </article>
            ))}
          </div>
        </BrochureSheet>

        <BrochureSheet sectionId="client" title="CLIENT">
          <div className="grid min-h-full gap-5 md:grid-cols-2 xl:grid-cols-3">
            {brochure.clientBrands.map((brand) => (
              <article
                key={brand.id}
                className="avoid-break flex min-h-[180px] flex-col justify-between rounded-[22px] border border-black/10 bg-[#f8f4ed] p-6"
              >
                <PdfImage
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="h-[96px] w-full rounded-[18px] object-cover"
                />
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-black/55">
                  {brand.name}
                </p>
              </article>
            ))}
          </div>
        </BrochureSheet>

        <BrochureSheet sectionId="contact" title="CONTACT">
          <div className="grid min-h-full gap-8 md:grid-cols-[1fr_0.9fr]">
            <div className="flex flex-col justify-between rounded-[24px] bg-[#f0ece3] p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-black/45">CONTACT</p>
                <p className="mt-6 text-4xl font-semibold leading-tight text-black">
                  브랜드와 셀럽을 연결하는 소개 흐름을 하나의 브로셔로 정리합니다.
                </p>
              </div>
              <p className="text-sm leading-7 text-black/60">
                PDF 출력 전용 라우트에서 한글 폰트, 이미지, 페이지 브레이크를 함께 검증합니다.
              </p>
            </div>
            <div className="rounded-[24px] border border-black/10 bg-white p-8">
              <dl className="space-y-6">
                <div>
                  <dt className="text-xs uppercase tracking-[0.28em] text-black/40">이메일</dt>
                  <dd className="mt-2 text-2xl font-medium text-black">{brochure.contact.email}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.28em] text-black/40">전화</dt>
                  <dd className="mt-2 text-2xl font-medium text-black">{brochure.contact.phone}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.28em] text-black/40">주소</dt>
                  <dd className="mt-2 text-2xl font-medium text-black">{brochure.contact.address}</dd>
                </div>
              </dl>
            </div>
          </div>
        </BrochureSheet>
      </main>
    </>
  )
}
