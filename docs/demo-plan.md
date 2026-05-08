# Ghost UI — Demo Strategy

> Status: proposal
> Owner: site
> Last updated: 2026-05-08

## 1. The problem

The current landing page demo (`apps/site/src/app/LandingDemo.tsx`) is a single zone with 5 buttons, a score panel, and an event stream. It works, but it undersells the engine by an order of magnitude.

The engine actually does six distinct things:

1. **Reorder** — buttons drift toward the user's preference
2. **Recency decay** — yesterday's clicks weigh less than today's
3. **Near-miss hitbox expansion** — if a user repeatedly clicks just to the right of a button, the hitbox silently grows that direction
4. **Regret detection** — if a user clicks A then B within 3 seconds, A's score is penalized
5. **Dwell scoring** — sustained hovers feed a separate, low-weight signal
6. **Persistence + replay** — the layout you trained yesterday is the layout you see today

The current demo shows **only #1**, weakly. A visitor sees buttons swap places and thinks "OK, that's a sortable list." They don't grasp that there's an entire local-first ML-adjacent system behind it. That's the conviction gap.

The fix is a two-tier demo strategy:

- **Landing-page demo** — short, immediate, shows enough depth to make a developer want to dig further. Optimized for "first 5 seconds."
- **Full demo page** (`/demo` or `/playground`) — a realistic app environment that exposes every dial, surfaces every signal, and lets a developer convince themselves this is production-grade.

---

## 2. Why the current landing demo feels thin (root causes)

Beyond "it's small," there are concrete reasons it underperforms:

| Problem | Why it hurts |
|---|---|
| **Empty cold-start** | First-time visitor lands → no events → score panel is empty → "no data yet" message. The product looks broken at t=0. |
| **No visible affordance** | Buttons look like buttons. Nothing screams "interact with me — something is going to happen." |
| **Reorder is slow to trigger** | Click-weight is 3, you need ~3-4 clicks on the same button before its score visibly outranks others. Visitors leave before the payoff. |
| **No before/after** | The user sees the *current* state, never the *delta*. The interesting thing is the change, but the change is invisible after it happens. |
| **Engine depth is invisible** | Near-miss correction, regret, recency, dwell — none of these have any visual presence on the landing page. The bento cards *describe* them but the demo doesn't *show* them. |
| **No persistence proof** | The whole "your layout, persisted locally" pitch is told but not shown. A visitor would have to refresh the page to see it, and they won't. |
| **Decorative bento viz != live** | The Layout/Optimizer/Persistence vizzes in the architecture section are CSS animations, not real engine output. A sharp visitor will notice this is a lie. |

The first three are the most damaging.

---

## 3. Landing-page demo — the upgrade plan

### 3.1 Design goals

1. **Hot-start, not cold-start.** First paint already shows a "trained" layout — the demo seeds the engine with synthetic events on mount so there's always a meaningful order, glow, and scoreboard from frame 1.
2. **One headline interaction.** Visitor clicks one button → sees the layout *physically* respond within 400ms. Spring animation, glow ramp, score bar fills.
3. **One "wait, what?" moment.** Something subtle that surprises — e.g., the visitor's *third* click on the same button visibly accelerates that button's rise. Or a near-miss correction visualization (next section).
4. **Honest, not faked.** Every pixel of the demo is driven by the real engine. No CSS animation pretending to be the optimizer.

### 3.2 Concrete spec

Replace `LandingDemo.tsx` with `LandingDemoV2.tsx`. Structure:

