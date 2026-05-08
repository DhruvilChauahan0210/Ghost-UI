'use client';

import type { GhostEvent } from '@ghost-ui/core';
import { GhostDevtools } from '@ghost-ui/devtools';
import { Ghost, GhostProvider, memoryAdapter, useGhostEngine, useGhostPlan } from '@ghost-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';

/* ── Tailwind class consts (gh-* issue page) ─────────────────────────────── */

const GH_ISSUE = "flex-1 min-h-0 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.07)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/[0.07] [&::-webkit-scrollbar-thumb]:rounded-sm";
const GH_LABEL_BASE = "rounded-full border px-[7px] py-0.5 font-sans text-[10px] font-medium leading-[1.3]";
const GH_LABEL_PURPLE = `${GH_LABEL_BASE} border-accent/[0.18] bg-accent/[0.08] text-accent`;
const GH_LABEL_BLUE = `${GH_LABEL_BASE} border-[rgba(147,197,253,0.18)] bg-[rgba(147,197,253,0.08)] text-[#93c5fd]`;
const GH_LABEL_GREEN = `${GH_LABEL_BASE} border-[rgba(110,231,183,0.18)] bg-[rgba(110,231,183,0.08)] text-[#6ee7b7]`;
const GH_ACTION_BTN = "inline-flex cursor-pointer items-center gap-[5px] whitespace-nowrap rounded-md border border-white/[0.09] bg-white/[0.04] px-[11px] py-1.5 font-sans text-[11px] font-medium leading-none tracking-[-0.01em] text-white/[0.52] transition-[background,color,border-color,box-shadow,transform] duration-[120ms] hover:border-white/[0.16] hover:bg-white/[0.08] hover:text-white/90 active:scale-95 first:border-[rgba(139,92,246,0.38)] first:bg-[rgba(139,92,246,0.1)] first:text-accent first:shadow-[0_0_12px_rgba(139,92,246,0.12)] hover:first:border-[rgba(139,92,246,0.52)] hover:first:bg-[rgba(139,92,246,0.17)] hover:first:shadow-[0_0_18px_rgba(139,92,246,0.2)]";

/* ── Demo footer (.demo-* classes) ───────────────────────────────────────── */

const DEMO_USER_BASE = "inline-flex cursor-pointer items-center gap-[5px] rounded-full border border-white/[0.08] bg-transparent py-[3px] pr-2 pl-1 transition-[background,border-color] duration-[130ms] enabled:hover:border-white/[0.14] enabled:hover:bg-white/[0.06] disabled:cursor-default disabled:opacity-[0.38]";
const DEMO_USER_ACTIVE = `${DEMO_USER_BASE} bg-[color-mix(in_srgb,var(--uc)_12%,transparent)] border-[color-mix(in_srgb,var(--uc)_40%,transparent)]`;
const DEMO_USER_NAME_BASE = "font-sans text-[10px] font-medium leading-none text-white/[0.42]";
const DEMO_USER_NAME_ACTIVE = "font-sans text-[10px] font-medium leading-none text-[color-mix(in_srgb,var(--uc)_85%,rgba(255,255,255,0.6))]";
const DEMO_HOW_BTN_BASE = "inline-flex cursor-pointer items-center gap-[5px] whitespace-nowrap rounded-full border border-[rgba(139,92,246,0.28)] bg-[rgba(139,92,246,0.07)] px-2.5 py-1 font-sans text-[10px] font-medium leading-none tracking-[-0.01em] text-[#a78bfa] transition-[background,border-color,color,box-shadow] duration-150 hover:border-[rgba(139,92,246,0.48)] hover:bg-[rgba(139,92,246,0.14)] hover:text-accent hover:shadow-[0_0_10px_rgba(139,92,246,0.18)]";
const DEMO_HOW_BTN_ACTIVE = `${DEMO_HOW_BTN_BASE} !border-[rgba(139,92,246,0.55)] !bg-[rgba(139,92,246,0.18)] !text-accent !shadow-[0_0_14px_rgba(139,92,246,0.25)]`;

