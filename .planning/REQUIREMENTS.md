# Requirements: AFEEL Company Site (MVP)

**Defined:** 2026-03-26
**Core Value:** 관리자가 포트폴리오 이미지를 한 번 업로드하면 웹 갤러리 · 인스타그램 · PDF 소개서에 모두 반영되는 '원소스 멀티유즈' 경험

## v1 Requirements

### 스캐폴딩 (SCAF)

- [ ] **SCAF-01**: Next.js 15 (App Router, TypeScript, Tailwind CSS) 프로젝트가 생성되고 `vercel dev`로 로컬 실행된다
- [ ] **SCAF-02**: shadcn/ui가 초기화되고 기본 컴포넌트(Button, Input, Dialog, Card)가 설치된다
- [ ] **SCAF-03**: Vercel 프로젝트가 생성되고 Git에 연결된다
- [ ] **SCAF-04**: Vercel Postgres가 프로비저닝되고 DB 스키마(5개 테이블)가 생성된다
- [ ] **SCAF-05**: Vercel Blob 스토어가 생성되고 환경변수가 설정된다
- [ ] **SCAF-06**: 프로젝트 폴더 구조(app, components, lib, types)가 생성된다
- [ ] **SCAF-07**: 빈 페이지가 Vercel 배포 URL에서 접근 가능하다

### 인스타그램 연동 (INST)

- [x] **INST-01**: Meta Graph API로 인스타그램 피드(이미지+캡션)를 읽어 웹에 그리드 렌더링할 수 있다
- [x] **INST-02**: 읽어온 피드 데이터가 DB에 캐싱되어 API 호출 없이도 피드가 표시된다
- [x] **INST-03**: 장기 토큰(60일)이 발급되고 만료 전 자동 갱신 로직이 동작한다
- [ ] **INST-04**: 관리자가 이미지+캡션으로 인스타그램에 게시할 수 있다 (Development Mode)
- [ ] **INST-05**: 게시 성공/실패 상태가 DB에 기록되고 관리자에게 표시된다

### PDF 소개서 (PDF)

- [ ] **PDF-01**: `/pdf-export` 라우트에서 가로형 A4 레이아웃의 회사 소개서 페이지가 렌더링된다
- [ ] **PDF-02**: `@media print` CSS로 인쇄 시 가로 방향, 페이지 나눔, 배경색이 정확히 출력된다
- [ ] **PDF-03**: 소개서 섹션 구성(표지→ABOUT→WORK→CLIENT→연락처)이 올바르게 배치된다
- [ ] **PDF-04**: 한글 텍스트가 깨짐 없이 출력된다 (Pretendard / Noto Sans KR)
- [ ] **PDF-05**: `window.print()` + "다운로드" 버튼으로 PDF 저장 플로우가 동작한다
- [ ] **PDF-06**: Chrome과 Safari에서 동일한 출력 결과를 얻을 수 있다

### 관리자 인증 (AUTH)

- [ ] **AUTH-01**: 관리자가 환경변수 기반 비밀번호로 로그인할 수 있다
- [ ] **AUTH-02**: 로그인 시 쿠키/세션이 발급되어 `/admin/*` 접근이 유지된다
- [ ] **AUTH-03**: 미인증 사용자가 `/admin/*` 접근 시 로그인 페이지로 리디렉트된다
- [ ] **AUTH-04**: 관리자가 로그아웃할 수 있다

### 이미지 업로드 (UPLD)

- [ ] **UPLD-01**: 관리자가 드래그&드롭 또는 파일 선택으로 이미지를 업로드할 수 있다
- [ ] **UPLD-02**: 업로드 시 메타데이터(제목, 브랜드명, 셀럽명, 카테고리)를 입력할 수 있다
- [ ] **UPLD-03**: 업로드 용도를 선택할 수 있다 (웹 갤러리 / 인스타 / 둘 다)
- [ ] **UPLD-04**: 클라이언트 사이드에서 이미지가 리사이즈된다 (max 2000px, 품질 80%)
- [ ] **UPLD-05**: 업로드 진행률이 표시되고 성공/실패 피드백이 제공된다
- [ ] **UPLD-06**: 이미지가 Vercel Blob에 저장되고 메타데이터가 DB에 기록된다

### 포트폴리오 관리 (PORT)

- [ ] **PORT-01**: 관리자가 포트폴리오 아이템 목록을 테이블 뷰(썸네일, 제목, 브랜드, 상태)로 볼 수 있다
- [ ] **PORT-02**: 관리자가 개별 아이템을 인라인 편집 또는 모달로 수정할 수 있다
- [ ] **PORT-03**: 관리자가 웹/PDF 노출 여부를 토글할 수 있다
- [ ] **PORT-04**: 관리자가 아이템 순서를 변경할 수 있다 (sort_order)
- [ ] **PORT-05**: 관리자가 아이템을 삭제할 수 있다 (Blob + DB 동시 삭제)

