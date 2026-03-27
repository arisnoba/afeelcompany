---
phase: 02-spike-pdf
plan: "04"
subsystem: ui
tags: [print, css, browser, client-component, window-print]
requires:
  - phase: 02-03
    provides: brochure-route
provides: [print-css, auto-print-launcher, toolbar]
affects: [02-05-PLAN]
tech-stack:
  added: []
  patterns: [route-scoped-print-css, query-param-print-flow]
key-files:
  created:
    - src/app/pdf-export/print.css
    - src/app/pdf-export/_components/AutoPrintOnLoad.tsx
    - src/app/pdf-export/_components/PrintToolbar.tsx
  modified:
    - src/app/pdf-export/layout.tsx
    - src/app/pdf-export/page.tsx
key-decisions:
  - "인쇄 플로우는 `/pdf-export?print=1` 쿼리 파라미터를 기준으로 작동한다."
  - "window.print()는 document.fonts.ready와 brochure img decode 이후에만 호출한다."
  - "screen-only UI는 route-scoped print.css에서 감추고, 브로셔 시트는 물리 단위(mm)로 고정한다."
patterns-established:
  - "PDF 경로의 상호작용 UI는 screen-only 클래스로 표시하고 print media에서 제거한다."
requirements-completed: [PDF-02, PDF-05, PDF-06]
duration: 7min
completed: 2026-03-27
---

# Phase 02 Plan 04: Print Flow Summary

**A4 landscape 전용 print stylesheet와 `?print=1` 기반 auto-print 흐름, 그리고 화면 전용 툴바를 연결했다**

## Accomplishments

- [`src/app/pdf-export/print.css`](/Users/arisnoba/Documents/GitHub/afeelcompany/src/app/pdf-export/print.css)에 `@page { size: A4 landscape; }`, `.screen-only`, `.avoid-break` 등 브로셔 전용 인쇄 규칙을 정의했다.
- [`src/app/pdf-export/layout.tsx`](/Users/arisnoba/Documents/GitHub/afeelcompany/src/app/pdf-export/layout.tsx)에서 `./print.css`를 import해 PDF 라우트 안에서만 인쇄 스타일이 적용되도록 했다.
- [`src/app/pdf-export/_components/AutoPrintOnLoad.tsx`](/Users/arisnoba/Documents/GitHub/afeelcompany/src/app/pdf-export/_components/AutoPrintOnLoad.tsx)는 `document.fonts.ready`, `img.decode()`, `window.print()` 순서로 자동 인쇄를 실행한다.
- [`src/app/pdf-export/_components/PrintToolbar.tsx`](/Users/arisnoba/Documents/GitHub/afeelcompany/src/app/pdf-export/_components/PrintToolbar.tsx)에 `다운로드`, `인쇄 미리보기` 액션을 추가했고 페이지 상단에 연결했다.

## Verification

- `npm run build`
- `grep -n "size: A4 landscape" src/app/pdf-export/print.css`
- `grep -n "window.print()" src/app/pdf-export/_components/AutoPrintOnLoad.tsx`
- `grep -n "/pdf-export?print=1" src/app/pdf-export/_components/PrintToolbar.tsx`

## Issues Encountered

None

## Next Phase Readiness

자동 검증은 완료되었고, 남은 일은 Plan 05의 Chrome/Safari 수동 출력 확인뿐이다.
