---
phase: 01-instagram-api-spike
verified: 2026-03-27T00:00:00Z
status: passed
score: 13/13 must-haves verified
re_verification: false
---

# Phase 1: Instagram API Spike Verification Report

**Phase Goal:** Prove that the Instagram Basic Display API can be integrated — fetch feed, cache to DB, refresh token
**Verified:** 2026-03-27
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

All truths are drawn from the must_haves declared across plans 01-01 through 01-05.

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | TypeScript compiler accepts imports of InstagramPost, SyncResult, RefreshTokenResult from src/types/instagram.ts | VERIFIED | `npx tsc --noEmit` exits 0 |
| 2  | src/lib/db.ts exports sql and can be imported without error | VERIFIED | Line 4: `export { sql } from '@vercel/postgres'` |
| 3  | next.config.ts allows cdninstagram.com image URLs without runtime error | VERIFIED | remotePatterns: `**.cdninstagram.com` and `**.fbcdn.net` present |
| 4  | fetchFeed(token) calls GET graph.instagram.com/v25.0/me/media with correct fields and returns InstagramPost[] | VERIFIED | Lines 20-33 of instagram.ts — URL built, cache: no-store, typed response |
| 5  | syncToDb(posts) upserts all posts into instagram_feed_cache using ON CONFLICT (post_id) DO UPDATE | VERIFIED | Lines 94-121 of instagram.ts — correct SQL upsert pattern |
| 6  | refreshToken(token) calls GET graph.instagram.com/refresh_access_token and returns RefreshTokenResult | VERIFIED | Lines 40-54 of instagram.ts — grant_type=ig_refresh_token, typed return |
| 7  | checkTokenExpiry() logs a console.warn if token expires within 7 days | VERIFIED | Lines 62-85 of instagram.ts — TOKEN_WARN_DAYS=7, console.warn present |
| 8  | POST /api/instagram/sync fetches from Meta API and upserts into DB, returns JSON with synced count | VERIFIED | sync/route.ts calls fetchFeed + syncToDb, returns { success, data } |
| 9  | POST /api/instagram/refresh-token calls Meta refresh endpoint and returns new token data | VERIFIED | refresh-token/route.ts calls refreshToken(), returns token + expires_at + instructions |
| 10 | Both route handlers use only async Request APIs (Next.js 16 compliant) | VERIFIED | Both use `_request: Request` pattern, no synchronous Request-time API calls |
| 11 | Visiting /admin/instagram-test renders a 3-column grid of cached Instagram posts | VERIFIED | page.tsx: `gridTemplateColumns: 'repeat(3, 1fr)'`, reads from getCachedFeed() |
| 12 | A Sync Now button calls POST /api/instagram/sync and Refresh Token calls POST /api/instagram/refresh-token | VERIFIED | SyncButton.tsx lines 17, 37 — both fetch calls present with correct paths |
| 13 | When DB cache is empty, the page shows an empty state message instead of crashing | VERIFIED | page.tsx lines 26-35 — explicit empty state with instructional text |

