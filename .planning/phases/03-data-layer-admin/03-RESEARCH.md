# Phase 3: 데이터 레이어 + 관리자 페이지 - Research

**Researched:** 2026-03-27
**Domain:** Next.js 16 App Router admin backend with cookie auth, Vercel Blob uploads, Postgres CRUD, and admin workflow composition
**Confidence:** HIGH for architecture and stack choice, MEDIUM for Instagram publish flow because Meta write permissions remain external

<user_constraints>
## User Constraints

No user constraints - all decisions at the agent's discretion.

### Locked Decisions from PROJECT / ROADMAP / Completed Phases

- **D-01:** 인증은 `ADMIN_PASSWORD` 기반 단순 관리자 인증이어야 한다. OAuth, NextAuth, DB user table은 범위 밖이다.
- **D-02:** DB는 계속 `@vercel/postgres` SQL 직접 사용한다. ORM은 도입하지 않는다.
- **D-03:** 업로드 저장소는 Vercel Blob이다.
- **D-04:** 관리자가 포트폴리오 이미지를 한 번 업로드하면 웹/PDF/인스타 운영 플로우로 이어지는 구조를 유지해야 한다.
- **D-05:** Phase 1에서 인스타 읽기/토큰 갱신은 이미 검증됐다. 쓰기(INST-04~05)는 아직 미완료다.
- **D-06:** Phase 2에서 `/pdf-export`는 이미 DB-first + fixture fallback 구조로 준비되어 있으므로, Phase 3에서는 `company_profile`, `portfolio_items`, `client_brands` 실데이터가 그 로더에 자연스럽게 들어오게 해야 한다.
- **D-07:** Next.js는 현재 16.2.1이며 `cookies()`는 async API다.

### the agent's Discretion

- 인증을 Server Action으로 할지 Route Handler로 할지
- 업로드를 서버 업로드로 할지 client upload token 방식으로 할지
- 관리자 화면을 몇 개의 페이지로 나눌지
- 포트폴리오 편집 UX를 모달로 할지 인라인 편집으로 할지

### Deferred Ideas (OUT OF SCOPE)

- 다중 관리자 계정
- 역할/권한 체계
- 외부 CMS
- 서버사이드 PDF 생성
- 화려한 디자인 고도화
</user_constraints>

<research_summary>
## Summary

Phase 3의 핵심은 "복잡한 인증 시스템 없이도 비개발자 관리자가 안전하게 콘텐츠를 CRUD할 수 있는 얇은 관리자 백엔드"를 만드는 것이다. 현재 스택과 제약을 보면, 가장 안정적인 접근은 `app/api/*` Route Handler를 mutation 경계로 사용하고, `app/admin/*` 페이지는 Server Component로 렌더링하며, 인증은 서명된 httpOnly 쿠키로 처리하는 방식이다.

업로드는 Vercel Blob의 **server upload**를 기본 경로로 두는 것이 가장 단순하다. 다만 Blob README 기준으로 Vercel-hosted server upload는 4.5MB 한계가 있으므로, 클라이언트에서 2000px/품질 80 기준으로 리사이즈한 뒤 `multipart/form-data`로 업로드하는 전제가 필요하다. 이 제약과 현재 MVP 요구를 같이 보면, 복잡한 client token 업로드보다 "클라이언트 리사이즈 + 서버 업로드 Route Handler"가 Phase 3에 적합하다.

관리자 기능은 기능별 커밋과 실행 파동을 고려해 `인증`, `업로드`, `포트폴리오 관리`, `회사 프로필/브랜드`, `인스타 큐`, `사람 검증` 여섯 덩어리로 분리하는 것이 적절하다. 이렇게 하면 파일 경계가 비교적 분명하고, 이후 실행 시에도 한 plan이 하나의 기능 커밋 단위로 자연스럽게 대응된다.

**Primary recommendation:** Route Handler 중심의 BFF 구조를 유지하면서, 서명된 관리자 세션 쿠키와 클라이언트 리사이즈 기반 Blob 서버 업로드를 축으로 Phase 3를 6개 기능 plan으로 분해한다.
</research_summary>

