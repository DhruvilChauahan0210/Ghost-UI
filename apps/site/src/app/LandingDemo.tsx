'use client';

import type { GhostEvent } from '@ghost-ui/core';
import { GhostDevtools } from '@ghost-ui/devtools';
import { Ghost, GhostProvider, memoryAdapter, useGhostEngine, useGhostPlan } from '@ghost-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';

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
    <div className="issue-demo">

      {/* GitHub-style issue page */}
      <div className="gh-issue">

        {/* Breadcrumb */}
        <div className="gh-nav">
          <span className="gh-nav-repo">ghost-ui / core</span>
          <span className="gh-nav-sep">/</span>
          <span className="gh-nav-issues">Issues</span>
          <span className="gh-nav-sep">/</span>
          <span className="gh-nav-num">#247</span>
        </div>

        {/* Title + badges */}
        <div className="gh-header">
          <div className="gh-status-row">
            <span className="gh-open-badge"><IcOpenDot />Open</span>
            <div className="gh-labels">
              <span className="gh-label gh-label--purple">enhancement</span>
              <span className="gh-label gh-label--blue">dx</span>
              <span className="gh-label gh-label--green">good first issue</span>
            </div>
            <span className="gh-issue-num">#247</span>
          </div>
          <h2 className="gh-title">Toolbar items should reorder based on usage</h2>
        </div>

        {/* ★ Ghost.Slot action bar — the hero */}
        <div className="gh-actions-wrap">
          <Ghost.Slot
            zone={ZONE}
            className="gh-actions"
            staticLayout
            style={planReady ? undefined : { visibility: 'hidden' }}
          >
            {ACTIONS.map(a => (
              <Ghost.Button key={a.id} id={a.id} zone={ZONE}
                className="gh-action-btn"
                onClick={() => setLastAction(a.label)}>
                <ActionIcon id={a.id} />
                <span>{a.label}</span>
              </Ghost.Button>
            ))}
          </Ghost.Slot>
          {lastAction && (
            <span key={lastAction} className="gh-echo">{lastAction} ✓</span>
          )}
        </div>

        {/* Issue meta */}
        <div className="gh-meta-row">
          <span className="gh-av" style={{ background: '#c4b5fd' }}>D</span>
          <span className="gh-meta"><strong>dhruvil</strong> opened 2 days ago</span>
          <span className="gh-prio-badge">P1</span>
        </div>

        {/* Description */}
        <div className="gh-body">
          <p>When a user repeatedly clicks the same toolbar action, it should automatically move to position&nbsp;#1. Currently the order is hardcoded at design time and never adapts to the individual.</p>
        </div>

        {/* Timeline */}
        <div className="gh-timeline">
          <div className="gh-tl-item">
            <span className="gh-tl-av" style={{ background: '#6ee7b7' }}>A</span>
            <span className="gh-tl-line"><strong>alex</strong> labeled this <em>enhancement</em></span>
            <span className="gh-tl-time">2h ago</span>
          </div>
          <div className="gh-tl-item">
            <span className="gh-tl-av" style={{ background: '#93c5fd' }}>S</span>
            <span className="gh-tl-line"><strong>sam</strong> assigned to <em>@alex</em></span>
            <span className="gh-tl-time">1h ago</span>
          </div>
          <div className="gh-tl-item">
            <span className="gh-tl-av" style={{ background: '#fcd34d' }}>J</span>
            <span className="gh-tl-line"><strong>jordan</strong> commented: <em>&ldquo;This would be huge for power users&rdquo;</em></span>
            <span className="gh-tl-time">45m ago</span>
          </div>
        </div>
      </div>

      {/* Demo control footer — Ghost.Slot metadata + user switcher */}
      <div className="demo-footer">
        <div className="demo-footer-left">
          <span className="demo-zone-tag">
            <IcZoneIcon />
            <span>Ghost.Slot</span>
            <span className="demo-zone-name">issue.toolbar</span>
          </span>
          <span className={`demo-live-status${loading ? ' is-busy' : ''}`}>
            {loading ? (
              <><SpinIcon /> Loading {currentProfile?.name}&apos;s layout…</>
            ) : activeProfile === 'fresh' ? (
              <><GrayDot /> default order</>
            ) : (
              <><LiveDot /> {currentProfile?.name} · {totalClicks} interactions</>
            )}
          </span>
        </div>
        <div className="demo-footer-right">
          <span className="demo-viewas-label">view as</span>
          <div className="demo-users">
            {PROFILES.map(p => (
              <button key={p.id} type="button"
                className={`demo-user${activeProfile === p.id ? ' is-active' : ''}`}
                style={{ '--uc': p.color } as React.CSSProperties}
                onClick={() => loadProfile(p.id)}
                disabled={loading}
                title={`${p.name} · ${p.role}`}>
                <span className="demo-user-av" style={{ background: p.color }}>{p.name[0]}</span>
                <span className="demo-user-name">{p.name}</span>
              </button>
            ))}
          </div>
          <div className="sim-anchor">
            <button
              type="button"
              className={`demo-how-btn${showExplainer ? ' is-active' : ''}`}
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

  return (
    <div className="sim-card">
      <div className="sim-head">
        <span className="sim-title">how ghost ui learns</span>
        <button type="button" className="sim-x" onClick={onClose} aria-label="Close">
          <ExpCloseIcon />
        </button>
      </div>

      {/* Step progress track */}
      <div className="sim-track">
        {SIM_STEPS.map((_, i) => (
          <div key={i} className={`sim-pip${i === step ? ' is-on' : i < step ? ' is-done' : ''}`}>
            {i === step && <div key={`fp-${step}`} className="sim-pip-fill" />}
          </div>
        ))}
      </div>

      {/* Step message */}
      <div className="sim-msg">{cur.msg}</div>

      {/* Animated mini toolbar */}
      <div className="sim-stage">
        <div className="sim-arena">
          {(SIM_BTNS as readonly string[]).map((name, idx) => {
            const slot = cur.slots[idx]!;
            const score = cur.scores[idx]!;
            const hi = cur.hi === idx;
            return (
              <div
                key={name}
                className="sim-item"
                style={{ transform: `translateX(${slot * SIM_SLOT}px)` }}
              >
                <div className={`sim-btn${hi ? ' is-hi' : ''}`}>{name}</div>
                <div className="sim-bar-wrap">
                  <div className={`sim-bar-fill${hi ? ' is-hi' : ''}`} style={{ width: `${Math.round(score * 100)}%` }} />
                </div>
                <span className="sim-pct" style={{ opacity: score > 0.15 ? 0.75 : 0.2 }}>
                  {Math.round(score * 100)}%
                </span>
              </div>
            );
          })}
        </div>
        <div className="sim-pos-row">
          <span className="sim-pos">#1</span>
          <span className="sim-pos">#2</span>
          <span className="sim-pos">#3</span>
        </div>
      </div>
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
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden className="issue-spin">
      <path d="M12 2a10 10 0 0 1 10 10" opacity="0.2"/><path d="M22 12a10 10 0 0 1-10 10" opacity="0.2"/>
      <path d="M12 22a10 10 0 0 1-10-10" opacity="0.2"/><path d="M2 12a10 10 0 0 1 10-10"/>
    </svg>
  );
}
