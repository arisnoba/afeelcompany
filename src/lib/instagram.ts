import { sql } from '@/lib/db'
import type {
  CachedPost,
  InstagramPost,
  InstagramFeedResponse,
  RefreshTokenResult,
  SyncResult,
} from '@/types/instagram'

const INSTAGRAM_API_BASE = 'https://graph.instagram.com/v25.0'
const INSTAGRAM_REFRESH_BASE = 'https://graph.instagram.com'
const INSTAGRAM_PUBLISH_BASE = 'https://graph.facebook.com/v25.0'
const FEED_FIELDS = 'id,caption,media_url,thumbnail_url,timestamp,media_type,permalink'
const FEED_CACHE_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 6
// Token warning threshold: 7 days in ms (per D-12)
const TOKEN_WARN_DAYS = 7

function getInstagramPublishContext(): { accessToken: string; userId: string } {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID

  if (!accessToken) {
    throw new Error('INSTAGRAM_ACCESS_TOKEN environment variable is not set')
  }

  if (!userId) {
    throw new Error('INSTAGRAM_USER_ID environment variable is not set')
  }

  return { accessToken, userId }
}

/**
 * Fetch recent media posts from Meta Graph API.
 * Never call this on page load — only from /api/instagram/sync (D-08).
 */
export async function fetchFeed(accessToken: string): Promise<InstagramPost[]> {
  const url = new URL(`${INSTAGRAM_API_BASE}/me/media`)
  url.searchParams.set('fields', FEED_FIELDS)
  url.searchParams.set('access_token', accessToken)

  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) {
    const err: unknown = await res.json()
    throw new Error(`Instagram API error ${res.status}: ${JSON.stringify(err)}`)
  }

  const body: InstagramFeedResponse = await res.json()
  return body.data
}

/**
 * Refresh the 60-day long-lived token.
 * Meta API constraint: token must be >24h old and not yet expired.
 * Source: https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token/
 */
export async function refreshToken(
  currentToken: string
): Promise<RefreshTokenResult> {
  const url = new URL(`${INSTAGRAM_REFRESH_BASE}/refresh_access_token`)
  url.searchParams.set('grant_type', 'ig_refresh_token')
  url.searchParams.set('access_token', currentToken)

  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) {
    const err: unknown = await res.json()
    throw new Error(`Token refresh failed ${res.status}: ${JSON.stringify(err)}`)
  }

  return res.json() as Promise<RefreshTokenResult>
}

export async function createMediaContainer(
  imageUrl: string,
  caption: string
): Promise<{ id: string }> {
  const { accessToken, userId } = getInstagramPublishContext()
  const body = new URLSearchParams({
    image_url: imageUrl,
    caption,
    access_token: accessToken,
  })

  const response = await fetch(`${INSTAGRAM_PUBLISH_BASE}/${userId}/media`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  })

  const result = (await response.json()) as { id?: string; error?: unknown }

  if (!response.ok || !result.id) {
    throw new Error(
      `Create media container failed ${response.status}: ${JSON.stringify(result.error ?? result)}`
    )
  }

  return { id: result.id }
}

