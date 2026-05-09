# @ghost-ui/core

Framework-agnostic behavior-learning engine. Tracks user interactions, scores UI nodes, and produces optimized layout plans. React bindings live in `@ghost-ui/react`.

## Install

```bash
npm install @ghost-ui/core
```

## Quick start

```ts
import { GhostEngine, localStorageAdapter } from "@ghost-ui/core";

const engine = new GhostEngine({
  adapter: localStorageAdapter("my-app"),
});

engine.record({ type: "click", nodeId: "btn-save", ts: Date.now() });

const plan = engine.getPlan();
// { order: ["btn-save", "btn-cancel", ...], scores: { "btn-save": 0.91, ... } }
```

## GhostEngine

### Constructor options

| Option | Type | Default | Description |
|---|---|---|---|
| `adapter` | `StorageAdapter` | `memoryAdapter()` | Persistence layer for events and state |
| `scoring` | `Partial<ScoringWeights>` | see below | Override scoring weights |
| `debounceMs` | `number` | `300` | Debounce window before recomputing layout |
| `optimizer` | `OptimizerFn` | built-in | Custom or worker-based optimizer |
| `maxEvents` | `number` | `2000` | Ring buffer capacity |

### Methods

```ts
// Record a user interaction
engine.record(event: GhostEvent): void

// Subscribe to layout plan updates
engine.subscribe(cb: (plan: LayoutPlan) => void): () => void

// Get the current layout plan synchronously
engine.getPlan(): LayoutPlan

// Reset all recorded events and scores
engine.reset(): void

// Explain how a node's score was calculated
engine.explainScore(nodeId: string): ScoreBreakdown

// Predict the next node a user is likely to interact with
engine.predictNext(): string | null

// Get interaction velocity (events per minute) for a node
engine.getVelocity(nodeId: string): number

// Replay state as it was at a given timestamp
engine.replayAt(ts: number): LayoutPlan
```

## Adapters

### `memoryAdapter()`

In-memory only. No persistence across sessions. Useful for SSR and tests.

```ts
import { memoryAdapter } from "@ghost-ui/core";
const engine = new GhostEngine({ adapter: memoryAdapter() });
```

### `localStorageAdapter(key)`

Persists to `localStorage` under the given key. Browser only.

```ts
import { localStorageAdapter } from "@ghost-ui/core";
const engine = new GhostEngine({ adapter: localStorageAdapter("ghost-ui-v1") });
```

### `serverAdapter(options)`

Syncs events to a remote endpoint. Useful for cross-device personalization.

```ts
import { serverAdapter } from "@ghost-ui/core";

const engine = new GhostEngine({
  adapter: serverAdapter({
    endpoint: "/api/ghost",
    userId: currentUser.id,
    flushIntervalMs: 5000,
  }),
});
```

The server adapter `POST`s batches of `GhostEvent[]` to `endpoint`. Implement the route to store and return events however you like.

### `compositeAdapter(...adapters)`

Writes to all adapters; reads from the first one that returns data.

```ts
import { compositeAdapter, localStorageAdapter, serverAdapter } from "@ghost-ui/core";

const engine = new GhostEngine({
  adapter: compositeAdapter(
    localStorageAdapter("ghost-ui-v1"),
    serverAdapter({ endpoint: "/api/ghost", userId }),
  ),
});
```

### `createWorkerOptimizer(worker)`

Offloads `optimize()` to a Web Worker to keep scoring off the main thread.

```ts
import { GhostEngine, createWorkerOptimizer } from "@ghost-ui/core";

const engine = new GhostEngine({
  optimizer: createWorkerOptimizer(
    new Worker(new URL("./ghost.worker.ts", import.meta.url), { type: "module" }),
  ),
});
```

Inside `ghost.worker.ts`:

```ts
import { optimize } from "@ghost-ui/core";
self.onmessage = (e) => self.postMessage(optimize(e.data));
```

## ScoringWeights

Default weights used to compute each node's score:

```ts
const defaults: ScoringWeights = {
  recency: 0.4,    // how recently the node was interacted with
  frequency: 0.35, // how often relative to other nodes
  velocity: 0.15,  // rate of interaction change over time
  proximity: 0.1,  // spatial closeness to prior interaction
};
```

Pass `scoring` to `GhostEngine` to override any subset.

## Types

```ts
type GhostEvent =
  | { type: "click";    nodeId: string; ts: number; x?: number; y?: number }
  | { type: "hover";    nodeId: string; ts: number; durationMs: number }
  | { type: "focus";    nodeId: string; ts: number }
  | { type: "keypress"; nodeId: string; ts: number; key: string }
  | { type: "custom";   nodeId: string; ts: number; payload?: unknown };

interface GhostNode {
  id: string;
  label?: string;
  group?: string;
}

interface LayoutPlan {
  order: string[];
  scores: Record<string, number>;
  tier: Record<string, GravityTier>;
  ts: number;
}

type GravityTier = "hot" | "warm" | "cold" | "inert";

interface ScoringWeights {
  recency: number;
  frequency: number;
  velocity: number;
  proximity: number;
}
```

## `optimize()`

The standalone scoring function. Takes a snapshot of events and returns a `LayoutPlan`. Safe to call in a worker or during SSR.

```ts
import { optimize } from "@ghost-ui/core";

const plan = optimize(events, { scoring: { recency: 0.6 } });
```

## `RingBuffer`

Fixed-capacity FIFO buffer used internally to cap memory usage. Exposed for custom adapters or optimizers.

```ts
import { RingBuffer } from "@ghost-ui/core";

const buf = new RingBuffer<GhostEvent>(500);
buf.push(event);
buf.toArray(); // GhostEvent[]
buf.size;      // number of entries currently held
```
