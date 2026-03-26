# AFEEL Company Site (MVP)

## What This Is

패션 스타마케팅 전문 PR 에이전시 '어필컴퍼니(AFEEL Company, 2018~)'의 온라인 MVP 웹사이트입니다. 현재 수동으로 PDF 소개서를 만들어 패션 브랜드(잠재 클라이언트)에게 전달하고 있는 업무를 디지털화합니다. 내부 관리자가 포트폴리오 이미지를 업로드하면 웹 갤러리에 반영되고, 인스타그램 연동 및 가로형 PDF 회사 소개서 다운로드까지 한 곳에서 제어할 수 있는 플랫폼입니다.

## Core Value

관리자가 포트폴리오 이미지를 한 번 업로드하면 웹 갤러리 · 인스타그램 · PDF 소개서에 모두 반영되는 '원소스 멀티유즈(One Source, Multi Use)' 경험을 제공하는 것.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Next.js 15 (App Router) + Tailwind CSS + shadcn/ui 기반 반응형 웹사이트
- [ ] Vercel Blob 기반 관리자 이미지 업로드 기능 (클라이언트 사이드 리사이즈 포함)
- [ ] Vercel Postgres 메타데이터 저장 (`@vercel/postgres` SQL 직접 사용, ORM 미사용)
- [ ] 카테고리(상의/하의/신발/악세서리/기타) 기반 그리드형 포트폴리오 갤러리 + 소형 라이트박스(모달)
- [ ] 환경변수 기반 단순 관리자 인증 (`ADMIN_PASSWORD` + 쿠키/세션)
- [ ] `/pdf-export` 전용 라우트: `@media print` CSS 가로형 A4 레이아웃 + `window.print()` 기반 PDF 출력
- [ ] Meta Graph API 인스타그램 피드 읽기 + DB 캐싱 (토큰 자동 갱신 포함)
- [ ] 인스타그램 게시 대기열 관리 및 수동 게시 (Graph API Development Mode)
- [ ] 회사 프로필 편집 + 클라이언트 브랜드 로고 관리
- [ ] SEO 기본 설정 (메타태그, OG 이미지, robots.txt, sitemap.xml)
- [ ] 커스텀 도메인 연결 + HTTPS

### Out of Scope

- 복잡한 관리자 인증 체계 (OAuth, NextAuth, DB 유저 테이블) — 관리자 1~2명 한정 MVP
- 화려한 커스텀 디자인 및 과도한 애니메이션 — 기능 검증 우선, 디자인은 별도 진행
- 서버사이드 PDF 생성 (Playwright/Puppeteer) — Vercel Serverless 50MB/10초 제한
- 대규모 CMS 도입 — Vercel 생태계(Postgres/Blob)로 충분
- ORM (Drizzle/Prisma) — 테이블 5개 소규모 MVP, cold start 오버헤드 불필요

## Context

- **회사 배경**: 어필컴퍼니는 패션 스타마케팅 전문 PR 에이전시(2018~)로, 셀럽-브랜드 매칭을 통한 스타마케팅이 핵심 업무
- **현재 문제**: 소개서를 수동으로 PDF 제작하여 클라이언트에게 전달하고 있어 업데이트가 번거롭고 일관성이 떨어짐
- **구현 접근**: Spike(기능 검증) → 프로토타입 → 전체 사이트 순서로 진행. 인스타 API와 PDF 출력을 먼저 검증한 후 전체 구현
- **디자인 레퍼런스**: bienbien.co.kr — 다크 배경, 미니멀, 에디토리얼 톤 (MVP 이후 적용)
- **Tech Stack**: Next.js 15, Vercel, Vercel Postgres, Vercel Blob, Tailwind CSS, shadcn/ui
- Greenfield 프로젝트. 레거시 코드 없음

## Constraints

- **서버 인프라**: Vercel Hobby — Serverless 10초 타임아웃, 50MB 번들 제한
- **저장소 용량**: Vercel Blob 500MB (Hobby). 초과 시 Pro($20/월) 전환 필요
- **DB**: Vercel Postgres 256MB, 60h 컴퓨트 (Hobby)
- **인스타그램**: Meta Graph API Development Mode — 비즈니스/크리에이터 계정 + Facebook Page 연결 필수, 토큰 60일 만료
- **디자인**: MVP 단계에서는 기능 동작 검증에 집중. 브랜드 디자인은 별도 Phase

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| ORM 미사용, `@vercel/postgres` SQL 직접 사용 | 테이블 5개 소규모 MVP. Cold start 오버헤드 제거, YAGNI 원칙 | — Pending |
| 브라우저 인쇄 기반 가로형 PDF | Vercel Serverless 제약 회피. Phase 2 Spike로 퀄리티 검증 후 결정 | — Pending |
| 인스타 피드 DB 캐싱 | API 레이트 리밋 + 토큰 만료 리스크 완화 | — Pending |
| 그리드 + 소형 라이트박스 갤러리 | 텍스트 콘텐츠 적음, 상세페이지보다 모달이 UX상 효율적 | — Pending |
| Spike(Phase 1~2) 후 방향 확정 | 인스타 쓰기 포함 여부, PDF 방식, Vercel 플랜을 검증 결과로 결정 | — Pending |

## Open Questions (클라이언트 확인 필요)

1. **인스타 비즈니스 계정 + Facebook Page 연결 여부** — Phase 1 전제조건
2. **PDF 디자인 톤** — 기존 소개서(흑백 세리프) 유지? 새로운 방향?
3. **포트폴리오 카테고리 최종안** — 의류 카테고리(상의/하의/신발/기타) vs 브랜드별 vs 복합
4. **인스타 쓰기 MVP 포함 여부** — 읽기만 먼저 vs 쓰기도 포함
5. **Vercel Pro 전환 시점** — Hobby 한계 도달 시 즉시 전환 가능한지

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-26 after initialization (mvp-build-plan.md 반영)*
