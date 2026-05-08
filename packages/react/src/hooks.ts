import type { GhostId, GravityTier, ZoneId } from '@ghost-ui/core';
import { useEffect, useRef } from 'react';
import { useGhostEngine, useGhostHoveredNode, useGhostPlan } from './context.js';

export function useRegisterNode(id: GhostId, zone: ZoneId, opts: { weight?: number; pinned?: boolean } = {}) {
  const engine = useGhostEngine();
  const optsRef = useRef(opts);
  optsRef.current = opts;
  useEffect(() => {
    engine.registerNode({ id, zone, ...optsRef.current });
    return () => engine.unregisterNode(id);
  }, [engine, id, zone]);
}

export function useGhostScore(id: GhostId): number {
  const plan = useGhostPlan();
  return plan.emphasis[id] ?? 0;
}

export function useGhostOrder(zone: ZoneId): GhostId[] {
  const plan = useGhostPlan();
  return plan.order[zone] ?? [];
}

export function useGhostHitbox(id: GhostId) {
  const plan = useGhostPlan();
  return plan.hitbox[id] ?? { top: 0, right: 0, bottom: 0, left: 0 };
}

/** Signed emphasis delta since the previous plan commit. Positive = gaining, negative = falling. */
export function useGhostVelocity(id: GhostId): number {
  const engine = useGhostEngine();
  const plan = useGhostPlan();
  void plan.ts;
  return engine.getVelocity(id);
}

/**
 * Returns intent predictions for the currently hovered node (or an explicit override).
 * Each entry is { id, probability } sorted highest-first. Empty when no hover or no history.
 */
export function useGhostIntent(override?: GhostId | null): { id: GhostId; probability: number }[] {
  const engine = useGhostEngine();
  const [hoveredNodeId] = useGhostHoveredNode();
  const plan = useGhostPlan();
  void plan.ts;
  const source = override !== undefined ? override : hoveredNodeId;
  if (!source) return [];
  return engine.predictNext(source);
}

/** Returns the normalized canvas position (x, y each 0–1) for a node. Used by GhostCanvas. */
export function useGhostPosition(id: GhostId): { x: number; y: number } {
  const plan = useGhostPlan();
  return plan.position?.[id] ?? { x: 0, y: 0 };
}

/** Returns the Gravity Grid area tier for a node ('primary' | 'secondary' | 'tertiary'). */
export function useGhostArea(id: GhostId): GravityTier {
  const plan = useGhostPlan();
  return plan.area?.[id] ?? 'tertiary';
}

/** Returns rage-click frustration state for a node, recomputed on every plan update. */
export function useGhostFrustration(id: GhostId, windowMs = 60_000): { rageCount: number; isFrustrated: boolean } {
  const engine = useGhostEngine();
  const plan = useGhostPlan();
  void plan.ts;
  const now = Date.now();
  const cutoff = now - windowMs;
  const rageCount = engine.events().filter((e) => e.type === 'rage' && e.id === id && e.ts >= cutoff).length;
  return { rageCount, isFrustrated: rageCount > 0 };
}
