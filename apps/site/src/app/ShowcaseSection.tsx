'use client';

import { useEffect, useState } from 'react';
import { Reveal } from './Reveal';

type App = 'orbit' | 'luxe';

/* ─── Demo URLs (dev servers) ─────────────────────────────────────────────── */
const DEMO_URLS: Record<App, string> = {
  orbit: 'http://localhost:5174',
  luxe:  'http://localhost:5175',
};

/* ─── Score data ─────────────────────────────────────────────────────────── */
const ORBIT_SCORES: Record<'init' | 'learned', { label: string; score: number }[]> = {
  init: [
    { label: 'Comment', score: 0.71 },
    { label: 'Resolve', score: 0.38 },
    { label: 'Assign',  score: 0.26 },
    { label: 'Label',   score: 0.14 },
    { label: 'Archive', score: 0.08 },
  ],
  learned: [
    { label: 'Resolve', score: 0.88 },
    { label: 'Comment', score: 0.63 },
    { label: 'Assign',  score: 0.31 },
    { label: 'Label',   score: 0.18 },
    { label: 'Archive', score: 0.09 },
  ],
};

const LUXE_SCORES: Record<'init' | 'learned', { label: string; score: number }[]> = {
  init: [
    { label: 'All',    score: 0.76 },
    { label: 'New In', score: 0.52 },
    { label: 'Women',  score: 0.38 },
    { label: 'Sale',   score: 0.22 },
    { label: 'Men',    score: 0.15 },
  ],
  learned: [
    { label: 'Sale',   score: 0.91 },
    { label: 'All',    score: 0.67 },
    { label: 'New In', score: 0.44 },
    { label: 'Women',  score: 0.33 },
    { label: 'Men',    score: 0.17 },
  ],
};

const ORBIT_EVENTS = [
  { msg: 'Resolve promoted to #1',   time: 'just now', accent: true },
  { msg: 'Resolve clicked 6×',       time: '12s ago',  accent: false },
  { msg: 'Comment scored +0.12',     time: '38s ago',  accent: false },
];
const LUXE_EVENTS = [
  { msg: 'Sale promoted to #1',      time: 'just now', accent: true },
  { msg: 'Sale clicked 8×',          time: '9s ago',   accent: false },
  { msg: 'New In scored +0.09',      time: '41s ago',  accent: false },
];

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
      <span
        className="w-[56px] flex-none text-right font-mono text-[10.5px] tracking-tight transition-colors duration-500"
        style={{ color: isTop ? accent : '#5a5a68' }}
      >
        {label}
      </span>
      <div className="flex-1 h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-[700ms] ease-[cubic-bezier(0.2,0.7,0.2,1)]"
          style={{
            width: `${Math.round(score * 100)}%`,
            background: isTop ? accent : 'rgba(255,255,255,0.18)',
            transitionDelay: `${delay}ms`,
            boxShadow: isTop ? `0 0 8px ${accent}88` : 'none',
          }}
        />
      </div>
      <span
        className="w-6 flex-none text-right font-mono text-[10.5px] tabular-nums transition-colors duration-500"
        style={{ color: isTop ? accent : '#3a3a4a' }}
      >
        {Math.round(score * 100)}
      </span>
    </div>
  );
}

