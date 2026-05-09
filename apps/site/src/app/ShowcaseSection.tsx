'use client';

import { useEffect, useState } from 'react';
import { Reveal } from './Reveal';

type App = 'orbit' | 'luxe';

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
    { label: 'All',     score: 0.76 },
    { label: 'New In',  score: 0.52 },
    { label: 'Women',   score: 0.38 },
    { label: 'Sale',    score: 0.22 },
    { label: 'Men',     score: 0.15 },
  ],
  learned: [
    { label: 'Sale',    score: 0.91 },
    { label: 'All',     score: 0.67 },
    { label: 'New In',  score: 0.44 },
    { label: 'Women',   score: 0.33 },
    { label: 'Men',     score: 0.17 },
  ],
};

const ORBIT_EVENTS = [
  { msg: 'Resolve promoted to #1',     time: 'just now',  accent: true },
  { msg: 'Resolve clicked 6×',         time: '12s ago',   accent: false },
  { msg: 'Comment scored +0.12',       time: '38s ago',   accent: false },
];
const LUXE_EVENTS = [
  { msg: 'Sale promoted to #1',        time: 'just now',  accent: true },
  { msg: 'Sale clicked 8×',            time: '9s ago',    accent: false },
  { msg: 'New In scored +0.09',        time: '41s ago',   accent: false },
];

/* ─── Shared design tokens (matching page.tsx) ────────────────────────────── */
const SECTION_NUM   = "inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a8a98] before:h-px before:w-6 before:bg-white/[0.16] before:content-['']";
const SECTION_TITLE = "mt-[18px] mb-[18px] text-balance text-[clamp(36px,5.2vw,72px)] font-medium leading-[0.98] tracking-[-0.045em] text-[#f4f4f7]";
const SECTION_SUB   = "m-0 max-w-[58ch] text-[clamp(16px,1.4vw,18px)] leading-[1.55] tracking-[-0.005em] text-[#9c9caf]";
const ITALIC_ACCENT = "font-serif font-normal italic tracking-[-0.02em] text-[#d8d0ff] px-[0.04em]";

/* ─── Score bar ───────────────────────────────────────────────────────────── */
function ScoreBar({
  label, score, isTop, accent, delay = 0,
}: { label: string; score: number; isTop: boolean; accent: string; delay?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="w-[58px] flex-none text-right font-mono text-[10.5px] tracking-tight transition-colors duration-500"
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
        className="w-7 flex-none text-right font-mono text-[10.5px] tabular-nums transition-colors duration-500"
        style={{ color: isTop ? accent : '#3a3a4a' }}
      >
        {Math.round(score * 100)}
      </span>
    </div>
  );
}

