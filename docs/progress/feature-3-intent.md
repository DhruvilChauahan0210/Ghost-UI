# Feature 3 — Intent Pre-Rendering (Markov Chain)

**Status:** ✅ Complete  
**Estimated effort:** 6 days  
**Started:** 2026-05-09

---

## Goal

Use a first-order Markov chain built from hover→click sequences to predict the user's next interaction. When a user hovers over node A, automatically compute which nodes they are most likely to click next and expose that as a probability signal that components use to render a subtle "ghost" glow — the UI begins to pre-signal the likely next move before the click happens.

---

## Tasks

### Engine / Core

- [x] Add `intentWindowMs` option to `ObserverOptions` (default 2000ms)
- [x] Track `lastHover` in Observer — updated on every `hover` event
- [x] Record `from→to` transition when click B follows hover A (A ≠ B, within window)
- [x] `getTransitions(): Map<GhostId, Map<GhostId, number>>` on Observer
- [x] `recomputeTransitions()` — rebuilds transition map by scanning buffer (called after `ingest()` and `evictExpired()`)
- [x] `clear()` resets transitions and `lastHover`
- [x] `predictNext(hoveredId): {id, probability}[]` on GhostEngine — normalised, sorted, top-5

### React Bindings

- [x] Add `hoveredNodeId: GhostId | null` + `setHoveredNodeId` to `GhostContext`
- [x] `useGhostHoveredNode()` hook — returns `[hoveredNodeId, setHoveredNodeId]`
- [x] `useGhostIntent(override?)` hook — returns predictions for current (or overridden) hovered node
- [x] `Ghost.Button` updates context on hover enter/leave
- [x] `Ghost.Item` updates context on hover enter/leave
- [x] `Ghost.Button` applies intent glow styling scaled by probability
- [x] `Ghost.Item` applies intent glow styling scaled by probability
- [x] `data-ghost-intent` attribute on both components

### Keyframes

- [x] `ghost-intent-pulse` keyframe added to `shake.ts`

### Tests

- [x] Observer: transition recorded on hover→click within window
- [x] Observer: no transition if same node clicked after hover
- [x] Observer: no transition if click outside intent window
- [x] Observer: transitions cleared on `clear()`
- [x] Observer: transitions rebuilt on `ingest()`
- [x] Observer: transitions rebuilt after `evictExpired()`
- [x] Engine: `predictNext` returns empty for unknown node
- [x] Engine: `predictNext` returns normalised probabilities summing to 1
- [x] Engine: `predictNext` returns most probable target first

### Playground

- [x] Intent prediction panel in Debug tab (shows live predictions for selected node)
- [x] Demo tab shows ghost glow on predicted targets automatically (via Ghost.Button)

---

## Files changed

| File | Change |
|---|---|
| `packages/core/src/observer.ts` | +`lastHover`, +`transitions`, +`recordTransition()`, +`getTransitions()`, +`recomputeTransitions()`, updated `clear()`, `ingest()`, `evictExpired()` |
| `packages/core/src/engine.ts` | +`predictNext()` |
| `packages/react/src/context.tsx` | +`hoveredNodeId` state, +`useGhostHoveredNode()` |
| `packages/react/src/hooks.ts` | +`useGhostIntent()` |
| `packages/react/src/components.tsx` | +intent glow, +`data-ghost-intent`, hover context update |
| `packages/react/src/shake.ts` | +`ghost-intent-pulse` keyframe |
| `packages/core/src/observer.test.ts` | +transition tests |
| `packages/core/src/engine.test.ts` | +predictNext tests |
| `apps/playground/src/App.tsx` | Intent panel in Debug tab |

---

## Design decisions

- **First-order Markov only.** We track `hover A → click B` pairs. No multi-step chains — they'd need far more data to be meaningful and would explode the transition matrix.
- **Intent window default: 2000ms.** Long enough to catch deliberate hover→click, short enough to exclude accidental hover passes.
- **Transitions derived on load, not persisted.** When events are loaded from IndexedDB/localStorage, `ingest()` calls `recomputeTransitions()` to rebuild from the event stream. No schema change needed.
- **Probability threshold for visual effect: 0.05.** Below 5% confidence, no glow is shown — avoids visual noise when data is sparse.
- **Top-5 predictions returned.** Enough for any realistic layout, prevents the return array from growing unbounded.
- **`setHoveredNodeId(null)` on leave.** Intent predictions clear immediately when the cursor leaves a node. Keeps the ghost effect tied tightly to active hover state.
