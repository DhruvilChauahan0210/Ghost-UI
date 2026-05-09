import {
  DEFAULT_WEIGHTS,
  type GhostEvent,
  type GhostId,
  type GhostNode,
  type GravityTier,
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
  /** How many top-scored nodes receive the 'primary' area tier. Default 1. */
  primaryCount?: number;
  /** How many nodes after primary receive the 'secondary' area tier. Default 2. */
  secondaryCount?: number;
  /**
   * Edge padding (0–0.5) used when computing canvas positions. Default 0.10.
   * Items are placed within [padding, 1-padding] on both axes so they don't
   * sit flush against the container edge.
   */
  canvasPadding?: number;
  /**
   * ms — hover→click window used for transition detection.
   * A click within this window after hovering a different node is counted as
   * an inbound transition for the clicked node.
   * Default: 2000 (matches Observer default)
   */
  intentWindowMs?: number;
}

interface PerNode {
  clicks: number;
  hoverCount: number;
  dwellMs: number;
  regrets: number;
  rages: number;
  lastTs: number;
  missDx: number[];
  missDy: number[];
  /** Times this node was clicked shortly after a hover on a *different* node. */
  transitionInCount: number;
}

const empty = (): PerNode => ({
  clicks: 0,
  hoverCount: 0,
  dwellMs: 0,
  regrets: 0,
  rages: 0,
  lastTs: 0,
  missDx: [],
  missDy: [],
  transitionInCount: 0,
});

