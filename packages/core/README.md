# @ghost-ui/core

Framework-agnostic engine for [Ghost UI](../../README.md) — interfaces that learn.

- **Observer** — captures clicks, hovers, dwells, misses into a ring buffer.
- **Optimizer** — pure scoring + layout-plan function (perfect for tests/workers/WASM).
- **Engine** — glues observer + optimizer + persistence with debounced recompute.

Designed so the optimizer can be swapped for a Rust/WASM kernel in v0.2 without
touching the public API.
