'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

/* ════════════════════════════════════════════════════════════
   Original interactive demos
   ════════════════════════════════════════════════════════════ */

export function ToggleDemo() {
  const [on, setOn] = useState(false);
  const [on2, setOn2] = useState(true);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={() => setOn(o => !o)} aria-pressed={on}
        className={`inline-flex items-center gap-2 rounded-[10px] border px-4 py-[11px] text-[14px] font-medium transition-all duration-200 ${on ? 'border-accent/[0.40] bg-accent/[0.14] text-accent shadow-[0_0_20px_rgba(196,181,253,0.15)]' : 'border-white/[0.12] bg-white/[0.03] text-[#787890] hover:border-white/[0.20] hover:text-[#a8a8be]'}`}>
        <span className={`inline-block h-2 w-2 rounded-full transition-all duration-200 ${on ? 'bg-accent shadow-[0_0_6px_rgba(196,181,253,0.8)]' : 'bg-[#484860]'}`} />
        {on ? 'Enabled' : 'Disabled'}
      </button>
      <button onClick={() => setOn2(o => !o)} aria-pressed={on2}
        className={`inline-flex items-center gap-2 rounded-[10px] border px-4 py-[11px] text-[14px] font-medium transition-all duration-200 ${on2 ? 'border-emerald-400/[0.35] bg-emerald-400/[0.10] text-emerald-400' : 'border-white/[0.12] bg-white/[0.03] text-[#787890] hover:border-white/[0.20] hover:text-[#a8a8be]'}`}>
        {on2 ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 6 6 18M6 6l12 12"/></svg>}
        Notifications {on2 ? 'on' : 'off'}
      </button>
    </div>
  );
}

