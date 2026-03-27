// Raw API response item from GET /v25.0/me/media
export interface InstagramPost {
  id: string
  media_url: string
  thumbnail_url?: string   // VIDEO only — may be absent on IMAGE posts
  caption?: string
  permalink: string
  timestamp: string        // ISO 8601 from API
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
}

// Full API response envelope
export interface InstagramFeedResponse {
  data: InstagramPost[]
  paging?: {
    cursors: { before: string; after: string }
    next?: string
  }
}

// Row shape returned from instagram_feed_cache SELECT queries
// Column names must exactly match schema.sql instagram_feed_cache DDL
export interface CachedPost {
  id: string              // UUID
  post_id: string
  media_url: string
  caption: string | null
  permalink: string | null
  post_timestamp: string | null  // TIMESTAMPTZ returned as ISO string by @vercel/postgres
  fetched_at: string
}

// Return value of syncToDb()
export interface SyncResult {
  synced: number          // rows upserted
  total: number           // rows returned by API
  fetched_at: string      // ISO timestamp of this sync
}

// Return value of refreshToken() — matches Meta API response exactly
export interface RefreshTokenResult {
  access_token: string
  token_type: string      // always 'bearer'
  expires_in: number      // seconds until expiry (typically 5183944 ≈ 60 days)
}
