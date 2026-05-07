# Ghost UI

Interfaces that learn. A self-optimizing UI engine: drop in `<Ghost.Button>`, `<Ghost.Slot>`, and your interface rearranges itself around each user's muscle memory.

> Status: **v0.1 scaffold** — JS optimizer, React 19 bindings, working playground demo. Rust/WASM optimizer (`@ghost-ui/core-wasm`) and the LLM adapter (`@ghost-ui/llm`) are next.

## Try it

```bash
pnpm install
pnpm playground                     # Vite playground · http://localhost:5173
pnpm --filter @ghost-ui/site dev    # Next.js landing  · http://localhost:3000
```

Click the buttons. Watch the layout reorder. Refresh — your layout persists.
Press <kbd>⌘ ⇧ G</kbd> to reset, <kbd>⌘ .</kbd> to open the in-page devtools overlay.

## Packages

| Package | Description |
| --- | --- |
| [`@ghost-ui/core`](packages/core) | Framework-agnostic engine — observer, optimizer, persistence, optional Web Worker. |
| [`@ghost-ui/react`](packages/react) | React 19 bindings — `<GhostProvider>`, `<Ghost.*>`, hooks. |
| [`@ghost-ui/devtools`](packages/devtools) | In-page reverse-heatmap overlay — see what the optimizer sees. |
| `@ghost-ui/core-wasm` | _(planned)_ Rust scoring kernel compiled to WASM. |
| `@ghost-ui/llm` | _(planned)_ Vercel AI SDK adapter for layout suggestions. |

## API

```tsx
import { GhostProvider, Ghost, localStorageAdapter } from '@ghost-ui/react';

<GhostProvider persistence={localStorageAdapter()}>
  <Ghost.Slot zone="hero.cta">
    <Ghost.Button id="signup" zone="hero.cta">Sign up</Ghost.Button>
    <Ghost.Button id="docs" zone="hero.cta">Docs</Ghost.Button>
    <Ghost.Button id="github" zone="hero.cta" pinned>GitHub</Ghost.Button>
  </Ghost.Slot>
</GhostProvider>
```

## License

MIT