export function CopyDemo() {
  const [copied, setCopied] = useState<string | null>(null);
  function copy(key: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={() => copy('cmd', 'npm install @ghost-ui/react')}
        className="inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium transition-all duration-200 hover:border-white/[0.20] hover:bg-white/[0.06]"
        style={{ color: copied === 'cmd' ? '#34d399' : '#9898b0' }}>
        {copied === 'cmd' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>}
        {copied === 'cmd' ? 'Copied!' : 'Copy command'}
      </button>
      <div className="inline-flex items-center gap-2 overflow-hidden rounded-[10px] border border-white/[0.10] bg-[#0c0c14] pl-4 pr-1.5 py-1.5">
        <code className="font-mono text-[12.5px] text-[#c4b5fd]">npx @ghost-ui/cli init</code>
        <button onClick={() => copy('inline', 'npx @ghost-ui/cli init')}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-[7px] transition-all duration-150 ${copied === 'inline' ? 'bg-emerald-400/[0.15] text-emerald-400' : 'bg-white/[0.04] text-[#787890] hover:bg-white/[0.10] hover:text-[#b8b8cc]'}`}
          aria-label="Copy">
          {copied === 'inline' ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5"/></svg> : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>}
        </button>
      </div>
    </div>
  );
}

export function ConfirmDemo() {
  const [state, setState] = useState<'idle'|'confirming'|'done'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>|null>(null);
  function handle() {
    if (state === 'idle') { setState('confirming'); timer.current = setTimeout(() => setState('idle'), 3000); }
    else if (state === 'confirming') { if (timer.current) clearTimeout(timer.current); setState('done'); setTimeout(() => setState('idle'), 2000); }
  }
  const [split, setSplit] = useState<'idle'|'confirming'>('idle');
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button onClick={handle}
        className={`inline-flex items-center gap-2 rounded-[10px] border px-4 py-[11px] text-[14px] font-medium transition-all duration-300 ${state==='idle' ? 'border-red-500/[0.28] bg-red-500/[0.07] text-red-400 hover:border-red-500/[0.45] hover:bg-red-500/[0.12]' : state==='confirming' ? 'border-amber-400/[0.40] bg-amber-400/[0.12] text-amber-400 animate-pulse' : 'border-emerald-400/[0.35] bg-emerald-400/[0.10] text-emerald-400'}`}>
        {state === 'idle' ? 'Delete project' : state === 'confirming' ? 'Click again to confirm' : 'Deleted ✓'}
      </button>
      <div className={`inline-flex items-center overflow-hidden rounded-[10px] border transition-all duration-300 ${split==='confirming' ? 'border-amber-400/[0.35]' : 'border-red-500/[0.28]'}`}>
        {split === 'idle' ? (
          <button onClick={() => setSplit('confirming')} className="inline-flex items-center gap-2 bg-red-500/[0.07] px-4 py-[11px] text-[14px] font-medium text-red-400 transition-colors hover:bg-red-500/[0.12]">Remove member</button>
        ) : (
          <>
            <span className="px-3 text-[13px] text-amber-400">Sure?</span>
            <button onClick={() => setSplit('idle')} className="border-l border-amber-400/[0.20] px-3 py-[11px] text-[13px] text-[#787890] hover:text-[#b8b8cc]">Cancel</button>
            <button onClick={() => setSplit('idle')} className="border-l border-amber-400/[0.20] bg-amber-400/[0.10] px-3 py-[11px] text-[13px] font-medium text-amber-400 hover:bg-amber-400/[0.18]">Yes, remove</button>
          </>
        )}
      </div>
    </div>
  );
}

export function ProgressDemo() {
  const [p1, setP1] = useState<number|null>(null);
  const [p2, setP2] = useState<number|null>(null);
  function run(setter: (v: number|null) => void) {
    setter(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 16;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setter(null), 1200); }
      setter(Math.min(p, 100));
    }, 200);
  }
  const d1 = p1 === 100, d2 = p2 === 100;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={() => p1 === null && run(setP1)} disabled={p1 !== null && !d1}
        className="relative inline-flex items-center gap-2 overflow-hidden rounded-[10px] border border-white/[0.12] bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium transition-all duration-200 disabled:cursor-default"
        style={{ color: d1 ? '#34d399' : p1 !== null ? '#c4b5fd' : '#9898b0' }}>
        {p1 !== null && <span className="absolute bottom-0 left-0 h-[2px] rounded-full bg-accent transition-all duration-200" style={{ width: `${p1}%` }} />}
        {p1 !== null && !d1 ? <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> : d1 ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>}
        {d1 ? 'Uploaded!' : p1 !== null ? `${Math.round(p1)}%` : 'Upload file'}
      </button>
      <button onClick={() => p2 === null && run(setP2)} disabled={p2 !== null && !d2}
        className="relative inline-flex items-center gap-2 overflow-hidden rounded-[10px] border border-transparent px-4 py-[11px] text-[14px] font-semibold transition-all duration-200 disabled:cursor-default"
        style={{ background: d2 ? '#34d399' : '#ededf0', color: '#0a0a10' }}>
        {p2 !== null && !d2 && <span className="absolute inset-0 origin-left bg-[#c4b5fd] transition-all duration-200" style={{ transform: `scaleX(${(p2??0)/100})` }} />}
        <span className="relative z-[1] flex items-center gap-2">
          {p2 !== null && !d2 ? <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> : d2 ? '✓' : '▶'}
          {d2 ? 'Deployed!' : p2 !== null ? `${Math.round(p2)}%` : 'Deploy now'}
        </span>
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   New interactive demos
   ════════════════════════════════════════════════════════════ */

/* ── Magnetic ─────────────────────────────────────────────── */
export function MagneticDemo() {
  const make = (cls: string, label: string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const wrapRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [pos, setPos] = useState({ x: 0, y: 0 });
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const leaving = useRef(false);
    return (
      <div ref={wrapRef} className="inline-block p-5 cursor-pointer"
        onMouseMove={e => {
          leaving.current = false;
          const r = wrapRef.current!.getBoundingClientRect();
          setPos({ x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35 });
        }}
        onMouseLeave={() => { leaving.current = true; setPos({ x: 0, y: 0 }); }}>
        <button className={cls}
          style={{ transform: `translate(${pos.x}px,${pos.y}px)`, transition: leaving.current ? 'transform 0.55s cubic-bezier(0.2,0.7,0.2,1)' : 'transform 0.08s ease' }}>
          {label}
        </button>
      </div>
    );
  };
  return (
    <div className="flex flex-wrap">
      {make("inline-flex items-center gap-2 rounded-[10px] border border-transparent bg-[#ededf0] px-4 py-[11px] text-[14px] font-semibold text-[#0a0a10]", "Hover me →")}
      {make("inline-flex items-center gap-2 rounded-[10px] border border-accent/[0.35] bg-accent/[0.10] px-4 py-[11px] text-[14px] font-medium text-accent", "Magnetic")}
      {make("inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium text-[#9898b0]", "Ghost pull")}
    </div>
  );
}

/* ── Ripple ───────────────────────────────────────────────── */
interface Ripple { id: number; x: number; y: number; size: number; }
export function RippleDemo() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  function addRipple(e: React.MouseEvent<HTMLButtonElement>) {
    const btn = e.currentTarget;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const id = Date.now() + Math.random();
    setRipples(prev => [...prev, { id, x: e.clientX - r.left - size / 2, y: e.clientY - r.top - size / 2, size }]);
    setTimeout(() => setRipples(prev => prev.filter(rip => rip.id !== id)), 600);
  }
  const base = "relative inline-flex items-center gap-2 overflow-hidden rounded-[10px] px-4 py-[11px] text-[14px] font-medium select-none cursor-pointer";
  return (
    <div className="flex flex-wrap items-center gap-3">
      {[
        { cls: `${base} border border-transparent bg-[#ededf0] font-semibold text-[#0a0a10]`, label: 'Primary ripple', color: 'rgba(139,92,246,0.4)' },
        { cls: `${base} border border-white/[0.12] bg-white/[0.03] text-[#9898b0]`, label: 'Ghost ripple', color: 'rgba(255,255,255,0.12)' },
        { cls: `${base} border border-accent/[0.35] bg-accent/[0.10] text-accent`, label: 'Accent ripple', color: 'rgba(196,181,253,0.35)' },
      ].map(({ cls, label, color }) => (
        <button key={label} className={cls} onClick={addRipple}>
          {ripples.map(rip => (
            <span key={rip.id} className="pointer-events-none absolute rounded-full"
              style={{ left: rip.x, top: rip.y, width: rip.size, height: rip.size, background: color, animation: 'ripple 600ms ease-out forwards', transform: 'scale(0)', opacity: 1 }} />
          ))}
          {label}
        </button>
      ))}
    </div>
  );
}

