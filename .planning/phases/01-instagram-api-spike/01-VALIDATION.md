---
phase: 1
slug: instagram-api-spike
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-27
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | jest (via next test) / manual curl |
| **Config file** | jest.config.ts (if exists) or next test |
| **Quick run command** | `npm run test -- --testPathPattern=instagram` |
| **Full suite command** | `npm run build && npm run test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` (TypeScript compilation check)
- **After every plan wave:** Manual curl test to API endpoints
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01 | 01 | 1 | INST-01 | manual | `curl "$INSTAGRAM_API/me/media?..."` | ❌ W0 | ⬜ pending |
| 01-02 | 01 | 1 | INST-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 01-03 | 01 | 2 | INST-02 | manual | `curl /api/instagram/sync` | ❌ W0 | ⬜ pending |
| 01-04 | 01 | 2 | INST-02 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 01-05 | 01 | 3 | INST-03 | manual | `curl /api/instagram/refresh-token` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Confirm `instagram_feed_cache` table exists (run SELECT against DB)
- [ ] Verify live API response to get CDN domain for `next/image remotePatterns`
- [ ] Confirm `INSTAGRAM_ACCESS_TOKEN` is valid (`curl .../me?fields=id,username`)

*These are prerequisites before any implementation tasks.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 피드 그리드 렌더링 | INST-01 | 브라우저 시각 확인 필요 | `/admin/instagram-test` 접속 → 이미지 3컬럼 그리드 표시 확인 |
| DB 캐시 fallback | INST-02 | 네트워크 차단 후 확인 | API 토큰 무효화 후 페이지 새로고침 → 캐시 데이터 표시 확인 |
| 토큰 갱신 | INST-03 | Meta API 실제 호출 | `/api/instagram/refresh-token` POST → 새 토큰 반환 및 만료일 연장 확인 |
| 만료 경고 로그 | INST-03 | 서버 로그 확인 | `npm run dev` 시작 시 콘솔에 토큰 만료 경고 표시 확인 |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
