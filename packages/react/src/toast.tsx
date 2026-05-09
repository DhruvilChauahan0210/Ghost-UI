import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import type { GhostId, ZoneId } from '@ghost-ui/core';
import { useGhostEngine } from './context.js';
import { useGhostScore } from './hooks.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastOptions {
  /** Unique id. Auto-generated if omitted. */
  id?: string;
  /** Ghost zone — toasts from frequently-engaged zones rise to the top. */
  zone: ZoneId;
  message: ReactNode;
  variant?: ToastVariant;
  /** Auto-dismiss after ms. Default 4000. Pass Infinity to keep until dismissed. */
  duration?: number;
  /** Optional CTA shown as a button inside the toast. */
  action?: { label: string; onClick: () => void };
}

interface ToastEntry extends Required<Omit<ToastOptions, 'action'>> {
  action?: ToastOptions['action'];
  /** Ghost score for the zone at time of queuing (used for initial sort). */
  zoneScore: number;
}

interface GhostToastCtx {
  toast: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const GhostToastContext = createContext<GhostToastCtx>({
  toast: () => '',
  dismiss: () => {},
});

let _counter = 0;
function uid() { return `gt-${++_counter}`; }

// ─── Provider ─────────────────────────────────────────────────────────────────

export interface GhostToastProviderProps {
  children: ReactNode;
  /** Max toasts visible at once. Default 5. */
  maxVisible?: number;
  /**
   * Screen anchor. Default 'bottom-right'.
   * The top-N toasts by Ghost score are shown; lower-scored ones queue silently.
   */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function GhostToastProvider({
  children,
  maxVisible = 5,
  position = 'bottom-right',
}: GhostToastProviderProps) {
  const [queue, setQueue] = useState<ToastEntry[]>([]);
  const engine = useGhostEngine();

  const toast = useCallback(
    (opts: ToastOptions): string => {
      const id = opts.id ?? uid();
      const plan = engine.getPlan();
      // Score based on emphasis of any node already in this zone, or 0
      const zoneScore = Object.entries(plan.emphasis)
        .filter(([nodeId]) => {
          const events = engine.events();
          return events.some(e => e.id === nodeId && e.zone === opts.zone);
        })
        .reduce((max, [, score]) => Math.max(max, score), 0);

      const entry: ToastEntry = {
        id,
        zone: opts.zone,
        message: opts.message,
        variant: opts.variant ?? 'info',
        duration: opts.duration ?? 4000,
        action: opts.action,
        zoneScore,
      };

      setQueue(prev => {
        // Remove any existing toast with the same id (dedup)
        const filtered = prev.filter(t => t.id !== id);
        // Insert sorted by zoneScore desc — highest-priority zones show first
        const inserted = [...filtered, entry].sort((a, b) => b.zoneScore - a.zoneScore);
        return inserted;
      });

      return id;
    },
    [engine],
  );

  const dismiss = useCallback((id: string) => {
    setQueue(prev => prev.filter(t => t.id !== id));
  }, []);

  // Re-sort whenever the Ghost plan updates so that zones gaining score bubble up
  useEffect(() => {
    const unsub = engine.subscribe((plan) => {
      setQueue(prev => {
        if (prev.length < 2) return prev;
        const reScored = prev.map(t => {
          const newScore = Object.entries(plan.emphasis)
            .filter(([nodeId]) => engine.events().some(e => e.id === nodeId && e.zone === t.zone))
            .reduce((max, [, score]) => Math.max(max, score), t.zoneScore);
          return { ...t, zoneScore: newScore };
        });
        return [...reScored].sort((a, b) => b.zoneScore - a.zoneScore);
      });
    });
    return unsub;
  }, [engine]);

  const visible = queue.slice(0, maxVisible);

  const anchor = positionStyles[position];

  return (
    <GhostToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            aria-live="polite"
            aria-label="Notifications"
            style={{
              position: 'fixed',
              zIndex: 99999,
              display: 'flex',
              flexDirection: position.startsWith('top') ? 'column' : 'column-reverse',
              gap: 8,
              pointerEvents: 'none',
              ...anchor,
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((entry) => (
                <ToastItem
                  key={entry.id}
                  entry={entry}
                  onDismiss={dismiss}
                  fromTop={position.startsWith('top')}
                />
              ))}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </GhostToastContext.Provider>
  );
}

// ─── Individual toast ─────────────────────────────────────────────────────────

function ToastItem({
  entry,
  onDismiss,
  fromTop,
}: {
  entry: ToastEntry;
  onDismiss: (id: string) => void;
  fromTop: boolean;
}) {
  const engine = useGhostEngine();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const score = useGhostScore(entry.id);

  // Register the toast itself as a ghost node in its zone so its zone gets credit
  // when the user clicks the toast or its action.
  useEffect(() => {
    engine.registerNode({ id: entry.id, zone: entry.zone });
    return () => engine.unregisterNode(entry.id);
  }, [engine, entry.id, entry.zone]);

  // Auto-dismiss timer
  useEffect(() => {
    if (!isFinite(entry.duration)) return;
    timerRef.current = setTimeout(() => onDismiss(entry.id), entry.duration);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [entry.id, entry.duration, onDismiss]);

  function handleClick() {
    engine.record('click', entry.id, entry.zone);
    onDismiss(entry.id);
  }

  function handleAction(e: React.MouseEvent) {
    e.stopPropagation();
    engine.record('click', entry.id, entry.zone);
    entry.action?.onClick();
    onDismiss(entry.id);
  }

  const cfg = variantCfg[entry.variant];

  // Glow intensity scales with ghost score
  const glowColor = cfg.glow;
  const glowStyle: CSSProperties = score > 0.1
    ? { boxShadow: `0 0 ${20 * score}px ${4 * score}px ${glowColor}` }
    : {};

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: fromTop ? -16 : 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      style={{ pointerEvents: 'auto' }}
    >
      <div
        role="alert"
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          minWidth: 280,
          maxWidth: 380,
          padding: '11px 14px',
          borderRadius: 12,
          border: `1px solid ${cfg.border}`,
          background: cfg.bg,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'box-shadow 240ms ease',
          ...glowStyle,
        }}
      >
        {/* Icon */}
        <span style={{ flexShrink: 0, marginTop: 1, color: cfg.iconColor }}>
          {cfg.icon}
        </span>

        {/* Body */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            lineHeight: 1.4,
            color: 'rgba(255,255,255,0.88)',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          }}>
            {entry.message}
          </p>
          {entry.action && (
            <button
              onClick={handleAction}
              style={{
                marginTop: 6,
                padding: '3px 10px',
                borderRadius: 6,
                border: `1px solid ${cfg.border}`,
                background: cfg.actionBg,
                color: cfg.iconColor,
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                outline: 'none',
              }}
            >
              {entry.action.label}
            </button>
          )}
        </div>