<standard_stack>
## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | 16.2.1 | App Router admin pages, Route Handlers, cookies, redirect | 이미 프로젝트 표준이고 `app/api/*` + Server Component 조합이 Phase 3에 맞다 |
| `@vercel/postgres` | 0.10.0 | CRUD persistence for `portfolio_items`, `company_profile`, `client_brands`, `instagram_queue` | 이미 스키마와 기존 코드가 이 경로로 정렬되어 있다 |
| `@vercel/blob` | 2.3.1 | Portfolio and logo file storage | 프로젝트 저장소 표준이며 server upload/client upload 양쪽 경로를 지원한다 |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `zod` | latest (add in Phase 3) | JSON/FormData validation for auth, upload metadata, profile payloads | 관리자 입력과 업로드 메타데이터를 서버에서 검증할 때 |
| `next/headers` `cookies()` | built-in | Read/write admin session cookie | 로그인, 로그아웃, admin guard |
| `next/navigation` `redirect()` | built-in | Server-side admin guard redirect | 보호된 admin layout/page에서 로그인 페이지 이동 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Route Handler mutations | Server Actions everywhere | 로그인/업로드도 가능하지만 파일 업로드 body limit와 공개 API 경계가 덜 명확해진다 |
| Blob server upload | Blob client upload token | 큰 파일에 강하지만 구현 복잡도가 올라간다 |
| Signed session cookie | Plain boolean cookie | 구현은 쉬우나 위조 방지가 안 되어 관리자 보호에 부적절하다 |

**Installation:**
```bash
npm install zod
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Recommended Project Structure

```text
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── page.tsx
│   │   ├── upload/page.tsx
│   │   ├── portfolio/page.tsx
│   │   ├── profile/page.tsx
│   │   └── instagram/page.tsx
│   └── api/
│       ├── auth/login/route.ts
│       ├── auth/logout/route.ts
│       ├── upload/route.ts
│       ├── portfolio/route.ts
│       ├── portfolio/[id]/route.ts
│       ├── portfolio/reorder/route.ts
│       ├── company-profile/route.ts
│       ├── client-brands/route.ts
│       ├── client-brands/[id]/route.ts
│       ├── instagram/queue/route.ts
│       └── instagram/publish/[id]/route.ts
├── components/admin/
├── lib/
│   ├── auth.ts
│   ├── blob.ts
│   ├── image.ts
│   └── validations/
└── types/
    └── portfolio.ts
```

### Pattern 1: Signed admin session cookie via async `cookies()`
**What:** 로그인 시 서버에서 서명된 세션 문자열을 만들고 `httpOnly` 쿠키로 저장한다.
**When to use:** 관리자 단일 비밀번호 인증, 짧은 세션 관리, layout/API 공통 인증 체크.
**Example:**
```ts
import { cookies } from 'next/headers'

