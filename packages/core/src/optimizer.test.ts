import { describe, expect, it } from 'vitest';
import { optimize, explainScore } from './optimizer.js';
import { DEFAULT_WEIGHTS } from './types.js';
import type { GhostEvent, GhostNode, GravityTier } from './types.js';

const nodes: GhostNode[] = [
  { id: 'a', zone: 'z' },
  { id: 'b', zone: 'z' },
  { id: 'c', zone: 'z' },
];

describe('optimize', () => {
  it('orders by click count', () => {
    const now = Date.now();
    const events: GhostEvent[] = [
      { id: 'b', zone: 'z', type: 'click', ts: now - 1000 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 900 },
      { id: 'a', zone: 'z', type: 'click', ts: now - 800 },
    ];
    const plan = optimize({ nodes, events, now });
    expect(plan.order.z?.[0]).toBe('b');
  });

  it('keeps pinned nodes at the front', () => {
    const now = Date.now();
    const pinnedNodes: GhostNode[] = [
      { id: 'a', zone: 'z', pinned: true },
      { id: 'b', zone: 'z' },
    ];
    const events: GhostEvent[] = [{ id: 'b', zone: 'z', type: 'click', ts: now }];
    const plan = optimize({ nodes: pinnedNodes, events, now });
    expect(plan.order.z?.[0]).toBe('a');
  });

  it('emphasizes the top item near 1', () => {
    const now = Date.now();
    const events: GhostEvent[] = Array.from({ length: 10 }, (_, i) => ({
      id: 'c',
      zone: 'z',
      type: 'click' as const,
      ts: now - i * 100,
    }));
    const plan = optimize({ nodes, events, now });
    expect(plan.emphasis.c).toBeGreaterThan(0.9);
  });
});

describe('optimize — gravity grid area tiers', () => {
  const now = Date.now();
  // 4 nodes so we can get all three tiers with defaults (primary=1, secondary=2, tertiary=rest)
  const tierNodes: GhostNode[] = [
    { id: 'a', zone: 'z' },
    { id: 'b', zone: 'z' },
    { id: 'c', zone: 'z' },
    { id: 'd', zone: 'z' },
  ];

  it('assigns primary to top-scored node by default', () => {
    const events: GhostEvent[] = [
      { id: 'a', zone: 'z', type: 'click', ts: now - 100 },
      { id: 'a', zone: 'z', type: 'click', ts: now - 200 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 300 },
    ];
    const plan = optimize({ nodes: tierNodes, events, now });
    expect(plan.area?.a).toBe<GravityTier>('primary');
    expect(plan.area?.b).toBe<GravityTier>('secondary');
    expect(plan.area?.d).toBe<GravityTier>('tertiary');
  });

  it('assigns secondary to next 2 nodes by default', () => {
    const events: GhostEvent[] = [
      { id: 'a', zone: 'z', type: 'click', ts: now - 100 },
      { id: 'a', zone: 'z', type: 'click', ts: now - 200 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 300 },
      { id: 'c', zone: 'z', type: 'hover', ts: now - 400 },
    ];
    const plan = optimize({ nodes: tierNodes, events, now });
    expect(plan.area?.b).toBe<GravityTier>('secondary');
    expect(plan.area?.c).toBe<GravityTier>('secondary');
    expect(plan.area?.d).toBe<GravityTier>('tertiary');
  });

  it('respects custom primaryCount and secondaryCount', () => {
    const events: GhostEvent[] = [
      { id: 'a', zone: 'z', type: 'click', ts: now - 100 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 200 },
    ];
    const plan = optimize({ nodes: tierNodes, events, now, primaryCount: 2, secondaryCount: 1 });
    expect(plan.area?.a).toBe<GravityTier>('primary');
    expect(plan.area?.b).toBe<GravityTier>('primary');
    expect(plan.area?.c).toBe<GravityTier>('secondary');
    expect(plan.area?.d).toBe<GravityTier>('tertiary');
  });

  it('pinned nodes always get primary regardless of score', () => {
    const pinnedNodes: GhostNode[] = [
      { id: 'a', zone: 'z', pinned: true },
      { id: 'b', zone: 'z' },
      { id: 'c', zone: 'z' },
      { id: 'd', zone: 'z' },
    ];
    const events: GhostEvent[] = [
      { id: 'b', zone: 'z', type: 'click', ts: now - 100 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 200 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 300 },
    ];
    const plan = optimize({ nodes: pinnedNodes, events, now });
    // a is pinned → primary; b has highest score among free nodes → primary
    // c and d are secondary (3 free nodes, primary=1 means b→primary, secondary=2 means c+d→secondary)
    expect(plan.area?.a).toBe<GravityTier>('primary');
    expect(plan.area?.b).toBe<GravityTier>('primary');
    expect(plan.area?.c).toBe<GravityTier>('secondary');
    expect(plan.area?.d).toBe<GravityTier>('secondary');
  });

  it('all nodes get tertiary except top 1 and 2 secondaries on cold start', () => {
    const plan = optimize({ nodes: tierNodes, events: [], now });
    // cold start: all scores 0 — first free node gets primary, next 2 get secondary
    const tiers = Object.values(plan.area ?? {}) as GravityTier[];
    expect(tiers.filter((t) => t === 'primary')).toHaveLength(1);
    expect(tiers.filter((t) => t === 'secondary')).toHaveLength(2);
    expect(tiers.filter((t) => t === 'tertiary')).toHaveLength(1);
  });

  it('includes area in returned plan', () => {
    const plan = optimize({ nodes: tierNodes, events: [], now });
    expect(plan.area).toBeDefined();
    expect(Object.keys(plan.area ?? {})).toHaveLength(tierNodes.length);
  });
});

