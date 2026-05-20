import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Component Library — Ghost UI',
  description: 'Copy-paste accessible, dark-first UI components built with Tailwind CSS and React.',
};

export default function LibraryPage() {
  return (
    <div className="px-[clamp(28px,4vw,64px)] py-[clamp(52px,7vw,88px)]">

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <div className="mb-16">
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#666680]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399]" />
            v0.1 · Component Library
          </span>
        </div>

        <h1 className="mb-5 text-balance text-[clamp(38px,5.5vw,68px)] font-medium leading-[0.96] tracking-[-0.05em] text-[#eaeaf2] [font-feature-settings:'ss01','cv11']">
          Components.{' '}
          <span className="bg-[linear-gradient(135deg,#e0d8ff_0%,#c4b5fd_50%,#8b5cf6_100%)] bg-clip-text text-transparent">
            Beautiful.
          </span>
          <br />
          <span className="font-serif font-normal italic text-[#6a6a84]">Ready to ship.</span>
        </h1>

        <p className="mb-8 max-w-[52ch] text-[15px] leading-[1.70] tracking-[-0.005em] text-[#8888a0]">
          Copy-paste accessible, dark-first React components. Each ships with React,
          HTML, and CSS code — drop directly into your project.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/library/components/button"
            className="inline-flex items-center gap-2 rounded-[10px] border border-transparent bg-[#ededf0] px-4 py-[11px] text-[13.5px] font-semibold text-[#0a0a10] no-underline transition-all duration-200 hover:bg-white hover:shadow-[0_12px_32px_-8px_rgba(196,181,253,0.50)]"
          >
            Browse components
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <Link
            href="/library#install"
            className="inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] bg-white/[0.04] px-4 py-[11px] text-[13.5px] font-medium text-[#9898b0] no-underline transition-all duration-200 hover:border-white/[0.20] hover:bg-white/[0.07] hover:text-[#c0c0d0]"
          >
            Installation guide
          </Link>
        </div>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <div className="mb-16 grid grid-cols-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c14] max-[640px]:grid-cols-2">
        {[
          { v: '50+',  l: 'Components' },
          { v: '100%', l: 'TypeScript' },
          { v: 'WCAG', l: 'Accessible' },
          { v: 'MIT',  l: 'Licensed' },
        ].map((s, i) => (
          <div
            key={s.l}
            className={`px-6 py-5 ${i < 3 ? 'border-r border-white/[0.07]' : ''} max-[640px]:${i < 2 ? 'border-b border-white/[0.07]' : ''}`}
          >
            <div className="text-[24px] font-medium tracking-[-0.03em] text-[#d0d0e0]">{s.v}</div>
            <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#606078]">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── Install ─────────────────────────────────────────────────── */}
      <div id="install" className="mb-16 scroll-mt-24">
        <SectionLabel num="01" label="Install" />
        <h2 className="mb-2 mt-4 text-[clamp(22px,3vw,32px)] font-medium tracking-[-0.035em] text-[#d8d8e8]">
          Zero config setup
        </h2>
        <p className="mb-7 max-w-[50ch] text-[14px] leading-[1.65] text-[#787890]">
          Install once, add any component with a single command. Each is self-contained — copy the source or install via npm.
        </p>

        <div className="max-w-[540px] space-y-2.5">
          {[
            { step: '1', cmd: 'npm install @ghost-ui/react',    label: 'Install package' },
            { step: '2', cmd: 'npx @ghost-ui/cli init',         label: 'Initialise CLI' },
            { step: '3', cmd: 'npx @ghost-ui/cli add button',   label: 'Add a component' },
          ].map(({ step, cmd, label }) => (
            <div key={cmd} className="flex items-stretch gap-3">
              <div className="flex w-6 shrink-0 flex-col items-center pt-3">
                <span className="font-mono text-[10px] font-bold text-[#606078]">{step}</span>
                {step !== '3' && <div className="mt-2 flex-1 w-px bg-white/[0.07]" />}
              </div>
              <div className="flex-1 overflow-hidden rounded-[12px] border border-white/[0.08] bg-[#0c0c14]">
                <div className="border-b border-white/[0.06] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#606078]">{label}</div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="font-mono text-[13px] text-[#606078] select-none">$</span>
                  <code className="font-mono text-[13px] tracking-[-0.005em] text-[#c4b5fd]">{cmd}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Components ──────────────────────────────────────────────── */}
      <div className="mb-16">
        <SectionLabel num="02" label="Components" />
        <h2 className="mb-2 mt-4 text-[clamp(22px,3vw,32px)] font-medium tracking-[-0.035em] text-[#d8d8e8]">
          Browse by category
        </h2>
        <p className="mb-8 max-w-[48ch] text-[14px] leading-[1.65] text-[#787890]">
          Each component ships with live previews, React code, raw HTML, and CSS.
        </p>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
          {COMPONENTS.map(comp => (
            <Link
              key={comp.href}
              href={comp.href}
              className="group relative flex flex-col overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#0c0c14] no-underline transition-all duration-[240ms] hover:border-white/[0.14] hover:bg-[#0f0f1a]"
            >
              {/* Preview */}
              <div
                className="flex min-h-[110px] items-center justify-center p-6"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              >
                <comp.preview />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-3.5">
                <div>
                  <div className="text-[13.5px] font-medium tracking-[-0.015em] text-[#c0c0d0]">{comp.label}</div>
                  <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#606078]">{comp.desc}</div>
                </div>
                <span className="font-mono text-[12px] text-[#525268] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#9898b0]">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Theming ─────────────────────────────────────────────────── */}
      <div id="theming" className="scroll-mt-24">
        <SectionLabel num="03" label="Theming" />
        <h2 className="mb-2 mt-4 text-[clamp(22px,3vw,32px)] font-medium tracking-[-0.035em] text-[#d8d8e8]">
          CSS variables, all the way down
        </h2>
        <p className="mb-6 max-w-[50ch] text-[14px] leading-[1.65] text-[#787890]">
          Every component reads from the Ghost UI token set in your{' '}
          <code className="rounded-md border border-white/[0.10] bg-white/[0.04] px-[7px] py-0.5 font-mono text-[0.88em] text-[#b8b8cc]">globals.css</code>.
          Swap tokens once to retheme everything.
        </p>

        <div className="max-w-[500px] overflow-hidden rounded-[12px] border border-white/[0.08] bg-[#0c0c14]">
          <div className="flex h-9 items-center gap-[6px] border-b border-white/[0.06] bg-[#0e0e18] px-3.5">
            <span className="h-[10px] w-[10px] rounded-full bg-[#ff5f57]" />
            <span className="h-[10px] w-[10px] rounded-full bg-[#febc2e]" />
            <span className="h-[10px] w-[10px] rounded-full bg-[#28c941]" />
            <span className="ml-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-[#606078]">globals.css</span>
          </div>
          <pre className="m-0 overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-[1.75] text-[#9090a8]"><code>{`@theme {
  --color-bg:       #07070a;
  --color-bg-elev:  #0c0c12;
  --color-fg:       #ededf0;
  --color-muted:    #8a8a98;
  --color-accent:   #c4b5fd;
  --color-accent-2: #8b5cf6;
}`}</code></pre>
        </div>
      </div>

    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function SectionLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] font-bold tabular-nums text-[#606078]">{num}</span>
      <span className="h-px w-6 bg-white/[0.08]" aria-hidden />
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.20em] text-[#606078]">{label}</span>
    </div>
  );
}

/* ── Component registry ──────────────────────────────────────────────────── */

const COMPONENTS: {
  label: string;
  href: string;
  desc: string;
  preview: () => React.ReactNode;
}[] = [
  {
    label: 'Button',
    href: '/library/components/button',
    desc: '16 variants',
    preview: () => (
      <div className="flex gap-2.5">
        <span className="inline-flex items-center rounded-[8px] border border-transparent bg-[#ededf0] px-3 py-1.5 text-[12px] font-semibold text-[#0a0a10]">Primary</span>
        <span className="inline-flex items-center rounded-[8px] border border-white/[0.12] bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-[#9898b0]">Ghost</span>
      </div>
    ),
  },
  {
    label: 'Input',
    href: '/library/components/input',
    desc: '6 variants',
    preview: () => (
      <div className="flex w-full max-w-[180px] items-center gap-2 rounded-[9px] border border-white/[0.12] bg-white/[0.04] px-3 py-2.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#666680]" aria-hidden><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
        <span className="text-[12px] text-[#585870]">Search…</span>
      </div>
    ),
  },
  {
    label: 'Badge',
    href: '/library/components/badge',
    desc: '6 variants',
    preview: () => (
      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center rounded-full border border-accent/[0.30] bg-accent/[0.12] px-2.5 py-0.5 font-mono text-[10.5px] font-medium text-accent">Badge</span>
        <span className="inline-flex items-center rounded-full border border-emerald-400/[0.30] bg-emerald-400/[0.10] px-2.5 py-0.5 font-mono text-[10.5px] font-medium text-emerald-400">Live</span>
        <span className="inline-flex items-center gap-1 rounded-full border border-red-400/[0.30] bg-red-400/[0.10] px-2.5 py-0.5 font-mono text-[10.5px] font-medium text-red-400"><span className="h-1.5 w-1.5 rounded-full bg-red-400" />Error</span>
      </div>
    ),
  },
  {
    label: 'Card',
    href: '/library/components/card',
    desc: '4 variants',
    preview: () => (
      <div className="w-full max-w-[180px] rounded-[11px] border border-white/[0.10] bg-[#0e0e1a] p-3.5">
        <div className="mb-2.5 h-1.5 w-14 rounded-full bg-accent/[0.40]" />
        <div className="mb-1.5 h-2 w-full rounded bg-white/[0.08]" />
        <div className="h-2 w-3/4 rounded bg-white/[0.05]" />
      </div>
    ),
  },
  {
    label: 'Avatar',
    href: '/library/components/avatar',
    desc: '4 variants',
    preview: () => (
      <div className="flex -space-x-2.5">
        {[['GU','#c4b5fd'],['AB','#38bdf8'],['CD','#34d399']].map(([init, c]) => (
          <span key={init} className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#07070a] font-mono text-[10px] font-semibold" style={{ background: `${c}22`, color: c }}>
            {init}
          </span>
        ))}
      </div>
    ),
  },
  {
    label: 'Switch',
    href: '/library/components/switch',
    desc: '5 variants',
    preview: () => (
      <div className="flex items-center gap-3">
        <span className="relative inline-block h-[20px] w-[36px] rounded-full border border-accent/[0.40] bg-accent/[0.16]">
          <span className="absolute left-[18px] top-[3px] h-[12px] w-[12px] rounded-full bg-accent shadow-[0_0_6px_rgba(196,181,253,0.6)]" />
        </span>
        <span className="relative inline-block h-[20px] w-[36px] rounded-full border border-white/[0.12] bg-white/[0.05]">
          <span className="absolute left-[3px] top-[3px] h-[12px] w-[12px] rounded-full bg-[#484862]" />
        </span>
      </div>
    ),
  },
  {
    label: 'Alert',
    href: '/library/components/alert',
    desc: '4 variants',
    preview: () => (
      <div className="flex w-full max-w-[200px] items-start gap-2 rounded-[10px] border border-emerald-400/[0.22] bg-emerald-400/[0.07] px-3 py-2.5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-px shrink-0" aria-hidden><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
        <span className="text-[12px] text-emerald-400">Changes saved</span>
      </div>
    ),
  },
  {
    label: 'Select',
    href: '/library/components/select',
    desc: '1 variant',
    preview: () => (
      <div className="flex w-full max-w-[170px] items-center justify-between rounded-[9px] border border-white/[0.12] bg-white/[0.04] px-3 py-2.5">
        <span className="text-[12px] text-[#787890]">Select role…</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#606078]" aria-hidden><path d="m6 9 6 6 6-6" /></svg>
      </div>
    ),
  },
  {
    label: 'Tabs',
    href: '/library/components/tabs',
    desc: '3 variants',
    preview: () => (
      <div className="inline-flex gap-px rounded-full border border-white/[0.09] bg-white/[0.02] p-1">
        {['Overview','Code','Docs'].map((t, i) => (
          <span key={t} className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[10.5px] font-medium tracking-[-0.005em] ${i === 0 ? 'bg-accent/[0.14] text-accent' : 'text-[#585870]'}`}>
            {t}
          </span>
        ))}
      </div>
    ),
  },
];
