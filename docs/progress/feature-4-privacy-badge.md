# Feature 4 — Privacy Badge Component

**Status:** ✅ Complete  
**Estimated effort:** < 1 day  
**Started:** 2026-05-09

---

## Goal

A drop-in `<GhostPrivacyBadge />` component that surfaces the "zero servers" privacy guarantee directly in the product UI. It's a trust signal for end users, not a technical feature — but it completes the privacy-first narrative.

---

## Tasks

- [x] Create `GhostPrivacyBadge` component in `packages/react/src/privacy-badge.tsx`
- [x] Props: `text`, `href`, `variant` (`subtle` | `prominent`), `className`, `style`
- [x] Default variant `subtle` — semi-transparent dark pill, works on any background
- [x] `prominent` variant — higher contrast for use on light or hero backgrounds
- [x] Tooltip on hover showing the one-line privacy explainer
- [x] Export from `packages/react/src/index.ts`
- [x] Shown in playground Demo tab

---

## Files changed

| File | Change |
|---|---|
| `packages/react/src/privacy-badge.tsx` | New component |
| `packages/react/src/index.ts` | +export |
| `apps/playground/src/App.tsx` | Badge visible in Demo tab |

---

## Design decisions

- **Inline styles only** — the component is meant to embed in any host app regardless of CSS framework. No Tailwind dependency in the package itself.
- **`href` is optional** — when omitted the badge renders as a `<span>`; when provided it renders as an `<a>` so the trust link is crawlable.
- **SVG lock icon, no emoji** — emoji rendering is inconsistent across platforms; a simple inline SVG is crisp at any size.
- **`variant="subtle"` default** — blends into dark UIs without fighting for attention; `prominent` is provided for light backgrounds or explicit call-outs.
