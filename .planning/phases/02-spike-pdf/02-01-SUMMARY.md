---
phase: 02-spike-pdf
plan: "01"
subsystem: pdf
tags: [next.js, pdf, fixtures, next-font, raster-assets]
requires: []
provides: [pdf-types, pdf-fixtures, pdf-route-font]
affects: [02-02-PLAN, 02-03-PLAN, 02-04-PLAN]
tech-stack:
  added: []
  patterns: [route-local-font, fixture-first-spike]
key-files:
  created:
    - src/types/pdf.ts
    - src/app/pdf-export/_lib/pdf-fixtures.ts
    - src/app/pdf-export/layout.tsx
    - public/pdf-fixtures/cover-hero.png
    - public/pdf-fixtures/work-01.png
    - public/pdf-fixtures/work-02.png
    - public/pdf-fixtures/work-03.png
    - public/pdf-fixtures/work-04.png
    - public/pdf-fixtures/logo-01.png
    - public/pdf-fixtures/logo-02.png
  modified: []
key-decisions:
  - "PDF spike는 Phase 3 이전에도 실행 가능해야 하므로 브로셔 계약과 fixture 데이터를 먼저 고정했다."
  - "브로셔 라우트에는 전역 Geist 대신 nested layout + Noto_Sans_KR을 적용해 한글 출력 경로를 분리했다."
patterns-established:
  - "PDF 관련 타입은 src/types/pdf.ts에 모아 이후 관리자/데이터 레이어와 공유한다."
  - "브로셔 fixture 이미지는 docs/ PDF에서 추출한 실제 PNG를 public/pdf-fixtures/에 둔다."
requirements-completed: [PDF-01, PDF-03, PDF-04]
duration: 9min
completed: 2026-03-27
---

# Phase 02 Plan 01: PDF Foundations Summary

**브로셔 타입 계약, 체크인된 fixture 데이터, 그리고 한글 안전 폰트를 갖춘 `/pdf-export` 라우트 기반을 만들었다**

## Accomplishments

- [`src/types/pdf.ts`](/Users/arisnoba/Documents/GitHub/afeelcompany/src/types/pdf.ts)에 `cover -> about -> work -> client -> contact` 순서를 포함한 브로셔 계약을 정의했다.
- [`src/app/pdf-export/_lib/pdf-fixtures.ts`](/Users/arisnoba/Documents/GitHub/afeelcompany/src/app/pdf-export/_lib/pdf-fixtures.ts)에 소개 문구, 연락처, 작업 4개, 브랜드 2개가 포함된 fixture 문서를 추가했다.
- [`src/app/pdf-export/layout.tsx`](/Users/arisnoba/Documents/GitHub/afeelcompany/src/app/pdf-export/layout.tsx)에 `Noto_Sans_KR` 기반 nested layout을 추가해 PDF 라우트만 별도 폰트를 사용하도록 분리했다.
- [`public/pdf-fixtures`](/Users/arisnoba/Documents/GitHub/afeelcompany/public/pdf-fixtures)에 PDF 참고 문서에서 추출한 실제 PNG fixture를 배치했다.

## Verification

- `test -f public/pdf-fixtures/cover-hero.png`
- `test -f public/pdf-fixtures/work-01.png`
- `test -f public/pdf-fixtures/logo-01.png`
- `npm run build`

## Issues Encountered

None

## Next Phase Readiness

Plan 02에서 DB-first loader를 붙일 수 있는 타입/fixture/폰트 기반이 준비되었다.
