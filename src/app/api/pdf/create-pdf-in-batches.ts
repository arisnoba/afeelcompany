import { PDFDocument } from 'pdf-lib'
import type { Page } from 'puppeteer-core'

export async function createPdfInBatches(page: Page, sheetCount: number): Promise<Uint8Array> {
  if (!Number.isInteger(sheetCount) || sheetCount < 1) throw new Error('No PDF sheets to print')

  const mergedDocument = await PDFDocument.create()
  mergedDocument.setTitle(await page.title())

  // Keep each Chromium print job small, then preserve page order in one file.
  for (let first = 1; first <= sheetCount; first += 4) {
    const last = Math.min(first + 3, sheetCount)
    await page.evaluate(({ first, last }) => {
      document.querySelectorAll<HTMLElement>('.pdf-sheet').forEach((sheet, index) => {
        sheet.style.display = index >= first - 1 && index < last ? '' : 'none'
      })
    }, { first, last })
    const bytes = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      tagged: false,
      timeout: 60_000,
      pageRanges: `1-${last - first + 1}`,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })
    const batch = await PDFDocument.load(bytes)
    if (batch.getPageCount() !== last - first + 1) throw new Error('Incomplete PDF print batch')
    const pages = await mergedDocument.copyPages(batch, batch.getPageIndices())
    pages.forEach(printedPage => mergedDocument.addPage(printedPage))
  }

  return mergedDocument.save()
}
