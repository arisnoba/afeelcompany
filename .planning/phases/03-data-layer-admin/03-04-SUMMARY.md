# 03-04 Summary

## 결과

- `/api/company-profile` 단일 row CRUD를 추가했다.
- `/api/client-brands`, `/api/client-brands/[id]`로 브랜드 생성/수정/삭제를 연결했다.
- `/admin/profile`에 회사 프로필 편집과 브랜드 관리 UI를 붙였다.

## 구현 메모

- 회사 프로필은 `company_profile` 최신 row를 singleton처럼 사용하고, 있으면 update 없으면 insert 한다.
- 브랜드 로고는 기존 업로드 헬퍼를 재사용해 `brands/*` 경로로 저장한다.
- `/pdf-export`가 읽는 `about_text`, `contact_email`, `contact_phone`, `address`, `client_brands` 데이터를 관리자 화면에서 바로 갱신할 수 있게 했다.

## 검증

- `npm run build` 통과