/* ─── Ghost Engine panel ─────────────────────────────────────────────────── */
function GhostEnginePanel({
  zone, scores, events, accent, accentDim, accentBorder,
}: {
  zone: string;
  scores: { label: string; score: number }[];
  events: { msg: string; time: string; accent: boolean }[];
  accent: string;
  accentDim: string;
  accentBorder: string;
}) {
  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.005))]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
        <div className="flex items-center gap-2">
          <div
            className="relative flex h-[7px] w-[7px] items-center justify-center rounded-full"
            style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
          >
            <span
              className="absolute h-full w-full rounded-full animate-ping opacity-75"
              style={{ background: accent }}
            />
          </div>
          <span className="text-[12px] font-semibold text-[#f4f4f7]">Ghost Engine</span>
          <span className="font-mono text-[10px] text-[#5a5a68]">· Live</span>
        </div>
        <span
          className="rounded-md border px-2 py-0.5 font-mono text-[9.5px]"
          style={{ background: accentDim, borderColor: accentBorder, color: accent }}
        >
          {zone}
        </span>
      </div>

      {/* Scores */}
      <div className="flex flex-col gap-3 px-5 py-5 border-b border-white/[0.05]">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#3a3a4a]">Learned scores</p>
        <div className="flex flex-col gap-3">
          {scores.map((s, i) => (
            <ScoreBar
              key={s.label}
              label={s.label}
              score={s.score}
              isTop={i === 0}
              accent={accent}
              delay={i * 60}
            />
          ))}
        </div>
      </div>

      {/* Events log */}
      <div className="flex flex-col gap-0 px-5 py-4">
        <p className="mb-3 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#3a3a4a]">Recent events</p>
        <div className="flex flex-col gap-2.5">
          {events.map((ev, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="mt-[3px] h-[5px] w-[5px] flex-none rounded-full"
                style={{ background: ev.accent ? accent : 'rgba(255,255,255,0.12)' }}
              />
              <div className="flex-1 min-w-0">
                <span
                  className="text-[12px] leading-snug"
                  style={{ color: ev.accent ? accent : '#8a8a98' }}
                >
                  {ev.msg}
                </span>
              </div>
              <span className="flex-none font-mono text-[10px] text-[#3a3a4a]">{ev.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Code hint */}
      <div className="mt-auto border-t border-white/[0.05] bg-white/[0.015] px-5 py-4">
        <p className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#3a3a4a]">Integration</p>
        <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.025] p-3">
          <pre className="font-mono text-[10.5px] leading-[1.7] text-[#8a8a98]">
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

/* ─── Orbit preview ───────────────────────────────────────────────────────── */
const ORBIT_ISSUES = [
  { id: 'ORB-001', title: 'GhostProvider fallback in Safari 17',     bar: '#ef4444', label: 'Bug',      lBg: 'rgba(239,68,68,0.08)',    lBor: 'rgba(239,68,68,0.25)',   lTx: '#f87171' },
  { id: 'ORB-002', title: 'Memory leak on provider unmount',         bar: '#f97316', label: 'Perf',     lBg: 'rgba(249,115,22,0.08)',   lBor: 'rgba(249,115,22,0.25)',  lTx: '#fb923c' },
  { id: 'ORB-004', title: 'Command palette ⌘K with Ghost scores',   bar: '#5c5ef0', label: 'Feature',  lBg: 'rgba(92,94,240,0.10)',    lBor: 'rgba(92,94,240,0.28)',   lTx: '#8b8df8' },
  { id: 'ORB-007', title: 'Score decay too aggressive after 4h',    bar: '#ef4444', label: 'Ghost UI', lBg: 'rgba(139,92,246,0.08)',   lBor: 'rgba(139,92,246,0.25)', lTx: '#a78bfa' },
  { id: 'ORB-010', title: 'Devtools — sparkline per node',           bar: '#5c5ef0', label: 'Devtools', lBg: 'rgba(56,189,248,0.08)',   lBor: 'rgba(56,189,248,0.25)',  lTx: '#7dd3fc' },
];

function OrbitPreview({ learned }: { learned: boolean }) {
  const actions = learned
    ? ['Resolve', 'Comment', 'Assign', 'Label', 'Archive', 'Close']
    : ['Comment', 'Assign', 'Resolve', 'Label', 'Archive', 'Close'];

  return (
    <div className="flex overflow-hidden" style={{ height: 380, background: '#07070d' }}>
      {/* Sidebar */}
      <div className="flex w-[108px] flex-none flex-col border-r py-2" style={{ background: '#09090f', borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="mb-2 flex items-center gap-1.5 px-2.5">
          <div className="h-[15px] w-[15px] flex-none rounded-[4px] flex items-center justify-center" style={{ background: '#5c5ef0', boxShadow: '0 0 10px rgba(92,94,240,0.55)' }}>
            <svg width="9" height="9" viewBox="0 0 14 14" fill="none">
              <ellipse cx="7" cy="7" rx="5.5" ry="3" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" transform="rotate(-35 7 7)"/>
              <circle cx="7" cy="7" r="1.6" fill="rgba(255,255,255,0.95)"/>
            </svg>
          </div>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: '#c8c8dc', letterSpacing: '-0.01em' }}>Orbit</span>
          <span className="ml-auto" style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.06em', padding: '1px 4px', borderRadius: 4, background: 'rgba(92,94,240,0.15)', color: '#8b8df8', border: '1px solid rgba(92,94,240,0.28)' }}>PRO</span>
        </div>
        {[
          { label: 'Inbox', active: false, badge: 4 },
          { label: 'My Issues', active: false },
          { label: 'All Issues', active: true },
          { label: 'Cycles', active: false },
          { label: 'Roadmap', active: false },
          { label: 'Backlog', active: false },
        ].map((item) => (
          <div
            key={item.label}
            className="relative mx-1 flex items-center gap-1.5 rounded-lg"
            style={{
              height: 26, padding: '0 8px',
              background: item.active ? 'rgba(92,94,240,0.14)' : 'transparent',
              fontSize: 9, fontWeight: 500,
              color: item.active ? '#a5a7ff' : '#5a5a72',
            }}
          >
            {item.active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-3 w-[2px] rounded-r" style={{ background: '#5c5ef0' }} />}
            <span className="h-[5px] w-[5px] rounded-full flex-none" style={{ background: item.active ? '#5c5ef0' : 'currentColor', opacity: item.active ? 1 : 0.3 }} />
            {item.label}
            {item.badge && (
              <span className="ml-auto" style={{ fontSize: 7, padding: '1px 4px', borderRadius: 99, background: 'rgba(239,68,68,0.2)', color: '#f87171', fontWeight: 700 }}>{item.badge}</span>
            )}
          </div>
        ))}
        <div className="mx-2 mt-3 border-t pt-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.09em', color: '#2e2e42', padding: '0 4px', marginBottom: 4 }}>PROJECTS</div>
          {[['Platform', 'linear-gradient(135deg,#5c5ef0,#8b8df8)'],['Growth','linear-gradient(135deg,#22c55e,#4ade80)']].map(([n, g]) => (
            <div key={n} className="flex items-center gap-1.5 rounded-md" style={{ height: 24, padding: '0 6px', fontSize: 9, color: '#5a5a72' }}>
              <span className="h-[11px] w-[11px] flex-none rounded-[3px]" style={{ background: g }} />
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* Issue list */}
      <div className="flex flex-1 min-w-0 flex-col border-r" style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#0a0a10' }}>
        <div className="flex items-center gap-1.5 border-b px-3 py-2" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <span style={{ fontSize: 8.5, color: '#2e2e42' }}>Platform /</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: '#c8c8dc' }}>All Issues</span>
          <span style={{ fontSize: 7.5, fontFamily: 'monospace', padding: '1px 5px', borderRadius: 5, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#2e2e42' }}>12</span>
          <div className="ml-auto flex items-center gap-1">
            <span style={{ fontSize: 8.5, padding: '2px 7px', borderRadius: 6, background: 'rgba(92,94,240,0.14)', color: '#8b8df8', fontWeight: 600 }}>+ New</span>
          </div>
        </div>
        <div className="flex gap-px border-b px-2 py-1.5" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          {['All','Todo','In Progress','Done'].map((t, i) => (
            <span key={t} style={{ fontSize: 8, padding: '2px 7px', borderRadius: 6, fontWeight: 500, background: i === 0 ? 'rgba(92,94,240,0.14)' : 'transparent', color: i === 0 ? '#a5a7ff' : '#5a5a72' }}>{t}</span>
          ))}
        </div>
        <div className="flex-1 overflow-hidden">
          {ORBIT_ISSUES.map((iss, i) => (
            <div
              key={iss.id}
              className="relative flex items-center gap-1.5 border-b px-3"
              style={{ height: 38, borderColor: 'rgba(255,255,255,0.04)', background: i === 0 ? 'rgba(92,94,240,0.07)' : 'transparent' }}
            >
              <span className="absolute left-0 bottom-2 top-2 w-[2.5px] rounded-r" style={{ background: iss.bar }} />
              <span style={{ fontSize: 7.5, fontFamily: 'monospace', color: '#2e2e42', width: 40, flexShrink: 0 }}>{iss.id}</span>
              <span style={{ fontSize: 8.5, color: '#9898b2', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{iss.title}</span>
              <span style={{ fontSize: 7, fontWeight: 600, padding: '2px 5px', borderRadius: 4, background: iss.lBg, border: `1px solid ${iss.lBor}`, color: iss.lTx, flexShrink: 0 }}>{iss.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail — Ghost Actions */}
      <div className="flex w-[152px] flex-none flex-col overflow-hidden p-3 gap-2.5">
        <div style={{ fontSize: 8, fontFamily: 'monospace', color: '#2e2e42' }}>ORB-001 · Sprint 14</div>
        <p style={{ fontSize: 8.5, fontWeight: 600, color: '#dddde8', lineHeight: 1.4, letterSpacing: '-0.01em' }}>GhostProvider falls back to empty state in Safari 17</p>

        {/* Ghost zone — highlighted */}
        <div
          className="rounded-xl p-2.5 flex flex-col gap-2"
          style={{ border: '1px solid rgba(92,94,240,0.35)', background: 'rgba(92,94,240,0.06)', boxShadow: '0 0 20px rgba(92,94,240,0.12)' }}
        >
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5a5a72' }}>Actions</span>
            <div className="flex items-center gap-1 rounded-full px-1.5 py-[2px]" style={{ background: 'rgba(92,94,240,0.14)', border: '1px solid rgba(92,94,240,0.3)' }}>
              <span className="h-[5px] w-[5px] rounded-full animate-ping" style={{ background: '#8b8df8' }} />
              <span style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8b8df8' }}>Ghost AI</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {actions.slice(0, 4).map((a) => (
              <div
                key={a}
                className="transition-all duration-500"
                style={{
                  height: 19, padding: '0 6px', borderRadius: 6, fontSize: 7.5, fontWeight: 500,
                  border: `1px solid ${learned && a === 'Resolve' ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  background: learned && a === 'Resolve' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)',
                  color: learned && a === 'Resolve' ? '#4ade80' : '#5a5a72',
                  display: 'flex', alignItems: 'center',
                }}
              >
                {a}
              </div>
            ))}
          </div>
          <div className="rounded-md px-2 py-1" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', fontSize: 7 }}>
            <span style={{ color: '#5c5ef0', fontFamily: 'monospace' }}>zone=</span>
            <span style={{ color: '#6ee7b7', fontFamily: 'monospace' }}>"orbit.actions"</span>
          </div>
        </div>

        <div className="mt-auto rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2e2e42', marginBottom: 6 }}>Activity</div>
          {['Maya moved → In Progress', 'Alex set priority Urgent', 'Sam opened 2d ago'].map(e => (
            <div key={e} style={{ fontSize: 7, color: '#5a5a72', padding: '2px 0' }}>{e}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Luxe preview ────────────────────────────────────────────────────────── */
const LUXE_PRODUCTS = [
  { name: 'Cashmere Coat',   price: '$890', tag: 'New', bg: '#cdc5bb' },
  { name: 'Silk Blouse',     price: '$340', tag: 'Sale', bg: '#d4c8bb' },
  { name: 'Linen Trousers',  price: '$265', tag: '',    bg: '#c5bdb4' },
  { name: 'Merino Sweater',  price: '$420', tag: 'New', bg: '#ccc3ba' },
  { name: 'Tailored Blazer', price: '$720', tag: '',    bg: '#c3bcb4' },
  { name: 'Wool Dress',      price: '$580', tag: 'Sale', bg: '#cfcac2' },
];

function LuxePreview({ learned }: { learned: boolean }) {
  const cats = learned
    ? ['Sale', 'All', 'New In', 'Women', 'Men', 'Accessories']
    : ['All', 'New In', 'Women', 'Men', 'Sale', 'Accessories'];

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: 380, background: '#f8f5f0' }}>
      {/* Header */}
      <div className="flex flex-none items-center justify-between border-b px-4 py-2.5" style={{ borderColor: 'rgba(26,23,20,0.09)', background: 'white' }}>
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: '#1a1714', fontStyle: 'italic' }}>LUXE</span>
          <div className="h-3 w-px" style={{ background: 'rgba(26,23,20,0.12)' }} />
          <span style={{ fontSize: 8.5, color: '#6e6560' }}>New Season Arrivals</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 8, color: '#6e6560' }}>Search</span>
          <div className="relative flex h-5 w-5 items-center justify-center rounded-full" style={{ background: 'rgba(26,23,20,0.04)' }}>
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M2.5 2.5l1 9h7l1-9" stroke="#1a1714" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 5.5c0 1.1.9 2 2 2s2-.9 2-2" stroke="#1a1714" strokeWidth="1.3" strokeLinecap="round"/></svg>
            <span className="absolute -top-px -right-px flex h-[8px] w-[8px] items-center justify-center rounded-full text-[5px] font-bold text-white" style={{ background: '#b5892a' }}>2</span>
          </div>
        </div>
      </div>

      {/* Category nav — Ghost zone */}
      <div
        className="relative flex flex-none items-center border-b"
        style={{ borderColor: 'rgba(26,23,20,0.09)', background: 'white', padding: '0 16px', boxShadow: '0 0 18px rgba(181,137,42,0.10)' }}
      >
        <div className="flex items-center">
          {cats.map((cat, i) => (
            <div
              key={cat}
              className="relative transition-all duration-500"
              style={{ padding: '8px 10px', fontSize: 8.5, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? (learned && cat === 'Sale' ? '#b53a22' : '#1a1714') : '#6e6560', cursor: 'pointer' }}
            >
              {cat}
              {i === 0 && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-500"
                  style={{ background: learned ? '#b53a22' : '#1a1714' }}
                />
              )}
            </div>
          ))}
        </div>
        {/* Ghost zone badge */}
        <div
          className="absolute right-3 flex items-center gap-1 rounded-full px-2 py-[3px]"
          style={{ border: '1px solid rgba(181,137,42,0.35)', background: 'rgba(181,137,42,0.08)', boxShadow: '0 0 12px rgba(181,137,42,0.15)' }}
        >
          <span className="h-[5px] w-[5px] rounded-full animate-pulse" style={{ background: '#b5892a' }} />
          <span style={{ fontSize: 6.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#b5892a' }}>Ghost AI</span>
        </div>
      </div>

      {/* Collection header */}
      <div className="flex-none px-4 pt-3 pb-2">
        <p style={{ fontSize: 8.5, color: '#6e6560', letterSpacing: '0.02em' }}>
          {learned ? 'SALE — Up to 40% off' : 'ALL — New Season'}
        </p>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-3 gap-2 overflow-hidden px-3 pb-3 flex-1">
        {LUXE_PRODUCTS.map((p) => (
          <div key={p.name} className="overflow-hidden rounded-lg" style={{ background: 'white', border: '1px solid rgba(26,23,20,0.08)', boxShadow: '0 1px 6px rgba(26,23,20,0.06)' }}>
            <div className="relative flex items-center justify-center" style={{ height: 90, background: p.bg }}>
              {p.tag && (
                <span
                  className="absolute top-1.5 left-1.5"
                  style={{ fontSize: 6, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', padding: '2px 5px', borderRadius: 3, background: p.tag === 'Sale' ? '#b53a22' : '#1a1714', color: 'white' }}
                >
                  {p.tag}
                </span>
              )}
              <svg width="16" height="20" viewBox="0 0 18 22" fill="none" opacity="0.35">
                <path d="M9 2C6.5 2 4.5 4 4.5 6.5V8H2l1.5 12h11L16 8h-2.5V6.5C13.5 4 11.5 2 9 2z" stroke="#1a1714" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ padding: '7px 8px' }}>
              <p style={{ fontSize: 7.5, fontWeight: 500, color: '#1a1714', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
              <p style={{ fontSize: 7, color: '#6e6560', marginTop: 2 }}>{p.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Browser chrome ────────────────────────────────────────────────────────*/
function BrowserChrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.07] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-4 py-[11px]" style={{ background: '#0d0d18' }}>
        <span className="h-[10px] w-[10px] rounded-full border border-black/[0.12]" style={{ background: '#ff5f57' }} />
        <span className="h-[10px] w-[10px] rounded-full border border-black/[0.12]" style={{ background: '#febc2e' }} />
        <span className="h-[10px] w-[10px] rounded-full border border-black/[0.12]" style={{ background: '#28c840' }} />
        <div className="mx-auto flex h-6 w-[48%] items-center justify-center rounded-md border border-white/[0.07] px-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" className="mr-1.5 opacity-30"><path d="M10 6a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM6 1v1M6 10v1M1 6h1M10 6h1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
          <span className="font-mono text-[10px]" style={{ color: '#3a3a52' }}>{url}</span>
        </div>
        <div className="w-[72px]" />
      </div>
      {children}
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────────────────── */
export function ShowcaseSection() {
  const [active, setActive] = useState<App>('orbit');
  const [learned, setLearned] = useState(false);

  useEffect(() => {
    setLearned(false);
    const id = setTimeout(() => setLearned(true), 2800);
    return () => clearTimeout(id);
  }, [active]);

  useEffect(() => {
    if (!learned) return;
    const id = setTimeout(() => setLearned(false), 3400);
    return () => clearTimeout(id);
  }, [learned]);

  const isOrbit = active === 'orbit';
  const scores  = isOrbit
    ? (learned ? ORBIT_SCORES.learned : ORBIT_SCORES.init)
    : (learned ? LUXE_SCORES.learned  : LUXE_SCORES.init);
  const events = learned
    ? (isOrbit ? ORBIT_EVENTS : LUXE_EVENTS)
    : (isOrbit ? ORBIT_EVENTS : LUXE_EVENTS).map((e, i) => ({ ...e, accent: false, time: i === 0 ? '1m ago' : i === 1 ? '4m ago' : '18m ago' }));

  const orbitAccent = { color: '#8b8df8', dim: 'rgba(92,94,240,0.10)', border: 'rgba(92,94,240,0.28)' };
  const luxeAccent  = { color: '#c9a445', dim: 'rgba(181,137,42,0.10)', border: 'rgba(181,137,42,0.28)' };
  const acc = isOrbit ? orbitAccent : luxeAccent;

  return (
    <section id="showcase" className="border-t border-line py-[clamp(80px,10vw,140px)]">
      <div className="mx-auto max-w-(--container-site) px-[clamp(20px,4vw,32px)]">

        {/* Header */}
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
          <div className="mb-5 flex items-center gap-2">
            {([
              { id: 'orbit' as App, label: 'Orbit',      sub: 'Issue tracker',  dot: '#5c5ef0', glow: 'rgba(92,94,240,0.55)'   },
              { id: 'luxe'  as App, label: 'Luxe',        sub: 'Fashion store',  dot: '#b5892a', glow: 'rgba(181,137,42,0.55)'  },
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
                  style={{ background: dot, boxShadow: active === id ? `0 0 8px ${glow}` : 'none', opacity: active === id ? 1 : 0.45 }}
                />
                <span className="text-[13.5px] font-medium" style={{ color: active === id ? '#f4f4f7' : '#8a8a98' }}>{label}</span>
                <span className="text-[11px]" style={{ color: active === id ? '#8a8a98' : '#5a5a68' }}>{sub}</span>
                {active === id && (
                  <span
                    className="absolute bottom-0 left-4 right-4 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${dot}, transparent)` }}
                  />
                )}
              </button>
            ))}
            {/* Learning status pill */}
            <div className="ml-auto flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-3.5 py-2">
              <span
                className="h-[6px] w-[6px] rounded-full transition-all duration-500"
                style={{
                  background: learned ? acc.color : 'rgba(255,255,255,0.2)',
                  boxShadow: learned ? `0 0 8px ${acc.color}` : 'none',
                }}
              />
              <span className="font-mono text-[11px]" style={{ color: learned ? acc.color : '#5a5a68' }}>
                {learned ? 'Layout updated' : 'Learning…'}
              </span>
            </div>
          </div>
        </Reveal>

        {/* Preview + Engine panel */}
        <Reveal delay={2}>
          <div className="grid grid-cols-[1fr_320px] gap-4 max-[900px]:grid-cols-1">

            {/* App preview */}
            <div style={{ transition: 'opacity 0.2s ease', opacity: 1 }}>
              <BrowserChrome url={isOrbit ? 'orbit.app/all-issues' : 'luxe-fashion.co'}>
                {isOrbit
                  ? <OrbitPreview learned={learned} />
                  : <LuxePreview  learned={learned} />
                }
              </BrowserChrome>
            </div>

            {/* Ghost Engine panel */}
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

        {/* Three pillars — matches existing bento card style */}
        <Reveal delay={3}>
          <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/[0.06] max-[640px]:grid-cols-1">
            {[
              {
                num: '01',
                title: 'Same 3 primitives',
                body: 'GhostProvider + Ghost.Slot + Ghost.Button — the complete API, across every product type and aesthetic.',
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
                num: '02',
                title: 'Zero configuration',
                body: 'No analytics pipeline. No A/B platform. No schema. Ghost reads intent from interaction events alone.',
                icon: (
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="3 2"/>
                    <path d="M8.5 5v4l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
              },
              {
                num: '03',
                title: 'Any product category',
                body: 'Dark SaaS. Warm editorial. Industrial B2B. The engine is product-agnostic — it adapts to any layout.',
                icon: (
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                    <path d="M2 8.5h13M8.5 2v13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M2.5 5.5c1.5 1 3.5 1.5 6 1.5s4.5-.5 6-1.5M2.5 11.5c1.5-1 3.5-1.5 6-1.5s4.5.5 6 1.5" stroke="currentColor" strokeWidth="1.1"/>
                  </svg>
                ),
              },
            ].map(({ num, title, body, icon }, i) => (
              <div
                key={num}
                className="group flex flex-col gap-4 px-6 py-6 transition-colors duration-200"
                style={{
                  background: 'rgba(255,255,255,0.018)',
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] border text-accent transition-colors duration-200" style={{ border: '1px solid rgba(196,181,253,0.2)', background: 'linear-gradient(180deg,rgba(196,181,253,0.14),rgba(196,181,253,0.04))' }}>
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
