---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Ready to plan
last_updated: "2026-03-27T10:05:00.000Z"
progress:
  total_phases: 6
  completed_phases: 4
  total_plans: 17
  completed_plans: 17
---

# Project State: AFEEL Company Site (MVP)

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-26)

**Core value:** 원소스 멀티유즈 — 한 번 업로드로 웹 갤러리 · 인스타그램 · PDF 소개서 모두 반영
**Current focus:** Phase 04 — 공개 사이트

## Current Milestone

**v1.0 — MVP Launch**

### Progress [██████████] 100%

| Phase | Name | Status | Requirements |
|-------|------|--------|--------------|
| 0 | 프로젝트 스캐폴딩 | Complete | SCAF-01~07 |
| 1 | Spike — 인스타 API 검증 | Complete (Plan 5/5) | INST-01~05 |
| 2 | Spike — PDF 출력 검증 | Complete (Plan 5/5) | PDF-01~06 |
| 3 | 데이터 레이어 + 관리자 | Complete (Plan 6/6) | AUTH, UPLD, PORT, PROF, INST |
| 4 | 공개 사이트 | Not Started | SITE-01~08 |
| 5 | 통합 + 런칭 | Not Started | LNCH-01~06 |

### Active Phase

**Phase 04: 공개 사이트**

- Status: Ready to plan
- Goal: 방문자용 공개 사이트를 실데이터 기반으로 구현
- Current Plan: none

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
- [Phase 03-01]: `/admin/login`은 App Router 레이아웃 충돌을 피하기 위해 별도 route group에 두고, 보호 경계는 `src/app/admin/layout.tsx`에서 유지한다
- [Phase 03-02]: 관리자 이미지 업로드는 클라이언트 리사이즈(2000px, JPEG 0.8) 후 Blob server upload로 고정했다
- [Phase 03-03]: 포트폴리오 편집은 인라인 테이블 방식으로 구현하고 정렬 저장은 `/api/portfolio/reorder`에서 일괄 반영한다
- [Phase 03-04]: `company_profile`은 singleton row 전략으로 유지하고 브랜드 로고는 `brands/*` Blob 경로를 재사용한다
- [Phase 03-05]: Instagram 게시 플로우는 `draft -> pending -> published/failed` 상태 전이를 DB에 기록한다
- [Phase 03-06]: 원격 Google font 의존성을 제거해 현재 환경에서도 `npm run build`가 안정적으로 재현되도록 조정했다
- [Phase 03-06]: 사용자 수동 검증에서 로그인, 업로드, 포트폴리오 관리, 프로필/브랜드, PDF 반영, 인스타 큐 게시가 모두 성공해 Phase 03을 승인했다

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
- Stopped at: Completed and approved Phase 03 after human admin checkpoint
- Last action: Advanced project focus to Phase 04 planning

## Blockers

None

---
*Last updated: 2026-03-27*
