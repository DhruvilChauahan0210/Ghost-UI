import { RingBuffer } from './ringBuffer.js';
import type { GhostEvent, GhostId, ZoneId, GhostEventType } from './types.js';

export interface ObserverOptions {
  capacity?: number;
  /** ms — clicks within this window after a click on a different element flag the previous click as 'regret' */
  regretWindowMs?: number;
  onEvent?: (e: GhostEvent) => void;
}

export class Observer {
  private buffer: RingBuffer<GhostEvent>;
  private regretWindowMs: number;
  private lastClick: { id: GhostId; ts: number } | null = null;
  private onEvent?: (e: GhostEvent) => void;

  constructor(opts: ObserverOptions = {}) {
    this.buffer = new RingBuffer<GhostEvent>(opts.capacity ?? 5000);
    this.regretWindowMs = opts.regretWindowMs ?? 3000;
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

    if (type === 'click') {
      if (
        this.lastClick &&
        this.lastClick.id !== id &&
        ts - this.lastClick.ts <= this.regretWindowMs
      ) {
        // mutate the most recent matching click in-place to flag regret
        const prevId = this.lastClick.id;
        const arr = this.buffer.toArray();
        for (let i = arr.length - 1; i >= 0; i--) {
          const ev = arr[i];
          if (ev && ev.type === 'click' && ev.id === prevId) {
            ev.regret = true;
            break;
          }
        }
      }
      this.lastClick = { id, ts };
    }

    this.buffer.push(event);
    this.onEvent?.(event);
  }

  events(): GhostEvent[] {
    return this.buffer.toArray();
  }

  ingest(events: GhostEvent[]): void {
    for (const e of events) this.buffer.push(e);
  }

  clear(): void {
    this.buffer.clear();
    this.lastClick = null;
  }
}
