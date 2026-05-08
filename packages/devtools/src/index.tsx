import { useGhostEngine, useGhostPlan } from '@ghost-ui/react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface GhostDevtoolsProps {
  /** keyboard shortcut to toggle the overlay. Default ⌘/Ctrl + . */
  hotkey?: boolean;
  defaultOpen?: boolean;
  /**
   * CSS selector for the element that the node overlays should be clipped to.
   * Overlays outside this element's bounds are hidden. The info panel is unaffected.
   */
  clipToSelector?: string;
}

interface Tracked {
  id: string;
  rect: DOMRect;
  score: number;
}

export function GhostDevtools({ hotkey = true, defaultOpen = false, clipToSelector }: GhostDevtoolsProps) {
  const [open, setOpen] = useState(defaultOpen);
  const plan = useGhostPlan();
  const engine = useGhostEngine();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!hotkey || typeof window === 'undefined') return;
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === '.') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [hotkey]);

  /* Slow poll for idle position refresh (scroll/resize/baseline) */
  useEffect(() => {
    if (!open) return;
    const bump = () => setTick((n) => n + 1);
    let raf = 0;
    const onMove = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(bump); };
    const id = window.setInterval(bump, 250);
    window.addEventListener('scroll', onMove, { passive: true });
    window.addEventListener('resize', onMove);
    return () => {
      window.clearInterval(id);
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onMove);
      window.removeEventListener('resize', onMove);
    };
  }, [open]);

  /* Rapid RAF tracking for ~600ms whenever the plan changes — tracks spring animation */
  useEffect(() => {
    if (!open) return;
    const deadline = performance.now() + 600;
    let raf = 0;
    const loop = () => {
      setTick((n) => n + 1);
      if (performance.now() < deadline) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [open, plan.ts]);

  if (typeof document === 'undefined' || !open) return null;

  void tick; /* ensures re-render on scroll/tick so positions and clip stay fresh */

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  /* Clip node overlays to a container element — hides any stale-position ghosts
     that land outside the demo frame during fast scroll. Recomputed every render. */
  let overlayClip: string | undefined;
  if (clipToSelector) {
    const container = document.querySelector(clipToSelector);
    if (container) {
      const cr = container.getBoundingClientRect();
      const t = Math.max(0, cr.top);
      const r = Math.max(0, vw - cr.right);
      const b = Math.max(0, vh - cr.bottom);
      const l = Math.max(0, cr.left);
      overlayClip = `inset(${t}px ${r}px ${b}px ${l}px)`;
    }
  }

  const tracked: Tracked[] = [];
  document.querySelectorAll<HTMLElement>('[data-ghost-id]').forEach((el) => {
    const id = el.getAttribute('data-ghost-id');
    if (!id) return;
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > vh || rect.right < 0 || rect.left > vw) return;
    tracked.push({ id, rect, score: plan.emphasis[id] ?? 0 });
  });

  const total = Object.keys(plan.emphasis).length;

  /* sort tracked by score desc so rank badges are numbered correctly */
  const ranked = [...tracked].sort((a, b) => b.score - a.score);

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 2147483646,
        font: '12px ui-monospace, SFMono-Regular, Menlo, monospace',
        color: '#fff',
      }}
    >
      {/* Node outlines + rank badges — clipped to demo frame */}
      <div style={{ position: 'absolute', inset: 0, clipPath: overlayClip }}>
        {ranked.map(({ id, rect, score }, rankIdx) => {
          const hue = 280 - score * 80;
          const pct = Math.round(score * 100);
          const borderAlpha = 0.5 + score * 0.4;
          /* badge sits just above the button's top edge */
          const badgeTop = rect.top - 20;
          const badgeVisible = badgeTop >= 0;
          return (
            <div key={id}>
              {/* border outline */}
              <div
                style={{
                  position: 'absolute',
                  top: rect.top,
                  left: rect.left,
                  width: rect.width,
                  height: rect.height,
                  border: `1.5px solid hsla(${hue}, 90%, 65%, ${borderAlpha})`,
                  borderRadius: 8,
                  boxShadow: `0 0 ${8 * score}px hsla(${hue}, 90%, 60%, ${0.2 * score})`,
                  pointerEvents: 'none',
                }}
              />
              {/* rank badge above the button */}
              {badgeVisible && (
                <div
                  style={{
                    position: 'absolute',
                    top: badgeTop,
                    left: rect.left,
                    height: 18,
                    padding: '0 6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: `hsla(${hue}, 80%, 22%, 0.92)`,
                    border: `1px solid hsla(${hue}, 80%, 60%, 0.7)`,
                    borderRadius: 4,
                    fontSize: 10,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                  }}
                >
                  <span style={{ color: `hsl(${hue}, 85%, 70%)`, fontWeight: 700 }}>#{rankIdx + 1}</span>
                  <span style={{ opacity: 0.75 }}>{pct}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info panel — not clipped, always anchored to viewport bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          borderRadius: 12,
          background: 'rgba(10,10,18,0.92)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          pointerEvents: 'auto',
          width: 220,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '10px 12px 8px', fontWeight: 700, color: '#c4b5fd', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          Ghost UI · devtools
        </div>

        {/* Sorted node list */}
        <div style={{ maxHeight: 240, overflowY: 'auto', padding: '6px 12px' }}>
          {[...tracked]
            .sort((a, b) => b.score - a.score)
            .map(({ id, score }) => {
              const hue = 280 - score * 80;
              const pct = Math.round(score * 100);
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: `hsl(${hue}, 85%, 60%)`,
                  }} />
                  <span style={{ flex: 1, opacity: 0.85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{id}</span>
                  <span style={{ opacity: 0.55, fontSize: 11 }}>{pct}%</span>
                </div>
              );
            })}
          {tracked.length === 0 && (
            <div style={{ opacity: 0.4, paddingTop: 2, paddingBottom: 4 }}>no nodes in view</div>
          )}
        </div>

        <div style={{ padding: '6px 12px 8px', borderTop: '1px solid rgba(255,255,255,0.08)', opacity: 0.5, fontSize: 11 }}>
          {total} nodes · plan {plan.ts ? new Date(plan.ts).toLocaleTimeString() : '—'}
        </div>
        <div style={{ padding: '0 12px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            type="button"
            onClick={() => void engine.reset()}
            style={{
              width: '100%',
              padding: '5px 10px',
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'transparent',
              color: '#fff',
              borderRadius: 7,
              cursor: 'pointer',
              font: 'inherit',
              fontSize: 11,
            }}
          >
            reset learned layout
          </button>
          <div style={{ opacity: 0.35, fontSize: 10, textAlign: 'center' }}>⌘ . to close</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