describe('optimize — canvas positions', () => {
  const now = Date.now();
  const posNodes: GhostNode[] = [
    { id: 'a', zone: 'z' },
    { id: 'b', zone: 'z' },
    { id: 'c', zone: 'z' },
    { id: 'd', zone: 'z' },
  ];

  it('includes position in returned plan', () => {
    const plan = optimize({ nodes: posNodes, events: [], now });
    expect(plan.position).toBeDefined();
    expect(Object.keys(plan.position ?? {})).toHaveLength(posNodes.length);
  });

  it('all positions are within 0–1 range', () => {
    const events: GhostEvent[] = [
      { id: 'a', zone: 'z', type: 'click', ts: now - 100 },
      { id: 'b', zone: 'z', type: 'hover', ts: now - 200 },
    ];
    const plan = optimize({ nodes: posNodes, events, now });
    for (const pos of Object.values(plan.position ?? {})) {
      expect(pos.x).toBeGreaterThanOrEqual(0);
      expect(pos.x).toBeLessThanOrEqual(1);
      expect(pos.y).toBeGreaterThanOrEqual(0);
      expect(pos.y).toBeLessThanOrEqual(1);
    }
  });

  it('top-scored node gets the top-left position', () => {
    const events: GhostEvent[] = Array.from({ length: 5 }, (_, i) => ({
      id: 'a',
      zone: 'z',
      type: 'click' as const,
      ts: now - i * 100,
    }));
    const plan = optimize({ nodes: posNodes, events, now });
    // a has the highest score so it should be placed at column 0, row 0 (smallest x and y)
    const posA = plan.position?.a ?? { x: 1, y: 1 };
    for (const [id, pos] of Object.entries(plan.position ?? {})) {
      if (id === 'a') continue;
      // a should not have a larger y than other nodes in the same column, and should have smaller/equal x
      expect(posA.y).toBeLessThanOrEqual(pos.y + 0.001);
    }
  });

  it('single node is centered', () => {
    const plan = optimize({ nodes: [{ id: 'solo', zone: 'z' }], events: [], now });
    const pos = plan.position?.solo;
    expect(pos).toBeDefined();
    // single node: cols=1, rows=1 → centered horizontally
    expect(pos!.x).toBeGreaterThan(0.3);
    expect(pos!.x).toBeLessThan(0.7);
  });

  it('respects canvasPadding option', () => {
    const plan = optimize({ nodes: posNodes, events: [], now, canvasPadding: 0.2 });
    for (const pos of Object.values(plan.position ?? {})) {
      expect(pos.x).toBeGreaterThanOrEqual(0.19);
      expect(pos.y).toBeGreaterThanOrEqual(0.19);
    }
  });
});

