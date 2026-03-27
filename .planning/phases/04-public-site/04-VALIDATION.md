---
phase: 4
slug: public-site
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-03-27
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none - build/lint plus manual public-site review |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run lint && npm run build` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run lint && npm run build`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | SITE-01, SITE-02, SITE-03, SITE-05, SITE-06 | build | `npm run build` | ⬜ pending | ⬜ pending |
| 04-01-02 | 01 | 1 | SITE-07 | build | `npm run build` | ⬜ pending | ⬜ pending |
| 04-02-01 | 02 | 2 | SITE-07, SITE-08 | build | `npm run build` | ⬜ pending | ⬜ pending |
| 04-02-02 | 02 | 2 | SITE-01, SITE-02 | manual + build | `npm run build` | ⬜ pending | ⬜ pending |
| 04-03-01 | 03 | 3 | SITE-03 | build | `npm run build` | ⬜ pending | ⬜ pending |
| 04-03-02 | 03 | 3 | SITE-04, SITE-08 | manual + build | `npm run build` | ⬜ pending | ⬜ pending |
| 04-04-01 | 04 | 3 | SITE-05 | build | `npm run build` | ⬜ pending | ⬜ pending |
| 04-04-02 | 04 | 3 | SITE-06, SITE-08 | manual + build | `npm run build` | ⬜ pending | ⬜ pending |
| 04-05-01 | 05 | 4 | SITE-01~08 | lint + build | `npm run lint && npm run build` | ⬜ pending | ⬜ pending |
| 04-05-02 | 05 | 4 | SITE-01~08 | manual | `echo \"Manual checkpoint required\"` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `POSTGRES_URL` 또는 Vercel Postgres 연결이 public pages에서 조회 가능한 상태다
- [ ] `next.config.ts`에 Blob/Instagram remote patterns가 유지된다
- [ ] 최소 1개 이상의 `portfolio_items.show_on_web = true` 데이터가 있으면 실데이터 검증이 수월하다
- [ ] `company_profile`과 `client_brands`가 비어 있어도 빈 상태 UI가 렌더링되도록 구현한다

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| HOME hero + preview | SITE-01 | visual hierarchy and responsive composition are browser-only | `/` on desktop/mobile, confirm hero and 3~6 preview cards or empty state |
| ABOUT intro + logo grid | SITE-02 | logo scaling and empty state cannot be proven by build | `/about` on desktop/mobile, confirm about copy and active logos |
| PORTFOLIO filter and lightbox | SITE-03, SITE-04 | filter state and modal interaction require real clicks | `/portfolio`, switch categories, open one item, close it, verify metadata |
| FEED grid from cache | SITE-05 | cached content/empty-state readability requires manual inspection | `/feed`, confirm cached rows or empty-state message and freshness copy |
| CONTACT info rendering | SITE-06 | tel/mailto behavior and layout require browser check | `/contact`, click email/phone links, verify address copy |
| Shared header/footer and responsive layout | SITE-07, SITE-08 | cross-page consistency spans multiple viewports and routes | review `/`, `/about`, `/portfolio`, `/feed`, `/contact` at mobile + desktop widths |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