/* ── Dropdown ─────────────────────────────────────────────── */
export function DropdownDemo() {
  const [open, setOpen] = useState<string|null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null); }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const menus: Record<string, { icon: React.ReactNode; label: string }[]> = {
    actions: [
      { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>, label: 'Edit' },
      { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>, label: 'Duplicate' },
      { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>, label: 'Share' },
      { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>, label: 'Delete' },
    ],
  };
  return (
    <div ref={ref} className="flex flex-wrap items-start gap-3">
      <div className="relative">
        <button onClick={() => setOpen(open === 'actions' ? null : 'actions')}
          className="inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium text-[#9898b0] transition-all duration-150 hover:border-white/[0.20] hover:text-[#c0c0d0]">
          Actions
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`transition-transform duration-200 ${open === 'actions' ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
        </button>
        {open === 'actions' && (
          <div className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[160px] overflow-hidden rounded-[12px] border border-white/[0.10] bg-[#0e0e1a] py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
            {(menus.actions ?? []).map((item, i) => (
              <button key={item.label} onClick={() => setOpen(null)}
                className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13px] transition-colors duration-100 hover:bg-white/[0.05] ${i === (menus.actions ?? []).length - 1 ? 'mt-1 border-t border-white/[0.06] text-red-400' : 'text-[#9898b0] hover:text-[#c0c0d0]'}`}>
                {item.icon}{item.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative">
        <button onClick={() => setOpen(open === 'deploy' ? null : 'deploy')}
          className="inline-flex items-center gap-2 rounded-[10px] border border-transparent bg-[#ededf0] px-4 py-[11px] text-[14px] font-semibold text-[#0a0a10] transition-all duration-200 hover:bg-white">
          Deploy
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={`transition-transform duration-200 ${open === 'deploy' ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
        </button>
        {open === 'deploy' && (
          <div className="absolute left-0 top-[calc(100%+6px)] z-50 min-w-[180px] overflow-hidden rounded-[12px] border border-white/[0.10] bg-[#0e0e1a] py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
            {['Deploy to preview', 'Deploy to staging', 'Deploy to production'].map((item, i) => (
              <button key={item} onClick={() => setOpen(null)}
                className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13px] text-[#9898b0] transition-colors duration-100 hover:bg-white/[0.05] hover:text-[#c0c0d0] ${i === 2 ? 'mt-1 border-t border-white/[0.06] text-accent hover:text-accent' : ''}`}>
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Quantity stepper ─────────────────────────────────────── */
export function StepperDemo() {
  const [qty, setQty] = useState(1);
  const [qty2, setQty2] = useState(3);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="inline-flex items-center overflow-hidden rounded-[10px] border border-white/[0.12] bg-white/[0.03]">
        <button onClick={() => setQty(q => Math.max(0, q - 1))} disabled={qty === 0}
          className="flex h-[46px] w-[46px] items-center justify-center text-[20px] font-light text-[#9898b0] transition-colors hover:bg-white/[0.04] hover:text-fg disabled:text-[#404058] disabled:cursor-not-allowed">−</button>
        <span className="w-10 text-center font-mono text-[15px] font-semibold tabular-nums text-[#d0d0e0]">{qty}</span>
        <button onClick={() => setQty(q => Math.min(99, q + 1))} disabled={qty === 99}
          className="flex h-[46px] w-[46px] items-center justify-center text-[20px] font-light text-[#9898b0] transition-colors hover:bg-white/[0.04] hover:text-fg disabled:text-[#404058] disabled:cursor-not-allowed">+</button>
      </div>
      <div className="inline-flex items-center gap-3 rounded-[10px] border border-white/[0.12] bg-white/[0.03] px-4 py-2.5">
        <button onClick={() => setQty2(q => Math.max(1, q - 1))}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.04] text-[14px] text-[#9898b0] transition-colors hover:border-white/[0.20] hover:text-fg">−</button>
        <span className="min-w-[2ch] text-center font-mono text-[14px] font-semibold tabular-nums text-[#d0d0e0]">{qty2}</span>
        <button onClick={() => setQty2(q => Math.min(99, q + 1))}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.04] text-[14px] text-[#9898b0] transition-colors hover:border-white/[0.20] hover:text-fg">+</button>
        <span className="text-[13px] text-[#787890]">items</span>
      </div>
    </div>
  );
}

