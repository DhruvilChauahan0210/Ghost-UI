import { GhostEngine, memoryAdapter, type EngineOptions } from '@ghost-ui/core';
import type { GhostEvent, GhostEventType } from '@ghost-ui/core';

// ─── buildEvents ─────────────────────────────────────────────────────────────

export interface SimEntry {
  id: string;
  zone: string;
  /** Number of events to generate. Default 1. */
  count?: number;
  /** Event type. Default 'click'. */
  type?: GhostEventType;
  /**
   * Time window (ms) events are spread across, oldest-first with recency bias.
   * Default: 7 days.
   */
  spreadMs?: number;
}

export interface BuildEventsOptions {
  /** Reference point for timestamps. Default Date.now(). */
  now?: number;
  /** Default spreadMs for entries that don't specify one. Default 7 days. */
  spreadMs?: number;
}

/**
 * Build a sorted array of GhostEvents from a compact spec.
 *
 * @example
 * buildEvents([
 *   { id: 'save',   zone: 'toolbar', count: 30 },
 *   { id: 'cancel', zone: 'toolbar', count: 5  },
 * ])
 */
export function buildEvents(
  entries: SimEntry[],
  opts: BuildEventsOptions = {},
): GhostEvent[] {
  const now = opts.now ?? Date.now();
  const defaultSpread = opts.spreadMs ?? 7 * 24 * 60 * 60 * 1000;

  const events: GhostEvent[] = entries.flatMap(
    ({ id, zone, count = 1, type = 'click', spreadMs = defaultSpread }) =>
      Array.from({ length: count }, () => ({
        id,
        zone,
        type,
        // Recency bias: more events near "now"
        ts: now - Math.pow(Math.random(), 1.5) * spreadMs,
      })),
  );

  return events.sort((a, b) => a.ts - b.ts);
}

// ─── createTestEngine ────────────────────────────────────────────────────────

export interface TestEngine {
  /** The underlying GhostEngine instance. */
  engine: GhostEngine;
  /**
   * Inject synthetic events from a compact spec and wait for the engine to
   * finish recomputing. Equivalent to calling _injectEvents + settle().
   */
  simulate(entries: SimEntry[], simOpts?: BuildEventsOptions): Promise<void>;
  /**
   * Wait for any pending recompute to finish. Resolves after the engine emits
   * its next plan update, or after a safety timeout (default 500ms).
   */
  settle(timeoutMs?: number): Promise<void>;
  /**
   * Advance fake time by `ms` milliseconds.
   * Does NOT trigger a recompute — register nodes or inject events to do that.
   */
  advance(ms: number): void;
  /** Set fake time to an absolute timestamp. */
  setNow(ts: number): void;
  /** Current fake time. */
  readonly now: number;
}

export interface CreateTestEngineOptions extends Omit<EngineOptions, 'now'> {
  /** Initial fake timestamp. Default: Date.now(). */
  startTime?: number;
}

/**
 * Create a GhostEngine pre-configured for testing:
 * - Uses memoryAdapter (no localStorage side effects)
 * - Uses controllable fake time
 * - Automatically calls init()
 *
 * @example
 * const { engine, simulate, settle } = await createTestEngine()
 *
 * engine.registerNode({ id: 'save', zone: 'toolbar' })
 * engine.registerNode({ id: 'cancel', zone: 'toolbar' })
 *
 * await simulate([{ id: 'save', zone: 'toolbar', count: 10 }])
 *
 * expect(engine.getOrder('toolbar')[0]).toBe('save')
 */
export async function createTestEngine(
  opts: CreateTestEngineOptions = {},
): Promise<TestEngine> {
  let fakeNow = opts.startTime ?? Date.now();

  const engine = new GhostEngine({
    persistence: memoryAdapter(),
    recomputeDebounceMs: 0, // instant recompute in tests
    saveDebounceMs: 0,
    ...opts,
    now: () => fakeNow,
  });

  await engine.init();

  function settle(timeoutMs = 500): Promise<void> {
    return new Promise<void>((resolve) => {
      let resolved = false;
      const safety = setTimeout(() => {
        if (!resolved) { resolved = true; unsub(); resolve(); }
      }, timeoutMs);

      let first = true;
      const unsub = engine.subscribe(() => {
        if (first) { first = false; return; } // skip immediate fire
        if (!resolved) {
          resolved = true;
          clearTimeout(safety);
          unsub();
          // Flush microtask queue so component effects can run
          void Promise.resolve().then(resolve);
        }
      });
    });
  }

  async function simulate(
    entries: SimEntry[],
    simOpts?: BuildEventsOptions,
  ): Promise<void> {
    const events = buildEvents(entries, { now: fakeNow, ...simOpts });
    const settlePromise = settle();
    engine._injectEvents(events);
    await settlePromise;
  }

  return {
    engine,
    simulate,
    settle,
    advance(ms: number) { fakeNow += ms; },
    setNow(ts: number) { fakeNow = ts; },
    get now() { return fakeNow; },
  };
}

// ─── waitForRecompute ────────────────────────────────────────────────────────

/**
 * Wait for the engine to emit its next plan update.
 * Resolves after the plan changes, or after `timeoutMs` (default 500ms).
 *
 * Useful when you can't access a TestEngine — e.g. in component tests
 * where you interact via user events and want to wait for the optimizer.
 */
export function waitForRecompute(
  engine: GhostEngine,
  timeoutMs = 500,
): Promise<void> {
  return new Promise<void>((resolve) => {
    let resolved = false;
    const safety = setTimeout(() => {
      if (!resolved) { resolved = true; unsub(); resolve(); }
    }, timeoutMs);

    let first = true;
    const unsub = engine.subscribe(() => {
      if (first) { first = false; return; }
      if (!resolved) {
        resolved = true;
        clearTimeout(safety);
        unsub();
        void Promise.resolve().then(resolve);
      }
    });
  });
}
