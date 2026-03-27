---
phase: 04-public-site
plan: "04"
subsystem: ui
tags: [feed, contact, instagram-cache, profile, public-pages]
requires:
  - phase: 04-01
    provides: site-read-models
  - phase: 01-instagram-api-spike
    provides: cached-instagram-feed
  - phase: 04-02
    provides: public-shell
provides: [feed-route, contact-route, instagram-feed-grid]
affects: [04-05-PLAN]
tech-stack:
  added: []
  patterns: [cache-only-feed, contact-card-layout]
key-files:
  created:
    - src/app/(public)/feed/page.tsx
    - src/app/(public)/contact/page.tsx
    - src/components/site/InstagramFeedGrid.tsx
  modified: []
key-decisions:
  - "FEED는 `getCachedFeed()`만 사용하고 공개 페이지에서 sync 동작은 노출하지 않는다."
  - "CONTACT는 mailto/tel 링크를 직접 렌더링하고 값이 없으면 안전한 fallback 문구를 보여준다."
  - "인스타 비디오 캐시는 `VIDEO` fallback 타일로 표시한다."
patterns-established:
  - "공개 소셜 피드는 cache-only로 유지하고 관리 동작은 admin에 남긴다."
requirements-completed: [SITE-05, SITE-06, SITE-08]
duration: 12min
completed: 2026-03-27
---

# Phase 04 Plan 04: Feed and Contact Summary

**인스타 캐시 기반 FEED와 회사 프로필 기반 CONTACT를 공개 shell 아래에 추가했다**

## Accomplishments

- `src/app/(public)/feed/page.tsx`에서 동기화 시각과 캐시 데이터 기준 FEED를 렌더링한다.
- `src/components/site/InstagramFeedGrid.tsx`에 이미지/비디오 fallback/빈 상태 처리를 넣었다.
- `src/app/(public)/contact/page.tsx`에 이메일, 전화, 주소를 카드형으로 정리하고 `mailto:`/`tel:` 링크를 연결했다.

## Verification

- `npm run build`
- `grep -n "await getCachedFeed()" src/app/(public)/feed/page.tsx`
- `grep -n "동기화된 인스타그램 피드가 아직 없습니다." src/components/site/InstagramFeedGrid.tsx`
- `grep -n "mailto:" src/app/(public)/contact/page.tsx`
- `grep -n "tel:" src/app/(public)/contact/page.tsx`

## Issues Encountered

None

## Next Phase Readiness

자동 검증 기준에서는 공개 사이트 구현이 완료됐다. 남은 일은 Plan 05의 브라우저 수동 체크포인트뿐이다.
