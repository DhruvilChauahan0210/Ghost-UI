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

// ─── Privacy context ──────────────────────────────────────────────────────────

interface GhostPrivacyCtx {
  optOut: boolean;
  setOptOut: (v: boolean) => void;
  clearData: () => Promise<void>;
}

const GhostPrivacyContext = createContext<GhostPrivacyCtx>({
  optOut: false,
  setOptOut: () => {},
  clearData: async () => {},
});

const OPT_OUT_KEY = 'ghost-ui:opt-out';

function readOptOut(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(OPT_OUT_KEY) === '1';
  } catch {
    return false;
  }
}

function writeOptOut(v: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (v) localStorage.setItem(OPT_OUT_KEY, '1');
    else localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    // ignore (private browsing / permissions)
  }
}

// ─── Ghost context ────────────────────────────────────────────────────────────

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
  /**
   * When true, Ghost UI stops recording events and returns default ordering.
   * Persisted in localStorage. Controlled — when omitted Ghost manages it internally.
   */
  optOut?: boolean;
  /** Called when the user changes the opt-out preference via useGhostPrivacy(). */
  onOptOutChange?: (optOut: boolean) => void;
}

export function GhostProvider({
  children,
  resetHotkey = true,
  optOut: optOutProp,
  onOptOutChange,
  ...opts
}: GhostProviderProps) {
  const engine = useMemo(() => new GhostEngine(opts), []);
  const [plan, setPlan] = useState<LayoutPlan>(engine.getPlan());
  const [hoveredNodeId, setHoveredNodeIdRaw] = useState<GhostId | null>(null);
  const setHoveredNodeId = useCallback((id: GhostId | null) => setHoveredNodeIdRaw(id), []);

  // Uncontrolled opt-out state (persisted to localStorage)
  const [internalOptOut, setInternalOptOut] = useState<boolean>(readOptOut);
  const optOut = optOutProp ?? internalOptOut;

  // Keep the original record method so we can restore it on opt-in
  const originalRecord = useMemo(() => engine.record.bind(engine), [engine]);

  // Suppress or restore recording based on opt-out state
  useEffect(() => {
    if (optOut) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (engine as any).record = () => {};
      void engine.reset();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (engine as any).record = originalRecord;
    }
  }, [optOut, engine, originalRecord]);

  const setOptOut = useCallback(
    (v: boolean) => {
      if (optOutProp === undefined) {
        setInternalOptOut(v);
        writeOptOut(v);
      }
      onOptOutChange?.(v);
    },
    [optOutProp, onOptOutChange],
  );

  const clearData = useCallback(async () => {
    await engine.reset();
  }, [engine]);

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

  const privacyValue = useMemo(
    () => ({ optOut, setOptOut, clearData }),
    [optOut, setOptOut, clearData],
  );

  return (
    <GhostPrivacyContext.Provider value={privacyValue}>
      <GhostContext.Provider value={value}>{children}</GhostContext.Provider>
    </GhostPrivacyContext.Provider>
  );
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

/**
 * Returns privacy controls for Ghost UI.
 * `optOut` — whether tracking is disabled.
 * `setOptOut` — toggle tracking on/off (persisted to localStorage).
 * `clearData` — erase all recorded events and reset layout to default.
 */
export function useGhostPrivacy(): GhostPrivacyCtx {
  return useContext(GhostPrivacyContext);
}
