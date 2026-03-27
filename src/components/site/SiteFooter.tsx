import Link from 'next/link'

import type { SiteCompanyProfile } from '@/types/site'

interface SiteFooterProps {
  profile: SiteCompanyProfile
}

function renderValue(value: string) {
  return value || '정보를 준비 중입니다.'
}

export function SiteFooter({ profile }: SiteFooterProps) {
  return (
    <footer className="mt-8 rounded-[2rem] border border-stone-900/10 bg-stone-950 px-6 py-8 text-stone-50 shadow-[0_30px_90px_rgba(26,18,10,0.18)] sm:px-8 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="grid gap-4">
          <p className="text-xs uppercase tracking-[0.36em] text-stone-400">
            AFEEL Company
          </p>
          <h2 className="max-w-2xl text-3xl tracking-[-0.05em] text-white sm:text-4xl">
            브랜드의 인상을 남기는 스타일링 결과를 더 명확한 공개 아카이브로 정리합니다.
          </h2>
          <p className="max-w-xl text-sm leading-7 text-stone-300">
            공개 사이트, PDF 소개서, 인스타그램 캐시를 같은 운영 데이터에서 이어 읽어
            한 번의 업데이트가 여러 접점에 반영되도록 구성했습니다.
          </p>
        </div>

        <div className="grid gap-6 rounded-[1.75rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm">
          <div className="grid gap-3 text-sm leading-6 text-stone-200">
            <p>{renderValue(profile.contactEmail)}</p>
            <p>{renderValue(profile.contactPhone)}</p>
            <p>{renderValue(profile.address)}</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/feed"
              className="inline-flex h-11 items-center rounded-full border border-white/14 px-4 transition hover:bg-white/10"
            >
              INSTAGRAM FEED
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center rounded-full bg-white px-4 font-medium text-stone-950 transition hover:bg-stone-200"
            >
              CONTACT
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
