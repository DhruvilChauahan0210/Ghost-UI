import { ButtonEffects } from './ButtonEffects';
import { Counter } from './Counter';
import { InstallTabs } from './InstallTabs';
import { LandingDemo } from './LandingDemo';
import { MagneticButton } from './MagneticButton';
import { MouseTracker } from './MouseTracker';
import { Reveal } from './Reveal';
import { ScrollProgress } from './ScrollProgress';
import { ShowcaseSection } from './ShowcaseSection';
import { TiltCard } from './TiltCard';

const BRAND_MARK = "relative inline-block h-[22px] w-[22px] rounded-md bg-[conic-gradient(from_220deg_at_50%_50%,#c4b5fd,#8b5cf6,#38bdf8,#c4b5fd)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20),0_0_14px_rgba(167,139,250,0.40)] transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] after:absolute after:inset-[5px] after:rounded after:bg-[rgba(10,10,14,0.95)] after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] after:content-['']";
const NAV_LINK = "inline-flex h-full items-center rounded-full px-3 text-[13px] font-medium tracking-[-0.005em] text-muted no-underline transition-colors duration-200 hover:bg-white/[0.04] hover:text-fg";

// .btn class kept as JS hook only (ButtonEffects cursor tracking).
const BTN = "btn group relative isolate inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium text-fg no-underline transition-[transform,background,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:bg-[radial-gradient(160px_circle_at_var(--bx,50%)_var(--by,50%),rgba(196,181,253,0.22),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-200 before:content-[''] hover:border-white/[0.22] hover:bg-white/[0.06] hover:before:opacity-100 [&>*]:relative [&>*]:z-[1]";
const BTN_PRIMARY = "btn group relative isolate inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-[10px] border border-transparent bg-[#ededf0] px-4 py-[11px] text-[14px] font-semibold text-[#0a0a10] no-underline transition-[transform,background,border-color,box-shadow] duration-200 ease-[cubic-bezier(0.2,0.7,0.2,1)] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:bg-[radial-gradient(180px_circle_at_var(--bx,50%)_var(--by,50%),rgba(139,92,246,0.45),transparent_60%)] before:opacity-0 before:[mix-blend-mode:multiply] before:transition-opacity before:duration-200 before:content-[''] hover:bg-white hover:shadow-[0_18px_40px_-16px_rgba(196,181,253,0.55)] hover:before:opacity-100 [&>*]:relative [&>*]:z-[1]";
const ARROW = "inline-block transition-transform duration-200 group-hover:translate-x-[3px]";
const KBD = "rounded-[5px] border border-line-3 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[11px] text-[#d8d8ee]";
const ITALIC_ACCENT = "font-serif font-normal italic tracking-[-0.02em] text-[#d8d0ff] px-[0.04em]";
const SECTION_NUM = "inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted before:h-px before:w-6 before:bg-line-3 before:content-['']";
const SECTION_TITLE = "mt-[18px] mb-[18px] text-balance text-[clamp(36px,5.2vw,72px)] font-medium leading-[0.98] tracking-[-0.045em] text-[#f4f4f7]";
const SECTION_SUB = "m-0 max-w-[56ch] text-[clamp(16px,1.4vw,18px)] leading-[1.55] tracking-[-0.005em] text-[#9c9caf] [&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:text-[#d8d0ff]";
const STAT_V = "font-sans text-[26px] font-medium tracking-[-0.03em] text-[#f4f4f7]";
const STAT_L = "mt-1 text-[12px] tracking-[0.02em] text-muted";

// .viz base — gradient backdrop + repeating column lines + bottom radial dim.
const VIZ = "relative h-[168px] flex-[0_0_168px] overflow-hidden border-b border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.005)),repeating-linear-gradient(90deg,transparent,transparent_31px,rgba(255,255,255,0.02)_31px,rgba(255,255,255,0.02)_32px)] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(closest-side_at_50%_100%,rgba(0,0,0,0.4),transparent_70%)] before:content-['']";
// .feature.feature-rich — bento card body. .feature className kept as JS hook for ButtonEffects cursor tracking.
// before: cursor-glow (uses --bx/--by from ButtonEffects). after: tilt-track glow (uses --tx/--ty from TiltCard).
const FEATURE_RICH = "feature relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.005))] transition-[border-color,background] duration-[240ms] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:bg-[radial-gradient(280px_circle_at_var(--bx,50%)_var(--by,50%),rgba(196,181,253,0.10),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-[280ms] before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:z-[2] after:rounded-[inherit] after:bg-[radial-gradient(220px_circle_at_var(--tx,50%)_var(--ty,50%),rgba(255,255,255,0.06),transparent_60%)] after:opacity-0 after:transition-opacity after:duration-[280ms] after:content-[''] hover:border-line-3 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] hover:before:opacity-100 hover:after:opacity-100 [&>*]:relative [&>*]:z-[1]";

// PrincipleCard — group enables parent-hover triggering for child icon/corner transforms.
const PRINCIPLE_CARD = "group relative isolate flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-[linear-gradient(180deg,rgba(255,255,255,0.028),rgba(255,255,255,0.004))] px-[26px] pt-7 pb-[26px] transition-[border-color,background] duration-[280ms] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:rounded-[inherit] before:bg-[radial-gradient(260px_circle_at_var(--bx,50%)_var(--by,50%),rgba(196,181,253,0.08),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-[320ms] before:content-[''] after:absolute after:left-6 after:top-0 after:z-[2] after:h-px after:w-0 after:bg-[linear-gradient(90deg,transparent,#c4b5fd,transparent)] after:transition-[width] after:duration-700 after:ease-[cubic-bezier(0.2,0.7,0.2,1)] after:content-[''] hover:border-line-3 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.008))] hover:before:opacity-100 hover:after:w-[calc(100%-48px)] [&>*]:relative [&>*]:z-[1]";
const PRINCIPLE_NUM = "mb-7 inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted after:h-px after:w-7 after:bg-line-3 after:content-['']";
const PRINCIPLE_ICON = "relative mb-[18px] inline-flex h-[42px] w-[42px] items-center justify-center rounded-[11px] border border-accent/[0.22] bg-[linear-gradient(180deg,rgba(196,181,253,0.18),rgba(196,181,253,0.04))] text-accent transition-[transform,border-color,box-shadow] duration-[380ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] after:pointer-events-none after:absolute after:-inset-1.5 after:z-[-1] after:rounded-[14px] after:bg-[radial-gradient(closest-side,rgba(196,181,253,0.30),transparent_70%)] after:opacity-0 after:transition-opacity after:duration-[320ms] after:[filter:blur(8px)] after:content-[''] group-hover:-translate-y-0.5 group-hover:border-accent/50 group-hover:shadow-[inset_0_0_0_1px_rgba(196,181,253,0.12)] group-hover:after:opacity-100";
const PRINCIPLE_TITLE = "m-0 mb-2.5 text-[19px] font-medium leading-[1.2] tracking-[-0.022em] text-[#f4f4f7] [&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:tracking-[-0.02em] [&_em]:text-[#d8d0ff]";
const PRINCIPLE_BODY = "m-0 flex-1 text-[14px] leading-[1.55] text-muted";
const PRINCIPLE_CORNER = "pointer-events-none !absolute top-4 right-4 z-[1] h-12 w-12 text-accent opacity-[0.18] transition-[opacity,transform] duration-[380ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:rotate-[8deg] group-hover:opacity-[0.4]";

