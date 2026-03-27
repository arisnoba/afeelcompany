# Phase 2: Spike — PDF 회사소개서 출력 검증 - Research

**Researched:** 2026-03-27
**Domain:** Next.js 16 App Router + browser print CSS + Korean font delivery + DB-backed brochure fixtures
**Confidence:** HIGH for implementation path, MEDIUM for cross-browser print fidelity until manual sign-off

---

<planning_constraints>
## Planning Constraints (no CONTEXT.md for this run)

### Locked Decisions From ROADMAP / PROJECT / Repo Assets

- **D-01:** This spike must use a dedicated `/pdf-export` route and browser print, not server-side PDF generation.
- **D-02:** Success is defined by A4 landscape output, Korean text fidelity, clean page breaks, and acceptable brochure quality in both Chrome and Safari.
- **D-03:** The required section order is `cover -> ABOUT -> WORK -> CLIENT -> CONTACT` (PDF-03).
- **D-04:** Phase 2 must stay executable before Phase 3 exists, so the brochure route needs fixture data or graceful fallback instead of assuming admin-managed content is already in the database.
- **D-05:** The repo already contains brochure source assets in `docs/`.
  - `docs/어필컴퍼니 회사소개서 VER.2.pdf` is a 27-page Microsoft PowerPoint export at `720 x 540 pt` (4:3 landscape), not A4.
  - `docs/[어필컴퍼니] ROYNINE 룩북.pdf` is a 6-page portrait reference at `540 x 780 pt`.
- **D-06:** Current root layout only loads `Geist` fonts. That is not sufficient for Korean brochure output; the PDF route needs its own font strategy.
- **D-07:** Browser-print quality must be verified manually. Automated checks can prove build correctness, but not print-dialog fidelity.
- **D-08:** Fallback options remain exactly those listed in the roadmap: `html2canvas + jsPDF`, DocRaptor/PDFShift, or Vercel Pro + Chromium/Puppeteer.

### Claude's Discretion

- Exact brochure data contract and fixture shape
- DB-first versus fixture-first loader implementation
- Whether to use `next/font/google` `Noto_Sans_KR` immediately or a local Pretendard asset if added during execution
- Whether brochure image tiles should use plain `<img>` for print reliability or `next/image` with `unoptimized` and eager loading
- Exact auto-print trigger shape (`?print=1`, toolbar button, or both)

### Deferred Ideas (Out of Scope for This Spike)

- Server-side PDF rendering
- Editable PDF section-order admin UI
- Pixel-perfect recreation of the current PowerPoint brochure
- Emailing or background-generating brochure files
</planning_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Planning Implication |
|----|-------------|----------------------|
| PDF-01 | `/pdf-export` route renders landscape A4 brochure page(s) | Route needs dedicated layout, physical page sizing, and multi-page HTML structure |
| PDF-02 | `@media print` handles orientation, page breaks, and backgrounds | Print stylesheet must own `@page`, `print-color-adjust`, and break utilities |
| PDF-03 | Section order is `표지 -> ABOUT -> WORK -> CLIENT -> 연락처` | Data contract and page composition must encode this exact order |
| PDF-04 | Korean text prints without corruption | Route-local font strategy required; do not rely on Geist or client machine fonts |
| PDF-05 | `window.print()` plus download button flow works | Client print launcher needed, ideally after fonts/images are fully loaded |
| PDF-06 | Chrome and Safari produce equivalent acceptable output | Final plan must include a human browser matrix checkpoint |
</phase_requirements>

---

## Summary

The cleanest spike path is a DB-aware brochure route that renders from a single `PdfDocument` shape. The route should query `company_profile`, `portfolio_items`, and `client_brands` when data exists, but fall back to checked-in fixture content so Phase 2 remains runnable before the admin/data layer is built.

The most important print-specific decisions are:

1. Use route-local Korean-safe fonts via `next/font`.
2. Render each brochure page as an explicit A4-landscape sheet with physical dimensions in `mm`.
3. Delay `window.print()` until fonts and images are ready, otherwise the print dialog can capture blank or partially styled content.
4. Treat the current PowerPoint-exported PDFs as content and quality references, not as a pixel-perfect page-size baseline, because the source brochure is 4:3 and the spike target is A4 landscape.

**Primary recommendation:** build the phase as five sequential plans:
- foundations and fixture assets
- DB-first loader with fixture fallback
- brochure page composition
- print CSS and auto-print launcher
- human verification checkpoint in Chrome and Safari

---

## Standard Stack

### Core

| Library / Platform | Version | Purpose | Why It Fits |
|--------------------|---------|---------|-------------|
| `next` | 16.2.1 | App Router brochure route | Already installed; current project standard |
| `react` | 19.2.4 | Server + client brochure components | Already installed |
| `@vercel/postgres` | 0.10.0 | Read brochure data | Already installed; project avoids ORM |
| `next/font` | built in | Korean-safe font delivery | Self-hosted or optimized font loading without runtime CDN dependency |

### Supporting

