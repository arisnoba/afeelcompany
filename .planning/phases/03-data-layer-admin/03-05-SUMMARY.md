# 03-05 Summary

## 결과

- `src/lib/instagram.ts`에 `createMediaContainer`, `publishMediaContainer`를 추가했다.
- `/api/instagram/queue`, `/api/instagram/publish/[id]`를 만들어 큐 생성/게시 흐름을 연결했다.
- `/admin/instagram`와 `InstagramQueueTable`로 draft/pending/published/failed 상태를 관리하는 UI를 만들었다.

## 구현 메모

- 게시 요청은 `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID` 환경변수만 읽는다.
- publish 시도 전에 `pending`, 성공 시 `published`, 실패 시 `failed`로 DB 상태를 갱신한다.
- 큐 생성은 같은 `portfolio_item_id`가 이미 있으면 새 row를 늘리지 않고 draft 상태로 갱신한다.

## 검증

- `npm run build` 통과
