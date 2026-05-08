# Feature 2 — Devtools Velocity + Replay Scrubber

**Status:** ✅ Complete  
**Estimated effort:** 5 days  
**Started:** 2026-05-09

---

## Goal

Give developers a "Matrix view" of their Ghost UI — which components are gaining momentum, which are dying, and a time-travel scrubber to replay how the layout evolved event-by-event.

---

## Tasks

### Engine / Core

- [x] Store `planPrev` snapshot updated each time `commit()` fires
- [x] Maintain `emphasisHistory` circular buffer (last 10 values per node) for sparklines
- [x] `getVelocity(id): number` — `emphasis[id] - prevEmphasis[id]`
- [x] `getEmphasisHistory(id): number[]` — returns last 10 emphasis snapshots
- [x] `replayAt(eventIndex): Promise<LayoutPlan>` — runs optimizer on sliced event array, never commits

### React Bindings

- [x] `useGhostVelocity(id): number` hook in `hooks.ts`

### Devtools Overlay

- [x] Velocity badges on node overlays (`+0.12 ↑` / `-0.08 ↓`)
- [x] Matrix mode toggle — switches overlay colors from score-based to velocity-based (green/grey/red)
- [x] Sparklines in the node info panel (10-bar mini chart per node)
- [x] Replay scrubber in info panel — range input from 0 → events.length
- [x] Replay mode indicator (shows "REPLAY @idx / total" banner)
- [x] Auto-return to live mode on scrubber release / click outside

### Tests

- [x] `getVelocity()` returns correct delta after two plan commits
- [x] `getEmphasisHistory()` stores up to 10 values and evicts oldest
- [x] `replayAt(0)` returns cold-start plan (no events)
- [x] `replayAt(n)` returns consistent plan for same slice
- [x] `replayAt` does not commit to subscribers

### Playground

- [x] `<GhostDevtools>` wired into playground App so it's visible during testing

---

## Files changed

| File | Change |
|---|---|
| `packages/core/src/engine.ts` | +`planPrev`, +`emphasisHistory`, +`getVelocity()`, +`getEmphasisHistory()`, +`replayAt()` |
| `packages/react/src/hooks.ts` | +`useGhostVelocity()` |
| `packages/devtools/src/index.tsx` | Matrix mode, velocity badges, sparklines, replay scrubber |
| `apps/playground/src/App.tsx` | Add `<GhostDevtools>` |
| `packages/core/src/engine.test.ts` | Velocity + replay tests |

---

## Design decisions

- **`planPrev` is initialized equal to the empty plan** so velocity on first commit is 0 (not NaN). This is correct — there's no "previous" to compare against.
- **Emphasis history capped at 10** — enough for a readable sparkline, negligible memory cost, matches the visual 10-bar design.
- **`replayAt` never calls `commit()`** — it calls `optimizerFn` directly and returns the result. Subscribers are never notified. This is safe because `optimizerFn` is a pure function.
- **Replay scrubber position 0** = no events (cold-start plan). **Max position** = all events (same as live, subject to recency weighting). At max, the panel shows "Live" instead of "Replay".
- **Matrix mode** colors nodes by velocity sign rather than score magnitude. Makes it immediately obvious which nodes are trending.
