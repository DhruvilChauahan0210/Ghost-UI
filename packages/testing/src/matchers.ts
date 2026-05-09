/// <reference types="vitest" />
import type { GhostEngine } from '@ghost-ui/core';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MatcherResult {
  pass: boolean;
  message: () => string;
}

type MatcherFn<T extends unknown[]> = (
  received: GhostEngine,
  ...args: T
) => MatcherResult;

// ─── Individual matchers ──────────────────────────────────────────────────────

const toHaveOrder: MatcherFn<[zone: string, expected: string[]]> = (
  engine,
  zone,
  expected,
) => {
  const actual = engine.getOrder(zone);
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  return {
    pass,
    message: () =>
      pass
        ? `Expected zone "${zone}" NOT to have order [${expected.join(', ')}]`
        : `Expected zone "${zone}" to have order:\n  [${expected.join(', ')}]\nReceived:\n  [${actual.join(', ')}]`,
  };
};

const toHaveTopNode: MatcherFn<[zone: string, id: string]> = (
  engine,
  zone,
  id,
) => {
  const order = engine.getOrder(zone);
  const actual = order[0];
  const pass = actual === id;
  return {
    pass,
    message: () =>
      pass
        ? `Expected zone "${zone}" top node NOT to be "${id}"`
        : `Expected zone "${zone}" top node to be "${id}", got "${actual ?? '(empty)'}"`,
  };
};

const toHaveScore: MatcherFn<[id: string, expected: number | { greaterThan: number } | { lessThan: number }]> = (
  engine,
  id,
  expected,
) => {
  const breakdown = engine.explainScore(id);
  const actual = breakdown?.totalScore ?? null;

  if (actual === null) {
    return {
      pass: false,
      message: () => `Node "${id}" is not registered in the engine`,
    };
  }

  if (typeof expected === 'number') {
    const pass = Math.abs(actual - expected) < 0.001;
    return {
      pass,
      message: () =>
        pass
          ? `Expected "${id}" score NOT to be ~${expected}`
          : `Expected "${id}" score to be ~${expected}, got ${actual.toFixed(4)}`,
    };
  }

  if ('greaterThan' in expected) {
    const pass = actual > expected.greaterThan;
    return {
      pass,
      message: () =>
        pass
          ? `Expected "${id}" score NOT to be > ${expected.greaterThan}`
          : `Expected "${id}" score to be > ${expected.greaterThan}, got ${actual.toFixed(4)}`,
    };
  }

  const pass = actual < expected.lessThan;
  return {
    pass,
    message: () =>
      pass
        ? `Expected "${id}" score NOT to be < ${expected.lessThan}`
        : `Expected "${id}" score to be < ${expected.lessThan}, got ${actual.toFixed(4)}`,
  };
};

const toHaveEmphasis: MatcherFn<[id: string, expected: number | { greaterThan: number } | { lessThan: number }]> = (
  engine,
  id,
  expected,
) => {
  const actual = engine.getPlan().emphasis[id] ?? null;

  if (actual === null) {
    return {
      pass: false,
      message: () => `Node "${id}" has no emphasis in the current plan`,
    };
  }

  if (typeof expected === 'number') {
    const pass = Math.abs(actual - expected) < 0.01;
    return {
      pass,
      message: () =>
        pass
          ? `Expected "${id}" emphasis NOT to be ~${expected}`
          : `Expected "${id}" emphasis to be ~${expected}, got ${actual.toFixed(4)}`,
    };
  }

  if ('greaterThan' in expected) {
    const pass = actual > expected.greaterThan;
    return {
      pass,
      message: () =>
        pass
          ? `Expected "${id}" emphasis NOT to be > ${expected.greaterThan}`
          : `Expected "${id}" emphasis to be > ${expected.greaterThan}, got ${actual.toFixed(4)}`,
    };
  }

  const pass = actual < expected.lessThan;
  return {
    pass,
    message: () =>
      pass
        ? `Expected "${id}" emphasis NOT to be < ${expected.lessThan}`
        : `Expected "${id}" emphasis to be < ${expected.lessThan}, got ${actual.toFixed(4)}`,
  };
};

const toHaveEventCount: MatcherFn<[expected: number]> = (engine, expected) => {
  const actual = engine.events().length;
  const pass = actual === expected;
  return {
    pass,
    message: () =>
      pass
        ? `Expected engine NOT to have ${expected} events`
        : `Expected engine to have ${expected} events, got ${actual}`,
  };
};

const toBeRankedBefore: MatcherFn<[zone: string, idA: string, idB: string]> = (
  engine,
  zone,
  idA,
  idB,
) => {
  const order = engine.getOrder(zone);
  const iA = order.indexOf(idA);
  const iB = order.indexOf(idB);

  if (iA === -1 || iB === -1) {
    return {
      pass: false,
      message: () =>
        `One or both nodes not found in zone "${zone}": "${idA}" (idx ${iA}), "${idB}" (idx ${iB})`,
    };
  }

  const pass = iA < iB;
  return {
    pass,
    message: () =>
      pass
        ? `Expected "${idA}" NOT to be ranked before "${idB}" in zone "${zone}"`
        : `Expected "${idA}" to be ranked before "${idB}" in zone "${zone}"\nActual order: [${order.join(', ')}]`,
  };
};

// ─── Export ───────────────────────────────────────────────────────────────────

/**
 * Custom matchers for Vitest and Jest. Call `expect.extend(ghostMatchers)` in
 * your setup file, then use them in tests:
 *
 * @example
 * // vitest.setup.ts
 * import { expect } from 'vitest'
 * import { ghostMatchers } from '@ghost-ui/testing'
 * expect.extend(ghostMatchers)
 *
 * // your.test.ts
 * expect(engine).toHaveOrder('toolbar', ['save', 'cancel'])
 * expect(engine).toHaveTopNode('toolbar', 'save')
 * expect(engine).toHaveScore('save', { greaterThan: 0 })
 * expect(engine).toHaveEmphasis('save', { greaterThan: 0.5 })
 * expect(engine).toHaveEventCount(30)
 * expect(engine).toBeRankedBefore('toolbar', 'save', 'cancel')
 */
export const ghostMatchers = {
  toHaveOrder,
  toHaveTopNode,
  toHaveScore,
  toHaveEmphasis,
  toHaveEventCount,
  toBeRankedBefore,
} as const;

// TypeScript augmentation — merge into vitest/jest expect interface
declare module 'vitest' {
  // Must match vitest's own type parameter signature exactly
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> {
    toHaveOrder(zone: string, expected: string[]): T;
    toHaveTopNode(zone: string, id: string): T;
    toHaveScore(id: string, expected: number | { greaterThan: number } | { lessThan: number }): T;
    toHaveEmphasis(id: string, expected: number | { greaterThan: number } | { lessThan: number }): T;
    toHaveEventCount(expected: number): T;
    toBeRankedBefore(zone: string, idA: string, idB: string): T;
  }
  interface AsymmetricMatchersContaining {
    toHaveOrder(zone: string, expected: string[]): void;
    toHaveTopNode(zone: string, id: string): void;
    toHaveScore(id: string, expected: number | { greaterThan: number } | { lessThan: number }): void;
    toHaveEmphasis(id: string, expected: number | { greaterThan: number } | { lessThan: number }): void;
    toHaveEventCount(expected: number): void;
    toBeRankedBefore(zone: string, idA: string, idB: string): void;
  }
}
