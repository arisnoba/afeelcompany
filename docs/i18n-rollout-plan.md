# 다국어 지원 준비 메모

기준일: 2026-04-24
대상: 공개 웹사이트에 영어, 중국어(간체) 추가

## 목표

- 현재 공개 사이트에 한국어 기본 구조를 유지한 채 영어, 중국어를 추가한다.
- 관리자 페이지는 이번 범위에서 제외한다.
- SEO, sitemap, 메타데이터, 언어 전환 경로까지 함께 정리한다.

## 현재 상태 요약

- 공개 라우트는 `src/app/(public)` 아래에 직접 정의되어 있다.
- 공용 헤더/푸터는 locale 개념 없이 절대 경로를 사용한다.
  - `src/components/site/SiteHeader.tsx`
  - `src/components/site/SiteFooter.tsx`
- 루트 레이아웃의 `<html lang>` 값이 고정 `ko`다.
  - `src/app/layout.tsx`
- 페이지 메타데이터와 OG locale 이 한국어 기준으로 고정되어 있다.
  - `src/lib/seo.ts`
- sitemap/robots 역시 단일 언어 URL만 생성한다.
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`
- 공개 페이지 카피는 상당수가 하드코딩이다.
  - `src/app/(public)/*`
  - `src/components/site/*`
  - `src/lib/company-copy.ts`
- 문의 폼, 포트폴리오 필터, 빈 상태 문구도 번역 대상이다.
  - `src/components/site/ContactInquiryForm.tsx`
  - `src/components/site/PortfolioGalleryClient.tsx`
  - `src/components/site/BrandLogoGrid.tsx`
  - `src/components/site/InstagramFeedGrid.tsx`
- 일부 공개 데이터는 DB에서 직접 읽는다.
  - 회사 소개문: `company_profile.about_text`
  - 연락처/주소: `company_profile.contact_*`, `address`
  - 포트폴리오: `portfolio_items.title`, `brand_name`, `celebrity_name`, `category`

## 권장 범위 결정

- 이번 작업 범위는 공개 사이트만 처리한다.
- 번역 언어 코드는 `ko`, `en`, `zh`를 권장한다.
- 중국어는 간체 기준으로 진행한다.
- 기존 한국어 URL은 유지한다.
  - `/`
  - `/about`
  - `/partner`
  - `/portfolio`
  - `/contact`
- 추가 언어는 서브패스로 분리한다.
  - `/en`
  - `/en/about`
  - `/zh`
  - `/zh/about`

이유:

- 기존 검색 인덱스와 외부 링크를 최대한 보존할 수 있다.
- 현재 헤더/푸터가 locale 없는 절대 경로를 사용하고 있어, 기본 언어를 루트에 남기는 쪽이 회귀 위험이 낮다.
- App Router 구조를 전면 재배치하지 않고도 단계적으로 적용할 수 있다.

## 구현 전략

### 1. locale 기반 라우팅 뼈대 추가

- locale 정의 파일을 추가한다.
  - 예시: `src/i18n/config.ts`
- 경로 생성 유틸을 추가한다.
  - 예시: `getLocalizedPath(locale, pathname)`
- 언어 전환기에서 현재 경로를 유지한 채 locale 만 바꾸도록 설계한다.

### 2. App Router 구조 정리

- 공개 페이지를 locale 세그먼트 기반으로 감쌀 수 있게 이동한다.
- 최소 변경 기준 권장 구조:
  - `src/app/[locale]/(public)/...`
  - 기존 루트 공개 경로는 `ko` 렌더링 또는 redirect 처리
- `layout.tsx` 또는 locale 하위 layout 에서 `<html lang>`를 동적으로 설정한다.

주의:

- Next 16 문서 기준으로 App Router i18n 은 `app/[lang]` 세그먼트와 locale 별 dictionary 로 가는 패턴이 안전하다.
- 관련 참고 문서:
  - `node_modules/next/dist/docs/01-app/02-guides/internationalization.md`

### 3. 번역 dictionary 도입

- 라이브러리 추가 없이 서버 전용 JSON dictionary 로 시작한다.
- 권장 파일:
  - `src/i18n/dictionaries/ko.json`
  - `src/i18n/dictionaries/en.json`
  - `src/i18n/dictionaries/zh.json`
  - `src/i18n/get-dictionary.ts`
- 정적 카피는 모두 dictionary key 로 옮긴다.
- 클라이언트 컴포넌트에는 필요한 텍스트만 props 로 내려보낸다.

이유:

- 현재 사이트 규모에서는 `next-intl` 같은 의존성이 아직 필수는 아니다.
- 작은 변경으로 끝낼 수 있고, 서버 컴포넌트 중심 구조와도 잘 맞는다.

### 4. 번역 우선 대상

- 라우트 레벨 메타데이터
  - 홈
  - 회사 소개
  - 파트너
  - 포트폴리오
  - 문의
- 공용 네비게이션/푸터
- 빈 상태 문구
- 문의 폼 라벨, placeholder, 성공/오류 메시지
- 포트폴리오 카테고리 필터명
- Workflow/서비스 소개 섹션 문구

### 5. DB 기반 콘텐츠 처리 방안

정적 UI 문구와 달리 아래 항목은 데이터 모델 결정을 먼저 해야 한다.

- `company_profile.about_text`
- `portfolio_items.title`
- `portfolio_items.brand_name`
- `portfolio_items.celebrity_name`
- `portfolio_items.category`

권장안:

- 1차 배포에서는 DB 원문은 한국어 유지
- UI 문구와 메타데이터만 먼저 다국어화
- 이후 필요 시 번역 컬럼 또는 JSONB 로 확장

이유:

- 지금 바로 DB 스키마까지 바꾸면 작업 범위가 크게 커진다.
- 브랜드명/인명은 번역하지 않는 경우가 많아 초기 다국어 공개에는 원문 유지가 현실적이다.
- 포트폴리오 카테고리는 코드에서 관리 중이므로 별도 locale label 매핑으로 먼저 해결 가능하다.

## 예상 수정 파일

- 라우팅/레이아웃
  - `src/app/layout.tsx`
  - `src/app/(public)/*`
  - 신규 `src/app/[locale]/...`
- SEO
  - `src/lib/seo.ts`
  - `src/app/sitemap.ts`
  - `src/app/robots.ts`
- 공용 컴포넌트
  - `src/components/site/SiteHeader.tsx`
  - `src/components/site/SiteFooter.tsx`
  - `src/components/site/ContactInquiryForm.tsx`
  - `src/components/site/PortfolioGalleryClient.tsx`
  - `src/components/site/WorkflowBeam.tsx`
  - `src/components/site/BrandLogoGrid.tsx`
  - `src/components/site/InstagramFeedGrid.tsx`
- 카피/사전
  - `src/lib/company-copy.ts`
  - 신규 `src/i18n/*`

## 구현 순서

1. locale 설정과 경로 유틸 추가
2. locale layout 및 공개 라우트 구조 정리
3. 헤더/푸터/공용 링크 locale 대응
4. dictionary 도입 후 정적 카피 이전
5. 메타데이터, canonical, hreflang, sitemap 정리
6. 문의 폼과 클라이언트 컴포넌트 문구 locale props 적용
7. 언어 전환 UI 추가
8. 빌드, 린트, 수동 라우팅 확인

## 검증 체크리스트

- `npm run lint`
- `npm run build`
- `/`, `/about`, `/partner`, `/portfolio`, `/contact` 정상 렌더링
- `/en`, `/en/about`, `/zh`, `/zh/about` 정상 렌더링
- 헤더/푸터 링크가 현재 locale 을 유지하는지 확인
- `<html lang>` 값이 locale 에 맞는지 확인
- 각 페이지 `canonical`, `alternates.languages`, `openGraph.locale` 확인
- `sitemap.xml` 에 locale URL 이 반영되는지 확인

## 작업 전에 확정할 의사결정

- 중국어를 간체만 지원할지, 추후 번체까지 열어둘지
- 기본 언어를 루트(`/`)에 유지할지, `/ko`로 옮길지
- DB 콘텐츠 번역을 이번 범위에 포함할지

현재 기준 권장 기본안:

- 중국어는 간체만 지원
- 한국어 루트 유지
- DB 콘텐츠 번역은 후속 작업으로 분리
