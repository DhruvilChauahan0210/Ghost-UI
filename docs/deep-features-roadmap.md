# Ghost UI — Deep Features Roadmap

> Status: **planning**
> Last updated: 2026-05-09
> Reference: the five "career-defining features" brief

---

## 0. What's already done (don't re-plan it)

Before outlining anything new, here's what the engine already ships so we don't waste time re-building it.

| Feature from the brief | Engine status |
|---|---|
| Adaptive Hitbox expansion (miss tracking) | ✅ Done — `observer.record('miss', id, zone, {dx, dy})`, hitbox expansion in optimizer, `useGhostHitbox(id)` hook |
| Privacy-first local storage | ✅ Done — `localStorageAdapter()`, `indexedDBAdapter()` (versioned, schema-migrated) |
| Regret detection | ✅ Done — O(1) flag on previous click when different element clicked in window |
| Devtools overlay | ✅ Done — `@ghost-ui/devtools`, toggled with ⌘. / Ctrl+. |
| Web Worker off-main-thread optimizer | ✅ Done — Comlink wired in `packages/core/src/worker.ts` |
| Per-node score hooks | ✅ Done — `useGhostScore`, `useGhostOrder`, `useGhostPlan`, `useGhostHitbox` |
| Schema-versioned persistence | ✅ Done — `{version: 1, events: [...]}` wrapper with migration path |
| Cold-start ordering | ✅ Done — preserves registration order when no events exist |
| TTL eviction | ✅ Done — `observer.evictExpired(windowMs, now)` called post-recompute |
| 88-test suite | ✅ Done — Observer, RingBuffer, Persistence, Engine all covered |

**Bottom line going in:** The engine is solid and correct. The five features below are additive, not fixes.

---

## 1. Gravity Grid

### What the brief said
> Components with higher "mass" automatically pull themselves toward the Primary Visual Zone. A developer wraps their layout in `<GhostGrid>` and components handle their own positioning based on real usage.

### What it actually means technically

"Pull toward top-left" is 2D arbitrary positioning — components float to CSS `x,y` coordinates. That means:
- Absolutely positioned children inside a relative container
- The engine must output `{x, y}` coordinates per node, not just order
- Framer Motion handles the animation (already a dependency)

The hard constraint: most real UIs are *not* arbitrary 2D canvases. Sidebars, navbars, dashboards — they're CSS Grid or Flex. You can't float a button to `top: 23px, left: 140px` without breaking the layout contract.

### Scoped version that actually ships

Instead of arbitrary 2D float, implement **CSS Grid area promotion**. High-mass nodes get assigned to a larger or more prominent grid area. The mental model is identical ("high usage → promoted position") but the mechanics are layout-safe.

**Phase A — Engine changes:**
1. Extend `LayoutPlan` to include `area: Record<GhostId, string>` (CSS Grid area name or `'primary' | 'secondary' | 'tertiary'` tier).
2. The optimizer maps the top-N scored nodes to `'primary'`, middle to `'secondary'`, rest to `'tertiary'`.
3. `GhostGrid` component wraps children in a CSS Grid with named areas, and each `Ghost.Item` reads its assigned area from the plan.

**Phase B — Actual 2D float (stretch goal):**
Expose a `<GhostCanvas>` for developer-defined canvases (dashboards, widget grids, app launchers) where absolute positioning makes sense. The optimizer outputs `{x, y}` as a fraction of container size (`0.0–1.0`). Framer Motion animates the transition.

**Phase A effort:** ~4 days  
**Phase B effort:** ~1 week additional  
**Risk:** Phase A is safe; Phase B can break non-canvas layouts if misused. Ship Phase A first.

**Files to touch:**
- `packages/core/src/types.ts` — extend `LayoutPlan`
- `packages/core/src/optimizer.ts` — compute area assignments
- `packages/react/src/components.tsx` — new `GhostGrid` + `GhostCanvas`
- `packages/react/src/hooks.ts` — `useGhostArea(id)`

