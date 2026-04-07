# Vercel 클라이언트 인수인계 체크리스트

## 목적

- 현재 프로젝트를 내 계정에서 운영하다가, 나중에 클라이언트 계정으로 안전하게 넘길 때 필요한 절차를 한 문서에 정리한다.
- 현재 기준으로는 클라이언트 `Vercel 팀`이 없으므로, `Vercel 프로젝트 Transfer` 기능에 바로 의존하지 않는다.
- 기본 인수인계 전략은 `클라이언트 계정에 새 프로젝트를 만들고 재연결하는 방식`으로 잡는다.

## 핵심 판단

- 클라이언트가 `Vercel 팀`을 만들기 전에는 Vercel의 프로젝트 이전 기능을 실무 기본안으로 삼지 않는다.
- 인수인계는 아래 2개를 분리해서 본다.
  - `Git 저장소 소유권 이전`
  - `Vercel 프로젝트/도메인/환경변수/스토리지 재구성`
- 가장 안전한 방식은 `클라이언트 Git 저장소`와 `클라이언트 Vercel 프로젝트`를 새로 만들고, 필요한 설정과 데이터를 옮긴 뒤 DNS를 전환하는 것이다.

## 이 저장소에서 실제로 확인한 이전 대상

### 배포/호스팅

- Vercel 프로젝트
- 커스텀 도메인
- 환경변수

### 외부 연동

- Neon 계열 Postgres 연결
  - `DATABASE_URL`
  - `DATABASE_URL_UNPOOLED`
  - `POSTGRES_URL`
  - `POSTGRES_URL_NON_POOLING`
  - `POSTGRES_USER`
  - `POSTGRES_HOST`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DATABASE`
  - `POSTGRES_URL_NO_SSL`
  - `POSTGRES_PRISMA_URL`
- Vercel Blob
  - `BLOB_READ_WRITE_TOKEN`
- Resend
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
- Google Maps
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Instagram 연동
  - `INSTAGRAM_APP_ID`
  - `INSTAGRAM_APP_SECRET`
  - `INSTAGRAM_ACCESS_TOKEN`
  - `INSTAGRAM_USER_ID`
- 관리자 인증
  - `ADMIN_PASSWORD`
  - `ADMIN_SESSION_SECRET`

## 인수인계 전 원칙

- 실제 키 값은 문서나 Git에 남기지 않는다.
- 인수인계 문서에는 `항목 이름`, `발급 위치`, `재설정 필요 여부`만 남긴다.
- DNS 전환 전까지는 기존 프로젝트를 삭제하지 않는다.
- Blob, 메일, 지도, Instagram처럼 외부 서비스 계정 소유권이 얽힌 항목은 먼저 `누가 소유할지` 정한다.

## 사전 준비 체크리스트

- [ ] 클라이언트 명의의 GitHub 계정 또는 Organization 준비
- [ ] 클라이언트 명의의 Vercel 계정 준비
- [ ] 가능하면 클라이언트 명의의 Vercel Team 생성
- [ ] 클라이언트 명의의 도메인 관리 권한 확인
- [ ] 클라이언트 명의 또는 공동 관리 방식으로 외부 서비스 소유권 정리
  - Neon
  - Resend
  - Google Maps
  - Meta/Instagram
- [ ] 현재 운영 도메인의 DNS 수정 권한자 확인
- [ ] 최종 전환 날짜와 롤백 가능 시간대 합의

## Git 저장소 인수인계 체크리스트

- [ ] 클라이언트 Git 저장소 생성
- [ ] 현재 저장소를 클라이언트 저장소로 이전하거나 미러링
- [ ] 브랜치 보호 규칙이 필요하면 먼저 설정
- [ ] 클라이언트를 저장소 Owner 또는 Admin으로 지정
- [ ] 배포에 필요한 브랜치 이름 확인
  - 예: `main`
- [ ] README 또는 별도 운영 문서에 실행 방법 명시
  - `npm install`
  - `npm run dev`
  - `npm run build`

## Vercel 재구성 체크리스트

### 1. 프로젝트 생성

- [ ] 클라이언트 Vercel에서 새 프로젝트 생성
- [ ] 클라이언트 Git 저장소 연결
- [ ] Production Branch 확인
- [ ] Node/Framework 자동 감지가 정상인지 확인

### 2. 환경변수 이관

- [ ] Production / Preview / Development 환경별 변수 구분해서 등록
- [ ] 아래 변수 누락 없이 재등록
  - `ADMIN_PASSWORD`
  - `ADMIN_SESSION_SECRET`
  - `INSTAGRAM_APP_ID`
  - `INSTAGRAM_APP_SECRET`
  - `INSTAGRAM_ACCESS_TOKEN`
  - `INSTAGRAM_USER_ID`
  - `DATABASE_URL`
  - `DATABASE_URL_UNPOOLED`
  - `PGHOST`
  - `PGHOST_UNPOOLED`
  - `PGUSER`
  - `PGDATABASE`
  - `PGPASSWORD`
  - `POSTGRES_URL`
  - `POSTGRES_URL_NON_POOLING`
  - `POSTGRES_USER`
  - `POSTGRES_HOST`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DATABASE`
  - `POSTGRES_URL_NO_SSL`
  - `POSTGRES_PRISMA_URL`
  - `BLOB_READ_WRITE_TOKEN`
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
- [ ] 환경변수 등록 후 첫 배포 다시 실행

