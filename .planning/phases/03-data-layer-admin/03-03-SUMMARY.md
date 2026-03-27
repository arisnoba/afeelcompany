# 03-03 Summary

## 결과

- `/api/portfolio`, `/api/portfolio/[id]`, `/api/portfolio/reorder`를 추가했다.
- `/admin/portfolio`와 `PortfolioTable`로 인라인 관리 화면을 만들었다.
- 포트폴리오 목록, 수정, 웹/PDF 토글, 정렬 저장, 삭제를 하나의 흐름으로 연결했다.

## 구현 메모

- 목록은 `sort_order ASC, created_at DESC` 기준으로 정렬한다.
- 삭제 시 `@vercel/blob`의 `del()`로 Blob 자산을 먼저 정리한 뒤 DB row를 제거한다.
- 관리 화면은 DB snake_case 필드를 `brandName`, `showOnWeb`, `showOnPdf`, `sortOrder` 형태로 매핑해 다룬다.

## 검증

- `npm run build` 통과
