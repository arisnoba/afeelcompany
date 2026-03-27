---
phase: 04-public-site
plan: "02"
subsystem: ui
tags: [layout, home, about, metadata, route-group]
requires:
  - phase: 04-01
    provides: site-read-models
provides: [public-layout, home-page, about-page, site-header, site-footer]
affects: [04-03-PLAN, 04-04-PLAN, 04-05-PLAN]
tech-stack:
  added: []
  patterns: [public-route-group, shared-shell, editorial-hero]
key-files:
  created:
    - src/app/(public)/layout.tsx
    - src/app/(public)/page.tsx
    - src/app/(public)/about/page.tsx
    - src/components/site/SiteHeader.tsx
    - src/components/site/SiteFooter.tsx
    - src/components/site/PortfolioPreviewGrid.tsx
    - src/components/site/BrandLogoGrid.tsx
  modified:
    - src/app/layout.tsx
  deleted:
    - src/app/page.tsx
key-decisions:
  - "공개 사이트는 `(public)` route group으로 분리해 admin/pdf 레이아웃과 섞이지 않게 했다."
  - "루트 메타데이터와 `lang` 값을 scaffold 기본값에서 실제 사이트 정보로 교체했다."
  - "패션 PR 톤에 맞게 에디토리얼 성향의 밝은 배경 + 강한 대비 레이아웃을 사용했다."
patterns-established:
  - "공개 페이지 공통 shell은 `src/app/(public)/layout.tsx`에서 처리한다."
  - "HOME/ABOUT의 카드형 섹션은 반투명 패널 + 둥근 보더 반경 패턴으로 통일한다."
requirements-completed: [SITE-01, SITE-02, SITE-07, SITE-08]
duration: 18min
completed: 2026-03-27
---

# Phase 04 Plan 02: Public Shell Summary

**스캐폴드 루트를 실제 공개 사이트 셸로 교체하고 HOME과 ABOUT을 실데이터 기반 페이지로 연결했다**

## Accomplishments

- `src/app/layout.tsx`의 제목/설명/lang을 실제 서비스 값으로 바꿨다.
- `src/app/(public)/layout.tsx`를 추가해 공개 사이트 전용 헤더/푸터 shell을 만들었다.
- HOME에 히어로와 최신 포트폴리오 미리보기를, ABOUT에 회사 소개와 브랜드 로고 그리드를 연결했다.

## Verification

- `npm run build`
- `grep -n "AFEEL Company" src/app/(public)/page.tsx`
- `grep -n "회사 소개" src/app/(public)/about/page.tsx`
- `grep -n "INSTAGRAM FEED" src/components/site/SiteFooter.tsx`

## Issues Encountered

None

## Next Phase Readiness

공개 네비게이션과 푸터가 준비되어 있어 PORTFOLIO, FEED, CONTACT 페이지를 같은 shell 아래에서 바로 붙일 수 있다.
