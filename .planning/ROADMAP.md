# Roadmap: AFEEL Company Site (MVP)

**Created:** 2026-03-26
**Milestone:** v1.0 — MVP Launch
**Granularity:** Standard (6 phases)

## Overview

```
Phase 0: 프로젝트 스캐폴딩 ─────────────────────────────────┐
Phase 1: Spike — 인스타 API 검증 ──┐                         │
Phase 2: Spike — PDF 출력 검증 ────┤ (1,2는 병렬 가능)        │
                                   ↓                         │
         검증 결과 리뷰 + 방향 확정                           │
                                   ↓                         │
Phase 3: 데이터 레이어 + 관리자 ──────────────────────────────┘
Phase 4: 공개 사이트
Phase 5: 통합 + 런칭
```

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 0 | 프로젝트 스캐폴딩 | Complete (1/1) | SCAF-01~07 | 4 |
| 1 | Spike — 인스타 API 검증 | 5/5 | Complete | 3 |
| 2 | Spike — PDF 출력 검증 | 5/5 | Complete | 6 |
| 3 | 데이터 레이어 + 관리자 | 5/6 | In Review | 5 |
| 4 | 공개 사이트 | 방문자용 프론트엔드 페이지 전체 구현 | SITE-01~08 | 5 |
| 5 | 통합 + 런칭 | E2E 플로우 검증 + 프로덕션 배포 | LNCH-01~06 | 4 |

## Phase Details

### Phase 0: 프로젝트 스캐폴딩

**Goal:** 빈 프로젝트에서 동작하는 Next.js 앱 + DB/Blob 연결까지
**Requirements:** SCAF-01, SCAF-02, SCAF-03, SCAF-04, SCAF-05, SCAF-06, SCAF-07
**UI hint:** no

**Success Criteria:**
1. `vercel dev`로 로컬에서 Next.js 앱이 실행된다
2. Vercel Postgres에 5개 테이블이 생성되고 SELECT 쿼리가 성공한다
3. Vercel Blob 스토어가 연결되어 환경변수가 설정된다
4. Vercel 배포 URL에서 빈 페이지가 접근 가능하다

---

### Phase 1: Spike — 인스타그램 API 검증

**Goal:** Meta Graph API로 피드 읽기(INST-01~03) 기술 검증 — INST-04~05(쓰기)는 deferred
**Requirements:** INST-01, INST-02, INST-03
**Depends on:** Phase 0
**UI hint:** yes

> **Note:** Phase 1과 Phase 2는 병렬 진행 가능 (독립적인 Spike)

**Plans:** 5/5 plans executed

Plans:
- [x] 01-01-PLAN.md — Foundations: types, db helper, next.config remotePatterns
- [x] 01-02-PLAN.md — Library: instagram.ts (fetchFeed, syncToDb, getCachedFeed, refreshToken, checkTokenExpiry)
- [x] 01-03-PLAN.md — API routes: /api/instagram/sync + /api/instagram/refresh-token
- [x] 01-04-PLAN.md — Spike UI: /admin/instagram-test page (3-column grid + SyncButton)
- [x] 01-05-PLAN.md — Human verification checkpoint (INST-01~03)

**Success Criteria:**
1. 인스타 피드 이미지+캡션이 웹 페이지에 그리드로 렌더링된다
2. API 호출 없이 DB 캐시된 데이터만으로 피드가 표시된다
3. 장기 토큰 갱신 로직이 정상 동작한다 (INST-03 — 쓰기 제외)

**Spike 실패 시 대안:**
- 읽기 전용: Behold.so (무료 티어) 또는 인스타 oEmbed
- 쓰기 보류: MVP에서 쓰기 제외, v2 이동

---

### Phase 2: Spike — PDF 회사소개서 출력 검증

**Goal:** `/pdf-export` 전용 라우트 + 브라우저 인쇄로 가로형 PDF가 품질 있게 나오는지 검증
**Requirements:** PDF-01, PDF-02, PDF-03, PDF-04, PDF-05, PDF-06
**Depends on:** Phase 0
**UI hint:** yes

> **Note:** Phase 1과 Phase 2는 병렬 진행 가능 (독립적인 Spike)

**Plans:** 5/5 plans executed

Plans:
- [x] 02-01-PLAN.md — Foundations: brochure contract, fixture data, route-local font, raster fixtures
- [x] 02-02-PLAN.md — DB-first loader with fixture fallback for brochure data
- [x] 02-03-PLAN.md — `/pdf-export` server route and explicit brochure sheet composition
- [x] 02-04-PLAN.md — Print CSS, screen-only toolbar, and `?print=1` auto-print flow
- [x] 02-05-PLAN.md — Human Chrome/Safari print checkpoint

