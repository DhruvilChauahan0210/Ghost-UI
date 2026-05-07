import { ButtonEffects } from './ButtonEffects';
import { CopyButton } from './CopyButton';
import { Counter } from './Counter';
import { HeroFluid } from './HeroFluid';
import { LandingDemo } from './LandingDemo';
import { MagneticButton } from './MagneticButton';
import { MouseTracker } from './MouseTracker';
import { Reveal } from './Reveal';
import { ScrollProgress } from './ScrollProgress';
import { TiltCard } from './TiltCard';

const SNIPPET_PLAIN = `import { GhostProvider, Ghost } from '@ghost-ui/react';

// the buttons reorder themselves by learned score
<GhostProvider>
  <Ghost.Slot zone="hero.cta">
    <Ghost.Button id="signup" zone="hero.cta">Sign up</Ghost.Button>
    <Ghost.Button id="docs"   zone="hero.cta">Docs</Ghost.Button>
    <Ghost.Button id="github" zone="hero.cta" pinned>GitHub</Ghost.Button>
  </Ghost.Slot>
</GhostProvider>`;

const SNIPPET_LINES: string[] = [
  `<span class="k">import</span> { GhostProvider, Ghost } <span class="k">from</span> <span class="s">'@ghost-ui/react'</span>;`,
  ``,
  `<span class="c">// the buttons reorder themselves by learned score</span>`,
  `&lt;<span class="t">GhostProvider</span>&gt;`,
  `  &lt;<span class="t">Ghost.Slot</span> <span class="a">zone</span>=<span class="s">"hero.cta"</span>&gt;`,
  `    &lt;<span class="t">Ghost.Button</span> <span class="a">id</span>=<span class="s">"signup"</span> <span class="a">zone</span>=<span class="s">"hero.cta"</span>&gt;Sign up&lt;/&gt;`,
  `    &lt;<span class="t">Ghost.Button</span> <span class="a">id</span>=<span class="s">"docs"</span>   <span class="a">zone</span>=<span class="s">"hero.cta"</span>&gt;Docs&lt;/&gt;`,
  `    &lt;<span class="t">Ghost.Button</span> <span class="a">id</span>=<span class="s">"github"</span> <span class="a">zone</span>=<span class="s">"hero.cta"</span> <span class="a">pinned</span>&gt;GitHub&lt;/&gt;`,
  `  &lt;/<span class="t">Ghost.Slot</span>&gt;`,
  `&lt;/<span class="t">GhostProvider</span>&gt;`,
];
const SNIPPET_HTML = SNIPPET_LINES.map(
  (l, i) => `<span class="ln">${String(i + 1).padStart(2, ' ')}</span>${l}`,
).join('\n');

