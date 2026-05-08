import { GhostEngine, type EngineOptions, type LayoutPlan } from '@ghost-ui/core';
import type { GhostId } from '@ghost-ui/core';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface GhostContextValue {
  engine: GhostEngine;
  plan: LayoutPlan;
  hoveredNodeId: GhostId | null;
  setHoveredNodeId: (id: GhostId | null) => void;
}

const GhostContext = createContext<GhostContextValue | null>(null);

export interface GhostProviderProps extends EngineOptions {
  children: ReactNode;
  /** keyboard shortcut to reset learned layout. Default ⌘/Ctrl+Shift+G */
  resetHotkey?: boolean;
}

export function GhostProvider({ children, resetHotkey = true, ...opts }: GhostProviderProps) {
  const engine = useMemo(() => new GhostEngine(opts), []);
  const [plan, setPlan] = useState<LayoutPlan>(engine.getPlan());
  const [hoveredNodeId, setHoveredNodeIdRaw] = useState<GhostId | null>(null);
  const setHoveredNodeId = useCallback((id: GhostId | null) => setHoveredNodeIdRaw(id), []);

  useEffect(() => {
    void engine.init();
    const unsub = engine.subscribe(setPlan);
    return () => {
      unsub();
      engine.destroy();
    };
  }, [engine]);

  useEffect(() => {
    if (!resetHotkey || typeof window === 'undefined') return;
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.shiftKey && (e.key === 'g' || e.key === 'G')) {
        e.preventDefault();
        void engine.reset();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [engine, resetHotkey]);

  const value = useMemo(
    () => ({ engine, plan, hoveredNodeId, setHoveredNodeId }),
    [engine, plan, hoveredNodeId, setHoveredNodeId],
  );
  return <GhostContext.Provider value={value}>{children}</GhostContext.Provider>;
}

export function useGhostEngine(): GhostEngine {
  const ctx = useContext(GhostContext);
  if (!ctx) throw new Error('Ghost UI: useGhostEngine must be used inside <GhostProvider>');
  return ctx.engine;
}

export function useGhostPlan(): LayoutPlan {
  const ctx = useContext(GhostContext);
  if (!ctx) throw new Error('Ghost UI: useGhostPlan must be used inside <GhostProvider>');
  return ctx.plan;
}

/** Returns [hoveredNodeId, setHoveredNodeId] — the node currently being hovered by the user. */
export function useGhostHoveredNode(): [GhostId | null, (id: GhostId | null) => void] {
  const ctx = useContext(GhostContext);
  if (!ctx) return [null, () => {}];
  return [ctx.hoveredNodeId, ctx.setHoveredNodeId];
}
