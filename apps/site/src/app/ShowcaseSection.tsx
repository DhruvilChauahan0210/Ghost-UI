'use client';

import { useEffect, useState } from 'react';
import { Reveal } from './Reveal';

/* ─── shared style tokens (mirror page.tsx) ───────────────────────────────── */
const SECTION_NUM   = "inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a8a98] before:h-px before:w-6 before:bg-white/[0.16] before:content-['']";
const SECTION_TITLE = "mt-[18px] mb-[18px] text-balance text-[clamp(36px,5.2vw,72px)] font-medium leading-[0.98] tracking-[-0.045em] text-[#f4f4f7]";
const SECTION_SUB   = "m-0 max-w-[56ch] text-[clamp(16px,1.4vw,18px)] leading-[1.55] tracking-[-0.005em] text-[#9c9caf]";
const ITALIC_ACCENT = "font-serif font-normal italic tracking-[-0.02em] text-[#d8d0ff] px-[0.04em]";

/* ─── reusable browser chrome wrapper ────────────────────────────────────── */
function BrowserChrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-1.5 bg-[#0f0f18] px-3.5 py-[11px] border-b border-white/[0.07]">
        <span className="h-[10px] w-[10px] rounded-full bg-[#ff5f57] border border-black/[0.12]" />
        <span className="h-[10px] w-[10px] rounded-full bg-[#febc2e] border border-black/[0.12]" />
        <span className="h-[10px] w-[10px] rounded-full bg-[#28c840] border border-black/[0.12]" />
        <div className="mx-auto flex h-6 w-[52%] items-center justify-center rounded-md bg-white/[0.04] border border-white/[0.07] px-3">
          <span className="font-mono text-[10px] text-[#3a3a52]">{url}</span>
        </div>
        <div className="w-[62px]" />
      </div>
      {children}
    </div>
  );
}

/* ─── Orbit preview ───────────────────────────────────────────────────────── */
const ORBIT_ISSUES = [
  { id: 'ORB-001', title: 'GhostProvider fallback in Safari 17', bar: 'bg-[#ef4444]', label: 'Bug',      lc: 'bg-red-950/50 text-red-400 border-red-900/40' },
  { id: 'ORB-002', title: 'Memory leak on provider unmount',     bar: 'bg-[#f97316]', label: 'Perf',     lc: 'bg-amber-950/50 text-amber-400 border-amber-900/40' },
  { id: 'ORB-004', title: 'Command palette ⌘K with scores',     bar: 'bg-[#5c5ef0]', label: 'Feature',  lc: 'bg-emerald-950/50 text-emerald-400 border-emerald-900/40' },
  { id: 'ORB-007', title: 'Score decay too aggressive after 4h', bar: 'bg-[#ef4444]', label: 'Ghost UI', lc: 'bg-indigo-950/50 text-indigo-300 border-indigo-900/40' },
  { id: 'ORB-010', title: 'Devtools — sparkline per node',       bar: 'bg-[#5c5ef0]', label: 'Devtools', lc: 'bg-sky-950/50 text-sky-400 border-sky-900/40' },
];

const ORBIT_ACTIONS_INIT = ['Comment', 'Assign', 'Resolve', 'Label'];
const ORBIT_ACTIONS_LEARN = ['Resolve', 'Comment', 'Assign', 'Label'];

