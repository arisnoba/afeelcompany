import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import { EventEmitter } from 'node:events'

const source = readFileSync(new URL('../src/app/pdf-export/_components/wait-for-pdf-render.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
})

function renderReady({ fonts = [], images = [] } = {}) {
  const context = vm.createContext({
    exports: {},
    document: {
      fonts: Object.assign(fonts, { ready: Promise.resolve() }),
      querySelectorAll: () => images,
    },
    window: { requestAnimationFrame: callback => queueMicrotask(callback) },
    setTimeout,
    clearTimeout,
  })
  vm.runInContext(outputText, context)
  return context.exports.waitForPdfRenderReady()
}

test('missing next/font local fallbacks do not block loaded webfonts', async () => {
  await renderReady({ fonts: [
    { family: 'Newsreader', status: 'loaded' },
    { family: 'Noto Sans KR', status: 'loaded' },
    { family: 'Manrope Fallback', status: 'error' },
    { family: '"Newsreader Fallback"', status: 'error' },
  ] })
})

test('failed webfonts still block PDF generation and identify the font', async () => {
  await assert.rejects(renderReady({ fonts: [
    { family: 'Noto Sans KR', status: 'error' },
    { family: 'Newsreader Fallback', status: 'error' },
  ] }), /PDF font loading failed: Noto Sans KR/)
})

test('PDF generation waits for lazy images to finish loading', async () => {
  let ready = false
  const image = Object.assign(new EventTarget(), {
    loading: 'lazy',
    complete: false,
    naturalWidth: 0,
  })
  const pending = renderReady({ images: [image] }).then(() => { ready = true })
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(image.loading, 'eager')
  assert.equal(ready, false)
  image.complete = true
  image.naturalWidth = 100
  image.dispatchEvent(new Event('load'))
  await pending
  assert.equal(ready, true)
})

test('broken images block PDF generation, except the existing map fallback', async () => {
  const brokenImage = {
    src: '/broken.jpg',
    complete: true,
    naturalWidth: 0,
    decode: async () => { throw new Error('Image unavailable') },
    closest: () => null,
  }
  await assert.rejects(renderReady({ images: [brokenImage] }), /PDF image loading failed/)
  await renderReady({ images: [{ ...brokenImage, closest: () => ({}) }] })
})

test('loaded images remain printable when headless Chromium rejects decode', async () => {
  const loadedImage = {
    src: '/loaded.jpg',
    loading: 'auto',
    complete: true,
    naturalWidth: 2000,
    decode: async () => { throw new Error('The source image cannot be decoded.') },
    closest: () => null,
  }
  await renderReady({ images: [loadedImage] })
  assert.equal(loadedImage.loading, 'auto')
  await assert.rejects(renderReady({ images: [{ ...loadedImage, naturalWidth: 0 }] }), /PDF image loading failed/)
})

test('image request errors still prevent PDF generation', async () => {
  const image = Object.assign(new EventTarget(), {
    src: '/failed.jpg',
    complete: false,
    naturalWidth: 0,
    closest: () => null,
  })
  const pending = renderReady({ images: [image] })
  const rejected = assert.rejects(pending, /PDF image loading failed/)
  await new Promise(resolve => setImmediate(resolve))
  image.complete = true
  image.dispatchEvent(new Event('error'))
  await rejected
})

test('server PDF images are bounded while font preloads continue without blocking', async () => {
  const source = readFileSync(new URL('../src/app/api/pdf/limit-asset-requests.ts', import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2017 },
  })
  const context = vm.createContext({ exports: {} })
  vm.runInContext(outputText, context)
  const page = Object.assign(new EventEmitter(), { setRequestInterception: async () => {} })
  await context.exports.limitPdfAssetRequests(page, 2)
  const started = []
  const requests = ['image', 'image', 'image', 'image', 'font', 'script'].map((type, index) => ({
    resourceType: () => type,
    continue: async () => { started.push(index) },
  }))
  requests.forEach(request => page.emit('request', request))
  assert.deepEqual(started, [0, 1, 4, 5])
  page.emit('requestfinished', requests[0])
  assert.deepEqual(started, [0, 1, 4, 5, 2])
  page.emit('requestfailed', requests[1])
  assert.deepEqual(started, [0, 1, 4, 5, 2, 3])
})
