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

const jsonBody = load('src/lib/read-json-body.ts')

test('anonymous and throttled Instagram sync calls do not reach Meta or write the feed', async () => {
  let authorized = false
  let allowed = false
  let syncs = 0
  const route = load('src/app/api/instagram/sync/route.ts', {
    '@/lib/auth': { isAdminAuthenticated: async () => authorized },
    '@/lib/request-budget': { reserveRequestBudget: async () => allowed },
    '@/lib/instagram': {
      checkTokenExpiry() {},
      fetchFeed: async () => [],
      syncToDb: async () => ({ synced: ++syncs }),
    },
  }, { INSTAGRAM_ACCESS_TOKEN: 'test-token' })

  assert.equal((await route.POST()).status, 401)
  authorized = true
  assert.equal((await route.POST()).status, 429)
  assert.equal(syncs, 0)
  allowed = true
  assert.equal((await route.POST()).status, 200)
  assert.equal(syncs, 1)
})

test('invalid credentials and exhausted login budget are rejected before authentication work', async () => {
  let allowed = false
  let attempts = 0
  const route = load('src/app/api/auth/login/route.ts', {
    '@/lib/auth': {
      MAX_ADMIN_EMAIL_LENGTH: 254,
      MAX_ADMIN_PASSWORD_LENGTH: 4096,
      isAdminBootstrapConfigured: async () => true,
      authenticateAdmin: async () => (++attempts, { adminId: 'test', sessionVersion: 'v1' }),
      createAdminSession: async (id, version) => id === 'test' && version === 'v1',
    },
    '@/lib/read-json-body': jsonBody,
    '@/lib/request-budget': { requestClient: () => null, requestBudgetBucket: value => value, reserveRequestBudget: async () => allowed },
  })

  assert.equal((await route.POST(Response.json({ email: {}, password: 'test' }))).status, 401)
  assert.equal((await route.POST(Response.json({ email: 'admin@example.test', password: 'test' }))).status, 429)
  assert.equal(attempts, 0)
  allowed = true
  assert.equal((await route.POST(Response.json({ email: 'admin@example.test', password: 'test' }))).status, 200)
  assert.equal(attempts, 1)
})

test('request limits use only Vercel client identity and distinguish different callers', () => {
  const imports = { 'server-only': {}, '@/lib/db': {} }
  const hosted = load('src/lib/request-budget.ts', imports, { VERCEL: '1' })
  const local = load('src/lib/request-budget.ts', imports)
  const request = new Request('https://example.test', {
    headers: { 'x-forwarded-for': '192.0.2.1', 'x-vercel-forwarded-for': '198.51.100.2' },
  })
  assert.equal(hosted.requestClient(request), '198.51.100.2')
  assert.equal(local.requestClient(request), null)
  assert.notEqual(hosted.requestBudgetBucket('198.51.100.2'), hosted.requestBudgetBucket('192.0.2.1'))
})

test('changing an inquiry message cannot bypass the shared sending budget', async () => {
  let sends = 0
  const route = load('src/app/api/contact/route.ts', {
    '@/lib/site': { getSiteCompanyProfile: async () => ({ contactEmail: 'company@example.test' }) },
    '@/lib/contact-inquiry': { hasInquiryMessageContent: message => Boolean(message) },
    '@/lib/read-json-body': jsonBody,
    '@/lib/request-budget': { requestClient: () => null, reserveRequestBudget: async name => name !== 'contact-day' || sends === 0 },
    '@/lib/resend': { resend: { emails: { send: async () => (++sends, { error: null }) } } },
  }, { RESEND_FROM_EMAIL: 'sender@example.test' })

  const request = message => Response.json({ name: 'Test', email: 'reply@example.test', message })
  assert.equal((await route.POST(request('first'))).status, 200)
  assert.equal((await route.POST(request('second'))).status, 429)
  assert.equal((await route.POST(request('third'))).status, 429)
  assert.equal(sends, 1)
})

test('oversized streamed requests stop before authentication and contact parsing', async () => {
  const overLimit = Response.json({ text: 'a'.repeat(40_000) })
  assert.equal(await jsonBody.readJsonBody(overLimit, 32_768), null)
  assert.equal((await jsonBody.readJsonBody(Response.json({ text: '테스트' }), 128)).text, '테스트')
})

test('in-flight or rejected contact submissions never report a successful duplicate', async () => {
  let rejectBudget
  const budgetCheck = new Promise((_, reject) => { rejectBudget = reject })
  const route = load('src/app/api/contact/route.ts', {
    '@/lib/site': {},
    '@/lib/contact-inquiry': { hasInquiryMessageContent: () => true },
    '@/lib/read-json-body': jsonBody,
    '@/lib/request-budget': { requestClient: () => null, reserveRequestBudget: () => budgetCheck },
    '@/lib/resend': {},
  })
  const request = () => Response.json({ name: 'Test', email: 'reply@example.test', message: 'same body' })
  const first = route.POST(request())
  await new Promise(resolve => setImmediate(resolve))
  assert.equal((await route.POST(request())).status, 429)
  rejectBudget(new Error('temporary storage failure'))
  assert.equal((await first).status, 502)
  assert.equal((await route.POST(request())).status, 502)
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
