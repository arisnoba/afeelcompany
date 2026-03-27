---
phase: 2
slug: spike-pdf
status: approved
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-27
---

# Phase 2 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none - build/lint plus manual browser print review |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run lint && npm run build` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run lint && npm run build`
- **Before `$gsd-verify-work`:** Full suite must be green, then run the browser print matrix
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | PDF-04 | build | `npm run build` | ✅ fixtures/font | ✅ green |
| 02-01-02 | 01 | 1 | PDF-03 | build | `npm run build` | ✅ fixtures/font | ✅ green |
| 02-02-01 | 02 | 2 | PDF-01 | build | `npm run build` | ✅ loader | ✅ green |
| 02-02-02 | 02 | 2 | PDF-03 | build | `npm run build` | ✅ loader | ✅ green |
| 02-03-01 | 03 | 3 | PDF-01 | build | `npm run build` | ✅ route | ✅ green |
| 02-03-02 | 03 | 3 | PDF-03 | manual | `npm run build` | ✅ route | ✅ green |
| 02-04-01 | 04 | 4 | PDF-02 | manual print preview | `npm run build` | ✅ print hooks | ✅ green |
| 02-04-02 | 04 | 4 | PDF-05 | manual browser flow | `npm run build` | ✅ print hooks | ✅ green |
| 02-04-03 | 04 | 4 | PDF-06 | manual browser matrix | `npm run build` | ✅ print hooks | ✅ green |
| 02-05-01 | 05 | 5 | PDF-01~06 | human checkpoint | `npm run lint && npm run build` | ✅ baseline | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] Confirm the Phase 0 DB schema is reachable locally, or document that brochure data will come from fixtures during the spike
- [x] Confirm at least 6 local fixture images exist under `public/pdf-fixtures/` before validating image sharpness
- [x] Confirm the brochure route uses a Korean-safe font (`Noto_Sans_KR` or local Pretendard) rather than the root `Geist` font
- [x] Confirm Chrome and Safari are both available on the operator machine for the final verification step

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| A4 landscape print preview | PDF-01 | Browser print engine behavior | Open `/pdf-export` and `/pdf-export?print=1` in Chrome, confirm the preview uses landscape sheets and expected page count |
| Page breaks and backgrounds | PDF-02 | CSS print fidelity is visual | Save PDF from print dialog and inspect page edges, section breaks, and dark/light fills |
| Section order | PDF-03 | Human-readable brochure flow | Confirm the pages appear as `cover -> ABOUT -> WORK -> CLIENT -> CONTACT` |
| Korean font rendering | PDF-04 | Glyph corruption is visual | Inspect Korean paragraphs and contact labels in both on-screen preview and saved PDF |
| Download button / auto print flow | PDF-05 | Requires browser interaction | Click the brochure toolbar button, verify navigation to `?print=1`, then confirm dialog opens after content is ready |
| Chrome / Safari equivalence | PDF-06 | Cross-browser print engine difference | Repeat the same print flow in Safari and compare against the Chrome output |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or explicit manual-checkpoint ownership
- [x] Sampling continuity: no 3 consecutive implementation tasks without at least `npm run build`
- [x] Wave 0 covers image fixtures, font strategy, and browser availability
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter when validation gaps are resolved

**Approval:** approved
