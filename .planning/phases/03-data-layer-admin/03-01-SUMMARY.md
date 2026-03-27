# 03-01 Summary

## 결과

- `src/lib/auth.ts`에 `ADMIN_PASSWORD` 기반 서명 쿠키 인증 헬퍼를 추가했다.
- 보호 레이아웃 `src/app/admin/layout.tsx`가 모든 `/admin` 요청에서 세션을 검사하도록 연결했다.
- 로그인/로그아웃 API (`/api/auth/login`, `/api/auth/logout`)를 만들었다.
- `/admin` 대시보드와 `/admin/login` 진입 화면을 추가했다.

## 구현 메모

- 세션 쿠키 이름은 `afeel_admin_session`으로 고정했다.
- 쿠키는 7일 만료, `httpOnly`, `sameSite: 'lax'`, production secure 옵션으로 설정한다.
- `/admin/login`은 Next App Router 레이아웃 적용 범위를 고려해 별도 route group `src/app/(admin-auth)/admin/login/page.tsx`에 두고, 보호 레이아웃은 `src/app/admin/layout.tsx`에 유지했다.
- `/admin` 보호가 정적 생성으로 굳지 않도록 `src/app/admin/layout.tsx`에 `dynamic = 'force-dynamic'`를 명시했다.

## 검증

- `npm run build` 통과
