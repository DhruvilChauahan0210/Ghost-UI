# Feature 1 — Rage-Click Frustration Detector

**Status:** ✅ Complete  
**Estimated effort:** 3 days  
**Started:** 2026-05-09

---

## Goal

Detect when a user rapidly clicks the same element multiple times (rage-clicking), emit a `'rage'` event, penalise the node's score, and expose the frustration state to React components via a hook and `onRage` callback.

---

## Tasks

### Engine / Core

- [x] Add `'rage'` to `GhostEventType` union in `types.ts`
- [x] Add `rage` weight to `ScoringWeights` interface and `DEFAULT_WEIGHTS`
- [x] Add `rageWindowMs` + `rageThreshold` options to `ObserverOptions`
- [x] Implement `clickStreak` tracking in `Observer.record()` — emit rage event when threshold hit
- [x] Add `rage` case to accumulator in `optimizer.ts` (score `s.rages += 1`)
- [x] Wire `w.rage * s.rages` into the base score calculation in optimizer
- [x] Add `getFrustratedNodes(windowMs)` method to `GhostEngine`

### React Bindings

- [x] Add `useGhostFrustration(id)` hook → `{ rageCount: number; isFrustrated: boolean }`
- [x] Add `onRage?: (id: GhostId) => void` prop to `GhostButton` and `GhostItem`
- [x] Add shake animation on `GhostButton` / `GhostItem` when frustrated

### Tests

- [x] Observer: rage fires after N same-element clicks within window
- [x] Observer: rage resets streak after window expires
- [x] Observer: rage does not fire for different elements (that's regret)
- [x] Engine: `getFrustratedNodes()` returns correct set
- [x] Optimizer: rage penalty lowers score

### Playground

- [x] Debug tab shows frustration indicator per node
- [x] Events Log shows `rage` events with distinct colour

---

## Files changed

| File | Change |
|---|---|
| `packages/core/src/types.ts` | +`'rage'` event type, +`rage` scoring weight |
| `packages/core/src/observer.ts` | +`clickStreak` state, +rage emission logic |
| `packages/core/src/optimizer.ts` | +rage accumulation, +rage scoring |
| `packages/core/src/engine.ts` | +`getFrustratedNodes()` |
| `packages/react/src/hooks.ts` | +`useGhostFrustration()` |
| `packages/react/src/components.tsx` | +`onRage` prop, +shake animation |
| `packages/react/src/shake.ts` | CSS `ghost-shake` keyframe injected once on import |
| `packages/core/src/observer.test.ts` | +rage detection tests |
| `packages/core/src/engine.test.ts` | +getFrustratedNodes tests |
| `apps/playground/src/App.tsx` | frustration UI in Debug + Events tabs |

---

## Design decisions

- **Same-element rage only.** Clicking A then B quickly is *regret*, not rage. Rage = N clicks on the same element within a tight window.
- **Default threshold: 3 clicks within 500ms.** Configurable via `ObserverOptions.rageThreshold` and `rageWindowMs`.
- **Score penalty weight: `-6`.** Heavier than regret (`-4`) because rage signals real UX failure, not just second-guessing.
- **Streak resets after firing.** The rage event fires once, then the streak counter clears. A continuous rage-click session fires one rage event, not a stream.
- **onRage fires immediately** when the rage event is emitted, not on the next plan recompute. This lets components respond with a help tooltip / animation without waiting for the debounce.
