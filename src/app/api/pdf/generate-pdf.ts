import { readdir, statfs } from 'node:fs/promises'
import { tmpdir } from 'node:os'

import { waitForPdfRenderReady } from '@/app/pdf-export/_components/wait-for-pdf-render'
import { createPdfInBatches } from './create-pdf-in-batches'
import { limitPdfAssetRequests } from './limit-asset-requests'

function getDefaultChromiumUrl(): string {
  const architecture = process.arch === 'arm64' ? 'arm64' : 'x64'

  return `https://github.com/Sparticuz/chromium/releases/download/v147.0.0/chromium-v147.0.0-pack.${architecture}.tar`
}

export async function generatePdf(targetUrl: string, expectedKey: string, savedAt: string): Promise<Uint8Array> {
  let browser: import('puppeteer-core').Browser | null = null

  try {
    let executablePath: string
    let launchArgs: string[]
    let headless: true | 'shell' = true

    const { default: puppeteer } = await import('puppeteer-core')

    if (process.env.VERCEL) {
      const Chromium = (await import('@sparticuz/chromium-min')).default
      const chromiumUrl = process.env.CHROMIUM_REMOTE_URL ?? getDefaultChromiumUrl()

      executablePath = await Chromium.executablePath(chromiumUrl)
      launchArgs = puppeteer.defaultArgs({ args: Chromium.args, headless: 'shell' })
      headless = 'shell'
    } else {
      // Local dev — detect system Chrome
      executablePath =
        process.env.PUPPETEER_EXECUTABLE_PATH ??
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      launchArgs = puppeteer.defaultArgs({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless,
      })
    }

    browser = await puppeteer.launch({
      dumpio: Boolean(process.env.VERCEL),
      args: launchArgs,
      executablePath,
      headless,
      defaultViewport: { width: 1440, height: 900 },
    })

    const page = await browser.newPage()
    await limitPdfAssetRequests(page)

    page.on('requestfailed', (assetRequest) => {
      if (['image', 'font'].includes(assetRequest.resourceType())) {
        console.error('[pdf] asset request failed', assetRequest.url().split('?')[0], assetRequest.failure()?.errorText)
      }
    })

    await page.emulateMediaType('print')
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 45_000 })
    await page.waitForSelector('.pdf-document .pdf-sheet', { timeout: 10_000 })

    const rendered = await page.$eval('[data-pdf-cache-key]', element => ({
      key: element.getAttribute('data-pdf-cache-key'),
      savedAt: element.getAttribute('data-pdf-saved-at'),
    }))
    if (rendered.key !== expectedKey || rendered.savedAt !== savedAt) {
      throw new Error('PDF source changed during generation; retry with the current revision')
    }
    await page.evaluate(waitForPdfRenderReady)

    const temporaryStorage = await statfs(tmpdir())
    const chromiumPid = browser.process()?.pid
    const openFiles = chromiumPid ? await readdir(`/proc/${chromiumPid}/fd`).then(files => files.length).catch(() => null) : null
    const renderState = await page.evaluate(() => ({
      sheets: document.querySelectorAll('.pdf-sheet').length,
      images: document.querySelectorAll('.pdf-document img').length,
      decodedImageMiB: Math.round(Array.from(document.querySelectorAll<HTMLImageElement>('.pdf-document img')).reduce((sum, image) => sum + image.naturalWidth * image.naturalHeight * 4, 0) / 1024 / 1024),
    }))
    console.info('[pdf] render ready', renderState, { temporaryFreeMiB: Math.round(temporaryStorage.bavail * temporaryStorage.bsize / 1024 / 1024), openFiles })

    const pdf = await createPdfInBatches(page, renderState.sheets)

    return pdf
  } finally {
    await browser?.close()
  }
}