const cookieStore = await cookies()
cookieStore.set({
  name: 'afeel_admin_session',
  value: signedToken,
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
})
```

### Pattern 2: Server Component admin pages + Route Handler mutations
**What:** 목록/폼 화면은 Server Component에서 현재 DB 상태를 읽고, 저장/삭제/정렬은 `/api/*` Route Handler가 처리한다.
**When to use:** 쿠키 기반 auth를 재사용하고, 업로드/삭제/정렬 같은 side effect를 명시적인 HTTP mutation으로 다루고 싶을 때.
**Example:**
```ts
export async function POST(request: Request) {
  const formData = await request.formData()
  // validate -> auth -> blob/db write -> return JSON
  return Response.json({ success: true })
}
```

### Pattern 3: Client resize before Blob server upload
**What:** 브라우저에서 이미지를 리사이즈한 뒤 `multipart/form-data`로 서버 Route Handler에 전송하고, 서버에서 `put()` 후 DB 메타데이터를 기록한다.
**When to use:** 파일 크기를 4.5MB 이하로 유지할 수 있고, Phase 3에서 구현 단순성이 우선일 때.
**Example:**
```ts
const blob = await put(`portfolio/${Date.now()}-${file.name}`, file, {
  access: 'public',
  addRandomSuffix: true,
})
```

### Pattern 4: Authorization on every mutation endpoint
**What:** `app/admin/*` UI 가드와 별개로 모든 POST/PATCH/DELETE Route Handler가 세션을 다시 검증한다.
**When to use:** 관리자 UI 제한만으로는 충분하지 않고 API 직접 호출을 막아야 할 때.

### Anti-Patterns to Avoid
- **Unsigned admin cookie:** 값만 있으면 누구나 위조 가능한 상태가 된다. HMAC 서명 또는 동등한 검증이 필요하다.
- **업로드 검증 없는 Blob 저장:** MIME, 확장자, 크기, 인증 체크 없이 저장하면 관리 기능이 공개 엔드포인트가 된다.
- **페이지에서 직접 mutation 처리:** DB/Blob 쓰기를 Server Component 안에 섞으면 검증/권한/에러 응답 경계가 흐려진다.
- **Phase 3에서 client upload token부터 도입:** 대형 파일 요구가 아직 없는데 구현 복잡도와 callback 보안 검증만 증가한다.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 파일 저장 | 커스텀 S3 signed URL 체계 | `@vercel/blob` `put()` / 필요 시 `handleUpload()` | 이미 의존성과 호스팅 경로가 맞춰져 있다 |
| 라우트 mutation 경계 | 페이지 내부 ad-hoc fetch/DB 호출 | `app/api/*/route.ts` | 인증/검증/에러 응답을 한곳에 모을 수 있다 |
| 입력 검증 | `if (!value)` 수준의 분산 검사 | `zod` 스키마 | 파일 업로드/정렬/프로필 수정의 에러 경계가 선명해진다 |

**Key insight:** Phase 3는 기능 수가 많지만 복잡한 인프라보다 "명확한 서버 경계 + 검증 + auth 재사용"이 성패를 가른다.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: 로그인 페이지는 막지 못하고 API만 막거나, 그 반대만 구현
**What goes wrong:** `/admin` UI는 막혔는데 `/api/upload`는 뚫려 있거나, 반대로 API는 막혔는데 admin layout이 누구에게나 열리는 상태가 된다.
**Why it happens:** 페이지 보호와 mutation 보호를 별개 문제로 취급하지 않아서다.
**How to avoid:** `lib/auth.ts`에 `requireAdminSession()`와 `assertAdminApiRequest()` 같은 공통 진입점을 만들고 양쪽에서 재사용한다.
**Warning signs:** 보호된 admin 페이지를 직접 URL로 열었을 때 로그인 페이지로 안 가거나, 세션 없이 POST가 성공한다.

### Pitfall 2: 업로드가 로컬에서는 되는데 Vercel에서 실패
**What goes wrong:** 큰 이미지를 그대로 서버 업로드해 `413` 또는 Blob/Vercel body limit에 걸린다.
**Why it happens:** Blob server upload 한계를 무시하고 원본 파일 그대로 올리기 때문이다.
**How to avoid:** 클라이언트 리사이즈를 선행하고 서버에서 크기/MIME 검증을 다시 한다.
**Warning signs:** 고해상도 JPG 업로드에서만 실패, 모바일 촬영 원본에서만 불안정.

### Pitfall 3: 관리자 데이터는 저장되는데 공개/ PDF 반영이 어긋남
**What goes wrong:** `show_on_web`, `show_on_pdf`, `sort_order`가 UI와 DB 사이에서 일관되지 않다.
**Why it happens:** 업로드/편집/정렬/삭제를 서로 다른 형식으로 처리해서다.
**How to avoid:** `portfolio_items` 변환 타입을 고정하고, 목록/편집/정렬/삭제 모두 같은 필드명을 공유한다.
**Warning signs:** 관리자 목록 순서와 `/pdf-export` WORK 섹션 표시 순서가 다르다.

### Pitfall 4: Meta publish는 버튼이 있어도 실제 운영 전제조건이 빠짐
**What goes wrong:** 큐 테이블은 생겼지만 게시 버튼이 실패하거나 의미 없는 stub로 끝난다.
**Why it happens:** Meta Development Mode, 비즈니스 계정 연결, 이미지 URL 접근성 같은 외부 조건을 계획에서 분리하지 않았기 때문이다.
**How to avoid:** Queue UI/DB와 Graph publish helper를 함께 넣되, 수동 검증 단계에서 외부 전제조건을 명시한다.
**Warning signs:** 큐 버튼 클릭 시 400/403이 반복되거나, external_post_id가 never set.
</common_pitfalls>

<code_examples>
## Code Examples

### Auth cookie write
```ts
// Source: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md
import { cookies } from 'next/headers'