### 회사 프로필 (PROF)

- [ ] **PROF-01**: 관리자가 회사소개 문구를 편집할 수 있다
- [ ] **PROF-02**: 관리자가 연락처 정보(이메일, 전화, 주소)를 편집할 수 있다
- [ ] **PROF-03**: 관리자가 클라이언트 브랜드 로고를 추가/삭제/순서 변경할 수 있다

### 공개 사이트 (SITE)

- [ ] **SITE-01**: HOME 페이지에 히어로 영역과 최신 포트폴리오 미리보기(3~6개)가 표시된다
- [ ] **SITE-02**: ABOUT 페이지에 회사 소개 + 클라이언트 로고 그리드가 표시된다
- [ ] **SITE-03**: PORTFOLIO 페이지에 카테고리 필터가 있는 이미지 그리드가 표시된다
- [ ] **SITE-04**: PORTFOLIO에서 이미지 클릭 시 소형 라이트박스(모달)가 열린다
- [ ] **SITE-05**: FEED 페이지에 인스타그램 캐시 데이터 기반 피드 그리드가 표시된다
- [ ] **SITE-06**: CONTACT 페이지에 연락처 정보가 표시된다
- [ ] **SITE-07**: 공통 레이아웃(헤더 로고+내비, 푸터 연락처+SNS)이 모든 페이지에 적용된다
- [ ] **SITE-08**: 모든 페이지가 데스크탑과 모바일에서 반응형으로 동작한다

### 런칭 (LNCH)

- [ ] **LNCH-01**: SEO 기본 설정(메타태그, OG 이미지, robots.txt, sitemap.xml)이 적용된다
- [ ] **LNCH-02**: 404 페이지와 API 에러 응답, 로딩 상태가 처리된다
- [ ] **LNCH-03**: next/image 설정 및 Blob URL remotePatterns가 구성된다
- [ ] **LNCH-04**: 커스텀 도메인이 Vercel에 연결되고 HTTPS가 활성화된다
- [ ] **LNCH-05**: 기존 소개서 기반 초기 데이터(회사 프로필, 브랜드 로고)가 입력된다
- [ ] **LNCH-06**: 관리자 업로드 → 웹 갤러리 반영 → PDF 반영 → 인스타 게시 E2E 플로우가 동작한다

## v2 Requirements

### 디자인 고도화

- **DSGN-01**: 다크 배경, 미니멀, 에디토리얼 톤의 브랜드 디자인 적용
- **DSGN-02**: 스크롤 애니메이션 및 페이지 전환 효과
- **DSGN-03**: bienbien.co.kr 레퍼런스 기반 고급 UI

### PDF 자동화

- **PDFA-01**: Puppeteer 기반 서버사이드 자동 PDF 생성
- **PDFA-02**: PDF 다운로드 링크 이메일 발송

### 고급 인스타그램

- **INSA-01**: 예약 게시 기능 (시간 설정)
- **INSA-02**: 인스타 분석 데이터(좋아요, 댓글 수) 대시보드

## Out of Scope

| Feature | Reason |
|---------|--------|
| OAuth / NextAuth 인증 | 관리자 1~2명 한정 MVP, 환경변수 인증으로 충분 |
| DB 유저 테이블 및 계정 관리 | 복잡한 인증 체계 불필요 |
| ORM (Drizzle / Prisma) | 테이블 5개 소규모, cold start 오버헤드 회피 |
| CMS 도입 (Strapi, Sanity 등) | Vercel 생태계로 충분, 과도한 설계 |
| Playwright / Puppeteer PDF | Vercel Hobby 50MB/10초 제한 |
| 실시간 알림 시스템 | MVP 범위 초과 |
| 다국어(i18n) 지원 | 한국어 단일 사이트 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCAF-01~07 | Phase 0 | Pending |
| INST-01~03 | Phase 1 | Pending |
| INST-04~05 | Phase 1 | Pending |
| PDF-01~06 | Phase 2 | Pending |
| AUTH-01~04 | Phase 3 | Pending |
| UPLD-01~06 | Phase 3 | Pending |
| PORT-01~05 | Phase 3 | Pending |
| PROF-01~03 | Phase 3 | Pending |
| SITE-01~08 | Phase 4 | Pending |
| LNCH-01~06 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 45 total
- Mapped to phases: 45
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-26*
*Last updated: 2026-03-26 after initial definition*
