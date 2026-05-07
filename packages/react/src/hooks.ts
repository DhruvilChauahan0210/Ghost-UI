import type { GhostId, ZoneId } from '@ghost-ui/core';
import { useEffect, useRef } from 'react';
import { useGhostEngine, useGhostPlan } from './context.js';

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
