import { isAdminAuthenticated } from '@/lib/auth'
import { reserveRequestBudget } from '@/lib/request-budget'
import { fetchFeed, syncToDb, checkTokenExpiry } from '@/lib/instagram'

/**
 * POST /api/instagram/sync
 * Fetches latest feed from Meta Graph API and upserts into instagram_feed_cache.
 * Requires INSTAGRAM_ACCESS_TOKEN env var.
 * D-06: Manual trigger only (no cron). Called from /admin/instagram-test UI.
 */
export async function POST(): Promise<Response> {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 })
  }

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
    if (!(await reserveRequestBudget('instagram-sync', 1, 60))) {
      return Response.json(
        { success: false, error: 'SYNC_RATE_LIMITED' },
        { status: 429, headers: { 'Retry-After': '60' } },
      )
    }
    const posts = await fetchFeed(token)
    const result = await syncToDb(posts)
    return Response.json({ success: true, data: result })
  } catch {
    return Response.json({ success: false, error: 'SYNC_FAILED' }, { status: 500 })
  }
}
