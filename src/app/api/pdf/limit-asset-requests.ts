import type { HTTPRequest, Page } from 'puppeteer-core'

// Serverless Chromium has fewer resources than a desktop browser. Keep the
// brochure's hundreds of image/font requests from exhausting them at once.
export async function limitPdfAssetRequests(page: Page, concurrency = 6) {
  const queued: HTTPRequest[] = []
  const active = new Set<HTTPRequest>()

  function release(request: HTTPRequest) {
    if (active.delete(request)) drain()
  }

  function drain() {
    while (active.size < concurrency && queued.length > 0) {
      const request = queued.shift()!
      active.add(request)
      void request.continue().catch(() => release(request))
    }
  }

  await page.setRequestInterception(true)
  page.on('requestfinished', release)
  page.on('requestfailed', release)
  page.on('request', (request) => {
    if (['image', 'font'].includes(request.resourceType())) {
      queued.push(request)
      drain()
    } else {
      void request.continue().catch(() => {})
    }
  })
}