```
┌──────────────────────────────────────────────────────────┐
│ Ghost UI — Live Dashboard                                │
├──────────────────────────────────────────────────────────┤
│ [Live] Events Plan         ghost-ui.dev      ⌘ . devtools │ ← already exists
├──────────────────────────────────────────────────────────┤
│                                                          │
│  hero.cta  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐│
│            │ Sign up │ │  Docs   │ │ GitHub ★│ │ Pricing││ ← Ghost.Slot zone="hero.cta"
│            └─────────┘ └─────────┘ └─────────┘ └────────┘│
│            [primary]   [trained]   [pinned]   [decaying]│
│                                                          │
│  toolbar   [New] [Save] [Share] [Export] [Settings]     │ ← Ghost.Slot zone="hero.toolbar"
│                                                          │
├──────────────────────────────────────────────────────────┤
│ Score (zone: hero.cta)         │ Live signals             │
│ ─────────────────────────────  │ ──────────────────       │
│ Sign up    ▰▰▰▰▰▰▰▰▱▱  0.84   │ ▲ click   docs           │
│ Docs       ▰▰▰▰▰▰▱▱▱▱  0.61   │ ◐ dwell   github · 240ms │
│ GitHub ★   ▰▰▰▱▱▱▱▱▱▱  0.30 📌│ ↯ miss    docs · +14px   │ ← near-miss event
│ Pricing    ▰▰▱▱▱▱▱▱▱▱  0.18   │ ⨯ regret  pricing        │ ← regret event
│                                │                          │
├──────────────────────────────────────────────────────────┤
│ 247 events · 4 nodes · plan v34 · localStorage  [reset]  │
└──────────────────────────────────────────────────────────┘
```

Changes from current demo:

1. **Two zones, not one** — `hero.cta` (4 buttons) + `hero.toolbar` (5 buttons). Two zones moving independently makes the system feel more capable than a single sortable list. The toolbar is closer to a real app surface.

2. **Hot-start with seeded events** — on mount, `engine._injectEvents([...synthetic 30-event history])`. The visitor sees a layout that's already learned. The first click then *adjusts* a learned state instead of starting from zero.

3. **One pinned button per zone** — shows pinning visually with a 📌 indicator and explains the production use case (e.g., your "Sign in" button stays where it is regardless of usage).

4. **A near-miss hint** — when the user clicks within ~14px of a button but misses, the engine records a `miss` event and the button silently expands its hitbox in that direction. We surface this with a brief, fading purple "ripple" at the miss location and an event in the live signals stream. **This is the moment that sells the engine.** Visitors will literally try to "miss" the button after seeing it once.

5. **Regret in the open** — clicking button A then B within 3s adds a `⨯ regret` line in the live signals. A's score visibly dips. We don't need to over-explain it; the label "regret" is its own pitch.

6. **Decay made visible** — a button not clicked in the last 10 seconds shows a slow opacity dip (0.85→1.0 ramp on click, decays back over time). The bar in the score panel also slowly recedes. This makes recency decay tangible without simulating 24h.

7. **Persistence proof bar** — at the bottom of the demo: a tiny "💾 saved 2s ago · refresh to see it persist" hint with a real "open in new tab" link that loads the same demo with a query param `?inherit=true` so the new tab inherits the localStorage. (Or simply: a "force refresh demo" button that does a soft reload of the demo island and shows the layout restored.)

8. **Cursor "spotlight"** — when the user hovers, a subtle radial highlight follows the cursor. Already half-built in `MouseTracker.tsx`. Repurpose for the demo to make it feel alive.

9. **Reduced motion** — already respected in the existing code; preserve.

### 3.3 What stays the same

- The `MacWindow` chrome stays. It's working and on-brand.
- The titlebar / toolbar / segment control stays.
- The status bar at the bottom stays (events count, plan version, persistence type, reset).
- The event stream stays but is renamed "Live signals" and gets distinct icons per event type. The existing event row layout is fine.

### 3.4 What gets cut

- Nothing structural. This is purely additive on top of the current demo's chrome.

### 3.5 Performance budget

The landing demo must not cost more than ~5KB extra JS gzipped, must not push CLS above 0, and must run at 60fps on the median laptop. Two zones × 9 nodes is well within engine capacity (the engine targets 100s of nodes).

### 3.6 Acceptance checklist

- [ ] Landing visitor sees a non-empty, plausibly-trained layout at first paint
- [ ] Clicking any button visibly reorders within 400ms
- [ ] At least one engine "depth" feature (near-miss or regret) fires within typical visitor interaction (<10s)
- [ ] Devtools (⌘.) overlay works on the landing demo nodes
- [ ] Resetting clears state; refresh restores from localStorage
- [ ] No CSS-only fake animation; every visible element is engine-driven

---

## 4. Full demo page (`/demo`)

This is where a developer goes after the landing page hooks them. Goal: convince them this is production-grade. Time horizon: a developer will spend 2–10 minutes here.

### 4.1 Concept: "Acme Workspace"

A fake but realistic SaaS workspace UI — a sidebar, a top toolbar, a content area, a contextual right rail. Every interactive element is a `Ghost.Item` or `Ghost.Button`. As the developer plays with it, the workspace adapts. Then a control panel on the right exposes every dial and signal.

