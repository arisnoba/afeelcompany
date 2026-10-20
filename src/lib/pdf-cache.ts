import { randomUUID } from 'node:crypto'
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { BlobNotFoundError, BlobPreconditionFailedError, del, get, head, list, put } from '@vercel/blob'

const LEASE_MS = 180_000
const localLeases = new Map<string, PdfLease>()

export interface CachedPdf {
  pathname: string
  savedAt: string
  url?: string
}

export interface PdfLease {
  key: string
  owner: string
  savedAt: string
  etag?: string
}

export interface PdfCacheStore {
  find(key: string): Promise<CachedPdf | null>
  acquire(key: string): Promise<PdfLease | null>
  save(lease: PdfLease, bytes: Uint8Array): Promise<CachedPdf>
  release(lease: PdfLease): Promise<void>
  read(file: CachedPdf): Promise<BodyInit>
}

function prefix(key: string): string {
  if (!/^(ko|en|zh)\/[a-f0-9]{64}$/.test(key)) throw new Error('Invalid PDF cache key')
  return `pdf-exports/${key}/`
}

function savedFile(pathname: string, url?: string): CachedPdf {
  const timestamp = Number(pathname.split('/').at(-1)?.replace('.pdf', ''))
  if (!Number.isFinite(timestamp) || timestamp <= 0) throw new Error('Invalid saved PDF timestamp')
  return { pathname, savedAt: new Date(timestamp).toISOString(), url }
}

// Local development never uploads to the production Blob store, even if an
// existing .env.local contains its credentials.
export function createLocalPdfCache(root = process.env.PDF_CACHE_DIR ?? join(process.cwd(), '.cache', 'pdf-exports')): PdfCacheStore {
  return {
    async find(key) {
      const directory = join(root, prefix(key))
      const names = await readdir(directory).catch((error: NodeJS.ErrnoException) => {
        if (error.code === 'ENOENT') return []
        throw error
      })
      const name = names.filter(name => /^\d+\.pdf$/.test(name)).sort().at(-1)
      return name ? savedFile(`${prefix(key)}${name}`) : null
    },
    async acquire(key) {
      prefix(key)
      const active = localLeases.get(join(root, key))
      if (active && Date.now() - Date.parse(active.savedAt) < LEASE_MS) return null
      const lease = { key, owner: randomUUID(), savedAt: new Date().toISOString() }
      localLeases.set(join(root, key), lease)
      return lease
    },
    async save(lease, bytes) {
      if (localLeases.get(join(root, lease.key))?.owner !== lease.owner) throw new Error('PDF generation lease expired')
      const pathname = `${prefix(lease.key)}${Date.parse(lease.savedAt)}.pdf`
      await mkdir(join(root, prefix(lease.key)), { recursive: true })
      const temporary = join(root, `${pathname}.${lease.owner}.tmp`)
      await writeFile(temporary, bytes)
      await rename(temporary, join(root, pathname))
      return savedFile(pathname)
    },
    async release(lease) {
      if (localLeases.get(join(root, lease.key))?.owner === lease.owner) localLeases.delete(join(root, lease.key))
    },
    async read(file) { return Buffer.from(await readFile(join(root, file.pathname))) },
  }
}

async function lockMetadata(pathname: string) {
  try { return await head(pathname) } catch (error) {
    if (error instanceof BlobNotFoundError) return null
    throw error
  }
}

export function createBlobPdfCache(): PdfCacheStore {
  const lockPath = (key: string) => { prefix(key); return `pdf-export-locks/${key}.lock` }
  return {
    async find(key) {
      const result = await list({ prefix: prefix(key), limit: 1 })
      const file = result.blobs[0]
      return file ? savedFile(file.pathname, file.url) : null
    },
    async acquire(key) {
      const pathname = lockPath(key)
      const active = await lockMetadata(pathname)
      if (active) {
        if (Date.now() - active.uploadedAt.getTime() < LEASE_MS) return null
        try { await del(pathname, { ifMatch: active.etag }) } catch (error) {
          if (error instanceof BlobPreconditionFailedError || error instanceof BlobNotFoundError) return null
          throw error
        }
      }
      const owner = randomUUID()
      try {
        await put(pathname, owner, { access: 'public', addRandomSuffix: false, allowOverwrite: false, cacheControlMaxAge: 60 })
      } catch (error) {
        // A competing instance may have created the lease first. Storage or
        // authentication errors must not silently become a cache miss.
        if (await lockMetadata(pathname)) return null
        throw error
      }
      const metadata = await head(pathname)
      return { key, owner, savedAt: metadata.uploadedAt.toISOString(), etag: metadata.etag }
    },
    async save(lease, bytes) {
      const active = await lockMetadata(lockPath(lease.key))
      if (!active || active.etag !== lease.etag) throw new Error('PDF generation lease expired')
      const pathname = `${prefix(lease.key)}${Date.parse(lease.savedAt)}.pdf`
      const file = await put(pathname, Buffer.from(bytes), {
        access: 'public', addRandomSuffix: false, allowOverwrite: false,
        contentType: 'application/pdf', cacheControlMaxAge: 31_536_000,
      })
      return savedFile(file.pathname, file.url)
    },
    async release(lease) {
      if (!lease.etag) throw new Error('Missing PDF lease ETag')
      try { await del(lockPath(lease.key), { ifMatch: lease.etag }) } catch (error) {
        if (!(error instanceof BlobNotFoundError) && !(error instanceof BlobPreconditionFailedError)) throw error
      }
    },
    async read(file) {
      const result = await get(file.url!, { access: 'public' })
      if (!result || result.statusCode !== 200) throw new Error('Saved PDF is unavailable')
      return result.stream
    },
  }
}

export function getPdfCacheStore(localOnly = false): PdfCacheStore {
  return !localOnly && process.env.VERCEL === '1' && process.env.NODE_ENV === 'production' ? createBlobPdfCache() : createLocalPdfCache()
}

export class PdfCacheBusyError extends Error {}

export async function getOrCreatePdf(
  store: PdfCacheStore,
  key: string,
  generate: (savedAt: string) => Promise<Uint8Array>,
  { waitMs = 95_000, pollMs = 1_000 } = {},
): Promise<{ file: CachedPdf; hit: boolean }> {
  const deadline = Date.now() + waitMs
  do {
    const cached = await store.find(key)
    if (cached) return { file: cached, hit: true }
    const lease = await store.acquire(key)
    if (lease) {
      try {
        const existing = await store.find(key)
        if (existing) return { file: existing, hit: true }
        const bytes = await generate(lease.savedAt)
        if (Buffer.from(bytes.subarray(0, 5)).toString() !== '%PDF-') throw new Error('Invalid generated PDF')
        return { file: await store.save(lease, bytes), hit: false }
      } finally {
        await store.release(lease).catch(error => console.error('[pdf] lease release failed', error))
      }
    }
    await new Promise(resolve => setTimeout(resolve, pollMs))
  } while (Date.now() < deadline)
  throw new PdfCacheBusyError('PDF generation is already in progress')
}
