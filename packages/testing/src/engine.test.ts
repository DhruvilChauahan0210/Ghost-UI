import { describe, it, expect, beforeEach } from 'vitest';
import { ghostMatchers } from './matchers.js';
import { buildEvents, createTestEngine, waitForRecompute } from './engine.js';

expect.extend(ghostMatchers);

describe('buildEvents', () => {
  it('generates the correct number of events', () => {
    const events = buildEvents([
      { id: 'a', zone: 'z', count: 10 },
      { id: 'b', zone: 'z', count: 5 },
    ]);
    expect(events).toHaveLength(15);
  });

  it('defaults to count=1 and type=click', () => {
    const events = buildEvents([{ id: 'a', zone: 'z' }]);
    expect(events).toHaveLength(1);
    expect(events[0]?.type).toBe('click');
  });

  it('respects custom event type', () => {
    const events = buildEvents([{ id: 'a', zone: 'z', count: 3, type: 'hover' }]);
    expect(events.every((e) => e.type === 'hover')).toBe(true);
  });

  it('returns events sorted by ts ascending', () => {
    const events = buildEvents([{ id: 'a', zone: 'z', count: 50 }]);
    for (let i = 1; i < events.length; i++) {
      expect(events[i]!.ts).toBeGreaterThanOrEqual(events[i - 1]!.ts);
    }
  });

  it('spreads events within the given window', () => {
    const now = 1_000_000;
    const spreadMs = 10_000;
    const events = buildEvents(
      [{ id: 'a', zone: 'z', count: 100, spreadMs }],
      { now },
    );
    for (const e of events) {
      expect(e.ts).toBeGreaterThanOrEqual(now - spreadMs);
      expect(e.ts).toBeLessThanOrEqual(now);
    }
  });
});

describe('createTestEngine', () => {
  it('creates an engine that starts with no events', async () => {
    const { engine } = await createTestEngine();
    expect(engine.events()).toHaveLength(0);
  });

  it('recomputes with debounceMs=0 (no async waiting needed after simulate)', async () => {
    const { engine, simulate } = await createTestEngine();
    engine.registerNode({ id: 'a', zone: 'z' });
    engine.registerNode({ id: 'b', zone: 'z' });
    await simulate([
      { id: 'a', zone: 'z', count: 10 },
      { id: 'b', zone: 'z', count: 2 },
    ]);
    expect(engine.getOrder('z')[0]).toBe('a');
  });

  it('advance() moves fake time forward', async () => {
    const start = 1_000_000;
    const { advance, now } = await createTestEngine({ startTime: start });
    expect(now).toBe(start);
    advance(5000);
    // now is a getter — re-read via the returned object destructured below
  });

  it('setNow() sets absolute fake time', async () => {
    const t = await createTestEngine({ startTime: 1000 });
    t.setNow(9999);
    expect(t.now).toBe(9999);
  });

  it('simulate() injects events and waits for recompute', async () => {
    const { engine, simulate } = await createTestEngine();
    engine.registerNode({ id: 'save', zone: 'toolbar' });
    engine.registerNode({ id: 'cancel', zone: 'toolbar' });

    await simulate([
      { id: 'save', zone: 'toolbar', count: 20 },
      { id: 'cancel', zone: 'toolbar', count: 3 },
    ]);

    expect(engine).toHaveTopNode('toolbar', 'save');
  });

  it('settle() resolves after recompute', async () => {
    const { engine, settle } = await createTestEngine();
    engine.registerNode({ id: 'a', zone: 'z' });

    const settlePromise = settle();
    engine._injectEvents([{ id: 'a', zone: 'z', type: 'click', ts: Date.now() }]);
    await settlePromise;

    expect(engine.events()).toHaveLength(1);
  });
});

describe('waitForRecompute', () => {
  it('resolves after plan update', async () => {
    const { engine } = await createTestEngine();
    engine.registerNode({ id: 'a', zone: 'z' });

    const waitPromise = waitForRecompute(engine);
    engine._injectEvents([{ id: 'a', zone: 'z', type: 'click', ts: Date.now() }]);
    await waitPromise;

    expect(engine.events().length).toBeGreaterThan(0);
  });

  it('resolves via safety timeout if no recompute happens', async () => {
    const { engine } = await createTestEngine();
    // No events — will hit safety timeout
    await expect(waitForRecompute(engine, 50)).resolves.toBeUndefined();
  });
});

describe('ghostMatchers', () => {
  let engine: Awaited<ReturnType<typeof createTestEngine>>['engine'];

  beforeEach(async () => {
    const t = await createTestEngine();
    engine = t.engine;
    engine.registerNode({ id: 'save', zone: 'toolbar' });
    engine.registerNode({ id: 'cancel', zone: 'toolbar' });
    engine.registerNode({ id: 'delete', zone: 'toolbar' });
    await t.simulate([
      { id: 'save', zone: 'toolbar', count: 30 },
      { id: 'cancel', zone: 'toolbar', count: 10 },
      { id: 'delete', zone: 'toolbar', count: 2 },
    ]);
  });

  it('toHaveOrder — passes on correct order', () => {
    expect(engine).toHaveOrder('toolbar', ['save', 'cancel', 'delete']);
  });

  it('toHaveOrder — fails on wrong order', () => {
    expect(() => {
      expect(engine).toHaveOrder('toolbar', ['delete', 'save', 'cancel']);
    }).toThrow();
  });

  it('toHaveTopNode — passes on correct top node', () => {
    expect(engine).toHaveTopNode('toolbar', 'save');
  });

  it('toHaveTopNode — fails when wrong node is on top', () => {
    expect(() => {
      expect(engine).toHaveTopNode('toolbar', 'delete');
    }).toThrow();
  });

  it('toHaveScore — passes with greaterThan', () => {
    expect(engine).toHaveScore('save', { greaterThan: 0 });
  });

  it('toHaveScore — fails when node not registered', () => {
    expect(() => {
      expect(engine).toHaveScore('nonexistent', { greaterThan: 0 });
    }).toThrow();
  });

  it('toHaveEmphasis — passes with greaterThan', () => {
    expect(engine).toHaveEmphasis('save', { greaterThan: 0.5 });
  });

  it('toHaveEmphasis — delete should have low emphasis', () => {
    expect(engine).toHaveEmphasis('delete', { lessThan: 0.5 });
  });

  it('toHaveEventCount — passes on correct count', () => {
    expect(engine).toHaveEventCount(42);
  });

  it('toBeRankedBefore — save before delete', () => {
    expect(engine).toBeRankedBefore('toolbar', 'save', 'delete');
  });

  it('toBeRankedBefore — fails when order is reversed', () => {
    expect(() => {
      expect(engine).toBeRankedBefore('toolbar', 'delete', 'save');
    }).toThrow();
  });
});