```
┌────────────────────────────────────────────────────────────────────────┐
│ ACME WORKSPACE  |  Files  Search  Inbox       [+New ▾]  ⌘K   👤        │ ← top bar (zone: app.topbar)
├──────────┬────────────────────────────────────────────┬────────────────┤
│ Sidebar  │ Content                                    │ Control panel  │
│          │                                            │ ─────────────  │
│ Recent   │  [filter]  [sort]  [export]  [share]       │ Speed: ──●──   │
│ Pinned   │                                            │ Half-life: 24h │
│ Shared   │  ╭─────────────────────────────────────╮  │ Click w: 3.0   │
│ Trash    │  │ document tile │ document tile │ ...  │  │ Hover w: 0.5   │
│          │  ╰─────────────────────────────────────╯  │ Dwell w: 0.001 │
│ ────     │                                            │ Regret w: -4   │
│ Tags     │  [primary CTA: open]  [secondary: edit]    │ ───────────    │
│ ⌃shift+k │                                            │ ☐ Heatmap      │
│          │                                            │ ☐ Hitbox view  │
│          │                                            │ ☐ Time-travel  │
│          │                                            │ [Seed visitor] │
│          │                                            │ [Reset]        │
└──────────┴────────────────────────────────────────────┴────────────────┘
```

### 4.2 What's exposed (every engine feature, visible)

1. **Three zones in concert**
   - `app.topbar` — top nav buttons, reorders subtly
   - `app.sidebar` — sidebar nav items (Recent / Pinned / Shared / Trash) reorder by usage
   - `app.toolbar` — content area toolbar (filter / sort / export / share) reorders aggressively

2. **Heatmap toggle** — lights up the existing `GhostDevtools` overlay on every node. The developer sees scores and hue-shifted glows in real time. (We already ship `@ghost-ui/devtools`. The page just embeds it with `defaultOpen={true}` when toggled.)

3. **Hitbox visualization** — a debug mode that draws the actual expanded hitbox (`useGhostHitbox(id)`) as a dashed purple outline around each button. Makes the silent near-miss correction visible. **This is the most underrated feature; making it visible here is the win.**

4. **Time-travel** — a horizontal scrubber that replays event history. Drag the scrubber back to t-30s and the layout rewinds. Drag forward and it replays. This is feasible because the optimizer is a pure function of `(events, nodes, weights)`. Implementation: hold `engine.events()`, slice to scrubber position, call optimizer manually with the slice, render the resulting plan via a forked `useGhostPlan` that reads from local state.

5. **Live weight tuning** — the four scoring weights (click / hover / dwell / regret) and recency half-life are sliders. As the developer drags, the engine recomputes (the engine accepts `scoring.weights` at construction; we need a small extension to allow live updates, or simply reconstruct the engine on weight change with replayed events). This proves "pure function — easy to swap kernel."

6. **Seed visitor** — a button that simulates 100 synthetic users with different behavior profiles ("power user," "casual," "explorer," "regret-prone") clicking randomly with realistic distributions, fast-forwarded over 30s. Watch the layout converge. Visitors *love* this kind of "see the system at scale" demo.

7. **Persistence demo** — explicit "refresh tab" button + visible localStorage key inspector showing the current event count and bytes used. Developer can copy the localStorage key to inspect in DevTools. Reinforces local-first.

8. **Pinning UX** — drag-to-pin / right-click → pin. Pinned items show a 📌 and never reorder. Demonstrates the production override pattern.

9. **Custom optimizer drop-in** — a code panel with two buttons: "Default optimizer" / "Reverse optimizer" (toy: highest-clicked goes to *bottom*, just to prove the optimizer is swappable at runtime). Real value: the developer learns the engine accepts a custom function.

10. **Worker mode** — a checkbox: "Run optimizer in Web Worker." When toggled, the optimizer runs off the main thread (this requires wiring Comlink, which the engine is already designed for per the EngineOptions surface). Show a frame-time graph (devtools-style) confirming main-thread idle time. Production-credibility move.

11. **Adversarial mode** — a button that simulates one user "thrashing" (rapid alternating clicks). Shows regret penalties in action. Sells the engine's robustness against noise.

### 4.3 Page structure

