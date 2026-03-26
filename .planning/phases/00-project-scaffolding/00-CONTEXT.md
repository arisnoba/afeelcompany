# Phase 0: 프로젝트 스캐폴딩 — Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Next.js 15 + Vercel 인프라(Postgres, Blob)를 연결하고, DB 스키마를 생성하여 로컬(`vercel dev`)과 Vercel 배포 URL 모두 동작하는 빈 앱을 만드는 것. 기능 구현은 없고, 이후 모든 Phase가 의존하는 인프라 기반을 확립한다.

</domain>

<decisions>
## Implementation Decisions

### DB 클라이언트
- **D-01:** `@vercel/postgres` 사용 (MVP 단계에서 가장 가벼운 선택). deprecated 추세이나 MVP 기간 내 문제없고, 전환 필요 시 이후 결정.
- **D-02:** ORM 없이 `sql` 템플릿 태그로 쿼리 직접 작성.

### Vercel 프로비저닝 방식
- **D-03:** `vercel` CLI로 Postgres/Blob 프로비저닝 시도. CLI에서 불가한 경우 대시보드에서 수동으로 생성.
- **D-04:** 환경변수는 `vercel env pull .env.local`로 로컬에 동기화.

### DB 마이그레이션 관리
- **D-05:** SQL 마이그레이션 파일을 `scripts/migrate.ts`에 작성하여 직접 실행 시도.
- **D-06:** 자동 실행이 어려울 경우, Supabase 경험 기반으로 Vercel Postgres 콘솔에서 직접 SQL을 실행하는 방법을 문서화하여 사용자가 실행. (쿼리 에디터 UI가 제공됨 — Supabase SQL Editor와 동일한 방식)

### 프로젝트 구조
- **D-07:** `mvp-build-plan.md`의 폴더 구조를 그대로 따름 (app, components, lib, types).
- **D-08:** shadcn/ui 초기화 시 기본 컴포넌트(Button, Input, Dialog, Card)만 설치.

### Agent's Discretion
- `next.config.ts` Blob remotePatterns 설정 (Phase 5에서 이슈를 예방하기 위해 Phase 0에서 미리 설정)
- `vercel.json` 기본 설정 여부

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### MVP Plan & Schema
- `plan/mvp-build-plan.md` — DB 스키마(5개 테이블), 폴더 구조, 기술 스택 전체 정의. 이 파일이 Phase 0의 주요 사양서.

### Project Context
- `.planning/PROJECT.md` — 전체 프로젝트 목표, 제약사항(Vercel Hobby 한계), 확정된 기술 스택
- `.planning/REQUIREMENTS.md` — SCAF-01~07 요구사항 체크리스트

</canonical_refs>

<deferred>
## Deferred Ideas

없음.

</deferred>