function OrbitPreview() {
  const [phase, setPhase] = useState<'idle' | 'click' | 'reordered'>('idle');

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const cycle = () => {
      setPhase('click');
      id = setTimeout(() => {
        setPhase('reordered');
        id = setTimeout(() => {
          setPhase('idle');
          id = setTimeout(cycle, 2800);
        }, 2200);
      }, 700);
    };
    id = setTimeout(cycle, 2200);
    return () => clearTimeout(id);
  }, []);

  const actions = phase === 'idle' ? ORBIT_ACTIONS_INIT : ORBIT_ACTIONS_LEARN;

  return (
    <BrowserChrome url="orbit.app/all-issues">
      <div className="flex overflow-hidden" style={{ height: 296 }}>
        {/* Sidebar */}
        <div className="flex w-[108px] flex-none flex-col border-r border-white/[0.05] bg-[#09090f] py-2">
          <div className="mb-2 flex items-center gap-1.5 px-2.5">
            <div className="h-4 w-4 rounded-[4px] bg-[#5c5ef0] shadow-[0_0_8px_rgba(92,94,240,0.55)] flex-none" />
            <span className="text-[9.5px] font-bold text-[#c8c8dc] tracking-tight">Orbit</span>
            <span className="ml-auto text-[7px] font-bold uppercase tracking-wide px-1 py-px rounded bg-[#5c5ef0]/[0.15] text-[#8b8df8] border border-[#5c5ef0]/[0.25]">Pro</span>
          </div>
          {['Inbox','My Issues','All Issues','Cycles','Roadmap','Backlog'].map((item, i) => (
            <div key={item} className={[
              'flex items-center gap-1.5 h-[24px] mx-1 px-2 rounded-md text-[9px] font-medium transition-colors',
              i === 2 ? 'bg-[#5c5ef0]/[0.14] text-[#a5a7ff]' : 'text-[#5a5a72]',
            ].join(' ')}>
              {i === 2 && <span className="absolute left-[4px] h-3 w-[2px] rounded-r bg-[#5c5ef0]" />}
              <span className={`h-[5px] w-[5px] rounded-full flex-none ${i === 2 ? 'bg-[#5c5ef0]' : 'bg-current opacity-30'}`} />
              {item}
              {i === 0 && <span className="ml-auto text-[7px] px-1 rounded-full bg-[#ef4444]/[0.2] text-[#f87171] font-bold">4</span>}
            </div>
          ))}
          <div className="mt-3 px-2">
            <p className="text-[7.5px] font-bold uppercase tracking-[0.09em] text-[#2e2e42] px-1 mb-1">Projects</p>
            {[['Platform','from-[#5c5ef0] to-[#8b8df8]'],['Growth','from-[#22c55e] to-[#4ade80]']].map(([n,g]) => (
              <div key={n} className="flex items-center gap-1.5 h-[22px] px-1 rounded text-[8.5px] text-[#5a5a72]">
                <span className={`h-2.5 w-2.5 rounded-[3px] bg-gradient-to-br ${g} flex-none`} />
                {n}
              </div>
            ))}
          </div>
        </div>

        {/* Issue list */}
        <div className="flex flex-1 min-w-0 flex-col border-r border-white/[0.05] bg-[#0a0a10]">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.05]">
            <span className="text-[8.5px] text-[#2e2e42]">Platform /</span>
            <span className="text-[9px] font-semibold text-[#c8c8dc]">All Issues</span>
            <span className="text-[7.5px] font-mono bg-white/[0.05] border border-white/[0.08] px-1 py-px rounded text-[#2e2e42]">12</span>
          </div>
          <div className="flex gap-px px-2 py-1.5 border-b border-white/[0.04]">
            {['All','Todo','In Progress','Done'].map((t, i) => (
              <span key={t} className={`text-[8px] px-1.5 py-0.5 rounded-md font-medium ${i === 0 ? 'bg-[#5c5ef0]/[0.14] text-[#a5a7ff]' : 'text-[#5a5a72]'}`}>{t}</span>
            ))}
          </div>
          <div className="flex-1 overflow-hidden">
            {ORBIT_ISSUES.map((iss, i) => (
              <div key={iss.id} className={[
                'relative flex items-center gap-1.5 h-[38px] px-3 border-b border-white/[0.04]',
                i === 0 ? 'bg-[#5c5ef0]/[0.07]' : '',
              ].join(' ')}>
                <span className={`absolute left-0 top-2 bottom-2 w-[2.5px] rounded-r ${iss.bar}`} />
                <span className="text-[7.5px] font-mono text-[#2e2e42] w-[42px] flex-none">{iss.id}</span>
                <span className="text-[8.5px] text-[#9898b2] flex-1 truncate">{iss.title}</span>
                <span className={`text-[7px] font-semibold px-1.5 py-px rounded border ${iss.lc} flex-none`}>{iss.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel — animated Ghost Actions */}
        <div className="flex w-[148px] flex-none flex-col bg-[#07070d] p-2.5 gap-2 overflow-hidden">
          <div className="font-mono text-[8px] text-[#2e2e42]">ORB-001 · Sprint 14</div>
          <p className="text-[8.5px] font-semibold text-[#dddde8] leading-tight tracking-tight">GhostProvider falls back to empty state in Safari 17</p>

          {/* Ghost Actions card */}
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-2 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[7px] font-bold uppercase tracking-wide text-[#5a5a72]">Actions</span>
              <div className="flex items-center gap-1 rounded-full bg-[#5c5ef0]/[0.14] border border-[#5c5ef0]/[0.28] px-1.5 py-px">
                <span className={[
                  'h-[5px] w-[5px] rounded-full bg-[#8b8df8] transition-all duration-300',
                  phase === 'click' ? 'scale-125 opacity-100' : 'animate-[pulse_2s_ease-in-out_infinite]',
                ].join(' ')} />
                <span className="text-[6px] font-bold uppercase tracking-wide text-[#8b8df8]">Ghost AI</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {actions.map((a) => (
                <div
                  key={a}
                  style={{ transition: 'all 0.45s cubic-bezier(0.2,0.7,0.2,1)' }}
                  className={[
                    'h-[18px] px-1.5 rounded-md text-[7.5px] font-medium border',
                    phase !== 'idle' && a === 'Resolve'
                      ? 'bg-[#22c55e]/[0.12] border-[#22c55e]/[0.3] text-[#4ade80] scale-[1.05]'
                      : 'bg-white/[0.03] border-white/[0.07] text-[#5a5a72]',
                  ].join(' ')}
                >
                  {a}
                </div>
              ))}
            </div>
            {phase !== 'idle' && (
              <p className="text-[6.5px] text-[#8b8df8]/70 animate-[fadeIn_0.3s_ease]">
                {phase === 'click' ? '↑ Learning from click…' : '✓ Resolve promoted to #1'}
              </p>
            )}
          </div>

          <div className="mt-auto rounded-md bg-white/[0.02] border border-white/[0.05] p-1.5">
            <p className="text-[7px] font-bold uppercase tracking-wide text-[#2e2e42] mb-1">Activity</p>
            {['Maya moved → In Progress 3m', 'Alex set priority Urgent 1h', 'Sam opened issue 2d'].map(e => (
              <p key={e} className="text-[7px] text-[#5a5a72] py-px">{e}</p>
            ))}
          </div>
        </div>
      </div>
    </BrowserChrome>
  );
}

/* ─── Luxe preview ────────────────────────────────────────────────────────── */
const LUXE_CATS_INIT  = ['All', 'New In', 'Women', 'Men', 'Sale', 'Accessories'];
const LUXE_CATS_LEARN = ['Sale', 'All', 'New In', 'Women', 'Men', 'Accessories'];

const LUXE_PRODUCTS = [
  { name: 'Cashmere Coat',   price: '$890', tag: 'New', bg: 'bg-[#c8bfb0]' },
  { name: 'Silk Blouse',     price: '$340', tag: 'Sale', bg: 'bg-[#d4c8ba]' },
  { name: 'Linen Trousers',  price: '$265', tag: '',    bg: 'bg-[#bfb8ae]' },
  { name: 'Merino Sweater',  price: '$420', tag: 'New', bg: 'bg-[#ccc3b8]' },
  { name: 'Tailored Blazer', price: '$720', tag: '',    bg: 'bg-[#c2bbb3]' },
  { name: 'Wool Dress',      price: '$580', tag: 'Sale', bg: 'bg-[#d0c9c0]' },
];

function LuxePreview() {
  const [phase, setPhase] = useState<'idle' | 'click' | 'reordered'>('idle');

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const cycle = () => {
      setPhase('click');
      id = setTimeout(() => {
        setPhase('reordered');
        id = setTimeout(() => {
          setPhase('idle');
          id = setTimeout(cycle, 2800);
        }, 2200);
      }, 700);
    };
    id = setTimeout(cycle, 3600);
    return () => clearTimeout(id);
  }, []);

  const cats = phase === 'idle' ? LUXE_CATS_INIT : LUXE_CATS_LEARN;

  return (
    <BrowserChrome url="luxe-fashion.co">
      <div className="overflow-hidden bg-[#f8f5f0]" style={{ height: 296 }}>
        {/* Site header */}
        <div className="flex items-center justify-between border-b border-[rgba(26,23,20,0.09)] bg-white px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="font-serif text-[11px] font-semibold italic tracking-[0.12em] text-[#1a1714]" style={{ fontFamily: 'Georgia, serif' }}>LUXE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[7.5px] text-[#6e6560]">Search</span>
            <div className="relative flex h-[18px] w-[18px] items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M3.5 7h7M5 10.5h4" stroke="#1a1714" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </div>
            <div className="relative">
              <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M2.5 2.5l1 9h7l1-9" stroke="#1a1714" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 5.5c0 1.1.9 2 2 2s2-.9 2-2" stroke="#1a1714" strokeWidth="1.3" strokeLinecap="round"/></svg>
              <span className="absolute -top-px -right-px h-[7px] w-[7px] rounded-full bg-[#b5892a] text-[4.5px] font-bold text-white flex items-center justify-center">2</span>
            </div>
          </div>
        </div>

        {/* Category nav — animated Ghost.Slot */}
        <div className="relative border-b border-[rgba(26,23,20,0.09)] bg-white px-4">
          <div className="flex items-center gap-0 py-1.5">
            {cats.map((cat, i) => (
              <div
                key={cat}
                style={{ transition: 'all 0.45s cubic-bezier(0.2,0.7,0.2,1)' }}
                className={[
                  'relative px-2.5 py-1 text-[8.5px] font-medium whitespace-nowrap transition-colors',
                  cat === 'Sale' && phase !== 'idle'
                    ? 'text-[#b53a22] font-semibold'
                    : i === 0 && phase === 'idle' ? 'text-[#1a1714] font-semibold' : 'text-[#6e6560]',
                ].join(' ')}>
                {cat}
                {((cat === 'All' && phase === 'idle') || (cat === 'Sale' && phase !== 'idle')) && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1a1714] transition-all duration-300"
                    style={{ background: cat === 'Sale' ? '#b53a22' : '#1a1714' }}
                  />
                )}
              </div>
            ))}
          </div>
          {/* Ghost AI badge */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-full border border-[rgba(26,23,20,0.12)] bg-[rgba(26,23,20,0.04)] px-1.5 py-px">
            <span className={[
              'h-[5px] w-[5px] rounded-full bg-[#b5892a] transition-all duration-300',
              phase === 'click' ? 'scale-125' : 'animate-[pulse_2.5s_ease-in-out_infinite]',
            ].join(' ')} />
            <span className="text-[6px] font-bold uppercase tracking-wide text-[#b5892a]">Ghost AI</span>
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-3 gap-2 p-3 overflow-hidden" style={{ height: 220 }}>
          {LUXE_PRODUCTS.map((p) => (
            <div key={p.name} className="overflow-hidden rounded-lg bg-white border border-[rgba(26,23,20,0.07)] shadow-[0_1px_4px_rgba(26,23,20,0.06)]">
              <div className={`relative ${p.bg} flex items-center justify-center`} style={{ height: 80 }}>
                {p.tag && (
                  <span className={[
                    'absolute top-1 left-1 text-[6px] font-bold uppercase tracking-wide px-1 py-px rounded',
                    p.tag === 'Sale' ? 'bg-[#b53a22] text-white' : 'bg-[#1a1714] text-white',
                  ].join(' ')}>{p.tag}</span>
                )}
                <svg width="18" height="22" viewBox="0 0 18 22" fill="none" opacity="0.4">
                  <path d="M9 2C6.5 2 4.5 4 4.5 6.5V8H2l1.5 12h11L16 8h-2.5V6.5C13.5 4 11.5 2 9 2z" stroke="#1a1714" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="p-1.5">
                <p className="text-[7.5px] font-medium text-[#1a1714] leading-tight truncate">{p.name}</p>
                <p className="text-[7px] text-[#6e6560] mt-px">{p.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Overlay hint when reordering */}
        {phase !== 'idle' && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-[rgba(181,58,34,0.3)] bg-white px-2.5 py-1 shadow-sm" style={{ animation: 'fadeIn 0.3s ease' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#b53a22]" />
            <span className="text-[8px] font-medium text-[#b53a22]">
              {phase === 'click' ? 'Sale clicked…' : 'Sale promoted to #1'}
            </span>
          </div>
        )}
      </div>
    </BrowserChrome>
  );
}

/* ─── Feature pill row ────────────────────────────────────────────────────── */
const PILLARS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
    label: 'Same 3 primitives',
    body: 'GhostProvider + Ghost.Slot + Ghost.Button — identical API across every product type.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2.5 2"/>
      </svg>
    ),
    label: 'Zero configuration',
    body: 'No analytics dashboard. No A/B platform. No schema. Ghost infers intent purely from interactions.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M1 8h2M13 8h2M8 1v2M8 13v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="8" cy="8" r="2" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    label: 'Any product category',
    body: 'Dark SaaS. Warm editorial. Industrial B2B. The adaptive engine is product-agnostic by design.',
  },
];