```
/demo
├── hero (single line, no fluff): "Ghost UI in a real app — every signal, every dial."
├── workspace (the fake app, ~70vh)
├── control panel (right rail, fixed)
├── below the fold: implementation notes + code snippets
│   ├── how each engine feature maps to the UI here
│   ├── copy-pasteable snippets for each pattern (pinning, weights, custom optimizer, worker)
│   └── footer: link to GitHub, npm, devtools docs
```

### 4.4 What this page is NOT

- **Not a tutorial.** No "step 1 / step 2." A developer who lands here already knows what Ghost UI is from the landing page.
- **Not a playground for arbitrary code.** No CodeSandbox embed. We control the surface.
- **Not interactive docs.** Docs live at `/docs`. This page is a *demo* — observation-first, with knobs.

### 4.5 Implementation phases

| Phase | Scope | Effort |
|---|---|---|
| **P0** | Workspace shell, 3 zones with real `Ghost.*` components, control panel skeleton, weight sliders | ~1 day |
| **P1** | Time-travel scrubber, heatmap toggle, hitbox visualization | ~1.5 days |
| **P2** | Seed-visitor simulator, adversarial mode, persistence inspector | ~1 day |
| **P3** | Worker-mode toggle, custom-optimizer drop-in, frame-time graph | ~1 day |
| **P4** | Polish: copy, code snippets below the fold, dark/light parity, mobile fallback ("view on desktop" message — the page is desktop-first by design) | ~0.5 day |

Total: ~5 days of focused build. P0–P1 alone (~2.5 days) is enough to be a meaningful upgrade if we need to cut.

### 4.6 Mobile strategy

The full `/demo` page is desktop-first. On <768px we render a static screenshot of the workspace + a callout: "open on desktop for the full demo." The landing-page demo (Section 3) handles the mobile story.

### 4.7 Acceptance checklist

- [ ] Three independent zones reorder live, driven by real engine output
- [ ] All five engine signals (click, hover, dwell, miss, regret) are visible somewhere on the page
- [ ] All four scoring weights + half-life are tunable live
- [ ] Time-travel scrubber works backward and forward through full event history
- [ ] Heatmap and hitbox visualization toggle on/off without page reload
- [ ] Seed-visitor simulation completes 100 visitors in <5s with no main-thread jank
- [ ] Worker mode toggle measurably reduces main-thread time (visible in frame-time graph)
- [ ] Page passes Lighthouse Performance ≥85 on desktop

---

## 5. Sequencing: what to build first

Recommendation:

1. **Week 1** — Ship the upgraded landing demo (Section 3). This is the highest leverage change because it gates all conversion. ~2 days of work, tests against the existing chrome.
2. **Week 2** — Build `/demo` P0+P1 (the workspace + heatmap/hitbox/time-travel). This is what closes the developer who got hooked by the landing page.
3. **Week 3** — `/demo` P2+P3 (seed visitor, worker mode, custom optimizer). Cuttable if early signal is strong enough without it.

Defer until validated: an interactive playground / CodeSandbox-style page. That's a separate product-shaped commitment and shouldn't block this work.

---

## 6. Open questions

1. **Seeded events on the landing demo** — do we want the visitor's *real* localStorage to be seeded (mutating their state), or just an in-memory seed that doesn't persist? Recommendation: in-memory seed for the first session; switch to real persistence once the visitor has produced ≥3 real events. Avoids polluting their state with our fake signals.
2. **Time-travel and the live engine** — when scrubbing, does new visitor activity pause (engine "frozen"), or does it continue and the scrubber detaches? Recommendation: scrubbing pauses the live engine; releasing the scrubber resumes from "now."
3. **Worker mode wiring** — Comlink isn't a current dependency. Adding it costs ~3KB. Acceptable for the demo page (not bundled into core).
4. **Persistence keys** — if landing demo and `/demo` page both use localStorage, do they share a key or namespace separately? Recommendation: namespace separately (`ghost-ui:landing` vs `ghost-ui:workspace-demo`) so resetting one doesn't nuke the other.

---

## 7. Out of scope (intentionally)

- Real backend / sync. Ghost UI is local-first; the demo must reflect that.
- A/B test framework comparison. Don't lecture; let the demo speak.
- Marketing copy rewrites elsewhere on the site. Separate work.
- Mobile demo parity for `/demo`. Desktop-only is acceptable for v1.
