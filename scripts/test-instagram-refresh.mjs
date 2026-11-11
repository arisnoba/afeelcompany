import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const currentToken = 'test-current-token'
const refreshedToken = 'test-refreshed-token'
const adminId = '11111111-1111-4111-8111-111111111111'
const expiresIn = 5183944

function setup({
  active = true,
  token = currentToken,
  upstreamStatus = 200,
  upstreamToken = currentToken,
  upstreamExpiry = expiresIn,
} = {}) {
  const env = { INSTAGRAM_ACCESS_TOKEN: token }
  let sessionCookie
  const sessions = new Set()
  const providerRequests = []

  function load(path, imports) {
    const source = readFileSync(new URL(path, import.meta.url), 'utf8')
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    })
    const exports = {}
    vm.runInNewContext(outputText, {
      exports,
      require(name) {
        if (Object.hasOwn(imports, name)) return imports[name]
        throw new Error(`Unexpected module: ${name}`)
      },
      process: { env },
      Buffer,
      Response,
      URL,
      fetch: async (url, options) => {
        providerRequests.push({ url, options })
        return Response.json({
          access_token: upstreamToken,
          expires_in: upstreamExpiry,
          token_type: refreshedToken,
          error: { message: currentToken },
        }, { status: upstreamStatus })
      },
    })
    return exports
  }

  const db = {
    sql: async (query, tokenHash) => {
      const statement = query.join('')
      if (statement.includes('CREATE ') || statement.includes('DELETE ')) return { rows: [] }
      if (statement.includes('INSERT INTO admin_sessions')) {
        sessions.add(tokenHash)
        return { rowCount: 1 }
      }
      if (statement.includes('FROM admin_sessions')) {
        return { rows: active && sessions.has(tokenHash) ? [{ id: adminId, email: 'admin@example.test' }] : [] }
      }
      throw new Error('Unexpected query')
    },
  }
  const auth = load('../src/lib/auth.ts', {
    'server-only': {},
    'node:crypto': require('node:crypto'),
    'node:util': require('node:util'),
    'next/headers': {
      cookies: async () => ({
        get: () => sessionCookie === undefined ? undefined : { value: sessionCookie },
        set: (_name, value) => { sessionCookie = value },
      }),
    },
    'next/navigation': {},
    '@/lib/db': db,
  })
  const instagram = load('../src/lib/instagram.ts', { '@/lib/db': db, '@/lib/request-budget': {} })
  const route = load('../src/app/api/instagram/refresh-token/route.ts', {
    '@/lib/auth': auth,
    '@/lib/instagram': instagram,
  })

  return {
    post: route.POST,
    providerRequests,
    signIn: () => auth.createAdminSession(adminId, 'test-version'),
    forgeSession: () => { sessionCookie = `${adminId}.${Date.now() + 60_000}.invalid-signature` },
  }
}

test('anonymous, forged and inactive admin sessions cannot trigger refresh', async () => {
  const anonymous = setup()
  const forged = setup()
  forged.forgeSession()
  const inactive = setup({ active: false })
  await inactive.signIn()

  for (const client of [anonymous, forged, inactive]) {
    const response = await client.post()
    assert.equal(response.status, 401)
    assert.deepEqual(await response.json(), { success: false, error: 'UNAUTHORIZED' })
    assert.equal(client.providerRequests.length, 0)
  }
})

test('an active admin can refresh and receives only expiry metadata', async () => {
  const client = setup()
  await client.signIn()
  const response = await client.post()
  assert.equal(response.status, 200)
  const { success, data } = await response.json()
  assert.equal(success, true)
  assert.deepEqual(Object.keys(data).sort(), ['expires_at', 'expires_in'])
  assert.equal(data.expires_in, expiresIn)
  const secondsUntilExpiry = (Date.parse(data.expires_at) - Date.now()) / 1000
  assert.ok(Math.abs(secondsUntilExpiry - expiresIn) < 10)
  assert.equal(client.providerRequests.length, 1)
  const request = new URL(client.providerRequests[0].url)
  assert.equal(request.origin + request.pathname, 'https://graph.instagram.com/refresh_access_token')
  assert.equal(request.searchParams.get('access_token'), currentToken)
  assert.equal(request.searchParams.get('grant_type'), 'ig_refresh_token')
})

test('an upstream error cannot disclose either token in the response', async () => {
  const client = setup({ upstreamStatus: 400, upstreamToken: refreshedToken })
  await client.signIn()
  const response = await client.post()
  assert.equal(response.status, 500)
  assert.deepEqual(await response.json(), { success: false, error: 'TOKEN_REFRESH_FAILED' })
})

test('an active admin with no configured token does not call Meta', async () => {
  const client = setup({ token: '' })
  await client.signIn()
  const response = await client.post()
  assert.equal(response.status, 500)
  assert.equal(client.providerRequests.length, 0)
})

test('a replacement token is never sent in the response', async () => {
  const client = setup({ upstreamToken: refreshedToken })
  await client.signIn()
  const response = await client.post()
  assert.equal(response.status, 409)
  assert.deepEqual(await response.json(), { success: false, error: 'TOKEN_REPLACEMENT_REQUIRED' })
})

test('a provider string in the expiry field cannot be sent in the response', async () => {
  const client = setup({ upstreamExpiry: refreshedToken })
  await client.signIn()
  const response = await client.post()
  assert.equal(response.status, 500)
  assert.deepEqual(await response.json(), { success: false, error: 'TOKEN_REFRESH_FAILED' })
})
