---
phase: 02-spike-pdf
plan: "02"
subsystem: database
tags: [postgres, fallback, server, pdf]
requires:
  - phase: 02-01
    provides: pdf-types-and-fixtures
provides: [getPdfDocument-loader]
affects: [02-03-PLAN]
tech-stack:
  added: []
  patterns: [db-first-fallback, schema-to-view-model]
key-files:
  created:
    - src/app/pdf-export/_lib/get-pdf-document.ts
  modified: []
key-decisions:
  - "브로셔 로더는 쿼리 실패 또는 포트폴리오 0건일 때 무조건 fixture 문서를 반환한다."
  - "sectionOrder는 DB의 pdf_sections 상태와 무관하게 spike 요구사항의 고정 순서를 유지한다."
patterns-established:
  - "snake_case DB row를 camelCase PdfDocument로 매핑한 뒤 페이지는 이 뷰 모델만 소비한다."
requirements-completed: [PDF-01, PDF-03]
duration: 5min
completed: 2026-03-27
---

# Phase 02 Plan 02: Brochure Loader Summary

**실제 DB 스키마를 읽되 데이터가 없거나 실패하면 fixture로 즉시 떨어지는 `getPdfDocument()` 로더를 추가했다**

## Accomplishments

- [`src/app/pdf-export/_lib/get-pdf-document.ts`](/Users/arisnoba/Documents/GitHub/afeelcompany/src/app/pdf-export/_lib/get-pdf-document.ts)에 `company_profile`, `portfolio_items`, `client_brands`를 읽는 단일 로더를 구현했다.
- `brand_name -> brandName`, `thumbnail_url -> thumbnailUrl`, `sort_order -> sortOrder` 등 브로셔 전용 매핑을 고정했다.
- DB 쿼리 예외 또는 `portfolio_items` 0건일 때 `pdfFixtureDocument`를 반환해 로컬 스파이크가 끊기지 않도록 했다.

## Verification

- `npm run build`
- `grep -n "return pdfFixtureDocument" src/app/pdf-export/_lib/get-pdf-document.ts`
- `grep -n "FROM portfolio_items" src/app/pdf-export/_lib/get-pdf-document.ts`

## Issues Encountered

None

## Next Phase Readiness

Plan 03의 `/pdf-export` 페이지는 fixture와 실데이터를 구분하지 않고 `PdfDocument` 하나만 받아 렌더링할 수 있다.
