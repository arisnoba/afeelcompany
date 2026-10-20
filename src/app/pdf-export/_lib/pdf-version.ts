import { createHash } from 'node:crypto'

import type { Locale } from '@/i18n/config'
import type { PdfDocument } from '@/types/pdf'

export function getPdfCacheKey(locale: Locale, brochure: PdfDocument, renderVersion = process.env.PDF_RENDER_VERSION ?? '1'): string {
  // The issue date belongs to the saved file, not to its content revision.
  const content = { ...brochure, issueDate: undefined }
  const version = createHash('sha256').update(JSON.stringify({ locale, renderVersion, content })).digest('hex')
  return `${locale}/${version}`
}

export function formatPdfIssueDate(savedAt: string | Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(new Date(savedAt))
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)!.value).join('.')
}

export function parsePdfSavedAt(value?: string | string[]): string | undefined {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return undefined
  const date = new Date(value)
  return Number.isFinite(date.getTime()) && date.toISOString() === value ? value : undefined
}