const FOOT_H4 = "mb-[18px] font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-fg";
const FOOT_LINK = "relative flex w-fit items-center gap-1.5 py-[7px] text-[14px] tracking-[-0.005em] text-muted no-underline transition-colors duration-200 hover:text-fg after:inline-block after:-ml-0.5 after:-translate-x-1.5 after:text-accent after:opacity-0 after:transition-all after:duration-200 after:content-['→'] hover:after:ml-1 hover:after:translate-x-0 hover:after:opacity-100";
const FOOT_EXT = "ml-1.5 font-mono text-[10px] tracking-[0.04em] text-muted";

const SNIPPET_PLAIN = `import { GhostProvider, Ghost } from '@ghost-ui/react';

// the buttons reorder themselves by learned score
<GhostProvider>
  <Ghost.Slot zone="hero.cta">
    <Ghost.Button id="signup" zone="hero.cta">Sign up</Ghost.Button>
    <Ghost.Button id="docs"   zone="hero.cta">Docs</Ghost.Button>
    <Ghost.Button id="github" zone="hero.cta" pinned>GitHub</Ghost.Button>
  </Ghost.Slot>
</GhostProvider>`;

// Syntax token classes (Tailwind utilities baked into the generated HTML).
const SK = "text-accent";
const SS = "text-emerald-300";
const SC = "italic text-muted-2";
const ST = "text-fuchsia-300";
const SA = "text-amber-400";
const SLN = "inline-block w-6 mr-4 text-right select-none text-white/[0.18]";

const SNIPPET_LINES: string[] = [
  `<span class="${SK}">import</span> { GhostProvider, Ghost } <span class="${SK}">from</span> <span class="${SS}">'@ghost-ui/react'</span>;`,
  ``,
  `<span class="${SC}">// the buttons reorder themselves by learned score</span>`,
  `&lt;<span class="${ST}">GhostProvider</span>&gt;`,
  `  &lt;<span class="${ST}">Ghost.Slot</span> <span class="${SA}">zone</span>=<span class="${SS}">"hero.cta"</span>&gt;`,
  `    &lt;<span class="${ST}">Ghost.Button</span> <span class="${SA}">id</span>=<span class="${SS}">"signup"</span> <span class="${SA}">zone</span>=<span class="${SS}">"hero.cta"</span>&gt;Sign up&lt;/&gt;`,
  `    &lt;<span class="${ST}">Ghost.Button</span> <span class="${SA}">id</span>=<span class="${SS}">"docs"</span>   <span class="${SA}">zone</span>=<span class="${SS}">"hero.cta"</span>&gt;Docs&lt;/&gt;`,
  `    &lt;<span class="${ST}">Ghost.Button</span> <span class="${SA}">id</span>=<span class="${SS}">"github"</span> <span class="${SA}">zone</span>=<span class="${SS}">"hero.cta"</span> <span class="${SA}">pinned</span>&gt;GitHub&lt;/&gt;`,
  `  &lt;/<span class="${ST}">Ghost.Slot</span>&gt;`,
  `&lt;/<span class="${ST}">GhostProvider</span>&gt;`,
];
const SNIPPET_HTML = SNIPPET_LINES.map(
  (l, i) => `<span class="${SLN}">${String(i + 1).padStart(2, ' ')}</span>${l}`,
).join('\n');

