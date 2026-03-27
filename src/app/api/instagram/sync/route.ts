import { fetchFeed, syncToDb, checkTokenExpiry } from '@/lib/instagram'

/**
 * POST /api/instagram/sync
 * Fetches latest feed from Meta Graph API and upserts into instagram_feed_cache.
 * Requires INSTAGRAM_ACCESS_TOKEN env var.
 * D-06: Manual trigger only (no cron). Called from /admin/instagram-test UI.
 */
export async function POST(_request: Request): Promise<Response> {
  // Log token expiry warning on each sync call (D-12)
  checkTokenExpiry()

  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) {
    return Response.json(
      { success: false, error: 'INSTAGRAM_ACCESS_TOKEN environment variable is not set' },
      { status: 500 }
    )
  }

  try {
    const posts = await fetchFeed(token)
    const result = await syncToDb(posts)
    return Response.json({ success: true, data: result })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error during sync'
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
