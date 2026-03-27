# Phase 4: 공개 사이트 - Research

**Researched:** 2026-03-27
**Domain:** Next.js 16.2.1 App Router public site on top of existing Vercel Postgres + Blob data
**Confidence:** HIGH (all findings are based on local repo state, installed Next.js docs, and Phase 1~3 artifacts)

---

<user_constraints>
## User Constraints

### Locked Decisions from Existing Project State

- Public pages must reuse the data created in Phase 3 rather than introduce a second content system.
- `@vercel/postgres` SQL queries are the project standard; no ORM should be introduced.
- Public portfolio images come from Vercel Blob, Instagram feed images come from cached Meta URLs, and both must render through existing `next.config.ts` remote patterns.
- `getCachedFeed()` already defines the approved Instagram read path for visitor-facing pages: DB cache first, no live Graph API calls on page load.
- DB-backed pages in this repo already use `export const dynamic = 'force-dynamic'` when build-time prerendering would be unsafe.
- Phase 4 is frontend-heavy, but there is currently no `04-CONTEXT.md` and no `04-UI-SPEC.md`.

### Practical Gaps

- No user-authored design decisions exist for Phase 4, so layout, copy hierarchy, and interaction details must stay inside the repo's established MVP constraints.
- No dedicated public-site data loader exists yet.
- `src/app/page.tsx` is still the scaffolded Next starter page.
- Existing JSON Route Handlers under `src/app/api/*` are admin-only in several cases and therefore should not be used by anonymous public pages.

### Implication

The plan should optimize for:

1. shared server-side read models,
2. minimal client islands only where interaction is necessary,
3. public-layout consistency,
4. explicit responsive/manual verification because this phase's success criteria are mostly visual and behavioral.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SITE-01 | HOME page hero + latest portfolio preview (3~6) | Use direct DB reads filtered by `show_on_web = true`, ordered by `sort_order ASC, created_at DESC`, limited for preview |
| SITE-02 | ABOUT page company intro + client logo grid | Reuse `company_profile` and `client_brands` rows already managed in admin |
| SITE-03 | PORTFOLIO page category filter + image grid | Reuse `portfolio_items.category` and `PORTFOLIO_CATEGORIES`; filter can stay client-side after one server load |
| SITE-04 | Small lightbox modal on portfolio click | Existing `src/components/ui/dialog.tsx` is the right modal primitive; keep image/detail interactions in a client island |
| SITE-05 | FEED page from Instagram cache | Reuse `getCachedFeed()` from `src/lib/instagram.ts`; never hit the live API from the public route |
| SITE-06 | CONTACT page shows contact info | Reuse latest `company_profile` row with empty-state fallbacks |
| SITE-07 | Shared header/footer across all public pages | Add a dedicated public route layout or equivalent shared shell, separate from admin/pdf routes |
| SITE-08 | Desktop/mobile responsiveness everywhere | Requires explicit breakpoint choices in every public component plus a manual viewport checklist |
</phase_requirements>

---

## Summary

Phase 4 should be implemented as a server-rendered public site that reads directly from Postgres through shared helper functions, not through the admin JSON APIs. The existing schema and Phase 3 pages already prove that the required content exists in `portfolio_items`, `company_profile`, `client_brands`, and `instagram_feed_cache`; the missing piece is a visitor-facing presentation layer.

The cleanest implementation path is:

1. create a shared public read-model module (`src/lib/site.ts` plus a small site-specific type file),
2. add a dedicated public layout with common navigation/footer and runtime rendering safeguards,
3. keep page bodies as Server Components,
4. isolate only interactive pieces such as category filtering and the lightbox into client components.

This keeps first paint server-rendered, avoids unauthorized calls to admin-only endpoints, and follows the App Router patterns already used elsewhere in the repo.

Two repo-specific risks matter:

