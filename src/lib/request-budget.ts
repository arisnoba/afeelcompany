import 'server-only'

import { createHash } from 'node:crypto'
import { isIP } from 'node:net'
import { sql } from '@/lib/db'

type Budget = 'contact-day' | 'instagram-sync' | `${'admin-login' | 'contact-client' | 'contact-client-day'}:${string}`

export function requestClient(request: Request): string | null {
  if (process.env.VERCEL !== '1') return null
  const client = request.headers.get('x-vercel-forwarded-for')?.trim()
  return client && isIP(client) ? client : null
}

export function requestBudgetBucket(value: string): string {
  // A fixed number of buckets bounds database rows even with rotating callers.
  return createHash('sha256').update(value).digest('hex').slice(0, 4)
}

let schema: Promise<unknown> | undefined

export async function reserveRequestBudget(budget: Budget, limit: number, seconds: number): Promise<boolean> {
  schema ??= sql`
    CREATE TABLE IF NOT EXISTS request_budgets (
      name TEXT PRIMARY KEY,
      reset_at TIMESTAMPTZ NOT NULL,
      attempts INTEGER NOT NULL
    )
  `.catch(error => {
    schema = undefined
    throw error
  })
  await schema

  const result = await sql`
    INSERT INTO request_budgets (name, reset_at, attempts)
    VALUES (${budget}, NOW() + ${seconds} * INTERVAL '1 second', 1)
    ON CONFLICT (name) DO UPDATE
    SET attempts = CASE WHEN request_budgets.reset_at <= NOW() THEN 1 ELSE request_budgets.attempts + 1 END,
        reset_at = CASE WHEN request_budgets.reset_at <= NOW() THEN EXCLUDED.reset_at ELSE request_budgets.reset_at END
    WHERE request_budgets.reset_at <= NOW() OR request_budgets.attempts < ${limit}
  `
  return Boolean(result.rowCount)
}
