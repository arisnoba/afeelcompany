---
phase: 01-instagram-api-spike
plan: 01
subsystem: api
tags: [instagram, typescript, vercel-postgres, next-image, types]

# Dependency graph
requires: []
provides:
  - "src/types/instagram.ts — all Instagram domain type contracts (5 interfaces)"
  - "src/lib/db.ts — project-wide @vercel/postgres sql tag re-export"
  - "next.config.ts — remotePatterns allowlist for Instagram CDN images"
affects:
  - 01-02
  - 01-03
  - 01-04

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "@vercel/postgres sql tagged template literal as project-wide DB access pattern (no ORM)"
    - "TypeScript interfaces as source-of-truth contracts for external API + DB rows"
    - "next.config.ts remotePatterns for external image CDN domains"

key-files:
  created:
    - src/types/instagram.ts
    - src/lib/db.ts
  modified:
    - next.config.ts

key-decisions:
  - "CachedPost fields mirror schema.sql instagram_feed_cache DDL exactly (post_id, media_url, caption, permalink, post_timestamp, fetched_at)"
  - "thumbnail_url is optional on InstagramPost (VIDEO only) — Wave 2 must use media_url ?? thumbnail_url fallback"
  - "remotePatterns uses **.cdninstagram.com double-star glob to cover all subdomain depths (e.g., scontent-lax3-1.cdninstagram.com)"
  - "**.fbcdn.net added as Facebook CDN fallback — Meta sometimes serves media from this domain"

patterns-established:
  - "Pattern: DB helper = single re-export file (src/lib/db.ts) — import { sql } from @/lib/db"
  - "Pattern: Domain types in src/types/<domain>.ts, no barrel index.ts needed at spike stage"

requirements-completed: [INST-01, INST-02, INST-03]

# Metrics
duration: 2min
completed: 2026-03-27
---

# Phase 01 Plan 01: Type Contracts and Infrastructure Summary

**TypeScript domain types (5 interfaces), @vercel/postgres sql re-export, and next.config.ts Instagram CDN remotePatterns — foundation for Wave 2 API implementation**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-27T03:27:40Z
- **Completed:** 2026-03-27T03:28:51Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Created `src/types/instagram.ts` with 5 exported interfaces covering all Instagram domain objects (InstagramPost, InstagramFeedResponse, CachedPost, SyncResult, RefreshTokenResult)
- CachedPost fields mirror `instagram_feed_cache` DDL exactly — Wave 2 SQL queries will match without column mismatch errors
- `src/lib/db.ts` establishes the project-wide pattern for DB access: single re-export of `sql` tag from `@vercel/postgres`
- `next.config.ts` remotePatterns covers `**.cdninstagram.com` (double-star for subdomain depth) and `**.fbcdn.net` (Facebook CDN fallback)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create src/types/instagram.ts with full domain type contracts** - `a13deef` (feat)
2. **Task 2: Implement src/lib/db.ts and update next.config.ts remotePatterns** - `39c534f` (feat)

**Plan metadata:** _(final docs commit)_

## Files Created/Modified

- `src/types/instagram.ts` — 5 TypeScript interfaces: InstagramPost, InstagramFeedResponse, CachedPost, SyncResult, RefreshTokenResult
- `src/lib/db.ts` — Re-exports `sql` tagged template literal from `@vercel/postgres`
- `next.config.ts` — Added `images.remotePatterns` for `**.cdninstagram.com` and `**.fbcdn.net`

## Decisions Made

- **CachedPost mirrors schema.sql exactly**: `post_id`, `media_url`, `caption`, `permalink`, `post_timestamp`, `fetched_at` — no `thumbnail_url` or `media_type` columns (those are API-only fields not persisted)
- **Double-star glob `**.cdninstagram.com`**: Safer than specific prefix; covers `scontent-lax3-1.cdninstagram.com` and any future CDN subdomain variants
- **`**.fbcdn.net` added proactively**: Meta sometimes serves media from Facebook CDN; better to have it now than debug a broken image in Wave 2

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None — TypeScript compiled clean on first attempt, build passed without errors.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Wave 2 (Plan 02) can now `import { InstagramPost, SyncResult, RefreshTokenResult } from '@/types/instagram'` and `import { sql } from '@/lib/db'` without any missing module errors
- All type contracts established — TypeScript will catch mismatches immediately when Wave 2 implements `fetchFeed`, `syncToDb`, `refreshToken`
- No blockers

---
*Phase: 01-instagram-api-spike*
*Completed: 2026-03-27*