export default function Page() {
  return (
    <>
      <HeroFluid />
      <ScrollProgress />
      <ButtonEffects />
      <MouseTracker />

      <header className="nav">
        <div className="nav-inner">
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden />
            <span>Ghost UI</span>
            <span className="brand-version">v0.1</span>
          </a>
          <span className="nav-divider" aria-hidden />
          <nav className="nav-links">
            <a href="#how">Architecture</a>
            <a href="#install">Install</a>
            <a href="#principles">Principles</a>
          </nav>
          <span className="nav-divider" aria-hidden />
          <a className="nav-cta" href="https://github.com/" target="_blank" rel="noreferrer">
            <span className="star">★</span>
            <span>Star</span>
            <span className="count">1.2k</span>
          </a>
        </div>
      </header>

      <main>
        <section className="container hero">
          <div className="hero-text">
            <Reveal>
              <span className="hero-tag"><span className="live" />v0.1 · early preview</span>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="title">
                Interfaces that <em>learn.</em>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="lede">
                A self-optimizing UI engine for React. Drop in <code>&lt;Ghost.Button&gt;</code> and{' '}
                <code>&lt;Ghost.Slot&gt;</code> — the layout rearranges itself around each user&rsquo;s muscle memory.{' '}
                <em>No analytics. No A/B platform. No server.</em>
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="cta-row">
                <MagneticButton href="https://github.com/" className="btn primary">
                  Star on GitHub <span className="arrow">→</span>
                </MagneticButton>
                <a className="btn" href="#install">
                  Read the docs
                </a>
              </div>
              <div className="cta-meta">
                <span>Click any button below — it reorders.</span>
                <span style={{ color: 'var(--muted-2)' }}>·</span>
                <span>Press <span className="kbd">⌘ .</span> for devtools.</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={3}>
            <div className="device-wrap">
              <MacWindow />
            </div>
          </Reveal>
        </section>

        <section className="container">
          <div className="stats">
            <div>
              <div className="stat-v"><Counter value={5} suffix=" KB" /></div>
              <div className="stat-l">core, gzipped</div>
            </div>
            <div>
              <div className="stat-v"><Counter value={12} suffix=" KB" /></div>
              <div className="stat-l">react bindings</div>
            </div>
            <div>
              <div className="stat-v"><Counter value={0} suffix=" ms" /></div>
              <div className="stat-l">network · runs locally</div>
            </div>
            <div>
              <div className="stat-v">MIT</div>
              <div className="stat-l">open source</div>
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <div className="section-num">01 / Architecture</div>
                <h2 className="section-title">
                  Three layers. <span className="italic-accent">Pure</span> functions where it counts.
                </h2>
                <p className="section-sub">
                  Five primitives, each with one job. The optimizer is a pure scoring function — easy to test,
                  swap for a Web Worker, or replace with a Rust&#8202;/&#8202;WASM kernel.
                </p>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="bento-rich">
                <BentoCard
                  className="col-3"
                  meta="01"
                  title="Observer"
                  body="A ring buffer captures clicks, hovers, dwell, and near-misses. Auto-flags regret when a click is reversed within 3s."
                  icon={<EyeIcon />}
                  viz={<ObserverViz />}
                />
                <BentoCard
                  className="col-3"
                  meta="02"
                  title="Optimizer"
                  body="Pure scoring function with half-life decay on recency. Pluggable: drop in a Web Worker today, a Rust/WASM kernel tomorrow."
                  icon={<SparkIcon />}
                  viz={<OptimizerViz />}
                />
                <BentoCard
                  className="col-2"
                  meta="03"
                  title="Layout"
                  body="Motion springs reorder children with layoutId. Zero CLS — changes happen post-interaction."
                  icon={<GridIcon />}
                  viz={<LayoutViz />}
                />
                <BentoCard
                  className="col-2"
                  meta="04"
                  title="Persistence"
                  body="localStorage by default. Pluggable adapter for IndexedDB, OPFS, or your own backend."
                  icon={<ClockIcon />}
                  viz={<PersistViz />}
                />
                <BentoCard
                  className="col-2"
                  meta="05"
                  title="Devtools"
                  body={
                    <>
                      Press <span className="kbd">⌘ .</span> on this page — every node gets a live outline + score.
                    </>
                  }
                  icon={<TerminalIcon />}
                  viz={<DevtoolsViz />}
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section" id="install">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <div className="section-num">02 / Install</div>
                <h2 className="section-title">
                  That&rsquo;s the <span className="italic-accent">whole</span> API.
                </h2>
                <p className="section-sub">
                  Wrap your app in <code>&lt;GhostProvider&gt;</code>, swap a few buttons for{' '}
                  <code>&lt;Ghost.Button&gt;</code>, and the layout starts learning.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="mac mac-code">
                <div className="mac-titlebar">
                  <div className="mac-controls">
                    <span className="mac-dot close" />
                    <span className="mac-dot min" />
                    <span className="mac-dot max" />
                  </div>
                  <div className="mac-title">app/page.tsx — Ghost UI</div>
                </div>
                <div className="code-head">
                  <div className="code-tabs">
                    <span className="code-tab active">app/page.tsx</span>
                    <span className="code-tab">npm</span>
                    <span className="code-tab">pnpm</span>
                  </div>
                  <CopyButton text={SNIPPET_PLAIN} />
                </div>
                <pre className="snippet" dangerouslySetInnerHTML={{ __html: SNIPPET_HTML }} />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section" id="principles">
          <div className="container">
            <Reveal>
              <div className="section-head">
                <div className="section-num">03 / Principles</div>
                <h2 className="section-title">
                  Boring choices, on <span className="italic-accent">purpose.</span>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="principle-grid">
                <PrincipleCard
                  num="01"
                  tag="Locality"
                  icon={<ShieldIcon />}
                  corner={<CornerLockPattern />}
                  title={<>Local&#8209;<em>first.</em></>}
                  body="Behavior data stays in the browser. No telemetry, no backend, no API key — encrypted on the device, gone on reset."
                />
                <PrincipleCard
                  num="02"
                  tag="Stability"
                  icon={<WaveIcon />}
                  corner={<CornerWavePattern />}
                  title={<>Predictable, never <em>haunted.</em></>}
                  body="Layouts shift only after deliberate interaction — never during initial paint. CLS stays at zero on every render."
                />
                <PrincipleCard
                  num="03"
                  tag="Accessibility"
                  icon={<AccessIcon />}
                  corner={<CornerCirclePattern />}
                  title={<>Accessible by <em>default.</em></>}
                  body="Honors prefers-reduced-motion. Tab order is preserved across reorders. Screen-reader announcements for layout shifts."
                />
                <PrincipleCard
                  num="04"
                  tag="Purity"
                  icon={<FuncIcon />}
                  corner={<CornerGridPattern />}
                  title={<>Pure&#8209;function <em>core.</em></>}
                  body="The optimizer is side-effect-free — (events, nodes) → plan. Trivial to test, port, or run in a Worker / WASM kernel."
                />
                <PrincipleCard
                  num="05"
                  tag="Invisibility"
                  icon={<SparkleIcon />}
                  corner={<CornerStarPattern />}
                  title={<>Boring, until it <em>isn&rsquo;t.</em></>}
                  body="Same components you'd write today. The learning kicks in once events accumulate — your code never knows."
                />
                <PrincipleCard
                  num="06"
                  tag="Production"
                  icon={<ToolIcon />}
                  corner={<CornerSlashPattern />}
                  title={<>Production&#8209;<em>shaped.</em></>}
                  body="Pinned slots, reset hotkey, debounced recompute, pluggable persistence — designed for real apps, not demos."
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section" style={{ borderTop: 'none' }}>
          <div className="container">
            <Reveal>
              <div className="cta-block">
                <div className="section-num" style={{ justifyContent: 'center', display: 'inline-flex' }}>04 / Ship it</div>
                <h2>
                  Ship interfaces that get <em>sharper</em> every visit.
                </h2>
                <p>One npm install. Five lines of JSX. Layouts that earn their keep — on every device, with zero servers.</p>
                <div className="cta-row" style={{ justifyContent: 'center', display: 'inline-flex' }}>
                  <MagneticButton href="https://github.com/" className="btn primary">
                    Star on GitHub <span className="arrow">→</span>
                  </MagneticButton>
                  <a className="btn" href="#install">
                    Read the docs <span className="arrow">→</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <footer>
          <div className="container">
            <div className="foot-grid">
              <div className="foot-col foot-brand">
                <a className="brand" href="#top">
                  <span className="brand-mark" aria-hidden />
                  <span>Ghost UI</span>
                </a>
                <p>
                  A self-optimizing UI engine for React. Built for the next wave of interfaces — local-first,
                  pure-function core, MIT licensed.
                </p>
              </div>
              <div className="foot-col">
                <h5>Product</h5>
                <a href="#demo">Live demo</a>
                <a href="#how">Architecture</a>
                <a href="#install">Install</a>
                <a href="#principles">Principles</a>
              </div>
              <div className="foot-col">
                <h5>Packages</h5>
                <a href="#">@ghost-ui/core <span className="ext">5kb</span></a>
                <a href="#">@ghost-ui/react <span className="ext">12kb</span></a>
                <a href="#">@ghost-ui/devtools <span className="ext">6kb</span></a>
              </div>
              <div className="foot-col">
                <h5>Resources</h5>
                <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
                <a href="https://x.com/" target="_blank" rel="noreferrer">X / Twitter</a>
                <a href="#">Changelog</a>
                <a href="#">License · MIT</a>
              </div>
            </div>

            <div className="foot-meta">
              <div className="left">
                <span>© {new Date().getFullYear()} Ghost UI</span>
                <span className="sep">/</span>
                <span>MIT</span>
                <span className="sep">/</span>
                <span className="build">v0.1.0 · build a3f9c2</span>
              </div>
              <div className="center">
                <span className="foot-status">
                  <span className="pulse" />
                  all systems local · 0&thinsp;ms telemetry
                </span>
              </div>
              <div className="right">
                <a className="back-top" href="#top">
                  Back to top
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 19V5" />
                    <path d="m5 12 7-7 7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="foot-wordmark" aria-hidden>
            <span className="wm-text">ghost ui</span>
          </div>
        </footer>
      </main>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

function MacWindow() {
  return (
    <div className="mac">
      <div className="mac-titlebar">
        <div className="mac-controls">
          <span className="mac-dot close" />
          <span className="mac-dot min" />
          <span className="mac-dot max" />
        </div>
        <div className="mac-title">Ghost UI — Live Dashboard</div>
      </div>
      <div className="mac-toolbar">
        <div className="mac-segment">
          <span className="seg active">Live</span>
          <span className="seg">Events</span>
          <span className="seg">Plan</span>
        </div>
        <div className="mac-url">ghost-ui.dev</div>
        <div className="mac-toolbar-spacer" />
      </div>
      <div className="mac-body">
        <LandingDemo />
      </div>
    </div>
  );
}

/* ── Bento ──────────────────────────────────────────────────────────────── */

function BentoCard({
  className = '',
  meta,
  title,
  body,
  icon,
  viz,
}: {
  className?: string;
  meta: string;
  title: string;
  body: React.ReactNode;
  icon: React.ReactNode;
  viz: React.ReactNode;
}) {
  return (
    <TiltCard className={`tilt-shell ${className}`} max={3}>
      <div className="feature feature-rich">
        {viz}
        <div className="feature-body">
          <div className="meta">
            <span className="icon" aria-hidden>{icon}</span>
            <span>{meta} · {title}</span>
          </div>
          <h3>{title}</h3>
          <p>{body}</p>
        </div>
      </div>
    </TiltCard>
  );
}

function ObserverViz() {
  const lanes: Array<[string, Array<[string, string, string]>]> = [
    [
      'l1',
      [
        ['▲', 'click', 'ev-click'],
        ['◇', 'hover', 'ev-hover'],
        ['▲', 'click', 'ev-click'],
        ['◐', 'dwell', 'ev-dwell'],
        ['↯', 'miss', 'ev-miss'],
      ],
    ],
    [
      'l2',
      [
        ['◇', 'hover', 'ev-hover'],
        ['▲', 'click', 'ev-click'],
        ['◐', 'dwell', 'ev-dwell'],
        ['◇', 'hover', 'ev-hover'],
        ['▲', 'click', 'ev-click'],
      ],
    ],
  ];

  return (
    <div className="viz viz-observer">
      {lanes.map(([cls, items]) => (
        <div key={cls} className={`lane ${cls}`}>
          {[...items, ...items].map(([g, t, kind], i) => (
            <span key={`${cls}-${i}`} className={`evt-pill ${kind}`}>
              <span className="g">{g}</span>
              {t}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function OptimizerViz() {
  const rows: { w: number; v: string }[] = [
    { w: 92, v: '0.92' },
    { w: 61, v: '0.61' },
    { w: 38, v: '0.38' },
    { w: 18, v: '0.18' },
  ];
  return (
    <div className="viz viz-optimizer">
      {rows.map((r, i) => (
        <div key={i} className="opt-row">
          <span className="opt-bar">
            <span style={{ ['--w' as never]: `${r.w}%` }} />
          </span>
          <span className="opt-v">{r.v}</span>
        </div>
      ))}
    </div>
  );
}

function LayoutViz() {
  const rows: { cls: string; dot: string; label: string; v1: string; v2: string }[] = [
    { cls: 'a', dot: '#c4b5fd', label: 'Sign up',        v1: '0.92', v2: '0.72' },
    { cls: 'b', dot: '#93c5fd', label: 'Read the docs',  v1: '0.56', v2: '0.92' },
    { cls: 'c', dot: '#fcd34d', label: 'Star on GitHub', v1: '0.38', v2: '0.38' },
    { cls: 'd', dot: '#fb7185', label: 'See pricing',    v1: '0.18', v2: '0.18' },
  ];
  return (
    <div className="viz viz-layout">
      {rows.map((r) => (
        <div key={r.cls} className={`lay-row ${r.cls}`}>
          <span className="dot" style={{ background: r.dot }} />
          <span className="label">{r.label}</span>
          <span className="bar"><i /></span>
          <span className="v">
            <span className="v1">{r.v1}</span>
            <span className="v2">{r.v2}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function PersistViz() {
  return (
    <div className="viz viz-persist">
      <div className="persist-stack">
        <div className="persist-layer l3">
          <span className="name">OPFS</span>
          <span className="meta">adapter</span>
        </div>
        <div className="persist-layer l2">
          <span className="name">IndexedDB</span>
          <span className="meta">adapter</span>
        </div>
        <div className="persist-active">
          <div className="head">
            <span className="name">localStorage</span>
            <span className="count">247<em>events</em></span>
          </div>
          <div className="persist-bar">
            {Array.from({ length: 18 }).map((_, i) => (
              <i key={i} style={{ animationDelay: `${(i * 80).toFixed(0)}ms` } as never} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DevtoolsViz() {
  return (
    <div className="viz viz-devtools">
      <div className="dt-line l1"><span className="g">▲</span>click<span className="m"> · signup</span><span className="v">+0.18</span></div>
      <div className="dt-line l2"><span className="g">◇</span>hover<span className="m"> · docs</span><span className="v">+0.04</span></div>
      <div className="dt-line l3"><span className="dt-prompt">$</span><span className="m"> ready</span><span className="dt-cursor" /></div>
    </div>
  );
}

/* ── Principle card ─────────────────────────────────────────────────────── */

function PrincipleCard({
  num,
  tag,
  title,
  body,
  icon,
  corner,
}: {
  num: string;
  tag: string;
  title: React.ReactNode;
  body: React.ReactNode;
  icon: React.ReactNode;
  corner?: React.ReactNode;
}) {
  return (
    <TiltCard className="tilt-shell" max={3}>
      <div className="principle-card">
        {corner ? <div className="principle-corner" aria-hidden>{corner}</div> : null}
        <div className="principle-num">{num} · {tag}</div>
        <span className="principle-icon" aria-hidden>{icon}</span>
        <h3 className="principle-title">{title}</h3>
        <p className="principle-body">{body}</p>
      </div>
    </TiltCard>
  );
}

/* Distinct icons per principle */
function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function WaveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c2 0 2-4 4-4s2 8 4 8 2-12 4-12 2 12 4 12 2-4 4-4" />
    </svg>
  );
}
function AccessIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" />
      <path d="M5 9h14" />
      <path d="M9 9v5l-2 7M15 9v5l2 7M9 14h6" />
    </svg>
  );
}
function FuncIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4h-2a3 3 0 0 0-3 3v3H2M4 10v7a3 3 0 0 0 3 3h2M14 8l-3 8M11 12l3-1M22 14h-4M22 10h-4" />
    </svg>
  );
}
function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function ToolIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6 1.5 1.5 6-6a4 4 0 0 0 5.4-5.4l-2.4 2.4-2-2 2.4-2.4z" />
      <circle cx="18" cy="18" r="2.5" />
    </svg>
  );
}

/* Decorative corner glyphs (purely visual, sit top-right of each card) */
function CornerLockPattern() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M16 24h16M16 28h16M16 32h12" />
      <circle cx="24" cy="20" r="6" />
    </svg>
  );
}
function CornerWavePattern() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M4 36c4 0 4-8 8-8s4 8 8 8 4-16 8-16 4 16 8 16 4-8 8-8" />
      <path d="M4 28c4 0 4-8 8-8s4 8 8 8 4-16 8-16 4 16 8 16 4-8 8-8" opacity="0.4" />
    </svg>
  );
}
function CornerCirclePattern() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="24" cy="24" r="20" />
      <circle cx="24" cy="24" r="14" opacity="0.6" />
      <circle cx="24" cy="24" r="8" opacity="0.3" />
    </svg>
  );
}
function CornerGridPattern() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 4 }).map((__, c) => (
          <circle key={`${r}-${c}`} cx={8 + c * 10} cy={8 + r * 10} r="1.2" fill="currentColor" />
        )),
      )}
    </svg>
  );
}
function CornerStarPattern() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M24 8v32M8 24h32M12 12l24 24M36 12 12 36" />
    </svg>
  );
}
function CornerSlashPattern() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
      <path d="M8 40 40 8M14 40 40 14M20 40 40 20M26 40 40 26" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M7 17 17 7" /><path d="M8 7h9v9" />
    </svg>
  );
}
function EyeIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>); }
function SparkIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" /></svg>); }
function GridIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 3v18M3 9h18" /></svg>); }
function ClockIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>); }
function TerminalIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6l4 4-4 4M11 16h9" /><rect x="2" y="3" width="20" height="18" rx="2" /></svg>); }
