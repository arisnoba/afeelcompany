---
phase: 02-spike-pdf
plan: "03"
subsystem: ui
tags: [app-router, server-component, brochure, print-layout]
requires:
  - phase: 02-02
    provides: brochure-loader
provides: [pdf-export-route, brochure-sheet-component]
affects: [02-04-PLAN, 02-05-PLAN]
tech-stack:
  added: []
  patterns: [dynamic-server-route, explicit-sheet-composition]
key-files:
  created:
    - src/app/pdf-export/page.tsx
    - src/app/pdf-export/_components/BrochureSheet.tsx
  modified: []
key-decisions:
  - "브로셔 페이지는 sectionOrder를 다시 추론하지 않고 요구된 5개 섹션을 명시적으로 렌더링한다."
  - "인쇄 신뢰성을 우선해 next/image 대신 명시적 fallback을 가진 img 기반 렌더링을 사용했다."
patterns-established:
  - "각 섹션은 BrochureSheet로 감싸고 print hook은 class/data attribute로 연결한다."
requirements-completed: [PDF-01, PDF-03, PDF-04]
duration: 8min
completed: 2026-03-27
---

# Phase 02 Plan 03: Brochure Route Summary

**`/pdf-export`가 cover, ABOUT, WORK, CLIENT, CONTACT 순서의 브로셔 시트를 동적 서버 라우트로 렌더링하도록 만들었다**

## Accomplishments

- [`src/app/pdf-export/_components/BrochureSheet.tsx`](/Users/arisnoba/Documents/GitHub/afeelcompany/src/app/pdf-export/_components/BrochureSheet.tsx)에서 `data-section`, `pdf-sheet` 클래스를 가진 시트 래퍼를 만들었다.
- [`src/app/pdf-export/page.tsx`](/Users/arisnoba/Documents/GitHub/afeelcompany/src/app/pdf-export/page.tsx)에서 `export const dynamic = 'force-dynamic'`와 `await getPdfDocument()`를 사용해 브로셔 라우트를 구성했다.
- WORK는 `brochure.workItems.slice(0, 4)`로 이미지 타일을 만들고, CLIENT는 로고 그리드를, CONTACT는 한글 라벨을 포함한 연락처 블록을 렌더링한다.
- 이미지 경로가 비어 있으면 `IMAGE MISSING` fallback 박스를 출력해 인쇄 레이아웃이 무너지지 않게 했다.

## Verification

- `npm run build`
- `grep -n "ABOUT" src/app/pdf-export/page.tsx`
- `grep -n "CONTACT" src/app/pdf-export/page.tsx`
- `grep -n "workItems.slice(0, 4)" src/app/pdf-export/page.tsx`

## Issues Encountered

None

## Next Phase Readiness

Plan 04에서 print stylesheet와 auto-print launcher를 얹을 수 있는 구조적 훅이 모두 준비되었다.
