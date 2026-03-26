# A Feel Company 웹사이트 MVP 구축 플랜

## Context

어필컴퍼니는 패션 스타마케팅 전문 PR 에이전시(2018~)로, 현재 수동으로 PDF 소개서를 만들어 클라이언트에게 전달하고 있다. 웹사이트와 포트폴리오를 통합 관리하고, PDF 소개서도 사이트 데이터 기반으로 생성하고 싶은 니즈가 있다.

- **목표**: 패션 브랜드(잠재 클라이언트) 대상 영업용 웹사이트 MVP
- **접근**: 기능 검증(Spike) → 프로토타입 → 전체 사이트 순서로 진행
- **핵심 문서**: `.planning/PROJECT.md` (본 플랜의 상위 기준)
- **제약**: 비개발자 클라이언트에게 기능 중심 프로토타입을 빠르게 보여줘야 함

> PROJECT.md의 Out of Scope/Constraints를 존중하며, 그 범위 안에서 최선의 구현을 설계한다.

---

## 기술 스택

| 영역 | 선택 | 근거 |
|------|------|------|
| 프레임워크 | **Next.js 15 (App Router)** | Vercel 최적화, SSR/ISR, PROJECT.md 확정 |
| UI | **Tailwind CSS + shadcn/ui** | PROJECT.md 확정. 빠른 프로토타이핑 |
| 배포 | **Vercel (Hobby → Pro)** | PROJECT.md 확정 |
| DB | **Vercel Postgres** | 메타데이터 전용. `@vercel/postgres` SDK 직접 사용 |
| 파일 저장 | **Vercel Blob** | next/image 자동 최적화, CDN 포함 |
| 인증 | **환경변수 기반 단순 인증** | PROJECT.md: 복잡한 인증 Out of Scope |
| PDF | **`/pdf-export` 전용 라우트 + @media print** | PROJECT.md: Puppeteer Out of Scope |
| 인스타 연동 | **Meta Graph API (Dev Mode)** | 읽기+DB캐싱. 쓰기는 검증 후 결정 |

### ORM을 쓰지 않는 이유
- 테이블 5개, 관리자 1~2명의 소규모 MVP
- `@vercel/postgres`의 `sql` 템플릿 태그로 충분한 타입 안전성
- Drizzle/Prisma는 cold start 오버헤드 추가 + 학습 비용
- 복잡해지는 시점에 도입 검토 (YAGNI 원칙)

### PDF: 브라우저 인쇄 방식의 구체적 동작
1. `/pdf-export` 라우트: 가로형 A4 레이아웃의 전용 HTML 페이지
2. `@media print` CSS로 인쇄 최적화 (여백, 페이지 나눔, 배경색 강제 등)
3. 관리자 → "소개서 다운로드" 클릭 → 해당 페이지 열림 → `window.print()` 자동 호출
4. 브라우저 인쇄 다이얼로그에서 "PDF로 저장" 선택
5. **장점**: 서버 부담 제로, Vercel 제약 없음, 실제 브라우저 렌더링 퀄리티
6. **단점**: 수동 단계 1개(인쇄 다이얼로그), 브라우저마다 미세한 차이
7. **향후**: 퀄리티/자동화 필요 시 Vercel Pro + Puppeteer로 업그레이드 경로 열림

---

## 구현 로드맵 (MECE)

전체 작업을 6개 Phase로 분리. 각 Phase는 **독립적으로 검증 가능**하며, 이전 Phase의 산출물에 의존한다.

```
Phase 0: 스캐폴딩 ─────────────────────────────────────┐
Phase 1: Spike — 인스타 API 검증 ──┐                     │
Phase 2: Spike — PDF 출력 검증 ────┤ (1,2는 병렬 가능)    │
                                   ↓                     │
         검증 결과 리뷰 + 방향 확정                       │
                                   ↓                     │
Phase 3: 데이터 레이어 + 관리자 ───────────────────────────┘
Phase 4: 공개 사이트
Phase 5: 통합 + 런칭
```

---

## Phase 0: 프로젝트 스캐폴딩

