---
wave: 1
depends_on: []
files_modified: []
autonomous: true
requirements: [SCAF-01, SCAF-02, SCAF-03, SCAF-04, SCAF-05, SCAF-06, SCAF-07]
---

# Phase 0: 프로젝트 스캐폴딩 - PLAN

**Goal:** 빈 프로젝트에서 동작하는 Next.js 앱 + DB/Blob 연결까지
**UI hint:** no

<objective>
Next.js 15 App Router, Tailwind CSS, shadcn/ui 기본 구성과 Vercel 데이터 스토리지(Postgres, Blob) 설정 준비
</objective>

<verification_criteria>
- [ ] `npx next dev` 또는 `vercel dev`시 에러 없이 구동된다.
- [ ] 5개의 필수 데이터베이스 테이블(`portfolio_items`, `instagram_queue`, `instagram_feed_cache`, `company_profile`, `client_brands`)을 생성하는 `.sql` 파일이 존재할 것.
- [ ] `@vercel/postgres`와 `@vercel/blob` 패키지가 의존성에 등록될 것.
</verification_criteria>

<must_haves>
- Tailwind 및 shadcn/ui (Button, Input, Dialog, Card) 기본 구성
- App Router + `src/app` 구조
- MVP 빌드 플랜에서 명시한 초기 스키마 `.sql` 파일
</must_haves>

---

## Task 1: Initialize Next.js 15 Project

```xml
<task>
<read_first>
- .planning/phases/00-project-scaffolding/00-CONTEXT.md
- plan/mvp-build-plan.md
</read_first>
<acceptance_criteria>
- `package.json` contains Next.js 15, React 19, Tailwind CSS and dependencies
- `src/app/layout.tsx` and `src/app/page.tsx` exist
</acceptance_criteria>
<action>
Execute `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --force` in the project root to scaffold the application.
</action>
</task>
```

## Task 2: Install and Configure shadcn/ui

```xml
<task>
<read_first>
- tailwind.config.ts (if generated)
- package.json
</read_first>
<acceptance_criteria>
- components.json is created with "style": "new-york" and base color "zinc"
- `components/ui/button.tsx`, `components/ui/input.tsx`, `components/ui/dialog.tsx`, `components/ui/card.tsx` exist
</acceptance_criteria>
<action>
1. Run `npx shadcn@latest init -d -y`
2. Run `npx shadcn@latest add button input dialog card -y`
</action>
</task>
```

## Task 3: Install Vercel Storage Packages

```xml
<task>
<read_first>
- package.json
</read_first>
<acceptance_criteria>
- `@vercel/postgres` and `@vercel/blob` are present in `package.json` dependencies
</acceptance_criteria>
<action>
Execute `npm install @vercel/postgres @vercel/blob`
</action>
</task>
```

## Task 4: Setup Database Schema File

```xml
<task>
<read_first>
- plan/mvp-build-plan.md (contains exact "DB 스키마 (SQL)" string)
</read_first>
<acceptance_criteria>
- `scripts/schema.sql` file exists
- File contains `CREATE TABLE portfolio_items`, `CREATE TABLE instagram_queue`, `CREATE TABLE instagram_feed_cache`, `CREATE TABLE company_profile`, `CREATE TABLE client_brands`
</acceptance_criteria>
<action>
Create `scripts/schema.sql` by copying the "DB 스키마 (SQL)" block verbatim from `plan/mvp-build-plan.md` lines 118-178 to prepare schema manual deployment.
</action>
</task>
```

## Task 5: Scaffold Directory Structure

```xml
<task>
<read_first>
- src/app/ (verify initial presence)
</read_first>
<acceptance_criteria>
- `src/app/(public)`, `src/app/admin`, `src/app/api`, `src/app/pdf-export` exist
- `src/components/layout`, `src/components/portfolio`, `src/components/admin` exist
- `src/lib/db.ts`, `src/lib/blob.ts` exist (even if empty)
</acceptance_criteria>
<action>
Create folders:
- `src/app/(public)`
- `src/app/admin`
- `src/app/api`
- `src/app/pdf-export`
- `src/components/ui`
- `src/components/layout`
- `src/components/portfolio`
- `src/components/admin`
- `src/lib`
- `src/types`

Create empty files for context definition:
- `src/lib/db.ts`
- `src/lib/blob.ts`
- `src/lib/auth.ts`
- `src/lib/instagram.ts`
</action>
</task>
```
