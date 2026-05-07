import { useGhostEngine, useGhostPlan } from '@ghost-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

export interface GhostDevtoolsProps {
  /** keyboard shortcut to toggle the overlay. Default ⌘/Ctrl + . */
  hotkey?: boolean;
  defaultOpen?: boolean;
}

interface Tracked {
  id: string;
  rect: DOMRect;
  score: number;
}

export function GhostDevtools({ hotkey = true, defaultOpen = false }: GhostDevtoolsProps) {
  const [open, setOpen] = useState(defaultOpen);
  const plan = useGhostPlan();
  const engine = useGhostEngine();
  const [, force] = useState(0);

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

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => force((n) => n + 1), 250);
    const onScroll = () => force((n) => n + 1);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.clearInterval(id);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [open]);

  const tracked: Tracked[] = useMemo(() => {
    if (!open || typeof document === 'undefined') return [];
    const out: Tracked[] = [];
    document.querySelectorAll<HTMLElement>('[data-ghost-id]').forEach((el) => {
      const id = el.getAttribute('data-ghost-id');
      if (!id) return;
      out.push({ id, rect: el.getBoundingClientRect(), score: plan.emphasis[id] ?? 0 });
    });
    return out;
  }, [open, plan]);

  if (typeof document === 'undefined' || !open) return null;

  const total = Object.keys(plan.emphasis).length;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2147483646,
        font: '12px ui-monospace, SFMono-Regular, Menlo, monospace',
        color: '#fff',
      }}
    >
      {tracked.map(({ id, rect, score }) => {
        const hue = 280 - score * 80;
        return (
          <div key={id} style={{ position: 'absolute', top: rect.top, left: rect.left, width: rect.width, height: rect.height }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                border: `2px solid hsla(${hue}, 90%, 65%, ${0.4 + score * 0.5})`,
                borderRadius: 12,
                background: `hsla(${hue}, 90%, 60%, ${0.05 + score * 0.18})`,
                boxShadow: `0 0 ${20 * score}px hsla(${hue}, 90%, 60%, ${0.4 * score})`,
                transition: 'all 200ms ease',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: -22,
                left: 0,
                padding: '2px 8px',
                borderRadius: 6,
                background: `hsla(${hue}, 90%, 25%, 0.92)`,
                color: '#fff',
                whiteSpace: 'nowrap',
              }}
            >
              {id} · {score.toFixed(2)}
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          padding: '12px 14px',
          borderRadius: 12,
          background: 'rgba(10,10,18,0.92)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',
          pointerEvents: 'auto',
          minWidth: 220,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 6, color: '#c4b5fd' }}>Ghost UI · devtools</div>
        <div style={{ opacity: 0.7 }}>tracking {total} nodes</div>
        <div style={{ opacity: 0.7 }}>plan ts: {plan.ts ? new Date(plan.ts).toLocaleTimeString() : '—'}</div>
        <button
          type="button"
          onClick={() => void engine.reset()}
          style={{
            marginTop: 10,
            width: '100%',
            padding: '6px 10px',
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'transparent',
            color: '#fff',
            borderRadius: 8,
            cursor: 'pointer',
            font: 'inherit',
          }}
        >
          reset learned layout
        </button>
        <div style={{ opacity: 0.5, marginTop: 8 }}>⌘ . to toggle</div>
      </div>
    </div>,
    document.body,
  );
}
