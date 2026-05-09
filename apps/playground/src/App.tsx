import { useEffect, useState } from 'react';
import {
  Ghost, GhostCanvas, GhostGrid, GhostPrivacyBadge,
  GhostProvider, useGhostArea, useGhostEngine, useGhostIntent, useGhostPlan,
} from '@ghost-ui/react';
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

const BRAND_MARK = [
  'relative inline-block h-[22px] w-[22px] rounded-md transition-transform duration-[600ms]',
  'bg-[conic-gradient(from_220deg_at_50%_50%,#c4b5fd,#8b5cf6,#38bdf8,#c4b5fd)]',
  'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20),0_0_14px_rgba(167,139,250,0.40)]',
  'after:absolute after:inset-[5px] after:rounded after:bg-[rgba(10,10,14,0.95)]',
  'after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] after:content-[""]',
].join(' ');

export function App() {
  return (
    <GhostProvider persistence={indexedDBAdapter()}>
      <Playground />
      <GhostDevtools />
    </GhostProvider>
  );
}

function Playground() {
  return (
    <div className="min-h-screen bg-[#07070a] text-[#ededf0]">
      <FloatingNav />
      <main className="mx-auto max-w-[1180px] px-[clamp(20px,4vw,32px)] pt-28 pb-24 flex flex-col gap-20">
        <HeroSection />
        <InteractSection />
        <InsightSection />
        <MoreSection />
        <EventSection />
      </main>
    </div>
  );
}

/* ── Nav ───────────────────────────────────────────────────────────────────── */

function FloatingNav() {
  const engine = useGhostEngine();
  return (
    <header className="fixed top-[18px] left-1/2 z-[60] inline-flex -translate-x-1/2 items-center rounded-full border border-white/[0.08] bg-[rgba(7,7,10,0.82)] p-[5px] shadow-[0_12px_38px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[24px] backdrop-saturate-[160%]">
      <div className="flex h-[38px] items-center gap-px">
        <a
          className="group inline-flex h-full items-center gap-[9px] rounded-full pl-1.5 pr-3 text-[13.5px] font-medium tracking-[-0.012em] text-[#ededf0] no-underline transition-colors hover:bg-white/[0.04]"
          href="#"
        >
          <span className={`${BRAND_MARK} group-hover:rotate-45`} aria-hidden />
          <span>Ghost UI</span>
        </a>

        <span className="h-5 w-px bg-white/[0.10]" aria-hidden />

        <span className="inline-flex h-full items-center px-3 font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-[#c4b5fd]">
          Playground
        </span>

        <span className="h-5 w-px bg-white/[0.10]" aria-hidden />

        <button
          onClick={() => void engine.reset()}
          className="inline-flex h-full items-center rounded-full px-3 text-[13px] font-medium text-[#8a8a98] transition-colors hover:bg-white/[0.04] hover:text-[#ededf0]"
        >
          Reset
        </button>

        <span className="h-5 w-px bg-white/[0.10]" aria-hidden />

        <span className="inline-flex h-full items-center gap-1.5 px-3 text-[#8a8a98]">
          <kbd className="rounded-[5px] border border-white/[0.16] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-[#d8d8ee]">⌘.</kbd>
          <span className="font-mono text-[11px]">devtools</span>
        </span>
      </div>
    </header>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="flex flex-col items-center text-center">
      <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.10] bg-white/[0.025] px-[11px] py-[5px] font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[#8a8a98]">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#34d399] shadow-[0_0_10px_#34d399] animate-[live-pulse_2s_ease-in-out_infinite]" />
        live · fully on-device
      </span>

      <h1 className="m-0 mb-5 text-balance text-[clamp(44px,7vw,88px)] font-medium leading-[0.94] tracking-[-0.05em] text-[#f5f5f7]">
        Interact.{' '}
        <span className="bg-[linear-gradient(180deg,#f0e9ff_0%,#c4b5fd_100%)] bg-clip-text text-transparent font-serif font-normal italic tracking-[-0.025em]">
          Watch it learn.
        </span>
      </h1>

      <p className="m-0 max-w-[54ch] text-[clamp(15px,1.4vw,18px)] leading-[1.55] text-[#8a8a98]">
        Click the buttons below. Ghost UI watches how you interact and reorders them
        around your muscle memory — <span className="font-serif italic text-[#d8d0ff]">no analytics, no server, no API key.</span>
      </p>
    </section>
  );
}