/* ─── Main export ─────────────────────────────────────────────────────────── */
export function ShowcaseSection() {
  return (
    <section id="showcase" className="border-t border-line py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto max-w-(--container-site) px-[clamp(20px,4vw,32px)]">

        {/* Header */}
        <Reveal>
          <div className="mb-14 max-w-[720px]">
            <div className={SECTION_NUM}>05 / Built with Ghost UI</div>
            <h2 className={SECTION_TITLE}>
              From SaaS to storefront.{' '}
              <span className={ITALIC_ACCENT}>Same</span> API.
            </h2>
            <p className={SECTION_SUB}>
              Two production-grade demos — an issue tracker and a fashion store — both powered by Ghost&nbsp;UI&rsquo;s adaptive engine.
              Watch the layouts learn in real time as you interact. Drop in five lines of JSX; the UI does the rest.
            </p>
          </div>
        </Reveal>

        {/* Demo cards */}
        <Reveal delay={1}>
          <div className="grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">

            {/* Orbit card */}
            <div className="group flex flex-col gap-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))] transition-[border-color] duration-[240ms] hover:border-white/[0.14]">
              <div className="p-4 pb-0">
                <OrbitPreview />
              </div>
              <div className="flex items-end justify-between gap-4 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-4 rounded-[4px] bg-[#5c5ef0] shadow-[0_0_8px_rgba(92,94,240,0.5)]" />
                    <span className="text-[14px] font-semibold text-[#f4f4f7]">Orbit</span>
                    <span className="text-[10px] font-mono text-[#5a5a72] border border-white/[0.07] px-1.5 py-px rounded-md">Issue tracker</span>
                  </div>
                  <p className="text-[12.5px] text-[#9898b2] leading-snug">
                    Ghost.Slot reorders sidebar nav &amp; action buttons based on your workflow.
                    Urgent bugs surface themselves.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-none">
                  <div className="flex gap-1">
                    {['orbit.nav', 'orbit.actions'].map(z => (
                      <span key={z} className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-[#5c5ef0]/[0.12] text-[#8b8df8] border border-[#5c5ef0]/[0.2]">{z}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Luxe card */}
            <div className="group flex flex-col gap-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.008))] transition-[border-color] duration-[240ms] hover:border-white/[0.14]">
              <div className="p-4 pb-0">
                <LuxePreview />
              </div>
              <div className="flex items-end justify-between gap-4 px-5 py-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-4 w-4 rounded-[4px] bg-[#b5892a] shadow-[0_0_8px_rgba(181,137,42,0.5)]" />
                    <span className="text-[14px] font-semibold text-[#f4f4f7]">Luxe</span>
                    <span className="text-[10px] font-mono text-[#5a5a72] border border-white/[0.07] px-1.5 py-px rounded-md">Fashion store</span>
                  </div>
                  <p className="text-[12.5px] text-[#9898b2] leading-snug">
                    Ghost.Slot adapts category nav &amp; product actions per shopper.
                    Frequent categories float to front.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-none">
                  <div className="flex gap-1">
                    {['luxe.categories', 'luxe.product-actions'].map(z => (
                      <span key={z} className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-[#b5892a]/[0.12] text-[#d4a543] border border-[#b5892a]/[0.25]">{z}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Reveal>

        {/* Three pillars */}
        <Reveal delay={2}>
          <div className="mt-5 grid grid-cols-3 divide-x divide-line overflow-hidden rounded-2xl border border-line max-[640px]:grid-cols-1 max-[640px]:divide-x-0 max-[640px]:divide-y">
            {PILLARS.map(({ icon, label, body }) => (
              <div key={label} className="flex flex-col gap-3 bg-white/[0.018] px-6 py-5 transition-[background] duration-200 hover:bg-white/[0.03]">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-accent/[0.2] bg-[linear-gradient(180deg,rgba(196,181,253,0.14),rgba(196,181,253,0.04))] text-accent">
                  {icon}
                </div>
                <div>
                  <p className="mb-1 text-[13.5px] font-semibold tracking-[-0.01em] text-[#f4f4f7]">{label}</p>
                  <p className="text-[13px] leading-[1.55] text-[#8a8a98]">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

      </div>
    </section>
  );
}