---

## 2. Intent-Based Pre-Rendering (the "Ghost State")

### What the brief said
> Use a Markov Chain to predict the user's next move. If a user hovers over "Pricing," the UI begins to ghost-in the pricing modal at 10% opacity before the click happens.

### Why this one is real

This is the genuinely novel feature in the brief. It's achievable, it produces a visible "mind-reading" effect, and it maps naturally onto what the observer already does (hover events are already recorded).

The algorithm is simple: a first-order Markov chain over interaction sequences. If the user has historically gone `hover:pricing → click:pricing` 80% of the time, then a new `hover:pricing` event should trigger a prediction with 80% confidence.

### Implementation plan

**Step 1 — Sequence tracking in Observer**

The Observer needs to record *transitions*, not just individual events. When event B happens within a short window after event A on a different node, record `A.id → B.id` as a transition pair.

```ts
// New field on Observer (internal)
private transitions = new Map<string, Map<string, number>>();
// key: `${fromId}`, value: Map<toId, count>

private recordTransition(fromId: GhostId, toId: GhostId): void {
  const targets = this.transitions.get(fromId) ?? new Map();
  targets.set(toId, (targets.get(toId) ?? 0) + 1);
  this.transitions.set(fromId, targets);
}
```

Trigger `recordTransition` when a click follows a hover within a short window (default: 2s). The hover is the "intent signal"; the click is the confirmed action.

**Step 2 — Prediction in engine**

```ts
// New method on GhostEngine
predictNext(hoveredId: GhostId): { id: GhostId; probability: number }[] 
```

Returns the top N predicted next-click targets based on historical transitions from `hoveredId`, normalized to sum to 1.0. Returns empty array if no transition history.

**Step 3 — React hook**

```ts
// New hook
useGhostIntent(hoveredId: GhostId | null): { id: GhostId; probability: number }[]
```

The component layer subscribes to this and renders predicted targets at reduced opacity (`0.08–0.12`) with a subtle pulsing animation. The developer controls the visual — the engine only outputs probabilities.

**Step 4 — Ghost rendering**

The `Ghost.Button` component gets an optional `ghostIntensity?: number` prop (`0.0–1.0`). When set, it renders the button at that opacity. `GhostProvider` can feed this automatically from `predictNext`.

**Effort:** ~6 days  
**Risk:** Medium. Markov matrix grows with node count; needs a pruning strategy for large apps (keep top-K transitions per node). The visual "ghost" effect needs to degrade gracefully when prediction confidence is low.

**Files to touch:**
- `packages/core/src/observer.ts` — `transitions` map, `recordTransition`, expose `getTransitions()`
- `packages/core/src/engine.ts` — `predictNext(id)` method
- `packages/react/src/hooks.ts` — `useGhostIntent(id)`
- `packages/react/src/components.tsx` — `Ghost.Button` ghost intensity rendering
- `packages/core/src/persistence.ts` — serialize transitions alongside events

---

## 3. Rage-Click Frustration Detector

### What the brief said
> If the user rage-clicks (clicks rapidly in one spot), trigger a "Help Ghost" or simplify the layout to reduce stress.

### What's already there

Hitbox expansion from near-misses is done. Regret detection (click A → click B quickly) is done. What's missing is *same-element rapid repeat clicks* — the signal for frustration or a broken interaction.

### Implementation plan

**In Observer:**

Track a `clickStreak` counter per node: how many times the same node was clicked within a short window (default 500ms). If the streak hits a threshold (default 3), emit a `'rage'` event.

```ts
private clickStreak: { id: GhostId; ts: number; count: number } | null = null;

// in record(), when type === 'click':
if (this.clickStreak?.id === id && ts - this.clickStreak.ts < this.rageWindowMs) {
  this.clickStreak.count++;
  if (this.clickStreak.count >= this.rageThreshold) {
    const rageEvent: GhostEvent = { id, zone, type: 'rage', ts };
    this.buffer.push(rageEvent);
    this.onEvent?.(rageEvent);
    this.clickStreak = null; // reset after firing
  }
} else {
  this.clickStreak = { id, ts, count: 1 };
}
```

