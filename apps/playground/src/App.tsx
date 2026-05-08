import { useEffect, useState } from 'react';
import { Ghost, GhostCanvas, GhostGrid, GhostPrivacyBadge, GhostProvider, useGhostArea, useGhostEngine, useGhostIntent, useGhostPlan } from '@ghost-ui/react';
import { GhostDevtools } from '@ghost-ui/devtools';
import { indexedDBAdapter } from '@ghost-ui/core';
import type { GhostEvent, GhostId } from '@ghost-ui/core';

const ZONE = 'demo.cta';

const BUTTONS = [
  { id: 'signup',  label: 'Sign up' },
  { id: 'docs',    label: 'Read the docs' },
  { id: 'github',  label: 'Star on GitHub' },
  { id: 'pricing', label: 'See pricing' },
  { id: 'contact', label: 'Talk to sales' },
];

export function App() {
  return (
    <GhostProvider persistence={indexedDBAdapter()}>
      <Demo />
      <GhostDevtools />
    </GhostProvider>
  );
}

function Demo() {
  const [activeTab, setActiveTab] = useState<'demo' | 'debug' | 'events'>('demo');

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-2">
          Ghost UI Playground
        </h1>
        <p className="text-white/40 text-sm mb-6">A UI that learns from how people actually use it</p>
        <div className="flex gap-1 border-b border-white/10">
          {([
            ['demo',   'Demo'],
            ['debug',  'Inspect & Simulate'],
            ['events', 'Event Log'],
          ] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                'px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeTab === tab
                  ? 'border-violet-400 text-violet-300'
                  : 'border-transparent text-white/40 hover:text-white/70',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'demo'   && <DemoSection />}
      {activeTab === 'debug'  && <DebugSection />}
      {activeTab === 'events' && <EventsSection />}
    </main>
  );
}

// ─── Demo Tab ────────────────────────────────────────────────────────────────

