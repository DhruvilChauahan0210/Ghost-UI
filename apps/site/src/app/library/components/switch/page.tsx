'use client';

import { useState } from 'react';
import { CodePreview } from '../../CodePreview';
import { InstallCommand } from '../../InstallCommand';

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

function Switch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dims = {
    sm: { track: 'h-[18px] w-8', thumb: 'h-[14px] w-[14px]', on: 'translate-x-[14px]', off: 'translate-x-[2px]' },
    md: { track: 'h-[22px] w-10', thumb: 'h-[18px] w-[18px]', on: 'translate-x-[18px]', off: 'translate-x-[2px]' },
    lg: { track: 'h-7 w-[52px]', thumb: 'h-[22px] w-[22px]', on: 'translate-x-[24px]', off: 'translate-x-[3px]' },
  }[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        'relative inline-flex flex-shrink-0 cursor-pointer items-center rounded-full border transition-[background,border-color,opacity] duration-200',
        dims.track,
        checked ? 'border-accent/50 bg-accent/[0.22]' : 'border-white/[0.10] bg-white/[0.05]',
        disabled ? 'cursor-not-allowed opacity-40' : '',
      ].filter(Boolean).join(' ')}
    >
      <span
        className={[
          'pointer-events-none inline-block rounded-full shadow-sm transition-transform duration-200',
          dims.thumb,
          checked ? `${dims.on} bg-accent` : `${dims.off} bg-[#8a8a98]`,
        ].join(' ')}
      />
    </button>
  );
}