export async function createSessionCookie(value: string) {
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'afeel_admin_session',
    value,
    httpOnly: true,
    path: '/',
  })
}
```

### Route Handler form body read
```ts
// Source: node_modules/next/dist/docs/01-app/02-guides/backend-for-frontend.md
export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file')
  return Response.json({ hasFile: Boolean(file) })
}
```

### Server Actions upload limit warning
```ts
// Source: node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/serverActions.md
// Default bodySizeLimit is 1MB, so large image uploads should not rely on Server Actions by default.
```
</code_examples>

<sota_updates>
## State of the Art (2024-2026)

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| sync `cookies()` assumptions | async `cookies()` | Next.js 15+ | auth helper signatures must be async-friendly |
| ad-hoc API utilities in pages router | App Router Route Handlers | Next.js 13+ and current 16.2.1 | mutation endpoints stay in `app/api/*` |
| Server Actions for all forms by default | choose Server Actions selectively, Route Handlers for public/file mutation edges | current guidance | file upload and auth endpoints should stay explicit |

**New tools/patterns to consider:**
- `zod` server validation: Phase 3의 auth/upload/profile payload 검증에 적합하다.
- Blob client upload token flow: 추후 원본 업로드가 커질 때 Phase 3 이후 확장 경로로 남겨둘 수 있다.

**Deprecated/outdated:**
- sync-only cookie access assumptions: 현재 Next 16 기준으로 위험하다.
- 로컬스토리지 관리자 토큰 저장: XSS/위조 측면에서 부적절하다.
</sota_updates>

<open_questions>
## Open Questions

1. **인스타 게시(Meta write) 전제조건이 현재 운영 계정에서 준비됐는가**
   - What we know: Phase 1은 읽기만 검증됐고 쓰기는 deferred였다.
   - What's unclear: business/page linkage, publish permission, 운영 계정 검증 가능 여부.
   - Recommendation: Phase 3 plan에는 queue + publish button까지 포함하되, 최종 검증 plan에서 외부 조건 확인을 명시한다.

2. **포트폴리오 카테고리 최종안이 고정됐는가**
   - What we know: 현재 스키마는 `category TEXT` 하나다.
   - What's unclear: 상의/하의/신발/악세서리/기타가 최종인지.
   - Recommendation: 실행은 현재 단일 문자열 카테고리 셀렉트로 진행하고, enum 하드코딩은 `lib/` 상수로 분리한다.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md` — async cookies, set/delete restrictions
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` — Route Handler behavior and request-time rules
- `node_modules/next/dist/docs/01-app/02-guides/backend-for-frontend.md` — public endpoint and `request.formData()` guidance
- `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/serverActions.md` — Server Action body size limit
- `node_modules/@vercel/blob/README.md` and `node_modules/@vercel/blob/dist/index.d.ts` — server upload limit and Blob SDK capabilities
- `scripts/schema.sql` — actual DB table contracts
- `.planning/phases/02-spike-pdf/02-RESEARCH.md` and `.planning/phases/02-spike-pdf/02-05-SUMMARY.md` — downstream dependency from PDF/data layer

### Secondary (MEDIUM confidence)
- `plan/mvp-build-plan.md` — original MVP structure and admin surface expectation
- `src/lib/instagram.ts` — current API style and env/token handling conventions
</sources>

## Validation Architecture

- **Quick run:** `npm run build`
- **Full run:** `npm run lint && npm run build`
- **Manual checkpoints:** 로그인/로그아웃, 업로드, 정렬/삭제, 프로필 수정, 로고 관리, 인스타 큐 게시 버튼
- **Wave 0 prerequisites:** `ADMIN_PASSWORD`, `POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN` env availability 확인

<metadata>
## Metadata

**Research scope:**
- Core technology: Next.js App Router admin backend
- Ecosystem: cookies, Route Handlers, Vercel Blob, Postgres, validation
- Patterns: signed cookie auth, server upload, CRUD admin pages
- Pitfalls: auth bypass, upload size limits, data consistency, Meta write dependency

**Confidence breakdown:**
- Standard stack: HIGH - current repo and official docs align
- Architecture: HIGH - existing code already uses Route Handlers + Server Components
- Pitfalls: HIGH - constraints are visible in docs and current code
- Code examples: HIGH - from local official docs and installed package types

**Research date:** 2026-03-27
**Valid until:** 30 days
</metadata>

---

*Phase: 03-data-layer-admin*
*Research completed: 2026-03-27*
*Ready for planning: yes*
