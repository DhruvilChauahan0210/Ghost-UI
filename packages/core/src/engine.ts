import { Observer, type ObserverOptions } from './observer.js';
import { optimize, explainScore, type OptimizeInput, type ScoreBreakdown } from './optimizer.js';
import { memoryAdapter, type PersistenceAdapter } from './persistence.js';
import type { GhostEvent, GhostId, GhostNode, LayoutPlan, ZoneId } from './types.js';
import { DEFAULT_WEIGHTS } from './types.js';

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
  /** CSS Grid area tier boundaries for GhostGrid. */
  gridTiers?: Pick<OptimizeInput, 'primaryCount' | 'secondaryCount'>;
  /** Canvas edge padding for GhostCanvas position computation. Default 0.10. */
  canvasPadding?: number;
  /** Override the optimizer — pass a Comlink-wrapped worker for off-main-thread scoring. */
  optimizer?: OptimizerFn;
  /** Time provider for testing. Default Date.now. */
  now?: () => number;
}

export type LayoutListener = (plan: LayoutPlan) => void;

export class GhostEngine {
  private observer: Observer;
  private nodes = new Map<GhostId, GhostNode>();
  private persistence: PersistenceAdapter;
  private listeners = new Set<LayoutListener>();
  private plan: LayoutPlan = { order: {}, emphasis: {}, hitbox: {}, area: {}, position: {}, ts: 0 };
  private recomputeTimer: ReturnType<typeof setTimeout> | null = null;
  private saveTimer: ReturnType<typeof setTimeout> | null = null;
  private recomputeDebounceMs: number;
  private saveDebounceMs: number;
  private scoring: EngineOptions['scoring'];
  private gridTiers: EngineOptions['gridTiers'];
  private canvasPadding: number | undefined;
  private optimizerFn: OptimizerFn;
  private inflight = false;
  private dirty = false;
  private now: () => number;
  private cachedEvents: GhostEvent[] | null = null;
  private planPrev: LayoutPlan = { order: {}, emphasis: {}, hitbox: {}, area: {}, position: {}, ts: 0 };
  private emphasisHistory = new Map<GhostId, number[]>();

  constructor(opts: EngineOptions = {}) {
    this.persistence = opts.persistence ?? memoryAdapter();
    this.recomputeDebounceMs = opts.recomputeDebounceMs ?? 250;
    this.saveDebounceMs = opts.saveDebounceMs ?? 1000;
    this.scoring = opts.scoring;
    this.gridTiers = opts.gridTiers;
    this.canvasPadding = opts.canvasPadding;
    this.optimizerFn = opts.optimizer ?? optimize;
    this.now = opts.now ?? (() => Date.now());
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
    this.cachedEvents = null;
    this.observer.record(...args);
    this.scheduleSave();
  };

  getPlan(): LayoutPlan {
    return this.plan;
  }

  events(): GhostEvent[] {
    return this.observer.events();
  }

  explainScore(nodeId: GhostId): ScoreBreakdown | null {
    const node = this.nodes.get(nodeId);
    if (!node) return null;
    const w = { ...DEFAULT_WEIGHTS, ...this.scoring?.weights };
    const windowMs = this.scoring?.windowMs ?? 7 * 24 * 60 * 60 * 1000;
    const halfLife = this.scoring?.halfLifeMs ?? 24 * 60 * 60 * 1000;
    const events = this.cachedEvents ?? (this.cachedEvents = this.observer.events());
    return explainScore(nodeId, node, events, w, windowMs, halfLife, this.now());
  }

  getOrder(zone: ZoneId): GhostId[] {
    return this.plan.order[zone] ?? [];
  }

  /** Returns ids of nodes that have rage events within the given window (default 60s). */
  getFrustratedNodes(windowMs = 60_000): GhostId[] {
    const now = this.now();
    const cutoff = now - windowMs;
    const seen = new Set<GhostId>();
    const events = this.cachedEvents ?? (this.cachedEvents = this.observer.events());
    for (const e of events) {
      if (e.type === 'rage' && e.ts >= cutoff) seen.add(e.id);
    }
    return Array.from(seen);
  }