### 3. 데이터베이스

- [ ] 현재 운영 DB를 계속 사용할지, 클라이언트 명의 DB로 옮길지 결정
- [ ] 계속 사용 시
  - [ ] 클라이언트 운영 기간 동안 접근 권한과 비용 부담 주체 문서화
- [ ] 이전 시
  - [ ] 스키마 백업
  - [ ] 데이터 덤프 백업
  - [ ] 신규 DB 생성
  - [ ] 데이터 복원
  - [ ] 새 접속 문자열로 환경변수 교체
- [ ] 관리자 화면의 조회/저장/삭제 동작 확인

### 4. Blob 스토리지

- [ ] 현재 Blob을 계속 사용할지, 클라이언트 명의 Blob으로 옮길지 결정
- [ ] 계속 사용 시
  - [ ] 비용 및 삭제 권한 주체 문서화
- [ ] 이전 시
  - [ ] 기존 업로드 파일 목록 백업
  - [ ] 신규 Blob 저장소 준비
  - [ ] 파일 마이그레이션
  - [ ] `BLOB_READ_WRITE_TOKEN` 교체
- [ ] 관리자 로고/포트폴리오 업로드와 삭제 확인

### 5. 메일 발송

- [ ] Resend 계정 소유권 확인
- [ ] 발신 도메인 검증 상태 확인
- [ ] `RESEND_FROM_EMAIL`이 새 계정에서도 사용 가능한지 확인
- [ ] 문의 폼 발송 테스트

### 6. Instagram 연동

- [ ] Meta 앱 소유권과 운영 주체 확인
- [ ] `INSTAGRAM_ACCESS_TOKEN` 만료일 확인
- [ ] 토큰 재발급 절차를 운영 문서에 남김
- [ ] 관리자에서 수동 동기화 테스트

### 7. 도메인 전환

- [ ] 클라이언트 프로젝트에 도메인 연결
- [ ] 필요한 DNS 레코드 값 확인
- [ ] TTL을 미리 낮출 수 있으면 조정
- [ ] 전환 직전 기존 프로젝트의 도메인 설정 화면 캡처 또는 기록
- [ ] DNS 변경 후 인증서 발급 완료 확인
- [ ] `www`/루트 도메인/리다이렉트 정책 확인

## 전환 당일 체크리스트

- [ ] 기존 프로젝트 최신 배포 상태 확인
- [ ] DB 백업 최신본 확보
- [ ] Blob 파일 백업 또는 동기화 완료
- [ ] 클라이언트 프로젝트에서 Production 배포 성공 확인
- [ ] 프리뷰가 아닌 실제 프로덕션 URL에서 수동 점검
- [ ] DNS 전환
- [ ] 전환 직후 주요 기능 점검
  - [ ] 메인 페이지 진입
  - [ ] 관리자 로그인
  - [ ] 관리자 저장 동작
  - [ ] 이미지 업로드
  - [ ] 이미지 삭제
  - [ ] 문의 메일 발송
  - [ ] 연락처 지도 표시
  - [ ] Instagram 수동 동기화

## 전환 후 체크리스트

- [ ] 클라이언트 계정에서 최근 배포 재실행 가능한지 확인
- [ ] 클라이언트 계정에서 환경변수 수정 권한 확인
- [ ] 클라이언트 계정에서 도메인 설정 접근 가능 여부 확인
- [ ] 운영 연락처와 장애 대응 담당자 문서화
- [ ] 토큰 만료성 자원 정리
  - [ ] Instagram Access Token
  - [ ] Resend API Key
  - [ ] Google Maps 결제 계정
- [ ] 구 프로젝트는 최소 며칠 유지 후 정리

## 롤백 기준

- 아래 중 하나라도 실패하면 DNS를 원복하거나 기존 프로젝트를 유지한다.
  - 관리자 로그인 실패
  - 관리자 저장 실패
  - 이미지 업로드/삭제 실패
  - 문의 메일 발송 실패
  - 도메인 HTTPS 인증 실패

## 운영 메모

- 이 프로젝트는 Blob, DB, 메일, Instagram 토큰에 의존하므로 `코드만 넘기면 끝나는 구조가 아니다`.
- 클라이언트가 Vercel Team을 나중에 만들면 그때는 `Transfer Project`를 다시 검토할 수 있다.
- 다만 현재 기준으로는 `새 프로젝트 재구성 + 데이터/도메인 전환`이 더 현실적이고 덜 막힌다.

## 참고

- Vercel 프로젝트 이전 문서
  - https://vercel.com/docs/projects/transferring-projects
- 개인 Git 계정과 팀 연결 제약
  - https://vercel.com/kb/guide/connecting-teams-with-personal-git-accounts
