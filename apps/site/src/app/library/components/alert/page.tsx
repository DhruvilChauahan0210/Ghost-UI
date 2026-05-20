import type { Metadata } from 'next';
import { CodePreview } from '../../CodePreview';
import { InstallCommand } from '../../InstallCommand';

export const metadata: Metadata = {
  title: 'Alert — Ghost UI Library',
  description: 'Contextual messages for surfacing info, success, warning, and error states.',
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

export default function AlertPage() {
  return (
    <div className="px-[clamp(24px,4vw,56px)] py-[clamp(40px,6vw,72px)]">

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-[12px] text-muted" aria-label="breadcrumb">
        <a href="/library" className="transition-colors hover:text-fg">Library</a>
        <span className="text-line-3">/</span>
        <span>Components</span>
        <span className="text-line-3">/</span>
        <span className="text-fg">Alert</span>
      </nav>

      {/* Header */}
      <div className="mb-10 max-w-[640px]">
        <h1 className="mb-3 text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.045em] text-[#f5f5f7]">Alert</h1>
        <p className="text-[15px] leading-[1.65] text-muted">
          Contextual feedback messages for surfacing informational, success, warning, and error states inline in your UI.
        </p>
      </div>

      {/* Install */}
      <div className="mb-10 max-w-[480px]">
        <div className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-2">Installation</div>
        <InstallCommand command="npx @ghost-ui/cli add alert" />
      </div>

      {/* Variants */}
      <div className="flex flex-col gap-10 max-w-[860px]">

        {/* Info */}
        <ComponentSection
          title="Info"
          description="General informational alerts — neutral in tone, non-critical. Use role='status' for non-urgent information."
        >
          <CodePreview
            preview={
              <div role="status" className="flex w-full items-start gap-3 rounded-xl border border-sky-400/[0.22] bg-sky-400/[0.07] px-4 py-3.5">
                <svg className="mt-px h-[16px] w-[16px] flex-shrink-0 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                <p className="text-[13px] leading-[1.5] text-sky-200">
                  Your plan resets on the 1st of every month. Unused credits do not carry over.
                </p>
              </div>
            }
            react={`<div role="status" className="flex items-start gap-3 rounded-xl border border-sky-400/[0.22] bg-sky-400/[0.07] px-4 py-3.5">
  <InfoIcon className="mt-px h-4 w-4 flex-shrink-0 text-sky-300" aria-hidden />
  <p className="text-[13px] leading-[1.5] text-sky-200">
    Your plan resets on the 1st of every month. Unused credits do not carry over.
  </p>
</div>`}
            html={`<div class="alert alert-info" role="status">
  <!-- info icon svg -->
  <p>Your plan resets on the 1st of every month.</p>
</div>`}
            css={`.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-radius: 12px;
  border: 1px solid transparent;
  padding: 14px 16px;
  font-size: 13px;
  line-height: 1.5;
}
.alert-info {
  border-color: rgba(56,189,248,0.22);
  background: rgba(56,189,248,0.07);
  color: #bae6fd;
}`}
          />
        </ComponentSection>

        {/* Success */}
        <ComponentSection
          title="Success"
          description="Confirm completed actions or positive outcomes. Keep messages brief and action-focused."
        >
          <CodePreview
            preview={
              <div role="status" className="flex w-full items-start gap-3 rounded-xl border border-emerald-400/[0.22] bg-emerald-400/[0.07] px-4 py-3.5">
                <svg className="mt-px h-[16px] w-[16px] flex-shrink-0 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <p className="text-[13px] leading-[1.5] text-emerald-200">
                  Deployment succeeded. Your changes are live at{' '}
                  <span className="font-mono text-[12px] text-emerald-300">ghost-ui.dev</span>.
                </p>
              </div>
            }
            react={`<div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-400/[0.22] bg-emerald-400/[0.07] px-4 py-3.5">
  <CheckCircleIcon className="mt-px h-4 w-4 flex-shrink-0 text-emerald-300" aria-hidden />
  <p className="text-[13px] leading-[1.5] text-emerald-200">
    Deployment succeeded. Your changes are live at{' '}
    <code className="font-mono text-[12px] text-emerald-300">ghost-ui.dev</code>.
  </p>
</div>`}
            html={`<div class="alert alert-success" role="status">
  <!-- check-circle icon svg -->
  <p>Deployment succeeded.</p>
</div>`}
            css={`.alert-success {
  border-color: rgba(52,211,153,0.22);
  background: rgba(52,211,153,0.07);
  color: #a7f3d0;
}`}
          />
        </ComponentSection>

        {/* Warning */}
        <ComponentSection
          title="Warning"
          description="Signal degraded states or actions that need attention before continuing. Non-blocking by nature."
        >
          <CodePreview
            preview={
              <div role="alert" className="flex w-full items-start gap-3 rounded-xl border border-amber-400/[0.24] bg-amber-400/[0.07] px-4 py-3.5">
                <svg className="mt-px h-[16px] w-[16px] flex-shrink-0 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                <p className="text-[13px] leading-[1.5] text-amber-200">
                  Storage is at 87% capacity. Consider upgrading your plan to avoid service interruption.
                </p>
              </div>
            }
            react={`<div role="alert" className="flex items-start gap-3 rounded-xl border border-amber-400/[0.24] bg-amber-400/[0.07] px-4 py-3.5">
  <TriangleAlertIcon className="mt-px h-4 w-4 flex-shrink-0 text-amber-300" aria-hidden />
  <p className="text-[13px] leading-[1.5] text-amber-200">
    Storage is at 87% capacity. Consider upgrading your plan.
  </p>
</div>`}
            html={`<div class="alert alert-warning" role="alert">
  <!-- triangle-alert icon svg -->
  <p>Storage is at 87% capacity.</p>
</div>`}
            css={`.alert-warning {
  border-color: rgba(251,191,36,0.24);
  background: rgba(251,191,36,0.07);
  color: #fde68a;
}`}
          />
        </ComponentSection>

        {/* Destructive */}
        <ComponentSection
          title="Destructive"
          description="Surface errors, failures, and critical system states. Include a recovery path in the message when possible."
        >
          <CodePreview
            preview={
              <div role="alert" className="flex w-full items-start gap-3 rounded-xl border border-red-400/[0.28] bg-red-400/[0.07] px-4 py-3.5">
                <svg className="mt-px h-[16px] w-[16px] flex-shrink-0 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                <p className="text-[13px] leading-[1.5] text-red-200">
                  Payment failed. Your card ending in 4242 was declined. Please update your payment method.
                </p>
              </div>
            }
            react={`<div role="alert" className="flex items-start gap-3 rounded-xl border border-red-400/[0.28] bg-red-400/[0.07] px-4 py-3.5">
  <XCircleIcon className="mt-px h-4 w-4 flex-shrink-0 text-red-300" aria-hidden />
  <p className="text-[13px] leading-[1.5] text-red-200">
    Payment failed. Your card was declined. Please update your payment method.
  </p>
</div>`}
            html={`<div class="alert alert-destructive" role="alert">
  <!-- x-circle icon svg -->
  <p>Payment failed. Please update your payment method.</p>
</div>`}
            css={`.alert-destructive {
  border-color: rgba(248,113,113,0.28);
  background: rgba(248,113,113,0.07);
  color: #fecaca;
}`}
          />
        </ComponentSection>

        {/* With title + body */}
        <ComponentSection
          title="With Icon + Title + Body"
          description="Add a bold title to make longer alerts scannable — the icon, title, and body create a clear visual hierarchy."
        >
          <CodePreview
            preview={
              <div className="flex w-full flex-col gap-3">
                <div role="status" className="flex items-start gap-3 rounded-xl border border-sky-400/[0.22] bg-sky-400/[0.07] px-4 py-4">
                  <svg className="mt-0.5 h-[15px] w-[15px] flex-shrink-0 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  <div>
                    <div className="mb-1 text-[13px] font-semibold tracking-[-0.01em] text-sky-200">
                      New feature available
                    </div>
                    <p className="text-[12.5px] leading-[1.5] text-sky-300/80">
                      Ghost UI v2.0 introduces adaptive slot scoring. Enable it in your{' '}
                      <span className="rounded border border-sky-400/20 bg-sky-400/10 px-1 font-mono text-[11px] text-sky-300">
                        GhostProvider
                      </span>{' '}
                      config.
                    </p>
                  </div>
                </div>
                <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-400/[0.28] bg-red-400/[0.07] px-4 py-4">
                  <svg className="mt-0.5 h-[15px] w-[15px] flex-shrink-0 text-red-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                  <div>
                    <div className="mb-1 text-[13px] font-semibold tracking-[-0.01em] text-red-200">
                      Billing action required
                    </div>
                    <p className="text-[12.5px] leading-[1.5] text-red-300/80">
                      Your subscription expires in 3 days. Update payment details to avoid losing access.
                    </p>
                  </div>
                </div>
              </div>
            }
            react={`<div role="status" className="flex items-start gap-3 rounded-xl border border-sky-400/[0.22] bg-sky-400/[0.07] px-4 py-4">
  <InfoIcon className="mt-0.5 h-[15px] w-[15px] flex-shrink-0 text-sky-300" aria-hidden />
  <div>
    <div className="mb-1 text-[13px] font-semibold tracking-[-0.01em] text-sky-200">
      New feature available
    </div>
    <p className="text-[12.5px] leading-[1.5] text-sky-300/80">
      Ghost UI v2.0 introduces adaptive slot scoring. Enable it in your{' '}
      <code className="rounded border border-sky-400/20 bg-sky-400/10 px-1 font-mono text-[11px] text-sky-300">
        GhostProvider
      </code>{' '}
      config.
    </p>
  </div>
</div>`}
            html={`<div class="alert alert-info" role="status">
  <!-- icon svg -->
  <div class="alert-content">
    <div class="alert-title">New feature available</div>
    <p class="alert-body">Ghost UI v2.0 introduces adaptive slot scoring.</p>
  </div>
</div>`}
            css={`.alert-content { display: flex; flex-direction: column; }
.alert-title {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin-bottom: 4px;
}
.alert-body {
  font-size: 12.5px;
  line-height: 1.5;
  opacity: 0.8;
}`}
          />
        </ComponentSection>

      </div>
    </div>
  );
}
