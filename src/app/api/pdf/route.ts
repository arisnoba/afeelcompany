import type { NextRequest } from 'next/server'

import { DEFAULT_LOCALE, isLocale } from '@/i18n/config'
import { getPdfDocument } from '@/app/pdf-export/_lib/get-pdf-document'
import { getPdfCacheKey } from '@/app/pdf-export/_lib/pdf-version'
import { getOrCreatePdf, getPdfCacheStore, PdfCacheBusyError } from '@/lib/pdf-cache'
import { generatePdf } from './generate-pdf'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 120

export async function GET(request: NextRequest): Promise<Response> {
  const requestUrl = new URL(request.url)
  const localeParam = requestUrl.searchParams.get('locale')
  const locale = localeParam && isLocale(localeParam) ? localeParam : DEFAULT_LOCALE
  const localRequest = ['localhost', '127.0.0.1', '[::1]'].includes(requestUrl.hostname)
  const store = getPdfCacheStore(localRequest)

  try {
    const brochure = await getPdfDocument(locale)
    const key = getPdfCacheKey(locale, brochure)
    const { file, hit } = await getOrCreatePdf(store, key, async savedAt => {
      const target = new URL('/pdf-export', requestUrl.origin)
      target.searchParams.set('locale', locale)
      target.searchParams.set('savedAt', savedAt)
      return generatePdf(target.toString(), key, savedAt)
    })

    return new Response(await store.read(file), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="afeel-company-brochure-${locale}.pdf"`,
        'Cache-Control': 'no-store',
        'X-PDF-Cache': hit ? 'HIT' : 'MISS',
        'X-PDF-Saved-At': file.savedAt,
      },
    })
  } catch (error) {
    console.error('[pdf] download failed', error)
    const busy = error instanceof PdfCacheBusyError
    return Response.json(
      { error: busy ? 'PDF 생성이 진행 중입니다. 잠시 후 다시 다운로드해 주세요.' : 'PDF 파일을 준비하지 못했습니다. 잠시 후 다시 다운로드해 주세요.' },
      { status: busy ? 503 : 500, headers: { 'Cache-Control': 'no-store', ...(busy ? { 'Retry-After': '3' } : {}) } },
    )
  }
}
