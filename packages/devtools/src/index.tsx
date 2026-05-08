import { useGhostEngine, useGhostPlan } from '@ghost-ui/react';
import type { LayoutPlan } from '@ghost-ui/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface GhostDevtoolsProps {
  /** keyboard shortcut to toggle the overlay. Default ⌘/Ctrl + . */
  hotkey?: boolean;
  defaultOpen?: boolean;
  clipToSelector?: string;
}

interface Tracked {
  id: string;
  rect: DOMRect;
  score: number;
  velocity: number;
  history: number[];
}

const PANEL_W = 260;

function Sparkline({ values, w = 44, h = 14 }: { values: number[]; w?: number; h?: number }) {
  if (values.length < 2) return <span style={{ opacity: 0.2, fontSize: 10 }}>–</span>;
  const max = Math.max(...values, 0.001);
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * h}`)
    .join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke="#a78bfa" strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

function velArrow(v: number) {
  if (v > 0.015) return '↑';
  if (v < -0.015) return '↓';
  return '→';
}

function velColor(v: number) {
  if (v > 0.015) return '#4ade80';
  if (v < -0.015) return '#f87171';
  return '#94a3b8';
}

export function GhostDevtools({ hotkey = true, defaultOpen = false, clipToSelector }: GhostDevtoolsProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [matrixMode, setMatrixMode] = useState(false);
  const [scrubIndex, setScrubIndex] = useState<number | null>(null);
  const [replayedPlan, setReplayedPlan] = useState<LayoutPlan | null>(null);
  const [tick, setTick] = useState(0);
  const replayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const plan   = useGhostPlan();
  const engine = useGhostEngine();

  const activePlan = replayedPlan ?? plan;
  const eventCount = engine.events().length;
  const isLive     = scrubIndex === null || scrubIndex >= eventCount;

  useEffect(() => {
    if (!hotkey || typeof window === 'undefined') return;
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '.') { e.preventDefault(); setOpen(v => !v); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [hotkey]);

  useEffect(() => {
    if (!open) return;
    const bump = () => setTick(n => n + 1);
    const id = window.setInterval(bump, 250);
    window.addEventListener('scroll', bump, { passive: true });
    window.addEventListener('resize', bump);
    return () => { window.clearInterval(id); window.removeEventListener('scroll', bump); window.removeEventListener('resize', bump); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const deadline = performance.now() + 600;
    let raf = 0;
    const loop = () => { setTick(n => n + 1); if (performance.now() < deadline) raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [open, plan.ts]);

  const handleScrub = useCallback((idx: number) => {
    const total = engine.events().length;
    if (idx >= total) { setScrubIndex(null); setReplayedPlan(null); return; }
    setScrubIndex(idx);
    if (replayTimerRef.current) clearTimeout(replayTimerRef.current);
    replayTimerRef.current = setTimeout(async () => {
      const p = await engine.replayAt(idx);
      setReplayedPlan(p);
    }, 16);
  }, [engine]);

  const exitReplay = useCallback(() => { setScrubIndex(null); setReplayedPlan(null); }, []);

  if (typeof document === 'undefined' || !open) return null;
  void tick;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let overlayClip: string | undefined;
  if (clipToSelector) {
    const container = document.querySelector(clipToSelector);
    if (container) {
      const cr = container.getBoundingClientRect();
      overlayClip = `inset(${Math.max(0, cr.top)}px ${Math.max(0, vw - cr.right)}px ${Math.max(0, vh - cr.bottom)}px ${Math.max(0, cr.left)}px)`;
    }
  }

  const tracked: Tracked[] = [];
  document.querySelectorAll<HTMLElement>('[data-ghost-id]').forEach((el) => {
    const id = el.getAttribute('data-ghost-id');
    if (!id) return;
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > vh || rect.right < 0 || rect.left > vw) return;
    tracked.push({ id, rect, score: activePlan.emphasis[id] ?? 0, velocity: engine.getVelocity(id), history: engine.getEmphasisHistory(id) });
  });

  const ranked = [...tracked].sort((a, b) => b.score - a.score);

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 2147483646, font: '12px ui-monospace, SFMono-Regular, Menlo, monospace', color: '#fff' }}>

      {/* Node overlays */}
      <div style={{ position: 'absolute', inset: 0, clipPath: overlayClip }}>
        {ranked.map(({ id, rect, score, velocity }, rankIdx) => {
          const col = matrixMode ? velColor(velocity) : `hsl(${280 - score * 80}, 90%, 65%)`;
          const badgeTop = rect.top - 22;
          return (
            <div key={id}>
              <div style={{
                position: 'absolute', top: rect.top, left: rect.left,
                width: rect.width, height: rect.height,
                border: `1.5px solid ${col}99`, borderRadius: 8,
                boxShadow: `0 0 ${matrixMode ? Math.abs(velocity) * 40 : score * 8}px ${col}44`,
                pointerEvents: 'none',
              }} />
              {badgeTop >= 0 && (
                <div style={{
                  position: 'absolute', top: badgeTop, left: rect.left,
                  height: 20, padding: '0 6px',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: 'rgba(10,10,18,0.92)', border: `1px solid ${col}77`,
                  borderRadius: 4, fontSize: 10, whiteSpace: 'nowrap', pointerEvents: 'none',
                }}>
                  {matrixMode ? (
                    <>
                      <span style={{ color: col, fontWeight: 700 }}>{velArrow(velocity)}</span>
                      <span style={{ color: col }}>{velocity > 0 ? `+${velocity.toFixed(2)}` : velocity.toFixed(2)}</span>
                    </>
                  ) : (
                    <>
                      <span style={{ color: col, fontWeight: 700 }}>#{rankIdx + 1}</span>
                      <span style={{ opacity: 0.6 }}>{Math.round(score * 100)}%</span>
                      <span style={{ color: velColor(velocity), opacity: 0.85 }}>{velArrow(velocity)}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info panel */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16, borderRadius: 12,
        background: 'rgba(10,10,18,0.94)', border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(16px)', pointerEvents: 'auto', width: PANEL_W, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '10px 12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontWeight: 700, color: '#c4b5fd' }}>Ghost UI · devtools</span>
          <button type="button" onClick={() => setMatrixMode(v => !v)} style={{
            padding: '2px 7px',
            border: `1px solid ${matrixMode ? '#4ade80' : 'rgba(255,255,255,0.18)'}`,
            background: matrixMode ? 'rgba(74,222,128,0.12)' : 'transparent',
            color: matrixMode ? '#4ade80' : 'rgba(255,255,255,0.45)',
            borderRadius: 5, cursor: 'pointer', font: 'inherit', fontSize: 10, fontWeight: 600,
          }}>
            {matrixMode ? '⬡ MATRIX' : '⬡ matrix'}
          </button>
        </div>

        {/* Replay banner */}
        {!isLive && (
          <div style={{ padding: '5px 12px', background: 'rgba(251,146,60,0.14)', borderBottom: '1px solid rgba(251,146,60,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#fb923c', fontSize: 10, fontWeight: 700 }}>⏪ REPLAY @{scrubIndex} / {eventCount}</span>
            <button type="button" onClick={exitReplay} style={{ border: 'none', background: 'none', color: '#fb923c', cursor: 'pointer', font: 'inherit', fontSize: 10, padding: 0 }}>✕ live</button>
          </div>
        )}

        {/* Node list */}
        <div style={{ maxHeight: 240, overflowY: 'auto', padding: '6px 12px' }}>
          {ranked.length === 0 && <div style={{ opacity: 0.4, padding: '4px 0 6px' }}>no nodes in view</div>}
          {ranked.map(({ id, score, velocity, history }) => (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: matrixMode ? velColor(velocity) : `hsl(${280 - score * 80},85%,60%)` }} />
              <span style={{ flex: 1, opacity: 0.85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{id}</span>
              <span style={{ color: velColor(velocity), fontSize: 10, fontWeight: 600, width: 14, textAlign: 'center' }}>{velArrow(velocity)}</span>
              <Sparkline values={history} />
            </div>
          ))}
        </div>

        {/* Replay scrubber */}
        <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, opacity: 0.45 }}>replay scrubber</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: isLive ? '#4ade80' : '#fb923c' }}>
              {isLive ? '● live' : `⏪ ${scrubIndex}`}
            </span>
          </div>
          <input type="range" min={0} max={Math.max(eventCount, 1)} value={isLive ? eventCount : (scrubIndex ?? eventCount)}
            onChange={e => handleScrub(Number(e.target.value))}
            style={{ width: '100%', accentColor: isLive ? '#a78bfa' : '#fb923c', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, opacity: 0.3, marginTop: 2 }}>
            <span>cold start</span><span>{eventCount} events</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '6px 12px 10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ opacity: 0.4, fontSize: 10, marginBottom: 6 }}>
            {Object.keys(plan.emphasis).length} nodes · {plan.ts ? new Date(plan.ts).toLocaleTimeString() : '—'}
          </div>
          <button type="button" onClick={() => void engine.reset()} style={{
            width: '100%', padding: '5px 10px', border: '1px solid rgba(255,255,255,0.18)',
            background: 'transparent', color: '#fff', borderRadius: 7, cursor: 'pointer', font: 'inherit', fontSize: 11,
          }}>
            reset learned layout
          </button>
          <div style={{ opacity: 0.3, fontSize: 10, textAlign: 'center', marginTop: 6 }}>⌘ . to close</div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