export async function publishMediaContainer(
  containerId: string
): Promise<{ id: string }> {
  const { accessToken, userId } = getInstagramPublishContext()
  const body = new URLSearchParams({
    creation_id: containerId,
    access_token: accessToken,
  })

  const response = await fetch(`${INSTAGRAM_PUBLISH_BASE}/${userId}/media_publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
    cache: 'no-store',
  })

  const result = (await response.json()) as { id?: string; error?: unknown }

  if (!response.ok || !result.id) {
    throw new Error(
      `Publish media container failed ${response.status}: ${JSON.stringify(result.error ?? result)}`
    )
  }

  return { id: result.id }
}

/**
 * Log a console.warn if INSTAGRAM_TOKEN_EXPIRES_AT env var is within 7 days.
 * Called at server startup (e.g., from route.ts modules or layout.tsx).
 * INSTAGRAM_TOKEN_EXPIRES_AT format: ISO 8601 date string (e.g., "2026-05-27T00:00:00Z")
 * Per D-12: warn only — no email, no automatic refresh.
 */
export function checkTokenExpiry(): void {
  const expiresAtRaw = process.env.INSTAGRAM_TOKEN_EXPIRES_AT
  if (!expiresAtRaw) {
    // Env var not set — skip check (token may be manually managed)
    return
  }

  const expiresAt = new Date(expiresAtRaw)
  if (isNaN(expiresAt.getTime())) {
    console.warn('[Instagram] INSTAGRAM_TOKEN_EXPIRES_AT is not a valid date:', expiresAtRaw)
    return
  }

  const msUntilExpiry = expiresAt.getTime() - Date.now()
  const daysUntilExpiry = msUntilExpiry / (1000 * 60 * 60 * 24)

  if (daysUntilExpiry <= TOKEN_WARN_DAYS) {
    console.warn(
      `[Instagram] WARNING: Access token expires in ${Math.ceil(daysUntilExpiry)} day(s) ` +
      `(${expiresAt.toISOString()}). ` +
      'Call POST /api/instagram/refresh-token to renew.'
    )
  }
}

/**
 * Upsert Instagram posts into instagram_feed_cache.
 * Uses ON CONFLICT (post_id) DO UPDATE to handle re-syncs idempotently.
 * Only columns that exist in schema.sql are written:
 *   post_id, media_url, caption, permalink, post_timestamp, fetched_at
 * thumbnail_url and media_type are NOT stored (no column in DB).
 */
export async function syncToDb(posts: InstagramPost[]): Promise<SyncResult> {
  const fetchedAt = new Date().toISOString()

  for (const post of posts) {
    // Use thumbnail_url as media_url fallback for VIDEO posts (Pitfall 3)
    const mediaUrl = post.media_url ?? post.thumbnail_url ?? ''
    const postTimestamp = post.timestamp ? new Date(post.timestamp).toISOString() : null

    await sql`
      INSERT INTO instagram_feed_cache
        (post_id, media_url, caption, permalink, post_timestamp, fetched_at)
      VALUES
        (${post.id}, ${mediaUrl}, ${post.caption ?? null}, ${post.permalink ?? null}, ${postTimestamp}, NOW())
      ON CONFLICT (post_id) DO UPDATE SET
        media_url     = EXCLUDED.media_url,
        caption       = EXCLUDED.caption,
        permalink     = EXCLUDED.permalink,
        post_timestamp = EXCLUDED.post_timestamp,
        fetched_at    = NOW()
    `
  }

  return {
    synced: posts.length,
    total: posts.length,
    fetched_at: fetchedAt,
  }
}

/**
 * Read cached posts from DB. No API call. (D-08: cache-first strategy)
 * Returns posts ordered newest-first, capped at 20.
 */
export async function getCachedFeed(): Promise<CachedPost[]> {
  const result = await sql<CachedPost>`
    SELECT id, post_id, media_url, caption, permalink, post_timestamp, fetched_at
    FROM instagram_feed_cache
    ORDER BY post_timestamp DESC NULLS LAST
    LIMIT 20
  `
  return result.rows
}

function isFeedCacheStale(posts: CachedPost[]): boolean {
  if (posts.length === 0) {
    return true
  }

  const lastFetchedAt = new Date(posts[0].fetched_at)
  if (Number.isNaN(lastFetchedAt.getTime())) {
    return true
  }

  return Date.now() - lastFetchedAt.getTime() >= FEED_CACHE_REFRESH_INTERVAL_MS
}

/**
 * Read cached feed for rendering and refresh stale image URLs on demand.
 * This keeps media_url values current without forcing a full API call on every page load.
 */
export async function getDisplayFeed(): Promise<CachedPost[]> {
  const cachedPosts = await getCachedFeed()

  if (!isFeedCacheStale(cachedPosts)) {
    return cachedPosts
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) {
    return cachedPosts
  }

  checkTokenExpiry()

  try {
    const freshPosts = await fetchFeed(token)
    await syncToDb(freshPosts)
    return await getCachedFeed()
  } catch (error: unknown) {
    console.warn(
      '[Instagram] Failed to refresh stale feed cache, falling back to cached rows:',
      error
    )
    return cachedPosts
  }
}