**목표**: 빈 프로젝트 → 동작하는 Next.js 앱 + DB/Blob 연결

### 작업
- [ ] `create-next-app`으로 프로젝트 생성 (App Router, TypeScript, Tailwind, src/ 디렉토리)
- [ ] shadcn/ui 초기화 + 기본 컴포넌트 설치 (Button, Input, Dialog, Card)
- [ ] Vercel 프로젝트 생성 + Git 연결
- [ ] Vercel Postgres 프로비저닝 + 환경변수 설정
- [ ] Vercel Blob 스토어 생성 + 환경변수 설정
- [ ] DB 스키마 생성 (SQL 마이그레이션 파일)
- [ ] 프로젝트 폴더 구조 생성
- [ ] 초기 배포 확인 (빈 페이지가 Vercel에서 열리는지)

### 프로젝트 구조
```
src/
├── app/
│   ├── (public)/              # 공개 페이지 레이아웃 그룹
│   │   ├── page.tsx           # 홈
│   │   ├── about/page.tsx
│   │   ├── portfolio/page.tsx
│   │   ├── feed/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/                 # 관리자 영역
│   │   ├── layout.tsx         # 인증 체크 래퍼
│   │   ├── page.tsx           # 대시보드
│   │   ├── upload/page.tsx
│   │   ├── portfolio/page.tsx
│   │   ├── instagram/page.tsx
│   │   └── brochure/page.tsx
│   ├── pdf-export/page.tsx    # PDF 전용 인쇄 라우트
│   ├── api/
│   │   ├── upload/route.ts
│   │   ├── portfolio/route.ts
│   │   ├── instagram/route.ts
│   │   └── auth/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                    # shadcn 컴포넌트
│   ├── layout/                # Header, Footer, Nav
│   ├── portfolio/             # 갤러리 카드, 그리드, 필터, 라이트박스
│   └── admin/                 # 업로드 폼, 테이블 등
├── lib/
│   ├── db.ts                  # @vercel/postgres 연결 + 쿼리 헬퍼
│   ├── blob.ts                # Vercel Blob 업로드 헬퍼
│   ├── instagram.ts           # Meta Graph API 헬퍼
│   └── auth.ts                # 단순 인증 로직
└── types/
    └── index.ts
```