**Score:** 13/13 truths verified

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/types/instagram.ts` | 5 exported interfaces | VERIFIED | 5 interfaces: InstagramPost, InstagramFeedResponse, CachedPost, SyncResult, RefreshTokenResult — 46 lines |
| `src/lib/db.ts` | sql re-export from @vercel/postgres | VERIFIED | Single re-export line, no extra code |
| `next.config.ts` | remotePatterns for Instagram CDN | VERIFIED | **.cdninstagram.com + **.fbcdn.net |
| `src/lib/instagram.ts` | 5 exported functions, min 80 lines | VERIFIED | 5 functions, 135 lines |
| `src/app/api/instagram/sync/route.ts` | POST export calling fetchFeed + syncToDb | VERIFIED | 29 lines, imports and calls both functions |
| `src/app/api/instagram/refresh-token/route.ts` | POST export calling refreshToken | VERIFIED | 48 lines, imports and calls refreshToken |
| `src/app/admin/instagram-test/page.tsx` | Server Component, min 50 lines, 3-col grid | VERIFIED | 98 lines, no 'use client', getCachedFeed() called directly |
| `src/app/admin/instagram-test/_components/SyncButton.tsx` | Client component, min 40 lines | VERIFIED | 102 lines, 'use client' present |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| sync/route.ts | src/lib/instagram.ts | `import { fetchFeed, syncToDb, checkTokenExpiry }` | WIRED | Line 1 of route.ts |
| refresh-token/route.ts | src/lib/instagram.ts | `import { refreshToken }` | WIRED | Line 1 of route.ts |
| instagram.ts | src/types/instagram.ts | `import type { CachedPost, InstagramPost, ... }` | WIRED | Lines 2-8 of instagram.ts |
| instagram.ts | src/lib/db.ts | `import { sql } from '@/lib/db'` | WIRED | Line 1 of instagram.ts |
| page.tsx | src/lib/instagram.ts | `import { getCachedFeed } from '@/lib/instagram'` | WIRED | Line 2 of page.tsx |
| SyncButton.tsx | /api/instagram/sync | `fetch('/api/instagram/sync', { method: 'POST' })` | WIRED | Line 17 of SyncButton.tsx |
| SyncButton.tsx | /api/instagram/refresh-token | `fetch('/api/instagram/refresh-token', { method: 'POST' })` | WIRED | Line 37 of SyncButton.tsx |
| page.tsx | SyncButton.tsx | `import { SyncButton } from './_components/SyncButton'` | WIRED | Line 4 of page.tsx; rendered line 24 |

---

## Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| page.tsx | `posts: CachedPost[]` | `getCachedFeed()` — sql SELECT from instagram_feed_cache | Yes — parameterized query with LIMIT 20 | FLOWING |
| page.tsx | `lastSync` | `posts[0]?.fetched_at` — derived from DB rows | Yes — real timestamp column | FLOWING |
| sync/route.ts | `posts` | `fetchFeed(token)` — live Meta Graph API call | Yes — external API, no static fallback | FLOWING |
| sync/route.ts | `result` | `syncToDb(posts)` — sql INSERT/UPDATE with ON CONFLICT | Yes — writes to DB and returns count | FLOWING |
| refresh-token/route.ts | `result` | `refreshToken(token)` — live Meta Graph API call | Yes — external API, returns real token | FLOWING |

No STATIC or DISCONNECTED data sources found. All dynamic data traces to a real DB query or live API call.

---

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| TypeScript compilation | `npx tsc --noEmit` | 0 errors | PASS |
| 5 interfaces in types file | `grep -c "^export interface" src/types/instagram.ts` | 5 | PASS |
| 5 exported functions in instagram.ts | `grep -E "^export (async )?function" src/lib/instagram.ts` | 5 functions | PASS |
| instagram.ts min_lines=80 | `wc -l src/lib/instagram.ts` | 135 lines | PASS |
| page.tsx is Server Component | no 'use client' in page.tsx | absent | PASS |
| SyncButton has 'use client' | grep match | present line 1 | PASS |
| ON CONFLICT upsert present | grep match in instagram.ts | present lines 107-112 | PASS |
| ig_refresh_token grant_type | grep match in instagram.ts | present line 44 | PASS |
| cache: no-store on fetch calls | grep match in instagram.ts | 2 matches (lines 25, 47) | PASS |

---

## Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| INST-01 | 01-01, 01-02, 01-04 | Meta Graph API로 인스타그램 피드 읽어 그리드 렌더링 | SATISFIED | fetchFeed() + getCachedFeed() + 3-col grid in page.tsx; human-approved in 01-05 |
| INST-02 | 01-01, 01-02, 01-03, 01-04 | DB 캐싱으로 API 호출 없이 피드 표시 | SATISFIED | syncToDb() upserts to instagram_feed_cache; page reads getCachedFeed() (DB only); human-approved in 01-05 |
| INST-03 | 01-01, 01-02, 01-03 | 장기 토큰 갱신 로직 동작 | SATISFIED | refreshToken() + checkTokenExpiry() + POST /api/instagram/refresh-token; human-approved in 01-05 |

All three requirement IDs claimed by phase plans are accounted for and satisfied.

**Orphaned requirements check:** REQUIREMENTS.md Traceability table shows INST-04~05 also mapped to Phase 1. However, these are NOT claimed in any plan's `requirements:` frontmatter for this phase and are explicitly out of scope for the spike (D-05: throwaway proof-of-concept). Not flagged as orphaned — their out-of-scope status is documented in the phase context.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| page.tsx | 65 | `📹 Video` emoji placeholder for video posts | Info | Intentional spike behavior — page.tsx uses `.mp4` URL detection to show a placeholder. This is documented in 01-05-SUMMARY.md as a known limitation. Not a stub — it is a deliberate fallback for the spike. |

No blockers. No FIXME/TODO/placeholder text found in implementation files. No empty return statements. No hardcoded empty arrays passed to rendering paths.

---

## Human Verification

Human verification was completed by the user prior to this automated check.

**Result:** APPROVED — documented in 01-05-SUMMARY.md

All three requirements verified manually:
- INST-01: 3-column grid renders Instagram post images from live API data
- INST-02: Cached posts display from DB on page reload without API call
- INST-03: POST /api/instagram/refresh-token returns new access_token and expires_at

---

## Gaps Summary

No gaps. All 13 truths verified, all 8 required artifacts exist and are substantive, all 8 key links are wired, all data flows through to real sources, and human verification was approved.

The phase goal — proving Instagram Basic Display API integration — is fully achieved.

---

_Verified: 2026-03-27_
_Verifier: Claude (gsd-verifier)_
