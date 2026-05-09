# @ghost-ui/testing

Test utilities for Ghost UI. Provides a controlled engine, event builders, async helpers, and custom Jest/Vitest matchers.

## Install

```bash
npm install --save-dev @ghost-ui/testing
```

## `createTestEngine`

Returns a `GhostEngine` backed by `memoryAdapter` with scoring debounce set to `0` so tests don't need to wait.

```ts
import { createTestEngine } from "@ghost-ui/testing";

const engine = createTestEngine({
  scoring: { recency: 0.6 }, // optional overrides
});
```

## `buildEvents`

Generates arrays of `GhostEvent` fixtures. Useful for seeding deterministic histories.

```ts
import { buildEvents } from "@ghost-ui/testing";

const events = buildEvents([
  { type: "click", nodeId: "btn-save",    count: 10 },
  { type: "click", nodeId: "btn-discard", count: 2  },
  { type: "hover", nodeId: "btn-preview", count: 5, durationMs: 300 },
]);

events.forEach((e) => engine.record(e));
```

Each entry in the config array expands to `count` individual events with monotonically increasing `ts` values.

## `waitForRecompute`

Returns a promise that resolves after the engine emits its next `LayoutPlan`. Use after recording events when debounce is non-zero.

```ts
import { waitForRecompute } from "@ghost-ui/testing";

engine.record({ type: "click", nodeId: "btn-save", ts: Date.now() });
const plan = await waitForRecompute(engine);

expect(plan.order[0]).toBe("btn-save");
```

Accepts an optional timeout (ms, default `1000`).

## `ghostMatchers`

Custom matchers for Jest or Vitest. Register once in your setup file:

```ts
// vitest.setup.ts or jest.setup.ts
import { ghostMatchers } from "@ghost-ui/testing";
import { expect } from "vitest"; // or "@jest/globals"

expect.extend(ghostMatchers);
```

### Available matchers

```ts
// Assert a specific node order for a plan
expect(plan).toHaveOrder(["btn-save", "btn-discard", "btn-preview"]);

// Assert which node is first
expect(plan).toHaveTopNode("btn-save");

// Assert a node's score is within tolerance (default ±0.05)
expect(plan).toHaveScore("btn-save", 0.91);
expect(plan).toHaveScore("btn-save", 0.91, { tolerance: 0.02 });

// Assert one node outranks another
expect(plan).toBeRankedBefore("btn-save", "btn-discard");
```

## `renderWithGhost`

Renders a React component inside a pre-configured `GhostProvider`. Returns everything from `@testing-library/react`'s `render` plus the underlying `GhostEngine`.

```ts
import { renderWithGhost } from "@ghost-ui/testing";
import { Ghost } from "@ghost-ui/react";

const { getByRole, engine } = renderWithGhost(
  <Ghost.Slot id="actions">
    <Ghost.Button id="btn-save">Save</Ghost.Button>
    <Ghost.Button id="btn-cancel">Cancel</Ghost.Button>
  </Ghost.Slot>,
  {
    engineOptions: { scoring: { frequency: 0.5 } },
  },
);

await userEvent.click(getByRole("button", { name: "Save" }));
const plan = await waitForRecompute(engine);
expect(plan).toHaveTopNode("btn-save");
```

The `engineOptions` argument accepts the same options as `createTestEngine`.
