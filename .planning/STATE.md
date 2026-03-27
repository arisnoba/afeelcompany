---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Ready to execute
last_updated: "2026-03-27T04:38:02.658Z"
progress:
  total_phases: 6
  completed_phases: 3
  total_plans: 17
  completed_plans: 11
---

# Project State: AFEEL Company Site (MVP)

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-26)

**Core value:** 원소스 멀티유즈 — 한 번 업로드로 웹 갤러리 · 인스타그램 · PDF 소개서 모두 반영
**Current focus:** Phase 03 — 데이터 레이어 + 관리자 페이지

## Current Milestone

**v1.0 — MVP Launch**

### Progress [███████░░░] 65%

| Phase | Name | Status | Requirements |
|-------|------|--------|--------------|
| 0 | 프로젝트 스캐폴딩 | Complete | SCAF-01~07 |
| 1 | Spike — 인스타 API 검증 | Complete (Plan 5/5) | INST-01~05 |
| 2 | Spike — PDF 출력 검증 | Complete (Plan 5/5) | PDF-01~06 |
| 3 | 데이터 레이어 + 관리자 | Planned (Plan 0/6) | AUTH, UPLD, PORT, PROF |
| 4 | 공개 사이트 | Not Started | SITE-01~08 |
| 5 | 통합 + 런칭 | Not Started | LNCH-01~06 |

### Active Phase

**Phase 03: 데이터 레이어 + 관리자 페이지**

- Status: Ready to execute
- Goal: 관리자 인증, 업로드, 포트폴리오 관리, 회사 프로필 편집 백엔드 구현
- Current Plan: 03-01 (ready)

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
- [Phase 02-02]: PDF brochure data loads from DB first, but always falls back to checked-in fixtures when rows are missing or queries fail
- [Phase 02-03]: `/pdf-export` renders explicit brochure sheets in fixed order instead of deriving page order dynamically
- [Phase 02-04]: Browser print flow is driven by `/pdf-export?print=1` and waits for fonts plus brochure images before calling `window.print()`
- [Phase 02-05]: Chrome와 Safari 수동 검증을 완료했고 브라우저 인쇄 접근을 MVP 유지안으로 승인했다

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 01-instagram-api-spike | 01 | 2min | 2 | 3 |
| 01-instagram-api-spike | 02 | 2min | 2 | 1 |
| Phase 01-instagram-api-spike P03 | 1min | 2 tasks | 2 files |
| Phase 01-instagram-api-spike P04 | 8min | 1 tasks | 2 files |
| Phase 02-spike-pdf P01 | 9min | 2 tasks | 10 files |
| Phase 02-spike-pdf P02 | 5min | 1 tasks | 1 files |
| Phase 02-spike-pdf P03 | 8min | 2 tasks | 2 files |
| Phase 02-spike-pdf P04 | 7min | 2 tasks | 5 files |
| Phase 02-spike-pdf P05 | 3min | 2 tasks | 4 files |

## Session Context

- Last session: 2026-03-27
- Stopped at: Planned Phase 03 into 6 executable feature slices
- Last action: Created Phase 03 research, validation, and 03-01~03-06 plan set

## Blockers

None

---
*Last updated: 2026-03-27*
