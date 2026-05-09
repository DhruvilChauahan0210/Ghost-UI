# Ghost UI

Interfaces that learn. Drop in Ghost components and your UI silently adapts to each user's muscle memory — reordering menus, buttons, tabs, and toasts around what they actually use.

All learning happens **locally in the browser**. No server, no tracking, no data leaves the device.

## Packages

| Package | Description |
|---|---|
| [`@ghost-ui/core`](packages/core) | Framework-agnostic engine — observer, optimizer, persistence adapters, worker optimizer |
| [`@ghost-ui/react`](packages/react) | React 19 bindings — `GhostProvider`, all `Ghost.*` components, hooks |
| [`@ghost-ui/devtools`](packages/devtools) | In-app score inspector, event timeline, replay scrubber |
| [`@ghost-ui/testing`](packages/testing) | Test utilities — `createTestEngine`, `buildEvents`, `ghostMatchers`, `renderWithGhost` |

## Quick start

```bash
npm install @ghost-ui/react motion
```

```tsx
import { GhostProvider, Ghost, localStorageAdapter } from '@ghost-ui/react';

export function App() {
  return (
    <GhostProvider persistence={localStorageAdapter('my-app')}>
      <Ghost.Slot zone="nav">
        <Ghost.Button id="dashboard" zone="nav">Dashboard</Ghost.Button>
        <Ghost.Button id="settings"  zone="nav">Settings</Ghost.Button>
        <Ghost.Button id="billing"   zone="nav">Billing</Ghost.Button>
      </Ghost.Slot>
    </GhostProvider>
  );
}
```

Click the buttons. After a few sessions the most-used ones drift to the front automatically.

## Components

| Component | What it does |
|---|---|
| `Ghost.Slot` | Reorders children by click score within a zone |
| `Ghost.Button` | Tracked button with score glow + adaptive hit-box |
| `Ghost.Item` | Tracked div wrapper (for non-button elements) |
| `Ghost.Menu` | Dropdown menu — items reorder by click frequency |
| `Ghost.Tab` | Tab strip — most-used tabs drift left |
| `Ghost.Grid` | CSS Grid that promotes top-scored nodes to larger areas |
| `Ghost.Canvas` | Free-float canvas — highest-scored nodes cluster toward top-left |
| `Ghost.Combobox` | Autocomplete — most-picked options surface at the top |
| `GhostToastProvider` | Notification queue — alerts from engaged zones surface first |
| `GhostPrivacyPanel` | Drop-in opt-out toggle + clear-data button |

## Dev tools

```tsx
import { GhostDevtools } from '@ghost-ui/devtools';

// Add anywhere inside GhostProvider — toggle with Cmd+.
<GhostDevtools defaultOpen={false} />
```

## Privacy

```tsx
import { useGhostPrivacy } from '@ghost-ui/react';

function Settings() {
  const { optOut, setOptOut, clearData } = useGhostPrivacy();
  // optOut persists to localStorage across sessions
}
```

Or drop in `<GhostPrivacyPanel />` for a ready-made toggle + clear button.

## Worker optimizer

Move scoring off the main thread:

```ts
// Vite
import OptimizerWorker from '@ghost-ui/core/dist/worker.js?worker';
import { createWorkerOptimizer } from '@ghost-ui/react';

<GhostProvider optimizer={createWorkerOptimizer(new OptimizerWorker())}>
```

## Dev & demos

```bash
pnpm install
pnpm dev                            # all apps in parallel
pnpm --filter demo-saas dev         # Orbit — SaaS issue tracker
pnpm --filter demo-ecommerce dev    # Luxe — fashion e-commerce
pnpm --filter demo-studio dev       # Studio — content scheduler
pnpm --filter demo-finance dev      # Apex — finance dashboard
pnpm --filter @ghost-ui/site dev    # Landing page
```

Press `⌘ ⇧ G` to reset learned layout. Press `⌘ .` to open the devtools overlay.

## Release

```bash
pnpm changeset          # describe what changed
pnpm version            # bump versions + generate changelogs
pnpm release            # build all packages + publish to npm
```

## License

MIT