**In optimizer:**

Weight `rage` events as a strong negative signal (default weight: `-8`). A node that frustrates users consistently should drop in ranking and potentially get flagged.

**In engine:**

New method `getFrustratedNodes(): GhostId[]` — returns nodes with recent rage events. The `GhostProvider` exposes this via context.

**Visual trigger in React:**

The `Ghost.Button` component reads frustration state and can apply a visual cue (configurable by developer). The default behavior is a subtle shake animation + exposing an `onRage` callback prop.

**`useGhostFrustration(id)`** hook returns `{ rageCount: number; isFrustrated: boolean }`.

**Effort:** ~3 days  
**Risk:** Low. Builds entirely on existing observer machinery.

**Files to touch:**
- `packages/core/src/types.ts` — add `'rage'` to `GhostEventType`, add `rageWindowMs`/`rageThreshold` to `ObserverOptions`
- `packages/core/src/observer.ts` — `clickStreak` tracking
- `packages/core/src/optimizer.ts` — weight rage events
- `packages/react/src/hooks.ts` — `useGhostFrustration(id)`
- `packages/react/src/components.tsx` — `onRage` prop, frustration animation

---

## 4. Developer Training Dashboard ("The Matrix View")

### What the brief said
> A "Dev Mode" overlay (press Ctrl+G) showing which components are "winning" (gaining mass), which are "dying" (ignored), and a "Replay" button.

### What already exists

`@ghost-ui/devtools` is fully built — it shows per-node scores, heatmap colors, rank badges, and a reset button (toggled with ⌘./Ctrl+.). The existing overlay is the foundation, not the goal.

### What needs to be added

**A. Component velocity ("gaining" vs "dying")**

The engine currently outputs a score snapshot. We need *delta*: is this node's score trending up or down over the last N seconds?

Implementation: the engine stores two snapshots — `plan` (current) and `planPrev` (previous). `velocity[id] = plan.emphasis[id] - planPrev.emphasis[id]`. Positive = gaining, negative = dying, near-zero = stable.

Expose via `useGhostVelocity(id)` hook and add a `+0.12` / `-0.08` velocity badge to the devtools overlay.

**B. Session replay / time-travel scrubber**

The engine is a pure function: `optimize(events_slice, nodes) → plan`. Time-travel is already theoretically possible — slice the event buffer to time T, re-run the optimizer, render the result.

Implementation:
1. The devtools overlay gets a scrubber (`0 → engine.events().length`).
2. Dragging it calls `engine.replayAt(eventIndex)` which runs a local-only optimize call with a sliced event array and returns a plan *without* committing it to subscribers.
3. The devtools renders this replayed plan alongside (or instead of) the live plan.
4. Releasing the scrubber returns to live mode.

**C. "Winning" / "Dying" visual language**

In the Matrix view mode (toggle from the info panel), each node's overlay shifts to show:
- Color: green (gaining, velocity > 0.02) / grey (stable) / red (dying, velocity < -0.02)
- Trend arrow: ↑ / → / ↓
- Sparkline (last 10 plan snapshots): a tiny inline bar chart of emphasis over time

**Effort:** ~5 days (velocity: 1 day, replay: 2.5 days, visual polish: 1.5 days)  
**Risk:** Low. The engine is already structured for pure-function replay. The hard part is UX of the scrubber.

**Files to touch:**
- `packages/core/src/engine.ts` — store previous plan snapshot, expose `velocity`, add `replayAt(index)` method
- `packages/devtools/src/index.tsx` — scrubber UI, Matrix mode toggle, velocity badges, sparklines
- `packages/react/src/hooks.ts` — `useGhostVelocity(id)`

---

