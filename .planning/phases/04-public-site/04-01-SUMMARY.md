---
phase: 04-public-site
plan: "01"
subsystem: ui
tags: [nextjs, postgres, public-site, app-router, data-loader]
requires:
  - phase: 03-data-layer-admin
    provides: public-content-tables
provides: [site-types, public-sql-loaders]
affects: [04-02-PLAN, 04-03-PLAN, 04-04-PLAN]
tech-stack:
  added: []
  patterns: [direct-public-sql-reads, site-read-models]
key-files:
  created:
    - src/types/site.ts
    - src/lib/site.ts
  modified: []
key-decisions:
  - "공개 페이지는 관리자 API를 거치지 않고 Postgres를 직접 읽는다."
  - "포트폴리오 공개 데이터는 `show_on_web = true`로 필터링한다."
  - "공개 페이지가 사용하는 데이터 shape는 `src/types/site.ts`로 분리한다."
patterns-established:
  - "공개 페이지 공용 데이터는 `src/lib/site.ts`에서 camelCase read model로 제공한다."
requirements-completed: [SITE-01, SITE-02, SITE-03, SITE-05, SITE-06]
duration: 8min
completed: 2026-03-27
---

# Phase 04 Plan 01: Public Data Layer Summary

**공개 사이트가 공용으로 사용하는 회사 정보, 브랜드, 포트폴리오 read model과 SQL 로더를 분리했다**

## Accomplishments

- `src/types/site.ts`에 공개 페이지 전용 타입을 추가했다.
- `src/lib/site.ts`에 회사 프로필, 활성 브랜드, 공개 포트폴리오 목록/미리보기 로더를 구현했다.
- 관리자 인증이 걸린 `/api/*` 대신 서버 컴포넌트가 직접 재사용할 수 있는 안전한 데이터 경로를 만들었다.

## Verification

- `npm run build`
- `grep -n "getSiteCompanyProfile" src/lib/site.ts`
- `grep -n "WHERE show_on_web = true" src/lib/site.ts`
- `grep -n "WHERE is_active = true" src/lib/site.ts`

## Issues Encountered

None

## Next Phase Readiness

공개 레이아웃과 각 페이지는 이제 `src/lib/site.ts`만 import하면 공통 데이터를 바로 사용할 수 있다.