        {/* Dismiss */}
        <button
          aria-label="Dismiss"
          onClick={(e) => { e.stopPropagation(); onDismiss(entry.id); }}
          style={{
            flexShrink: 0,
            marginTop: 1,
            padding: 2,
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.30)',
            cursor: 'pointer',
            lineHeight: 1,
            borderRadius: 4,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/** Returns `{ toast, dismiss }` for firing Ghost-scored notifications. */
export function useGhostToast(): GhostToastCtx {
  return useContext(GhostToastContext);
}

// ─── Variant config ───────────────────────────────────────────────────────────

interface VariantCfg {
  bg: string;
  border: string;
  iconColor: string;
  actionBg: string;
  glow: string;
  icon: ReactNode;
}

const variantCfg: Record<ToastVariant, VariantCfg> = {
  info: {
    bg: 'rgba(10,10,22,0.88)',
    border: 'rgba(92,94,240,0.30)',
    iconColor: '#8b8df8',
    actionBg: 'rgba(92,94,240,0.15)',
    glow: 'rgba(92,94,240,0.25)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7.5 5v.5M7.5 7v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  success: {
    bg: 'rgba(5,18,10,0.90)',
    border: 'rgba(34,197,94,0.28)',
    iconColor: '#4ade80',
    actionBg: 'rgba(34,197,94,0.12)',
    glow: 'rgba(34,197,94,0.20)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M4.5 7.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  warning: {
    bg: 'rgba(18,13,3,0.90)',
    border: 'rgba(245,158,11,0.28)',
    iconColor: '#fbbf24',
    actionBg: 'rgba(245,158,11,0.12)',
    glow: 'rgba(245,158,11,0.18)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M7.5 2L1.5 13h12L7.5 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M7.5 6v3M7.5 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  error: {
    bg: 'rgba(18,3,3,0.90)',
    border: 'rgba(239,68,68,0.28)',
    iconColor: '#f87171',
    actionBg: 'rgba(239,68,68,0.12)',
    glow: 'rgba(239,68,68,0.20)',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5 5l5 5M10 5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
};

const positionStyles: Record<NonNullable<GhostToastProviderProps['position']>, CSSProperties> = {
  'top-right':     { top: 16, right: 16, alignItems: 'flex-end' },
  'top-left':      { top: 16, left: 16, alignItems: 'flex-start' },
  'bottom-right':  { bottom: 16, right: 16, alignItems: 'flex-end' },
  'bottom-left':   { bottom: 16, left: 16, alignItems: 'flex-start' },
  'top-center':    { top: 16, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
  'bottom-center': { bottom: 16, left: '50%', transform: 'translateX(-50%)', alignItems: 'center' },
};