export default function Page() {
  return (
    <>
      <ScrollProgress />
      <ButtonEffects />
      <MouseTracker />

      <header className="fixed top-[18px] left-1/2 z-[60] inline-flex -translate-x-1/2 items-center rounded-full border border-white/[0.08] bg-[rgba(10,10,14,0.72)] p-[5px] shadow-[0_12px_38px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[22px] backdrop-saturate-[160%] transition-[border-color,box-shadow,top] duration-200 hover:border-white/[0.14] hover:shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_32px_rgba(167,139,250,0.10),inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="flex h-[38px] items-center">
          <a className="group inline-flex h-full items-center gap-[9px] rounded-full pl-1.5 pr-3 text-[13.5px] font-medium tracking-[-0.012em] text-fg no-underline transition-colors duration-200 hover:bg-white/[0.03]" href="#top">
            <span className={`${BRAND_MARK} group-hover:rotate-45`} aria-hidden />
            <span>Ghost UI</span>
            <span className="rounded-full border border-accent/[0.24] bg-accent/[0.12] px-1.5 py-px font-mono text-[9.5px] font-medium uppercase tracking-[0.04em] text-accent">v0.1</span>
          </a>
          <span className="mx-1 h-5 w-px bg-line-2 max-[720px]:hidden" aria-hidden />
          <nav className="flex h-full items-center gap-px px-0.5 max-[720px]:hidden">
            <a className={NAV_LINK} href="#how-it-works">How it works</a>
            <a className={NAV_LINK} href="#how">Architecture</a>
            <a className={NAV_LINK} href="#install">Install</a>
            <a className={NAV_LINK} href="#principles">Principles</a>
            <a className={NAV_LINK} href="#showcase">Showcase</a>
            <a className="inline-flex h-full items-center rounded-full px-3 text-[13px] font-medium tracking-[-0.005em] text-accent no-underline transition-colors duration-200 hover:bg-accent/[0.08]" href="/library">Library</a>
          </nav>
          <span className="mx-1 h-5 w-px bg-line-2" aria-hidden />
          <a
            className="nav-cta relative isolate inline-flex h-full items-center gap-[7px] overflow-hidden rounded-full border border-accent/[0.28] bg-[linear-gradient(180deg,rgba(196,181,253,0.16),rgba(196,181,253,0.04))] px-3.5 text-[13px] font-medium tracking-[-0.005em] text-[#f4f0ff] no-underline transition-[background,border-color] duration-200 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(140px_circle_at_var(--bx,50%)_var(--by,50%),rgba(196,181,253,0.30),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-200 before:content-[''] hover:border-accent/50 hover:bg-[linear-gradient(180deg,rgba(196,181,253,0.24),rgba(196,181,253,0.06))] hover:before:opacity-100 [&>*]:relative [&>*]:z-[1]"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="text-[12px] text-[#fbbf24]" aria-hidden="true">★</span>
            <span>Star</span>
            <span className="font-mono text-[11px] font-medium tabular-nums text-white/60">1.2k</span>
          </a>
        </div>
      </header>

      <main>
        <section className="relative mx-auto max-w-(--container-site) px-[clamp(20px,4vw,32px)] pt-[clamp(72px,9vw,124px)] pb-[72px] text-center">
          <div className="relative z-[2] mx-auto max-w-[880px]">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-line-2 bg-white/[0.025] px-[11px] py-[5px] font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#34d399] shadow-[0_0_10px_#34d399] animate-[live-pulse_2s_ease-in-out_infinite] motion-reduce:animate-none" />
                v0.1 · early preview
              </span>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="mt-6 mb-[22px] text-balance text-[clamp(54px,9.4vw,124px)] font-medium leading-[0.92] tracking-[-0.055em] text-[#f5f5f7] [font-feature-settings:'ss01','ss02','cv11','cv05'] [&_em]:bg-[linear-gradient(180deg,#f0e9ff_0%,#c4b5fd_100%)] [&_em]:bg-clip-text [&_em]:px-[0.04em] [&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:tracking-[-0.025em] [&_em]:text-transparent">
                Interfaces that <em>learn.</em>
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="m-0 mx-auto max-w-[56ch] text-pretty text-[clamp(17px,1.5vw,20px)] leading-[1.55] tracking-[-0.008em] text-[#b6b6c4] [&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:text-[#e0d8ff] [&_code]:rounded-md [&_code]:border [&_code]:border-line-2 [&_code]:bg-white/[0.04] [&_code]:px-[7px] [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.88em] [&_code]:text-[#d8d8ee]">
                A self-optimizing UI engine for React. Drop in <code>&lt;Ghost.Button&gt;</code> and{' '}
                <code>&lt;Ghost.Slot&gt;</code> — the layout rearranges itself around each user&rsquo;s muscle memory.{' '}
                <em>No analytics. No A/B platform. No server.</em>
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
                <MagneticButton href="https://github.com/" className={BTN_PRIMARY}>
                  Star on GitHub <span className={ARROW}>→</span>
                </MagneticButton>
                <a className={BTN} href="#install">
                  Read the docs
                </a>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[13px] text-muted">
                <span>Use the app below — the toolbar learns your habits.</span>
                <span className="text-white/[0.18]">·</span>
                <span>Press <span className={KBD}>⌘ .</span> for devtools.</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={3}>
            <div className="relative z-[2] mt-[clamp(56px,7vw,96px)]">
              <MacWindow />
            </div>
          </Reveal>
        </section>

        <section className="mx-auto max-w-(--container-site) px-[clamp(20px,4vw,32px)]">
          <div className="mt-16 grid grid-cols-4 border-y border-line max-[720px]:grid-cols-2 [&>div]:border-line [&>div]:border-r [&>div]:px-6 [&>div]:py-[22px] [&>div:last-child]:border-r-0 max-[720px]:[&>div:nth-child(2)]:border-r-0 max-[720px]:[&>div:nth-child(-n+2)]:border-b">
            <div>
              <div className={STAT_V}><Counter value={5} suffix=" KB" /></div>
              <div className={STAT_L}>core, gzipped</div>
            </div>
            <div>
              <div className={STAT_V}><Counter value={12} suffix=" KB" /></div>
              <div className={STAT_L}>react bindings</div>
            </div>
            <div>
              <div className={STAT_V}><Counter value={0} suffix=" ms" /></div>
              <div className={STAT_L}>network · runs locally</div>
            </div>
            <div>
              <div className={STAT_V}>MIT</div>
              <div className={STAT_L}>open source</div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-line py-[clamp(80px,10vw,140px)]">
          <div className="mx-auto max-w-(--container-site) px-[clamp(20px,4vw,32px)]">
            <Reveal>
              <div className="mb-14 max-w-[720px]">
                <div className={SECTION_NUM}>01 / How it works</div>
                <h2 className={SECTION_TITLE}>
                  Four steps. <span className={ITALIC_ACCENT}>Zero</span> servers.
                </h2>
                <p className={SECTION_SUB}>
                  Every interaction stays on-device. Ghost observes, scores, reorders — and remembers — without touching a network.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="grid grid-cols-4 overflow-hidden rounded-2xl border border-line bg-[#0a0a0f] max-[980px]:grid-cols-2 max-[540px]:grid-cols-1 [&>div]:border-line [&>div]:border-r [&>div:last-child]:border-r-0 max-[980px]:[&>div:nth-child(2)]:border-r-0 max-[980px]:[&>div:nth-child(-n+2)]:border-b max-[540px]:[&>div]:border-r-0 max-[540px]:[&>div]:border-b max-[540px]:[&>div:last-child]:border-b-0">
                <HiwCard
                  step="01"
                  icon={<HiwCursorIcon />}
                  title="You click"
                  body="Events are captured in a local ring buffer — clicks, hovers, dwell time, near-misses. Zero network requests, ever."
                  viz={<HiwClickViz />}
                />
                <HiwCard
                  step="02"
                  icon={<HiwChartIcon />}
                  title="Scores update"
                  body="A half-life decay function recalculates each button's score. Recent interactions weigh more than old ones."
                  viz={<HiwScoreViz />}
                />
                <HiwCard
                  step="03"
                  icon={<HiwShuffleIcon />}
                  title="Layout reorders"
                  body="The optimizer runs its pure scoring function and promotes the highest-scoring item to position one."
                  viz={<HiwReorderViz />}
                />
                <HiwCard
                  step="04"
                  icon={<HiwDbIcon />}
                  title="Persists locally"
                  body="Scores and events are written to localStorage. The layout survives refresh — on every device, with zero servers."
                  viz={<HiwPersistViz />}
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section id="how" className="border-t border-line py-[clamp(80px,10vw,140px)]">
          <div className="mx-auto max-w-(--container-site) px-[clamp(20px,4vw,32px)]">
            <Reveal>
              <div className="mb-14 max-w-[720px]">
                <div className={SECTION_NUM}>02 / Architecture</div>
                <h2 className={SECTION_TITLE}>
                  Three layers. <span className={ITALIC_ACCENT}>Pure</span> functions where it counts.
                </h2>
                <p className={SECTION_SUB}>
                  Five primitives, each with one job. The optimizer is a pure scoring function — easy to test,
                  swap for a Web Worker, or replace with a Rust&#8202;/&#8202;WASM kernel.
                </p>
              </div>
            </Reveal>

            <Reveal delay={1}>
              <div className="grid grid-cols-6 auto-rows-[360px] gap-3.5 max-[980px]:grid-cols-2 max-[639px]:grid-cols-1 max-[639px]:auto-rows-auto">
                <BentoCard
                  span={3}
                  meta="01"
                  title="Observer"
                  body="A ring buffer captures clicks, hovers, dwell, and near-misses. Auto-flags regret when a click is reversed within 3s."
                  icon={<EyeIcon />}
                  viz={<ObserverViz />}
                />
                <BentoCard
                  span={3}
                  meta="02"
                  title="Optimizer"
                  body="Pure scoring function with half-life decay on recency. Pluggable: drop in a Web Worker today, a Rust/WASM kernel tomorrow."
                  icon={<SparkIcon />}
                  viz={<OptimizerViz />}
                />
                <BentoCard
                  span={2}
                  meta="03"
                  title="Layout"
                  body="Motion springs reorder children with layoutId. Zero CLS — changes happen post-interaction."
                  icon={<GridIcon />}
                  viz={<LayoutViz />}
                />
                <BentoCard
                  span={2}
                  meta="04"
                  title="Persistence"
                  body="localStorage by default. Pluggable adapter for IndexedDB, OPFS, or your own backend."
                  icon={<ClockIcon />}
                  viz={<PersistViz />}
                />
                <BentoCard
                  span={2}
                  meta="05"
                  title="Devtools"
                  body={
                    <>
                      Press <span className={KBD}>⌘ .</span> on this page — every node gets a live outline + score.
                    </>
                  }
                  icon={<TerminalIcon />}
                  viz={<DevtoolsViz />}
                />
              </div>
            </Reveal>
          </div>
        </section>

        <section id="install" className="border-t border-line py-[clamp(80px,10vw,140px)]">
          <div className="mx-auto max-w-(--container-site) px-[clamp(20px,4vw,32px)]">
            <Reveal>
              <div className="mb-14 max-w-[720px]">
                <div className={SECTION_NUM}>03 / Install</div>
                <h2 className={SECTION_TITLE}>
                  That&rsquo;s the <span className={ITALIC_ACCENT}>whole</span> API.
                </h2>
                <p className={SECTION_SUB}>
                  Wrap your app in <code>&lt;GhostProvider&gt;</code>, swap a few buttons for{' '}
                  <code>&lt;Ghost.Button&gt;</code>, and the layout starts learning.
                </p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <InstallTabs snippetHtml={SNIPPET_HTML} snippetPlain={SNIPPET_PLAIN} />
            </Reveal>
          </div>
        </section>

        <section id="principles" className="border-t border-line py-[clamp(80px,10vw,140px)]">
          <div className="mx-auto max-w-(--container-site) px-[clamp(20px,4vw,32px)]">
            <Reveal>
              <div className="mb-14 max-w-[720px]">
                <div className={SECTION_NUM}>04 / Principles</div>
                <h2 className={SECTION_TITLE}>
                  Boring choices, on <span className={ITALIC_ACCENT}>purpose.</span>
                </h2>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="grid grid-cols-3 gap-3.5 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
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

        <ShowcaseSection />

        <section className="py-[clamp(80px,10vw,140px)]">
          <div className="mx-auto max-w-(--container-site) px-[clamp(20px,4vw,32px)]">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-line bg-[radial-gradient(800px_400px_at_50%_0%,rgba(139,92,246,0.18),transparent_70%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-[clamp(28px,6vw,64px)] py-[clamp(56px,9vw,96px)] text-center before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(closest-side_at_50%_0%,rgba(196,181,253,0.30),transparent)] before:opacity-[0.55] before:[mix-blend-mode:screen] before:content-['']">
                <div className={SECTION_NUM}>05 / Ship it</div>
                <h2 className="mt-4 mb-[18px] text-balance text-[clamp(40px,6vw,80px)] font-medium leading-[0.98] tracking-[-0.05em] text-[#f6f6f8] [&_em]:bg-[linear-gradient(180deg,#f0e9ff,#c4b5fd)] [&_em]:bg-clip-text [&_em]:px-[0.04em] [&_em]:font-serif [&_em]:font-normal [&_em]:italic [&_em]:tracking-[-0.03em] [&_em]:text-transparent">
                  Ship interfaces that get <em>sharper</em> every visit.
                </h2>
                <p className="mx-auto mb-7 max-w-[56ch] text-[17px] leading-[1.55] tracking-[-0.005em] text-[#a8a8b8]">One npm install. Five lines of JSX. Layouts that earn their keep — on every device, with zero servers.</p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
                  <MagneticButton href="https://github.com/" className={BTN_PRIMARY}>
                    Star on GitHub <span className={ARROW}>→</span>
                  </MagneticButton>
                  <a className={BTN} href="#install">
                    Read the docs <span className={ARROW}>→</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <footer className="relative overflow-hidden border-t border-line pt-18 text-muted before:pointer-events-none before:absolute before:left-1/2 before:top-0 before:h-px before:w-3/5 before:max-w-[600px] before:-translate-x-1/2 before:bg-[linear-gradient(90deg,transparent,rgba(196,181,253,0.6),transparent)] before:[filter:blur(0.5px)] before:content-['']">
          <div className="mx-auto max-w-(--container-site) px-[clamp(20px,4vw,32px)]">
            <div className="grid grid-cols-[2.2fr_1fr_1fr_1fr] items-start gap-12 pb-16 max-[880px]:grid-cols-2 max-[880px]:gap-x-8 max-[880px]:gap-y-9 max-[480px]:grid-cols-1 max-[480px]:gap-7">
              <div className="flex flex-col">
                <a className="mb-4 inline-flex items-center gap-2.5 text-[14px] font-medium text-fg no-underline" href="#top">
                  <span className={BRAND_MARK} aria-hidden />
                  <span>Ghost UI</span>
                </a>
                <p className="m-0 max-w-[38ch] text-[14px] leading-[1.65] tracking-[-0.005em] text-muted">
                  A self-optimizing UI engine for React. Built for the next wave of interfaces — local-first,
                  pure-function core, MIT licensed.
                </p>
              </div>
              <div className="flex flex-col">
                <h4 className={FOOT_H4}>Product</h4>
                <a className={FOOT_LINK} href="#demo">Live demo</a>
                <a className={FOOT_LINK} href="#how">Architecture</a>
                <a className={FOOT_LINK} href="#install">Install</a>
                <a className={FOOT_LINK} href="#principles">Principles</a>
              </div>
              <div className="flex flex-col">
                <h4 className={FOOT_H4}>Packages</h4>
                <a className={FOOT_LINK} href="#">@ghost-ui/core <span className={FOOT_EXT}>5kb</span></a>
                <a className={FOOT_LINK} href="#">@ghost-ui/react <span className={FOOT_EXT}>12kb</span></a>
                <a className={FOOT_LINK} href="#">@ghost-ui/devtools <span className={FOOT_EXT}>6kb</span></a>
              </div>
              <div className="flex flex-col">
                <h4 className={FOOT_H4}>Resources</h4>
                <a className={FOOT_LINK} href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
                <a className={FOOT_LINK} href="https://x.com/" target="_blank" rel="noreferrer">X / Twitter</a>
                <a className={FOOT_LINK} href="#">Changelog</a>
                <a className={FOOT_LINK} href="#">License · MIT</a>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-5 border-t border-line py-6 font-mono text-[12px] tracking-[0.02em] text-muted max-[720px]:flex-col max-[720px]:items-start max-[720px]:gap-3.5">
              <div className="inline-flex flex-wrap items-center gap-3.5">
                <span>© {new Date().getFullYear()} Ghost UI</span>
                <span className="text-white/10">/</span>
                <span>MIT</span>
                <span className="text-white/10">/</span>
                <span className="tabular-nums text-accent">v0.1.0 · build a3f9c2</span>
              </div>
              <div className="inline-flex flex-wrap items-center justify-center gap-3.5">
                <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.04em] text-emerald-300">
                  <span className="inline-block h-1.5 w-1.5 shrink-0 animate-[live-pulse_1.8s_ease-in-out_infinite] rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399] motion-reduce:animate-none" />
                  all systems local · 0&thinsp;ms telemetry
                </span>
              </div>
              <div className="inline-flex flex-wrap items-center gap-3.5">
                <a
                  className="relative isolate inline-flex items-center gap-[7px] overflow-hidden rounded-full border border-line-2 bg-white/[0.025] px-[11px] py-1.5 font-mono text-[11px] uppercase tracking-[0.04em] text-muted no-underline transition-colors duration-200 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(80px_circle_at_50%_50%,rgba(196,181,253,0.18),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-200 before:content-[''] hover:border-accent/35 hover:text-fg hover:before:opacity-100 [&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:[&_svg]:-translate-y-0.5"
                  href="#top"
                >
                  Back to top
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M12 19V5" />
                    <path d="m5 12 7-7 7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pointer-events-none relative overflow-hidden px-3 pt-14 text-center select-none" aria-hidden>
            <span className="-mb-[0.18em] inline-block whitespace-nowrap pb-[0.05em] bg-[radial-gradient(600px_circle_at_var(--mx,50%)_var(--my,50%),rgba(196,181,253,0.95)_0%,rgba(196,181,253,0.22)_30%,rgba(196,181,253,0.06)_100%)] bg-clip-text text-[clamp(72px,19vw,240px)] font-semibold leading-none tracking-[-0.06em] text-transparent">ghost ui</span>
          </div>
        </footer>
      </main>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

function MacWindow() {
  const dotBase = "relative inline-block h-3 w-3 rounded-full shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.25),inset_0_-1px_0_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.30)] [&>svg]:absolute [&>svg]:inset-0 [&>svg]:m-auto [&>svg]:opacity-0 [&>svg]:transition-opacity [&>svg]:duration-[160ms] group-hover:[&>svg]:opacity-100";
  return (
    <div className="relative overflow-hidden rounded-xl bg-[#16161d] shadow-[0_0_0_0.5px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.04),0_30px_80px_-30px_rgba(0,0,0,0.85),0_80px_160px_-40px_rgba(139,92,246,0.32)]">
      <div className="relative flex h-[38px] items-center border-b border-black/55 bg-[linear-gradient(180deg,rgba(60,60,72,0.85)_0%,rgba(36,36,44,0.85)_100%)] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
        <div className="group flex items-center gap-2">
          <span className={`${dotBase} bg-[#ff5f57]`}>
            <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="#4d0000" strokeWidth="1.2" strokeLinecap="round">
              <path d="M2 2 L6 6 M6 2 L2 6" />
            </svg>
          </span>
          <span className={`${dotBase} bg-[#febc2e]`}>
            <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="#663800" strokeWidth="1.4" strokeLinecap="round">
              <path d="M1.5 4 L6.5 4" />
            </svg>
          </span>
          <span className={`${dotBase} bg-[#28c941]`}>
            <svg width="8" height="8" viewBox="0 0 10 10" fill="#004d18">
              <path d="M2 2 L7 2 L2 7 Z M3 8 L8 8 L8 3 Z" />
            </svg>
          </span>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-sans text-[12px] font-medium tracking-[-0.005em] text-white/50">Issues — ghost-ui / core</div>
      </div>
      <div className="mac-body relative bg-[#0c0c14]">
        <LandingDemo />
      </div>
    </div>
  );
}

/* ── Bento ──────────────────────────────────────────────────────────────── */

function BentoCard({
  span,
  meta,
  title,
  body,
  icon,
  viz,
}: {
  span: 2 | 3;
  meta: string;
  title: string;
  body: React.ReactNode;
  icon: React.ReactNode;
  viz: React.ReactNode;
}) {
  const colSpan = span === 3 ? 'col-span-3' : 'col-span-2';
  return (
    <TiltCard className={`${colSpan} h-full transition-transform duration-[420ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] [will-change:transform] max-[980px]:col-span-1 max-[639px]:col-span-full max-[639px]:h-auto`} max={3}>
      <div className={FEATURE_RICH}>
        {viz}
        <div className="flex flex-1 flex-col gap-1.5 px-[26px] pt-6 pb-[26px]">
          <div className="mb-2 inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-[7px] border border-accent/[0.22] bg-accent/[0.10] text-accent" aria-hidden>{icon}</span>
            <span>{meta} · {title}</span>
          </div>
          <h3 className="m-0 mb-1 text-[18px] font-medium tracking-[-0.015em] text-[#f4f4f7]">{title}</h3>
          <p className="m-0 text-[14px] leading-[1.55] text-muted">{body}</p>
        </div>
      </div>
    </TiltCard>
  );
}

function ObserverViz() {
  const evtColors: Record<string, string> = {
    'ev-click': '#c4b5fd',
    'ev-hover': '#93c5fd',
    'ev-dwell': '#fcd34d',
    'ev-miss':  '#fb7185',
  };
  const lanes: Array<{ key: string; cls: string; items: Array<[string, string, string]> }> = [
    {
      key: 'l1',
      cls: 'animate-[lane-scroll_38s_linear_infinite] motion-reduce:animate-none',
      items: [
        ['▲', 'click', 'ev-click'],
        ['◇', 'hover', 'ev-hover'],
        ['▲', 'click', 'ev-click'],
        ['◐', 'dwell', 'ev-dwell'],
        ['↯', 'miss', 'ev-miss'],
      ],
    },
    {
      key: 'l2',
      cls: 'animate-[lane-scroll_46s_linear_infinite_reverse] opacity-[0.55] motion-reduce:animate-none',
      items: [
        ['◇', 'hover', 'ev-hover'],
        ['▲', 'click', 'ev-click'],
        ['◐', 'dwell', 'ev-dwell'],
        ['◇', 'hover', 'ev-hover'],
        ['▲', 'click', 'ev-click'],
      ],
    },
  ];

  return (
    <div className={`${VIZ} flex flex-col justify-center gap-3.5 py-7`}>
      {lanes.map(({ key, cls, items }) => (
        <div key={key} className={`flex w-max gap-2.5 whitespace-nowrap ${cls}`}>
          {[...items, ...items].map(([g, t, kind], i) => (
            <span key={`${key}-${i}`} className="inline-flex items-center gap-1.5 rounded-full border border-line-2 bg-white/[0.025] px-2.5 py-1 font-mono text-[11px] tracking-[-0.005em] text-[#c8c8d6]">
              <span style={{ color: evtColors[kind] ?? 'var(--color-accent)' }}>{g}</span>
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
    <div className={`${VIZ} flex flex-col justify-center gap-3.5 px-[26px] py-7`}>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[1fr_36px] items-center gap-3.5">
          <span className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
            <span
              className="block h-full w-[var(--w,50%)] animate-[opt-breathe_6s_ease-in-out_infinite] rounded-[inherit] bg-[linear-gradient(90deg,#8b5cf6,#c4b5fd)] shadow-[0_0_10px_rgba(167,139,250,0.35)] motion-reduce:animate-none"
              style={{ ['--w' as never]: `${r.w}%` }}
            />
          </span>
          <span className="text-right font-mono text-[11px] tabular-nums text-accent">{r.v}</span>
        </div>
      ))}
    </div>
  );
}

function LayoutViz() {
  const LAY_ROW_BASE = "absolute inset-x-[22px] grid h-6 grid-cols-[7px_1fr_64px_28px] items-center gap-3 rounded-[7px] border border-white/[0.06] bg-white/[0.025] px-3 font-mono text-[11px] text-[#b8b8c8] transition-[background,border-color,box-shadow] duration-500 before:absolute before:-left-px before:top-[5px] before:bottom-[5px] before:w-[3px] before:rounded-full before:bg-[linear-gradient(180deg,#c4b5fd,#8b5cf6)] before:shadow-[0_0_10px_rgba(196,181,253,0.7)] before:opacity-0 before:transition-opacity before:duration-[380ms] before:content-['']";
  const BAR_FILL_BASE = "block h-full rounded-full bg-[linear-gradient(90deg,#8b5cf6,#c4b5fd)] shadow-[0_0_8px_rgba(167,139,250,0.4)]";
  const VAL_BASE = "absolute right-0 top-1/2 -translate-y-1/2 tabular-nums";

  const rows: Array<{
    key: string; dot: string; label: string; v1: string; v2: string;
    rowCls: string; barCls: string; v1Cls: string; v2Cls: string;
  }> = [
    {
      key: 'a', dot: '#c4b5fd', label: 'Sign up', v1: '0.92', v2: '0.72',
      rowCls: 'animate-[lay-a-pos_12s_cubic-bezier(0.5,0,0.5,1)_infinite,lay-a-state_12s_ease_infinite] before:animate-[lay-a-edge_12s_ease_infinite] motion-reduce:animate-none motion-reduce:before:animate-none',
      barCls: 'w-0 animate-[lay-a-bar_12s_ease_infinite] motion-reduce:animate-none',
      v1Cls: 'animate-[lay-show-1_12s_ease_infinite] motion-reduce:animate-none',
      v2Cls: 'animate-[lay-show-2_12s_ease_infinite] motion-reduce:animate-none',
    },
    {
      key: 'b', dot: '#93c5fd', label: 'Read the docs', v1: '0.56', v2: '0.92',
      rowCls: 'animate-[lay-b-pos_12s_cubic-bezier(0.5,0,0.5,1)_infinite,lay-b-state_12s_ease_infinite] before:animate-[lay-b-edge_12s_ease_infinite] motion-reduce:animate-none motion-reduce:before:animate-none',
      barCls: 'w-0 animate-[lay-b-bar_12s_ease_infinite] motion-reduce:animate-none',
      v1Cls: 'animate-[lay-show-1_12s_ease_infinite] motion-reduce:animate-none',
      v2Cls: 'animate-[lay-show-2_12s_ease_infinite] motion-reduce:animate-none',
    },
    {
      key: 'c', dot: '#fcd34d', label: 'Star on GitHub', v1: '0.38', v2: '0.38',
      rowCls: 'top-[76px]',
      barCls: 'w-[38%] transition-[width] duration-700',
      v1Cls: '', v2Cls: '',
    },
    {
      key: 'd', dot: '#fb7185', label: 'See pricing', v1: '0.18', v2: '0.18',
      rowCls: 'top-[106px]',
      barCls: 'w-[18%] transition-[width] duration-700',
      v1Cls: '', v2Cls: '',
    },
  ];

  return (
    <div className={`${VIZ} p-[22px]`}>
      {rows.map((r) => (
        <div key={r.key} className={`${LAY_ROW_BASE} ${r.rowCls}`}>
          <span className="h-[7px] w-[7px] rounded-full shadow-[0_0_0_2px_rgba(0,0,0,0.25)]" style={{ background: r.dot }} />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap font-sans text-[12px] font-medium tracking-[-0.005em] text-fg">{r.label}</span>
          <span className="h-1 overflow-hidden rounded-full bg-white/[0.05]">
            <i className={`${BAR_FILL_BASE} ${r.barCls}`} />
          </span>
          <span className="relative text-right text-accent">
            <span className={`${VAL_BASE} ${r.v1Cls}`}>{r.v1}</span>
            <span className={`${VAL_BASE} ${r.v2Cls}`}>{r.v2}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function PersistViz() {
  const LAYER_BASE = "absolute flex h-6 items-center justify-between rounded-lg border border-line-2 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.005))] px-3 font-mono text-[10px] uppercase tracking-[0.06em] text-muted";
  return (
    <div className={`${VIZ} flex items-center justify-center px-6 py-[18px]`}>
      <div className="relative h-[116px] w-full max-w-[260px]">
        <div className={`${LAYER_BASE} top-0 left-[18px] right-[-10px] opacity-[0.45]`}>
          <span className="text-[#c8c8d6]">OPFS</span>
          <span className="text-muted-2">adapter</span>
        </div>
        <div className={`${LAYER_BASE} top-[14px] left-[9px] right-[-1px] opacity-[0.7]`}>
          <span className="text-[#c8c8d6]">IndexedDB</span>
          <span className="text-muted-2">adapter</span>
        </div>
        <div className="absolute inset-x-0 top-9 z-[2] flex h-20 flex-col justify-between rounded-[10px] border border-accent/[0.32] bg-[linear-gradient(180deg,rgba(196,181,253,0.10),rgba(196,181,253,0.02))] px-3.5 py-3 shadow-[0_0_28px_rgba(167,139,250,0.18),0_12px_28px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="inline-flex items-center gap-2 font-medium tracking-[0.02em] text-fg before:h-1.5 before:w-1.5 before:rounded-full before:bg-[#34d399] before:shadow-[0_0_8px_#34d399] before:animate-[live-pulse_1.6s_ease-in-out_infinite] before:content-[''] motion-reduce:before:animate-none">localStorage</span>
            <span className="tabular-nums text-accent [&_em]:ml-1 [&_em]:text-[10px] [&_em]:not-italic [&_em]:text-muted-2">247<em>events</em></span>
          </div>
          <div className="grid h-2 grid-cols-[repeat(18,1fr)] gap-1 [&>i]:h-full [&>i]:rounded-sm [&>i]:bg-accent/[0.75] [&>i]:shadow-[0_0_4px_rgba(167,139,250,0.5)] [&>i]:animate-[persist-blink_5s_ease-in-out_infinite] motion-reduce:[&>i]:animate-none [&>i:nth-child(n+15)]:bg-white/[0.06] [&>i:nth-child(n+15)]:shadow-none [&>i:nth-child(n+15)]:animate-none">
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
  const DT_LINE = "tracking-[-0.005em] text-[#c8c8d6] animate-[dt-in_6s_ease-in-out_infinite] motion-reduce:animate-none";
  return (
    <div className="relative flex h-[168px] flex-[0_0_168px] flex-col justify-center gap-2 overflow-hidden border-b border-line bg-[linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.15))] px-6 py-[26px] font-mono text-[12px] before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(closest-side_at_50%_100%,rgba(0,0,0,0.4),transparent_70%)] before:content-['']">
      <div className={DT_LINE} style={{ animationDelay: '0s' }}><span className="mr-2 text-accent">▲</span>click<span className="ml-1.5 text-muted-2"> · signup</span><span className="ml-1.5 tabular-nums text-[#fcd34d]">+0.18</span></div>
      <div className={DT_LINE} style={{ animationDelay: '0.6s' }}><span className="mr-2 text-accent">◇</span>hover<span className="ml-1.5 text-muted-2"> · docs</span><span className="ml-1.5 tabular-nums text-[#fcd34d]">+0.04</span></div>
      <div className={DT_LINE} style={{ animationDelay: '1.2s' }}><span className="text-[#34d399]">$</span><span className="ml-1.5 text-muted-2"> ready</span><span className="ml-1 inline-block h-[13px] w-[7px] bg-accent align-[-2px] animate-[dt-blink_1.1s_steps(2)_infinite] motion-reduce:animate-none" /></div>
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
    <TiltCard className="h-full transition-transform duration-[420ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] [will-change:transform]" max={3}>
      <div className={PRINCIPLE_CARD}>
        {corner ? <div className={PRINCIPLE_CORNER} aria-hidden>{corner}</div> : null}
        <div className={PRINCIPLE_NUM}>{num} · {tag}</div>
        <span className={PRINCIPLE_ICON} aria-hidden>{icon}</span>
        <h3 className={PRINCIPLE_TITLE}>{title}</h3>
        <p className={PRINCIPLE_BODY}>{body}</p>
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

function EyeIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>); }
function SparkIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" /></svg>); }
function GridIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 3v18M3 9h18" /></svg>); }
function ClockIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>); }
function TerminalIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6l4 4-4 4M11 16h9" /><rect x="2" y="3" width="20" height="18" rx="2" /></svg>); }

/* ── How it works ───────────────────────────────────────────────────────── */

function HiwCard({
  step,
  icon,
  title,
  body,
  viz,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  viz: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col px-6 pt-7 pb-[26px] transition-colors duration-[280ms] hover:bg-accent/[0.025]">
      <div className="mb-5 flex h-20 items-center justify-center overflow-hidden [&_svg]:h-full [&_svg]:w-full">{viz}</div>
      <div className="mb-2.5 flex items-center gap-2.5">
        <span className="rounded-full border border-accent/[0.22] bg-accent/[0.10] px-[7px] py-0.5 font-mono text-[10px] font-medium tracking-[0.08em] text-accent">{step}</span>
        <span className="inline-flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] border border-accent/[0.18] bg-accent/[0.08] text-accent" aria-hidden>{icon}</span>
      </div>
      <div className="mb-2 text-[14px] font-semibold tracking-[-0.012em] text-[#f4f4f7]">{title}</div>
      <p className="m-0 text-[12px] leading-[1.6] text-muted">{body}</p>
    </div>
  );
}

/* Card 1 — click animation */
function HiwClickViz() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Button shape */}
      <rect
        className="animate-[hiw-btn-press_2s_cubic-bezier(0.2,0.7,0.2,1)_infinite] [transform-origin:60px_40px] motion-reduce:animate-none"
        x="30" y="28" width="60" height="24" rx="6"
        stroke="rgba(196,181,253,0.5)" strokeWidth="1.2"
        fill="rgba(196,181,253,0.08)" />
      <text x="60" y="44" textAnchor="middle" fontSize="9"
        fill="rgba(196,181,253,0.75)" fontFamily="ui-monospace,monospace">Resolve</text>
      {/* +1 badge */}
      <g className="animate-[hiw-badge-float_2s_ease-in-out_infinite] [transform-origin:80px_24px] motion-reduce:animate-none">
        <circle cx="80" cy="24" r="8" fill="rgba(139,92,246,0.85)" />
        <text x="80" y="27.5" textAnchor="middle" fontSize="8"
          fill="#fff" fontFamily="ui-monospace,monospace" fontWeight="600">+1</text>
      </g>
    </svg>
  );
}

/* Card 2 — scores bar chart */
function HiwScoreViz() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Label + bar rows */}
      {/* Row 1 — Resolve (animates wide) */}
      <text x="10" y="24" fontSize="7.5" fill="rgba(255,255,255,0.38)" fontFamily="ui-monospace,monospace">Resolve</text>
      <rect x="52" y="16" width="58" height="9" rx="2" fill="rgba(255,255,255,0.05)" />
      <rect className="animate-[hiw-bar-grow_2s_ease-in-out_infinite] motion-reduce:animate-none" x="52" y="16" height="9" rx="2"
        fill="url(#hiwGrad)" />
      {/* Row 2 — Comment */}
      <text x="10" y="42" fontSize="7.5" fill="rgba(255,255,255,0.38)" fontFamily="ui-monospace,monospace">Comment</text>
      <rect x="52" y="34" width="58" height="9" rx="2" fill="rgba(255,255,255,0.05)" />
      <rect x="52" y="34" width="18" height="9" rx="2" fill="rgba(139,92,246,0.28)" />
      {/* Row 3 — Assign */}
      <text x="10" y="60" fontSize="7.5" fill="rgba(255,255,255,0.38)" fontFamily="ui-monospace,monospace">Assign</text>
      <rect x="52" y="52" width="58" height="9" rx="2" fill="rgba(255,255,255,0.05)" />
      <rect x="52" y="52" width="10" height="9" rx="2" fill="rgba(139,92,246,0.18)" />
      <defs>
        <linearGradient id="hiwGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* Card 3 — layout reorder boxes */
function HiwReorderViz() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Box A */}
      <g className="animate-[hiw-box-a_3s_cubic-bezier(0.5,0,0.5,1)_infinite] motion-reduce:animate-none">
        <rect width="30" height="22" rx="4"
          stroke="rgba(196,181,253,0.55)" strokeWidth="1.2"
          fill="rgba(196,181,253,0.10)" />
        <text x="15" y="15" textAnchor="middle" fontSize="9"
          fill="rgba(196,181,253,0.9)" fontFamily="ui-monospace,monospace" fontWeight="600">A</text>
      </g>
      {/* Box B (static) */}
      <g style={{ transform: 'translate(45px, 29px)' }}>
        <rect width="30" height="22" rx="4"
          stroke="rgba(255,255,255,0.12)" strokeWidth="1.2"
          fill="rgba(255,255,255,0.04)" />
        <text x="15" y="15" textAnchor="middle" fontSize="9"
          fill="rgba(255,255,255,0.45)" fontFamily="ui-monospace,monospace" fontWeight="600">B</text>
      </g>
      {/* Box C */}
      <g className="animate-[hiw-box-c_3s_cubic-bezier(0.5,0,0.5,1)_infinite] motion-reduce:animate-none">
        <rect width="30" height="22" rx="4"
          stroke="rgba(255,255,255,0.12)" strokeWidth="1.2"
          fill="rgba(255,255,255,0.04)" />
        <text x="15" y="15" textAnchor="middle" fontSize="9"
          fill="rgba(255,255,255,0.45)" fontFamily="ui-monospace,monospace" fontWeight="600">C</text>
      </g>
      {/* Arrow */}
      <path className="hiw-arrow" d="M60 40 L78 40" stroke="rgba(196,181,253,0.4)" strokeWidth="1.2" strokeLinecap="round" markerEnd="url(#hiwArrowHead)" />
      <defs>
        <marker id="hiwArrowHead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0 0 L6 3 L0 6 Z" fill="rgba(196,181,253,0.4)" />
        </marker>
      </defs>
    </svg>
  );
}

/* Card 4 — persist storage */
function HiwPersistViz() {
  return (
    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {/* Storage cylinder outline */}
      <ellipse cx="60" cy="22" rx="32" ry="8" stroke="rgba(196,181,253,0.4)" strokeWidth="1.2" fill="rgba(196,181,253,0.06)" />
      <rect x="28" y="22" width="64" height="30" fill="rgba(196,181,253,0.04)" stroke="none" />
      <line x1="28" y1="22" x2="28" y2="52" stroke="rgba(196,181,253,0.4)" strokeWidth="1.2" />
      <line x1="92" y1="22" x2="92" y2="52" stroke="rgba(196,181,253,0.4)" strokeWidth="1.2" />
      <ellipse cx="60" cy="52" rx="32" ry="8" stroke="rgba(196,181,253,0.4)" strokeWidth="1.2" fill="rgba(196,181,253,0.06)" />
      {/* 247 events text */}
      <text x="60" y="40" textAnchor="middle" fontSize="9"
        fill="rgba(196,181,253,0.85)" fontFamily="ui-monospace,monospace" fontWeight="600">247 events</text>
      {/* progress bar */}
      <rect x="36" y="46" width="48" height="4" rx="2" fill="rgba(255,255,255,0.05)" />
      <rect className="animate-[hiw-persist-fill_2.5s_ease-in-out_infinite] motion-reduce:animate-none" x="36" y="46" height="4" rx="2" fill="url(#hiwPGrad)" />
      <defs>
        <linearGradient id="hiwPGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* How it works — step icons */
function HiwCursorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l7.5 18 3-7 7-3z" />
      <path d="M14.5 14.5l4.5 4.5" />
    </svg>
  );
}
function HiwChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20h18M7 20V10M12 20V4M17 20v-6" />
    </svg>
  );
}
function HiwShuffleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h5v5M4 20l16-16" />
      <path d="M21 16v5h-5M4 4l6 6" />
      <path d="M14 14l7 7" />
    </svg>
  );
}
function HiwDbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}