- **No CONTEXT.md / UI-SPEC.md:** the plan must avoid ambiguous "make it nicer" work and instead encode concrete structure, copy labels, breakpoints, and component responsibilities.
- **Next.js 16 + DB reads:** request-time behavior is stricter than older Next.js assumptions. If public routes read Postgres directly, the plans should preserve the repo's existing `force-dynamic` pattern where needed to avoid build-time failures.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard Here |
|---------|---------|---------|-------------------|
| `next` | `16.2.1` | App Router pages/layouts | Installed in `package.json`; local docs confirm modern App Router behavior |
| `react` | `19.2.4` | Server Components + client islands | Installed and already used in admin features |
| `@vercel/postgres` | `0.10.0` | Direct SQL reads | Existing project standard |
| `next/image` | bundled | Blob + Instagram CDN images | Already used in admin and spike pages |

### Existing UI/Data Primitives to Reuse

| Existing Asset | Use in Phase 4 | Why |
|----------------|----------------|-----|
| `src/components/ui/dialog.tsx` | Portfolio lightbox | Avoid hand-rolling modal behavior |
| `src/types/portfolio.ts` | Category/source contract | Category list is already canonical |
| `src/lib/instagram.ts#getCachedFeed()` | Feed page data source | Approved cache-first Instagram strategy |
| `src/app/admin/layout.tsx` | `force-dynamic` and layout pattern reference | Shows the repo's current runtime-safe App Router style |
| `src/app/pdf-export/_lib/get-pdf-document.ts` | Parallel SQL read + fallback mapping pattern | Good precedent for shared data aggregation |

### Current Infrastructure Already Ready

| Capability | Status | Evidence |
|-----------|--------|----------|
| Blob-hosted public images | ready | `next.config.ts` includes `**.public.blob.vercel-storage.com` |
| Instagram CDN images | ready | `next.config.ts` includes `**.cdninstagram.com` and `**.fbcdn.net` |
| Company/profile data | ready | admin profile page and route already read/write `company_profile` |
| Brand logos | ready | admin profile page and route already read/write `client_brands` |
| Portfolio gallery data | ready | admin portfolio page and route already read/write `portfolio_items` |

---

## Architecture Patterns

### Pattern 1: Shared Public Read Models in `src/lib/site.ts`

**What:** Build server-only helpers that read visitor-facing data directly from Postgres and map rows into camelCase view models.

**Why:** Public pages should not fetch the admin JSON endpoints because those endpoints enforce `isAdminAuthenticated()` and would return `401` to anonymous users.

**Recommended shape:**

```ts
export interface SiteCompanyProfile {
  aboutText: string
  contactEmail: string
  contactPhone: string
  address: string
}

export interface SiteClientBrand {
  id: string
  name: string
  logoUrl: string | null
  sortOrder: number
}

export interface PublicPortfolioItem {
  id: string
  title: string
  brandName: string
  celebrityName: string | null
  category: string
  imageUrl: string
  thumbnailUrl: string | null
  sortOrder: number
}

export async function getSiteCompanyProfile(): Promise<SiteCompanyProfile> { ... }
export async function getSiteClientBrands(): Promise<SiteClientBrand[]> { ... }
export async function getFeaturedPortfolio(limit = 6): Promise<PublicPortfolioItem[]> { ... }
export async function getPublicPortfolioItems(): Promise<PublicPortfolioItem[]> { ... }
```

**SQL rules that should be preserved:**

- Portfolio queries should filter `WHERE show_on_web = true`
- Portfolio ordering should stay `ORDER BY sort_order ASC, created_at DESC`
- Brand queries should filter `WHERE is_active = true`
- Profile queries should read the latest row with `ORDER BY updated_at DESC LIMIT 1`

### Pattern 2: Public Layout Separate From Admin/PDF

**What:** Add a public-only layout/shell rather than pushing header/footer into the root layout that also wraps admin and `/pdf-export`.

**Why:** Admin and PDF routes already have distinct structure and constraints. A dedicated public layout keeps Phase 4 isolated.

**Recommended structure:**

```text
src/app/(public)/layout.tsx
src/app/(public)/page.tsx
src/app/(public)/about/page.tsx
src/app/(public)/portfolio/page.tsx
src/app/(public)/feed/page.tsx
src/app/(public)/contact/page.tsx
src/components/site/*
```

