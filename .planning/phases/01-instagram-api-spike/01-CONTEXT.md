# Phase 1: Spike — 인스타그램 API 검증 - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Meta Instagram Business API (Graph API v25.0)로 피드 읽기가 실제로 동작하는지 기술 검증한다.
구체적으로: 토큰으로 피드 fetch → DB 캐싱 → 페이지에 그리드 렌더링 + 장기 토큰 갱신 흐름 확인.
게시 쓰기(INST-04~05)는 이번 Spike 범위 밖이며, 읽기 검증 완료 후 별도 판단.

**포함 (INST-01~03):**
- INST-01: 인스타 피드(이미지+캡션)를 Meta API로 읽어 웹에 그리드 렌더링
- INST-02: 읽어온 데이터를 DB(`instagram_feed_cache`)에 캐싱, API 없이 표시
- INST-03: 장기 토큰(60일) 발급 + 갱신 흐름 구현

**제외 (INST-04~05 — deferred):**
- 인스타그램 게시 쓰기 (Development Mode 포함)
- 게시 상태 추적 DB 기록

</domain>

<decisions>
## Implementation Decisions

### 스코프: 읽기 전용
- **D-01:** 이번 Spike는 INST-01~03만 구현. INST-04~05(쓰기)는 읽기 검증 완료 후 v2 또는 별도 Phase에서 결정.
- **D-02:** Spike 실패 시 대안: Behold.so 무료 티어 또는 인스타 oEmbed 사용 (ROADMAP에 명시된 fallback).

### 피드 UI 수준
- **D-03:** Spike 증명용 최소 UI. 3컬럼 그리드 + 이미지 + 캡션 텍스트만 표시. 스타일링 최소화.
- **D-04:** `/instagram-test` 또는 `/admin/instagram-test` 라우트로 노출. 공개 사이트 UI(Phase 4)는 별도 구현.
- **D-05:** Phase 4에서 InstagramGrid 컴포넌트 새로 설계. Spike 컴포넌트는 throwaway.

### 캐시 갱신 전략
- **D-06:** Vercel Hobby — cron job 없음. 대신 `/api/instagram/sync` API 라우트로 수동 트리거.
- **D-07:** DB에 `fetched_at` 컬럼 활용. 1시간 이상 지났으면 sync 권장 표시. 강제 갱신은 수동.
- **D-08:** 페이지 로드 시 캐시 데이터 우선 표시 (API 호출 없음). 최신성보다 안정성 우선.

### 토큰 갱신 전략
- **D-09:** 현재 토큰 만료일: ~2026-05-27 (약 2개월). 환경변수 `INSTAGRAM_ACCESS_TOKEN`으로 관리.
- **D-10:** `/api/instagram/refresh-token` 엔드포인트 구현. 관리자가 수동 호출하거나 만료 임박 시 알림.
- **D-11:** 갱신된 토큰은 DB `company_profile` 테이블 또는 별도 `app_config` 키에 저장 검토. 환경변수 업데이트는 Vercel 대시보드에서 수동으로.
- **D-12:** 만료 7일 전 콘솔 경고 로그 출력 (서버 시작 시 체크). 이메일 알림은 MVP 범위 밖.

### API 설정 (확인된 값)
- **D-13:** App ID: `929430673039555` (mvp-test-IG)
- **D-14:** Instagram User ID: `17841401385340013`
- **D-15:** 토큰 scope: `instagram_business_basic` — 피드 읽기에 필요한 scope 확인됨.
- **D-16:** API 베이스: `https://graph.instagram.com/v25.0/`
- **D-17:** 피드 endpoint: `GET /me/media?fields=id,caption,media_url,thumbnail_url,timestamp,media_type`

### Claude's Discretion
- `src/lib/instagram.ts` 내부 함수 설계 (fetchFeed, syncToDb, refreshToken 등)
- API 에러 핸들링 방식 (retry 횟수, timeout)
- DB upsert 로직 (`post_id` unique key 활용)
- 토큰 저장 위치 (환경변수 vs DB — 읽기 편한 쪽)

</decisions>

<specifics>
## Specific Ideas

- Spike UI는 "API 연결 OK" 수준이면 충분 — 보기 좋을 필요 없음
- 토큰 갱신은 수동이지만 "언제 갱신해야 하는지" 명확히 보여야 함 (만료일 표시)
- 인스타 피드 미리보기 페이지는 관리자만 볼 수 있는 위치에 두는 것이 적합 (`/admin/` prefix)

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 프로젝트 요구사항
- `.planning/REQUIREMENTS.md` §인스타그램 연동 (INST) — INST-01~03 체크리스트 (이번 Spike 대상)
- `.planning/PROJECT.md` §Constraints — Vercel Hobby 제약, 인스타 Development Mode 제약
- `.planning/ROADMAP.md` §Phase 1 — Spike 실패 시 대안(Behold.so, oEmbed) 명시

### DB 스키마
- `scripts/schema.sql` — `instagram_feed_cache` 테이블 정의 (post_id, media_url, caption, permalink, post_timestamp, fetched_at)
- `scripts/schema.sql` — `instagram_queue` 테이블 정의 (INST-04~05용, 이번 Spike에서는 미사용)

### 기존 코드
- `src/lib/instagram.ts` — 빈 파일. 이 Phase에서 구현 대상.
- `src/lib/db.ts` — 빈 파일. DB 연결 유틸 구현 필요.
- `.env.local` — INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET, INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID 설정됨.

### 기술 참고
- Next.js App Router: `node_modules/next/dist/docs/` — API 라우트, Server Actions 관련 최신 문법 확인 필수

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/db.ts` — 빈 파일. `@vercel/postgres`의 `sql` 태그 사용 (Phase 0 D-02 결정).
- `scripts/schema.sql` — `instagram_feed_cache` 테이블: post_id UNIQUE 키로 upsert 활용 가능.
- shadcn/ui Card 컴포넌트 — 설치됨. Spike UI에서 이미지 카드로 재사용 가능.

### Established Patterns
- ORM 없이 `sql` 템플릿 태그 직접 사용 (Phase 0 D-02).
- 환경변수로 시크릿 관리 (모든 API 키는 `.env.local`에 있음).

### Integration Points
- `instagram_feed_cache` 테이블 — fetch한 포스트 데이터 저장/조회.
- `/api/instagram/*` API 라우트 — fetch, sync, refresh-token 엔드포인트.
- `/admin/instagram-test` 또는 유사 페이지 — Spike UI 진입점.

</code_context>

<deferred>
## Deferred Ideas

- **INST-04: 인스타그램 게시 쓰기** — 읽기 검증 완료 후 별도 판단. MVP 포함 여부 미결.
- **INST-05: 게시 상태 추적** — INST-04와 함께.
- **자동 토큰 갱신** — Vercel Hobby cron 없음. Pro 전환 시 또는 외부 cron 서비스 사용 시 자동화 가능.
- **Phase 4 InstagramGrid 컴포넌트** — Spike와 별도로 Phase 4에서 디자인/구현.

</deferred>

---

*Phase: 01-instagram-api-spike*
*Context gathered: 2026-03-27*