/* ── Interact ──────────────────────────────────────────────────────────────── */

function InteractSection() {
  const engine = useGhostEngine();
  const plan   = useGhostPlan();
  const [stats, setStats] = useState({ clicks: 0, hovers: 0, misses: 0, dwells: 0, rages: 0 });
  const [frustrated, setFrustrated] = useState<Set<GhostId>>(new Set());

  useEffect(() => {
    const evs = engine.events();
    setStats({
      clicks: evs.filter(e => e.type === 'click').length,
      hovers: evs.filter(e => e.type === 'hover').length,
      misses: evs.filter(e => e.type === 'miss').length,
      dwells: evs.filter(e => e.type === 'dwell').length,
      rages:  evs.filter(e => e.type === 'rage').length,
    });
    setFrustrated(new Set(engine.getFrustratedNodes()));
  }, [engine, plan.ts]);

  return (
    <section>
      <SectionLabel num="01" label="Live Demo" />

      <div className="mt-5 grid grid-cols-[1fr_296px] gap-5 items-start max-[900px]:grid-cols-1">

        {/* Left column — interactive buttons */}
        <div className="flex flex-col gap-4">
          {/* Mac window */}
          <div className="overflow-hidden rounded-2xl bg-[#0c0c14] shadow-[0_0_0_0.5px_rgba(255,255,255,0.07),0_24px_64px_-20px_rgba(0,0,0,0.85),0_60px_140px_-30px_rgba(139,92,246,0.22)]">
            {/* Titlebar */}
            <div className="relative flex h-[38px] items-center border-b border-black/60 bg-[linear-gradient(180deg,rgba(58,58,70,0.85),rgba(34,34,42,0.85))] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.28)]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.28)]" />
                <span className="h-3 w-3 rounded-full bg-[#28c941] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.28)]" />
              </div>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-sans text-[12px] font-medium tracking-[-0.005em] text-white/40 select-none">
                ghost-ui · optimizer
              </span>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] leading-relaxed text-[#8a8a98]">
                    <span className="font-medium text-[#c4b5fd]">Try it:</span> Click and hover the buttons below.
                    The optimizer watches and reorders them to put your most-used action first.
                  </p>
                  <p className="mt-1 text-[11px] text-white/22">
                    Saved to IndexedDB — refresh the page and the learned order persists.
                  </p>
                </div>
                <GhostPrivacyBadge variant="subtle" />
              </div>

              <Ghost.Slot
                zone={ZONE}
                className="grid grid-cols-5 gap-2.5 max-[640px]:grid-cols-2 max-[380px]:grid-cols-1"
              >
                {BUTTONS.map((b) => (
                  <Ghost.Button
                    key={b.id}
                    id={b.id}
                    zone={ZONE}
                    className="appearance-none rounded-xl border border-white/[0.10] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-4 py-4 text-[13px] font-medium text-[#ededf0] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c4b5fd]/40 hover:bg-[rgba(196,181,253,0.08)] hover:shadow-[0_0_24px_rgba(167,139,250,0.14)] active:translate-y-0 active:scale-[0.97]"
                  >
                    {b.label}
                  </Ghost.Button>
                ))}
              </Ghost.Slot>
            </div>
          </div>

          {/* Stat chips */}
          <div className="grid grid-cols-5 gap-2.5">
            {([
              ['Clicks',  stats.clicks,  'text-[#93c5fd]',                                    'Strongest signal — +3 pts each'],
              ['Hovers',  stats.hovers,  'text-[#c4b5fd]',                                    'Curiosity — +0.5 pts each'],
              ['Dwells',  stats.dwells,  'text-[#34d399]',                                    '120 ms+ hover — medium boost'],
              ['Misses',  stats.misses,  'text-[#fb923c]',                                    'Near-miss — hitbox grows'],
              ['Rages',   stats.rages,   stats.rages > 0 ? 'text-[#f87171]' : 'text-white/20','Triple-click — frustration, −6 pts'],
            ] as const).map(([label, val, cls, tip]) => (
              <div
                key={label}
                title={tip}
                className="cursor-help rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center transition-colors hover:border-white/[0.10]"
              >
                <div className={`mb-0.5 text-xl font-medium tabular-nums ${cls}`}>{val}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/28">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — live ranking */}
        <div className="sticky top-28 flex flex-col gap-2">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8a98]">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399] animate-[live-pulse_1.8s_ease-in-out_infinite]" />
                  Live Ranking
                </div>
                <p className="text-[11px] leading-relaxed text-white/28">
                  Highest score floats to #1
                </p>
              </div>
            </div>

            {plan.order[ZONE] ? (
              <ol className="flex flex-col gap-1.5">
                {plan.order[ZONE].map((id, rank) => {
                  const em  = plan.emphasis[id] ?? 0;
                  const bad = frustrated.has(id);
                  const btn = BUTTONS.find(b => b.id === id);
                  return (
                    <li
                      key={id}
                      className={[
                        'flex items-center gap-2.5 rounded-lg border-l-2 px-3 py-2.5 transition-all duration-300',
                        bad
                          ? 'border-[#f87171] bg-[#f87171]/[0.06]'
                          : rank === 0
                            ? 'border-[#c4b5fd]/60 bg-[#c4b5fd]/[0.06]'
                            : 'border-transparent bg-white/[0.02]',
                      ].join(' ')}
                    >
                      <span className="w-5 shrink-0 font-mono text-[10px] font-medium text-white/22">
                        #{rank + 1}
                      </span>
                      <span className="flex-1 truncate text-[12px] font-medium text-white/70">
                        {btn?.label ?? id}
                      </span>
                      <div className="w-14 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#8b5cf6,#c4b5fd)] transition-all duration-500"
                          style={{ width: `${em * 100}%` }}
                        />
                      </div>
                      <span className="w-9 shrink-0 text-right font-mono text-[11px] font-medium text-[#c4b5fd]">
                        {Math.round(em * 100)}%
                      </span>
                      {bad && (
                        <span className="shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide bg-[#f87171]/[0.18] text-[#f87171] animate-[rage-pulse_1s_ease_infinite]">
                          frustrated
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="rounded-xl border border-dashed border-white/[0.08] py-8 text-center">
                <p className="text-[12px] text-white/22">Click a button to start ranking</p>
              </div>
            )}
          </div>

          <p className="px-1 text-[11px] leading-relaxed text-white/22">
            Scoring: click +3 pts · dwell +1 · hover +0.5 · rage −6. Recency decay gives recent actions more weight.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── Inspect & Simulate ────────────────────────────────────────────────────── */

const ACTION_TYPES = [
  {
    type:      'click' as const,
    icon:      '▲',
    label:     'Click',
    effect:    '+3 pts',
    color:     'text-[#93c5fd]',
    activeCls: 'border-[#93c5fd]/50 bg-[#93c5fd]/[0.08] text-[#93c5fd]',
    desc:      'Strongest signal. Each click adds 3 points to this button\'s score.',
  },
  {
    type:      'hover' as const,
    icon:      '◇',
    label:     'Hover',
    effect:    '+0.5 pts',
    color:     'text-[#c4b5fd]',
    activeCls: 'border-[#c4b5fd]/50 bg-[#c4b5fd]/[0.08] text-[#c4b5fd]',
    desc:      'Curiosity signal — a quick pass adds 0.5 pts. Not as strong as a click.',
  },
  {
    type:      'dwell' as const,
    icon:      '⏱',
    label:     'Dwell',
    effect:    '~+1.2 pts',
    color:     'text-[#34d399]',
    activeCls: 'border-[#34d399]/50 bg-[#34d399]/[0.08] text-[#34d399]',
    desc:      'Simulates a 500ms hover. Lingering signals real intent — stronger than a quick hover.',
  },
  {
    type:      'miss' as const,
    icon:      '↗',
    label:     'Near-miss',
    effect:    'hitbox+',
    color:     'text-[#fb923c]',
    activeCls: 'border-[#fb923c]/50 bg-[#fb923c]/[0.08] text-[#fb923c]',
    desc:      'Click that landed just outside. After a few misses the invisible click area grows toward the miss direction.',
  },
  {
    type:      'rage' as const,
    icon:      '😡',
    label:     'Rage click',
    effect:    '−6 pts',
    color:     'text-[#f87171]',
    activeCls: 'border-[#f87171]/50 bg-[#f87171]/[0.08] text-[#f87171]',
    desc:      'Rapid triple-click — frustration signal. Score drops by 6 pts and the button shakes.',
  },
] as const;

function InsightSection() {
  const engine = useGhostEngine();
  const plan   = useGhostPlan();
  const [selected,     setSelected]     = useState('signup');
  const [breakdown,    setBreakdown]    = useState<any>(null);
  const [activeAction, setActiveAction] = useState<(typeof ACTION_TYPES)[number]['type']>('click');
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const selectedAction = ACTION_TYPES.find(a => a.type === activeAction)!;
  const rank           = (plan.order[ZONE] ?? []).indexOf(selected) + 1;
  const totalNodes     = (plan.order[ZONE] ?? []).length;
  const selectedBtn    = BUTTONS.find(b => b.id === selected)!;

  const hb           = plan.hitbox[selected];
  const hitboxTotal  = (hb?.top ?? 0) + (hb?.bottom ?? 0) + (hb?.left ?? 0) + (hb?.right ?? 0);

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
    setLastFeedback(`Recorded "${activeAction}" on "${selectedBtn.label}"`);
    await new Promise(r => setTimeout(r, 80));
  };

  const handleClear = () => {
    engine._injectEvents(engine.events().filter(e => e.id !== selected));
    setLastFeedback(`Cleared all data for "${selectedBtn.label}"`);
  };

  return (
    <section>
      <SectionLabel num="02" label="Inspect & Simulate" />

      <div className="mt-5 grid grid-cols-3 gap-5 max-[960px]:grid-cols-1">

        {/* Button picker */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8a98]">Pick a button</p>
          <div className="flex flex-col gap-1.5">
            {BUTTONS.map(b => {
              const nodeRank = (plan.order[ZONE] ?? []).indexOf(b.id) + 1;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelected(b.id)}
                  className={[
                    'rounded-xl border px-3.5 py-3 text-left transition-all',
                    selected === b.id
                      ? 'border-[#c4b5fd]/40 bg-[#c4b5fd]/[0.08]'
                      : 'border-white/[0.06] hover:border-white/[0.12]',
                  ].join(' ')}
                >
                  <div className={`text-[13px] font-medium ${selected === b.id ? 'text-[#c4b5fd]' : 'text-white/70'}`}>
                    {b.label}
                  </div>
                  {nodeRank > 0 && (
                    <div className="mt-0.5 font-mono text-[10px] text-white/25">ranked #{nodeRank}</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Score breakdown */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <p className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8a98]">Score breakdown</p>
          <p className="mb-4 text-[12px] text-white/30">
            Why is{' '}
            <span className="text-[#c4b5fd]">"{selectedBtn.label}"</span>{' '}
            {rank > 0
              ? <span>ranked <span className="text-[#c4b5fd]">#{rank} of {totalNodes}</span>?</span>
              : 'unranked?'
            }
          </p>

          {breakdown ? (
            <div className="flex flex-col gap-1.5">
              <ScoreRow label="Clicks"       value={breakdown.clickScore}   detail={`${Math.round(breakdown.clickScore / 3)} × 3 pts`}      positive />
              <ScoreRow label="Hovers"       value={breakdown.hoverScore}   detail={`${Math.round(breakdown.hoverScore / 0.5)} × 0.5 pts`}  positive />
              <ScoreRow label="Dwell time"   value={breakdown.dwellScore}   detail="0.001 pts / ms hovered"                                 positive />
              <ScoreRow label="Changed mind" value={breakdown.regretPenalty} detail="clicked elsewhere within 3 s"                         positive={false} />
              <ScoreRow label="Frustration"  value={breakdown.ragePenalty}  detail="rapid triple-clicks flagged"                            positive={false} />

              <div className="mt-3 border-t border-white/[0.06] pt-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] text-white/38">Recency boost</span>
                  <span className="font-mono text-[11px] text-white/50">
                    {breakdown.recencyMultiplier.toFixed(2)}× — recent activity weighs more
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#c4b5fd]/20 bg-[#c4b5fd]/[0.07] px-4 py-3">
                  <span className="text-[13px] font-medium text-white/80">Total score</span>
                  <span className="font-mono text-[20px] font-medium text-[#c4b5fd]">
                    {breakdown.totalScore.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Adaptive hitbox */}
              {hitboxTotal > 0 && (
                <div className="mt-3 border-t border-white/[0.06] pt-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] text-white/38">Adaptive hitbox</span>
                    <span className="rounded-full border border-[#34d399]/25 bg-[#34d399]/[0.10] px-2 py-0.5 text-[10px] font-medium text-[#34d399]">Expanded</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {(hb?.top ?? 0) > 0    && <div className="text-[11px] font-mono text-[#34d399]">↑ top +{hb?.top}px</div>}
                    {(hb?.bottom ?? 0) > 0 && <div className="text-[11px] font-mono text-[#34d399]">↓ bottom +{hb?.bottom}px</div>}
                    {(hb?.left ?? 0) > 0   && <div className="text-[11px] font-mono text-[#34d399]">← left +{hb?.left}px</div>}
                    {(hb?.right ?? 0) > 0  && <div className="text-[11px] font-mono text-[#34d399]">→ right +{hb?.right}px</div>}
                  </div>
                </div>
              )}

              {/* Intent predictions */}
              <IntentPanel selected={selected} />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/[0.08] py-8 text-center">
              <p className="text-[12px] text-white/22">Interact with the buttons above first</p>
            </div>
          )}
        </div>

        {/* Simulate */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <p className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8a8a98]">Simulate</p>
          <p className="mb-4 text-[12px] text-white/30">
            Inject a fake interaction on{' '}
            <span className="text-[#c4b5fd]">"{selectedBtn.label}"</span>{' '}
            and watch the score update live.
          </p>

          <div className="mb-4 flex flex-col gap-1.5">
            {ACTION_TYPES.map(a => (
              <button
                key={a.type}
                onClick={() => setActiveAction(a.type)}
                className={[
                  'rounded-xl border px-3.5 py-2.5 text-left transition-all',
                  activeAction === a.type
                    ? a.activeCls
                    : 'border-white/[0.06] text-white/50 hover:border-white/[0.12] hover:text-white/70',
                ].join(' ')}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[14px]">{a.icon}</span>
                  <span className="text-[12px] font-medium">{a.label}</span>
                  <span className={`ml-auto font-mono text-[10px] font-medium ${activeAction === a.type ? '' : a.color}`}>{a.effect}</span>
                </div>
                {activeAction === a.type && (
                  <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">{a.desc}</p>
                )}
              </button>
            ))}
          </div>

          {lastFeedback && (
            <p className="mb-3 px-1 text-[11px] text-[#34d399]/80">✓ {lastFeedback}</p>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={handleSimulate}
              className="w-full rounded-xl bg-[#8b5cf6] py-2.5 text-[13px] font-medium text-white shadow-[0_4px_16px_rgba(139,92,246,0.40)] transition-all hover:bg-[#7c3aed] hover:shadow-[0_4px_20px_rgba(139,92,246,0.50)] active:scale-[0.98]"
            >
              {selectedAction.icon} Fire {selectedAction.label} on "{selectedBtn.label}"
            </button>
            <button
              onClick={handleClear}
              className="w-full rounded-xl border border-white/[0.08] py-2 text-[12px] text-white/32 transition-colors hover:border-white/[0.16] hover:text-white/60"
            >
              Reset "{selectedBtn.label}" to zero
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScoreRow({
  label, value, detail, positive,
}: { label: string; value: number; detail: string; positive: boolean }) {
  const isNeutral = Math.abs(value) < 0.001;
  const color = isNeutral
    ? 'text-white/22'
    : positive
      ? 'text-[#93c5fd]'
      : value < 0
        ? 'text-[#f87171]'
        : 'text-white/40';

  return (
    <div className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2">
      <div className="flex-1 min-w-0">
        <div className="text-[12px] text-white/55">{label}</div>
        {!isNeutral && <div className="text-[10px] text-white/28 truncate">{detail}</div>}
      </div>
      <span className={`shrink-0 font-mono text-[13px] font-medium ${color}`}>
        {isNeutral ? '—' : (value > 0 ? '+' : '') + value.toFixed(1)}
      </span>
    </div>
  );
}

function IntentPanel({ selected }: { selected: string }) {
  const predictions = useGhostIntent(selected);
  if (predictions.length === 0) return null;

  return (
    <div className="mt-3 border-t border-white/[0.06] pt-3">
      <p className="mb-2.5 text-[11px] text-white/35">
        After hovering <span className="text-[#c4b5fd]">{BUTTONS.find(b => b.id === selected)?.label}</span>, they'll likely click:
      </p>
      <div className="flex flex-col gap-1.5">
        {predictions.slice(0, 3).map(({ id, probability }) => {
          const btn = BUTTONS.find(b => b.id === id);
          return (
            <div key={id} className="flex items-center gap-2">
              <span className="w-24 shrink-0 truncate text-[11px] text-white/50">{btn?.label ?? id}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#8b5cf6,#c4b5fd)] transition-all duration-500"
                  style={{ width: `${probability * 100}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right font-mono text-[11px] font-medium text-[#c4b5fd]">
                {Math.round(probability * 100)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── More demos ────────────────────────────────────────────────────────────── */

/*
 * Each demo runs in its own nested GhostProvider so its nodes, tiers, and
 * canvas positions are isolated from the main demo and from each other.
 * gridTiers is set to { primaryCount:1, secondaryCount:1 } so the 3-area
 * grid template ("primary secondary" / "primary tertiary") maps 1-to-1 to
 * the three items — no two items ever share the same gridArea.
 * canvasPadding is raised from the default 0.10 to 0.20 so items positioned
 * near the edges of the canvas don't overflow the overflow:hidden boundary.
 */

const GRID_ZONE = 'demo.grid';
const GRID_ITEMS = [
  { id: 'grid-a', label: 'Resolve', icon: '🔧' },
  { id: 'grid-b', label: 'Review',  icon: '📋' },
  { id: 'grid-c', label: 'Deploy',  icon: '🚀' },
];

const TIER_STYLES = {
  primary: {
    wrapper:  'border-[#c4b5fd]/40 bg-[#c4b5fd]/[0.09] hover:bg-[#c4b5fd]/[0.14] shadow-[0_0_28px_rgba(196,181,253,0.10)] hover:shadow-[0_0_36px_rgba(196,181,253,0.18)]',
    badge:    'bg-[#c4b5fd]/[0.20] text-[#c4b5fd] border-[#c4b5fd]/40',
    icon:     'text-5xl',
    label:    'text-[15px] font-semibold text-white/90',
    scoreClr: 'text-[#c4b5fd]',
    badgeTxt: '★ Primary',
  },
  secondary: {
    wrapper:  'border-[#93c5fd]/25 bg-[#93c5fd]/[0.05] hover:bg-[#93c5fd]/[0.09]',
    badge:    'bg-[#93c5fd]/[0.14] text-[#93c5fd]/80 border-[#93c5fd]/25',
    icon:     'text-3xl',
    label:    'text-[13px] font-medium text-white/65',
    scoreClr: 'text-[#93c5fd]/80',
    badgeTxt: 'Secondary',
  },
  tertiary: {
    wrapper:  'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]',
    badge:    'bg-white/[0.06] text-white/28 border-white/[0.08]',
    icon:     'text-2xl',
    label:    'text-[12px] font-medium text-white/40',
    scoreClr: 'text-white/28',
    badgeTxt: 'Tertiary',
  },
} as const;

function GridDemoItem({ id, label, icon }: { id: string; label: string; icon: string }) {
  const tier  = useGhostArea(id);
  const plan  = useGhostPlan();
  const score = plan.emphasis[id] ?? 0;
  const s     = TIER_STYLES[tier] ?? TIER_STYLES.tertiary;

  return (
    <Ghost.Item
      id={id}
      zone={GRID_ZONE}
      className={[
        'flex h-full w-full cursor-pointer select-none flex-col items-center justify-center gap-2.5',
        'rounded-xl border transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]',
        s.wrapper,
      ].join(' ')}
      onClick={() => {}}
    >
      <span className={`leading-none transition-all duration-300 ${s.icon}`}>{icon}</span>
      <span className={`transition-colors duration-200 ${s.label}`}>{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`rounded-full border px-2 py-0.5 font-bold text-[9px] uppercase tracking-widest ${s.badge}`}>
          {s.badgeTxt}
        </span>
        {score > 0.005 && (
          <span className={`font-mono text-[10px] font-medium ${s.scoreClr}`}>
            {Math.round(score * 100)}%
          </span>
        )}
      </div>
    </Ghost.Item>
  );
}

function GravityGridDemo() {
  return (
    <GhostProvider gridTiers={{ primaryCount: 1, secondaryCount: 1 }}>
      <GravityGridDemoInner />
    </GhostProvider>
  );
}

function GravityGridDemoInner() {
  const plan        = useGhostPlan();
  const rankedItems = GRID_ITEMS
    .map(item => ({ ...item, score: plan.emphasis[item.id] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="rounded border border-white/[0.08] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/20">GhostGrid</span>
          </div>
          <p className="mb-0.5 text-[14px] font-medium text-white/80">Gravity Grid</p>
          <p className="text-[12px] leading-relaxed text-white/35">
            Most-clicked wins the <span className="text-[#c4b5fd]">primary</span> (large) area.
            Click any item to compete for it.
          </p>
        </div>

        <div className="shrink-0 flex flex-col gap-1.5">
          {rankedItems.map((item, i) => (
            <div key={item.id} className="flex items-center gap-1.5 text-[10px]">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                i === 0 ? 'bg-[#c4b5fd] shadow-[0_0_5px_#c4b5fd]' :
                i === 1 ? 'bg-[#93c5fd]/60' : 'bg-white/18'
              }`} />
              <span className="w-14 truncate text-white/45">{item.label}</span>
              <span className="w-6 text-right font-mono text-[#c4b5fd]/70">{Math.round(item.score * 100)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4">
        <GhostGrid
          zone={GRID_ZONE}
          gridTemplateAreas={'"primary secondary" "primary tertiary"'}
          gridTemplateColumns="2fr 1fr"
          gridTemplateRows="220px 160px"
          gap="0.625rem"
        >
          {GRID_ITEMS.map(item => <GridDemoItem key={item.id} {...item} />)}
        </GhostGrid>
      </div>

      <p className="px-5 pb-4 text-[11px] leading-relaxed text-white/20">
        Three items compete for three named areas. The leader earns the large left slot and the others cascade below.
      </p>
    </div>
  );
}

/* ── Ghost Canvas ───────────────────────────────────────────────────────────── */

const CANVAS_ZONE = 'demo.canvas';
const CANVAS_ITEMS = [
  { id: 'cv-home',     label: 'Home',     icon: '🏠', color: 'border-[#c4b5fd]/35 bg-[#c4b5fd]/[0.10]' },
  { id: 'cv-chat',     label: 'Chat',     icon: '💬', color: 'border-[#93c5fd]/35 bg-[#93c5fd]/[0.10]' },
  { id: 'cv-files',    label: 'Files',    icon: '📁', color: 'border-[#34d399]/35 bg-[#34d399]/[0.10]' },
  { id: 'cv-calendar', label: 'Calendar', icon: '📅', color: 'border-[#fb923c]/35 bg-[#fb923c]/[0.10]' },
  { id: 'cv-search',   label: 'Search',   icon: '🔍', color: 'border-[#f472b6]/35 bg-[#f472b6]/[0.10]' },
  { id: 'cv-settings', label: 'Settings', icon: '⚙️', color: 'border-white/[0.14] bg-white/[0.04]' },
];

function CanvasDemoItem({ id, label, icon, color }: { id: string; label: string; icon: string; color: string }) {
  const plan  = useGhostPlan();
  const score = plan.emphasis[id] ?? 0;

  return (
    <Ghost.Item
      id={id}
      zone={CANVAS_ZONE}
      className={[
        'flex h-[60px] w-[60px] cursor-pointer select-none flex-col items-center justify-center gap-0.5',
        'rounded-2xl border transition-all duration-200 hover:brightness-125 active:scale-95',
        color,
      ].join(' ')}
      onClick={() => {}}
    >
      <span className="text-xl leading-none">{icon}</span>
      <span className="text-[9px] font-medium leading-none text-white/55">{label}</span>
      {score > 0.04 && (
        <span className="font-mono text-[8px] font-bold leading-none text-white/45">
          {Math.round(score * 100)}%
        </span>
      )}
    </Ghost.Item>
  );
}

function GhostCanvasDemo() {
  return (
    <GhostProvider canvasPadding={0.20}>
      <GhostCanvasDemoInner />
    </GhostProvider>
  );
}

function GhostCanvasDemoInner() {
  const plan      = useGhostPlan();
  const emphasis  = plan.emphasis ?? {};
  const leadingId = [...CANVAS_ITEMS]
    .sort((a, b) => (emphasis[b.id] ?? 0) - (emphasis[a.id] ?? 0))[0]?.id;
  const leadingLabel = CANVAS_ITEMS.find(c => c.id === leadingId)?.label ?? '—';

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="rounded border border-white/[0.08] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/20">GhostCanvas</span>
          </div>
          <p className="mb-0.5 text-[14px] font-medium text-white/80">Gravity Canvas</p>
          <p className="text-[12px] leading-relaxed text-white/35">
            Items drift to positions proportional to their score. Most-used floats toward{' '}
            <span className="text-[#c4b5fd]">top-left</span>.
            Leading: <strong className="text-white/60">{leadingLabel}</strong>
          </p>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1 font-mono text-[10px] text-white/25">
          <span>↖ most used</span>
          <span>↘ least used</span>
        </div>
      </div>

      <div className="p-4">
        <GhostCanvas
          zone={CANVAS_ZONE}
          className="h-[420px] rounded-xl border border-white/[0.06]"
          style={{
            background: '#07070c',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        >
          {CANVAS_ITEMS.map(item => <CanvasDemoItem key={item.id} {...item} />)}
        </GhostCanvas>
      </div>

      <p className="px-5 pb-4 text-[11px] leading-relaxed text-white/20">
        Click or hover any icon to score it. Items animate to new grid positions using spring physics — the leader drifts to the top-left corner.
      </p>
    </div>
  );
}

function MoreSection() {
  return (
    <section>
      <SectionLabel num="03" label="More Primitives" />
      <div className="mt-5 flex flex-col gap-8">
        <GravityGridDemo />
        <GhostCanvasDemo />
      </div>
    </section>
  );
}

/* ── Event stream ──────────────────────────────────────────────────────────── */

function EventSection() {
  const engine = useGhostEngine();
  const plan   = useGhostPlan();
  const [events, setEvents] = useState<GhostEvent[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setEvents(engine.events());
  }, [engine, plan.ts]);

  const typeStyle: Record<string, string> = {
    click: 'bg-[#93c5fd]/[0.14] text-[#93c5fd]',
    hover: 'bg-[#c4b5fd]/[0.14] text-[#c4b5fd]',
    dwell: 'bg-[#34d399]/[0.14] text-[#34d399]',
    miss:  'bg-[#fb923c]/[0.14] text-[#fb923c]',
    rage:  'bg-[#f87171]/[0.14] text-[#f87171] animate-[rage-pulse_1s_ease_infinite]',
  };

  const counts = {
    all:   events.length,
    click: events.filter(e => e.type === 'click').length,
    hover: events.filter(e => e.type === 'hover').length,
    dwell: events.filter(e => e.type === 'dwell').length,
    miss:  events.filter(e => e.type === 'miss').length,
    rage:  events.filter(e => e.type === 'rage').length,
  };

  const visible = filter === 'all' ? events : events.filter(e => e.type === filter);

  return (
    <section>
      <SectionLabel num="04" label="Event Stream" />

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(Object.entries(counts) as [string, number][]).map(([type, n]) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={[
                  'rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium transition-all',
                  filter === type
                    ? 'border-[#c4b5fd]/40 bg-[#c4b5fd]/[0.12] text-[#c4b5fd]'
                    : 'border-white/[0.08] text-white/32 hover:border-white/[0.16] hover:text-white/60',
                ].join(' ')}
              >
                {type === 'all' ? `all (${n})` : `${type} (${n})`}
              </button>
            ))}
          </div>
          <button
            onClick={() => void engine.reset()}
            className="font-mono text-[11px] text-white/28 transition-colors hover:text-[#f87171]"
          >
            clear all
          </button>
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto">
          {visible.length === 0 ? (
            <div className="py-12 text-center text-[12px] text-white/20">
              No events yet — interact with the demos above
            </div>
          ) : (
            [...visible].reverse().map((e, i) => {
              const allBtns = [...BUTTONS, ...GRID_ITEMS, ...CANVAS_ITEMS];
              const btn = allBtns.find(b => b.id === e.id);
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 border-b border-white/[0.04] px-5 py-2.5 last:border-0 hover:bg-white/[0.02]"
                >
                  <span className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide ${typeStyle[e.type] ?? 'bg-white/[0.08] text-white/50'}`}>
                    {e.type}
                  </span>
                  <span className="shrink-0 text-[13px] font-medium text-white/70">{btn?.label ?? e.id}</span>
                  {e.ms  != null && <span className="font-mono text-[11px] text-white/25">{e.ms}ms</span>}
                  {e.dx  != null && <span className="font-mono text-[11px] text-white/25">x:{e.dx} y:{e.dy}</span>}
                  {e.regret && (
                    <span className="rounded-full bg-[#fb923c]/[0.12] px-2 py-0.5 text-[10px] font-medium text-[#fb923c]">
                      changed mind
                    </span>
                  )}
                  <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-white/20">
                    {new Date(e.ts).toLocaleTimeString()}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Shared ────────────────────────────────────────────────────────────────── */

function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#8a8a98]">
      <span className="h-px w-6 bg-white/[0.16]" />
      {num} / {label}
    </div>
  );
}
