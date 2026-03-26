# Phase 0: 프로젝트 스캐폴딩 — Research

**Date:** 2026-03-26

## 1. Next.js 15 App Router + Tailwind CSS 셋업
기본 생성 사양:
- React 19 + Next.js 15 App Router
- TypeScript
- Tailwind CSS (기본 포함)
- `src/` 디렉토리 사용 (App Router를 `src/app`에 위치시켜 루트 디렉토리를 깔끔하게 유지)
- ESLint + 설정
- Command: `npx create-next-app@latest afeelcompany --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`

### 주의사항
- `create-next-app` 실행 시 이미 폴더가 존재하므로 바로 현재 디렉토리(`/`)에 설치해야 함: `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
- 초기화 후 기존 프로젝트 파일(Roadmap, Context 등 `.planning` 및 `plan` 폴더)이 덮어써지지 않도록 유의.

## 2. shadcn/ui 셋업
- 커맨드: `npx shadcn@latest init -y` (최신 CLI 사용 권장)
- 설정값: 
  - style: "new-york" (좀 더 미니멀하고 에디토리얼한 테마에 적합)
  - base color: "zinc" 또는 "slate" (다크 테마에 어울리는 색상)
  - CSS variables: true (테마 커스터마이징 용이성)
- 추가 컴포넌트: `npx shadcn@latest add button input dialog card`

## 3. Vercel 인프라 연결 (@vercel/postgres, @vercel/blob)
- Vercel CLI 통한 연결:
  1. `vercel link`로 프로젝트 연결
  2. Vercel 대시보드에서 Postgres, Blob 리소스 생성 후 프로젝트에 연결
  3. `vercel env pull .env.local`로 생성된 환경변수 가져오기
- 패키지 설치: `npm i @vercel/postgres @vercel/blob`

### Vercel Postgres 직접 쿼리 (ORM 없음)
Context 결정에 따라 ORM 없이 직접 작성.
- 패키지: `@vercel/postgres`
- 사용법 (예시):
```typescript
import { sql } from '@vercel/postgres';

export async function getPortfolioItems() {
  const { rows } = await sql`SELECT * FROM portfolio_items ORDER BY sort_order ASC`;
  return rows;
}
```

## 4. DB 마이그레이션 (동기화) 전략
단순 SQL 스크립트 실행 모델.
- 스키마 파일 (`plan/mvp-build-plan.md` 참조) 내용으로 `scripts/migrate.ts` 또는 단순 `schema.sql`을 작성함.
- `schema.sql`을 Vercel Postgres 대시보드의 Query Editor에서 직접 실행하는 것이 가장 안전하고 확실한 방법 (D-06 결정사항 반영).
- 만약 코드로 실행하고자 한다면, `.env.local`의 `POSTGRES_URL`을 로드하여 `sql` 템플릿 태그로 차례대로 CREATE TABLE 쿼리를 실행하는 스크립트 작성.

## 5. 초기 폴더 구조
```
src/
├── app/
│   ├── (public)/              # 공개 페이지
│   ├── admin/                 # 관리자 페이지
│   ├── api/                   # API 라우트
│   └── globals.css
├── components/
│   ├── ui/                    # shadcn
│   └── layout/
├── lib/
│   ├── db.ts                  # DB 헬퍼
│   └── blob.ts                # Blob 헬퍼
└── types/
```

## Validation Architecture

Nyquist validation check:

| Dimension | Verification Plan |
|-----------|-------------------|
| 1. Code | `npm run build` 및 `npm run lint` 통과. |
| 2. Integration | Vercel Postgres 접속 및 단순 SELECT 성공. |
| 3. UI/UX | `vercel dev`로 시작 페이지 렌더링 정상 표시. |
| 4. Data | `schema.sql` 쿼리로 5개 테이블 정상 등록 여부 확인 (Vercel Console 또는 `SELECT table_name FROM information_schema.tables`). |
| 5. Security | `.env.local` 파일이 git에 포함되지 않음(`.gitignore` 확인). |
| 6. Performance | Next.js 빌드 시 터미널 상 에러 없음. |

---
*Research completed 2026-03-26*
