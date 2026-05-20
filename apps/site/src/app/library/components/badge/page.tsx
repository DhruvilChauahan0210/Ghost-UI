import type { Metadata } from 'next';
import { CodePreview } from '../../CodePreview';
import { InstallCommand } from '../../InstallCommand';

export const metadata: Metadata = {
  title: 'Badge — Ghost UI Library',
  description: 'Small status indicators and labels for categorizing content.',
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

export default function BadgePage() {
  return (
    <div className="px-[clamp(24px,4vw,56px)] py-[clamp(40px,6vw,72px)]">

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-[12px] text-muted" aria-label="breadcrumb">
        <a href="/library" className="transition-colors hover:text-fg">Library</a>
        <span className="text-line-3">/</span>
        <span>Components</span>
        <span className="text-line-3">/</span>
        <span className="text-fg">Badge</span>
      </nav>

      {/* Header */}
      <div className="mb-10 max-w-[640px]">
        <h1 className="mb-3 text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.045em] text-[#f5f5f7]">Badge</h1>
        <p className="text-[15px] leading-[1.65] text-muted">
          Small status indicators and labels for categorising content, displaying counts, or surfacing states at a glance.
          Six variants: default, success, warning, destructive, outline, and dot.
        </p>
      </div>

      {/* Install */}
      <div className="mb-10 max-w-[480px]">
        <div className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-2">Installation</div>
        <InstallCommand command="npx @ghost-ui/cli add badge" />
      </div>

      {/* Variants */}
      <div className="flex flex-col gap-10 max-w-[860px]">

        {/* Default */}
        <ComponentSection
          title="Default"
          description="The standard badge style — neutral and subdued. Use for tags, categories, or generic labels."
        >
          <CodePreview
            preview={
              <span className="inline-flex items-center rounded-full border border-white/[0.10] bg-white/[0.06] px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.02em] text-[#ededf0]">
                Default
              </span>
            }
            react={`function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/[0.10] bg-white/[0.06] px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.02em] text-[#ededf0]">
      {children}
    </span>
  );
}

<Badge>Default</Badge>`}
            html={`<span class="badge">Default</span>`}
            css={`.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.06);
  padding: 2px 10px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #ededf0;
}`}
          />
        </ComponentSection>

        {/* Success */}
        <ComponentSection
          title="Success"
          description="Use to indicate a positive state — active, completed, or verified."
        >
          <CodePreview
            preview={
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/[0.22] bg-emerald-400/[0.10] px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.02em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Active
              </span>
            }
            react={`<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/[0.22] bg-emerald-400/[0.10] px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.02em] text-emerald-300">
  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
  Active
</span>`}
            html={`<span class="badge-success">
  <span class="badge-dot"></span>
  Active
</span>`}
            css={`.badge-success {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 9999px;
  border: 1px solid rgba(52,211,153,0.22);
  background: rgba(52,211,153,0.10);
  padding: 2px 10px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #6ee7b7;
}
.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34d399;
}`}
          />
        </ComponentSection>

        {/* Warning */}
        <ComponentSection
          title="Warning"
          description="Draws attention to items that need review or are in a degraded state."
        >
          <CodePreview
            preview={
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/[0.24] bg-amber-400/[0.10] px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.02em] text-amber-300">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                Degraded
              </span>
            }
            react={`<span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/[0.24] bg-amber-400/[0.10] px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.02em] text-amber-300">
  <TriangleAlertIcon className="h-[10px] w-[10px]" />
  Degraded
</span>`}
            html={`<span class="badge-warning">
  <!-- warning icon svg -->
  Degraded
</span>`}
            css={`.badge-warning {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 9999px;
  border: 1px solid rgba(251,191,36,0.24);
  background: rgba(251,191,36,0.10);
  padding: 2px 10px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #fcd34d;
}`}
          />
        </ComponentSection>

        {/* Destructive */}
        <ComponentSection
          title="Destructive"
          description="Reserved for errors, failures, or critical states requiring immediate attention."
        >
          <CodePreview
            preview={
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/[0.24] bg-red-400/[0.10] px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.02em] text-red-300">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Failed
              </span>
            }
            react={`<span className="inline-flex items-center gap-1.5 rounded-full border border-red-400/[0.24] bg-red-400/[0.10] px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.02em] text-red-300">
  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
  Failed
</span>`}
            html={`<span class="badge-destructive">
  <span class="badge-dot"></span>
  Failed
</span>`}
            css={`.badge-destructive {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 9999px;
  border: 1px solid rgba(248,113,113,0.24);
  background: rgba(248,113,113,0.10);
  padding: 2px 10px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #fca5a5;
}
.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f87171;
}`}
          />
        </ComponentSection>

        {/* Outline */}
        <ComponentSection
          title="Outline"
          description="A minimal badge with only a border — ideal for secondary labels like version tags or categories."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-accent/[0.40] px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.02em] text-accent">
                  New
                </span>
                <span className="inline-flex items-center rounded-full border border-white/[0.16] px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.02em] text-muted">
                  Beta
                </span>
                <span className="inline-flex items-center rounded-full border border-white/[0.16] px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.02em] text-muted">
                  v2.0.4
                </span>
              </div>
            }
            react={`// Accent outline
<span className="inline-flex items-center rounded-full border border-accent/[0.40] px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.02em] text-accent">
  New
</span>

// Neutral outline
<span className="inline-flex items-center rounded-full border border-white/[0.16] px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-[0.02em] text-muted">
  Beta
</span>`}
            html={`<span class="badge-outline-accent">New</span>
<span class="badge-outline">Beta</span>`}
            css={`.badge-outline-accent {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid rgba(196,181,253,0.40);
  padding: 2px 10px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #c4b5fd;
}
.badge-outline {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.16);
  padding: 2px 10px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #8a8a98;
}`}
          />
        </ComponentSection>

        {/* Dot Badge */}
        <ComponentSection
          title="Dot Badge"
          description="Attach a notification dot to any element to indicate unread or pending content."
        >
          <CodePreview
            preview={
              <div className="flex items-center gap-8">
                <div className="relative inline-flex">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.05] text-muted">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Notifications"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  </div>
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#07070a] bg-accent" />
                </div>
                <div className="relative inline-flex">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.10] bg-white/[0.05] text-muted">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Messages"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#07070a] bg-red-500 font-mono text-[9px] font-bold text-white">
                    3
                  </span>
                </div>
              </div>
            }
            react={`// Dot-only
<div className="relative inline-flex">
  <NotificationIcon />
  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-bg bg-accent" />
</div>

// Count badge
<div className="relative inline-flex">
  <MailIcon />
  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-bg bg-red-500 font-mono text-[9px] font-bold text-white">
    3
  </span>
</div>`}
            html={`<div class="dot-badge-wrapper">
  <!-- your icon element -->
  <span class="dot-badge" aria-label="3 notifications">3</span>
</div>`}
            css={`.dot-badge-wrapper {
  position: relative;
  display: inline-flex;
}
.dot-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  border-radius: 9999px;
  border: 2px solid #07070a;
  background: #ef4444;
  font-family: monospace;
  font-size: 9px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}`}
          />
        </ComponentSection>

      </div>
    </div>
  );
}
