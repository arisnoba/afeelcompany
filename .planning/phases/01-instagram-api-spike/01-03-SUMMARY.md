---
phase: 01-instagram-api-spike
plan: "03"
subsystem: instagram-api
tags: [api-routes, next15, instagram, token-refresh]
dependency_graph:
  requires: [01-02]
  provides: [POST /api/instagram/sync, POST /api/instagram/refresh-token]
  affects: [01-04-PLAN (admin UI calls these endpoints)]
tech_stack:
  added: []
  patterns: [Next.js 16 Route Handler, async Request, Response.json]
key_files:
  created:
    - src/app/api/instagram/sync/route.ts
    - src/app/api/instagram/refresh-token/route.ts
  modified: []
decisions:
  - "Both routes read INSTAGRAM_ACCESS_TOKEN from env var, never from request body (security)"
  - "POST semantics used for both trigger endpoints (not GET) — idempotent trigger pattern"
  - "_request prefix on unused parameter avoids TypeScript unused-variable warnings"
  - "refresh-token route computes expires_at from expires_in and returns operator instructions for manual Vercel dashboard update"
metrics:
  duration: "1min"
  completed: "2026-03-27"
  tasks: 2
  files: 2
---

# Phase 01 Plan 03: API Route Handlers for Instagram Sync and Token Refresh Summary

Two Next.js 16 POST Route Handlers wiring instagram.ts library functions to HTTP endpoints for manual triggering from the Spike UI.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create POST /api/instagram/sync route | 425395b | src/app/api/instagram/sync/route.ts |
| 2 | Create POST /api/instagram/refresh-token route | 66f7df2 | src/app/api/instagram/refresh-token/route.ts |

## What Was Built

### POST /api/instagram/sync
- Calls `checkTokenExpiry()` on each invocation (D-12 compliance)
- Guards against missing `INSTAGRAM_ACCESS_TOKEN` env var (returns 500 with descriptive error)
- Calls `fetchFeed(token)` then `syncToDb(posts)` from `src/lib/instagram.ts`
- Returns `{ success: true, data: SyncResult }` or `{ success: false, error: string }`
- Uses `error instanceof Error` pattern for safe unknown error narrowing

### POST /api/instagram/refresh-token
- Guards against missing `INSTAGRAM_ACCESS_TOKEN` env var
- Calls `refreshToken(token)` from `src/lib/instagram.ts`
- Computes human-readable `expires_at` ISO string from `expires_in` seconds
- Returns operator instructions for manual update in Vercel dashboard (D-11)
- Returns `{ success: true, data: { ...RefreshTokenResult, expires_at, instructions } }` or `{ success: false, error }`

## Verification

- `npx tsc --noEmit` — passed (0 errors)
- `npm run build` — passed, both routes appear as `ƒ (Dynamic)` in build output:
  - `/api/instagram/refresh-token`
  - `/api/instagram/sync`

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — both routes are fully wired to live library functions.

## Self-Check: PASSED

- [x] src/app/api/instagram/sync/route.ts exists
- [x] src/app/api/instagram/refresh-token/route.ts exists
- [x] Commit 425395b exists (Task 1)
- [x] Commit 66f7df2 exists (Task 2)
- [x] npm run build exits 0
