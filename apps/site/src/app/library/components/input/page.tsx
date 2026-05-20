import type { Metadata } from 'next';
import { CodePreview } from '../../CodePreview';
import { InstallCommand } from '../../InstallCommand';

export const metadata: Metadata = {
  title: 'Input — Ghost UI Library',
  description: 'Text input fields with support for icons, validation states, and more.',
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

export default function InputPage() {
  return (
    <div className="px-[clamp(24px,4vw,56px)] py-[clamp(40px,6vw,72px)]">

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 font-mono text-[12px] text-muted" aria-label="breadcrumb">
        <a href="/library" className="transition-colors hover:text-fg">Library</a>
        <span className="text-line-3">/</span>
        <span>Components</span>
        <span className="text-line-3">/</span>
        <span className="text-fg">Input</span>
      </nav>

      {/* Header */}
      <div className="mb-10 max-w-[640px]">
        <h1 className="mb-3 text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.045em] text-[#f5f5f7]">Input</h1>
        <p className="text-[15px] leading-[1.65] text-muted">
          Flexible text inputs that support prefix icons, password toggles, keyboard hints, validation states, and disabled modes.
        </p>
      </div>

      {/* Install */}
      <div className="mb-10 max-w-[480px]">
        <div className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-2">Installation</div>
        <InstallCommand command="npx @ghost-ui/cli add input" />
      </div>

      {/* Variants */}
      <div className="flex flex-col gap-10 max-w-[860px]">

        {/* Default */}
        <ComponentSection
          title="Default"
          description="A clean, minimal input field with focus ring and hover transition."
        >
          <CodePreview
            preview={
              <input
                type="text"
                placeholder="Enter value…"
                className="w-full max-w-[320px] rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-2.5 text-[14px] text-fg outline-none placeholder:text-muted focus:border-accent/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-accent/[0.15] transition-[border-color,background,box-shadow] duration-150"
              />
            }
            react={`<input
  type="text"
  placeholder="Enter value…"
  className="w-full rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-2.5 text-[14px] text-fg outline-none placeholder:text-muted focus:border-accent/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-accent/[0.15] transition-[border-color,background,box-shadow] duration-150"
/>`}
            html={`<input type="text" placeholder="Enter value…" class="input" />`}
            css={`.input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.04);
  padding: 10px 16px;
  font-size: 14px;
  color: #ededf0;
  outline: none;
  transition: border-color 150ms, background 150ms, box-shadow 150ms;
}
.input::placeholder { color: #8a8a98; }
.input:focus {
  border-color: rgba(196,181,253,0.50);
  background: rgba(255,255,255,0.06);
  box-shadow: 0 0 0 2px rgba(196,181,253,0.15);
}`}
          />
        </ComponentSection>

        {/* With prefix icon */}
        <ComponentSection
          title="With Prefix Icon"
          description="Prepend an icon inside the input to provide visual context for the expected value."
        >
          <CodePreview
            preview={
              <div className="relative w-full max-w-[320px]">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full rounded-xl border border-white/[0.10] bg-white/[0.04] py-2.5 pl-10 pr-4 text-[14px] text-fg outline-none placeholder:text-muted focus:border-accent/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-accent/[0.15] transition-[border-color,background,box-shadow] duration-150"
                />
              </div>
            }
            react={`<div className="relative">
  <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-muted" />
  <input
    type="text"
    placeholder="Username"
    className="w-full rounded-xl border border-white/[0.10] bg-white/[0.04] py-2.5 pl-10 pr-4 text-[14px] text-fg outline-none placeholder:text-muted focus:border-accent/50 focus:ring-2 focus:ring-accent/[0.15] transition-all duration-150"
  />
</div>`}
            html={`<div class="input-wrapper">
  <!-- icon svg -->
  <input type="text" placeholder="Username" class="input input-with-icon" />
</div>`}
            css={`.input-wrapper {
  position: relative;
}
.input-wrapper svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #8a8a98;
  pointer-events: none;
}
.input-with-icon {
  padding-left: 40px;
}`}
          />
        </ComponentSection>

        {/* Search */}
        <ComponentSection
          title="Search"
          description="A keyboard shortcut hint gives users a discoverable way to open search from anywhere."
        >
          <CodePreview
            preview={
              <div className="relative w-full max-w-[340px]">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                </span>
                <input
                  type="search"
                  placeholder="Search components…"
                  className="w-full rounded-xl border border-white/[0.10] bg-white/[0.04] py-2.5 pl-10 pr-20 text-[14px] text-fg outline-none placeholder:text-muted focus:border-accent/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-accent/[0.15] transition-[border-color,background,box-shadow] duration-150"
                />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rounded-[5px] border border-white/[0.10] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-[#d8d8ee]">
                  ⌘K
                </span>
              </div>
            }
            react={`<div className="relative">
  <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-[14px] w-[14px] text-muted" />
  <input
    type="search"
    placeholder="Search components…"
    className="w-full rounded-xl border border-white/[0.10] bg-white/[0.04] py-2.5 pl-10 pr-20 text-[14px] text-fg outline-none placeholder:text-muted focus:border-accent/50 focus:ring-2 focus:ring-accent/[0.15] transition-all duration-150"
  />
  <kbd className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 rounded-[5px] border border-white/[0.10] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-[#d8d8ee]">
    ⌘K
  </kbd>
</div>`}
            html={`<div class="input-wrapper">
  <!-- search icon -->
  <input type="search" placeholder="Search components…" class="input input-search" />
  <kbd class="input-kbd">⌘K</kbd>
</div>`}
            css={`.input-search { padding-right: 80px; }
.input-kbd {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 5px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.04);
  padding: 2px 6px;
  font-family: monospace;
  font-size: 10px;
  color: #d8d8ee;
  pointer-events: none;
}`}
          />
        </ComponentSection>

        {/* Password */}
        <ComponentSection
          title="Password"
          description="Toggle password visibility with a show/hide button inside the field — requires client state."
        >
          <CodePreview
            preview={
              <div className="relative w-full max-w-[320px]">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  type="password"
                  defaultValue="supersecret"
                  className="w-full rounded-xl border border-white/[0.10] bg-white/[0.04] py-2.5 pl-10 pr-12 text-[14px] text-fg outline-none placeholder:text-muted focus:border-accent/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-accent/[0.15] transition-[border-color,background,box-shadow] duration-150"
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted transition-colors duration-150 hover:text-fg"
                  aria-label="Show password"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            }
            react={`'use client';
import { useState } from 'react';

function PasswordInput() {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-muted" />
      <input
        type={show ? 'text' : 'password'}
        placeholder="Password"
        className="w-full rounded-xl border border-white/[0.10] bg-white/[0.04] py-2.5 pl-10 pr-12 text-[14px] text-fg outline-none placeholder:text-muted focus:border-accent/50 focus:ring-2 focus:ring-accent/[0.15] transition-all duration-150"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-fg transition-colors duration-150"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOffIcon className="h-[15px] w-[15px]" /> : <EyeIcon className="h-[15px] w-[15px]" />}
      </button>
    </div>
  );
}`}
            html={`<div class="input-wrapper">
  <!-- lock icon -->
  <input type="password" id="pwd" placeholder="Password" class="input input-password" />
  <button type="button" class="input-toggle" onclick="togglePwd()">
    <!-- eye icon -->
  </button>
</div>`}
            css={`.input-password { padding-right: 48px; }
.input-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #8a8a98;
  transition: color 150ms;
}
.input-toggle:hover { color: #ededf0; }`}
          />
        </ComponentSection>

        {/* Disabled */}
        <ComponentSection
          title="Disabled"
          description="Prevents interaction; styled with reduced opacity to signal unavailability semantically."
        >
          <CodePreview
            preview={
              <input
                type="text"
                placeholder="Not available"
                disabled
                className="w-full max-w-[320px] cursor-not-allowed rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[14px] text-muted opacity-50 outline-none"
              />
            }
            react={`<input
  type="text"
  placeholder="Not available"
  disabled
  className="w-full cursor-not-allowed rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-[14px] text-muted opacity-50 outline-none"
/>`}
            html={`<input type="text" placeholder="Not available" disabled class="input input-disabled" />`}
            css={`.input-disabled {
  cursor: not-allowed;
  opacity: 0.5;
  background: rgba(255,255,255,0.02);
  border-color: rgba(255,255,255,0.06);
}`}
          />
        </ComponentSection>

        {/* Validation error */}
        <ComponentSection
          title="Validation Error"
          description="Surface field-level errors close to their source with semantic color and an accessible description."
        >
          <CodePreview
            preview={
              <div className="flex w-full max-w-[320px] flex-col gap-1.5">
                <input
                  type="email"
                  defaultValue="not-an-email"
                  aria-invalid="true"
                  aria-describedby="email-err"
                  className="w-full rounded-xl border border-red-400/50 bg-red-400/[0.06] px-4 py-2.5 text-[14px] text-fg outline-none ring-2 ring-red-400/[0.14] transition-[border-color,background,box-shadow] duration-150"
                />
                <p id="email-err" className="flex items-center gap-1.5 text-[12px] text-red-300">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Please enter a valid email address.
                </p>
              </div>
            }
            react={`<div className="flex flex-col gap-1.5">
  <input
    type="email"
    aria-invalid="true"
    aria-describedby="email-err"
    className="w-full rounded-xl border border-red-400/50 bg-red-400/[0.06] px-4 py-2.5 text-[14px] text-fg outline-none ring-2 ring-red-400/[0.14] transition-all duration-150"
  />
  <p id="email-err" className="flex items-center gap-1.5 text-[12px] text-red-300">
    <InfoIcon className="h-[11px] w-[11px]" />
    Please enter a valid email address.
  </p>
</div>`}
            html={`<div class="input-field">
  <input type="email" aria-invalid="true" aria-describedby="email-err" class="input input-error" />
  <p id="email-err" class="input-error-msg">Please enter a valid email address.</p>
</div>`}
            css={`.input-error {
  border-color: rgba(248,113,113,0.50);
  background: rgba(248,113,113,0.06);
  box-shadow: 0 0 0 2px rgba(248,113,113,0.14);
}
.input-error-msg {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #fca5a5;
  margin-top: 6px;
}`}
          />
        </ComponentSection>

      </div>
    </div>
  );
}