export default function SwitchPage() {
  const [off, setOff] = useState(false);
  const [on, setOn] = useState(true);
  const [labeled, setLabeled] = useState(false);
  const [sm, setSm] = useState(true);
  const [md, setMd] = useState(true);
  const [lg, setLg] = useState(true);

  return (
    <div className="px-[clamp(24px,4vw,56px)] py-[clamp(40px,6vw,72px)]">

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-[12px] text-muted" aria-label="breadcrumb">
        <a href="/library" className="transition-colors hover:text-fg">Library</a>
        <span className="text-line-3">/</span>
        <span>Components</span>
        <span className="text-line-3">/</span>
        <span className="text-fg">Switch</span>
      </nav>

      {/* Header */}
      <div className="mb-10 max-w-[640px]">
        <h1 className="mb-3 text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.045em] text-[#f5f5f7]">Switch</h1>
        <p className="text-[15px] leading-[1.65] text-muted">
          A toggle control for boolean settings. Fully interactive with three sizes, disabled state, and labelled row variant.
        </p>
      </div>

      {/* Install */}
      <div className="mb-10 max-w-[480px]">
        <div className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-2">Installation</div>
        <InstallCommand command="npx @ghost-ui/cli add switch" />
      </div>

      {/* Variants */}
      <div className="flex flex-col gap-10 max-w-[860px]">

        {/* Default off */}
        <ComponentSection
          title="Default (Off)"
          description="The switch in its unchecked state. Click to toggle — state is managed with React useState."
        >
          <CodePreview
            preview={<Switch checked={off} onChange={setOff} />}
            react={`'use client';
import { useState } from 'react';

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={\`relative inline-flex h-[22px] w-10 flex-shrink-0 cursor-pointer items-center rounded-full border transition-all duration-200 \${
        checked
          ? 'border-accent/50 bg-accent/[0.22]'
          : 'border-white/[0.10] bg-white/[0.05]'
      }\`}
    >
      <span
        className={\`pointer-events-none inline-block h-[18px] w-[18px] rounded-full shadow-sm transition-transform duration-200 \${
          checked ? 'translate-x-[18px] bg-accent' : 'translate-x-[2px] bg-[#8a8a98]'
        }\`}
      />
    </button>
  );
}

export function Demo() {
  const [on, setOn] = useState(false);
  return <Switch checked={on} onChange={setOn} />;
}`}
            html={`<button role="switch" aria-checked="false" class="switch">
  <span class="switch-thumb"></span>
</button>`}
            css={`.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 40px;
  height: 22px;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.05);
  cursor: pointer;
  transition: background 200ms, border-color 200ms;
}
.switch[aria-checked="true"] {
  border-color: rgba(196,181,253,0.50);
  background: rgba(196,181,253,0.22);
}
.switch-thumb {
  display: inline-block;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: #8a8a98;
  transform: translateX(2px);
  transition: transform 200ms, background 200ms;
}
.switch[aria-checked="true"] .switch-thumb {
  transform: translateX(18px);
  background: #c4b5fd;
}`}
          />
        </ComponentSection>

        {/* Default on */}
        <ComponentSection
          title="Default (On)"
          description="The switch in its checked state with accent highlight. Same component, different initial state."
        >
          <CodePreview
            preview={<Switch checked={on} onChange={setOn} />}
            react={`const [on, setOn] = useState(true);

<Switch checked={on} onChange={setOn} />`}
            html={`<button role="switch" aria-checked="true" class="switch">
  <span class="switch-thumb"></span>
</button>`}
            css={`/* See Default variant CSS — aria-checked="true" applies the on-state styles */`}
          />
        </ComponentSection>

        {/* Disabled */}
        <ComponentSection
          title="Disabled"
          description="Prevents interaction; reduced opacity and cursor-not-allowed signal the control is unavailable."
        >
          <CodePreview
            preview={
              <div className="flex items-center gap-6">
                <Switch checked={false} onChange={() => {}} disabled />
                <Switch checked={true} onChange={() => {}} disabled />
              </div>
            }
            react={`// Disabled off
<Switch checked={false} onChange={() => {}} disabled />

// Disabled on
<Switch checked={true} onChange={() => {}} disabled />`}
            html={`<button role="switch" aria-checked="false" disabled class="switch switch-disabled">
  <span class="switch-thumb"></span>
</button>`}
            css={`.switch-disabled {
  cursor: not-allowed;
  opacity: 0.4;
  pointer-events: none;
}`}
          />
        </ComponentSection>

        {/* With label */}
        <ComponentSection
          title="With Label"
          description="Pair the switch with a text label and description for settings panels. The entire row is clickable."
        >
          <CodePreview
            preview={
              <div className="w-full max-w-[440px]">
                <label className="flex cursor-pointer items-start justify-between gap-6 rounded-xl border border-white/[0.06] bg-white/[0.025] px-5 py-4 transition-colors duration-150 hover:bg-white/[0.04]">
                  <div>
                    <div className="text-[14px] font-medium text-[#f4f4f7]">Email notifications</div>
                    <div className="mt-0.5 text-[12px] leading-[1.4] text-muted">
                      Receive emails when someone mentions you.
                    </div>
                  </div>
                  <Switch checked={labeled} onChange={setLabeled} />
                </label>
              </div>
            }
            react={`function SettingRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-6 rounded-xl border border-white/[0.06] bg-white/[0.025] px-5 py-4 hover:bg-white/[0.04] transition-colors duration-150">
      <div>
        <div className="text-[14px] font-medium text-[#f4f4f7]">{label}</div>
        <div className="mt-0.5 text-[12px] leading-[1.4] text-muted">{description}</div>
      </div>
      <Switch checked={checked} onChange={onChange} />
    </label>
  );
}`}
            html={`<label class="switch-row">
  <div class="switch-row-text">
    <span class="switch-row-label">Email notifications</span>
    <span class="switch-row-desc">Receive emails when someone mentions you.</span>
  </div>
  <button role="switch" aria-checked="false" class="switch">
    <span class="switch-thumb"></span>
  </button>
</label>`}
            css={`.switch-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.025);
  padding: 16px 20px;
  cursor: pointer;
  transition: background 150ms;
}
.switch-row:hover { background: rgba(255,255,255,0.04); }
.switch-row-label { display: block; font-size: 14px; font-weight: 500; color: #f4f4f7; }
.switch-row-desc  { display: block; margin-top: 2px; font-size: 12px; line-height: 1.4; color: #8a8a98; }`}
          />
        </ComponentSection>

        {/* Sizes */}
        <ComponentSection
          title="Sizes"
          description="Three size tokens — sm, md (default), and lg — to match different UI densities."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-8">
                {([['sm', sm, setSm], ['md', md, setMd], ['lg', lg, setLg]] as const).map(([size, val, setter]) => (
                  <div key={size} className="flex flex-col items-center gap-2.5">
                    <Switch checked={val} onChange={setter} size={size} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">{size}</span>
                  </div>
                ))}
              </div>
            }
            react={`<Switch size="sm" checked={on} onChange={setOn} />
<Switch size="md" checked={on} onChange={setOn} />
<Switch size="lg" checked={on} onChange={setOn} />`}
            html={`<button role="switch" class="switch switch-sm">…</button>
<button role="switch" class="switch switch-md">…</button>
<button role="switch" class="switch switch-lg">…</button>`}
            css={`.switch-sm { width: 32px; height: 18px; }
.switch-sm .switch-thumb { width: 14px; height: 14px; }
.switch-sm[aria-checked="true"] .switch-thumb { transform: translateX(14px); }

.switch-md { width: 40px; height: 22px; }
.switch-md .switch-thumb { width: 18px; height: 18px; }
.switch-md[aria-checked="true"] .switch-thumb { transform: translateX(18px); }

.switch-lg { width: 52px; height: 28px; }
.switch-lg .switch-thumb { width: 22px; height: 22px; }
.switch-lg[aria-checked="true"] .switch-thumb { transform: translateX(24px); }`}
          />
        </ComponentSection>

      </div>
    </div>
  );
}
