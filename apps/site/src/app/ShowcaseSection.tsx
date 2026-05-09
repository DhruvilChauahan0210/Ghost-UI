'use client';

import { useEffect, useState } from 'react';
import { Reveal } from './Reveal';

type App = 'orbit' | 'luxe' | 'studio' | 'apex';

/* ─── Demo URLs ───────────────────────────────────────────────────────────── */
const DEMO_URLS: Record<App, string> = {
  orbit:  'http://localhost:5174',
  luxe:   'http://localhost:5175',
  studio: 'http://localhost:5176',
  apex:   'http://localhost:5177',
};

/* ─── Tab config ─────────────────────────────────────────────────────────── */
const TABS = [
  { id: 'orbit'  as App, label: 'Orbit',  sub: 'Issue tracker',      dot: '#5c5ef0', glow: 'rgba(92,94,240,0.55)',   url: 'orbit.app/cycles'     },
  { id: 'luxe'   as App, label: 'Luxe',   sub: 'Fashion store',      dot: '#b5892a', glow: 'rgba(181,137,42,0.55)',  url: 'luxe-fashion.co'      },
  { id: 'studio' as App, label: 'Studio', sub: 'Content platform',   dot: '#06b6d4', glow: 'rgba(6,182,212,0.55)',   url: 'studio.app/dashboard' },
  { id: 'apex'   as App, label: 'Apex',   sub: 'Portfolio tracker',  dot: '#3d7fff', glow: 'rgba(61,127,255,0.55)',  url: 'apex.finance/portfolio'},
] as const;

/* ─── Score data ─────────────────────────────────────────────────────────── */
type ScoreSet = { label: string; score: number }[];
type AppScores = Record<'init' | 'learned', ScoreSet>;

const SCORES: Record<App, AppScores> = {
  orbit: {
    init:    [{ label:'Comment',score:0.71},{ label:'Resolve',score:0.38},{ label:'Assign',score:0.26},{ label:'Label',score:0.14},{ label:'Archive',score:0.08}],
    learned: [{ label:'Resolve',score:0.88},{ label:'Comment',score:0.63},{ label:'Assign',score:0.31},{ label:'Label',score:0.18},{ label:'Archive',score:0.09}],
  },
  luxe: {
    init:    [{ label:'All',   score:0.76},{ label:'New In',score:0.52},{ label:'Women',score:0.38},{ label:'Sale',score:0.22},{ label:'Men',score:0.15}],
    learned: [{ label:'Sale',  score:0.91},{ label:'All',   score:0.67},{ label:'New In',score:0.44},{ label:'Women',score:0.33},{ label:'Men',score:0.17}],
  },
  studio: {
    init:    [{ label:'Publish', score:0.72},{ label:'Schedule',score:0.44},{ label:'Draft',score:0.31},{ label:'Preview',score:0.18},{ label:'Discard',score:0.05}],
    learned: [{ label:'Schedule',score:0.85},{ label:'Publish', score:0.66},{ label:'Draft',score:0.28},{ label:'Preview',score:0.14},{ label:'Discard',score:0.05}],
  },
  apex: {
    init:    [{ label:'Transfer',score:0.68},{ label:'Invest',  score:0.45},{ label:'Deposit',score:0.30},{ label:'Withdraw',score:0.19},{ label:'Statement',score:0.09}],
    learned: [{ label:'Invest',  score:0.91},{ label:'Transfer',score:0.62},{ label:'Deposit',score:0.28},{ label:'Withdraw',score:0.15},{ label:'Statement',score:0.07}],
  },
};

type Event = { msg: string; time: string; accent: boolean };
const EVENTS_LEARNED: Record<App, Event[]> = {
  orbit:  [{ msg:'Resolve promoted to #1',  time:'just now',accent:true},{msg:'Resolve clicked 6×',   time:'12s ago',accent:false},{msg:'Comment scored +0.12', time:'38s ago',accent:false}],
  luxe:   [{ msg:'Sale promoted to #1',     time:'just now',accent:true},{msg:'Sale clicked 8×',      time:'9s ago', accent:false},{msg:'New In scored +0.09',  time:'41s ago',accent:false}],
  studio: [{ msg:'Schedule promoted to #1', time:'just now',accent:true},{msg:'Schedule clicked 7×',  time:'14s ago',accent:false},{msg:'Publish scored +0.08',  time:'36s ago',accent:false}],
  apex:   [{ msg:'Invest promoted to #1',   time:'just now',accent:true},{msg:'Invest clicked 9×',    time:'8s ago', accent:false},{msg:'Transfer scored +0.06', time:'44s ago',accent:false}],
};

