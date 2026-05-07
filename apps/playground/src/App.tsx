import { Ghost, GhostProvider, localStorageAdapter, useGhostOrder, useGhostPlan } from '@ghost-ui/react';

const ZONE = 'demo.cta';

const BUTTONS = [
  { id: 'signup', label: 'Sign up' },
  { id: 'docs', label: 'Read the docs' },
  { id: 'github', label: 'Star on GitHub' },
  { id: 'pricing', label: 'See pricing' },
  { id: 'contact', label: 'Talk to sales' },
];

export function App() {
  return (
    <GhostProvider persistence={localStorageAdapter('ghost-ui:playground')}>
      <Demo />
    </GhostProvider>
  );
}

function Demo() {
  return (
    <main className="app">
      <h1>Ghost UI</h1>
      <p className="lead">
        Click any button. The optimizer scores each one by clicks, hovers, dwell, and recency, then re-orders the
        zone in real time. Refresh the page — your layout persists. Press{' '}
        <span className="kbd">⌘ ⇧ G</span> to reset.
      </p>

      <Ghost.Slot zone={ZONE} className="zone">
        {BUTTONS.map((b) => (
          <Ghost.Button key={b.id} id={b.id} zone={ZONE} className="gbtn">
            {b.label}
          </Ghost.Button>
        ))}
      </Ghost.Slot>

      <Scoreboard />
    </main>
  );
}

function Scoreboard() {
  const order = useGhostOrder(ZONE);
  const plan = useGhostPlan();
  return (
    <div className="scoreboard">
      <div>
        Live ranking <span style={{ color: '#666' }}>· emphasis 0..1</span>
      </div>
      <ol>
        {order.map((id) => (
          <li key={id}>
            <b>{id}</b> — emphasis {(plan.emphasis[id] ?? 0).toFixed(2)}
          </li>
        ))}
      </ol>
    </div>
  );
}