/* ── Reaction ─────────────────────────────────────────────── */
export function ReactionDemo() {
  const [heart, setHeart] = useState(false);
  const [star, setStar] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [thumbs, setThumbs] = useState<'up'|'down'|null>(null);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={() => setHeart(h => !h)} aria-pressed={heart}
        className={`inline-flex items-center gap-2 rounded-[10px] border px-4 py-[11px] text-[14px] font-medium transition-all duration-200 ${heart ? 'border-red-400/[0.35] bg-red-400/[0.10] text-red-400' : 'border-white/[0.12] bg-white/[0.03] text-[#787890] hover:border-red-400/[0.25] hover:text-red-400'}`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill={heart ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ transition: 'transform 0.2s', transform: heart ? 'scale(1.2)' : 'scale(1)' }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        {heart ? '124' : '123'}
      </button>
      <button onClick={() => setStar(s => !s)} aria-pressed={star}
        className={`inline-flex items-center gap-2 rounded-[10px] border px-4 py-[11px] text-[14px] font-medium transition-all duration-200 ${star ? 'border-amber-400/[0.35] bg-amber-400/[0.10] text-amber-400' : 'border-white/[0.12] bg-white/[0.03] text-[#787890] hover:border-amber-400/[0.25] hover:text-amber-400'}`}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill={star ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ transition: 'transform 0.2s', transform: star ? 'scale(1.2) rotate(-15deg)' : 'scale(1)' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        {star ? 'Starred' : 'Star'}
      </button>
      <button onClick={() => setBookmark(b => !b)} aria-pressed={bookmark}
        className={`inline-flex h-10 w-10 items-center justify-center rounded-[9px] border transition-all duration-200 ${bookmark ? 'border-accent/[0.35] bg-accent/[0.12] text-accent' : 'border-white/[0.12] bg-white/[0.03] text-[#787890] hover:border-accent/[0.25] hover:text-accent'}`}
        aria-label="Bookmark">
        <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmark ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ transition: 'transform 0.2s', transform: bookmark ? 'scale(1.15)' : 'scale(1)' }}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </button>
      <div className="inline-flex overflow-hidden rounded-[10px] border border-white/[0.12]">
        {(['up','down'] as const).map((dir, i) => (
          <button key={dir} onClick={() => setThumbs(t => t === dir ? null : dir)} aria-pressed={thumbs === dir}
            className={`inline-flex items-center gap-2 px-4 py-[10px] text-[13.5px] font-medium transition-all duration-200 ${i > 0 ? 'border-l border-white/[0.08]' : ''} ${thumbs === dir ? (dir === 'up' ? 'bg-emerald-400/[0.10] text-emerald-400' : 'bg-red-400/[0.10] text-red-400') : 'bg-white/[0.02] text-[#787890] hover:bg-white/[0.05] hover:text-[#b0b0c4]'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill={thumbs===dir?'currentColor':'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ transform: dir==='down'?'rotate(180deg) scaleX(-1)':'none' }}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
            {dir === 'up' ? '42' : '7'}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Play / Pause ─────────────────────────────────────────── */
export function PlayPauseDemo() {
  const [playing, setPlaying] = useState(false);
  const [playing2, setPlaying2] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Pause' : 'Play'}
        className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-200 ${playing ? 'border-accent/[0.40] bg-accent/[0.14] text-accent' : 'border-white/[0.12] bg-white/[0.04] text-[#9898b0] hover:border-white/[0.22] hover:text-fg'}`}>
        {playing
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><polygon points="5 3 19 12 5 21 5 3"/></svg>}
      </button>
      <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-[#0c0c14] px-4 py-2.5">
        <button onClick={() => setPlaying2(p => !p)} aria-label={playing2 ? 'Pause' : 'Play'}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ededf0] text-[#0a0a10] transition-all duration-200 hover:bg-white">
          {playing2
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><polygon points="6 3 20 12 6 21 6 3"/></svg>}
        </button>
        <div className="h-1 w-28 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full rounded-full bg-[#9898b0] transition-all duration-500" style={{ width: playing2 ? '62%' : '30%' }} />
        </div>
        <span className="font-mono text-[11px] tabular-nums text-[#787890]">{playing2 ? '1:24' : '0:47'}</span>
      </div>
    </div>
  );
}

/* ── Countdown ────────────────────────────────────────────── */
export function CountdownDemo() {
  const [sec, setSec] = useState<number|null>(null);
  const [sec2, setSec2] = useState<number|null>(null);
  function start(set: React.Dispatch<React.SetStateAction<number|null>>, from: number) {
    set(from);
    const iv = setInterval(() => {
      set((s: number|null) => {
        if (s === null || s <= 1) { clearInterval(iv); return null; }
        return s - 1;
      });
    }, 1000);
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={() => sec === null && start(setSec, 5)} disabled={sec !== null}
        className={`inline-flex items-center gap-2 rounded-[10px] border px-4 py-[11px] text-[14px] font-medium transition-all duration-200 ${sec !== null ? 'border-amber-400/[0.30] bg-amber-400/[0.08] text-amber-400 cursor-not-allowed' : 'border-white/[0.12] bg-white/[0.03] text-[#9898b0] hover:border-white/[0.20] hover:text-fg'}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        {sec !== null ? `Resend in ${sec}s` : 'Resend code'}
      </button>
      <button onClick={() => sec2 === null && start(setSec2, 10)} disabled={sec2 !== null}
        className="relative inline-flex items-center gap-2 overflow-hidden rounded-[10px] border border-white/[0.12] bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium transition-all duration-200 disabled:cursor-not-allowed"
        style={{ color: sec2 !== null ? '#fbbf24' : '#9898b0' }}>
        {sec2 !== null && <span className="absolute left-0 bottom-0 h-[2px] rounded-full bg-amber-400" style={{ width: `${((10 - sec2) / 10) * 100}%`, transition: 'width 1s linear' }} />}
        {sec2 !== null ? `Wait ${sec2}s…` : 'Click to start timer'}
      </button>
    </div>
  );
}

/* ── Long press ───────────────────────────────────────────── */
export function LongPressDemo() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const startRef = useRef<number>(0);

  function onDown() {
    setDone(false);
    startRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min((elapsed / 1500) * 100, 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(intervalRef.current!);
        setDone(true);
        setTimeout(() => { setProgress(0); setDone(false); }, 1500);
      }
    }, 30);
  }

  function onUp() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!done) setProgress(0);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onMouseDown={onDown} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchStart={onDown} onTouchEnd={onUp}
        className={`relative inline-flex items-center gap-2 overflow-hidden rounded-[10px] border px-4 py-[11px] text-[14px] font-medium select-none transition-all duration-200 ${done ? 'border-emerald-400/[0.35] bg-emerald-400/[0.10] text-emerald-400' : progress > 0 ? 'border-accent/[0.35] bg-accent/[0.06] text-accent' : 'border-red-500/[0.28] bg-red-500/[0.07] text-red-400'}`}>
        <span className="absolute bottom-0 left-0 h-[2.5px] rounded-full bg-accent transition-none" style={{ width: `${progress}%` }} />
        {done
          ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5"/></svg> Unlocked!</>
          : progress > 0
          ? <><svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Hold… {Math.round(progress)}%</>
          : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Hold to delete</>}
      </button>
    </div>
  );
}

/* ── File upload ──────────────────────────────────────────── */
export function FileUploadDemo() {
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const [file1, setFile1] = useState<string|null>(null);
  const [file2, setFile2] = useState<string|null>(null);
  const [drag, setDrag] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input ref={ref1} type="file" className="hidden" onChange={e => setFile1(e.target.files?.[0]?.name ?? null)} />
      <button onClick={() => ref1.current?.click()}
        className="inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium transition-all duration-200 hover:border-white/[0.20] hover:bg-white/[0.06]"
        style={{ color: file1 ? '#34d399' : '#9898b0' }}>
        {file1
          ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5"/></svg>{file1.length > 16 ? file1.slice(0,14)+'…' : file1}</>
          : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>Choose file</>}
      </button>
      <input ref={ref2} type="file" className="hidden" multiple onChange={e => setFile2(`${e.target.files?.length ?? 0} files`)} />
      <button onClick={() => ref2.current?.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); setFile2(`${e.dataTransfer.files.length} files`); }}
        className={`inline-flex items-center gap-2 rounded-[10px] border px-4 py-[11px] text-[14px] font-medium transition-all duration-200 ${drag ? 'border-accent/[0.50] bg-accent/[0.10] text-accent' : file2 ? 'border-emerald-400/[0.30] bg-emerald-400/[0.07] text-emerald-400' : 'border-dashed border-white/[0.18] bg-white/[0.02] text-[#787890] hover:border-white/[0.28] hover:bg-white/[0.04]'}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
        {drag ? 'Drop to upload' : file2 ?? 'Drop files here'}
      </button>
    </div>
  );
}

/* ── Add to cart ──────────────────────────────────────────── */
export function AddToCartDemo() {
  const [count, setCount] = useState(0);
  const [bump, setBump] = useState(false);
  function add() {
    setCount(c => c + 1);
    setBump(true);
    setTimeout(() => setBump(false), 400);
  }
  const [count2, setCount2] = useState(0);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button onClick={add}
        className={`inline-flex items-center gap-2.5 rounded-[10px] border px-4 py-[11px] text-[14px] font-semibold transition-all duration-200 ${count > 0 ? 'border-emerald-400/[0.35] bg-emerald-400/[0.10] text-emerald-400 hover:bg-emerald-400/[0.16]' : 'border-transparent bg-[#ededf0] text-[#0a0a10] hover:bg-white'}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        {count > 0 ? `${count} in cart` : 'Add to cart'}
        {count > 0 && (
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0a0a10]/10 font-mono text-[11px] font-bold tabular-nums"
            style={{ animation: bump ? 'cart-bump 0.4s ease' : undefined }}>{count}</span>
        )}
      </button>
      <div className="inline-flex items-center overflow-hidden rounded-[10px] border border-white/[0.12] bg-white/[0.03]">
        {count2 === 0 ? (
          <button onClick={() => setCount2(1)}
            className="inline-flex items-center gap-2 px-4 py-[11px] text-[14px] font-medium text-[#9898b0] transition-colors hover:text-fg">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Add
          </button>
        ) : (
          <>
            <button onClick={() => setCount2(c => Math.max(0, c - 1))} className="flex h-11 w-11 items-center justify-center text-[18px] text-[#9898b0] transition-colors hover:bg-white/[0.04] hover:text-fg">−</button>
            <span className="w-8 text-center font-mono text-[14px] font-semibold tabular-nums text-[#d0d0e0]">{count2}</span>
            <button onClick={() => setCount2(c => c + 1)} className="flex h-11 w-11 items-center justify-center text-[18px] text-[#9898b0] transition-colors hover:bg-white/[0.04] hover:text-fg">+</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Follow / Subscribe ───────────────────────────────────── */
export function FollowDemo() {
  const [state, setState] = useState<'follow'|'following'>('follow');
  const [hov, setHov] = useState(false);
  const [sub, setSub] = useState<'subscribe'|'subscribed'>('subscribe');
  const [subHov, setSubHov] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button onClick={() => setState(s => s === 'follow' ? 'following' : 'follow')}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-[9px] text-[13.5px] font-medium transition-all duration-200 ${
          state === 'following'
            ? hov ? 'border-red-400/[0.30] bg-red-400/[0.08] text-red-400' : 'border-accent/[0.30] bg-accent/[0.10] text-accent'
            : 'border-white/[0.12] bg-white/[0.03] text-[#9898b0] hover:border-white/[0.22] hover:text-fg'}`}>
        {state === 'following' && !hov && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5"/></svg>}
        {state === 'following' ? (hov ? 'Unfollow' : 'Following') : '+ Follow'}
      </button>
      <button onClick={() => setSub(s => s === 'subscribe' ? 'subscribed' : 'subscribe')}
        onMouseEnter={() => setSubHov(true)} onMouseLeave={() => setSubHov(false)}
        className={`inline-flex items-center gap-2 rounded-[10px] border px-4 py-[10px] text-[13.5px] font-medium transition-all duration-200 ${
          sub === 'subscribed'
            ? subHov ? 'border-amber-400/[0.30] bg-amber-400/[0.08] text-amber-400' : 'border-emerald-400/[0.30] bg-emerald-400/[0.09] text-emerald-400'
            : 'border-transparent bg-[#ededf0] text-[#0a0a10] font-semibold hover:bg-white'}`}>
        {sub === 'subscribed'
          ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg> {subHov ? 'Unsubscribe' : 'Subscribed'}</>
          : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg> Subscribe</>}
      </button>
    </div>
  );
}

/* ── Swipe to confirm ─────────────────────────────────────── */
export function SwipeDemo() {
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);

  function onDown(e: React.PointerEvent) {
    if (confirmed) return;
    dragging.current = true;
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onMove(e: React.PointerEvent) {
    if (!dragging.current || !trackRef.current) return;
    const track = trackRef.current.getBoundingClientRect();
    const thumbW = 48;
    const maxDrag = track.width - thumbW - 8;
    const dx = Math.max(0, Math.min(e.clientX - startX.current, maxDrag));
    setProgress(dx / maxDrag);
  }

  function onUp() {
    if (!dragging.current) return;
    dragging.current = false;
    if (progress >= 0.88) {
      setProgress(1);
      setConfirmed(true);
      setTimeout(() => { setProgress(0); setConfirmed(false); }, 2500);
    } else {
      setProgress(0);
    }
  }

  return (
    <div className="flex flex-col gap-3 max-w-[320px]">
      <div ref={trackRef}
        className={`relative flex h-[52px] cursor-pointer items-center overflow-hidden rounded-full border px-1 select-none transition-all duration-300 ${confirmed ? 'border-emerald-400/[0.40] bg-emerald-400/[0.10]' : 'border-white/[0.12] bg-white/[0.04]'}`}>
        <div className="absolute inset-0 rounded-full transition-all duration-200"
          style={{ background: `linear-gradient(90deg, rgba(196,181,253,0.18) ${progress*100}%, transparent ${progress*100}%)` }} />
        <div
          className="relative z-10 flex h-10 w-10 shrink-0 cursor-grab items-center justify-center rounded-full bg-[#ededf0] shadow-[0_2px_8px_rgba(0,0,0,0.4)] active:cursor-grabbing transition-[left] duration-75"
          style={{ transform: `translateX(${Math.round(progress * (trackRef.current ? trackRef.current.getBoundingClientRect().width - 48 - 8 : 0))}px)` }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}>
          {confirmed
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0a0a10" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
        </div>
        <span className="absolute inset-0 flex items-center justify-center text-[13px] font-medium transition-opacity duration-200"
          style={{ color: confirmed ? '#34d399' : '#606078', opacity: progress > 0.4 ? 0 : 1 }}>
          {confirmed ? 'Payment confirmed!' : 'Slide to confirm payment'}
        </span>
      </div>
    </div>
  );
}
