# Phase 1: Spike — 인스타그램 API 검증 - Research

**Researched:** 2026-03-27
**Domain:** Meta Instagram Graph API v25.0 + Next.js 16 App Router + @vercel/postgres
**Confidence:** HIGH (official docs confirmed, API values verified by user)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** 이번 Spike는 INST-01~03만 구현. INST-04~05(쓰기)는 읽기 검증 완료 후 v2 또는 별도 Phase에서 결정.
- **D-02:** Spike 실패 시 대안: Behold.so 무료 티어 또는 인스타 oEmbed 사용.
- **D-03:** Spike 증명용 최소 UI. 3컬럼 그리드 + 이미지 + 캡션 텍스트만 표시. 스타일링 최소화.
- **D-04:** `/admin/instagram-test` 라우트로 노출.
- **D-05:** Phase 4에서 InstagramGrid 컴포넌트 새로 설계. Spike 컴포넌트는 throwaway.
- **D-06:** Vercel Hobby — cron job 없음. `/api/instagram/sync` API 라우트로 수동 트리거.
- **D-07:** DB `fetched_at` 컬럼 활용. 1시간 이상 지났으면 sync 권장 표시.
- **D-08:** 페이지 로드 시 캐시 데이터 우선 표시 (API 호출 없음).
- **D-09:** 현재 토큰 만료일 ~2026-05-27. 환경변수 `INSTAGRAM_ACCESS_TOKEN`으로 관리.
- **D-10:** `/api/instagram/refresh-token` 엔드포인트 구현. 수동 호출.
- **D-11:** 갱신된 토큰은 DB `company_profile` 또는 `app_config` 키에 저장 검토.
- **D-12:** 만료 7일 전 콘솔 경고 로그 출력 (서버 시작 시 체크). 이메일 알림은 MVP 범위 밖.
- **D-13:** App ID: `929430673039555` (mvp-test-IG)
- **D-14:** Instagram User ID: `17841401385340013`
- **D-15:** 토큰 scope: `instagram_business_basic`
- **D-16:** API 베이스: `https://graph.instagram.com/v25.0/`
- **D-17:** 피드 endpoint: `GET /me/media?fields=id,caption,media_url,thumbnail_url,timestamp,media_type`

### Claude's Discretion

- `src/lib/instagram.ts` 내부 함수 설계 (fetchFeed, syncToDb, refreshToken 등)
- API 에러 핸들링 방식 (retry 횟수, timeout)
- DB upsert 로직 (`post_id` unique key 활용)
- 토큰 저장 위치 (환경변수 vs DB — 읽기 편한 쪽)

### Deferred Ideas (OUT OF SCOPE)

- INST-04: 인스타그램 게시 쓰기
- INST-05: 게시 상태 추적
- 자동 토큰 갱신 (Vercel Hobby cron 없음)
- Phase 4 InstagramGrid 컴포넌트
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INST-01 | Meta Graph API로 인스타그램 피드(이미지+캡션)를 읽어 웹에 그리드 렌더링 | GET /me/media endpoint 확인. 필드: id,caption,media_url,thumbnail_url,timestamp,media_type |
| INST-02 | 읽어온 피드 데이터가 DB에 캐싱되어 API 호출 없이도 피드가 표시 | instagram_feed_cache 테이블 스키마 확인. post_id UNIQUE 키로 upsert 가능 |
| INST-03 | 장기 토큰(60일) 발급되고 만료 전 갱신 로직 동작 | GET /refresh_access_token 엔드포인트 확인. grant_type=ig_refresh_token |
</phase_requirements>

---

## Summary

Meta Instagram Graph API v25.0은 `instagram_business_basic` 스코프로 피드 읽기를 완전히 지원한다. `GET /me/media` 엔드포인트로 이미지+캡션+타임스탬프 등 필요한 모든 필드를 가져올 수 있으며, 이미 토큰 scope 검증이 완료된 상태다.

토큰 갱신 메커니즘은 `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=TOKEN` 단일 HTTP 호출로 처리된다. 토큰이 24시간 이상 경과하고 아직 만료되지 않았으면 갱신 가능하며, 갱신 후 60일 유효.

Next.js 16 (이 프로젝트에 설치됨)의 핵심 변경사항: **모든 Request-time API가 완전 async**로 전환됨. `cookies()`, `headers()`, `params`, `searchParams` 모두 `await` 필수. 이를 어기면 빌드/런타임 에러 발생.