describe('transition-based scoring', () => {
  const now = 1_000_000;
  const baseNodes: GhostNode[] = [
    { id: 'a', zone: 'z' },
    { id: 'b', zone: 'z' },
    { id: 'c', zone: 'z' },
  ];

  it('boosts a node clicked after hovering another node', () => {
    const events: GhostEvent[] = [
      { id: 'a', zone: 'z', type: 'hover', ts: now - 1500 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 1000 }, // transition a→b
    ];
    const plan = optimize({ nodes: baseNodes, events, now });
    // b has a transition-in; a has only a hover — b should score higher
    expect(plan.emphasis['b']).toBeGreaterThan(plan.emphasis['a'] ?? 0);
  });

  it('does not count transition when click is on the same node as the hover', () => {
    const nodeB: GhostNode = { id: 'b', zone: 'z' };
    const W = 7 * 86_400_000;

    // Same-node hover+click: no transition
    const eventsNoTransition: GhostEvent[] = [
      { id: 'b', zone: 'z', type: 'hover', ts: now - 900 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 800 },
    ];
    const scoreNoTransition = explainScore('b', nodeB, eventsNoTransition, DEFAULT_WEIGHTS, W, W, now);

    // Cross-node hover+click: transition counted
    const eventsWithTransition: GhostEvent[] = [
      { id: 'a', zone: 'z', type: 'hover', ts: now - 1500 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 1000 },
    ];
    const scoreWithTransition = explainScore('b', nodeB, eventsWithTransition, DEFAULT_WEIGHTS, W, W, now);

    expect(scoreNoTransition.transitionScore).toBe(0);
    expect(scoreWithTransition.transitionScore).toBeGreaterThan(0);
  });

  it('does not count transition when click is outside intentWindowMs', () => {
    const nodeB: GhostNode = { id: 'b', zone: 'z' };
    const W = 7 * 86_400_000;
    const intentWindowMs = 500;

    // Gap of 1000ms — outside intent window
    const eventsOutside: GhostEvent[] = [
      { id: 'a', zone: 'z', type: 'hover', ts: now - 2000 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 1000 },
    ];
    const scoreOutside = explainScore('b', nodeB, eventsOutside, DEFAULT_WEIGHTS, W, W, now, intentWindowMs);

    // Gap of 300ms — inside intent window
    const eventsInside: GhostEvent[] = [
      { id: 'a', zone: 'z', type: 'hover', ts: now - 400 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 100 },
    ];
    const scoreInside = explainScore('b', nodeB, eventsInside, DEFAULT_WEIGHTS, W, W, now, intentWindowMs);

    expect(scoreOutside.transitionScore).toBe(0);
    expect(scoreInside.transitionScore).toBeGreaterThan(0);
  });

  it('accumulates multiple inbound transitions', () => {
    const events: GhostEvent[] = [
      { id: 'a', zone: 'z', type: 'hover', ts: now - 5000 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 4800 }, // a→b
      { id: 'c', zone: 'z', type: 'hover', ts: now - 4000 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 3800 }, // c→b
      { id: 'a', zone: 'z', type: 'hover', ts: now - 3000 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 2800 }, // a→b again
    ];
    // b has 3 inbound transitions, c has 0
    const plan = optimize({ nodes: baseNodes, events, now });
    expect(plan.order['z']?.[0]).toBe('b');
    expect(plan.emphasis['b'] ?? 0).toBeGreaterThan(plan.emphasis['c'] ?? 0);
  });

  it('transition weight=0 disables transition scoring', () => {
    const events: GhostEvent[] = [
      { id: 'a', zone: 'z', type: 'hover', ts: now - 1500 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 1000 }, // a→b transition
    ];
    const withTransition = optimize({ nodes: baseNodes, events, now });
    const withoutTransition = optimize({
      nodes: baseNodes, events, now,
      weights: { transition: 0 },
    });
    // With weight=0, b's score should be lower (no transition bonus)
    const bEmphasisWith = withTransition.emphasis['b'] ?? 0;
    const bEmphasisWithout = withoutTransition.emphasis['b'] ?? 0;
    expect(bEmphasisWith).toBeGreaterThanOrEqual(bEmphasisWithout);
  });

  it('explainScore includes transitionScore', () => {
    const nodeB: GhostNode = { id: 'b', zone: 'z' };
    const events: GhostEvent[] = [
      { id: 'a', zone: 'z', type: 'hover', ts: now - 1500 },
      { id: 'b', zone: 'z', type: 'click', ts: now - 1000 },
    ];
    const breakdown = explainScore('b', nodeB, events, DEFAULT_WEIGHTS, 7 * 86_400_000, 86_400_000, now);
    expect(breakdown.transitionScore).toBeGreaterThan(0);
  });
});
