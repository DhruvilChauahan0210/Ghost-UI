'use client';

import type { GhostEvent } from '@ghost-ui/core';
import {
  Ghost,
  GhostProvider,
  localStorageAdapter,
  useGhostEngine,
  useGhostOrder,
  useGhostPlan,
} from '@ghost-ui/react';
import { useEffect, useRef, useState } from 'react';

const ZONE = 'landing.cta';

const BUTTONS = [
  { id: 'signup', label: 'Sign up' },
  { id: 'docs', label: 'Read the docs' },
  { id: 'github', label: 'Star on GitHub' },
  { id: 'pricing', label: 'See pricing' },
  { id: 'contact', label: 'Talk to sales' },
];

export function LandingDemo() {
  return (
    <GhostProvider persistence={localStorageAdapter('ghost-ui:landing')}>
      <Dashboard />
    </GhostProvider>
  );
}

function Dashboard() {
  return (
    <div className="dash">
      <div className="dash-zone-row">
        <div className="dash-label">
          <span className="caret">▌</span>
          <span>zone · landing.cta</span>
        </div>
        <Ghost.Slot zone={ZONE} className="zone">
          {BUTTONS.map((b) => (
            <Ghost.Button key={b.id} id={b.id} zone={ZONE} className="gbtn">
              {b.label}
            </Ghost.Button>
          ))}
        </Ghost.Slot>
      </div>

      <div className="dash-grid">
        <ScorePanel />
        <EventStream />
      </div>

      <StatusBar />
    </div>
  );
}

function ScorePanel() {
  const order = useGhostOrder(ZONE);
  const plan = useGhostPlan();
  return (
    <div className="dash-panel">
      <div className="dash-panel-head">
        <span className="dash-panel-title">Score</span>
        <span className="dash-panel-meta">emphasis · 0 → 1</span>
      </div>
      <ol className="score-list">
        {order.length === 0 && (
          <li className="score-empty">click any button to see scores stream in →</li>
        )}
        {order.map((id, i) => {
          const e = plan.emphasis[id] ?? 0;
          const label = BUTTONS.find((b) => b.id === id)?.label ?? id;
          return (
            <li key={id} className="score-row" style={{ ['--i' as never]: i }}>
              <span className="score-rank">{String(i + 1).padStart(2, '0')}</span>
              <span className="score-id">{label}</span>
              <span className="score-bar-wrap">
                <span className="score-bar" style={{ width: `${Math.max(2, e * 100)}%` }} />
              </span>
              <span className="score-v">{e.toFixed(2)}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function EventStream() {
  const engine = useGhostEngine();
  const plan = useGhostPlan();
  const [events, setEvents] = useState<GhostEvent[]>([]);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => setEvents(engine.events().slice(-14));
    update();
    tickRef.current = window.setInterval(update, 220);
    return () => {
      if (tickRef.current != null) window.clearInterval(tickRef.current);
    };
  }, [engine, plan]);

  const recent = [...events].reverse();
  const idMap = new Map(BUTTONS.map((b) => [b.id, b.label]));

  return (
    <div className="dash-panel">
      <div className="dash-panel-head">
        <span className="dash-panel-title">Events</span>
        <span className="dash-panel-meta">
          <span className="live-dot" /> live
        </span>
      </div>
      <ul className="event-list">
        {recent.length === 0 && <li className="event-empty">no events yet · interact with the buttons above</li>}
        {recent.map((e, i) => (
          <li
            key={`${e.ts}-${i}`}
            className={`event-row event-${e.type}${e.regret ? ' event-regret' : ''}`}
          >
            <span className="event-glyph">{glyph(e.type, !!e.regret)}</span>
            <span className="event-type">{e.regret ? 'regret' : e.type}</span>
            <span className="event-id">{idMap.get(e.id) ?? e.id}</span>
            <span className="event-ts">{relTime(e.ts)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusBar() {
  const engine = useGhostEngine();
  const plan = useGhostPlan();
  const [version, setVersion] = useState(0);
  const [count, setCount] = useState(0);
  const lastTs = useRef(0);

  useEffect(() => {
    if (plan.ts !== lastTs.current) {
      lastTs.current = plan.ts;
      setVersion((v) => v + 1);
    }
  }, [plan.ts]);

  useEffect(() => {
    const id = window.setInterval(() => setCount(engine.events().length), 220);
    return () => window.clearInterval(id);
  }, [engine]);

  const nodes = Object.keys(plan.emphasis).length;

  return (
    <div className="status-bar">
      <span className="status-cell">
        <span className="status-k">events</span>
        <span className="status-v">{count}</span>
      </span>
      <span className="status-cell">
        <span className="status-k">nodes</span>
        <span className="status-v">{nodes}</span>
      </span>
      <span className="status-cell">
        <span className="status-k">plan</span>
        <span className="status-v">v{version}</span>
      </span>
      <span className="status-cell">
        <span className="status-k">persist</span>
        <span className="status-v">localStorage</span>
      </span>
      <span className="status-spacer" />
      <button
        type="button"
        className="status-reset"
        onClick={() => void engine.reset()}
        title="Reset learned layout (⌘ ⇧ G)"
      >
        reset
      </button>
    </div>
  );
}

function glyph(type: GhostEvent['type'], regret: boolean): string {
  if (regret) return '⨯';
  switch (type) {
    case 'click': return '▲';
    case 'hover': return '◇';
    case 'dwell': return '◐';
    case 'miss':  return '↯';
    case 'view':  return '·';
    default:       return '·';
  }
}

function relTime(ts: number): string {
  const d = Math.max(0, Date.now() - ts);
  if (d < 1000) return 'now';
  if (d < 60_000) return `${Math.floor(d / 1000)}s`;
  if (d < 3_600_000) return `${Math.floor(d / 60_000)}m`;
  return `${Math.floor(d / 3_600_000)}h`;
}
