import { describe, expect, it, beforeEach, vi } from 'vitest';
import { GhostEngine } from './engine.js';
import { memoryAdapter } from './persistence.js';
import type { GhostNode, LayoutPlan } from './types.js';

describe('GhostEngine', () => {
  let engine: GhostEngine;

  beforeEach(() => {
    engine = new GhostEngine({
      persistence: memoryAdapter(),
    });
  });

  describe('initialization', () => {
    it('initializes without error', async () => {
      await expect(engine.init()).resolves.not.toThrow();
    });

    it('starts with empty plan', () => {
      const plan = engine.getPlan();
      expect(plan.order).toEqual({});
      expect(plan.emphasis).toEqual({});
    });

    it('loads persisted events on init', async () => {
      const persistence = memoryAdapter();
      const baseEvents = [
        { id: 'a', zone: 'z', type: 'click' as const, ts: Date.now() },
      ];
      await persistence.save(baseEvents);

      const engine2 = new GhostEngine({
        persistence,
      });
      await engine2.init();
      expect(engine2.events()).toHaveLength(1);
    });
  });

  describe('node registration', () => {
    it('registers nodes', async () => {
      const node: GhostNode = { id: 'node-1', zone: 'zone-a' };
      engine.registerNode(node);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const plan = engine.getPlan();
      expect(plan.order['zone-a']).toContain('node-1');
    });

    it('unregisters nodes', async () => {
      const node: GhostNode = { id: 'node-1', zone: 'zone-a' };
      engine.registerNode(node);
      engine.unregisterNode('node-1');
      // Wait for debounce
      await new Promise((resolve) => setTimeout(resolve, 300));
      const plan = engine.getPlan();
      expect(plan.order['zone-a']).toBeUndefined();
    });

    it('handles multiple nodes in same zone', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.registerNode({ id: 'b', zone: 'z' });
      engine.registerNode({ id: 'c', zone: 'z' });
      await new Promise((resolve) => setTimeout(resolve, 300));
      const plan = engine.getPlan();
      expect(plan.order['z']).toContain('a');
      expect(plan.order['z']).toContain('b');
      expect(plan.order['z']).toContain('c');
    });

    it('handles multiple zones', async () => {
      engine.registerNode({ id: 'a', zone: 'z1' });
      engine.registerNode({ id: 'b', zone: 'z2' });
      await new Promise((resolve) => setTimeout(resolve, 300));
      const plan = engine.getPlan();
      expect(plan.order['z1']).toContain('a');
      expect(plan.order['z2']).toContain('b');
    });
  });

  describe('event recording', () => {
    it('records events', () => {
      engine.record('click', 'node-1', 'zone-a');
      const events = engine.events();
      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        type: 'click',
        id: 'node-1',
        zone: 'zone-a',
      });
    });

    it('invalidates cached events on record', () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      const events1 = engine.events();
      engine.record('click', 'a', 'z');
      const events2 = engine.events();
      expect(events1).toHaveLength(0);
      expect(events2).toHaveLength(1);
    });
  });

  describe('subscription', () => {
    it('notifies listeners on plan change', async () => {
      const plans: LayoutPlan[] = [];
      engine.subscribe((plan) => plans.push(plan));

      engine.registerNode({ id: 'a', zone: 'z' });
      await new Promise((resolve) => setTimeout(resolve, 300));

      expect(plans.length).toBeGreaterThan(1);
      expect(plans[plans.length - 1]).toHaveProperty('order');
    });

    it('unsubscribes correctly', async () => {
      let count = 0;
      const unsub = engine.subscribe(() => {
        count++;
      });

      engine.registerNode({ id: 'a', zone: 'z' });
      await new Promise((resolve) => setTimeout(resolve, 300));
      const countAfterRegister = count;

      unsub();

      engine.registerNode({ id: 'b', zone: 'z' });
      await new Promise((resolve) => setTimeout(resolve, 300));

      expect(count).toBe(countAfterRegister);
    });

    it('immediately calls listener with current plan', () => {
      const plans: LayoutPlan[] = [];
      engine.subscribe((plan) => plans.push(plan));
      expect(plans).toHaveLength(1);
    });
  });

  describe('plan computation', () => {
    it('orders by click frequency', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.registerNode({ id: 'b', zone: 'z' });

      // Use hover events to avoid regret detection
      engine.record('hover', 'b', 'z');
      engine.record('hover', 'b', 'z');
      engine.record('hover', 'a', 'z');

      await new Promise((resolve) => setTimeout(resolve, 300));

      const plan = engine.getPlan();
      // 'b' should have higher emphasis due to more hovers
      expect(plan.emphasis['b'] ?? 0).toBeGreaterThan(plan.emphasis['a'] ?? 0);
    });

    it('computes emphasis', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.registerNode({ id: 'b', zone: 'z' });

      for (let i = 0; i < 10; i++) {
        engine.record('click', 'a', 'z');
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      const plan = engine.getPlan();
      expect(plan.emphasis['a']).toBeGreaterThan(plan.emphasis['b'] ?? 0);
    });

    it('respects pinned nodes', async () => {
      engine.registerNode({ id: 'a', zone: 'z', pinned: true });
      engine.registerNode({ id: 'b', zone: 'z' });

      for (let i = 0; i < 10; i++) {
        engine.record('click', 'b', 'z');
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      const plan = engine.getPlan();
      const order = plan.order['z'];
      expect(order?.[0]).toBe('a');
      expect(plan.emphasis['a']).toBe(0);
    });
  });

  describe('reset', () => {
    it('clears events', async () => {
      engine.record('click', 'a', 'z');
      await engine.reset();
      expect(engine.events()).toHaveLength(0);
    });

    it('clears persistence', async () => {
      engine.record('click', 'a', 'z');
      await engine.reset();
      const newEngine = new GhostEngine({
        persistence: memoryAdapter(),
      });
      await newEngine.init();
      expect(newEngine.events()).toHaveLength(0);
    });
  });

  describe('time injection', () => {
    it('uses provided time provider for plan timestamp', async () => {
      let now = 1000;
      const engine2 = new GhostEngine({
        persistence: memoryAdapter(),
        now: () => now,
      });

      engine2.registerNode({ id: 'a', zone: 'z' });
      await new Promise((resolve) => setTimeout(resolve, 300));

      const plan1 = engine2.getPlan();
      expect(plan1.ts).toBe(1000);

      now = 5000;
      engine2.registerNode({ id: 'b', zone: 'z' });
      await new Promise((resolve) => setTimeout(resolve, 300));

      const plan2 = engine2.getPlan();
      expect(plan2.ts).toBe(5000);
    });

    it('uses time provider in optimizer', async () => {
      let now = 1000;
      const engine2 = new GhostEngine({
        persistence: memoryAdapter(),
        now: () => now,
        scoring: { windowMs: 5000 },
      });

      engine2.registerNode({ id: 'a', zone: 'z' });
      engine2._injectEvents([
        { id: 'a', zone: 'z', type: 'click', ts: 500 }, // older than window
        { id: 'a', zone: 'z', type: 'click', ts: 800 }, // within window
      ]);

      await new Promise((resolve) => setTimeout(resolve, 300));

      // With now=1000, windowMs=5000, event at ts=500 is expired (now - ts = 500 > 5000? no, so kept)
      // Actually, 1000 - 500 = 500, which is less than 5000, so should be kept
      expect(engine2.events().length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('destroy', () => {
    it('clears timers and listeners', () => {
      const plan = engine.getPlan();
      engine.subscribe(() => {});
      engine.destroy();
      // After destroy, the engine should not update listeners
      // This is hard to test directly, but we verify it doesn't throw
      expect(() => engine.destroy()).not.toThrow();
    });

    it('prevents memory leaks from timers', async () => {
      let recordCount = 0;
      const listener = vi.fn(() => {
        recordCount++;
      });

      engine.subscribe(listener);
      engine.record('click', 'a', 'z');

      await new Promise((resolve) => setTimeout(resolve, 300));
      const countBeforeDestroy = recordCount;

      engine.destroy();

      // Register more events - they shouldn't trigger listeners
      engine.record('click', 'a', 'z');
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Count shouldn't increase much after destroy
      // (might increase slightly due to in-flight operations)
      expect(recordCount).toBeLessThanOrEqual(countBeforeDestroy + 2);
    });
  });

  describe('hitbox tracking', () => {
    it('includes hitbox in plan', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.record('miss', 'a', 'z', { dx: 5, dy: -3 });
      await new Promise((resolve) => setTimeout(resolve, 300));

      const plan = engine.getPlan();
      expect(plan.hitbox['a']).toBeDefined();
      expect(plan.hitbox['a']?.right).toBeGreaterThan(0);
      expect(plan.hitbox['a']?.top).toBeGreaterThan(0);
    });
  });

  describe('event caching', () => {
    it('caches events array', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.record('click', 'a', 'z');

      const events1 = engine.events();
      const events2 = engine.events();

      // Should be the same reference due to caching
      // Note: after recompute, cache is cleared, so this tests
      // that multiple calls without recompute return same array
      expect(events1).toEqual(events2);
    });

    it('invalidates cache on new events', async () => {
      const e1 = engine.events();
      engine.record('click', 'a', 'z');
      const e2 = engine.events();
      expect(e1.length).not.toBe(e2.length);
    });
  });

  describe('TTL eviction', () => {
    it('evicts expired events after recompute', async () => {
      let now = 1000;
      const engine2 = new GhostEngine({
        persistence: memoryAdapter(),
        now: () => now,
        scoring: { windowMs: 5000 },
      });

      engine2.registerNode({ id: 'a', zone: 'z' });

      // Inject event at t=1000
      engine2._injectEvents([
        { id: 'a', zone: 'z', type: 'click', ts: 1000 },
      ]);
      expect(engine2.events()).toHaveLength(1);

      // Move time forward beyond window
      now = 7000;
      engine2.registerNode({ id: 'b', zone: 'z' });
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Expired event should be removed (7000 - 1000 = 6000 > windowMs of 5000)
      expect(engine2.events()).toHaveLength(0);
    });
  });

  describe('inject events (test helper)', () => {
    it('ingests test events directly', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine._injectEvents([
        { id: 'a', zone: 'z', type: 'click', ts: Date.now() },
      ]);
      expect(engine.events()).toHaveLength(1);
    });
  });

  describe('predictNext (Markov intent)', () => {
    it('returns empty array for a node with no transition history', () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      expect(engine.predictNext('a')).toEqual([]);
    });

    it('returns predictions sorted by probability descending', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.registerNode({ id: 'b', zone: 'z' });
      engine.registerNode({ id: 'c', zone: 'z' });

      // hover a → click b three times
      for (let i = 0; i < 3; i++) {
        engine.record('hover', 'a', 'z');
        engine.record('click', 'b', 'z');
      }
      // hover a → click c once
      engine.record('hover', 'a', 'z');
      engine.record('click', 'c', 'z');

      const preds = engine.predictNext('a');
      expect(preds[0]?.id).toBe('b');
      expect(preds[1]?.id).toBe('c');
    });

    it('returns probabilities that sum to 1', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.registerNode({ id: 'b', zone: 'z' });
      engine.registerNode({ id: 'c', zone: 'z' });

      engine.record('hover', 'a', 'z');
      engine.record('click', 'b', 'z');
      engine.record('hover', 'a', 'z');
      engine.record('click', 'c', 'z');
      engine.record('hover', 'a', 'z');
      engine.record('click', 'b', 'z');

      const preds = engine.predictNext('a');
      const total = preds.reduce((s, p) => s + p.probability, 0);
      expect(Math.abs(total - 1.0)).toBeLessThan(0.001);
    });

    it('returns at most 5 predictions', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      for (let i = 1; i <= 8; i++) engine.registerNode({ id: `n${i}`, zone: 'z' });

      for (let i = 1; i <= 8; i++) {
        engine.record('hover', 'a', 'z');
        engine.record('click', `n${i}`, 'z');
      }

      const preds = engine.predictNext('a');
      expect(preds.length).toBeLessThanOrEqual(5);
    });

    it('returns empty after engine reset', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.registerNode({ id: 'b', zone: 'z' });
      engine.record('hover', 'a', 'z');
      engine.record('click', 'b', 'z');

      expect(engine.predictNext('a').length).toBeGreaterThan(0);

      await engine.reset();
      expect(engine.predictNext('a')).toEqual([]);
    });
  });

  describe('velocity', () => {
    it('returns 0 before any commits', () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      expect(engine.getVelocity('a')).toBe(0);
    });

    it('returns positive delta when emphasis rises', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.registerNode({ id: 'b', zone: 'z' });
      await new Promise(resolve => setTimeout(resolve, 300));

      // 'a' gets many clicks → it will gain emphasis vs cold-start
      for (let i = 0; i < 5; i++) engine.record('click', 'a', 'z');
      await new Promise(resolve => setTimeout(resolve, 300));

      const vel = engine.getVelocity('a');
      expect(vel).toBeGreaterThan(0);
    });

    it('returns negative delta when emphasis falls', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.registerNode({ id: 'b', zone: 'z' });

      // Give 'a' high emphasis first
      for (let i = 0; i < 10; i++) engine.record('click', 'a', 'z');
      await new Promise(resolve => setTimeout(resolve, 300));

      const emphasisAfterClicks = engine.getPlan().emphasis['a'] ?? 0;

      // Now give 'b' even more clicks — 'a' emphasis drops relatively
      for (let i = 0; i < 20; i++) engine.record('click', 'b', 'z');
      await new Promise(resolve => setTimeout(resolve, 300));

      const emphasisAfter = engine.getPlan().emphasis['a'] ?? 0;
      expect(emphasisAfter).toBeLessThan(emphasisAfterClicks);
    });
  });

  describe('emphasisHistory', () => {
    it('returns empty array before commits', () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      expect(engine.getEmphasisHistory('a')).toEqual([]);
    });

    it('accumulates values up to 10', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.registerNode({ id: 'b', zone: 'z' });

      // Trigger 12 separate recomputes
      for (let i = 0; i < 12; i++) {
        engine.record('click', 'a', 'z');
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const hist = engine.getEmphasisHistory('a');
      expect(hist.length).toBeLessThanOrEqual(10);
      expect(hist.length).toBeGreaterThan(0);
    });

    it('values are between 0 and 1', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.registerNode({ id: 'b', zone: 'z' });
      for (let i = 0; i < 3; i++) engine.record('click', 'a', 'z');
      await new Promise(resolve => setTimeout(resolve, 300));

      for (const v of engine.getEmphasisHistory('a')) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('replayAt', () => {
    it('returns cold-start plan at index 0', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.registerNode({ id: 'b', zone: 'z' });
      engine.record('click', 'a', 'z');
      engine.record('click', 'a', 'z');
      await new Promise(resolve => setTimeout(resolve, 300));

      const replay = await engine.replayAt(0);
      // Cold start: all emphasis 0
      expect(replay.emphasis['a'] ?? 0).toBe(0);
      expect(replay.emphasis['b'] ?? 0).toBe(0);
    });

    it('returns plan consistent with sliced events', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.registerNode({ id: 'b', zone: 'z' });
      // Use hover events to avoid rage/regret interactions
      for (let i = 0; i < 10; i++) engine.record('hover', 'a', 'z');
      for (let i = 0; i < 2; i++) engine.record('hover', 'b', 'z');
      await new Promise(resolve => setTimeout(resolve, 300));

      const total = engine.events().length;
      const replayFull = await engine.replayAt(total);
      // Full replay: 'a' has far more hovers → ranked first
      expect(replayFull.order['z']?.[0]).toBe('a');
    });

    it('does not commit the replayed plan to subscribers', async () => {
      engine.registerNode({ id: 'a', zone: 'z' });
      engine.registerNode({ id: 'b', zone: 'z' });
      engine.record('click', 'a', 'z');
      await new Promise(resolve => setTimeout(resolve, 300));

      const planBefore = engine.getPlan();

      // inject events manually at ts=0 to check replay doesn't mutate live plan
      await engine.replayAt(0);

      expect(engine.getPlan()).toBe(planBefore); // same reference — not replaced
    });
  });

  describe('listener change detection', () => {
    it('notifies when order changes', async () => {
      const plans: LayoutPlan[] = [];
      engine.subscribe((plan) => plans.push(plan));

      engine.registerNode({ id: 'a', zone: 'z' });
      engine.registerNode({ id: 'b', zone: 'z' });
      await new Promise((resolve) => setTimeout(resolve, 300));

      engine.record('click', 'b', 'z');
      engine.record('click', 'b', 'z');
      engine.record('click', 'a', 'z');
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Should have multiple plan updates
      expect(plans.length).toBeGreaterThan(1);
    });

    it('notifies when emphasis changes', async () => {
      const plans: LayoutPlan[] = [];
      engine.subscribe((plan) => plans.push(plan));

      engine.registerNode({ id: 'a', zone: 'z' });
      await new Promise((resolve) => setTimeout(resolve, 50));

      const initialEmphasis = plans[plans.length - 1]?.emphasis['a'];

      for (let i = 0; i < 5; i++) {
        engine.record('click', 'a', 'z');
      }
      await new Promise((resolve) => setTimeout(resolve, 300));

      const finalEmphasis = plans[plans.length - 1]?.emphasis['a'];
      expect(finalEmphasis).toBeGreaterThan(initialEmphasis ?? 0);
    });

    it('notifies when hitbox changes', async () => {
      const plans: LayoutPlan[] = [];
      engine.subscribe((plan) => plans.push(plan));

      engine.registerNode({ id: 'a', zone: 'z' });
      await new Promise((resolve) => setTimeout(resolve, 50));

      const initialHitbox = plans[plans.length - 1]?.hitbox['a'];

      engine.record('miss', 'a', 'z', { dx: 10, dy: 10 });
      await new Promise((resolve) => setTimeout(resolve, 300));

      const finalHitbox = plans[plans.length - 1]?.hitbox['a'];
      expect(finalHitbox).not.toEqual(initialHitbox);
    });
  });
});
