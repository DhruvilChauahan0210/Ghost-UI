# @ghost-ui/react

React 19 bindings for Ghost UI. Components that reorder themselves around each user's click habits.

## Install

```bash
npm install @ghost-ui/react @ghost-ui/core
```

**Peer dependencies:** `react >= 18`, `react-dom >= 18`, `motion >= 11`

## Quick start

```tsx
import { GhostProvider, Ghost } from "@ghost-ui/react";
import { localStorageAdapter } from "@ghost-ui/core";

export default function App() {
  return (
    <GhostProvider persistence={localStorageAdapter("my-app")}>
      <Ghost.Slot id="toolbar">
        <Ghost.Button id="btn-save" onClick={save}>Save</Ghost.Button>
        <Ghost.Button id="btn-discard" onClick={discard}>Discard</Ghost.Button>
        <Ghost.Button id="btn-preview" onClick={preview}>Preview</Ghost.Button>
      </Ghost.Slot>
    </GhostProvider>
  );
}
```

The buttons reorder after each session based on which ones get clicked most.

## GhostProvider

Wraps your app (or any subtree). All Ghost components must be descendants.

| Prop | Type | Default | Description |
|---|---|---|---|
| `persistence` | `StorageAdapter` | `memoryAdapter()` | Storage adapter from `@ghost-ui/core` |
| `optimizer` | `OptimizerFn` | built-in | Override the scoring function |
| `recomputeDebounceMs` | `number` | `300` | Debounce window for layout recomputation |
| `scoring` | `Partial<ScoringWeights>` | engine defaults | Override scoring weights |
| `gridTiers` | `GridTierConfig` | — | Column/row mapping per `GravityTier` |
| `canvasPadding` | `number` | `16` | Padding (px) applied by `Ghost.Canvas` |
| `optOut` | `boolean` | `false` | Disable personalization for this user |
| `onOptOutChange` | `(value: boolean) => void` | — | Called when user toggles opt-out |
| `resetHotkey` | `string` | `"mod+shift+g"` | Keyboard shortcut to reset all scores |

## Components

### `Ghost.Slot`

A container whose direct children are reordered by the engine.

```tsx
<Ghost.Slot id="nav-actions" className="flex gap-2">
  <Ghost.Item id="item-a"><button>A</button></Ghost.Item>
  <Ghost.Item id="item-b"><button>B</button></Ghost.Item>
</Ghost.Slot>
```

### `Ghost.Item`

Wraps any element and registers it as a tracked node. Use inside `Ghost.Slot`.

```tsx
<Ghost.Item id="item-export" group="file-actions">
  <MenuItem>Export</MenuItem>
</Ghost.Item>
```

### `Ghost.Button`

Convenience wrapper — a `Ghost.Item` that renders a `<button>`. Forwards all `ButtonHTMLAttributes`.

```tsx
<Ghost.Button id="btn-submit" onClick={handleSubmit}>
  Submit
</Ghost.Button>
```

### `Ghost.Grid`

Positions items in a CSS grid, promoting hot items to larger cells.

```tsx
<Ghost.Grid id="feature-grid" columns={3}>
  <Ghost.Item id="feat-reports">Reports</Ghost.Item>
  <Ghost.Item id="feat-export">Export</Ghost.Item>
  <Ghost.Item id="feat-settings">Settings</Ghost.Item>
</Ghost.Grid>
```

### `Ghost.Canvas`

Free-positioning canvas that drifts items toward the pointer's habitual zones.

```tsx
<Ghost.Canvas id="floating-actions" style={{ width: 400, height: 300 }}>
  <Ghost.Item id="action-pin" initialX={20} initialY={20}>Pin</Ghost.Item>
</Ghost.Canvas>
```

### `Ghost.Menu`

A scored dropdown menu. High-scoring items float to the top.

```tsx
<Ghost.Menu id="file-menu">
  <Ghost.Menu.Trigger>File</Ghost.Menu.Trigger>
  <Ghost.Menu.Content>
    <Ghost.Menu.Item id="menu-new">New</Ghost.Menu.Item>
    <Ghost.Menu.Item id="menu-open">Open</Ghost.Menu.Item>
    <Ghost.Menu.Separator />
    <Ghost.Menu.Item id="menu-quit">Quit</Ghost.Menu.Item>
  </Ghost.Menu.Content>
</Ghost.Menu>
```

### `Ghost.Tab`

A scored tab group. The most-visited tab is surfaced first.

```tsx
<Ghost.Tab id="settings-tabs">
  <Ghost.Tab.List>
    <Ghost.Tab.Item id="tab-general">General</Ghost.Tab.Item>
    <Ghost.Tab.Item id="tab-security">Security</Ghost.Tab.Item>
    <Ghost.Tab.Item id="tab-billing">Billing</Ghost.Tab.Item>
  </Ghost.Tab.List>
  <Ghost.Tab.Panel tabId="tab-general">...</Ghost.Tab.Panel>
  <Ghost.Tab.Panel tabId="tab-security">...</Ghost.Tab.Panel>
  <Ghost.Tab.Panel tabId="tab-billing">...</Ghost.Tab.Panel>
</Ghost.Tab>
```

## Toast

```tsx
import { GhostToastProvider, useGhostToast } from "@ghost-ui/react";

// Wrap your app
<GhostToastProvider>
  <App />
</GhostToastProvider>

// Inside any component
const { toast } = useGhostToast();
toast({ title: "Saved", description: "Your changes were saved." });
```

## Privacy

```tsx
import { GhostPrivacyPanel, useGhostPrivacy } from "@ghost-ui/react";

// Drop-in panel with opt-out toggle and reset button
<GhostPrivacyPanel />

// Or build your own UI
const { optOut, setOptOut, reset } = useGhostPrivacy();
```

## Hooks

### `useGhostOrder(slotId: string): string[]`

Returns the current ordered array of node IDs for a slot.

### `useGhostScore(nodeId: string): number`

Returns the current score (0–1) for a node.

### `useGhostHitbox(nodeId: string): DOMRect | null`

Returns the live bounding rect of a registered node.

### `useGhostArea(rect: DOMRect): string[]`

Returns IDs of nodes whose hitboxes overlap the given rect.

### `useGhostFrustration(): { nodeId: string; level: number }[]`

Returns nodes where rapid repeated interactions suggest friction.

### `useGhostIntent(): string | null`

Predicts the node the user is most likely to interact with next.

### `useRegisterNode(id: string, ref: RefObject<Element>): void`

Manually registers a DOM element as a Ghost node. Used when `Ghost.Item` cannot wrap the element directly.

### `useGhostEngine(): GhostEngine`

Returns the raw engine instance from context.

### `useGhostPlan(): LayoutPlan`

Returns the current `LayoutPlan` (scores, order, tiers).
