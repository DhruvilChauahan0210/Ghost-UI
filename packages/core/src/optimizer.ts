import {
  DEFAULT_WEIGHTS,
  type GhostEvent,
  type GhostId,
  type GhostNode,
  type LayoutPlan,
  type ScoringWeights,
  type ZoneId,
} from './types.js';

export interface OptimizeInput {
  nodes: GhostNode[];
  events: GhostEvent[];
  weights?: Partial<ScoringWeights>;
  /** ms — events older than this are ignored */
  windowMs?: number;
  /** ms — half-life for recency weighting */
  halfLifeMs?: number;
  now?: number;
}

interface PerNode {
  clicks: number;
  hoverCount: number;
  dwellMs: number;
  regrets: number;
  lastTs: number;
  missDx: number[];
  missDy: number[];
}

const empty = (): PerNode => ({
  clicks: 0,
  hoverCount: 0,
  dwellMs: 0,
  regrets: 0,
  lastTs: 0,
  missDx: [],
  missDy: [],
});

export function optimize(input: OptimizeInput): LayoutPlan {
  const w: ScoringWeights = { ...DEFAULT_WEIGHTS, ...input.weights };
  const now = input.now ?? Date.now();
  const windowMs = input.windowMs ?? 7 * 24 * 60 * 60 * 1000;
  const halfLife = input.halfLifeMs ?? 24 * 60 * 60 * 1000;

  const stats = new Map<GhostId, PerNode>();
  for (const n of input.nodes) stats.set(n.id, empty());

  for (const e of input.events) {
    if (now - e.ts > windowMs) continue;
    const s = stats.get(e.id);
    if (!s) continue;
    if (e.ts > s.lastTs) s.lastTs = e.ts;
    switch (e.type) {
      case 'click':
        s.clicks += 1;
        if (e.regret) s.regrets += 1;
        break;
      case 'hover':
        s.hoverCount += 1;
        break;
      case 'dwell':
        s.dwellMs += e.ms ?? 0;
        break;
      case 'miss':
        if (typeof e.dx === 'number') s.missDx.push(e.dx);
        if (typeof e.dy === 'number') s.missDy.push(e.dy);
        break;
    }
  }

  const scored = new Map<GhostId, number>();
  let max = 0;
  for (const node of input.nodes) {
    const s = stats.get(node.id)!;
    const ageMs = s.lastTs ? Math.max(0, now - s.lastTs) : windowMs;
    const recency = Math.pow(0.5, ageMs / halfLife);
    const base =
      (node.weight ?? 0) +
      w.click * s.clicks +
      w.hover * s.hoverCount +
      w.dwell * s.dwellMs +
      w.regret * s.regrets;
    const score = base * (1 + w.recency * recency);
    scored.set(node.id, score);
    if (score > max) max = score;
  }

  const byZone = new Map<ZoneId, GhostNode[]>();
  for (const n of input.nodes) {
    const list = byZone.get(n.zone) ?? [];
    list.push(n);
    byZone.set(n.zone, list);
  }

  const order: Record<ZoneId, GhostId[]> = {};
  for (const [zone, nodes] of byZone) {
    const pinned = nodes.filter((n) => n.pinned);
    const free = nodes.filter((n) => !n.pinned);
    free.sort((a, b) => (scored.get(b.id) ?? 0) - (scored.get(a.id) ?? 0));
    // pinned nodes keep their original order at the front
    order[zone] = [...pinned.map((n) => n.id), ...free.map((n) => n.id)];
  }

  const emphasis: Record<GhostId, number> = {};
  const hitbox: LayoutPlan['hitbox'] = {};
  for (const node of input.nodes) {
    const score = scored.get(node.id) ?? 0;
    emphasis[node.id] = node.pinned ? 0 : max > 0 ? clamp(score / max, 0, 1) : 0;

    const s = stats.get(node.id)!;
    const dx = median(s.missDx);
    const dy = median(s.missDy);
    const grow = Math.min(12, Math.max(0, s.missDx.length + s.missDy.length) * 1.2);
    hitbox[node.id] = {
      top: dy < 0 ? grow : 0,
      bottom: dy > 0 ? grow : 0,
      left: dx < 0 ? grow : 0,
      right: dx > 0 ? grow : 0,
    };
  }

  return { order, emphasis, hitbox, ts: now };
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const sorted = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
  return sorted[mid] ?? 0;
}
