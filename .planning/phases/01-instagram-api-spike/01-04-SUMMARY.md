---
phase: 01-instagram-api-spike
plan: "04"
subsystem: instagram-spike-ui
tags: [next.js, instagram, spike, admin, server-component, client-component]
dependency_graph:
  requires: [01-02]
  provides: [admin-instagram-test-page]
  affects: []
tech_stack:
  added: []
  patterns: [server-component, client-component-boundary, force-dynamic]
key_files:
  created:
    - src/app/admin/instagram-test/page.tsx
    - src/app/admin/instagram-test/_components/SyncButton.tsx
  modified: []
decisions:
  - "export const dynamic = 'force-dynamic' added to page.tsx to prevent build-time DB access during static pre-rendering"
metrics:
  duration: 8min
  completed: "2026-03-27"
  tasks_completed: 1
  tasks_total: 1
  files_created: 2
  files_modified: 0
---

# Phase 01 Plan 04: Spike UI — Instagram Test Page Summary

**One-liner:** Server Component page at /admin/instagram-test renders DB-cached Instagram posts in a 3-column grid with a client-side SyncButton for manual sync and token refresh.

## What Was Built

Created two files implementing the spike verification UI for INST-01 and INST-02:

1. **`src/app/admin/instagram-test/page.tsx`** — Next.js App Router Server Component that:
   - Calls `getCachedFeed()` directly on the server (no live API call on load, D-08)
   - Displays last sync timestamp from `fetched_at`
   - Renders 3-column image grid using `next/image` (remotePatterns pre-configured for cdninstagram.com)
   - Shows empty state with instructions when cache is empty

2. **`src/app/admin/instagram-test/_components/SyncButton.tsx`** — `'use client'` component that:
   - "Sync Now" button calls `POST /api/instagram/sync`, shows synced count on success
   - "Refresh Token" button calls `POST /api/instagram/refresh-token`, shows expiry days on success
   - Handles loading, error, and success states with inline feedback

## Verification

- `npm run build` exits 0
- Page appears as `ƒ (Dynamic)` in build output (not pre-rendered)
- All acceptance criteria grep checks pass
- `'use client'` present in SyncButton.tsx, absent from page.tsx (clean server/client boundary)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Functionality] Added `export const dynamic = 'force-dynamic'`**
- **Found during:** Build verification (Task 1)
- **Issue:** Next.js attempted static pre-rendering of /admin/instagram-test at build time. The page calls `getCachedFeed()` which queries the DB. During build in CI/local environment, the DB table `instagram_feed_cache` does not exist, causing `NeonDbError: relation "instagram_feed_cache" does not exist` and build failure.
- **Fix:** Added `export const dynamic = 'force-dynamic'` to page.tsx to force server-side rendering on every request, preventing build-time DB access.
- **Files modified:** src/app/admin/instagram-test/page.tsx
- **Commit:** c7a7de8 (same task commit)

**2. [Rule 2 - Type Safety] Typed API response via `unknown` narrowing in SyncButton**
- **Found during:** Task 1 implementation
- **Issue:** Plan template used untyped `json` variable from `res.json()`. TypeScript strict mode requires explicit typing of external data.
- **Fix:** Used `const json: unknown = await res.json()` then cast to a typed interface, following project TypeScript coding-style rules (no `any`).
- **Files modified:** src/app/admin/instagram-test/_components/SyncButton.tsx
- **Commit:** c7a7de8

## Known Stubs

None — this page reads real DB data via `getCachedFeed()`. The empty state message is intentional UX, not a stub.

## Self-Check: PASSED

- `src/app/admin/instagram-test/page.tsx` — FOUND
- `src/app/admin/instagram-test/_components/SyncButton.tsx` — FOUND
- Commit c7a7de8 — FOUND