let _seeded = false;
const ZONE = 'issue.toolbar';

/* ── Simulation card data ───────────────────────────────────────────── */
const SIM_BTNS = ['Assign', 'Comment', 'Resolve'] as const;
const SIM_BTN_W = 72;
const SIM_BTN_GAP = 5;
const SIM_SLOT = SIM_BTN_W + SIM_BTN_GAP;
const SIM_STEP_MS = 1700;

// slots[i] = visual position (0 = left) for button i
const SIM_STEPS: Array<{
  msg: string;
  slots: [number, number, number];
  scores: [number, number, number];
  hi: number;
}> = [
  { msg: 'default toolbar order',          slots: [0, 1, 2], scores: [0.08, 0.08, 0.08], hi: -1 },
  { msg: 'user clicks Resolve…',            slots: [0, 1, 2], scores: [0.08, 0.08, 0.52], hi:  2 },
  { msg: 'score climbs with each use',      slots: [0, 1, 2], scores: [0.08, 0.14, 0.89], hi:  2 },
  { msg: 'engine recomputes',               slots: [0, 1, 2], scores: [0.08, 0.14, 0.89], hi: -1 },
  { msg: 'Resolve slides to #1',            slots: [1, 2, 0], scores: [0.08, 0.14, 0.89], hi:  2 },
  { msg: 'adapted · zero config needed',   slots: [1, 2, 0], scores: [0.08, 0.14, 0.89], hi:  2 },
];

type ActionId = 'comment' | 'resolve' | 'assign' | 'label' | 'close' | 'duplicate';

/* Default order — intentionally suboptimal so reordering is dramatic */
const ACTIONS: { id: ActionId; label: string }[] = [
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'label',     label: 'Label'     },
  { id: 'close',     label: 'Close'     },
  { id: 'assign',    label: 'Assign'    },
  { id: 'resolve',   label: 'Resolve'   },
  { id: 'comment',   label: 'Comment'   },
];

type ProfileId = 'alex' | 'sam' | 'jordan' | 'fresh';

const PROFILES: {
  id: ProfileId; name: string; role: string; color: string;
  clicks: Partial<Record<ActionId, number>>;
}[] = [
  { id: 'alex',   name: 'Alex',   color: '#6ee7b7', role: 'Fixes bugs',         clicks: { resolve: 9, close: 6, comment: 2, assign: 1 } },
  { id: 'sam',    name: 'Sam',    color: '#93c5fd', role: 'Triages issues',     clicks: { assign: 10, label: 7, close: 3, comment: 1 } },
  { id: 'jordan', name: 'Jordan', color: '#fcd34d', role: 'Reviews & unblocks', clicks: { comment: 10, resolve: 4, label: 2, assign: 1 } },
];

function buildEvents(clicks: Partial<Record<ActionId, number>>): GhostEvent[] {
  const now = Date.now();
  const events: GhostEvent[] = [];
  for (const [id, count = 0] of Object.entries(clicks)) {
    for (let i = 0; i < count; i++) {
      const ago = Math.round((1 - i / Math.max(count - 1, 1)) * 86_000 + 2_000);
      events.push({ zone: ZONE, id, type: 'click', ts: now - ago });
      if (i % 3 === 0) events.push({ zone: ZONE, id, type: 'hover', ts: now - ago - 400 });
    }
  }
  return events.sort((a, b) => a.ts - b.ts);
}

export function LandingDemo() {
  return (
    <GhostProvider persistence={memoryAdapter()}>
      <IssueView />
      <GhostDevtools clipToSelector=".mac-body" />
    </GhostProvider>
  );
}

