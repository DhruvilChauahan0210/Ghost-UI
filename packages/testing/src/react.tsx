import type { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { GhostProvider, useGhostEngine } from '@ghost-ui/react';
import { memoryAdapter } from '@ghost-ui/core';
import type { GhostEngine, EngineOptions } from '@ghost-ui/core';
import { waitForRecompute } from './engine.js';

// ─── renderWithGhost ─────────────────────────────────────────────────────────

export interface RenderWithGhostOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Options forwarded to GhostEngine. Defaults: memoryAdapter, instant debounce. */
  engineOpts?: Omit<EngineOptions, 'persistence'>;
}

export interface GhostRenderResult extends RenderResult {
  /** The GhostEngine powering the rendered tree. Use to assert scores and order. */
  engine: GhostEngine;
  /**
   * Wait for the next plan recompute to complete.
   * Call after simulating user interactions to let the engine settle.
   */
  settle(timeoutMs?: number): Promise<void>;
}

/**
 * Render a component inside a GhostProvider configured for testing:
 * - Uses memoryAdapter (no localStorage side effects between tests)
 * - Instant recompute debounce (no 250ms waits)
 * - Exposes the engine for assertions
 *
 * Requires `@testing-library/react` as a peer dependency.
 *
 * @example
 * import { renderWithGhost, ghostMatchers } from '@ghost-ui/testing/react'
 * import { expect } from 'vitest'
 * expect.extend(ghostMatchers)
 *
 * const { engine, settle, getByRole } = renderWithGhost(<Toolbar />)
 *
 * await userEvent.click(getByRole('button', { name: 'Save' }))
 * await settle()
 *
 * expect(engine).toHaveTopNode('toolbar', 'save')
 */
export function renderWithGhost(
  ui: ReactElement,
  opts: RenderWithGhostOptions = {},
): GhostRenderResult {
  const { engineOpts, ...renderOpts } = opts;

  let capturedEngine: GhostEngine | null = null;

  // EngineCapture captures the engine from GhostProvider's context.
  // Defined inside renderWithGhost so it closes over capturedEngine.
  // React treats this as a new component type per call, which is intentional
  // for test isolation — no cross-test memoization.
  function EngineCapture({ children }: { children: ReactNode }) {
    capturedEngine = useGhostEngine();
    return <>{children}</>;
  }

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <GhostProvider
        persistence={memoryAdapter()}
        recomputeDebounceMs={0}
        saveDebounceMs={0}
        resetHotkey={false}
        {...engineOpts}
      >
        <EngineCapture>{children}</EngineCapture>
      </GhostProvider>
    );
  }

  const result = render(ui, { wrapper: Wrapper, ...renderOpts });

  if (!capturedEngine) {
    throw new Error(
      '[ghost-ui/testing] renderWithGhost: engine was not captured. ' +
        'Ensure the component tree rendered inside GhostProvider.',
    );
  }

  const engine = capturedEngine as GhostEngine;

  return {
    ...result,
    engine,
    settle: (timeoutMs = 500) => waitForRecompute(engine, timeoutMs),
  };
}

// Re-export everything from the main entry for convenience in test files
export { waitForRecompute, buildEvents, createTestEngine } from './engine.js';
export type { SimEntry, BuildEventsOptions, TestEngine, CreateTestEngineOptions } from './engine.js';
export { ghostMatchers } from './matchers.js';