| Tool | Purpose | Recommendation |
|------|---------|----------------|
| `next/font/google` `Noto_Sans_KR` | Guaranteed Korean glyph coverage | Use immediately unless Pretendard files are added locally |
| `next/font/local` | Local Pretendard or serif headline fonts | Use only if actual font assets are added to the repo |
| plain `<img>` or eager `Image` | Print images | Prefer plain `<img>` for the spike unless `next/image` is proven not to interfere with printing |

### Alternatives Considered

| Instead Of | Could Use | Tradeoff |
|------------|-----------|----------|
| Browser print | `html2canvas + jsPDF` | Better control over single exported file, worse text sharpness and larger raster output |
| Browser print | DocRaptor / PDFShift | Better consistency, introduces cost and external dependency during MVP |
| Browser print | Puppeteer on Vercel Pro | Highest control, violates current MVP hosting constraint |

**Installation:** no new dependency is strictly required for the spike.

---

## Architecture Patterns

### Pattern 1: Route-local brochure contract with DB fallback

**What:** create a `PdfDocument` interface and one loader function that returns brochure-ready data.

**Why:** Phase 2 must work before Phase 3 admin CRUD exists.

```ts
export async function getPdfDocument(): Promise<PdfDocument> {
  try {
    const profile = await sql`SELECT about_text, contact_email, contact_phone, address FROM company_profile ORDER BY updated_at DESC LIMIT 1`
    const work = await sql`SELECT id, title, brand_name, celebrity_name, category, image_url, thumbnail_url, show_on_pdf, sort_order FROM portfolio_items WHERE show_on_pdf = true ORDER BY sort_order ASC, created_at DESC LIMIT 8`
    const brands = await sql`SELECT id, name, logo_url, sort_order FROM client_brands WHERE is_active = true ORDER BY sort_order ASC, created_at ASC LIMIT 12`
    return mapRowsToPdfDocument(profile.rows, work.rows, brands.rows)
  } catch {
    return pdfFixtureDocument
  }
}
```

**Planning implication:** the loader must gracefully fall back when DB rows do not exist or local dev is missing DB access.

### Pattern 2: One HTML sheet per printed brochure page

**What:** render multiple `.pdf-sheet` containers, each sized to A4 landscape.

**Why:** explicit physical page boxes make page-break behavior predictable.

```tsx
<main className="pdf-document">
  <section className="pdf-sheet pdf-sheet--cover">...</section>
  <section className="pdf-sheet pdf-sheet--about">...</section>
  <section className="pdf-sheet pdf-sheet--work">...</section>
  <section className="pdf-sheet pdf-sheet--client">...</section>
  <section className="pdf-sheet pdf-sheet--contact">...</section>
</main>
```

```css
.pdf-sheet {
  width: 297mm;
  min-height: 210mm;
  page-break-after: always;
  break-after: page;
}
```

### Pattern 3: Route-local font wrapper

**What:** use a nested `src/app/pdf-export/layout.tsx` that applies a Korean-safe font only inside the brochure route.

**Why:** the global app currently uses `Geist`, which is not a brochure-specific Korean-print decision.

```tsx
import { Noto_Sans_KR } from 'next/font/google'

const brochureSans = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-brochure-sans',
})

export default function PdfExportLayout({ children }: { children: React.ReactNode }) {
  return <div className={brochureSans.variable}>{children}</div>
}
```

**Planning implication:** keep brochure typography isolated from the rest of the site.

### Pattern 4: Auto-print only after assets are ready

**What:** a small client component waits for fonts and images, then calls `window.print()`.

**Why:** early print dialogs frequently capture missing images or fallback fonts.

```tsx
'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function AutoPrintOnLoad() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('print') !== '1') return

    const run = async () => {
      await document.fonts.ready
      const images = Array.from(document.querySelectorAll('img[data-pdf-image]'))
      await Promise.all(images.map((img) => img.decode().catch(() => undefined)))
      window.print()
    }

    void run()
  }, [searchParams])

  return null
}
```

**Planning implication:** the download button should navigate to `/pdf-export?print=1`, not call `window.print()` from arbitrary pages.

### Pattern 5: Dedicated print stylesheet

**What:** use route-level CSS for `@page`, `screen-only`, `print-only`, and break control.

**Why:** mixing brochure print rules into global app CSS is brittle.

```css
@page {
  size: A4 landscape;
  margin: 8mm;
}

@media print {
  html,
  body {
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .screen-only {
    display: none !important;
  }

  .avoid-break {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
```

---

## Source Asset Findings

- `docs/어필컴퍼니 회사소개서 VER.2.pdf`
  - 27 pages
  - `720 x 540 pt` page size
  - PowerPoint export
  - Extracted text is sparse, which suggests the brochure is visually heavy and not a good source of machine-readable copy
- `docs/[어필컴퍼니] ROYNINE 룩북.pdf`
  - 6 pages
  - `540 x 780 pt` portrait page size
  - Embeds Korean-capable fonts (`맑은 고딕`)

**Planning implication:** the spike should compare content density, image clarity, and section rhythm against these PDFs, but not attempt a one-to-one coordinate translation.

---

## Common Pitfalls