export function optimize(input: OptimizeInput): LayoutPlan {
  const w: ScoringWeights = { ...DEFAULT_WEIGHTS, ...input.weights };
  const now = input.now ?? Date.now();
  const windowMs = input.windowMs ?? 7 * 24 * 60 * 60 * 1000;
  const halfLife = input.halfLifeMs ?? 24 * 60 * 60 * 1000;
  const intentWindowMs = input.intentWindowMs ?? 2000;

  const stats = new Map<GhostId, PerNode>();
  for (const n of input.nodes) stats.set(n.id, empty());

  // Track last hover within the intent window for transition detection.
  // Events arrive in chronological order from the RingBuffer.
  let lastHover: { id: GhostId; ts: number } | null = null;

  for (const e of input.events) {
    if (now - e.ts > windowMs) continue;
    const s = stats.get(e.id);
    if (!s) continue;
    if (e.ts > s.lastTs) s.lastTs = e.ts;
    switch (e.type) {
      case 'click': {
        s.clicks += 1;
        if (e.regret) s.regrets += 1;
        // Count as an inbound transition if preceded by a hover on a different
        // node within the intent window.
        if (
          lastHover !== null &&
          lastHover.id !== e.id &&
          e.ts - lastHover.ts <= intentWindowMs
        ) {
          s.transitionInCount += 1;
        }
        break;
      }
      case 'hover':
        s.hoverCount += 1;
        lastHover = { id: e.id, ts: e.ts };
        break;
      case 'dwell':
        s.dwellMs += e.ms ?? 0;
        break;
      case 'miss':
        if (typeof e.dx === 'number') s.missDx.push(e.dx);
        if (typeof e.dy === 'number') s.missDy.push(e.dy);
        break;
      case 'rage':
        s.rages += 1;
        break;
    }
  }

  const scored = new Map<GhostId, number>();
  let max = 0;
  let min = 0;
  for (const node of input.nodes) {
    const s = stats.get(node.id)!;
    const ageMs = s.lastTs ? Math.max(0, now - s.lastTs) : windowMs;
    const recency = Math.pow(0.5, ageMs / halfLife);
    const base =
      (node.weight ?? 0) +
      w.click * s.clicks +
      w.hover * s.hoverCount +
      w.dwell * s.dwellMs +
      w.regret * s.regrets +
      w.rage * s.rages +
      w.transition * s.transitionInCount;
    const score = base * (1 + w.recency * recency);
    scored.set(node.id, score);
    if (score > max) max = score;
    if (score < min) min = score;
  }

  const byZone = new Map<ZoneId, GhostNode[]>();
  for (const n of input.nodes) {
    const list = byZone.get(n.zone) ?? [];
    list.push(n);
    byZone.set(n.zone, list);
  }

  const order: Record<ZoneId, GhostId[]> = {};
  const isColdStart = max === 0; // all scores are 0 (no events)
  for (const [zone, nodes] of byZone) {
    const pinned = nodes.filter((n) => n.pinned);
    const free = nodes.filter((n) => !n.pinned);
    // only sort if not in cold-start; preserve registration order when all scores are 0
    if (!isColdStart) {
      free.sort((a, b) => (scored.get(b.id) ?? 0) - (scored.get(a.id) ?? 0));
    }
    // pinned nodes keep their original order at the front
    order[zone] = [...pinned.map((n) => n.id), ...free.map((n) => n.id)];
  }

  const emphasis: Record<GhostId, number> = {};
  const hitbox: LayoutPlan['hitbox'] = {};
  const range = max - min;
  for (const node of input.nodes) {
    const score = scored.get(node.id) ?? 0;
    emphasis[node.id] = node.pinned ? 0
      : range > 0
        ? clamp((score - min) / range, 0, 1)
        : 0;

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

  // Gravity Grid area tiers — cross-zone, sorted by raw score
  const primaryCount = input.primaryCount ?? 1;
  const secondaryCount = input.secondaryCount ?? 2;
  const area: Record<GhostId, GravityTier> = {};
  for (const n of input.nodes) {
    if (n.pinned) area[n.id] = 'primary';
  }
  const freeByScore = input.nodes
    .filter((n) => !n.pinned)
    .sort((a, b) => (scored.get(b.id) ?? 0) - (scored.get(a.id) ?? 0));
  for (let i = 0; i < freeByScore.length; i++) {
    const n = freeByScore[i]!;
    if (i < primaryCount) area[n.id] = 'primary';
    else if (i < primaryCount + secondaryCount) area[n.id] = 'secondary';
    else area[n.id] = 'tertiary';
  }

  // Canvas positions — grid layout where rank 0 = top-left ("primary visual zone")
  const pad = clamp(input.canvasPadding ?? 0.10, 0, 0.45);
  const position: Record<GhostId, { x: number; y: number }> = {};
  // Build an ordered list: pinned first (in registration order), then free by score
  const pinnedNodes = input.nodes.filter((n) => n.pinned);
  const orderedForCanvas = [...pinnedNodes, ...freeByScore];
  const total = orderedForCanvas.length;
  if (total > 0) {
    const cols = Math.max(1, Math.ceil(Math.sqrt(total)));
    const rows = Math.max(1, Math.ceil(total / cols));
    const xRange = 1 - 2 * pad;
    const yRange = 1 - 2 * pad;
    for (let i = 0; i < orderedForCanvas.length; i++) {
      const n = orderedForCanvas[i]!;
      const col = i % cols;
      const row = Math.floor(i / cols);
      position[n.id] = {
        x: pad + (cols > 1 ? (col / (cols - 1)) * xRange : xRange / 2 + pad),
        y: pad + (rows > 1 ? (row / (rows - 1)) * yRange : yRange / 2 + pad),
      };
    }
  }

  return { order, emphasis, hitbox, area, position, ts: now };
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

export interface ScoreBreakdown {
  nodeId: GhostId;
  baseWeight: number;
  clickScore: number;
  hoverScore: number;
  dwellScore: number;
  regretPenalty: number;
  ragePenalty: number;
  /** Score contribution from inbound hover→click transitions. */
  transitionScore: number;
  recencyMultiplier: number;
  totalScore: number;
  emphasis: number;
}

export function explainScore(
  nodeId: GhostId,
  node: GhostNode,
  events: GhostEvent[],
  weights: ScoringWeights,
  windowMs: number,
  halfLifeMs: number,
  now: number,
  intentWindowMs = 2000,
): ScoreBreakdown {
  const stats = {
    clicks: 0,
    hoverCount: 0,
    dwellMs: 0,
    regrets: 0,
    rages: 0,
    lastTs: 0,
    transitionInCount: 0,
  };

  // Single pass: track last hover globally to detect transitions into nodeId.
  let lastHover: { id: GhostId; ts: number } | null = null;

  for (const e of events) {
    if (now - e.ts > windowMs) continue;

    if (e.type === 'hover') {
      lastHover = { id: e.id, ts: e.ts };
    }

    if (e.id !== nodeId) continue;
    if (e.ts > stats.lastTs) stats.lastTs = e.ts;

    switch (e.type) {
      case 'click':
        stats.clicks += 1;
        if (e.regret) stats.regrets += 1;
        if (lastHover && lastHover.id !== nodeId && e.ts - lastHover.ts <= intentWindowMs) {
          stats.transitionInCount += 1;
        }
        break;
      case 'hover':
        stats.hoverCount += 1;
        break;
      case 'dwell':
        stats.dwellMs += e.ms ?? 0;
        break;
      case 'rage':
        stats.rages += 1;
        break;
    }
  }

  const baseWeight = node.weight ?? 0;
  const clickScore = weights.click * stats.clicks;
  const hoverScore = weights.hover * stats.hoverCount;
  const dwellScore = weights.dwell * stats.dwellMs;
  const regretPenalty = weights.regret * stats.regrets;
  const ragePenalty = weights.rage * stats.rages;
  const transitionScore = weights.transition * stats.transitionInCount;

  const ageMs = stats.lastTs ? Math.max(0, now - stats.lastTs) : windowMs;
  const recency = Math.pow(0.5, ageMs / halfLifeMs);
  const recencyMultiplier = 1 + weights.recency * recency;

  const base =
    baseWeight + clickScore + hoverScore + dwellScore +
    regretPenalty + ragePenalty + transitionScore;
  const totalScore = base * recencyMultiplier;

  const emphasis = node.pinned ? 0 : 0;

  return {
    nodeId,
    baseWeight,
    clickScore,
    hoverScore,
    dwellScore,
    regretPenalty,
    ragePenalty,
    transitionScore,
    recencyMultiplier,
    totalScore,
    emphasis,
  };
}