**Important:** If the route group is introduced, the existing scaffolded `src/app/page.tsx` must not remain as a competing `/` route.

### Pattern 3: Server Pages, Client Islands

**What:** Keep each page as a Server Component that loads DB data once. Push only local UI state into client components.

**Use client components only for:**

- portfolio category state,
- lightbox open/close/index state,
- optional menu toggles on small screens.

**Do not push these into client-only fetch flows:**

- HOME featured portfolio
- ABOUT profile text / client logos
- FEED cached posts
- CONTACT profile fields

### Pattern 4: `force-dynamic` for DB-Driven Public Surfaces

`src/app/admin/layout.tsx` and `src/app/admin/instagram-test/page.tsx` already establish the repo's preferred way to avoid unsafe build-time DB access.

For Phase 4, the safest default is:

- set `export const dynamic = 'force-dynamic'` on the public layout or each DB-backed public page,
- keep Route Handlers out of the anonymous page-render path,
- treat build verification as the automated baseline.

This is especially important because the current root page is static scaffold content, while the future public routes will depend on runtime database reads.

### Pattern 5: Instagram Feed Uses Cache Only

The public FEED page should not create a second Instagram integration path. It should reuse:

```ts
import { getCachedFeed } from '@/lib/instagram'
```

The page should surface:

- a last-synced timestamp from `fetched_at`,
- cached image or video fallback tiles,
- permalink CTA when present,
- an explicit empty state when no cached rows exist.

### Pattern 6: Empty States Must Be First-Class

Phase 4 depends on Phase 3 data, but empty DB states will still happen in local/dev and early deployment.

Required empty-state behavior:

- HOME preview section: message when no featured portfolio exists
- ABOUT logos: message when no active brands exist
- PORTFOLIO grid: empty filter state
- FEED page: message that cached posts are not synced yet
- CONTACT page: safe blank/fallback rendering when profile fields are missing

This keeps the site shippable before final data entry work in Phase 5.

---

## Local Next.js 16 Notes That Matter

From installed docs under `node_modules/next/dist/docs/`:

- `generateMetadata` is server-only and appropriate for layout/page metadata exports.
- request-time APIs remain async-oriented in Next 16-era App Router docs, so plans should not rely on older synchronous patterns.
- server-side `fetch` caching semantics are explicit, but this phase mostly reads Postgres directly rather than remote HTTP APIs.

For this repo, the most important practical takeaway is not metadata complexity; it is to keep the public data path server-side and deterministic.

---

## Recommended Project Structure

```text
src/
├── app/
│   ├── layout.tsx                      # keep root minimal
│   └── (public)/
│       ├── layout.tsx                  # shared header/footer + dynamic boundary
│       ├── page.tsx                    # HOME
│       ├── about/page.tsx              # ABOUT
│       ├── portfolio/page.tsx          # PORTFOLIO
│       ├── feed/page.tsx               # FEED
│       └── contact/page.tsx            # CONTACT
├── components/
│   └── site/
│       ├── SiteHeader.tsx
│       ├── SiteFooter.tsx
│       ├── PortfolioPreviewGrid.tsx
│       ├── BrandLogoGrid.tsx
│       ├── PortfolioGalleryClient.tsx
│       ├── PortfolioLightbox.tsx
│       └── InstagramFeedGrid.tsx
├── lib/
│   └── site.ts
└── types/
    └── site.ts
```

This is enough structure to keep the phase clean without creating a design-system detour.

---

## Anti-Patterns To Avoid

| Problem | Do Not Do This | Use Instead | Why |
|--------|-----------------|-------------|-----|
| Public data loading | `fetch('/api/company-profile')` from anonymous pages | direct SQL helpers in `src/lib/site.ts` | current API routes are admin-protected |
| Portfolio interactivity | fully client-render the entire page | server page + client filter/lightbox island | keeps first render fast and simple |
| Modal implementation | invent a new overlay primitive | existing `src/components/ui/dialog.tsx` | lower risk, already installed |
| Instagram display | call Graph API from `/feed` | `getCachedFeed()` | aligns with approved cache-first design |
| Layout reuse | add header/footer to root layout that also wraps admin/pdf | dedicated public layout/shell | avoids route cross-contamination |
| Empty states | assume rows always exist | explicit fallbacks per page | Phase 5 data entry is still pending |