**Success Criteria:**
1. A4 가로형 레이아웃으로 정확히 출력된다
2. 한글 텍스트가 깨짐 없이 Pretendard/Noto Sans KR로 출력된다
3. 갤러리 이미지가 선명하게 포함되고 페이지 나눔에서 잘림이 없다
4. Chrome과 Safari에서 동일한 결과를 얻는다
5. `window.print()` 호출로 인쇄 다이얼로그가 자동으로 열린다
6. 기존 소개서 대비 수용 가능한 퀄리티가 나온다

**퀄리티 부족 시 대안:**
1. `html2canvas` + `jsPDF` (클라이언트 래스터화)
2. DocRaptor ($15/월) 또는 PDFShift ($9/월) (외부 API)
3. Vercel Pro + `puppeteer-core` + `@sparticuz/chromium`

---

### Phase 3: 데이터 레이어 + 관리자 페이지

**Goal:** 관리자가 포트폴리오를 업로드/관리할 수 있는 완전한 백엔드
**Requirements:** AUTH-01~04, UPLD-01~06, PORT-01~05, PROF-01~03
**Depends on:** Phase 0 + Phase 1~2 검증 결과
**UI hint:** yes

**Plans:** 5/6 plans executed

Plans:
- [x] 03-01-PLAN.md — 관리자 인증, 로그인/로그아웃, 보호된 admin layout
- [x] 03-02-PLAN.md — 업로드 경로, 클라이언트 리사이즈, Blob + DB insert
- [x] 03-03-PLAN.md — 포트폴리오 목록/수정/토글/정렬/삭제 관리
- [x] 03-04-PLAN.md — 회사 프로필/브랜드 로고 관리
- [x] 03-05-PLAN.md — 인스타 큐 목록/생성/수동 게시 버튼
- [ ] 03-06-PLAN.md — 사람 검증 체크포인트

**Success Criteria:**
1. 관리자가 비밀번호로 로그인하고 `/admin/*` 영역에 접근할 수 있다
2. 이미지 업로드 → Blob 저장 + DB 메타데이터 기록이 완료된다
3. 포트폴리오 목록에서 수정/삭제/순서변경/노출 토글이 동작한다
4. 회사 프로필과 브랜드 로고를 편집/관리할 수 있다
5. 인스타 게시 대기열에서 게시 버튼이 동작한다

---

### Phase 4: 공개 사이트

**Goal:** 방문자(패션 브랜드 클라이언트)가 보는 프론트엔드 페이지 전체 구현
**Requirements:** SITE-01~08
**Depends on:** Phase 3 (데이터가 존재해야 의미있음)
**UI hint:** yes

**Success Criteria:**
1. HOME에서 히어로 영역과 최신 포트폴리오 미리보기가 표시된다
2. PORTFOLIO에서 카테고리 필터와 라이트박스(모달)가 동작한다
3. FEED에서 인스타 캐시 데이터 기반 그리드가 표시된다
4. 모든 5개 페이지가 데스크탑과 모바일에서 반응형으로 동작한다
5. 공통 레이아웃(헤더/푸터)이 일관되게 적용된다

---

### Phase 5: 통합 + 런칭

**Goal:** 전체 플로우 검증 + 프로덕션 배포
**Requirements:** LNCH-01~06
**Depends on:** Phase 3 + Phase 4
**UI hint:** no

**Success Criteria:**
1. 관리자 업로드 → 웹 갤러리 → PDF → 인스타 E2E 플로우가 동작한다
2. SEO 설정(메타태그, OG, robots.txt, sitemap)이 적용된다
3. 커스텀 도메인 + HTTPS로 모든 기능이 접근 가능하다
4. 비개발자(클라이언트)가 관리자 페이지를 사용할 수 있다

---

## Decision Points

Phase 1~2 Spike 완료 후 확정할 사항:

| 질문 | 선택지 |
|------|--------|
| 인스타 읽기 | Graph API 직접 구현 vs Behold.so 위젯 |
| 인스타 쓰기 | MVP 포함 vs 후순위 (v2) |
| PDF 방식 | 브라우저 인쇄 유지 vs 외부 API vs Puppeteer(Pro) |
| Vercel 플랜 | Hobby 유지 vs Pro 전환 |

---
*Created: 2026-03-26*
*Last updated: 2026-03-27 — Phase 3 implementation complete for plans 03-01~03-05; 03-06 human checkpoint pending*
