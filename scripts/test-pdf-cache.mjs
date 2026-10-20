import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import { getPdfRenderVersion } from './pdf-render-version.mjs'

const require = createRequire(import.meta.url)
function load(path, blob = {}) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } })
  const context = vm.createContext({ exports: {}, require: name => name === '@vercel/blob' ? blob : require(name), process, Buffer, console, setTimeout })
  vm.runInContext(outputText, context)
  return context.exports
}
const version = load('../src/app/pdf-export/_lib/pdf-version.ts')
const cache = load('../src/lib/pdf-cache.ts')
const key = version.getPdfCacheKey('ko', { title: 'AFEEL', issueDate: '' }, 'test')
const bytes = Buffer.from('%PDF-test document')

function fakeBlob() {
  class BlobNotFoundError extends Error {}
  class BlobPreconditionFailedError extends Error {}
  const files = new Map()
  let serial = 0
  const sdk = {
    BlobNotFoundError, BlobPreconditionFailedError,
    async head(path) { const file = files.get(path); if (!file) throw new BlobNotFoundError(); return file },
    async list({ prefix }) { return { blobs: [...files.values()].filter(file => file.pathname.startsWith(prefix)) } },
    async put(path, body, options) {
      if (files.has(path) && !options.allowOverwrite) throw new Error('Already exists')
      const file = { pathname: path, url: `https://blob.test/${path}`, uploadedAt: new Date(), etag: `etag-${++serial}`, body }
      files.set(path, file)
      return file
    },
    async del(path, options) {
      const file = await sdk.head(path)
      if (file.etag !== options.ifMatch) throw new BlobPreconditionFailedError()
      files.delete(path)
    },
    async get(url) { const file = await sdk.head(url.replace('https://blob.test/', '')); return { statusCode: 200, stream: new Response(file.body).body } },
  }
  return { files, sdk, api: load('../src/lib/pdf-cache.ts', sdk) }
}

test('content, language and rendering changes invalidate files; issue date does not', () => {
  const brochure = { title: 'AFEEL', issueDate: '2026.10.20', portfolioItems: [{ id: 1, image: '/a.jpg' }] }
  const original = version.getPdfCacheKey('ko', brochure, 'v1')
  assert.equal(original, version.getPdfCacheKey('ko', { ...brochure, issueDate: '2026.10.21' }, 'v1'))
  for (const changed of [{ ...brochure, title: 'Updated' }, { ...brochure, portfolioItems: [] }, { ...brochure, portfolioItems: [{ id: 1, image: '/b.jpg' }] }]) {
    assert.notEqual(original, version.getPdfCacheKey('ko', changed, 'v1'))
  }
  assert.notEqual(original, version.getPdfCacheKey('en', brochure, 'v1'))
  assert.notEqual(original, version.getPdfCacheKey('ko', brochure, 'v2'))
  assert.match(getPdfRenderVersion(process.cwd()), /^[a-f0-9]{64}$/)
})

test('issue date follows Seoul time and only accepts canonical saved timestamps', () => {
  assert.equal(version.formatPdfIssueDate('2026-10-20T16:00:00.000Z'), '2026.10.21')
  assert.equal(version.parsePdfSavedAt('2026-10-20T16:00:00.000Z'), '2026-10-20T16:00:00.000Z')
  for (const invalid of [undefined, ['2026-10-20'], '2026-02-30T00:00:00.000Z', '2026-10-20', 'invalid']) assert.equal(version.parsePdfSavedAt(invalid), undefined)
})

test('local files survive a new store and simultaneous downloads generate once', async () => {
  const root = await mkdtemp(join(tmpdir(), 'afeel-pdf-cache-test-'))
  try {
    const store = cache.createLocalPdfCache(root)
    let calls = 0
    const generate = async () => { calls++; await new Promise(resolve => setTimeout(resolve, 10)); return bytes }
    const results = await Promise.all(Array.from({ length: 4 }, () => cache.getOrCreatePdf(store, key, generate, { pollMs: 1, waitMs: 1000 })))
    assert.equal(calls, 1)
    assert.equal(results.filter(result => !result.hit).length, 1)
    const persisted = await cache.getOrCreatePdf(cache.createLocalPdfCache(root), key, () => { throw new Error('Must reuse') })
    assert.equal(persisted.hit, true)
    assert.equal(persisted.file.savedAt, results[0].file.savedAt)
    assert.deepEqual(await store.read(persisted.file), bytes)
  } finally { await rm(root, { recursive: true, force: true }) }
})

test('failed and invalid PDF generations release their lease and never cache output', async () => {
  const root = await mkdtemp(join(tmpdir(), 'afeel-pdf-cache-test-'))
  try {
    const store = cache.createLocalPdfCache(root)
    await assert.rejects(cache.getOrCreatePdf(store, key, async () => { throw new Error('Font failed') }), /Font failed/)
    await assert.rejects(cache.getOrCreatePdf(store, key, async () => Buffer.from('not pdf')), /Invalid generated PDF/)
    assert.equal(await store.find(key), null)
    assert.equal((await cache.getOrCreatePdf(store, key, async () => bytes)).hit, false)
  } finally { await rm(root, { recursive: true, force: true }) }
})

test('separate Blob store instances share generation and stream the saved file', async () => {
  const { api } = fakeBlob()
  let calls = 0
  const generate = async () => { calls++; await new Promise(resolve => setTimeout(resolve, 10)); return bytes }
  const results = await Promise.all(Array.from({ length: 3 }, () => api.getOrCreatePdf(api.createBlobPdfCache(), key, generate, { waitMs: 1000, pollMs: 1 })))
  assert.equal(calls, 1)
  assert.equal(results.filter(result => !result.hit).length, 1)
  assert.equal(new Set(results.map(result => result.file.savedAt)).size, 1)
  assert.deepEqual(Buffer.from(await new Response(await api.createBlobPdfCache().read(results[0].file)).arrayBuffer()), bytes)
})

test('expired Blob leases recover and an older owner cannot save or remove the new lease', async () => {
  const { api, files } = fakeBlob()
  const store = api.createBlobPdfCache()
  const old = await store.acquire(key)
  const path = `pdf-export-locks/${key}.lock`
  files.get(path).uploadedAt = new Date(Date.now() - 181_000)
  const current = await store.acquire(key)
  assert.notEqual(old.etag, current.etag)
  await assert.rejects(store.save(old, bytes), /lease expired/)
  await store.release(old)
  assert.equal(files.get(path).etag, current.etag)
  await store.save(current, bytes)
  await store.release(current)
  assert.equal(files.has(path), false)
})

test('storage errors are not treated as misses and a busy request never duplicates generation', async () => {
  const { api, sdk } = fakeBlob()
  sdk.list = async () => { throw new Error('Storage unavailable') }
  await assert.rejects(api.getOrCreatePdf(api.createBlobPdfCache(), key, async () => bytes), /Storage unavailable/)
  const busy = { find: async () => null, acquire: async () => null }
  await assert.rejects(api.getOrCreatePdf(busy, key, async () => { throw new Error('Must not generate') }, { waitMs: 2, pollMs: 1 }), api.PdfCacheBusyError)
})