/* ─── Accent palette ─────────────────────────────────────────────────────── */
const ACCENT: Record<App, { color: string; dim: string; border: string }> = {
  orbit:  { color:'#8b8df8', dim:'rgba(92,94,240,0.10)',   border:'rgba(92,94,240,0.28)'  },
  luxe:   { color:'#c9a445', dim:'rgba(181,137,42,0.10)',  border:'rgba(181,137,42,0.28)' },
  studio: { color:'#06b6d4', dim:'rgba(6,182,212,0.10)',   border:'rgba(6,182,212,0.28)'  },
  apex:   { color:'#3d7fff', dim:'rgba(61,127,255,0.10)',  border:'rgba(61,127,255,0.28)' },
};

/* ─── Zones ──────────────────────────────────────────────────────────────── */
const ZONES: Record<App, string> = {
  orbit:  'orbit.actions',
  luxe:   'luxe.categories',
  studio: 'studio.post-actions',
  apex:   'apex.actions',
};

/* ─── Shared tokens ───────────────────────────────────────────────────────── */
const SECTION_NUM   = "inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a8a98] before:h-px before:w-6 before:bg-white/[0.16] before:content-['']";
const SECTION_TITLE = "mt-[18px] mb-[18px] text-balance text-[clamp(36px,5.2vw,72px)] font-medium leading-[0.98] tracking-[-0.045em] text-[#f4f4f7]";
const SECTION_SUB   = "m-0 max-w-[58ch] text-[clamp(16px,1.4vw,18px)] leading-[1.55] tracking-[-0.005em] text-[#9c9caf]";
const ITALIC_ACCENT = "font-serif font-normal italic tracking-[-0.02em] text-[#d8d0ff] px-[0.04em]";

/* ─── Score bar ───────────────────────────────────────────────────────────── */
function ScoreBar({ label, score, isTop, accent, delay = 0 }: {
  label: string; score: number; isTop: boolean; accent: string; delay?: number;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-[60px] flex-none text-right font-mono text-[10.5px] tracking-tight transition-colors duration-500"
            style={{ color: isTop ? accent : '#5a5a68' }}>
        {label}
      </span>
      <div className="flex-1 h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-[700ms] ease-[cubic-bezier(0.2,0.7,0.2,1)]"
             style={{ width:`${Math.round(score*100)}%`, background:isTop?accent:'rgba(255,255,255,0.18)', transitionDelay:`${delay}ms`, boxShadow:isTop?`0 0 8px ${accent}88`:'none' }} />
      </div>
      <span className="w-6 flex-none text-right font-mono text-[10.5px] tabular-nums transition-colors duration-500"
            style={{ color: isTop ? accent : '#3a3a4a' }}>
        {Math.round(score*100)}
      </span>
    </div>
  );
}

