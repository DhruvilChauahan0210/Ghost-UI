/**
 * Web Worker entry point. Run the optimizer off the main thread.
 *
 * Usage in a host app (Vite/Next/etc.):
 *
 *   import { wrap } from 'comlink';
 *   import OptimizerWorker from '@ghost-ui/core/worker?worker';
 *   import type { OptimizerWorkerApi } from '@ghost-ui/core/worker';
 *
 *   const api = wrap<OptimizerWorkerApi>(new OptimizerWorker());
 *   const plan = await api.optimize({ nodes, events });
 */
import { expose } from 'comlink';
import { optimize, type OptimizeInput } from './optimizer.js';
import type { LayoutPlan } from './types.js';

const api = {
  optimize(input: OptimizeInput): LayoutPlan {
    return optimize(input);
  },
};

export type OptimizerWorkerApi = typeof api;

if (typeof self !== 'undefined' && typeof (self as unknown as { postMessage?: unknown }).postMessage === 'function') {
  expose(api);
}

export default api;