**Primary recommendation:** `src/lib/instagram.ts`에 3개 순수 함수(fetchFeed, syncToDb, refreshToken)를 구현하고, 3개 API Route Handler를 작성한다. DB 레이어는 `@vercel/postgres`의 `sql` 태그를 직접 사용하며 `src/lib/db.ts`에 연결 헬퍼를 구성한다.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.1 (설치됨) | App Router + Route Handlers | 프로젝트 결정 |
| @vercel/postgres | 0.10.0 (설치됨) | sql 태그 기반 DB 쿼리 | ORM 미사용 결정 (D-02) |
| react | 19.2.4 (설치됨) | Server Components + Client Components | Next.js 16 요구사항 |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Meta Graph API | v25.0 | 인스타 피드 읽기 + 토큰 갱신 | Instagram 연동 전체 |
| shadcn/ui Card | 설치됨 | Spike UI 이미지 카드 | /admin/instagram-test 페이지 |
| next/image | Next.js 내장 | 인스타 미디어 URL 이미지 최적화 | CDN 이미지 표시 시 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| 직접 API 구현 | Behold.so 무료 티어 | Spike 실패 시 D-02 fallback. 직접 구현이 캐싱/토큰 관리 유연성 높음 |
| 직접 API 구현 | 인스타 oEmbed | 단순하지만 캡션/타임스탬프 필드 없음, DB 캐싱 불가 |

**Installation:** 추가 설치 불필요 — 모든 의존성 이미 설치됨.

**Version verification:** `npm view next version` → 16.2.1 (설치 버전과 일치). `npm view @vercel/postgres version` → 0.10.0 (일치).

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── lib/
│   ├── instagram.ts     # fetchFeed(), syncToDb(), refreshToken() 순수 함수
│   └── db.ts            # @vercel/postgres sql 태그 re-export + 연결 헬퍼
├── app/
│   ├── api/
│   │   └── instagram/
│   │       ├── sync/
│   │       │   └── route.ts      # POST /api/instagram/sync
│   │       └── refresh-token/
│   │           └── route.ts      # POST /api/instagram/refresh-token
│   └── admin/
│       └── instagram-test/
│           └── page.tsx          # Spike UI (Server Component + Client sync 버튼)
└── types/
    └── instagram.ts      # InstagramPost, SyncResult 타입 정의
```

### Pattern 1: @vercel/postgres sql 태그 직접 사용

**What:** `sql` 태그 템플릿으로 parameterized 쿼리 작성. ORM 없음.
**When to use:** 모든 DB 쿼리 (이 프로젝트 전체 컨벤션)

```typescript
// Source: @vercel/postgres 0.10.0 type definitions
import { sql } from '@vercel/postgres'