function IssueView() {
  const engine = useGhostEngine();
  const plan = useGhostPlan();
  const [planReady, setPlanReady] = useState(() => _seeded);
  const [activeProfile, setActiveProfile] = useState<ProfileId>('alex');
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [showExplainer, setShowExplainer] = useState(false);
  const cancelRef = useRef(false);

  useEffect(() => () => { cancelRef.current = true; }, []);

  useEffect(() => {
    if (_seeded) return;
    _seeded = true;
    engine._injectEvents(buildEvents(PROFILES[0]!.clicks));
    setPlanReady(true);
  }, [engine]);

  const totalClicks = useMemo(() => {
    void plan.ts;
    return engine.events().filter(e => e.type === 'click' && e.zone === ZONE).length;
  }, [engine, plan.ts]);

  const loadProfile = (id: ProfileId) => {
    if (loading) return;
    cancelRef.current = true;
    setActiveProfile(id);
    setLastAction(null);
    setLoading(true);
    void engine.reset().then(() => {
      cancelRef.current = false;
      if (id === 'fresh') { setTimeout(() => setLoading(false), 150); return; }
      const profile = PROFILES.find(p => p.id === id);
      if (!profile) { setLoading(false); return; }
      const events = buildEvents(profile.clicks);
      let i = 0;
      const tick = () => {
        if (cancelRef.current) return;
        if (i >= events.length) { setLoading(false); return; }
        engine._injectEvents([events[i++]!]);
        setTimeout(tick, 40);
      };
      setTimeout(tick, 140);
    });
  };

  /* Auto-dismiss last-action echo */
  useEffect(() => {
    if (!lastAction) return;
    const id = setTimeout(() => setLastAction(null), 2000);
    return () => clearTimeout(id);
  }, [lastAction]);

  const currentProfile = PROFILES.find(p => p.id === activeProfile);

  return (
    <div className="flex h-full flex-col">

      {/* GitHub-style issue page */}
      <div className={GH_ISSUE}>

        {/* Breadcrumb */}
        <div className="flex items-center gap-[5px] border-b border-white/[0.06] bg-white/[0.01] px-4 pt-[9px] pb-2">
          <span className="font-mono text-[11px] font-medium leading-none text-[rgba(139,92,246,0.65)]">ghost-ui / core</span>
          <span className="font-mono text-[11px] leading-none text-white/[0.14]">/</span>
          <span className="font-mono text-[11px] leading-none text-white/[0.32]">Issues</span>
          <span className="font-mono text-[11px] leading-none text-white/[0.14]">/</span>
          <span className="font-mono text-[11px] leading-none text-white/[0.18]">#247</span>
        </div>

        {/* Title + badges */}
        <div className="border-b border-white/[0.05] px-4 pt-[13px] pb-[11px]">
          <div className="mb-[7px] flex flex-wrap items-center gap-1.5">
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-[9px] py-[3px] font-sans text-[10px] font-semibold leading-none text-emerald-300"><IcOpenDot />Open</span>
            <div className="flex flex-wrap gap-1">
              <span className={GH_LABEL_PURPLE}>enhancement</span>
              <span className={GH_LABEL_BLUE}>dx</span>
              <span className={GH_LABEL_GREEN}>good first issue</span>
            </div>
            <span className="ml-auto font-mono text-[11px] leading-none text-white/[0.16]">#247</span>
          </div>
          <h2 className="m-0 font-sans text-[15px] font-bold leading-[1.35] tracking-[-0.025em] text-[#eeeef2]">Toolbar items should reorder based on usage</h2>
        </div>

        {/* ★ Ghost.Slot action bar — the hero */}
        <div className="flex min-h-[42px] items-center gap-2.5 border-b border-white/[0.06] bg-white/[0.012] px-3.5 py-2">
          <Ghost.Slot
            zone={ZONE}
            className="flex flex-1 flex-wrap gap-1"
            staticLayout
            style={planReady ? undefined : { visibility: 'hidden' }}
          >
            {ACTIONS.map(a => (
              <Ghost.Button key={a.id} id={a.id} zone={ZONE}
                className={GH_ACTION_BTN}
                onClick={() => setLastAction(a.label)}>
                <ActionIcon id={a.id} />
                <span>{a.label}</span>
              </Ghost.Button>
            ))}
          </Ghost.Slot>
          {lastAction && (
            <span key={lastAction} className="shrink-0 whitespace-nowrap font-mono text-[10px] font-medium leading-none text-[rgba(139,92,246,0.55)] animate-[gh-echo_2000ms_ease-out_forwards] motion-reduce:animate-none">{lastAction} ✓</span>
          )}
        </div>

        {/* Issue meta */}
        <div className="flex items-center gap-[7px] px-4 pt-[9px] pb-1">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-sans text-[9px] font-bold leading-none text-black/70" style={{ background: '#c4b5fd' }}>D</span>
          <span className="font-sans text-[11px] leading-none text-white/[0.28] [&_strong]:font-semibold [&_strong]:text-white/[0.52]"><strong>dhruvil</strong> opened 2 days ago</span>
          <span className="ml-auto rounded border border-[rgba(252,211,77,0.14)] bg-[rgba(252,211,77,0.07)] px-1.5 py-0.5 font-mono text-[9px] font-semibold leading-none text-[rgba(252,211,77,0.65)]">P1</span>
        </div>

        {/* Description */}
        <div className="border-b border-white/[0.04] px-4 pt-[5px] pb-[11px] [&_p]:m-0 [&_p]:font-sans [&_p]:text-[12px] [&_p]:leading-[1.7] [&_p]:text-white/[0.38]">
          <p>When a user repeatedly clicks the same toolbar action, it should automatically move to position&nbsp;#1. Currently the order is hardcoded at design time and never adapts to the individual.</p>
        </div>

        {/* Timeline */}
        <div>
          <TlItem av="A" avBg="#6ee7b7" time="2h ago">
            <strong>alex</strong> labeled this <em>enhancement</em>
          </TlItem>
          <TlItem av="S" avBg="#93c5fd" time="1h ago">
            <strong>sam</strong> assigned to <em>@alex</em>
          </TlItem>
          <TlItem av="J" avBg="#fcd34d" time="45m ago">
            <strong>jordan</strong> commented: <em>&ldquo;This would be huge for power users&rdquo;</em>
          </TlItem>
        </div>
      </div>

      {/* Demo control footer — Ghost.Slot metadata + user switcher */}
      <div className="flex flex-wrap shrink-0 items-center justify-between gap-2.5 border-t border-white/[0.07] bg-black/[0.32] px-3.5 pt-[7px] pb-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex items-center gap-1 whitespace-nowrap rounded border border-[rgba(139,92,246,0.17)] bg-[rgba(139,92,246,0.08)] py-0.5 pr-[7px] pl-[5px] font-mono text-[9px] font-medium leading-none tracking-[0.02em] text-[rgba(196,181,253,0.5)]">
            <IcZoneIcon />
            <span>Ghost.Slot</span>
            <span className="font-semibold text-[rgba(196,181,253,0.72)]">issue.toolbar</span>
          </span>
          <span className={`inline-flex items-center gap-1 whitespace-nowrap font-mono text-[10px] leading-none text-white/20${loading ? ' animate-[pulse-opacity_0.8s_ease-in-out_infinite] motion-reduce:animate-none' : ''}`}>
            {loading ? (
              <><SpinIcon /> Loading {currentProfile?.name}&apos;s layout…</>
            ) : activeProfile === 'fresh' ? (
              <><GrayDot /> default order</>
            ) : (
              <><LiveDot /> {currentProfile?.name} · {totalClicks} interactions</>
            )}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-[7px]">
          <span className="whitespace-nowrap font-mono text-[10px] uppercase leading-none tracking-[0.04em] text-white/[0.17]">view as</span>
          <div className="flex gap-[3px]">
            {PROFILES.map(p => (
              <button key={p.id} type="button"
                className={activeProfile === p.id ? DEMO_USER_ACTIVE : DEMO_USER_BASE}
                style={{ '--uc': p.color } as React.CSSProperties}
                onClick={() => loadProfile(p.id)}
                disabled={loading}
                title={`${p.name} · ${p.role}`}>
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full font-sans text-[8px] font-bold leading-none text-black/65" style={{ background: p.color }}>{p.name[0]}</span>
                <span className={activeProfile === p.id ? DEMO_USER_NAME_ACTIVE : DEMO_USER_NAME_BASE}>{p.name}</span>
              </button>
            ))}
          </div>
          <div className="relative">
            <button
              type="button"
              className={showExplainer ? DEMO_HOW_BTN_ACTIVE : DEMO_HOW_BTN_BASE}
              onClick={() => setShowExplainer(v => !v)}
              aria-label="How it works"
            >
              <HelpIcon /> How it works
            </button>
            {showExplainer && (
              <ExplainerSim onClose={() => setShowExplainer(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Explainer simulation card ──────────────────────────────────────────────── */

function ExplainerSim({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep(s => (s + 1) % SIM_STEPS.length), SIM_STEP_MS);
    return () => clearInterval(id);
  }, []);

  const cur = SIM_STEPS[step]!;

  const SIM_PIP_BASE = "relative h-[3px] flex-1 overflow-hidden rounded-sm";
  const SIM_BTN_BASE = "w-[72px] overflow-hidden text-ellipsis whitespace-nowrap rounded-md border px-1 py-2 text-center font-sans text-[10px] font-medium leading-none transition-[color,background,border-color,box-shadow] duration-300";
  const SIM_BAR_FILL_BASE = "h-full w-0 min-w-[2px] rounded-sm [transition:width_900ms_cubic-bezier(0.25,0.46,0.45,0.94),background_400ms]";
  const SIM_POS = "w-[72px] text-center font-mono text-[8px] leading-none tracking-[0.03em] text-white/[0.14]";

  return (
    <div className="absolute bottom-[calc(100%+8px)] right-0 z-50 w-[286px] overflow-hidden rounded-xl border border-[rgba(139,92,246,0.22)] bg-[rgba(6,6,15,0.98)] shadow-[0_20px_60px_rgba(0,0,0,0.65),inset_0_0_0_1px_rgba(139,92,246,0.06)] backdrop-blur-[20px] animate-[sim-rise_220ms_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-none">
      <div className="flex items-center justify-between border-b border-white/[0.05] bg-[linear-gradient(90deg,rgba(139,92,246,0.08)_0%,transparent_100%)] px-3 pt-2.5 pb-[9px]">
        <span className="font-mono text-[10px] font-semibold uppercase leading-none tracking-[0.07em] text-[#a78bfa]">how ghost ui learns</span>
        <button type="button" className="flex cursor-pointer rounded border-none bg-transparent p-[3px] text-white/30 transition-[color,background] duration-[140ms] hover:bg-white/[0.07] hover:text-white/75" onClick={onClose} aria-label="Close">
          <ExpCloseIcon />
        </button>
      </div>

      {/* Step progress track */}
      <div className="flex gap-[3px] px-3 pt-[9px]">
        {SIM_STEPS.map((_, i) => {
          const pipBg = i === step ? 'bg-[rgba(139,92,246,0.18)]' : i < step ? 'bg-[rgba(139,92,246,0.32)]' : 'bg-white/[0.07]';
          return (
            <div key={i} className={`${SIM_PIP_BASE} ${pipBg}`}>
              {i === step && <div key={`fp-${step}`} className="absolute inset-y-0 left-0 rounded-sm bg-[#8b5cf6] animate-[pip-fill_1700ms_linear] motion-reduce:animate-none" />}
            </div>
          );
        })}
      </div>

      {/* Step message */}
      <div className="min-h-[26px] px-3 pt-[7px] font-mono text-[11px] leading-[1.3] tracking-[-0.01em] text-white/[0.42]">{cur.msg}</div>

      {/* Animated mini toolbar */}
      <div className="px-3.5 pt-2.5 pb-3">
        <div className="relative h-[62px] w-[226px]">
          {(SIM_BTNS as readonly string[]).map((name, idx) => {
            const slot = cur.slots[idx]!;
            const score = cur.scores[idx]!;
            const hi = cur.hi === idx;
            const btnCls = hi
              ? `${SIM_BTN_BASE} border-[rgba(139,92,246,0.4)] bg-[rgba(139,92,246,0.14)] text-accent shadow-[0_0_16px_rgba(139,92,246,0.22),inset_0_0_0_1px_rgba(139,92,246,0.09)]`
              : `${SIM_BTN_BASE} border-white/[0.08] bg-white/[0.04] text-white/[0.38]`;
            const fillCls = hi
              ? `${SIM_BAR_FILL_BASE} bg-[linear-gradient(90deg,#7c3aed,#c4b5fd)]`
              : `${SIM_BAR_FILL_BASE} bg-white/[0.18]`;
            return (
              <div
                key={name}
                className="absolute left-0 top-0 flex w-[72px] flex-col items-center gap-[5px] transition-transform duration-[540ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{ transform: `translateX(${slot * SIM_SLOT}px)` }}
              >
                <div className={btnCls}>{name}</div>
                <div className="h-[3px] w-14 overflow-hidden rounded-sm bg-white/[0.06]">
                  <div className={fillCls} style={{ width: `${Math.round(score * 100)}%` }} />
                </div>
                <span className="font-mono text-[8px] leading-none text-white/[0.45] transition-opacity duration-300" style={{ opacity: score > 0.15 ? 0.75 : 0.2 }}>
                  {Math.round(score * 100)}%
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-[5px] flex gap-[5px]">
          <span className={SIM_POS}>#1</span>
          <span className={SIM_POS}>#2</span>
          <span className={SIM_POS}>#3</span>
        </div>
      </div>
    </div>
  );
}

function TlItem({ av, avBg, time, children }: { av: string; avBg: string; time: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 border-b border-white/[0.03] px-4 py-[7px] last:border-b-0">
      <span className="mt-px flex h-[18px] w-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full font-sans text-[8px] font-bold leading-none text-black/65" style={{ background: avBg }}>{av}</span>
      <span className="flex-1 font-sans text-[11px] leading-[1.45] text-white/[0.28] [&_strong]:font-semibold [&_strong]:text-white/50 [&_em]:not-italic [&_em]:text-white/[0.36]">{children}</span>
      <span className="shrink-0 whitespace-nowrap font-mono text-[10px] leading-none text-white/[0.13]">{time}</span>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────────────────────── */

const S = {
  width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 2,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
};

function ActionIcon({ id }: { id: ActionId }) {
  switch (id) {
    case 'comment':   return <svg {...S}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case 'resolve':   return <svg {...S}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
    case 'assign':    return <svg {...S}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;
    case 'label':     return <svg {...S}><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
    case 'close':     return <svg {...S}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
    case 'duplicate': return <svg {...S}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
  }
}

function HelpIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
}

/* ── Explainer icons ──────────────────────────────────────────────────────── */
function ExpCloseIcon()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }

/* ── Demo icons ──────────────────────────────────────────────────────────── */
function IcOpenDot() { return <svg width="6" height="6" viewBox="0 0 8 8" aria-hidden><circle cx="4" cy="4" r="4" fill="#34d399"/></svg>; }
function IcZoneIcon() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>; }
function LiveDot() { return <svg width="6" height="6" viewBox="0 0 8 8" aria-hidden><circle cx="4" cy="4" r="4" fill="#34d399"/></svg>; }
function GrayDot() { return <svg width="6" height="6" viewBox="0 0 8 8" aria-hidden><circle cx="4" cy="4" r="4" fill="rgba(255,255,255,0.2)"/></svg>; }
function SpinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden className="animate-[spin_0.9s_linear_infinite] motion-reduce:animate-none">
      <path d="M12 2a10 10 0 0 1 10 10" opacity="0.2"/><path d="M22 12a10 10 0 0 1-10 10" opacity="0.2"/>
      <path d="M12 22a10 10 0 0 1-10-10" opacity="0.2"/><path d="M2 12a10 10 0 0 1 10-10"/>
    </svg>
  );
}
