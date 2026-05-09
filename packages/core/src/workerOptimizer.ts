import { wrap } from 'comlink';
import type { OptimizerWorkerApi } from './worker.js';
import type { OptimizerFn } from './engine.js';

/**
 * Wraps a Web Worker running `@ghost-ui/core/worker` in a Comlink proxy
 * and returns an OptimizerFn compatible with GhostEngine's `optimizer` option.
 *
 * Usage (Vite):
 *   import OptimizerWorker from '@ghost-ui/core/worker?worker';
 *   import { createWorkerOptimizer } from '@ghost-ui/core';
 *
 *   const optimizer = createWorkerOptimizer(new OptimizerWorker());
 *   // Then pass to GhostProvider:
 *   <GhostProvider optimizer={optimizer} />
 *
 * Usage (generic bundler):
 *   const worker = new Worker(new URL('@ghost-ui/core/dist/worker.js', import.meta.url));
 *   const optimizer = createWorkerOptimizer(worker);
 */
export function createWorkerOptimizer(worker: Worker): OptimizerFn {
  const api = wrap<OptimizerWorkerApi>(worker);
  return (input) => api.optimize(input);
}