function DemoSection() {
  const engine = useGhostEngine();
  const plan   = useGhostPlan();
  const [stats, setStats] = useState({ clicks: 0, hovers: 0, misses: 0, dwells: 0, rages: 0 });

  useEffect(() => {
    const evs = engine.events();
    setStats({
      clicks: evs.filter(e => e.type === 'click').length,
      hovers: evs.filter(e => e.type === 'hover').length,
      misses: evs.filter(e => e.type === 'miss').length,
      dwells: evs.filter(e => e.type === 'dwell').length,
      rages:  evs.filter(e => e.type === 'rage').length,
    });
  }, [engine, plan.ts]);

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5 text-sm text-white/60 leading-relaxed">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <strong className="text-violet-300">Try it:</strong> Click and hover the buttons below.
            The optimizer watches what you do and re-orders them to put your most-used actions first.
            <br />
            <span className="text-white/30 text-xs mt-1 block">
              Your behaviour is saved to IndexedDB — refresh the page and the learned order persists.
              Press <kbd className="px-1 py-0.5 rounded bg-white/8 text-white/50 font-mono text-[10px]">⌘.</kbd> to open the live devtools overlay.
            </span>
          </div>
          <GhostPrivacyBadge variant="subtle" />
        </div>
      </div>

      <Ghost.Slot zone={ZONE} className="grid grid-cols-5 gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-5 max-md:grid-cols-2">
        {BUTTONS.map((b) => (
          <Ghost.Button key={b.id} id={b.id} zone={ZONE}
            className="appearance-none rounded-xl border border-white/12 bg-gradient-to-b from-white/8 to-white/2 px-4 py-4 text-sm font-semibold text-white/90 cursor-pointer transition-all hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-violet-400/10 active:translate-y-0">
            {b.label}
          </Ghost.Button>
        ))}
      </Ghost.Slot>

      <div className="grid grid-cols-5 gap-3">
        {([
          ['Clicks',  stats.clicks,  'text-blue-400',   'Times a button was clicked'],
          ['Hovers',  stats.hovers,  'text-violet-400', 'Times the cursor passed over a button'],
          ['Dwells',  stats.dwells,  'text-emerald-400','Hovers longer than 120ms — signals real interest'],
          ['Misses',  stats.misses,  'text-orange-400', 'Near-miss clicks — button hitbox will grow'],
          ['Rages',   stats.rages,   stats.rages > 0 ? 'text-red-400' : 'text-white/30', 'Rapid triple-clicks on the same button — frustration signal'],
        ] as const).map(([label, val, cls, tip]) => (
          <div key={label} title={tip} className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center cursor-help">
            <div className={`text-2xl font-bold mb-1 ${cls}`}>{val}</div>
            <div className="text-xs text-white/40 uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>

      <Scoreboard />
      <GravityGridDemo />
      <GhostCanvasDemo />
    </div>
  );
}

function Scoreboard() {
  const engine = useGhostEngine();
  const plan   = useGhostPlan();
  const [frustrated, setFrustrated] = useState<Set<GhostId>>(new Set());

  useEffect(() => {
    setFrustrated(new Set(engine.getFrustratedNodes()));
  }, [engine, plan.ts]);

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-violet-300 uppercase tracking-widest">Live Ranking</h3>
          <p className="text-xs text-white/30 mt-0.5">The optimizer's current preference order — updates as you interact</p>
        </div>
      </div>
      <ol className="flex flex-col gap-2">
        {plan.order[ZONE]?.map((id, rank) => {
          const em  = plan.emphasis[id] ?? 0;
          const bad = frustrated.has(id);
          const btn = BUTTONS.find(b => b.id === id);
          return (
            <li key={id} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 border-l-2 ${bad ? 'border-red-500 bg-red-500/5' : 'border-violet-500/40 bg-black/20'}`}>
              <span className="text-xs font-bold text-white/25 w-4 shrink-0">#{rank + 1}</span>
              <span className="w-28 text-xs font-semibold text-white/70 shrink-0 truncate">{btn?.label ?? id}</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-400 transition-all duration-300" style={{ width: `${em * 100}%` }} />
              </div>
              <span className="w-10 text-right text-xs font-semibold text-violet-400 shrink-0">{Math.round(em * 100)}%</span>
              {bad && (
                <span className="rounded px-1.5 py-0.5 text-[10px] bg-red-500/20 text-red-400 font-bold shrink-0 animate-[rage-pulse_1s_ease_infinite]">
                  frustrated
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!plan.order[ZONE] && (
        <p className="text-xs text-white/25 text-center py-4">Interact with the buttons above to see the ranking update</p>
      )}
    </div>
  );
}

// ─── Gravity Grid Demo ───────────────────────────────────────────────────────

const GRID_ZONE = 'demo.grid';

const GRID_ITEMS = [
  { id: 'grid-home',     label: 'Home',          icon: '🏠' },
  { id: 'grid-dash',     label: 'Dashboard',     icon: '📊' },
  { id: 'grid-inbox',    label: 'Inbox',         icon: '📥' },
  { id: 'grid-settings', label: 'Settings',      icon: '⚙️' },
  { id: 'grid-profile',  label: 'Profile',       icon: '👤' },
];

const TIER_LABEL: Record<string, string> = {
  primary:   'Primary',
  secondary: 'Secondary',
  tertiary:  'Tertiary',
};
const TIER_CLASS: Record<string, string> = {
  primary:   'bg-violet-500/20 text-violet-300 border-violet-500/30',
  secondary: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  tertiary:  'bg-white/5 text-white/30 border-white/10',
};

function GridItem({ id, label, icon }: { id: string; label: string; icon: string }) {
  const tier = useGhostArea(id);
  const isPrimary = tier === 'primary';
  return (
    <Ghost.Item id={id} zone={GRID_ZONE}
      className={[
        'flex flex-col items-center justify-center gap-2 rounded-xl border cursor-pointer select-none transition-all h-full min-h-[100px]',
        'hover:-translate-y-0.5 active:translate-y-0',
        isPrimary
          ? 'border-violet-400/40 bg-violet-500/10 hover:bg-violet-500/15'
          : 'border-white/8 bg-white/[0.03] hover:bg-white/[0.06]',
      ].join(' ')}
      onClick={() => {}}
    >
      <span className={isPrimary ? 'text-3xl' : 'text-xl'}>{icon}</span>
      <span className={`text-xs font-semibold ${isPrimary ? 'text-white/90' : 'text-white/50'}`}>{label}</span>
      <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-full border font-bold ${TIER_CLASS[tier] ?? TIER_CLASS.tertiary}`}>
        {TIER_LABEL[tier]}
      </span>
    </Ghost.Item>
  );
}

function GravityGridDemo() {
  const plan = useGhostPlan();
  const area = plan.area ?? {};
  const primaryId = GRID_ITEMS.find(i => area[i.id] === 'primary')?.label ?? '—';

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <h3 className="text-sm font-semibold text-violet-300 uppercase tracking-widest">Gravity Grid</h3>
          <p className="text-xs text-white/30 mt-0.5">
            The most-used item automatically promotes to the large primary area.
            Currently: <strong className="text-white/60">{primaryId}</strong>
          </p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded border border-white/10 text-white/25 uppercase tracking-widest">Phase A</span>
      </div>

      <GhostGrid
        zone={GRID_ZONE}
        gridTemplateAreas={'"primary secondary" "primary tertiary"'}
        gridTemplateColumns="2fr 1fr"
        gridTemplateRows="160px 120px"
        gap="0.75rem"
      >
        {GRID_ITEMS.map(item => (
          <GridItem key={item.id} {...item} />
        ))}
      </GhostGrid>

      <p className="text-[11px] text-white/25 mt-3 leading-relaxed">
        Click or hover any item — after enough interactions the highest-scored item floats to the large left area.
        Items with the same score stay in registration order (cold-start safe).
      </p>
    </div>
  );
}

// ─── Ghost Canvas Demo ────────────────────────────────────────────────────────

const CANVAS_ZONE = 'demo.canvas';

const CANVAS_ITEMS = [
  { id: 'cv-home',     label: 'Home',       icon: '🏠', color: 'border-violet-400/30 bg-violet-500/10' },
  { id: 'cv-chat',     label: 'Chat',       icon: '💬', color: 'border-blue-400/30 bg-blue-500/10' },
  { id: 'cv-files',    label: 'Files',      icon: '📁', color: 'border-emerald-400/30 bg-emerald-500/10' },
  { id: 'cv-calendar', label: 'Calendar',   icon: '📅', color: 'border-orange-400/30 bg-orange-500/10' },
  { id: 'cv-search',   label: 'Search',     icon: '🔍', color: 'border-pink-400/30 bg-pink-500/10' },
  { id: 'cv-settings', label: 'Settings',   icon: '⚙️', color: 'border-white/15 bg-white/[0.04]' },
];

function CanvasItem({ id, label, icon, color }: { id: string; label: string; icon: string; color: string }) {
  return (
    <Ghost.Item id={id} zone={CANVAS_ZONE}
      className={[
        'flex flex-col items-center justify-center gap-1.5 w-20 h-20 rounded-2xl border cursor-pointer',
        'select-none transition-colors hover:brightness-110 active:scale-95',
        color,
      ].join(' ')}
      onClick={() => {}}
    >
      <span className="text-2xl leading-none">{icon}</span>
      <span className="text-[10px] font-semibold text-white/60">{label}</span>
    </Ghost.Item>
  );
}

function GhostCanvasDemo() {
  const plan = useGhostPlan();
  const topId = Object.entries(plan.position ?? {})
    .sort(([, a], [, b]) => (a.x + a.y) - (b.x + b.y))[0]?.[0];
  const topLabel = CANVAS_ITEMS.find(i => i.id === topId)?.label ?? '—';

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <h3 className="text-sm font-semibold text-violet-300 uppercase tracking-widest">Gravity Canvas</h3>
          <p className="text-xs text-white/30 mt-0.5">
            Items float to positions proportional to their score — most-used drifts toward top-left.
            Currently leading: <strong className="text-white/60">{topLabel}</strong>
          </p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded border border-white/10 text-white/25 uppercase tracking-widest">Phase B</span>
      </div>

      <GhostCanvas
        zone={CANVAS_ZONE}
        className="rounded-xl border border-white/8 bg-[#0a0a12] relative"
        style={{ height: 320 }}
      >
        {CANVAS_ITEMS.map(item => (
          <CanvasItem key={item.id} {...item} />
        ))}
      </GhostCanvas>

      <p className="text-[11px] text-white/25 mt-3 leading-relaxed">
        Click or hover any icon to increase its score. Items animate to new positions using spring physics.
        The most-interacted item gravitates toward the top-left (the primary visual zone).
      </p>
    </div>
  );
}

// ─── Debug / Inspect Tab ─────────────────────────────────────────────────────

const ACTION_TYPES = [
  {
    type: 'click' as const,
    icon: '👆',
    label: 'Click',
    effect: 'Boosts rank',
    description: 'Records one click. Clicks are the strongest positive signal — each one adds 3 points to this button\'s score.',
    color: 'text-blue-400',
    activeBorder: 'border-blue-500 bg-blue-500/15 text-blue-300',
  },
  {
    type: 'hover' as const,
    icon: '👁',
    label: 'Hover',
    effect: 'Small boost',
    description: 'Records a hover. Hovering adds 0.5 points — it signals curiosity without commitment.',
    color: 'text-violet-400',
    activeBorder: 'border-violet-500 bg-violet-500/15 text-violet-300',
  },
  {
    type: 'dwell' as const,
    icon: '⏱',
    label: 'Dwell',
    effect: 'Medium boost',
    description: 'Records a 500ms hover. Dwelling (hovering for a while) is a stronger intent signal than a quick pass.',
    color: 'text-emerald-400',
    activeBorder: 'border-emerald-500 bg-emerald-500/15 text-emerald-300',
  },
  {
    type: 'miss' as const,
    icon: '↗',
    label: 'Near-miss',
    effect: 'Grows hitbox',
    description: 'Records a click that landed just outside the button. After a few misses the button\'s invisible clickable area grows to compensate.',
    color: 'text-orange-400',
    activeBorder: 'border-orange-500 bg-orange-500/15 text-orange-300',
  },
  {
    type: 'rage' as const,
    icon: '😡',
    label: 'Rage',
    effect: 'Drops rank',
    description: 'Simulates 3 rapid clicks (frustration). Rage-clicking flags the button as confusing — score drops by 6 points and the button shakes.',
    color: 'text-red-400',
    activeBorder: 'border-red-500 bg-red-500/15 text-red-300',
  },
] as const;

function DebugSection() {
  const engine = useGhostEngine();
  const plan   = useGhostPlan();
  const [selected, setSelected] = useState('signup');
  const [breakdown, setBreakdown] = useState<any>(null);
  const [activeAction, setActiveAction] = useState<typeof ACTION_TYPES[number]['type']>('click');
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const selectedAction = ACTION_TYPES.find(a => a.type === activeAction)!;
  const rank = (plan.order[ZONE] ?? []).indexOf(selected) + 1;
  const totalNodes = (plan.order[ZONE] ?? []).length;
  const hb = plan.hitbox[selected];
  const hitboxExpanded = (hb?.top ?? 0) + (hb?.bottom ?? 0) + (hb?.left ?? 0) + (hb?.right ?? 0) > 0;

  useEffect(() => {
    setBreakdown(engine.explainScore(selected));
  }, [engine, selected, plan.ts]);

  const handleSimulate = async () => {
    if (activeAction === 'dwell') {
      engine.record('dwell', selected, ZONE, { ms: 500 });
    } else if (activeAction === 'miss') {
      engine.record('miss', selected, ZONE, { dx: 10, dy: -5 });
    } else if (activeAction === 'rage') {
      engine.record('click', selected, ZONE);
      engine.record('click', selected, ZONE);
      engine.record('click', selected, ZONE);
    } else {
      engine.record(activeAction, selected, ZONE);
    }
    setLastFeedback(`Recorded "${activeAction}" on ${selected} — watch the ranking update`);
    await new Promise(r => setTimeout(r, 100));
  };

  const handleClear = () => {
    engine._injectEvents(engine.events().filter(e => e.id !== selected));
    setLastFeedback(`Cleared all events for ${selected}`);
  };

  const selectedBtn = BUTTONS.find(b => b.id === selected)!;

  return (
    <div className="flex flex-col gap-6">

      {/* Intro */}
      <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
        <h2 className="text-base font-semibold text-white/80 mb-1">How does Ghost UI decide what to show first?</h2>
        <p className="text-sm text-white/45 leading-relaxed">
          Every button has a <strong className="text-white/70">score</strong> based on how people interact with it.
          High score = promoted to the front. Below you can pick any button, see its score explained in plain English,
          and simulate interactions to watch the ranking change live.
        </p>
      </div>

      {/* Node picker */}
      <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
        <p className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-3">Pick a button to inspect</p>
        <div className="grid grid-cols-5 gap-2 max-md:grid-cols-2">
          {BUTTONS.map(b => {
            const nodeRank = (plan.order[ZONE] ?? []).indexOf(b.id) + 1;
            return (
              <button
                key={b.id}
                onClick={() => setSelected(b.id)}
                className={[
                  'rounded-xl border p-3 text-left transition-all',
                  selected === b.id
                    ? 'border-violet-500 bg-violet-500/15'
                    : 'border-white/8 bg-black/20 hover:border-white/20',
                ].join(' ')}
              >
                <div className={`text-xs font-semibold mb-1 ${selected === b.id ? 'text-violet-300' : 'text-white/60'}`}>
                  {b.label}
                </div>
                {nodeRank > 0 && (
                  <div className="text-[11px] text-white/30">rank #{nodeRank}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Score explanation */}
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
          <h3 className="text-sm font-semibold text-white/80 mb-1">
            Why is <span className="text-violet-300">"{selectedBtn.label}"</span> ranked{' '}
            {rank > 0 ? <span className="text-violet-300">#{rank} of {totalNodes}</span> : <span className="text-white/40">unranked</span>}?
          </h3>
          <p className="text-xs text-white/35 mb-4">Each interaction adds or removes points. The final score determines position.</p>

          {breakdown ? (
            <div className="flex flex-col gap-1.5">
              <ScoreRow
                label="Clicks"
                value={breakdown.clickScore}
                detail={`${Math.round(breakdown.clickScore / 3)} click${Math.round(breakdown.clickScore / 3) !== 1 ? 's' : ''} × 3 pts each`}
                positive
              />
              <ScoreRow
                label="Hovers"
                value={breakdown.hoverScore}
                detail={`${Math.round(breakdown.hoverScore / 0.5)} hover${Math.round(breakdown.hoverScore / 0.5) !== 1 ? 's' : ''} × 0.5 pts each`}
                positive
              />
              <ScoreRow
                label="Dwell time"
                value={breakdown.dwellScore}
                detail="Time spent hovering (0.001 pts/ms)"
                positive
              />
              <ScoreRow
                label="Changed mind"
                value={breakdown.regretPenalty}
                detail="Clicked something else right after — signals second thoughts"
                positive={false}
              />
              <ScoreRow
                label="Frustration"
                value={breakdown.ragePenalty}
                detail="Rage-clicked — rapid repeated clicks signal a broken interaction"
                positive={false}
              />
              <div className="mt-2 pt-2 border-t border-white/8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-white/50">Recency boost</span>
                  <span className="text-xs text-white/60">{breakdown.recencyMultiplier.toFixed(2)}× — recent activity scores higher</span>
                </div>
                <div className="flex justify-between items-center px-3 py-2.5 rounded-lg bg-violet-500/10 border border-violet-500/25">
                  <span className="text-sm font-bold text-white/80">Total score</span>
                  <span className="text-lg font-bold text-violet-300">{breakdown.totalScore.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-white/25 text-center py-6">Interact with the buttons in the Demo tab first.</p>
          )}
        </div>

        {/* Simulate panel */}
        <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
          <h3 className="text-sm font-semibold text-white/80 mb-1">Simulate an interaction</h3>
          <p className="text-xs text-white/35 mb-4">
            Inject a fake user action on <span className="text-violet-300 font-semibold">"{selectedBtn.label}"</span> and watch the score and ranking update instantly.
          </p>

          <div className="grid grid-cols-1 gap-2 mb-4">
            {ACTION_TYPES.map(a => (
              <button
                key={a.type}
                onClick={() => setActiveAction(a.type)}
                className={[
                  'rounded-lg border p-3 text-left transition-all',
                  activeAction === a.type
                    ? a.activeBorder
                    : 'border-white/8 bg-black/20 hover:border-white/15',
                ].join(' ')}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span>{a.icon}</span>
                  <span className={`text-xs font-bold ${activeAction === a.type ? '' : 'text-white/60'}`}>{a.label}</span>
                  <span className={`ml-auto text-[10px] font-semibold ${a.color}`}>{a.effect}</span>
                </div>
                {activeAction === a.type && (
                  <p className="text-xs text-white/50 leading-relaxed mt-1">{a.description}</p>
                )}
              </button>
            ))}
          </div>

          {lastFeedback && (
            <p className="text-xs text-emerald-400/80 mb-3 px-1">✓ {lastFeedback}</p>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={handleSimulate}
              className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold py-3 transition-colors"
            >
              {selectedAction.icon} Simulate {selectedAction.label} on "{selectedBtn.label}"
            </button>
            <button
              onClick={handleClear}
              className="w-full rounded-lg border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 text-sm py-2 transition-colors"
            >
              Reset "{selectedBtn.label}" back to zero
            </button>
          </div>
        </div>
      </div>

      {/* Adaptive hitbox */}
      <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-1">Adaptive click target</h3>
            <p className="text-xs text-white/35 leading-relaxed">
              When users keep missing a button (clicking just outside it), Ghost UI automatically grows an invisible clickable zone around it in the direction of the misses.
              Simulate a few "Near-miss" actions above to see the hitbox expand.
            </p>
          </div>
          {hitboxExpanded && (
            <span className="shrink-0 rounded-full px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              Expanded!
            </span>
          )}
        </div>
        <div className="grid grid-cols-5 gap-3 max-md:grid-cols-2">
          {BUTTONS.map(b => {
            const h = plan.hitbox[b.id];
            const total = (h?.top ?? 0) + (h?.bottom ?? 0) + (h?.left ?? 0) + (h?.right ?? 0);
            const isSelected = b.id === selected;
            return (
              <button
                key={b.id}
                onClick={() => setSelected(b.id)}
                className={[
                  'rounded-xl border p-3 text-center transition-all',
                  isSelected ? 'border-violet-500/50 bg-violet-500/8' : 'border-white/8 bg-black/20',
                  total > 0 ? 'border-emerald-500/40' : '',
                ].join(' ')}
              >
                <div className={`text-xs font-semibold mb-2 ${isSelected ? 'text-violet-300' : 'text-white/60'}`}>{b.label}</div>
                {total > 0 ? (
                  <div className="space-y-0.5 text-[11px]">
                    {(h?.top ?? 0) > 0 && <div className="text-emerald-400">↑ +{h?.top}px</div>}
                    {(h?.bottom ?? 0) > 0 && <div className="text-emerald-400">↓ +{h?.bottom}px</div>}
                    {(h?.left ?? 0) > 0 && <div className="text-emerald-400">← +{h?.left}px</div>}
                    {(h?.right ?? 0) > 0 && <div className="text-emerald-400">→ +{h?.right}px</div>}
                  </div>
                ) : (
                  <div className="text-[11px] text-white/20">no expansion</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Intent / Markov */}
      <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
        <h3 className="text-sm font-semibold text-white/80 mb-1">What will they click next?</h3>
        <p className="text-xs text-white/35 leading-relaxed mb-4">
          Ghost UI builds a pattern map from hover→click sequences. When a user hovers{' '}
          <span className="text-violet-300 font-semibold">"{selectedBtn.label}"</span>, history suggests they'll next click:
        </p>
        <IntentPanel selected={selected} />
      </div>
    </div>
  );
}

function ScoreRow({ label, value, detail, positive }: { label: string; value: number; detail: string; positive: boolean }) {
  const isNeutral = Math.abs(value) < 0.001;
  const color = isNeutral ? 'text-white/30' : positive ? 'text-blue-400' : value < 0 ? 'text-red-400' : 'text-white/50';
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-black/20">
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-white/60">{label}</div>
        {!isNeutral && <div className="text-[11px] text-white/30 mt-0.5 truncate">{detail}</div>}
      </div>
      <span className={`text-sm font-bold shrink-0 ${color}`}>
        {isNeutral ? '—' : (value > 0 ? '+' : '') + value.toFixed(1)}
      </span>
    </div>
  );
}

function IntentPanel({ selected }: { selected: string }) {
  const predictions = useGhostIntent(selected);
  if (predictions.length === 0) {
    return (
      <div className="rounded-lg bg-black/20 px-4 py-5 text-center">
        <p className="text-xs text-white/25">
          No pattern learned yet for this button.{' '}
          <span className="text-white/40">Try hovering it in the Demo tab, then clicking a different button — do this a few times and a pattern will form.</span>
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {predictions.map(({ id, probability }) => {
        const btn = BUTTONS.find(b => b.id === id);
        return (
          <div key={id} className="flex items-center gap-3">
            <span className="w-28 text-xs font-medium text-white/60 shrink-0 truncate">{btn?.label ?? id}</span>
            <div className="flex-1 h-2 rounded-full bg-white/8 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-500"
                style={{ width: `${probability * 100}%` }}
              />
            </div>
            <span className="w-10 text-right text-sm font-bold text-violet-300 shrink-0">
              {Math.round(probability * 100)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Events Log Tab ───────────────────────────────────────────────────────────

function EventsSection() {
  const engine = useGhostEngine();
  const plan   = useGhostPlan();
  const [events, setEvents] = useState<GhostEvent[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setEvents(engine.events());
  }, [engine, plan.ts]);

  const counts = {
    all:   events.length,
    click: events.filter(e => e.type === 'click').length,
    hover: events.filter(e => e.type === 'hover').length,
    dwell: events.filter(e => e.type === 'dwell').length,
    miss:  events.filter(e => e.type === 'miss').length,
    rage:  events.filter(e => e.type === 'rage').length,
  };

  const visible = filter === 'all' ? events : events.filter(e => e.type === filter);

  const typeStyle: Record<string, string> = {
    click: 'bg-blue-500/20 text-blue-400',
    hover: 'bg-violet-500/20 text-violet-400',
    dwell: 'bg-emerald-500/20 text-emerald-400',
    miss:  'bg-orange-500/20 text-orange-400',
    rage:  'bg-red-500/20 text-red-400 animate-[rage-pulse_1s_ease_infinite]',
  };

  const typeDesc: Record<string, string> = {
    click: 'Button was clicked',
    hover: 'Cursor entered the button',
    dwell: 'Hovered for 120ms+',
    miss:  'Click landed outside the button',
    rage:  'Rapid triple-click detected',
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-white/8 bg-white/[0.03] p-5">
        <h2 className="text-base font-semibold text-white/80 mb-1">Raw event stream</h2>
        <p className="text-sm text-white/40 leading-relaxed">
          Every interaction is stored as an event. The optimizer reads this stream to compute scores.
          Events older than 7 days are automatically pruned.
        </p>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {(Object.entries(counts) as [string, number][]).map(([type, n]) => (
            <button key={type} onClick={() => setFilter(type)}
              className={[
                'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                filter === type
                  ? type === 'rage'
                    ? 'border-red-500 bg-red-500/20 text-red-400'
                    : 'border-violet-500 bg-violet-500/20 text-violet-300'
                  : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60',
              ].join(' ')}
            >
              {type === 'all' ? `All (${n})` : `${typeDesc[type] ?? type} (${n})`}
            </button>
          ))}
        </div>
        <button onClick={() => void engine.reset()}
          className="rounded-lg border border-white/10 text-white/40 hover:text-red-400 hover:border-red-500/40 text-xs font-medium px-4 py-2 transition-colors">
          Clear all & reset
        </button>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.03] overflow-hidden max-h-[520px] overflow-y-auto">
        {visible.length === 0 ? (
          <div className="py-12 text-center text-sm text-white/25">
            No events yet — go to the Demo tab and start clicking!
          </div>
        ) : (
          [...visible].reverse().map((e, i) => {
            const btn = BUTTONS.find(b => b.id === e.id);
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <span className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${typeStyle[e.type] ?? 'bg-white/10 text-white/50'}`}>
                  {e.type}
                </span>
                <span className="text-sm text-white/70 font-medium shrink-0">{btn?.label ?? e.id}</span>
                {e.ms   != null && <span className="text-white/30 text-xs">{e.ms}ms</span>}
                {e.dx   != null && <span className="text-white/30 text-xs">offset x:{e.dx} y:{e.dy}</span>}
                {e.regret && (
                  <span className="rounded px-2 py-0.5 bg-orange-500/15 text-orange-400 text-[11px] font-semibold">
                    changed mind
                  </span>
                )}
                <span className="ml-auto text-white/25 text-xs tabular-nums shrink-0">
                  {new Date(e.ts).toLocaleTimeString()}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
