---
phase: 01-instagram-api-spike
plan: "02"
subsystem: instagram-api
tags: [instagram, meta-graph-api, db-cache, token-refresh]
dependency_graph:
  requires:
    - 01-01  # types (InstagramPost, CachedPost, SyncResult, RefreshTokenResult) and db.ts
  provides:
    - src/lib/instagram.ts with 5 exported functions
  affects:
    - src/app/api/instagram/sync/route.ts (Plan 03 — imports fetchFeed, syncToDb)
    - src/app/api/instagram/refresh-token/route.ts (Plan 03 — imports refreshToken, checkTokenExpiry)
    - src/app/admin/instagram-test/page.tsx (Plan 04 — imports getCachedFeed)
tech_stack:
  added: []
  patterns:
    - cache-first read (getCachedFeed reads DB only, no API call)
    - idempotent upsert via ON CONFLICT (post_id) DO UPDATE
    - VIDEO fallback: post.thumbnail_url used as media_url when absent
key_files:
  created:
    - src/lib/instagram.ts
  modified: []
decisions:
  - "fetchFeed uses cache: no-store to bypass Next.js fetch cache (D-08)"
  - "syncToDb only writes columns present in schema.sql — thumbnail_url and media_type NOT stored"
  - "checkTokenExpiry warns only (no auto-refresh) per D-12; threshold is 7 days"
  - "VIDEO posts: thumbnail_url used as media_url fallback before writing to DB (Pitfall 3)"
metrics:
  duration: "2min"
  completed: "2026-03-27"
  tasks: 2
  files: 1
---

# Phase 01 Plan 02: Instagram API Library Summary

**One-liner:** Five pure functions for Meta Graph API + DB cache operations: fetchFeed, syncToDb, getCachedFeed, refreshToken, checkTokenExpiry.

## What Was Built

`src/lib/instagram.ts` (135 lines) centralizes all Instagram API and DB interactions for Phase 01:

| Function | Purpose | Calls |
|---|---|---|
| `fetchFeed(accessToken)` | Reads posts from Meta API v25.0 | GET /v25.0/me/media |
| `syncToDb(posts)` | Upserts posts into instagram_feed_cache | Vercel Postgres |
| `getCachedFeed()` | Reads cached posts from DB | Vercel Postgres |
| `refreshToken(currentToken)` | Renews 60-day long-lived token | GET /refresh_access_token |
| `checkTokenExpiry()` | Warns within 7-day window | process.env only |

## Verification

- `npm run build` exits 0 (TypeScript compiles, Next.js static generation passes)
- `npx tsc --noEmit` exits 0
- 5 exported functions confirmed via `grep -E "^export (async )?function" src/lib/instagram.ts`
- 135 lines (requirement: min 80)

## Commits

| Task | Hash | Message |
|---|---|---|
| Task 1 | 5d0dfcd | feat(01-02): implement fetchFeed, refreshToken, checkTokenExpiry |
| Task 2 | 3a734a5 | feat(01-02): add syncToDb and getCachedFeed to instagram.ts |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all five functions are fully implemented. DB calls require a live `POSTGRES_URL` environment variable at runtime (standard Vercel Postgres requirement, not a stub).

## Self-Check: PASSED
