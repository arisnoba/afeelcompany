import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import sharp from 'sharp'
import ts from 'typescript'

const require = createRequire(import.meta.url)

function load(path, imports = {}, env = {}) {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  })
  const exports = {}
  vm.runInNewContext(outputText, {
    exports, Buffer, Request, Response, TextDecoder, URL, process: { env },
    require: name => Object.hasOwn(imports, name) ? imports[name] : require(name),
  })
  return exports
}

test('anonymous Instagram sync calls do not reach Meta or write the feed', async () => {
  let authorized = false
  let syncs = 0
  const route = load('src/app/api/instagram/sync/route.ts', {
    '@/lib/auth': { isAdminAuthenticated: async () => authorized },
    '@/lib/instagram': {
      checkTokenExpiry() {},
      fetchFeed: async () => [],
      syncToDb: async () => ({ synced: ++syncs }),
    },
  }, { INSTAGRAM_ACCESS_TOKEN: 'test-token' })

  assert.equal((await route.POST()).status, 401)
  assert.equal(syncs, 0)
  authorized = true
  assert.equal((await route.POST()).status, 200)
  assert.equal(syncs, 1)
})

test('uploads reject non-images and encode verified images with matching extension and content type', async () => {
  const uploads = []
  const { uploadPublicImage } = load('src/lib/blob.ts', {
    sharp,
    '@vercel/blob': { put: async (path, bytes, options) => (uploads.push({ path, bytes, options }), { pathname: path }) },
  })
  await assert.rejects(uploadPublicImage(new File(['<script>alert(1)</script>'], 'payload.html', { type: 'image/png' }), 'portfolio'), /JPEG/)
  assert.equal(uploads.length, 0)

  const png = await sharp({ create: { width: 3, height: 4, channels: 3, background: 'blue' } }).png().toBuffer()
  await uploadPublicImage(new File([Buffer.concat([png, Buffer.from('appended-data')])], 'valid.html', { type: 'image/png' }), 'brands')
  assert.equal(uploads.length, 1)
  assert.match(uploads[0].path, /^brands\/\d+-valid\.png$/)
  assert.equal(uploads[0].options.contentType, 'image/png')
  assert.equal((await sharp(uploads[0].bytes).metadata()).format, 'png')
  assert.equal(uploads[0].bytes.includes(Buffer.from('appended-data')), false)
})
