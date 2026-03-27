---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Ready to plan
last_updated: "2026-03-27T03:54:46.547Z"
progress:
  total_phases: 6
  completed_phases: 2
  total_plans: 11
  completed_plans: 6
---

# Project State: AFEEL Company Site (MVP)

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-26)

**Core value:** 원소스 멀티유즈 — 한 번 업로드로 웹 갤러리 · 인스타그램 · PDF 소개서 모두 반영
**Current focus:** Phase 01 — instagram-api-spike

## Current Milestone

**v1.0 — MVP Launch**

### Progress [███████░░░] 67%

| Phase | Name | Status | Requirements |
|-------|------|--------|--------------|
| 0 | 프로젝트 스캐폴딩 | **Not Started** | SCAF-01~07 |
| 1 | Spike — 인스타 API 검증 | In Progress (Plan 4/4) | INST-01~05 |
| 2 | Spike — PDF 출력 검증 | Not Started | PDF-01~06 |
| 3 | 데이터 레이어 + 관리자 | Not Started | AUTH, UPLD, PORT, PROF |
| 4 | 공개 사이트 | Not Started | SITE-01~08 |
| 5 | 통합 + 런칭 | Not Started | LNCH-01~06 |

### Active Phase

**Phase 01: Spike — 인스타 API 검증**

- Status: In Progress
- Goal: Meta Graph API 피드 읽기 + DB 캐싱 + 토큰 갱신 동작 검증
- Current Plan: 01-04 (complete) → Phase 01 complete

## Decisions

| Phase | Decision |
|-------|----------|
| 01-01 | CachedPost mirrors schema.sql instagram_feed_cache DDL exactly; thumbnail_url is API-only not persisted |
| 01-01 | remotePatterns uses **.cdninstagram.com double-star glob; **.fbcdn.net added as Facebook CDN fallback |
| 01-02 | syncToDb only writes columns present in schema.sql; thumbnail_url/media_type not stored in DB |
| 01-02 | VIDEO posts use thumbnail_url as media_url fallback before DB write (Pitfall 3) |
| 01-02 | checkTokenExpiry warns only at <=7 days; no auto-refresh (D-12) |

- [Phase 01-03]: Both API routes read INSTAGRAM_ACCESS_TOKEN from env var only; POST semantics for trigger endpoints; refresh-token returns operator instructions for manual Vercel dashboard update
- [Phase 01-04]: export const dynamic = 'force-dynamic' required on DB-dependent pages to prevent build-time pre-rendering failures

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 01-instagram-api-spike | 01 | 2min | 2 | 3 |
| 01-instagram-api-spike | 02 | 2min | 2 | 1 |
| Phase 01-instagram-api-spike P03 | 1min | 2 tasks | 2 files |
| Phase 01-instagram-api-spike P04 | 8min | 1 tasks | 2 files |

## Session Context

- Last session: 2026-03-27
- Stopped at: Completed 01-04-PLAN.md
- Last action: Created /admin/instagram-test spike UI — Server Component grid page + SyncButton client component

## Blockers

None

---
*Last updated: 2026-03-27*