## 5. Privacy-First Local Brain

### What the brief said
> All learning happens in IndexedDB or localStorage. "A UI that learns about you, but never leaves you."

### Status: Done

`indexedDBAdapter()` and `localStorageAdapter()` ship in `@ghost-ui/core`. All data is versioned, schema-migrated, and never leaves the browser. This is the default; no server is involved.

**What to add for the pitch:** A visible `<GhostPrivacyBadge />` component — a small inline badge that says "🔒 This layout learns locally · zero servers." Links to a one-page explainer. It's a trust signal, not a technical feature.

**Effort:** < 1 day  
**Risk:** None

---

## Prioritized Build Order

Ordered by **impact-to-effort ratio**:

| # | Feature | Effort | Why this order |
|---|---|---|---|
| 1 | **Rage-Click Detector** | 3 days | Lowest effort, extends work already done, immediate visual payoff |
| 2 | **Devtools velocity + replay** | 5 days | The "Matrix view" is the most shareable screenshot/GIF for GitHub stars. Builds on existing devtools. |
| 3 | **Intent Pre-Rendering (Markov)** | 6 days | The unique "mind-reading" effect. Most novel. Slightly risky — needs transition matrix pruning. |
| 4 | **Privacy Badge** | 1 day | Low effort, high trust signal, completes the privacy-first narrative |
| 5 | **Gravity Grid Phase A** (area promotion) | 4 days | Real and safe. Makes "positioning" claims true. |
| 6 | **Gravity Grid Phase B** (2D canvas) | 1 week | Stretch. Only after Phase A ships and the use case is validated. |

**Total for items 1–5:** ~19 days of focused work, plus Phase B if the canvas pattern gets traction.

---

## What's NOT in this plan (and why)

**LLM adapter (`@ghost-ui/llm`)** — already in the README as "planned." Not in scope here; it's a separate product surface that needs its own design work.

**Rust/WASM optimizer** — already in README. Purely a performance play. The JS optimizer is already fast enough for 1000+ nodes. Defer until profiling shows it as a bottleneck.

**Framework-agnostic (Svelte/Vue)** — correct long-term play, wrong short-term focus. Nail the React DX first.

**Storybook** — good for documentation, but a significant maintenance burden for an early-stage library. Better to document with live examples in `/demo` than maintain a parallel Storybook setup.

**Sending synthetic "Seed Visitor" events** — the demo-plan covers this for `/demo`. It belongs in the demo layer, not the engine.

---

## Architecture decisions to make before building

1. **Transition storage format** — The Markov transitions need to be persisted. Where? Options:
   - Store as a separate key in the same persistence adapter: `{version: 1, events: [...], transitions: {...}}`
   - Derive transitions on load from the event stream (recompute from scratch). Simpler, correct for small buffers, but O(n) on load.
   - **Recommendation:** Derive on load for now. Store explicitly when the buffer exceeds 1000 events.

2. **Gravity Grid backward compatibility** — Extending `LayoutPlan` with `area` must not break existing apps that don't use GhostGrid. The `area` field should be optional (`area?: Record<GhostId, string>`).

3. **Rage event in scoring** — Adding `'rage'` to `GhostEventType` is a minor breaking change for anyone switching on event type. The `switch` in `optimizer.ts` already handles unknown types by falling through; adding `'rage'` there is safe.

4. **Replay vs live engine** — `replayAt(index)` must never commit the replayed plan to real subscribers. It returns a `LayoutPlan` directly, not via the normal commit path. This is already possible because `optimizerFn` is a pure function we call directly.

---

## Success metrics

A feature ships when it passes three checks:

1. **Unit test coverage** — Every new engine method has tests (consistent with the existing 88-test suite).
2. **Playground visible** — The feature is exercisable in the Debug tab of the playground without writing code.
3. **Devtools wired** — The feature's signal (frustration count, intent probability, velocity) appears in the `@ghost-ui/devtools` overlay.
