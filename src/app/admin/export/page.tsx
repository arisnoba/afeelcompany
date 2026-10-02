'use client'

import Link from 'next/link'

import { AdminPageIntro } from '@/components/admin/AdminPageIntro'
import { buttonVariants } from '@/components/ui/button'
import { DEFAULT_LOCALE, LOCALES, LOCALE_LABELS, type Locale } from '@/i18n/config'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

function getPdfExportHref(locale: Locale) {
  const params = new URLSearchParams()

  if (locale !== DEFAULT_LOCALE) {
    params.set('locale', locale)
  }

  const query = params.toString()
  return query ? `/pdf-export?${query}` : '/pdf-export'
}

export default function AdminExportPage() {
  return (
    <div className="grid gap-6">
      <AdminPageIntro
        eyebrow="익스포트"
        title="포트폴리오 PDF 익스포트"
        description="브로셔 미리보기에서 현재 포트폴리오와 회사 정보를 확인하고 PDF를 다운로드합니다."
        aside={
          <div>
            PDF 페이지는 별도 레이아웃으로 열리며, 최종 출력 전 이미지 누락과 페이지 구성을 함께 확인하는 용도입니다.
          </div>
        }
      />

      <Card className="border-black/6 bg-white py-0 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <CardHeader className="gap-2 border-b border-black/6 px-6 py-6">
          <CardTitle className="text-xl font-semibold tracking-[-0.03em]">
            출력 실행
          </CardTitle>
          <CardDescription className="text-sm leading-6">
            PDF 출력 버튼으로 미리보기를 연 뒤, Download 버튼을 눌러 PDF 파일을 저장합니다. 이미지와 서체가 준비되면 다운로드가 시작됩니다.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 px-6 py-6 lg:grid-cols-3">
          {LOCALES.map((locale) => (
            <div key={locale} className="rounded-[24px] border border-black/6 bg-[#fbfdfb] p-5">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-foreground">
                  {LOCALE_LABELS[locale]} PDF
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {locale === DEFAULT_LOCALE
                    ? '기본 한국어 브로셔를 확인하거나 저장합니다.'
                    : `${LOCALE_LABELS[locale]} 언어 브로셔를 확인하거나 저장합니다.`}
                </p>
              </div>
              <div className="mt-5">
                <Link
                  href={getPdfExportHref(locale)}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ size: 'lg' }), 'w-full sm:w-auto')}
                >
                  PDF 출력
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