  /**
   * Returns the top predicted next-click targets given the currently hovered node,
   * based on historical hover→click transitions. Probabilities sum to 1.0.
   * Returns [] if no transition history exists for this node.
   */
  predictNext(hoveredId: GhostId): { id: GhostId; probability: number }[] {
    const targets = this.observer.getTransitions().get(hoveredId);
    if (!targets || targets.size === 0) return [];
    const total = Array.from(targets.values()).reduce((s, n) => s + n, 0);
    return Array.from(targets.entries())
      .map(([id, count]) => ({ id, probability: count / total }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5);
  }

  /** Signed emphasis delta since the previous plan commit. Positive = rising, negative = falling. */
  getVelocity(id: GhostId): number {
    return (this.plan.emphasis[id] ?? 0) - (this.planPrev.emphasis[id] ?? 0);
  }

  /** Last up-to-10 emphasis values for a node (oldest first). Empty until first commit. */
  getEmphasisHistory(id: GhostId): number[] {
    return this.emphasisHistory.get(id) ?? [];
  }

  /**
   * Replay the optimizer against the first `eventIndex` events without committing.
   * Returns a LayoutPlan you can render in a devtools scrubber.
   */
  async replayAt(eventIndex: number): Promise<LayoutPlan> {
    const nodes = Array.from(this.nodes.values());
    const allEvents = this.observer.events();
    const sliced = allEvents.slice(0, Math.max(0, Math.min(eventIndex, allEvents.length)));
    return Promise.resolve(
      this.optimizerFn({ nodes, events: sliced, now: this.now(), ...(this.scoring ?? {}) }),
    );
  }

  subscribe(fn: LayoutListener): () => void {
    this.listeners.add(fn);
    fn(this.plan);
    return () => this.listeners.delete(fn);
  }

  async reset(): Promise<void> {
    this.cachedEvents = null;
    this.observer.clear();
    await this.persistence.clear();
    this.recompute();
  }

  destroy(): void {
    if (this.recomputeTimer) clearTimeout(this.recomputeTimer);
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.listeners.clear();
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
      // Only commit empty if there's no existing plan — nodes may be
      // transiently unregistered (React Strict Mode cleanup/remount).
      if (Object.keys(this.plan.order).length === 0) {
        this.commit({ order: {}, emphasis: {}, hitbox: {}, area: {}, position: {}, ts: this.now() });
      }
      return;
    }
    this.inflight = true;
    const now = this.now();
    const events = this.cachedEvents ?? (this.cachedEvents = this.observer.events());
    const result = this.optimizerFn({
      nodes,
      events,
      now,
      ...(this.scoring ?? {}),
      ...(this.gridTiers ?? {}),
      ...(this.canvasPadding !== undefined ? { canvasPadding: this.canvasPadding } : {}),
    });
    Promise.resolve(result)
      .then((plan) => this.commit(plan))
      .catch((err: unknown) => {
        console.error('[ghost-ui] optimizer error:', err);
      })
      .finally(() => {
        const windowMs = this.scoring?.windowMs ?? 7 * 24 * 60 * 60 * 1000;
        this.observer.evictExpired(windowMs, now);
        this.cachedEvents = null;
        this.inflight = false;
        if (this.dirty) {
          this.dirty = false;
          this.recompute();
        }
      });
  }

  private commit(next: LayoutPlan): void {
    if (!planChanged(this.plan, next)) return;
    this.planPrev = this.plan;
    this.plan = next;
    for (const id of Object.keys(next.emphasis)) {
      const hist = this.emphasisHistory.get(id) ?? [];
      hist.push(next.emphasis[id] ?? 0);
      if (hist.length > 10) hist.shift();
      this.emphasisHistory.set(id, hist);
    }
    for (const fn of this.listeners) fn(this.plan);
  }

  /** test/debug only */
  _injectEvents(events: GhostEvent[]): void {
    this.cachedEvents = null;
    this.observer.ingest(events);
    this.recompute();
  }
}

function planChanged(a: LayoutPlan, b: LayoutPlan): boolean {
  const aZones = Object.keys(a.order);
  const bZones = Object.keys(b.order);
  if (aZones.length !== bZones.length) return true;
  for (const z of bZones) {
    const aOrder = a.order[z];
    const bOrder = b.order[z];
    if (!aOrder || !bOrder || aOrder.length !== bOrder.length) return true;
    for (let i = 0; i < bOrder.length; i++) {
      if (aOrder[i] !== bOrder[i]) return true;
    }
  }
  const aIds = Object.keys(a.emphasis);
  const bIds = Object.keys(b.emphasis);
  if (aIds.length !== bIds.length) return true;
  for (const id of bIds) {
    const av = a.emphasis[id] ?? 0;
    const bv = b.emphasis[id] ?? 0;
    if (Math.abs(av - bv) > 0.005) return true;
  }
  const aHitIds = Object.keys(a.hitbox);
  const bHitIds = Object.keys(b.hitbox);
  if (aHitIds.length !== bHitIds.length) return true;
  for (const id of bHitIds) {
    const ah = a.hitbox[id];
    const bh = b.hitbox[id];
    if (!ah || !bh) return true;
    if (ah.top !== bh.top || ah.bottom !== bh.bottom ||
        ah.left !== bh.left || ah.right !== bh.right) return true;
  }
  const aArea = a.area ?? {};
  const bArea = b.area ?? {};
  const aAreaIds = Object.keys(aArea);
  const bAreaIds = Object.keys(bArea);
  if (aAreaIds.length !== bAreaIds.length) return true;
  for (const id of bAreaIds) {
    if (aArea[id] !== bArea[id]) return true;
  }
  const aPos = a.position ?? {};
  const bPos = b.position ?? {};
  const aPosIds = Object.keys(aPos);
  const bPosIds = Object.keys(bPos);
  if (aPosIds.length !== bPosIds.length) return true;
  for (const id of bPosIds) {
    const ap = aPos[id];
    const bp = bPos[id];
    if (!ap || !bp) return true;
    if (Math.abs(ap.x - bp.x) > 0.001 || Math.abs(ap.y - bp.y) > 0.001) return true;
  }
  return false;
}
