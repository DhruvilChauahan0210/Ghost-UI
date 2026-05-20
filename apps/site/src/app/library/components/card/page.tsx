import type { Metadata } from 'next';
import { CodePreview } from '../../CodePreview';
import { InstallCommand } from '../../InstallCommand';

export const metadata: Metadata = {
  title: 'Card — Ghost UI Library',
  description: 'Surface containers for grouping related content with elevation and hierarchy.',
};

function ComponentSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1.5 text-[18px] font-medium tracking-[-0.02em] text-[#f4f4f7]">{title}</h2>
        <p className="text-[13.5px] leading-[1.55] text-muted">{description}</p>
      </div>
      {children}
    </div>
  );
}

export default function CardPage() {
  return (
    <div className="px-[clamp(24px,4vw,56px)] py-[clamp(40px,6vw,72px)]">

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-[12px] text-muted" aria-label="breadcrumb">
        <a href="/library" className="transition-colors hover:text-fg">Library</a>
        <span className="text-line-3">/</span>
        <span>Components</span>
        <span className="text-line-3">/</span>
        <span className="text-fg">Card</span>
      </nav>

      {/* Header */}
      <div className="mb-10 max-w-[640px]">
        <h1 className="mb-3 text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.045em] text-[#f5f5f7]">Card</h1>
        <p className="text-[15px] leading-[1.65] text-muted">
          Surface containers for grouping related content. Four variants: default, interactive (with hover glow), feature (gradient top border), and stat.
        </p>
      </div>

      {/* Install */}
      <div className="mb-10 max-w-[480px]">
        <div className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-2">Installation</div>
        <InstallCommand command="npx @ghost-ui/cli add card" />
      </div>

      {/* Variants */}
      <div className="flex flex-col gap-10 max-w-[860px]">

        {/* Default */}
        <ComponentSection
          title="Default"
          description="A simple surface container — use it to group related information into a distinct, elevated area."
        >
          <CodePreview
            preview={
              <div className="w-full max-w-[340px] rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.005))] p-6">
                <h3 className="mb-2 text-[15px] font-medium tracking-[-0.02em] text-[#f4f4f7]">Card title</h3>
                <p className="text-[13px] leading-[1.55] text-muted">
                  This is a standard card. Use it to group related information into a distinct surface.
                </p>
              </div>
            }
            react={`<div className="rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.005))] p-6">
  <h3 className="mb-2 text-[15px] font-medium tracking-[-0.02em] text-[#f4f4f7]">
    Card title
  </h3>
  <p className="text-[13px] leading-[1.55] text-muted">
    This is a standard card. Use it to group related information.
  </p>
</div>`}
            html={`<div class="card">
  <h3 class="card-title">Card title</h3>
  <p class="card-body">This is a standard card.</p>
</div>`}
            css={`.card {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.06);
  background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.005));
  padding: 24px;
}
.card-title {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: #f4f4f7;
  margin-bottom: 8px;
}
.card-body {
  font-size: 13px;
  line-height: 1.55;
  color: #8a8a98;
}`}
          />
        </ComponentSection>

        {/* Interactive */}
        <ComponentSection
          title="Interactive"
          description="Adds hover glow and border highlight to signal the card is clickable. Use for navigation or selectable items."
        >
          <CodePreview
            preview={
              <div className="group relative isolate w-full max-w-[340px] cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.005))] p-6 transition-[border-color,background,box-shadow] duration-[280ms] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(260px_circle_at_50%_0%,rgba(196,181,253,0.14),transparent_70%)] before:opacity-0 before:transition-opacity before:duration-[280ms] before:content-[''] hover:border-white/[0.16] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] hover:shadow-[0_0_40px_-12px_rgba(167,139,250,0.25)] hover:before:opacity-100 [&>*]:relative [&>*]:z-[1]">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent/[0.22] bg-accent/[0.10] text-accent transition-transform duration-[280ms] group-hover:-translate-y-0.5">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <h3 className="mb-1.5 text-[15px] font-medium tracking-[-0.02em] text-[#f4f4f7]">Interactive card</h3>
                <p className="text-[13px] leading-[1.55] text-muted">Hover to see the glow effect activate on the card surface.</p>
              </div>
            }
            react={`<div className="group relative isolate cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.005))] p-6 transition-[border-color,background,box-shadow] duration-[280ms] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(260px_circle_at_50%_0%,rgba(196,181,253,0.14),transparent_70%)] before:opacity-0 before:transition-opacity before:duration-[280ms] before:content-[''] hover:border-white/[0.16] hover:shadow-[0_0_40px_-12px_rgba(167,139,250,0.25)] hover:before:opacity-100 [&>*]:relative [&>*]:z-[1]">
  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent/[0.22] bg-accent/[0.10] text-accent transition-transform duration-[280ms] group-hover:-translate-y-0.5">
    <ZapIcon className="h-[17px] w-[17px]" />
  </div>
  <h3 className="mb-1.5 text-[15px] font-medium tracking-[-0.02em] text-[#f4f4f7]">
    Interactive card
  </h3>
  <p className="text-[13px] leading-[1.55] text-muted">
    Hover to see the glow effect activate on the card surface.
  </p>
</div>`}
            html={`<div class="card card-interactive">
  <div class="card-icon"><!-- icon --></div>
  <h3 class="card-title">Interactive card</h3>
  <p class="card-body">Hover to see the glow effect.</p>
</div>`}
            css={`.card-interactive {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 280ms, box-shadow 280ms;
}
.card-interactive::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(260px circle at 50% 0%, rgba(196,181,253,0.14), transparent 70%);
  opacity: 0;
  transition: opacity 280ms;
  pointer-events: none;
}
.card-interactive:hover {
  border-color: rgba(255,255,255,0.16);
  box-shadow: 0 0 40px -12px rgba(167,139,250,0.25);
}
.card-interactive:hover::before { opacity: 1; }`}
          />
        </ComponentSection>

        {/* Feature */}
        <ComponentSection
          title="Feature Card"
          description="A gradient accent line at the top signals a premium or highlighted item in a feature grid."
        >
          <CodePreview
            preview={
              <div className="relative w-full max-w-[340px] overflow-hidden rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.005))] p-6 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent_0%,#c4b5fd_30%,#8b5cf6_70%,transparent_100%)] before:content-['']">
                <div className="mb-4 inline-flex items-center rounded-full border border-accent/[0.24] bg-accent/[0.10] px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-accent">
                  Featured
                </div>
                <h3 className="mb-2 text-[17px] font-medium tracking-[-0.025em] text-[#f4f4f7]">
                  Adaptive Layout Engine
                </h3>
                <p className="text-[13px] leading-[1.55] text-muted">
                  Automatically rearranges your UI components based on real user interaction patterns.
                </p>
              </div>
            }
            react={`<div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.005))] p-6 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,#c4b5fd_30%,#8b5cf6_70%,transparent)] before:content-['']">
  <div className="mb-4 inline-flex items-center rounded-full border border-accent/[0.24] bg-accent/[0.10] px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-accent">
    Featured
  </div>
  <h3 className="mb-2 text-[17px] font-medium tracking-[-0.025em] text-[#f4f4f7]">
    Adaptive Layout Engine
  </h3>
  <p className="text-[13px] leading-[1.55] text-muted">
    Automatically rearranges your UI components.
  </p>
</div>`}
            html={`<div class="card card-feature">
  <span class="card-badge">Featured</span>
  <h3 class="card-title">Adaptive Layout Engine</h3>
  <p class="card-body">Automatically rearranges your UI components.</p>
</div>`}
            css={`.card-feature { position: relative; overflow: hidden; }
.card-feature::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c4b5fd 30%, #8b5cf6 70%, transparent);
}
.card-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid rgba(196,181,253,0.24);
  background: rgba(196,181,253,0.10);
  padding: 2px 10px;
  font-family: monospace;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #c4b5fd;
  margin-bottom: 16px;
}`}
          />
        </ComponentSection>

        {/* Stat card */}
        <ComponentSection
          title="Stat Card"
          description="Display a key metric with a label and optional trend indicator. Use in grids for dashboards and overviews."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-start gap-3">
                {[
                  { label: 'Total users', value: '48,291', trend: '+12%', up: true },
                  { label: 'Avg. score', value: '94.3', trend: '-2.1', up: false },
                ].map((stat) => (
                  <div key={stat.label} className="min-w-[160px] flex-1 rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.005))] p-5">
                    <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
                      {stat.label}
                    </div>
                    <div className="flex items-end justify-between gap-2">
                      <span className="text-[28px] font-medium leading-none tracking-[-0.04em] text-[#f4f4f7]">
                        {stat.value}
                      </span>
                      <span className={`mb-0.5 flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] font-medium ${stat.up ? 'bg-emerald-400/[0.10] text-emerald-300' : 'bg-red-400/[0.10] text-red-300'}`}>
                        {stat.up ? '↑' : '↓'} {stat.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            }
            react={`<div className="rounded-2xl border border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.005))] p-5">
  <div className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
    Total users
  </div>
  <div className="flex items-end justify-between gap-2">
    <span className="text-[28px] font-medium leading-none tracking-[-0.04em] text-[#f4f4f7]">
      48,291
    </span>
    <span className="mb-0.5 flex items-center gap-1 rounded-full bg-emerald-400/[0.10] px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-300">
      ↑ +12%
    </span>
  </div>
</div>`}
            html={`<div class="card stat-card">
  <div class="stat-label">Total users</div>
  <div class="stat-row">
    <span class="stat-value">48,291</span>
    <span class="stat-trend stat-up">↑ +12%</span>
  </div>
</div>`}
            css={`.stat-label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8a8a98;
  margin-bottom: 12px;
}
.stat-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 8px; }
.stat-value { font-size: 28px; font-weight: 500; letter-spacing: -0.04em; color: #f4f4f7; line-height: 1; }
.stat-trend { border-radius: 9999px; padding: 2px 8px; font-family: monospace; font-size: 11px; font-weight: 500; }
.stat-up { background: rgba(52,211,153,0.10); color: #6ee7b7; }
.stat-down { background: rgba(248,113,113,0.10); color: #fca5a5; }`}
          />
        </ComponentSection>

      </div>
    </div>
  );
}
