import { GhostEngine, type EngineOptions, type LayoutPlan } from '@ghost-ui/core';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface GhostContextValue {
  engine: GhostEngine;
  plan: LayoutPlan;
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

  useEffect(() => {
    void engine.init();
    const unsub = engine.subscribe(setPlan);
    return () => {
      unsub();
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

  const value = useMemo(() => ({ engine, plan }), [engine, plan]);
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
