import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

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

test('PDF generation waits for images to decode', async () => {
  let finishDecode
  let ready = false
  const image = {
    loading: 'lazy',
    naturalWidth: 100,
    decode: () => new Promise(resolve => { finishDecode = resolve }),
  }
  const pending = renderReady({ images: [image] }).then(() => { ready = true })
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(image.loading, 'eager')
  assert.equal(ready, false)
  finishDecode()
  await pending
  assert.equal(ready, true)
})

test('broken images block PDF generation, except the existing map fallback', async () => {
  const brokenImage = {
    naturalWidth: 0,
    decode: async () => { throw new Error('Image unavailable') },
    closest: () => null,
  }
  await assert.rejects(renderReady({ images: [brokenImage] }), /PDF image loading failed/)
  await renderReady({ images: [{ ...brokenImage, closest: () => ({}) }] })
})

test('loaded images remain printable when headless Chromium rejects decode', async () => {
  const loadedImage = {
    loading: 'auto',
    complete: true,
    naturalWidth: 2000,
    decode: async () => { throw new Error('The source image cannot be decoded.') },
    closest: () => null,
  }
  await renderReady({ images: [loadedImage] })
  assert.equal(loadedImage.loading, 'auto')
  await assert.rejects(renderReady({ images: [{ ...loadedImage, complete: false }] }), /PDF image loading failed/)
})