// UPSERT 패턴 (post_id UNIQUE 활용)
await sql`
  INSERT INTO instagram_feed_cache (post_id, media_url, caption, permalink, post_timestamp, fetched_at)
  VALUES (${post.id}, ${post.media_url}, ${post.caption}, ${post.permalink}, ${post.timestamp}, NOW())
  ON CONFLICT (post_id) DO UPDATE SET
    media_url = EXCLUDED.media_url,
    caption = EXCLUDED.caption,
    permalink = EXCLUDED.permalink,
    post_timestamp = EXCLUDED.post_timestamp,
    fetched_at = NOW()
`
```

### Pattern 2: Next.js 16 Route Handler (async-only)

**What:** Route Handler에서 모든 Request-time API는 반드시 `await` 사용.
**When to use:** `/api/instagram/*` 엔드포인트 전체

```typescript
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md
// Source: node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md
export async function POST(request: Request) {
  // Next.js 16: cookies(), headers() 모두 await 필수
  // const cookieStore = await cookies()  // 필요 시
  const body = await request.json()
  return Response.json({ success: true, data: result })
}
```

### Pattern 3: Meta Graph API 토큰 갱신

**What:** 만료 60일 토큰을 단일 GET 요청으로 재발급.
**When to use:** `/api/instagram/refresh-token` 엔드포인트

```typescript
// Source: https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token/
const response = await fetch(
  `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
)
const data = await response.json()
// { access_token: string, token_type: 'bearer', expires_in: number }
```

### Pattern 4: Server Component에서 DB 캐시 읽기 (API 호출 없음)

**What:** 페이지 로드 시 캐시 데이터만 사용. API 호출은 수동 sync 시에만.
**When to use:** `/admin/instagram-test` 페이지 (D-08)

```typescript
// Server Component: 직접 DB 쿼리
import { sql } from '@vercel/postgres'

export default async function InstagramTestPage() {
  const { rows } = await sql`
    SELECT * FROM instagram_feed_cache
    ORDER BY post_timestamp DESC
    LIMIT 20
  `
  // rows를 그리드로 렌더링
}
```

### Anti-Patterns to Avoid

- **동기 params/cookies 접근:** Next.js 16에서 완전 제거됨. `const { id } = params` 대신 `const { id } = await params`
- **페이지 로드 시 Graph API 직접 호출:** D-08 위반. 항상 DB 캐시 먼저 읽기.
- **토큰을 코드에 하드코딩:** 환경변수 `INSTAGRAM_ACCESS_TOKEN` 사용 (보안 규칙)
- **next/image 없이 외부 이미지 사용:** `graph.instagram.com` 도메인을 `next.config.ts`의 `images.remotePatterns`에 추가 필요

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SQL parameterization | 직접 문자열 연결 | `sql` 태그 (`@vercel/postgres`) | SQL injection 방지. 이미 설치됨 |
| 인스타 oEmbed 파싱 | HTML 파싱 코드 | Graph API 직접 사용 (D-15~17 확정) | 이미 토큰/scope 검증 완료 |
| 토큰 만료 계산 | Date arithmetic | `expires_in` 초 단위 + Date.now() | API가 직접 반환 |
| 이미지 최적화 | img 태그 직접 사용 | `next/image` | CDN 최적화, 크기 조정 자동 |

**Key insight:** Instagram API 인프라는 이미 결정 + 검증됨. 이 Phase에서 새로 판단할 기술 스택 결정은 없다.

---

## Common Pitfalls

### Pitfall 1: next/image remotePatterns 미설정

**What goes wrong:** `graph.instagram.com` URL을 `next/image`에서 사용하면 빌드/런타임 에러 발생.
**Why it happens:** Next.js는 화이트리스트에 없는 외부 이미지 도메인을 차단.
**How to avoid:** `next.config.ts`에 `images: { remotePatterns: [{ protocol: 'https', hostname: '*.cdninstagram.com' }, { protocol: 'https', hostname: 'scontent*.cdninstagram.com' }] }` 추가.
**Warning signs:** `Error: Invalid src prop ... hostname "*.cdninstagram.com" is not configured`

> **Note:** 인스타그램 미디어 URL은 `graph.instagram.com`이 아니라 Meta CDN(`*.cdninstagram.com`, `scontent*.cdninstagram.com`)을 반환한다. 실제 URL을 먼저 확인 후 패턴 추가.

### Pitfall 2: Next.js 16 동기 Request API 사용

**What goes wrong:** `cookies()`, `headers()`, `params`를 await 없이 쓰면 런타임 에러.
**Why it happens:** v16에서 synchronous access 완전 제거 (v15는 compatibility shim 있었음).
**How to avoid:** 모든 Route Handler에서 `await cookies()`, `await headers()`, `const { id } = await params` 사용.
**Warning signs:** `Error: cookies() should be awaited` 또는 유사 메시지

### Pitfall 3: `media_url` 없는 VIDEO 포스트

**What goes wrong:** VIDEO 타입 포스트는 `media_url` 대신 `thumbnail_url`만 제공되는 경우 있음.
**Why it happens:** 저작권 미디어나 VIDEO 타입은 `media_url` 생략 가능 (Meta 공식 문서 확인).
**How to avoid:** DB 저장 시 `thumbnail_url`도 저장. UI 렌더링 시 `media_url ?? thumbnail_url` fallback.
**Warning signs:** 이미지 일부가 렌더링 안 됨

### Pitfall 4: 토큰 갱신 타이밍 조건

**What goes wrong:** 발급 후 24시간 이내 토큰은 갱신 불가. 만료 후 갱신도 불가.
**Why it happens:** Meta API 제약 — 24시간 이상 경과하고 아직 유효한 토큰만 갱신 가능.
**How to avoid:** refresh-token 엔드포인트에서 `expires_in`을 DB 또는 응답에 기록. 현재 토큰 만료일(~2026-05-27) 이전에 갱신 실행.
**Warning signs:** HTTP 400 with `{ error: { type: 'OAuthException' } }`

### Pitfall 5: `instagram_feed_cache` 테이블 미존재

**What goes wrong:** Phase 0 DB 초기화 후 테이블이 실제로 생성되었는지 확인 필요.
**Why it happens:** `scripts/schema.sql` 실행 여부를 코드로 가정하면 안 됨.
**How to avoid:** Phase 1 Wave 0에서 `SELECT 1 FROM instagram_feed_cache LIMIT 1` 쿼리로 테이블 존재 확인.
**Warning signs:** `relation "instagram_feed_cache" does not exist`

---

## Code Examples

### instagram.ts: fetchFeed 함수 구조

```typescript
// src/lib/instagram.ts
interface InstagramPost {
  id: string
  media_url: string
  thumbnail_url?: string
  caption?: string
  permalink: string
  timestamp: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
}

interface FeedResponse {
  data: InstagramPost[]
  paging?: {
    cursors: { before: string; after: string }
    next?: string
  }
}

export async function fetchFeed(accessToken: string): Promise<InstagramPost[]> {
  const url = new URL('https://graph.instagram.com/v25.0/me/media')
  url.searchParams.set('fields', 'id,caption,media_url,thumbnail_url,timestamp,media_type,permalink')
  url.searchParams.set('access_token', accessToken)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Instagram API error: ${JSON.stringify(err)}`)
  }
  const data: FeedResponse = await res.json()
  return data.data
}
```

### instagram.ts: refreshToken 함수 구조

```typescript
// Source: https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token/
export async function refreshToken(currentToken: string): Promise<{
  access_token: string
  token_type: string
  expires_in: number
}> {
  const url = new URL('https://graph.instagram.com/refresh_access_token')
  url.searchParams.set('grant_type', 'ig_refresh_token')
  url.searchParams.set('access_token', currentToken)

  const res = await fetch(url.toString())
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Token refresh failed: ${JSON.stringify(err)}`)
  }
  return res.json()
}
```

### db.ts: @vercel/postgres 연결 헬퍼

```typescript
// src/lib/db.ts
// @vercel/postgres는 POSTGRES_URL 환경변수 자동 탐지
export { sql } from '@vercel/postgres'
```

### Route Handler: Next.js 16 패턴

```typescript
// app/api/instagram/sync/route.ts
// Source: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md
export async function POST(_request: Request) {
  // Next.js 16: 동기 Request API 사용 금지
  // await cookies() 필요 시 사용
  try {
    // ... sync logic
    return Response.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json({ success: false, error: message }, { status: 500 })
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Instagram Basic Display API | Instagram Graph API (Business Login) | Deprecated 2024-12-04 | Basic Display API 사용 불가. Graph API 필수 |
| Next.js 15 동기 params | Next.js 16 async params (await 필수) | v16.0 (breaking) | `await params`, `await cookies()` 필수 |
| `next dev --turbopack` 플래그 | `next dev` (Turbopack 기본) | v16.0 | 플래그 불필요 (이미 반영됨 — package.json scripts 확인) |
| `experimental.turbopack` | 최상위 `turbopack` config | v16.0 | next.config.ts 수정 시 주의 |

**Deprecated/outdated:**
- Instagram Basic Display API: 2024-12-04 종료. oEmbed나 Graph API 사용.
- Next.js 15 synchronous Request APIs: v16에서 완전 제거.

---

## Open Questions

1. **인스타그램 미디어 URL CDN 도메인 정확한 패턴**
   - What we know: Meta CDN 사용 (`*.cdninstagram.com` 계열로 추정)
   - What's unclear: 정확한 hostname 패턴. `scontent*.cdninstagram.com`인지 다른 패턴인지.
   - Recommendation: Wave 0에서 실제 API 응답의 `media_url` 값을 확인 후 `next.config.ts` `remotePatterns` 설정.

2. **토큰 저장 위치 (D-11 — Claude's Discretion)**
   - What we know: 환경변수 `INSTAGRAM_ACCESS_TOKEN` 현재 사용. `company_profile` 또는 `app_config` 테이블 저장 검토 중.
   - What's unclear: `app_config` 테이블이 스키마에 없음.
   - Recommendation: `company_profile` 테이블에 `instagram_access_token TEXT, instagram_token_expires_at TIMESTAMPTZ` 컬럼 추가하거나, 환경변수 유지 + DB에 만료일만 기록. Spike 단계에서는 환경변수 유지가 단순.

3. **Phase 0 DB 스키마 적용 여부**
   - What we know: `scripts/schema.sql`에 `instagram_feed_cache` 정의됨.
   - What's unclear: Phase 0 UAT 결과(이슈 1건)에서 실제 테이블 생성 확인됨인지 불명확.
   - Recommendation: Wave 0 첫 태스크에서 테이블 존재 확인 쿼리 실행.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js 16 (min 20.9) | 확인 필요 | — | — |
| @vercel/postgres | DB 쿼리 전체 | ✓ | 0.10.0 | — |
| next | App Router + Route Handlers | ✓ | 16.2.1 | — |
| Meta Graph API | INST-01~03 전체 | ✓ (토큰 확인됨) | v25.0 | Behold.so / oEmbed (D-02) |
| INSTAGRAM_ACCESS_TOKEN env | API 호출 | ✓ (.env.local 확인됨) | — | — |
| DATABASE_URL env | DB 연결 | ✓ (.env.local 확인됨) | — | — |

**Missing dependencies with no fallback:** 없음.

**Missing dependencies with fallback:**
- Meta Graph API: 토큰 만료 또는 API 오류 시 D-02 fallback (Behold.so / oEmbed)

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | 없음 — 이 Spike 단계에서 테스트 프레임워크 미설치 |
| Config file | 없음 |
| Quick run command | `npm run build` (타입체크 + 빌드 통과로 검증) |
| Full suite command | `npm run lint && npm run build` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INST-01 | /admin/instagram-test 페이지에 그리드 렌더링 | smoke (브라우저 수동) | `npm run build` | ❌ Wave 0 |
| INST-02 | DB 캐시 데이터만으로 피드 표시 | smoke (수동 — DB 직접 확인) | `npm run build` | ❌ Wave 0 |
| INST-03 | 토큰 갱신 엔드포인트 응답 확인 | smoke (curl 수동) | `npm run build` | ❌ Wave 0 |

> Spike 단계는 기술 검증이 목적. 테스트 자동화보다 실제 API 동작 확인이 우선. 빌드+타입체크 통과를 최소 gate로 한다.

### Sampling Rate

- **Per task commit:** `npm run build` (타입 에러 없음 확인)
- **Per wave merge:** `npm run lint && npm run build`
- **Phase gate:** 수동 smoke test — 브라우저에서 `/admin/instagram-test` 열어 그리드 확인

### Wave 0 Gaps

- [ ] `instagram_feed_cache` 테이블 존재 확인 (DB 쿼리 수동 실행)
- [ ] `next.config.ts` `images.remotePatterns` 설정 (실제 media_url 도메인 확인 후)
- [ ] `src/lib/db.ts` — sql re-export
- [ ] `src/lib/instagram.ts` — 빈 파일 → 구현 대상
- [ ] `src/types/instagram.ts` — InstagramPost 타입 정의

---

## Project Constraints (from CLAUDE.md + AGENTS.md)

- **AGENTS.md (최우선):** "This is NOT the Next.js you know — read `node_modules/next/dist/docs/` before writing code." → Next.js 16 breaking changes 반영됨 (async Request APIs).
- **ORM 금지:** `@vercel/postgres`의 `sql` 태그 직접 사용 (Drizzle/Prisma 설치 금지).
- **시크릿 하드코딩 금지:** 모든 API 키/토큰은 환경변수 사용.
- **`any` 타입 금지:** `unknown`으로 에러 타입 처리.
- **함수 크기:** 50줄 이내 권장, 파일 800줄 이하.
- **불변성 원칙:** 객체 변이 금지, 새 객체 반환.
- **에러 처리:** 에러를 조용히 삼키지 않음. 명시적 throw 또는 에러 Response 반환.

---

## Sources

### Primary (HIGH confidence)

- `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` — Next.js 16 breaking changes (async Request APIs, Turbopack default)
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` — Route Handler API (params async, Response.json 패턴)
- `node_modules/@vercel/postgres/dist/index.d.ts` — sql 태그 타입 정의, VercelPool API
- `https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token/` — 토큰 갱신 엔드포인트 (grant_type, response 형식)
- `scripts/schema.sql` — instagram_feed_cache 테이블 스키마

### Secondary (MEDIUM confidence)

- Meta Developers 공식 사이트 (WebFetch) — IG-Media 필드 목록 (media_type 값: IMAGE/VIDEO/CAROUSEL_ALBUM, thumbnail_url VIDEO 전용)
- Meta Developers 공식 사이트 (WebFetch) — `instagram_business_basic` scope가 refresh_access_token에 필요한 permission임 확인

### Tertiary (LOW confidence)

- WebSearch: 인스타 미디어 CDN 도메인 패턴 (`*.cdninstagram.com`) — 실제 API 응답으로 검증 필요

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — 모든 라이브러리 설치 확인, 버전 npm registry 대조
- Architecture: HIGH — Next.js 16 공식 docs 직접 확인, @vercel/postgres 타입 정의 확인
- Meta API patterns: HIGH — 공식 Meta Developers 문서 WebFetch로 확인
- CDN 도메인 패턴: LOW — WebSearch만. Wave 0에서 실제 응답으로 검증 필요

**Research date:** 2026-03-27
**Valid until:** 2026-04-27 (Meta API는 안정적, Next.js minor 업데이트 주시)
