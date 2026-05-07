import { describe, expect, it } from 'vitest';
import { optimize } from './optimizer.js';
import type { GhostEvent, GhostNode } from './types.js';

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
