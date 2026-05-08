import { RingBuffer } from './ringBuffer.js';
import type { GhostEvent, GhostId, ZoneId, GhostEventType } from './types.js';

export interface ObserverOptions {
  capacity?: number;
  /** ms — clicks within this window after a click on a different element flag the previous click as 'regret' */
  regretWindowMs?: number;
  /** ms window for counting rapid same-element clicks. Default 500ms. */
  rageWindowMs?: number;
  /** number of rapid same-element clicks to trigger a rage event. Default 3. */
  rageThreshold?: number;
  /** ms window for hover→click transition to be recorded as intent. Default 2000ms. */
  intentWindowMs?: number;
  onEvent?: (e: GhostEvent) => void;
}

export class Observer {
  private buffer: RingBuffer<GhostEvent>;
  private regretWindowMs: number;
  private rageWindowMs: number;
  private rageThreshold: number;
  private intentWindowMs: number;
  private lastClick: { id: GhostId; ts: number; event: GhostEvent } | null = null;
  private clickStreak: { id: GhostId; ts: number; count: number } | null = null;
  private lastHover: { id: GhostId; ts: number } | null = null;
  private transitions = new Map<GhostId, Map<GhostId, number>>();
  private onEvent?: (e: GhostEvent) => void;

  constructor(opts: ObserverOptions = {}) {
    this.buffer = new RingBuffer<GhostEvent>(opts.capacity ?? 5000);
    this.regretWindowMs  = opts.regretWindowMs  ?? 3000;
    this.rageWindowMs    = opts.rageWindowMs    ?? 500;
    this.rageThreshold   = opts.rageThreshold   ?? 3;
    this.intentWindowMs  = opts.intentWindowMs  ?? 2000;
    this.onEvent = opts.onEvent;
  }

  record(
    type: GhostEventType,
    id: GhostId,
    zone: ZoneId,
    extra: Partial<Pick<GhostEvent, 'ms' | 'dx' | 'dy'>> = {},
  ): void {
    const ts = Date.now();
    const event: GhostEvent = { id, zone, type, ts, ...extra };

    if (type === 'hover') {
      this.lastHover = { id, ts };
    }

    if (type === 'click') {
      // regret: different element clicked within window
      if (this.lastClick && this.lastClick.id !== id && ts - this.lastClick.ts <= this.regretWindowMs) {
        this.lastClick.event.regret = true;
      }
      this.lastClick = { id, ts, event };

      // rage: same element clicked repeatedly within window
      if (this.clickStreak && this.clickStreak.id === id && ts - this.clickStreak.ts <= this.rageWindowMs) {
        this.clickStreak.count++;
        if (this.clickStreak.count >= this.rageThreshold) {
          const rageEvent: GhostEvent = { id, zone, type: 'rage', ts };
          this.buffer.push(rageEvent);
          this.onEvent?.(rageEvent);
          this.clickStreak = null;
        }
      } else {
        this.clickStreak = { id, ts, count: 1 };
      }

      // intent: hover A → click B transition within window
      if (this.lastHover && this.lastHover.id !== id && ts - this.lastHover.ts <= this.intentWindowMs) {
        this.recordTransition(this.lastHover.id, id);
      }
    }

    this.buffer.push(event);
    this.onEvent?.(event);
  }

  events(): GhostEvent[] {
    return this.buffer.toArray();
  }

  ingest(events: GhostEvent[]): void {
    for (const e of events) this.buffer.push(e);
    this.recomputeTransitions();
  }

  clear(): void {
    this.buffer.clear();
    this.lastClick    = null;
    this.clickStreak  = null;
    this.lastHover    = null;
    this.transitions.clear();
  }

  evictExpired(windowMs: number, now: number): void {
    const cutoff = now - windowMs;
    const kept: GhostEvent[] = [];
    for (const e of this.buffer.items()) {
      if (e.ts > cutoff) kept.push(e);
    }
    this.buffer.clear();
    for (const e of kept) this.buffer.push(e);
    if (this.lastClick && this.lastClick.ts <= cutoff) this.lastClick = null;
    if (this.lastHover && this.lastHover.ts <= cutoff) this.lastHover = null;
    this.recomputeTransitions();
  }

  getTransitions(): Map<GhostId, Map<GhostId, number>> {
    return this.transitions;
  }

  recomputeTransitions(): void {
    this.transitions.clear();
    let lastHoverEv: { id: GhostId; ts: number } | null = null;
    for (const e of this.buffer.items()) {
      if (e.type === 'hover') {
        lastHoverEv = { id: e.id, ts: e.ts };
      } else if (
        e.type === 'click' &&
        lastHoverEv &&
        lastHoverEv.id !== e.id &&
        e.ts - lastHoverEv.ts <= this.intentWindowMs
      ) {
        this.recordTransition(lastHoverEv.id, e.id);
      }
    }
  }

  private recordTransition(from: GhostId, to: GhostId): void {
    const targets = this.transitions.get(from) ?? new Map<GhostId, number>();
    targets.set(to, (targets.get(to) ?? 0) + 1);
    this.transitions.set(from, targets);
  }
}
