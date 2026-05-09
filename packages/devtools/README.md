# @ghost-ui/devtools

Developer overlay for Ghost UI. Inspect node scores, browse the event timeline, and scrub through layout history — without leaving the browser.

## Install

```bash
npm install --save-dev @ghost-ui/devtools
```

## Usage

Drop `<GhostDevtools />` anywhere inside `<GhostProvider>`. It renders nothing in production (`NODE_ENV === "production"`).

```tsx
import { GhostProvider } from "@ghost-ui/react";
import { GhostDevtools } from "@ghost-ui/devtools";

export default function App() {
  return (
    <GhostProvider persistence={adapter}>
      <YourApp />
      {process.env.NODE_ENV === "development" && <GhostDevtools />}
    </GhostProvider>
  );
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `defaultOpen` | `boolean` | `false` | Whether the panel starts open |

## Keyboard shortcut

**`Cmd+.`** (Mac) / **`Ctrl+.`** (Windows/Linux) toggles the panel open and closed.

## Panels

### Score Inspector

Lists every registered node alongside its current score (0–1), gravity tier (`hot` / `warm` / `cold` / `inert`), and a sparkline of score history. Click a row to pin it and see a full `explainScore` breakdown: recency, frequency, velocity, and proximity contributions.

### Event Timeline

A chronological feed of `GhostEvent` entries flowing into the engine in real time. Filterable by event type and node ID. Each entry shows type, node, timestamp, and any extra payload fields.

### Replay Scrubber

A seek bar over the full event history. Drag to any point in time to see the `LayoutPlan` — order and scores — as it existed at that moment. Useful for understanding why a layout shifted after a session.