### Pitfall 1: `window.print()` fires before assets are ready

**What goes wrong:** print preview opens with blank image boxes or fallback fonts.
**How to avoid:** wait for `document.fonts.ready` and image decoding before printing.

### Pitfall 2: relying on global `Geist` for Korean brochure output

**What goes wrong:** Korean glyph fallback becomes browser-dependent and inconsistent.
**How to avoid:** apply a brochure-local Korean-safe font with `next/font`.

### Pitfall 3: direct translation from the current brochure PDF

**What goes wrong:** the source brochure is 4:3 PowerPoint, while the spike target is A4 landscape.
**How to avoid:** preserve section order and density, not slide coordinates.

### Pitfall 4: using lazy-loaded image components in a print route

**What goes wrong:** print preview can capture unloaded image placeholders.
**How to avoid:** use eager image loading and explicit readiness checks.

### Pitfall 5: mixing print rules into `src/app/globals.css`

**What goes wrong:** unrelated public/admin pages inherit brochure-specific print behavior.
**How to avoid:** keep brochure print CSS inside `src/app/pdf-export/`.

### Pitfall 6: assuming Safari will match Chrome without manual review

**What goes wrong:** margins, background printing, and page breaks differ slightly.
**How to avoid:** include a human checkpoint that compares both browsers against the same route and fixture set.

---

## Open Questions

1. **Pretendard asset availability**
   - The requirement names `Pretendard / Noto Sans KR`, but the repo currently contains neither as local assets.
   - Recommendation: use `Noto_Sans_KR` first; only add local Pretendard if real font files are supplied during execution.

2. **Exact brochure copy source**
   - The repo contains PDF references, but not machine-readable structured copy for all pages.
   - Recommendation: use concise Korean fixture copy in Phase 2 and defer exact brochure copy entry to later data-entry phases.

3. **How strict "동일한 출력 결과" should be across Chrome and Safari**
   - Perfect binary identity is unrealistic for browser print.
   - Recommendation: treat PDF-06 as visual equivalence for layout, text rendering, and page counts, not byte-for-byte identical files.

---

## Environment Availability

| Dependency | Required By | Available | Notes |
|------------|------------|-----------|-------|
| `next` 16.2.1 | Brochure route | ✓ | Installed |
| `@vercel/postgres` | DB brochure loader | ✓ | Installed |
| `src/app/pdf-export/` directory | Route implementation | ✓ | Directory exists, no files yet |
| brochure source PDFs in `docs/` | Fixture/reference extraction | ✓ | Present locally |
| Korean-safe local font assets | Pretendard path | ✗ | Not present in repo right now |

**Missing dependency with fallback:** local Pretendard files. Fallback is `next/font/google` `Noto_Sans_KR`.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | none - rely on build/lint plus manual browser verification |
| Config file | none |
| Quick run command | `npm run build` |
| Full suite command | `npm run lint && npm run build` |
| Estimated runtime | ~20 seconds |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PDF-01 | `/pdf-export` renders brochure sheets | build + manual route open | `npm run build` | ❌ Wave 0 |
| PDF-02 | print stylesheet applies landscape/page breaks/backgrounds | manual print preview | `npm run build` | ❌ Wave 0 |
| PDF-03 | section order is exact | build + DOM/manual review | `npm run build` | ❌ Wave 0 |
| PDF-04 | Korean text renders with intended font | manual print preview | `npm run build` | ❌ Wave 0 |
| PDF-05 | download button leads to auto print flow | manual browser flow | `npm run build` | ❌ Wave 0 |
| PDF-06 | Chrome and Safari are visually equivalent | manual browser matrix | `npm run build` | ❌ Wave 0 |

### Manual Verification Matrix

| Scenario | Browser | Expected |
|----------|---------|----------|
| Open `/pdf-export` | Chrome | Screen preview shows A4-landscape brochure sheets |
| Open `/pdf-export?print=1` | Chrome | Print dialog opens after fonts/images load |
| Save PDF from print dialog | Chrome | No broken Korean text, no clipped work grid, expected page count |
| Open `/pdf-export?print=1` | Safari | Same page order, no missing backgrounds or blank images |
| Compare saved PDFs | Chrome vs Safari | Minor browser rendering drift only; layout and text remain acceptable |

---

## Canonical References

- `.planning/ROADMAP.md` - Phase 2 goal, success criteria, fallback paths
- `.planning/PROJECT.md` - MVP constraints and browser-print decision
- `.planning/REQUIREMENTS.md` - PDF-01 through PDF-06
- `plan/mvp-build-plan.md` - earlier concrete description of `/pdf-export` flow
- `scripts/schema.sql` - `company_profile`, `portfolio_items`, `client_brands`
- `docs/어필컴퍼니 회사소개서 VER.2.pdf` - current brochure source
- `docs/[어필컴퍼니] ROYNINE 룩북.pdf` - image-heavy reference
- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` - `next/font` usage
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` - App Router page behavior
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md` - nested layout behavior
- `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` - current Next 16 behavior

---

*Phase: 02-spike-pdf*
*Researched: 2026-03-27*