/* ─── Ghost Engine panel ─────────────────────────────────────────────────── */
function GhostEnginePanel({ zone, scores, events, accent, accentDim, accentBorder }: {
  zone: string;
  scores: { label: string; score: number }[];
  events: { msg: string; time: string; accent: boolean }[];
  accent: string;
  accentDim: string;
  accentBorder: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.005))]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-[7px] w-[7px] items-center justify-center rounded-full"
               style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}>
            <span className="absolute h-full w-full rounded-full animate-ping opacity-60"
                  style={{ background: accent }} />
          </div>
          <span className="text-[12px] font-semibold text-[#f4f4f7]">Ghost Engine</span>
          <span className="font-mono text-[10px] text-[#5a5a68]">· Live</span>
        </div>
        <span className="rounded-md border px-2 py-0.5 font-mono text-[9.5px]"
              style={{ background: accentDim, borderColor: accentBorder, color: accent }}>
          {zone}
        </span>
      </div>

      {/* Scores */}
      <div className="flex flex-col gap-3 border-b border-white/[0.05] px-5 py-5">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#3a3a4a]">Learned scores</p>
        <div className="flex flex-col gap-3">
          {scores.map((s, i) => (
            <ScoreBar key={s.label} label={s.label} score={s.score}
                      isTop={i === 0} accent={accent} delay={i * 60} />
          ))}
        </div>
      </div>

      {/* Events */}
      <div className="flex flex-col gap-0 px-5 py-4">
        <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#3a3a4a]">Recent events</p>
        <div className="flex flex-col gap-2.5">
          {events.map((ev, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-[3px] h-[5px] w-[5px] flex-none rounded-full transition-colors duration-500"
                    style={{ background: ev.accent ? accent : 'rgba(255,255,255,0.12)' }} />
              <span className="flex-1 text-[12px] leading-snug transition-colors duration-500"
                    style={{ color: ev.accent ? accent : '#8a8a98' }}>
                {ev.msg}
              </span>
              <span className="flex-none font-mono text-[10px] text-[#3a3a4a]">{ev.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Code hint */}
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
function ScreenshotPreview({ app, src, url }: { app: App; src: string; url: string }) {
  const isOrbit = app === 'orbit';

  return (
    /* browser chrome */
    <div className="overflow-hidden rounded-xl border border-white/[0.08] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.04)]">
      {/* chrome bar */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-4 py-[11px]"
           style={{ background: '#0d0d18' }}>
        <span className="h-[10px] w-[10px] rounded-full border border-black/[0.12]" style={{ background: '#ff5f57' }} />
        <span className="h-[10px] w-[10px] rounded-full border border-black/[0.12]" style={{ background: '#febc2e' }} />
        <span className="h-[10px] w-[10px] rounded-full border border-black/[0.12]" style={{ background: '#28c840' }} />
        <div className="mx-auto flex h-6 w-[48%] items-center justify-center gap-1.5 rounded-md border border-white/[0.07] px-3"
             style={{ background: 'rgba(255,255,255,0.04)' }}>
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" className="opacity-30 flex-none">
            <path d="M6 1v1M6 10v1M1 6h1M10 6h1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.1"/>
          </svg>
          <span className="font-mono text-[10px]" style={{ color: '#3a3a52' }}>
            {isOrbit ? 'orbit.app/cycles' : 'luxe-fashion.co'}
          </span>
        </div>
        <div className="w-[72px]" />
      </div>

      {/* screenshot — clickable, links to demo */}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="group relative block cursor-pointer overflow-hidden"
        style={{ height: 440 }}
        aria-label={`Open ${isOrbit ? 'Orbit' : 'Luxe'} live demo`}
      >
        <img
          src={src}
          alt={isOrbit ? 'Orbit issue tracker screenshot' : 'Luxe fashion store screenshot'}
          className="w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.03]"
          style={{ display: 'block', height: '100%' }}
          draggable={false}
        />

        {/* bottom fade — blends screenshot into card bg */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
          style={{
            background: isOrbit
              ? 'linear-gradient(to bottom, transparent, #07070a)'
              : 'linear-gradient(to bottom, transparent, #09090f)',
          }}
        />

        {/* hover CTA */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
             style={{ background: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(2px)' }}>
          <div className="flex items-center gap-2.5 rounded-full border border-white/[0.22] bg-white/[0.12] px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
               style={{ backdropFilter: 'blur(12px)' }}>
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

  /* auto-cycle: idle (2.8s) → learned (3.4s) → idle → … */
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

  const isOrbit = active === 'orbit';
  const scores  = isOrbit
    ? (learned ? ORBIT_SCORES.learned : ORBIT_SCORES.init)
    : (learned ? LUXE_SCORES.learned  : LUXE_SCORES.init);
  const events  = learned
    ? (isOrbit ? ORBIT_EVENTS : LUXE_EVENTS)
    : (isOrbit ? ORBIT_EVENTS : LUXE_EVENTS).map((e, i) => ({
        ...e, accent: false, time: ['1m ago', '4m ago', '18m ago'][i] ?? '—',
      }));

  const orbitAcc = { color: '#8b8df8', dim: 'rgba(92,94,240,0.10)',   border: 'rgba(92,94,240,0.28)' };
  const luxeAcc  = { color: '#c9a445', dim: 'rgba(181,137,42,0.10)',  border: 'rgba(181,137,42,0.28)' };
  const acc = isOrbit ? orbitAcc : luxeAcc;

  return (
    <section id="showcase" className="border-t border-line py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto max-w-(--container-site) px-[clamp(20px,4vw,32px)]">

        {/* Section header */}
        <Reveal>
          <div className="mb-12 max-w-[680px]">
            <div className={SECTION_NUM}>05 / Built with Ghost UI</div>
            <h2 className={SECTION_TITLE}>
              Two products.{' '}
              <span className={ITALIC_ACCENT}>One</span> API.
            </h2>
            <p className={SECTION_SUB}>
              A dark engineering tool and a warm editorial storefront — opposite aesthetics, identical integration.
              Watch the Ghost Engine score and promote in real time as interactions accumulate.
            </p>
          </div>
        </Reveal>

        {/* Tab switcher */}
        <Reveal delay={1}>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {([
              { id: 'orbit' as App, label: 'Orbit', sub: 'Issue tracker', dot: '#5c5ef0', glow: 'rgba(92,94,240,0.55)' },
              { id: 'luxe'  as App, label: 'Luxe',  sub: 'Fashion store', dot: '#b5892a', glow: 'rgba(181,137,42,0.55)' },
            ] as const).map(({ id, label, sub, dot, glow }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className="group relative flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300"
                style={{
                  border: `1px solid ${active === id ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}`,
                  background: active === id ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                }}
              >
                <span
                  className="h-2 w-2 rounded-full transition-all duration-300"
                  style={{ background: dot, boxShadow: active === id ? `0 0 8px ${glow}` : 'none', opacity: active === id ? 1 : 0.4 }}
                />
                <span className="text-[13.5px] font-medium"
                      style={{ color: active === id ? '#f4f4f7' : '#8a8a98' }}>
                  {label}
                </span>
                <span className="text-[11px]" style={{ color: active === id ? '#8a8a98' : '#5a5a68' }}>
                  {sub}
                </span>
                {active === id && (
                  <span
                    className="absolute bottom-0 left-4 right-4 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${dot}, transparent)` }}
                  />
                )}
              </button>
            ))}

            {/* Live learning status */}
            <div className="ml-auto flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-3.5 py-2">
              <span
                className="h-[6px] w-[6px] rounded-full transition-all duration-500"
                style={{
                  background: learned ? acc.color : 'rgba(255,255,255,0.18)',
                  boxShadow: learned ? `0 0 8px ${acc.color}` : 'none',
                }}
              />
              <span className="font-mono text-[11px] transition-colors duration-500"
                    style={{ color: learned ? acc.color : '#5a5a68' }}>
                {learned ? 'Layout updated' : 'Learning…'}
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
            />
            <GhostEnginePanel
              zone={isOrbit ? 'orbit.actions' : 'luxe.categories'}
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
                icon: (
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <rect x="10" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <rect x="1" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                  </svg>
                ),
              },
              {
                title: 'Zero configuration',
                body:  'No analytics pipeline. No A/B platform. No schema. Ghost reads intent from interaction events alone.',
                icon: (
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="3 2"/>
                    <path d="M8.5 5v4l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                title: 'Any product category',
                body:  'Dark SaaS. Warm editorial. Industrial B2B. The engine is product-agnostic — it adapts to any layout.',
                icon: (
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M2 8.5h13M8.5 2v13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    <path d="M3 5.5c1.5 1 3 1.5 5.5 1.5s4-.5 5.5-1.5M3 11.5c1.5-1 3-1.5 5.5-1.5s4 .5 5.5 1.5" stroke="currentColor" strokeWidth="1.1"/>
                  </svg>
                ),
              },
            ].map(({ title, body, icon }, i) => (
              <div
                key={title}
                className="flex flex-col gap-4 px-6 py-6 transition-colors duration-200 hover:bg-white/[0.025]"
                style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: 'rgba(255,255,255,0.018)' }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] text-accent transition-colors duration-200"
                       style={{ border: '1px solid rgba(196,181,253,0.2)', background: 'linear-gradient(180deg,rgba(196,181,253,0.14),rgba(196,181,253,0.04))' }}>
                    {icon}
                  </div>
                  <div>
                    <p className="mb-1 text-[13.5px] font-semibold tracking-[-0.01em]" style={{ color: '#f4f4f7' }}>{title}</p>
                    <p className="text-[13px] leading-[1.55]" style={{ color: '#8a8a98' }}>{body}</p>
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