---

## Common Pitfalls

1. **Leaving the scaffolded root page in place.**
   If `src/app/page.tsx` and `src/app/(public)/page.tsx` both exist, routing becomes ambiguous.

2. **Using admin Route Handlers for public page data.**
   `src/app/api/company-profile/route.ts`, `src/app/api/client-brands/route.ts`, and `src/app/api/portfolio/route.ts` all require admin auth.

3. **Forgetting runtime rendering safeguards.**
   DB reads on public pages can fail during build if the phase tries to statically prerender them without the repo's established dynamic pattern.

4. **Overbuilding the frontend.**
   No UI-SPEC exists. The safe target is a solid editorial MVP, not an open-ended redesign project.

5. **Mixing Instagram API read logic into FEED rendering.**
   The feed page should display cached rows only and surface sync freshness, not own sync behavior.

6. **Failing responsive verification because the plans stop at implementation.**
   SITE-08 requires a manual viewport pass after all pages exist.

---

## Recommended Plan Breakdown

| Plan | Focus | Suggested Wave |
|------|-------|----------------|
| `04-01` | public read models, site types, shared data utilities | 1 |
| `04-02` | public layout + HOME + ABOUT | 2 |
| `04-03` | PORTFOLIO grid, filters, lightbox | 3 |
| `04-04` | FEED + CONTACT | 3 |
| `04-05` | static baseline + human responsive/public-site checkpoint | 4 |

This split matches the natural dependencies:

- data contracts first,
- shared shell next,
- gallery and feed/contact in parallel,
- human sign-off last.

---

## Validation Architecture

### Automated Baseline

- Quick run: `npm run build`
- Full run: `npm run lint && npm run build`
- Reason: the repo currently has no dedicated test suite; build and lint are the only reliable fast feedback loops

### Manual Coverage Required

Manual verification is mandatory for:

- mobile and desktop layout behavior on all five public pages,
- portfolio category filter behavior,
- lightbox open/close and navigation,
- header/footer consistency,
- empty-state readability when profile/feed rows are missing.

### Wave 0 Preconditions

- `POSTGRES_URL` must be available for runtime DB reads
- `next.config.ts` remote patterns must remain intact for Blob/Instagram images
- at least one portfolio row and one company profile row should exist for realistic visual verification, but plans must still support empty states

### Per-Plan Verification Strategy

| Plan | Focus | Automated Check | Manual Check |
|------|-------|-----------------|--------------|
| `04-01` | data contracts + loaders | `npm run build` | inspect query outputs indirectly through downstream pages |
| `04-02` | layout + HOME + ABOUT | `npm run build` | desktop/mobile review of nav, hero, preview, logos |
| `04-03` | PORTFOLIO + lightbox | `npm run build` | filter behavior and modal interaction |
| `04-04` | FEED + CONTACT | `npm run build` | feed empty/data states and contact link behavior |
| `04-05` | full checkpoint | `npm run lint && npm run build` | cross-page public-site sign-off |

### Nyquist Implication

Dimension 8 can still pass without a unit-test framework in this phase because the plan explicitly assigns:

- automated build/lint verification to every implementation plan,
- a manual checkpoint plan that exercises the visitor-facing behaviors the build cannot prove.

---

## Final Recommendation

Proceed with research-backed planning immediately, but keep the plans concrete because the usual context artifacts are missing. The strongest Phase 4 plan is not "make a website"; it is "reuse the verified Phase 3 data model to build a route-grouped, server-rendered public surface with small client islands and an explicit responsive sign-off."

---

*Phase: 04-public-site*
*Research completed: 2026-03-27 using local repo state only*
