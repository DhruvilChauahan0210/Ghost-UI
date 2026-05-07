import { Observer, type ObserverOptions } from './observer.js';
import { optimize, type OptimizeInput } from './optimizer.js';
import { memoryAdapter, type PersistenceAdapter } from './persistence.js';
import type { GhostEvent, GhostId, GhostNode, LayoutPlan, ZoneId } from './types.js';

/** Pluggable optimizer — pure function or worker-proxied async. */
export type OptimizerFn = (input: OptimizeInput) => LayoutPlan | Promise<LayoutPlan>;

export interface EngineOptions {
  persistence?: PersistenceAdapter;
  observer?: ObserverOptions;
  /** ms between auto re-optimize after an event. Default 250ms. */
  recomputeDebounceMs?: number;
  /** ms between auto-saves. Default 1000ms. */
  saveDebounceMs?: number;
  scoring?: Pick<OptimizeInput, 'weights' | 'windowMs' | 'halfLifeMs'>;
  /** Override the optimizer — pass a Comlink-wrapped worker for off-main-thread scoring. */
  optimizer?: OptimizerFn;
}

export type LayoutListener = (plan: LayoutPlan) => void;

export class GhostEngine {
  private observer: Observer;
  private nodes = new Map<GhostId, GhostNode>();
  private persistence: PersistenceAdapter;
  private listeners = new Set<LayoutListener>();
  private plan: LayoutPlan = { order: {}, emphasis: {}, hitbox: {}, ts: 0 };
  private recomputeTimer: ReturnType<typeof setTimeout> | null = null;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private recomputeDebounceMs: number;
  private saveDebounceMs: number;
  private scoring: EngineOptions['scoring'];
  private optimizerFn: OptimizerFn;
  private inflight = false;
  private dirty = false;

  constructor(opts: EngineOptions = {}) {
    this.persistence = opts.persistence ?? memoryAdapter();
    this.recomputeDebounceMs = opts.recomputeDebounceMs ?? 250;
    this.saveDebounceMs = opts.saveDebounceMs ?? 1000;
    this.scoring = opts.scoring;
    this.optimizerFn = opts.optimizer ?? optimize;
    this.observer = new Observer({
      ...opts.observer,
      onEvent: () => this.scheduleRecompute(),
    });
  }

  async init(): Promise<void> {
    const stored = await this.persistence.load();
    if (stored.length > 0) {
      this.observer.ingest(stored);
      this.recompute();
    }
  }

  registerNode(node: GhostNode): void {
    this.nodes.set(node.id, node);
    this.scheduleRecompute();
  }

  unregisterNode(id: GhostId): void {
    this.nodes.delete(id);
    this.scheduleRecompute();
  }

  record: Observer['record'] = (...args) => {
    this.observer.record(...args);
    this.scheduleSave();
  };

  getPlan(): LayoutPlan {
    return this.plan;
  }

  events(): GhostEvent[] {
    return this.observer.events();
  }

  getOrder(zone: ZoneId): GhostId[] {
    return this.plan.order[zone] ?? [];
  }

  subscribe(fn: LayoutListener): () => void {
    this.listeners.add(fn);
    fn(this.plan);
    return () => this.listeners.delete(fn);
  }

  async reset(): Promise<void> {
    this.observer.clear();
    await this.persistence.clear();
    this.recompute();
  }

  private scheduleRecompute(): void {
    if (this.recomputeTimer) clearTimeout(this.recomputeTimer);
    this.recomputeTimer = setTimeout(() => this.recompute(), this.recomputeDebounceMs);
  }

  private scheduleSave(): void {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      void this.persistence.save(this.observer.events());
    }, this.saveDebounceMs);
  }

  private recompute(): void {
    if (this.inflight) {
      this.dirty = true;
      return;
    }
    const nodes = Array.from(this.nodes.values());
    if (nodes.length === 0) {
      this.plan = { order: {}, emphasis: {}, hitbox: {}, ts: Date.now() };
      for (const fn of this.listeners) fn(this.plan);
      return;
    }
    this.inflight = true;
    const result = this.optimizerFn({
      nodes,
      events: this.observer.events(),
      ...(this.scoring ?? {}),
    });
    Promise.resolve(result)
      .then((plan) => {
        this.plan = plan;
        for (const fn of this.listeners) fn(this.plan);
      })
      .catch((err) => {
        // optimizer failure should never bring down the host app
        console.error('[ghost-ui] optimizer error:', err);
      })
      .finally(() => {
        this.inflight = false;
        if (this.dirty) {
          this.dirty = false;
          this.recompute();
        }
      });
  }

  /** test/debug only */
  _injectEvents(events: GhostEvent[]): void {
    this.observer.ingest(events);
    this.recompute();
  }
}