/* ─── Ghost Engine panel ─────────────────────────────────────────────────── */
function GhostEnginePanel({ zone, scores, events, accent, accentDim, accentBorder }: {
  zone: string;
  scores: ScoreSet;
  events: Event[];
  accent: string;
  accentDim: string;
  accentBorder: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.005))]">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-[7px] w-[7px] items-center justify-center rounded-full"
               style={{ background:accent, boxShadow:`0 0 10px ${accent}` }}>
            <span className="absolute h-full w-full rounded-full animate-ping opacity-60" style={{ background:accent }} />
          </div>
          <span className="text-[12px] font-semibold text-[#f4f4f7]">Ghost Engine</span>
          <span className="font-mono text-[10px] text-[#5a5a68]">· Live</span>
        </div>
        <span className="rounded-md border px-2 py-0.5 font-mono text-[9.5px]"
              style={{ background:accentDim, borderColor:accentBorder, color:accent }}>
          {zone}
        </span>
      </div>

      <div className="flex flex-col gap-3 border-b border-white/[0.05] px-5 py-5">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#3a3a4a]">Learned scores</p>
        <div className="flex flex-col gap-3">
          {scores.map((s, i) => (
            <ScoreBar key={s.label} label={s.label} score={s.score} isTop={i===0} accent={accent} delay={i*60} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-0 px-5 py-4">
        <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#3a3a4a]">Recent events</p>
        <div className="flex flex-col gap-2.5">
          {events.map((ev, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-[3px] h-[5px] w-[5px] flex-none rounded-full transition-colors duration-500"
                    style={{ background:ev.accent?accent:'rgba(255,255,255,0.12)' }} />
              <span className="flex-1 text-[12px] leading-snug transition-colors duration-500"
                    style={{ color:ev.accent?accent:'#8a8a98' }}>
                {ev.msg}
              </span>
              <span className="flex-none font-mono text-[10px] text-[#3a3a4a]">{ev.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-white/[0.05] bg-white/[0.015] px-5 py-4">
        <p className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#3a3a4a]">Integration</p>
        <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.025] p-3">
          <pre className="m-0 font-mono text-[10.5px] leading-[1.7]">
            <span className="text-[#c4b5fd]">{'<Ghost.Slot '}</span>
            <span className="text-[#f59e0b]">zone</span>
            <span className="text-[#8a8a98]">{'='}</span>
            <span className="text-[#6ee7b7]">{`"${zone}"`}</span>
            <span className="text-[#c4b5fd]">{'>'}</span>
            {'\n'}
            <span className="text-[#5a5a68]">{'  {items.map(i => ('}</span>
            {'\n'}
            <span className="text-[#c4b5fd]">{'    <Ghost.Button'}</span>
            {'\n'}
            <span className="text-[#f59e0b]">{'      id'}</span>
            <span className="text-[#8a8a98]">{'='}</span>
            <span className="text-[#6ee7b7]">{'{i.id}'}</span>
            {'\n'}
            <span className="text-[#f59e0b]">{'      zone'}</span>
            <span className="text-[#8a8a98]">{'='}</span>
            <span className="text-[#6ee7b7]">{`"${zone}"`}</span>
            {'\n'}
            <span className="text-[#5a5a68]">{'    />'}</span>
            {'\n'}
            <span className="text-[#5a5a68]">{'  ))}'}</span>
            {'\n'}
            <span className="text-[#c4b5fd]">{'</Ghost.Slot>'}</span>
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ─── Screenshot preview card ────────────────────────────────────────────── */
function ScreenshotPreview({ app, src, url, fakeUrl }: { app: App; src: string; url: string; fakeUrl: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08]">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-4 py-[11px]"
           style={{ background: '#0d0d18' }}>
        <span className="h-[10px] w-[10px] rounded-full border border-black/[0.12]" style={{ background:'#ff5f57' }} />
        <span className="h-[10px] w-[10px] rounded-full border border-black/[0.12]" style={{ background:'#febc2e' }} />
        <span className="h-[10px] w-[10px] rounded-full border border-black/[0.12]" style={{ background:'#28c840' }} />
        <div className="mx-auto flex h-6 w-[48%] items-center justify-center gap-1.5 rounded-md border border-white/[0.07] px-3"
             style={{ background:'rgba(255,255,255,0.04)' }}>
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" className="opacity-30 flex-none">
            <path d="M6 1v1M6 10v1M1 6h1M10 6h1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.1"/>
          </svg>
          <span className="font-mono text-[10px]" style={{ color:'#3a3a52' }}>{fakeUrl}</span>
        </div>
        <div className="w-[72px]" />
      </div>

      {/* Screenshot — clickable */}
      <a href={url} target="_blank" rel="noreferrer"
         className="group relative block cursor-pointer overflow-hidden"
         style={{ aspectRatio:'1440/900' }}
         aria-label={`Open ${app} live demo`}>
        <img src={src} alt={`${app} screenshot`}
             className="w-full h-full object-cover object-top block transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.03]"
             draggable={false} />
        {/* Hover CTA */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
             style={{ background:'rgba(0,0,0,0.38)', backdropFilter:'blur(2px)' }}>
          <div className="flex items-center gap-2.5 rounded-full border border-white/[0.22] bg-white/[0.12] px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
               style={{ backdropFilter:'blur(12px)' }}>
            <span className="text-[13.5px] font-medium text-white">Open live demo</span>
            <span className="text-white/80 transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
          </div>
        </div>
      </a>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────────────────── */
export function ShowcaseSection() {
  const [active, setActive] = useState<App>('orbit');
  const [learned, setLearned] = useState(false);

  useEffect(() => {
    setLearned(false);
    const a = setTimeout(() => setLearned(true), 2800);
    return () => clearTimeout(a);
  }, [active]);

  useEffect(() => {
    if (!learned) return;
    const b = setTimeout(() => setLearned(false), 3400);
    return () => clearTimeout(b);
  }, [learned]);

  const scores = learned ? SCORES[active].learned : SCORES[active].init;
  const events = learned
    ? EVENTS_LEARNED[active]
    : EVENTS_LEARNED[active].map((e, i) => ({ ...e, accent:false, time:['1m ago','4m ago','18m ago'][i]??'—' }));
  const acc = ACCENT[active];
  const tab = TABS.find(t => t.id === active)!;

  return (
    <section id="showcase" className="border-t border-line py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto max-w-(--container-site) px-[clamp(20px,4vw,32px)]">

        {/* Header */}
        <Reveal>
          <div className="mb-12 max-w-[680px]">
            <div className={SECTION_NUM}>05 / Built with Ghost UI</div>
            <h2 className={SECTION_TITLE}>
              Four products.{' '}
              <span className={ITALIC_ACCENT}>One</span> API.
            </h2>
            <p className={SECTION_SUB}>
              A SaaS tracker, fashion storefront, content platform, and finance dashboard — opposite aesthetics, identical integration.
              Watch the Ghost Engine score and promote in real time as interactions accumulate.
            </p>
          </div>
        </Reveal>

        {/* Tab switcher */}
        <Reveal delay={1}>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {TABS.map(({ id, label, sub, dot, glow }) => (
              <button key={id} onClick={() => setActive(id)}
                className="group relative flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300"
                style={{
                  border:`1px solid ${active===id?'rgba(255,255,255,0.14)':'rgba(255,255,255,0.06)'}`,
                  background: active===id?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.02)',
                }}>
                <span className="h-2 w-2 rounded-full transition-all duration-300"
                      style={{ background:dot, boxShadow:active===id?`0 0 8px ${glow}`:'none', opacity:active===id?1:0.4 }} />
                <span className="text-[13.5px] font-medium" style={{ color:active===id?'#f4f4f7':'#8a8a98' }}>{label}</span>
                <span className="text-[11px]" style={{ color:active===id?'#8a8a98':'#5a5a68' }}>{sub}</span>
                {active===id && (
                  <span className="absolute bottom-0 left-4 right-4 h-px"
                        style={{ background:`linear-gradient(90deg,transparent,${dot},transparent)` }} />
                )}
              </button>
            ))}

            {/* Live status */}
            <div className="ml-auto flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-3.5 py-2">
              <span className="h-[6px] w-[6px] rounded-full transition-all duration-500"
                    style={{ background:learned?acc.color:'rgba(255,255,255,0.18)', boxShadow:learned?`0 0 8px ${acc.color}`:'none' }} />
              <span className="font-mono text-[11px] transition-colors duration-500"
                    style={{ color:learned?acc.color:'#5a5a68' }}>
                {learned?'Layout updated':'Learning…'}
              </span>
            </div>
          </div>
        </Reveal>

        {/* Screenshot + Engine panel */}
        <Reveal delay={2}>
          <div className="grid grid-cols-[1fr_320px] gap-4 max-[900px]:grid-cols-1">
            <ScreenshotPreview
              app={active}
              src={`/screenshots/${active}.png`}
              url={DEMO_URLS[active]}
              fakeUrl={tab.url}
            />
            <GhostEnginePanel
              zone={ZONES[active]}
              scores={scores}
              events={events}
              accent={acc.color}
              accentDim={acc.dim}
              accentBorder={acc.border}
            />
          </div>
        </Reveal>

        {/* Three pillars */}
        <Reveal delay={3}>
          <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/[0.06] max-[640px]:grid-cols-1">
            {[
              {
                title: 'Same 3 primitives',
                body:  'GhostProvider + Ghost.Slot + Ghost.Button — the complete API, across every product type and aesthetic.',
                icon: (<svg width="17" height="17" viewBox="0 0 17 17" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="10" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="1" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/></svg>),
              },
              {
                title: 'Zero configuration',
                body:  'No analytics pipeline. No A/B platform. No schema. Ghost reads intent from interaction events alone.',
                icon: (<svg width="17" height="17" viewBox="0 0 17 17" fill="none"><circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="3 2"/><path d="M8.5 5v4l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
              },
              {
                title: 'Any product category',
                body:  'Dark SaaS. Warm editorial. Industrial B2B. The engine is product-agnostic — it adapts to any layout.',
                icon: (<svg width="17" height="17" viewBox="0 0 17 17" fill="none"><circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.3"/><path d="M2 8.5h13M8.5 2v13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M3 5.5c1.5 1 3 1.5 5.5 1.5s4-.5 5.5-1.5M3 11.5c1.5-1 3-1.5 5.5-1.5s4 .5 5.5 1.5" stroke="currentColor" strokeWidth="1.1"/></svg>),
              },
            ].map(({ title, body, icon }, i) => (
              <div key={title}
                className="flex flex-col gap-4 px-6 py-6 transition-colors duration-200 hover:bg-white/[0.025]"
                style={{ borderRight:i<2?'1px solid rgba(255,255,255,0.06)':'none', background:'rgba(255,255,255,0.018)' }}>
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] text-accent transition-colors duration-200"
                       style={{ border:'1px solid rgba(196,181,253,0.2)', background:'linear-gradient(180deg,rgba(196,181,253,0.14),rgba(196,181,253,0.04))' }}>
                    {icon}
                  </div>
                  <div>
                    <p className="mb-1 text-[13.5px] font-semibold tracking-[-0.01em]" style={{ color:'#f4f4f7' }}>{title}</p>
                    <p className="text-[13px] leading-[1.55]" style={{ color:'#8a8a98' }}>{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

      </div>
    </section>
  );
}
