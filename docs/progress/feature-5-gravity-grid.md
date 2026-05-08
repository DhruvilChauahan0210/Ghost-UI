# Feature 5 — Gravity Grid (Phase A + Phase B)

**Status:** ✅ Complete  
**Estimated effort:** Phase A ~4 days, Phase B ~1 week  
**Started:** 2026-05-09

---

## Goal

CSS Grid area promotion: high-mass nodes automatically get assigned to a larger, more prominent grid area. Implements the "pull toward the primary visual zone" concept from the brief in a layout-safe way.

---

## Tasks

- [x] Add `GravityTier = 'primary' | 'secondary' | 'tertiary'` to `packages/core/src/types.ts`
- [x] Extend `LayoutPlan` with optional `area?: Record<GhostId, GravityTier>`
- [x] Add `primaryCount` / `secondaryCount` to `OptimizeInput`
- [x] Optimizer computes area assignments — top N nodes get 'primary', next M get 'secondary', rest 'tertiary'
- [x] Pinned nodes always receive 'primary' regardless of score
- [x] Add `gridTiers` option to `EngineOptions` to configure tier boundaries
- [x] `planChanged()` detects area changes and triggers re-render
- [x] `useGhostArea(id)` hook in `packages/react/src/hooks.ts`
- [x] `GhostGrid` component — CSS Grid container that wraps children in area slots
- [x] Export `GhostGrid`, `useGhostArea`, `GravityTier` from `@ghost-ui/react`
- [x] `Ghost.Grid` added to namespace object
- [x] 6 optimizer tests for area assignment
- [x] Gravity Grid demo section in playground Demo tab

---

## Files changed

| File | Change |
|---|---|
| `packages/core/src/types.ts` | `GravityTier` type + `area` field on `LayoutPlan` |
| `packages/core/src/optimizer.ts` | `primaryCount`/`secondaryCount` in `OptimizeInput`, area computation |
| `packages/core/src/engine.ts` | `gridTiers` in `EngineOptions`, wired to optimizer, `planChanged` area check |
| `packages/react/src/hooks.ts` | `useGhostArea(id)` |
| `packages/react/src/components.tsx` | `GhostGrid` component + `Ghost.Grid` |
| `packages/react/src/index.ts` | Export `GravityTier` |
| `packages/core/src/optimizer.test.ts` | 6 area-tier tests |
| `apps/playground/src/App.tsx` | `GravityGridDemo` + `GridItem` components |

---

## Design decisions

- **Cross-zone area assignment**: Area tiers are computed globally across all nodes (sorted by raw score), not per-zone. This means the highest-scored node anywhere in the app gets 'primary'. A per-zone variant is straightforward to add later.
- **Optional `area` field**: Existing `LayoutPlan` consumers that don't use `GhostGrid` are unaffected — the field is `area?`.
- **Default tiers**: `primaryCount=1, secondaryCount=2`. These cover the typical 3-area grid (`"primary secondary" "primary tertiary"`).
- **`GhostGrid` wraps children**: Like `GhostSlot`, `GhostGrid` reads the `id` prop from child elements and wraps each in a `div` with `style={{ gridArea: tier }}`. No changes required in `Ghost.Item`.
- **Subtle tier backgrounds**: Primary gets a faint violet tint, secondary a faint blue, tertiary is transparent. All transitions are animated at 400ms so promotions are visible but not jarring.
- **Cold-start safe**: With all scores at 0, the first registered node gets 'primary' (deterministic, registration order). No flicker or random assignment.

---

## Phase B — GhostCanvas (2D float)

### Additional tasks

- [x] Add `position?: Record<GhostId, { x: number; y: number }>` to `LayoutPlan`
- [x] Optimizer computes grid-layout positions (0.0–1.0 fractions) — rank 0 = top-left
- [x] `canvasPadding` option in `OptimizeInput` and `EngineOptions`
- [x] `planChanged()` detects position changes (epsilon 0.001)
- [x] `useGhostPosition(id)` hook returns `{ x, y }` normalized coordinates
- [x] `GhostCanvas` component — ResizeObserver + Framer Motion springs (stiffness 80, damping 18)
- [x] `Ghost.Canvas` added to namespace
- [x] Export `GhostCanvas`, `useGhostPosition` from `@ghost-ui/react`
- [x] 5 position tests in optimizer.test.ts
- [x] `GhostCanvasDemo` in playground Demo tab (6 app-launcher icons)

### Additional files changed

| File | Change |
|---|---|
| `packages/core/src/types.ts` | `position` field on `LayoutPlan` |
| `packages/core/src/optimizer.ts` | `canvasPadding` in `OptimizeInput`, position grid computation |
| `packages/core/src/engine.ts` | `canvasPadding` in `EngineOptions`, wired to optimizer, `planChanged` position check |
| `packages/react/src/hooks.ts` | `useGhostPosition(id)` |
| `packages/react/src/components.tsx` | `GhostCanvas` component + `Ghost.Canvas` |
| `packages/core/src/optimizer.test.ts` | 5 canvas position tests |
| `apps/playground/src/App.tsx` | `GhostCanvasDemo` + `CanvasItem` components |

### Design decisions

- **Grid layout for positions**: Items are arranged in a `ceil(sqrt(N)) × ceil(N/cols)` grid. The highest-ranked item occupies (0, 0) — top-left — and lower-ranked items fill right then down. This gives the "gravity pull to top-left" effect without complex physics.
- **Normalized coordinates**: Positions are 0–1 fractions of container dimensions so the optimizer stays container-size-agnostic. `GhostCanvas` multiplies by actual pixel dims (via ResizeObserver) when passing to Framer Motion's `animate`.
- **Spring physics**: `stiffness: 80, damping: 18` gives a satisfying but not distracting float animation. Items visibly drift when rankings change.
- **`canvasPadding = 0.10`**: Items are placed within the inner 80% of the container so they don't clip at the edges. Configurable.
- **Items position from top-left corner**: `GhostCanvas` positions each item at `(x * w, y * h)` from its own top-left. The item's own width/height is not accounted for — designers can set a fixed `width`/`height` on items and they'll be predictably placed.
