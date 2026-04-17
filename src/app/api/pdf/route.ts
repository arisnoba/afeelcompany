import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
// Vercel Pro: 300s / Hobby: 60s
export const maxDuration = 60

/**
 * GET /api/pdf
 * Generates a PDF of the /pdf-export page using headless Chromium.
 * On Vercel: uses @sparticuz/chromium-min (downloaded at runtime).
 * Locally: uses the system Chrome/Chromium binary.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const origin = new URL(request.url).origin
  const targetUrl = `${origin}/pdf-export`

  let browser: import('puppeteer-core').Browser | null = null

  try {
    let executablePath: string
    let launchArgs: string[]

    if (process.env.VERCEL) {
      const Chromium = (await import('@sparticuz/chromium-min')).default
      const chromiumUrl =
        process.env.CHROMIUM_REMOTE_URL ??
        'https://github.com/Sparticuz/chromium/releases/download/v147.0.0/chromium-v147.0.0-pack.tar'

      executablePath = await Chromium.executablePath(chromiumUrl)
      launchArgs = Chromium.args
    } else {
      // Local dev — detect system Chrome
      executablePath =
        process.env.PUPPETEER_EXECUTABLE_PATH ??
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
      launchArgs = ['--no-sandbox', '--disable-setuid-sandbox']
    }

    const { default: puppeteer } = await import('puppeteer-core')

    browser = await puppeteer.launch({
      args: launchArgs,
      executablePath,
      headless: true,
      defaultViewport: { width: 1440, height: 900 },
    })

    const page = await browser.newPage()

    // Wait for fonts, images, and dynamic content to finish loading
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 45_000 })

    await page.waitForFunction(
      () => {
        const mapElement = document.querySelector<HTMLElement>('[data-pdf-contact-map]')

        if (!mapElement) {
          return true
        }

        const status = mapElement.dataset.pdfMapStatus
        return status === 'ready' || status === 'disabled' || status === 'error'
      },
      { timeout: 10_000 }
    ).catch(() => null)

    // Allow the final paint after map/image readiness settles.
    await new Promise<void>((resolve) => setTimeout(resolve, 500))

    const pdf = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })

    return new Response(Buffer.from(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="afeel-company-brochure.pdf"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[pdf] generation failed', error)
    return Response.json({ error: 'PDF 생성에 실패했습니다.' }, { status: 500 })
  } finally {
    await browser?.close()
  }
}