### DB 스키마 (SQL)
```sql
-- 포트폴리오 아이템 (갤러리)
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  celebrity_name TEXT,
  category TEXT NOT NULL,            -- 상의/하의/신발/악세서리/기타
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  show_on_web BOOLEAN DEFAULT true,
  show_on_pdf BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인스타그램 게시 대기열
CREATE TABLE instagram_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_item_id UUID REFERENCES portfolio_items(id),
  caption TEXT,
  status TEXT DEFAULT 'draft',       -- draft/pending/published/failed
  published_at TIMESTAMPTZ,
  external_post_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인스타그램 피드 캐시
CREATE TABLE instagram_feed_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id TEXT UNIQUE NOT NULL,
  media_url TEXT NOT NULL,
  caption TEXT,
  permalink TEXT,
  post_timestamp TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- 회사 프로필 (단일 row)
CREATE TABLE company_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  about_text TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  pdf_sections JSONB DEFAULT '[]',   -- PDF 섹션 구성/순서
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 클라이언트 브랜드 로고
CREATE TABLE client_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 검증
- `vercel dev`로 로컬 실행 확인
- DB 연결 확인 (간단한 SELECT 쿼리)
- Vercel 배포 URL 접근 확인

### 산출물
- 동작하는 빈 Next.js 앱 (로컬 + Vercel)
- DB 테이블 생성 완료
- Blob 스토어 연결 완료

---

## Phase 1: Spike — 인스타그램 API 검증

**목표**: Meta Graph API로 (a) 피드 읽기 (b) 게시 쓰기가 가능한지 기술 검증
**의존**: Phase 0 (프로젝트 존재)

### 사전 확인 (클라이언트에게)
- [ ] 어필컴퍼니 인스타 계정이 **비즈니스/크리에이터** 계정인지
- [ ] **Facebook Page**에 인스타 계정이 연결되어 있는지
- [ ] Meta Developer 계정 접근 가능한지

### 작업
- [ ] Meta Developer 앱 생성 + Instagram Graph API 활성화
- [ ] 관리자를 테스터로 등록 (Development Mode)
- [ ] OAuth 토큰 발급 + 장기 토큰(60일) 교환
- [ ] **읽기 구현**: `GET /{user-id}/media` → DB 캐시 저장 → 간단한 그리드 렌더링
- [ ] **쓰기 구현**: Container 생성 → Publish 플로우 → 성공/실패 확인
- [ ] 토큰 갱신 로직 (만료 전 자동 갱신)

### 검증 기준
| 항목 | Pass 기준 |
|------|-----------|
| 피드 읽기 | 인스타 피드 이미지+캡션이 웹에 렌더링됨 |
| DB 캐시 | API 호출 없이 캐시된 데이터로 피드 표시됨 |
| 피드 쓰기 | 테스트 이미지가 인스타에 게시됨 |
| 토큰 관리 | 장기 토큰 발급 + 갱신 로직 동작 |

### 대안 (읽기 전용 간소화)
- **Behold.so** (무료 티어): 인스타 피드 JSON API, 개발 공수 최소
- **인스타 oEmbed**: 개별 포스트 임베드만 가능, 피드 전체 불가

### 산출물
- 인스타 읽기/쓰기 가능 여부 결론
- 동작하는 피드 표시 프로토타입 페이지
- 제약사항 문서화 (레이트 리밋, 토큰 관리 등)

---

## Phase 2: Spike — PDF 회사소개서 출력 검증

**목표**: `/pdf-export` 전용 라우트 + 브라우저 인쇄로 가로형 PDF가 품질 있게 나오는지 검증
**의존**: Phase 0 (프로젝트 존재)

### 작업
- [ ] `/pdf-export` 페이지 생성 (가로형 A4 레이아웃)
- [ ] `@media print` CSS 작성
  - 가로 방향 강제: `@page { size: A4 landscape; }`
  - 페이지 나눔: `page-break-before`, `page-break-inside: avoid`
  - 배경색/이미지 인쇄 강제: `-webkit-print-color-adjust: exact`
  - 내비게이션/푸터 숨김
- [ ] 섹션 구성: 표지 → ABOUT → WORK(포트폴리오 이미지 그리드) → CLIENT 로고 → 연락처
- [ ] 한글 폰트 적용 (Pretendard 또는 Noto Sans KR)
- [ ] 더미 데이터로 PDF 출력 테스트
- [ ] `window.print()` 자동 호출 + "다운로드" 버튼 UI

### 검증 기준
| 항목 | Pass 기준 |
|------|-----------|
| 가로형 레이아웃 | A4 가로로 정확히 출력됨 |
| 한글 | 텍스트 깨짐 없음 |
| 이미지 | 갤러리 이미지가 선명하게 포함됨 |
| 페이지 나눔 | 섹션이 적절히 분리됨 (이미지 잘림 없음) |
| 디자인 | 기존 소개서 대비 수용 가능한 퀄리티 |
| 크로스 브라우저 | Chrome + Safari에서 동일하게 나옴 |

### 퀄리티 부족 시 대안 경로
1. **클라이언트 사이드 라이브러리**: `html2canvas` + `jsPDF` (래스터화, 품질 타협)
2. **외부 API 서비스**: DocRaptor ($15/월) 또는 PDFShift ($9/월)
3. **Vercel Pro + Puppeteer**: `puppeteer-core` + `@sparticuz/chromium` (Pro 전환 시)

### 산출물
- 브라우저 인쇄 방식 퀄리티 평가 결론
- 동작하는 `/pdf-export` 프로토타입 페이지
- 대안 필요 여부 판단

---

## Phase 1~2 완료 후: 검증 결과 리뷰

> Phase 3 진입 전, Spike 결과를 기반으로 방향을 확정한다.

### 의사결정 포인트

| 질문 | 선택지 |
|------|--------|
| 인스타 읽기 | Graph API 직접 구현 vs Behold.so 위젯 |
| 인스타 쓰기 | MVP 포함 vs 후순위 |
| PDF 방식 | 브라우저 인쇄 유지 vs 외부 API vs Puppeteer(Pro) |
| Vercel 플랜 | Hobby 유지 vs Pro 전환 |

---

## Phase 3: 데이터 레이어 + 관리자 페이지

**목표**: 관리자가 포트폴리오를 업로드/관리할 수 있는 완전한 백엔드
**의존**: Phase 0 (DB/Blob) + Phase 1~2 검증 결과

### 3-A: 인증
- [ ] 환경변수 기반 단순 인증 (`ADMIN_PASSWORD`)
- [ ] 로그인 페이지 (비밀번호 입력 → 쿠키/세션 발급)
- [ ] `/admin/*` 라우트 미들웨어 보호
- [ ] 로그아웃 기능

### 3-B: 이미지 업로드
- [ ] 업로드 API 라우트 (`/api/upload`)
  - Vercel Blob에 파일 저장
  - DB에 메타데이터 INSERT
- [ ] 관리자 업로드 UI
  - 드래그&드롭 또는 파일 선택
  - 메타데이터 입력 폼: 제목, 브랜드명, 셀럽명, 카테고리 선택
  - 용도 선택: 웹 갤러리 / 인스타 / 둘 다
  - 클라이언트 사이드 이미지 리사이즈 (max 2000px, 품질 80%)
- [ ] 업로드 진행 표시 + 성공/실패 피드백

### 3-C: 포트폴리오 관리
- [ ] 아이템 목록 (테이블 뷰: 썸네일, 제목, 브랜드, 상태)
- [ ] 인라인 편집 또는 편집 모달
- [ ] 웹/PDF 노출 토글
- [ ] 순서 변경 (sort_order 업데이트)
- [ ] 삭제 (Blob + DB)

### 3-D: 회사 프로필 편집
- [ ] 회사소개 문구 편집
- [ ] 연락처 정보 편집
- [ ] 클라이언트 브랜드 로고 관리 (추가/삭제/순서)

### 3-E: 인스타그램 관리 (Phase 1 결과 반영)
- [ ] 게시 대기열 UI (이미지 선택 + 캡션 입력)
- [ ] 게시 버튼 + 상태 표시 (성공/실패)
- [ ] 피드 캐시 수동 새로고침 버튼

### 3-F: PDF 소개서 관리
- [ ] PDF에 포함할 포트폴리오 항목 선택/순서 편집
- [ ] "소개서 미리보기" → `/pdf-export` 페이지 열기
- [ ] "PDF 다운로드" → `window.print()` 트리거

### 검증
- 관리자 로그인 → 이미지 업로드 → DB에 저장 확인
- 업로드한 이미지가 Vercel Blob에 존재 확인
- 포트폴리오 목록에서 수정/삭제 동작 확인
- 회사 프로필 수정 → DB 반영 확인

### 산출물
- 완전한 관리자 대시보드
- 데이터 CRUD API 전체

---

## Phase 4: 공개 사이트

**목표**: 방문자(패션 브랜드 클라이언트)가 보는 프론트엔드
**의존**: Phase 3 (데이터가 존재해야 의미있음)

### 디자인 방향
- 레퍼런스: bienbien.co.kr — 다크 배경, 미니멀, 에디토리얼 톤
- 영문 내비게이션 라벨 (패션 업계 관행)
- 모바일 반응형
- **MVP는 기능 동작 우선**, 디자인 고도화는 후속 Phase

### 페이지별 구현
- [ ] **공통 레이아웃**: 헤더(로고 + 내비) + 푸터(연락처 + SNS)
- [ ] **HOME**: 히어로 영역 + 최신 포트폴리오 미리보기 (3~6개)
- [ ] **ABOUT**: 회사 소개 텍스트 + 업무 프로세스 + 클라이언트 로고 그리드
- [ ] **PORTFOLIO**: 이미지 그리드 + 카테고리 필터 + 라이트박스(모달) + 페이지네이션
- [ ] **FEED**: 인스타 피드 그리드 (캐시 DB에서 렌더링)
- [ ] **CONTACT**: 연락처 정보 표시 (이메일 링크 또는 간단 폼)

### 검증
- 모든 페이지 데스크탑 + 모바일에서 렌더링 확인
- 포트폴리오 카테고리 필터 동작 확인
- 라이트박스 열기/닫기/네비게이션 확인
- 인스타 피드 그리드 정상 표시 확인
- Lighthouse 기본 점수 확인 (Performance, Accessibility)

### 산출물
- 5개 공개 페이지 완성
- 반응형 레이아웃

---

## Phase 5: 통합 + 런칭

**목표**: 전체 플로우 검증 + 프로덕션 배포
**의존**: Phase 3 + Phase 4

### 작업
- [ ] **E2E 플로우 검증**
  - 관리자 로그인 → 업로드 → 웹 갤러리 반영 확인
  - 포트폴리오 PDF 포함 설정 → `/pdf-export` 반영 확인
  - 인스타 게시 → 피드 캐시 갱신 → FEED 페이지 반영 확인
- [ ] **SEO 기본 설정**: 메타태그, OG 이미지, robots.txt, sitemap.xml
- [ ] **에러 처리**: 404 페이지, API 에러 응답, 로딩 상태
- [ ] **이미지 최적화**: next/image 설정, Blob URL 허용
- [ ] **도메인 연결**: Vercel에 커스텀 도메인 + HTTPS
- [ ] **초기 데이터 입력**: 기존 소개서 내용 기반 회사 프로필 + 클라이언트 브랜드 로고
- [ ] **클라이언트 검수**: 프로토타입 데모 + 피드백 수집

### 검증
- 커스텀 도메인으로 모든 기능 동작 확인
- 비개발자(클라이언트)가 관리자 페이지 사용 가능한지 확인
- PDF 출력물을 클라이언트가 수용하는지 확인

### 산출물
- 프로덕션 배포 완료
- 클라이언트 핸드오프

---

## 비용 예측

| 항목 | Hobby (무료) | Pro ($20/월) |
|------|-------------|-------------|
| Vercel 호스팅 | O | O |
| Postgres | 256MB, 60h 컴퓨트 | 512MB, 100h |
| Blob | 500MB, 1GB 대역폭 | 1GB, 5GB 대역폭 |
| Serverless 타임아웃 | **10초** | **60초** |
| Meta API | 무료 | 무료 |

> MVP는 Hobby로 시작. PDF 생성을 Puppeteer로 업그레이드하거나, 이미지가 500MB를 초과하면 Pro 전환.

---

## 리스크 & 대응

| # | 리스크 | 영향 | 대응 |
|---|--------|------|------|
| 1 | 인스타 비즈니스 계정 미전환 | 쓰기 API 불가 | **사전 확인 필수**. 읽기만 먼저 구현 |
| 2 | 브라우저 인쇄 PDF 퀄리티 부족 | 클라이언트 불만족 | Phase 2에서 조기 검증. 대안 경로 3개 준비 |
| 3 | Meta 토큰 60일 만료 | 연동 끊김 | 자동 갱신 + 만료 7일 전 알림 |
| 4 | Blob 500MB 초과 | 유료 전환 필요 | 업로드 시 리사이즈(max 2000px, ~200KB) |
| 5 | Vercel Hobby 10초 타임아웃 | 무거운 API 실패 | 가벼운 구현 유지. 필요 시 Pro |

---

## 미결 사항 (클라이언트 확인 필요)

1. **인스타 비즈니스 계정 + Facebook Page 연결 여부** — Phase 1 전제조건
2. **PDF 디자인 톤** — 기존 소개서(흑백 세리프) 유지? 새로운 방향?
3. **포트폴리오 카테고리 최종안** — 의류 카테고리(상의/하의/신발/기타) vs 브랜드별 vs 복합
4. **인스타 쓰기 MVP 포함 여부** — 읽기만 먼저 vs 쓰기도 포함
5. **Vercel Pro 전환 시점** — Hobby 한계 도달 시 즉시 전환 가능한지
