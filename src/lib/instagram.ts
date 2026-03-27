import type {
  InstagramPost,
  InstagramFeedResponse,
  RefreshTokenResult,
} from '@/types/instagram'

const INSTAGRAM_API_BASE = 'https://graph.instagram.com/v25.0'
const INSTAGRAM_REFRESH_BASE = 'https://graph.instagram.com'
const FEED_FIELDS = 'id,caption,media_url,thumbnail_url,timestamp,media_type,permalink'
// Token warning threshold: 7 days in ms (per D-12)
const TOKEN_WARN_DAYS = 7

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
