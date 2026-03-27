# 03-02 Summary

## 결과

- `src/lib/blob.ts`에 공용 이미지 업로드 헬퍼를 추가했다.
- `src/lib/image.ts`에 클라이언트 리사이즈 유틸을 추가했다.
- `src/types/portfolio.ts`로 포트폴리오 카테고리와 레코드 타입을 정리했다.
- `/api/upload`와 `/admin/upload`를 연결해 인증된 업로드 플로우를 만들었다.
- `next.config.ts`에 Vercel Blob 이미지 호스트를 추가했다.

## 구현 메모

- 서버 업로드는 MIME(`jpeg/png/webp`)와 4.5MB 크기를 먼저 검증한다.
- 브라우저에서는 최대 2000px, JPEG 품질 `0.8`로 리사이즈한 뒤 `multipart/form-data`로 전송한다.
- 업로드 성공 시 `portfolio_items`에 `image_url`, `thumbnail_url`, `show_on_web`, `show_on_pdf`, `sort_order`를 함께 기록한다.

## 검증

- `npm run build` 통과
