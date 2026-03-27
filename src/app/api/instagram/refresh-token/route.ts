import { refreshToken } from '@/lib/instagram'

/**
 * POST /api/instagram/refresh-token
 * Renews the 60-day long-lived Instagram access token.
 *
 * Meta API constraint (Pitfall 4 from RESEARCH.md):
 *   - Token must be >24h old to be eligible for refresh
 *   - Token must not yet be expired
 *   - On success: new token valid for another ~60 days (expires_in ≈ 5183944s)
 *
 * D-11: The new token is returned in the response body.
 * The operator must manually update INSTAGRAM_ACCESS_TOKEN in Vercel dashboard
 * and INSTAGRAM_TOKEN_EXPIRES_AT (format: ISO 8601) in environment variables.
 *
 * D-10: Manual invocation only. No automatic scheduling.
 */
export async function POST(_request: Request): Promise<Response> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) {
    return Response.json(
      { success: false, error: 'INSTAGRAM_ACCESS_TOKEN environment variable is not set' },
      { status: 500 }
    )
  }

  try {
    const result = await refreshToken(token)

    // Calculate human-readable expiry date for the operator
    const expiresAt = new Date(Date.now() + result.expires_in * 1000).toISOString()

    return Response.json({
      success: true,
      data: {
        ...result,
        expires_at: expiresAt,
        instructions: [
          'Update INSTAGRAM_ACCESS_TOKEN in Vercel dashboard with the new access_token value',
          `Update INSTAGRAM_TOKEN_EXPIRES_AT to: ${expiresAt}`,
        ],
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error during token refresh'
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
