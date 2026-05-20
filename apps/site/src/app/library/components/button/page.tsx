import type { Metadata } from 'next';
import { CodePreview } from '../../CodePreview';
import { InstallCommand } from '../../InstallCommand';
import { TableOfContents } from '../../TableOfContents';
import { ButtonCarousel } from './ButtonCarousel';
import { PRIMARY_DESIGNS } from './variants/primary';
import {
  ToggleDemo, CopyDemo, ConfirmDemo, ProgressDemo,
  MagneticDemo, RippleDemo, DropdownDemo, StepperDemo,
  ReactionDemo, PlayPauseDemo, CountdownDemo, LongPressDemo,
  FileUploadDemo, AddToCartDemo, FollowDemo, SwipeDemo,
} from './ButtonDemos';

const TOC = [
  { id: 'primary',    label: 'Primary' },
  { id: 'ghost',      label: 'Ghost' },
  { id: 'destructive',label: 'Destructive' },
  { id: 'loading',    label: 'Loading state' },
  { id: 'icon',       label: 'Icon button' },
  { id: 'sizes',      label: 'Sizes' },
  { id: 'disabled',   label: 'Disabled' },
  { id: 'accent',     label: 'Accent' },
  { id: 'pill',       label: 'Pill' },
  { id: 'link',       label: 'Link' },
  { id: 'group',      label: 'Button group' },
  { id: 'split',      label: 'Split button' },
  { id: 'badge',      label: 'With badge' },
  { id: 'soft',       label: 'Soft' },
  { id: 'fullwidth',  label: 'Full width' },
  { id: 'iconlabel',  label: 'Icon + label' },
  { id: 'social',     label: 'Social / OAuth' },
  { id: 'gradient',   label: 'Gradient' },
  { id: 'neon',       label: 'Neon / Glow' },
  { id: 'shimmer',    label: 'Shimmer' },
  { id: 'fab',        label: 'FAB' },
  { id: 'toggle',     label: 'Toggle' },
  { id: 'copy',       label: 'Copy' },
  { id: 'confirm',    label: 'Confirm' },
  { id: 'progress',   label: 'Progress' },
  { id: 'glass',      label: 'Glass' },
  { id: 'raised',     label: '3D / Raised' },
  { id: 'outline',    label: 'Outline thick' },
  { id: 'brutalist',  label: 'Brutalist' },
  { id: 'stacked',    label: 'Stacked' },
  { id: 'kbdshort',   label: 'Keyboard shortcut' },
  { id: 'magnetic',   label: 'Magnetic' },
  { id: 'ripple',     label: 'Ripple' },
  { id: 'dropdown',   label: 'Dropdown' },
  { id: 'stepper',    label: 'Quantity stepper' },
  { id: 'reaction',   label: 'Reaction' },
  { id: 'playpause',  label: 'Play / Pause' },
  { id: 'countdown',  label: 'Countdown' },
  { id: 'longpress',  label: 'Long press' },
  { id: 'fileupload', label: 'File upload' },
  { id: 'addtocart',  label: 'Add to cart' },
  { id: 'follow',     label: 'Follow' },
  { id: 'swipe',      label: 'Swipe to confirm' },
  { id: 'props',      label: 'Props' },
];

export const metadata: Metadata = {
  title: 'Button — Ghost UI Library',
  description: 'Accessible button component with primary, ghost, destructive, loading, icon, accent, pill, group, split, badge, soft, full-width, social variants.',
};

const REACT = {
  primary: `import { cn } from '@ghost-ui/utils';

export function Button({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-[10px] border border-transparent",
        "bg-[#ededf0] px-4 py-[11px] text-[14px] font-semibold text-[#0a0a10]",
        "transition-all duration-200 hover:bg-white",
        "hover:shadow-[0_18px_40px_-16px_rgba(196,181,253,0.55)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}`,
  ghost: `export function GhostButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-[10px]",
        "border border-white/[0.12] bg-white/[0.03] px-4 py-[11px]",
        "text-[14px] font-medium text-fg",
        "transition-all duration-200",
        "hover:border-white/[0.22] hover:bg-white/[0.06]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}`,
  destructive: `export function DestructiveButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-[10px]",
        "border border-red-500/[0.28] bg-red-500/[0.08] px-4 py-[11px]",
        "text-[14px] font-medium text-red-400",
        "transition-all duration-200",
        "hover:border-red-500/[0.45] hover:bg-red-500/[0.14]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}`,
  loading: `'use client';
import { useState } from 'react';

export function LoadingButton({ children, ...props }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
  }

  return (
    <button
      disabled={loading}
      onClick={handleClick}
      className="inline-flex items-center gap-2.5 rounded-[10px] border border-transparent
        bg-[#ededf0] px-4 py-[11px] text-[14px] font-semibold text-[#0a0a10]
        disabled:opacity-70 transition-all duration-200 hover:bg-white
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      {...props}
    >
      {loading && (
        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      )}
      {loading ? 'Loading…' : children}
    </button>
  );
}`,
  icon: `export function IconButton({ icon, label, variant = 'ghost', ...props }) {
  const base =
    "inline-flex h-9 w-9 items-center justify-center rounded-[9px]" +
    " transition-all duration-200 focus-visible:outline-none" +
    " focus-visible:ring-2 focus-visible:ring-accent/60";
  const styles = {
    ghost:    "border border-line-2 bg-white/[0.03] text-muted hover:bg-white/[0.07] hover:text-fg",
    accent:   "border border-accent/[0.28] bg-accent/[0.10] text-accent hover:bg-accent/[0.18]",
    solid:    "bg-[#ededf0] text-[#0a0a10] hover:bg-white",
  };

  return (
    <button
      aria-label={label}
      className={\`\${base} \${styles[variant]}\`}
      {...props}
    >
      {icon}
    </button>
  );
}`,
  sizes: `export function Button({ size = 'md', children, ...props }) {
  const sizes = {
    sm: 'px-3 py-2 text-[12px] rounded-[8px]',
    md: 'px-4 py-[11px] text-[14px] rounded-[10px]',
    lg: 'px-6 py-3.5 text-[15px] rounded-[11px]',
  };

  return (
    <button
      className={\`inline-flex items-center gap-2 border border-line-3
        bg-white/[0.03] font-medium text-fg transition-all duration-200
        hover:border-white/[0.22] hover:bg-white/[0.06]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
        \${sizes[size]}\`}
      {...props}
    >
      {children}
    </button>
  );
}`,
};

const HTML = {
  primary: `<button class="ghost-btn-primary">
  Click me →
</button>`,
  ghost: `<button class="ghost-btn">
  Read the docs
</button>`,
  destructive: `<button class="ghost-btn-destructive">
  <svg><!-- trash icon --></svg>
  Delete account
</button>`,
  loading: `<button class="ghost-btn-primary ghost-btn--loading" disabled>
  <svg class="ghost-spin" aria-hidden="true">
    <!-- spinner path -->
  </svg>
  Loading…
</button>`,
  icon: `<button class="ghost-btn-icon" aria-label="Settings">
  <svg><!-- gear icon --></svg>
</button>`,
  sizes: `<button class="ghost-btn ghost-btn--sm">Small</button>
<button class="ghost-btn ghost-btn--md">Medium</button>
<button class="ghost-btn ghost-btn--lg">Large</button>`,
};

const CSS = {
  primary: `.ghost-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border-radius: 10px;
  border: none;
  background: #ededf0;
  color: #0a0a10;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
}

.ghost-btn-primary:hover {
  background: #ffffff;
  box-shadow: 0 18px 40px -16px rgba(196, 181, 253, 0.55);
}

.ghost-btn-primary:focus-visible {
  outline: 2px solid rgba(196, 181, 253, 0.6);
  outline-offset: 2px;
}`,
  ghost: `.ghost-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  color: #ededf0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}

.ghost-btn:hover {
  border-color: rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.06);
}`,
  destructive: `.ghost-btn-destructive {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border-radius: 10px;
  border: 1px solid rgba(239, 68, 68, 0.28);
  background: rgba(239, 68, 68, 0.08);
  color: #f87171;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}

.ghost-btn-destructive:hover {
  border-color: rgba(239, 68, 68, 0.45);
  background: rgba(239, 68, 68, 0.14);
}`,
  loading: `.ghost-btn--loading {
  opacity: 0.7;
  pointer-events: none;
}

@keyframes ghost-spin {
  to { transform: rotate(360deg); }
}

.ghost-spin {
  animation: ghost-spin 0.8s linear infinite;
}`,
  icon: `.ghost-btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(255, 255, 255, 0.03);
  color: #8a8a98;
  cursor: pointer;
  transition: all 200ms ease;
}

.ghost-btn-icon:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #ededf0;
}`,
  sizes: `.ghost-btn--sm { padding: 8px 12px;  font-size: 12px; border-radius: 8px; }
.ghost-btn--md { padding: 11px 16px; font-size: 14px; border-radius: 10px; }
.ghost-btn--lg { padding: 14px 24px; font-size: 15px; border-radius: 11px; }`,
};

export default function ButtonPage() {
  return (
    <div className="px-[clamp(24px,4vw,56px)] py-[clamp(40px,6vw,72px)]">

      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.10em] text-[#2a2a42]" aria-label="breadcrumb">
        <a href="/library" className="transition-colors hover:text-[#6a6a82]">Library</a>
        <span className="text-[#1e1e2e]">/</span>
        <span className="text-[#1e1e2e]">Components</span>
        <span className="text-[#1e1e2e]">/</span>
        <span className="text-[#5a5a72]">Button</span>
      </nav>

      {/* Two-column: content + TOC */}
      <div className="flex items-start gap-12">
        <div className="min-w-0 flex-1">

          {/* Header */}
          <div className="mb-10 max-w-[640px]">
            <h1 className="mb-3 text-[clamp(32px,4vw,52px)] font-medium tracking-[-0.048em] text-[#e8e8f0]">Button</h1>
            <p className="text-[14.5px] leading-[1.65] text-[#3a3a56]">
              Triggers actions or events. Ships as a standalone React component or copy-paste HTML/CSS.
              <span className="ml-1 inline-flex items-center rounded-full border border-white/[0.07] bg-white/[0.025] px-2 py-px font-mono text-[10.5px] font-medium tracking-[0.04em] text-[#5a5a72]">16 variants</span>
            </p>
          </div>

          {/* Install */}
          <div className="mb-10 max-w-[480px]">
            <div className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#606078]">Installation</div>
            <InstallCommand command="npx @ghost-ui/cli add button" />
          </div>

          {/* Variants */}
          <div className="flex flex-col gap-10">

        {/* Primary */}
        <ComponentSection
          id="primary"
          title="Primary"
          description="Auto-cycles through 12 design styles. Open the full library to browse, preview, and copy any variant."
        >
          <ButtonCarousel
            variants={PRIMARY_DESIGNS}
            categorySlug="primary"
            totalDesigns={PRIMARY_DESIGNS.length}
          />
        </ComponentSection>

        {/* Ghost / Outline */}
        <ComponentSection
          id="ghost"
          title="Ghost"
          description="Secondary action. Transparent background, subtle border. Pairs with Primary for dual-CTA layouts."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">
                  Read the docs
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                  GitHub
                </button>
              </div>
            }
            react={REACT.ghost}
            html={HTML.ghost}
            css={CSS.ghost}
          />
        </ComponentSection>

        {/* Destructive */}
        <ComponentSection
          id="destructive"
          title="Destructive"
          description="Red-tinted for delete, remove, or irreversible actions. Accessible focus ring included."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-red-500/[0.28] bg-red-500/[0.08] px-4 py-[11px] text-[14px] font-medium text-red-400 transition-all duration-200 hover:border-red-500/[0.45] hover:bg-red-500/[0.14]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                  Delete account
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-red-500/[0.28] bg-red-500/[0.08] px-4 py-[11px] text-[14px] font-medium text-red-400 transition-all duration-200 hover:border-red-500/[0.45] hover:bg-red-500/[0.14]">
                  Remove member
                </button>
              </div>
            }
            react={REACT.destructive}
            html={HTML.destructive}
            css={CSS.destructive}
          />
        </ComponentSection>

        {/* Loading */}
        <ComponentSection
          id="loading"
          title="Loading state"
          description="Async-aware loading state. Button disables and shows a spinner while work is in progress."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <button disabled className="inline-flex items-center gap-2.5 rounded-[10px] border border-transparent bg-[#ededf0] px-4 py-[11px] text-[14px] font-semibold text-[#0a0a10] opacity-70 transition-all duration-200">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                  Loading…
                </button>
                <button className="inline-flex items-center gap-2.5 rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">
                  Idle state
                </button>
              </div>
            }
            react={REACT.loading}
            html={HTML.loading}
            css={CSS.loading}
          />
        </ComponentSection>

        {/* Icon */}
        <ComponentSection
          id="icon"
          title="Icon button"
          description="Square icon-only button in three surface styles. Always include aria-label for accessibility."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Ghost */}
                <button aria-label="Settings" className="inline-flex h-9 w-9 items-center justify-center rounded-[9px] border border-line-2 bg-white/[0.03] text-muted transition-all duration-200 hover:bg-white/[0.07] hover:text-fg">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                </button>
                {/* Accent */}
                <button aria-label="Star" className="inline-flex h-9 w-9 items-center justify-center rounded-[9px] border border-accent/[0.28] bg-accent/[0.10] text-accent transition-all duration-200 hover:bg-accent/[0.18]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                </button>
                {/* Solid */}
                <button aria-label="Add" className="inline-flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#ededf0] text-[#0a0a10] transition-all duration-200 hover:bg-white">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
                </button>
                {/* Danger */}
                <button aria-label="Delete" className="inline-flex h-9 w-9 items-center justify-center rounded-[9px] border border-red-500/[0.25] bg-red-500/[0.07] text-red-400 transition-all duration-200 hover:bg-red-500/[0.14]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6" /></svg>
                </button>
              </div>
            }
            react={REACT.icon}
            html={HTML.icon}
            css={CSS.icon}
          />
        </ComponentSection>

        {/* Sizes */}
        <ComponentSection
          id="sizes"
          title="Sizes"
          description="Three size tokens: sm (compact toolbars), md (default), lg (hero CTAs)."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center rounded-[8px] border border-line-3 bg-white/[0.03] px-3 py-2 text-[12px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">Small</button>
                <button className="inline-flex items-center rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">Medium</button>
                <button className="inline-flex items-center rounded-[11px] border border-line-3 bg-white/[0.03] px-6 py-3.5 text-[15px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">Large</button>
              </div>
            }
            react={REACT.sizes}
            html={HTML.sizes}
            css={CSS.sizes}
          />
        </ComponentSection>

        {/* ── 10 new variants ──────────────────────────────────────────────── */}

        {/* Accent / Gradient */}
        <ComponentSection
          id="accent"
          title="Accent"
          description="Brand-purple gradient button. Radial glow on hover — matches the Ghost UI hero CTA style."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <button className="relative isolate inline-flex items-center gap-2 overflow-hidden rounded-[10px] border border-accent/[0.35] bg-[linear-gradient(180deg,rgba(196,181,253,0.22),rgba(139,92,246,0.10))] px-4 py-[11px] text-[14px] font-medium text-[#f0e9ff] transition-all duration-200 hover:border-accent/60 hover:shadow-[0_0_28px_rgba(167,139,250,0.30)] hover:bg-[linear-gradient(180deg,rgba(196,181,253,0.32),rgba(139,92,246,0.18))]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                  Get early access
                </button>
                <button className="relative isolate inline-flex items-center gap-2 overflow-hidden rounded-full border border-accent/[0.35] bg-[linear-gradient(180deg,rgba(196,181,253,0.22),rgba(139,92,246,0.10))] px-4 py-[11px] text-[14px] font-medium text-[#f0e9ff] transition-all duration-200 hover:border-accent/60 hover:shadow-[0_0_28px_rgba(167,139,250,0.30)]">
                  <span className="text-[#fbbf24] text-[12px]">★</span> Star on GitHub
                </button>
              </div>
            }
            react={`export function AccentButton({ children, ...props }) {
  return (
    <button
      className="relative isolate inline-flex items-center gap-2
        overflow-hidden rounded-[10px]
        border border-accent/[0.35]
        bg-[linear-gradient(180deg,rgba(196,181,253,0.22),rgba(139,92,246,0.10))]
        px-4 py-[11px] text-[14px] font-medium text-[#f0e9ff]
        transition-all duration-200
        hover:border-accent/60
        hover:bg-[linear-gradient(180deg,rgba(196,181,253,0.32),rgba(139,92,246,0.18))]
        hover:shadow-[0_0_28px_rgba(167,139,250,0.30)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      {...props}
    >
      {children}
    </button>
  );
}`}
            html={`<button class="ghost-btn-accent">
  <svg><!-- bolt icon --></svg>
  Get early access
</button>`}
            css={`.ghost-btn-accent {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border-radius: 10px;
  border: 1px solid rgba(196, 181, 253, 0.35);
  background: linear-gradient(180deg,
    rgba(196,181,253,0.22),
    rgba(139,92,246,0.10));
  color: #f0e9ff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}

.ghost-btn-accent:hover {
  border-color: rgba(196,181,253,0.60);
  background: linear-gradient(180deg,
    rgba(196,181,253,0.32),
    rgba(139,92,246,0.18));
  box-shadow: 0 0 28px rgba(167,139,250,0.30);
}`}
          />
        </ComponentSection>

        {/* Pill */}
        <ComponentSection
          id="pill"
          title="Pill"
          description="Fully rounded capsule shape. Great for tags, filters, status toggles, and nav pills."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-2.5">
                <button className="inline-flex items-center rounded-full border border-transparent bg-[#ededf0] px-5 py-2 text-[13px] font-semibold text-[#0a0a10] transition-all duration-200 hover:bg-white hover:shadow-[0_8px_24px_-8px_rgba(196,181,253,0.5)]">Primary pill</button>
                <button className="inline-flex items-center rounded-full border border-line-3 bg-white/[0.03] px-5 py-2 text-[13px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">Ghost pill</button>
                <button className="inline-flex items-center rounded-full border border-accent/[0.35] bg-accent/[0.10] px-5 py-2 text-[13px] font-medium text-accent transition-all duration-200 hover:border-accent/60 hover:bg-accent/[0.18]">Accent pill</button>
                <button className="inline-flex items-center rounded-full border border-emerald-400/[0.30] bg-emerald-400/[0.08] px-5 py-2 text-[13px] font-medium text-emerald-400 transition-all duration-200 hover:bg-emerald-400/[0.14]">Success pill</button>
              </div>
            }
            react={`export function PillButton({ variant = 'ghost', children, ...props }) {
  const styles = {
    primary: "border-transparent bg-[#ededf0] text-[#0a0a10] font-semibold hover:bg-white hover:shadow-[0_8px_24px_-8px_rgba(196,181,253,0.5)]",
    ghost:   "border-white/[0.12] bg-white/[0.03] text-fg hover:border-white/[0.22] hover:bg-white/[0.06]",
    accent:  "border-accent/[0.35] bg-accent/[0.10] text-accent hover:border-accent/60 hover:bg-accent/[0.18]",
    success: "border-emerald-400/[0.30] bg-emerald-400/[0.08] text-emerald-400 hover:bg-emerald-400/[0.14]",
  };

  return (
    <button
      className={\`inline-flex items-center rounded-full border px-5 py-2
        text-[13px] font-medium transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
        \${styles[variant]}\`}
      {...props}
    >
      {children}
    </button>
  );
}`}
            html={`<button class="ghost-btn-pill">Primary pill</button>
<button class="ghost-btn-pill ghost-btn-pill--ghost">Ghost pill</button>
<button class="ghost-btn-pill ghost-btn-pill--accent">Accent pill</button>`}
            css={`.ghost-btn-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid transparent;
  background: #ededf0;
  color: #0a0a10;
  cursor: pointer;
  transition: all 200ms;
}

.ghost-btn-pill--ghost {
  background: rgba(255,255,255,0.03);
  border-color: rgba(255,255,255,0.12);
  color: #ededf0;
  font-weight: 500;
}

.ghost-btn-pill--accent {
  background: rgba(196,181,253,0.10);
  border-color: rgba(196,181,253,0.35);
  color: #c4b5fd;
  font-weight: 500;
}`}
          />
        </ComponentSection>

        {/* Link */}
        <ComponentSection
          id="link"
          title="Link"
          description="Looks like a hyperlink. No border or background — minimum visual weight for tertiary actions."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-5">
                <button className="inline-flex items-center gap-1.5 text-[14px] font-medium text-muted underline-offset-4 transition-colors duration-200 hover:text-fg hover:underline">
                  View changelog
                </button>
                <button className="inline-flex items-center gap-1.5 text-[14px] font-medium text-accent underline-offset-4 transition-colors duration-200 hover:underline">
                  Learn more
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
                <button className="inline-flex items-center gap-1.5 text-[14px] font-medium text-red-400 underline-offset-4 transition-colors duration-200 hover:underline">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                  Remove
                </button>
              </div>
            }
            react={`export function LinkButton({ color = 'muted', children, ...props }) {
  const colors = {
    muted:       "text-muted hover:text-fg",
    accent:      "text-accent",
    destructive: "text-red-400",
  };

  return (
    <button
      className={\`inline-flex items-center gap-1.5 text-[14px] font-medium
        underline-offset-4 transition-colors duration-200 hover:underline
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
        \${colors[color]}\`}
      {...props}
    >
      {children}
    </button>
  );
}`}
            html={`<button class="ghost-btn-link">View changelog</button>
<button class="ghost-btn-link ghost-btn-link--accent">Learn more →</button>
<button class="ghost-btn-link ghost-btn-link--danger">Remove</button>`}
            css={`.ghost-btn-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #8a8a98;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-underline-offset: 4px;
  transition: color 200ms;
}

.ghost-btn-link:hover { color: #ededf0; text-decoration: underline; }
.ghost-btn-link--accent { color: #c4b5fd; }
.ghost-btn-link--danger { color: #f87171; }`}
          />
        </ComponentSection>

        {/* Button group */}
        <ComponentSection
          id="group"
          title="Button group"
          description="Multiple actions fused into one segmented bar. Borders collapse at shared edges — no double-lines."
        >
          <CodePreview
            preview={
              <div className="flex flex-col gap-4">
                <div className="inline-flex overflow-hidden rounded-[10px] border border-line-3">
                  {['Day', 'Week', 'Month'].map((t, i) => (
                    <button
                      key={t}
                      className={`inline-flex items-center px-4 py-[10px] text-[13px] font-medium transition-colors duration-150 ${i === 1 ? 'bg-white/[0.07] text-fg' : 'bg-white/[0.02] text-muted hover:bg-white/[0.05] hover:text-fg'} ${i > 0 ? 'border-l border-line-2' : ''}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="inline-flex overflow-hidden rounded-[10px] border border-line-3">
                  {[
                    { label: 'Copy', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg> },
                    { label: 'Edit', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> },
                    { label: 'Delete', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg> },
                  ].map((item, i) => (
                    <button
                      key={item.label}
                      className={`inline-flex items-center gap-2 px-4 py-[10px] text-[13px] font-medium text-muted transition-colors duration-150 hover:bg-white/[0.05] hover:text-fg ${i > 0 ? 'border-l border-line-2' : ''} bg-white/[0.02]`}
                    >
                      {item.icon}{item.label}
                    </button>
                  ))}
                </div>
              </div>
            }
            react={`export function ButtonGroup({ items, active }) {
  return (
    <div className="inline-flex overflow-hidden rounded-[10px] border border-line-3">
      {items.map((item, i) => (
        <button
          key={item.label}
          className={\`inline-flex items-center gap-2 px-4 py-[10px]
            text-[13px] font-medium transition-colors duration-150
            \${i > 0 ? 'border-l border-line-2' : ''}
            \${active === item.label
              ? 'bg-white/[0.07] text-fg'
              : 'bg-white/[0.02] text-muted hover:bg-white/[0.05] hover:text-fg'
            }\`}
        >
          {item.icon && item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}`}
            html={`<div class="ghost-btn-group" role="group">
  <button class="ghost-btn-group__item">Day</button>
  <button class="ghost-btn-group__item active">Week</button>
  <button class="ghost-btn-group__item">Month</button>
</div>`}
            css={`.ghost-btn-group {
  display: inline-flex;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.16);
}

.ghost-btn-group__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #8a8a98;
  background: rgba(255,255,255,0.02);
  border: none;
  border-left: 1px solid rgba(255,255,255,0.08);
  cursor: pointer;
  transition: all 150ms;
}

.ghost-btn-group__item:first-child { border-left: none; }
.ghost-btn-group__item:hover { background: rgba(255,255,255,0.05); color: #ededf0; }
.ghost-btn-group__item.active { background: rgba(255,255,255,0.07); color: #ededf0; }`}
          />
        </ComponentSection>

        {/* Split button */}
        <ComponentSection
          id="split"
          title="Split button"
          description="Primary action left, dropdown trigger right. Both halves share the border, separated by a slim divider."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex overflow-hidden rounded-[10px] border border-transparent">
                  <button className="inline-flex items-center gap-2 bg-[#ededf0] px-4 py-[11px] text-[14px] font-semibold text-[#0a0a10] transition-all duration-200 hover:bg-white">
                    Deploy
                  </button>
                  <span className="w-px bg-[rgba(10,10,14,0.18)]" aria-hidden />
                  <button className="inline-flex items-center bg-[#ededf0] px-3 py-[11px] text-[#0a0a10] transition-all duration-200 hover:bg-white" aria-label="More deploy options">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m6 9 6 6 6-6" /></svg>
                  </button>
                </div>
                <div className="inline-flex overflow-hidden rounded-[10px] border border-line-3">
                  <button className="inline-flex items-center gap-2 bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium text-fg transition-all duration-200 hover:bg-white/[0.07]">
                    Publish
                  </button>
                  <span className="w-px bg-line-2" aria-hidden />
                  <button className="inline-flex items-center bg-white/[0.03] px-3 py-[11px] text-muted transition-all duration-200 hover:bg-white/[0.07] hover:text-fg" aria-label="More publish options">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m6 9 6 6 6-6" /></svg>
                  </button>
                </div>
              </div>
            }
            react={`export function SplitButton({ label, onMain, onDropdown }) {
  return (
    <div className="inline-flex overflow-hidden rounded-[10px] border border-transparent">
      <button
        onClick={onMain}
        className="inline-flex items-center gap-2
          bg-[#ededf0] px-4 py-[11px] text-[14px] font-semibold text-[#0a0a10]
          transition-all duration-200 hover:bg-white
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60"
      >
        {label}
      </button>
      <span className="w-px bg-[rgba(10,10,14,0.18)]" aria-hidden />
      <button
        onClick={onDropdown}
        aria-label={\`More \${label} options\`}
        aria-haspopup="menu"
        className="inline-flex items-center bg-[#ededf0] px-3 py-[11px]
          text-[#0a0a10] transition-all duration-200 hover:bg-white
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}`}
            html={`<div class="ghost-split-btn">
  <button class="ghost-split-btn__main">Deploy</button>
  <span class="ghost-split-btn__divider" aria-hidden></span>
  <button class="ghost-split-btn__arrow" aria-label="More deploy options">
    <svg><!-- chevron --></svg>
  </button>
</div>`}
            css={`.ghost-split-btn {
  display: inline-flex;
  overflow: hidden;
  border-radius: 10px;
}

.ghost-split-btn__main {
  padding: 11px 16px;
  font-size: 14px;
  font-weight: 600;
  background: #ededf0;
  color: #0a0a10;
  border: none;
  cursor: pointer;
  transition: background 200ms;
}

.ghost-split-btn__divider {
  width: 1px;
  background: rgba(10,10,14,0.18);
  flex-shrink: 0;
}

.ghost-split-btn__arrow {
  display: flex;
  align-items: center;
  padding: 11px 12px;
  background: #ededf0;
  border: none;
  cursor: pointer;
  transition: background 200ms;
}

.ghost-split-btn__main:hover,
.ghost-split-btn__arrow:hover { background: #ffffff; }`}
          />
        </ComponentSection>

        {/* Badge / count */}
        <ComponentSection
          id="badge"
          title="With badge"
          description="Inline notification count or label badge. Floats top-right or sits inline next to the text."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <button className="relative inline-flex items-center gap-2 rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">
                  Notifications
                  <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent/[0.18] px-1 font-mono text-[10px] font-semibold tabular-nums text-accent">4</span>
                </button>
                <button className="relative inline-flex items-center gap-2 rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">
                  Inbox
                  <span className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ef4444]/[0.20] px-1 font-mono text-[10px] font-semibold tabular-nums text-red-400">12</span>
                </button>
                <button className="relative inline-flex items-center gap-2 rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#ef4444] font-mono text-[9px] font-bold text-white shadow-[0_0_8px_rgba(239,68,68,0.6)]">3</span>
                  Alerts
                </button>
              </div>
            }
            react={`export function ButtonWithBadge({ children, count, color = 'accent', ...props }) {
  const colors = {
    accent: "bg-accent/[0.18] text-accent",
    red:    "bg-red-500/[0.20] text-red-400",
    green:  "bg-emerald-400/[0.18] text-emerald-400",
  };

  return (
    <button
      className="relative inline-flex items-center gap-2 rounded-[10px]
        border border-line-3 bg-white/[0.03] px-4 py-[11px]
        text-[14px] font-medium text-fg transition-all duration-200
        hover:border-white/[0.22] hover:bg-white/[0.06]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      {...props}
    >
      {children}
      {count !== undefined && (
        <span className={\`inline-flex h-[18px] min-w-[18px] items-center
          justify-center rounded-full px-1 font-mono text-[10px]
          font-semibold tabular-nums \${colors[color]}\`}>
          {count}
        </span>
      )}
    </button>
  );
}`}
            html={`<button class="ghost-btn">
  Notifications
  <span class="ghost-badge">4</span>
</button>`}
            css={`.ghost-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 9999px;
  background: rgba(196,181,253,0.18);
  color: #c4b5fd;
  font-family: monospace;
  font-size: 10px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}`}
          />
        </ComponentSection>

        {/* Soft tinted */}
        <ComponentSection
          id="soft"
          title="Soft"
          description="Lightly tinted surface in semantic colors — info, success, warning, purple. Lower emphasis than solid."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-2.5">
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-[#38bdf8]/[0.25] bg-[#38bdf8]/[0.08] px-4 py-[10px] text-[13.5px] font-medium text-[#38bdf8] transition-all duration-200 hover:bg-[#38bdf8]/[0.14]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                  Info
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-emerald-400/[0.25] bg-emerald-400/[0.08] px-4 py-[10px] text-[13.5px] font-medium text-emerald-400 transition-all duration-200 hover:bg-emerald-400/[0.14]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                  Success
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-amber-400/[0.25] bg-amber-400/[0.08] px-4 py-[10px] text-[13.5px] font-medium text-amber-400 transition-all duration-200 hover:bg-amber-400/[0.14]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m10.29 3.86-8.22 14.2A2 2 0 0 0 3.8 21h16.4a2 2 0 0 0 1.73-3l-8.2-14.14a2 2 0 0 0-3.44.01z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
                  Warning
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-accent/[0.25] bg-accent/[0.08] px-4 py-[10px] text-[13.5px] font-medium text-accent transition-all duration-200 hover:bg-accent/[0.14]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                  Upgrade
                </button>
              </div>
            }
            react={`export function SoftButton({ color = 'accent', icon, children, ...props }) {
  const colors = {
    info:    "border-[#38bdf8]/[0.25] bg-[#38bdf8]/[0.08] text-[#38bdf8] hover:bg-[#38bdf8]/[0.14]",
    success: "border-emerald-400/[0.25] bg-emerald-400/[0.08] text-emerald-400 hover:bg-emerald-400/[0.14]",
    warning: "border-amber-400/[0.25] bg-amber-400/[0.08] text-amber-400 hover:bg-amber-400/[0.14]",
    accent:  "border-accent/[0.25] bg-accent/[0.08] text-accent hover:bg-accent/[0.14]",
  };

  return (
    <button
      className={\`inline-flex items-center gap-2 rounded-[10px] border
        px-4 py-[10px] text-[13.5px] font-medium
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/50
        \${colors[color]}\`}
      {...props}
    >
      {icon && icon}
      {children}
    </button>
  );
}`}
            html={`<button class="ghost-btn-soft ghost-btn-soft--info">Info</button>
<button class="ghost-btn-soft ghost-btn-soft--success">Success</button>
<button class="ghost-btn-soft ghost-btn-soft--warning">Warning</button>
<button class="ghost-btn-soft ghost-btn-soft--accent">Upgrade</button>`}
            css={`.ghost-btn-soft {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 16px; border-radius: 10px; border: 1px solid;
  font-size: 13.5px; font-weight: 500; cursor: pointer; transition: background 200ms;
}
.ghost-btn-soft--info    { border-color: rgba(56,189,248,.25); background: rgba(56,189,248,.08); color: #38bdf8; }
.ghost-btn-soft--success { border-color: rgba(52,211,153,.25); background: rgba(52,211,153,.08); color: #34d399; }
.ghost-btn-soft--warning { border-color: rgba(251,191,36,.25);  background: rgba(251,191,36,.08); color: #fbbf24; }
.ghost-btn-soft--accent  { border-color: rgba(196,181,253,.25); background: rgba(196,181,253,.08); color: #c4b5fd; }
.ghost-btn-soft--info:hover    { background: rgba(56,189,248,.14); }
.ghost-btn-soft--success:hover { background: rgba(52,211,153,.14); }
.ghost-btn-soft--warning:hover { background: rgba(251,191,36,.14); }
.ghost-btn-soft--accent:hover  { background: rgba(196,181,253,.14); }`}
          />
        </ComponentSection>

        {/* Full width */}
        <ComponentSection
          id="fullwidth"
          title="Full width"
          description="Block-level button that spans its container. Common in mobile layouts, forms, and modals."
        >
          <CodePreview
            preview={
              <div className="flex w-full max-w-[360px] flex-col gap-2.5">
                <button className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-transparent bg-[#ededf0] px-4 py-[11px] text-[14px] font-semibold text-[#0a0a10] transition-all duration-200 hover:bg-white hover:shadow-[0_12px_28px_-8px_rgba(196,181,253,0.4)]">
                  Continue with email →
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">
                  Back
                </button>
              </div>
            }
            react={`export function FullWidthButton({ variant = 'primary', children, ...props }) {
  const styles = {
    primary: "bg-[#ededf0] text-[#0a0a10] font-semibold border-transparent hover:bg-white hover:shadow-[0_12px_28px_-8px_rgba(196,181,253,0.4)]",
    ghost:   "bg-white/[0.03] text-fg font-medium border-line-3 hover:border-white/[0.22] hover:bg-white/[0.06]",
  };

  return (
    <button
      className={\`flex w-full items-center justify-center gap-2
        rounded-[10px] border px-4 py-[11px] text-[14px]
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
        \${styles[variant]}\`}
      {...props}
    >
      {children}
    </button>
  );
}`}
            html={`<button class="ghost-btn-full ghost-btn-primary">
  Continue with email →
</button>
<button class="ghost-btn-full ghost-btn">
  Back
</button>`}
            css={`.ghost-btn-full {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}`}
          />
        </ComponentSection>

        {/* With leading/trailing icon */}
        <ComponentSection
          id="iconlabel"
          title="Icon + label"
          description="Leading icon clarifies the action; trailing arrow signals navigation. Mix and match freely."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-2.5">
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[10.5px] text-[13.5px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
                  Download
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[10.5px] text-[13.5px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                  Share
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-transparent bg-[#ededf0] px-4 py-[10.5px] text-[13.5px] font-semibold text-[#0a0a10] transition-all duration-200 hover:bg-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
                  New project
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[10.5px] text-[13.5px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">
                  Open in editor
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted" aria-hidden><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" /></svg>
                </button>
              </div>
            }
            react={`export function IconLabelButton({ leadingIcon, trailingIcon, children, ...props }) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-[10px]
        border border-line-3 bg-white/[0.03] px-4 py-[10.5px]
        text-[13.5px] font-medium text-fg
        transition-all duration-200
        hover:border-white/[0.22] hover:bg-white/[0.06]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      {...props}
    >
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}`}
            html={`<!-- Leading icon -->
<button class="ghost-btn">
  <svg><!-- download icon --></svg>
  Download
</button>

<!-- Trailing icon -->
<button class="ghost-btn">
  Share
  <svg><!-- arrow icon --></svg>
</button>

<!-- External link -->
<button class="ghost-btn">
  Open in editor
  <svg class="ghost-ext-icon"><!-- external icon --></svg>
</button>`}
            css={`.ghost-ext-icon { color: #5a5a68; flex-shrink: 0; }`}
          />
        </ComponentSection>

        {/* Social */}
        <ComponentSection
          id="social"
          title="Social / OAuth"
          description="One-click OAuth entry points. Recognizable platform branding, consistent Ghost UI surface."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-2.5">
                {/* GitHub */}
                <button className="inline-flex items-center gap-2.5 rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[10.5px] text-[13.5px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" /></svg>
                  Continue with GitHub
                </button>
                {/* Google */}
                <button className="inline-flex items-center gap-2.5 rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[10.5px] text-[13.5px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
                {/* X / Twitter */}
                <button className="inline-flex items-center gap-2.5 rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[10.5px] text-[13.5px] font-medium text-fg transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.06]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.741-8.851L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  Continue with X
                </button>
              </div>
            }
            react={`const PROVIDERS = [
  {
    id: 'github',
    label: 'GitHub',
    icon: <GithubIcon />,
  },
  {
    id: 'google',
    label: 'Google',
    icon: <GoogleIcon />,
  },
];

export function OAuthButtons({ onSignIn }) {
  return (
    <div className="flex flex-col gap-2.5">
      {PROVIDERS.map(p => (
        <button
          key={p.id}
          onClick={() => onSignIn(p.id)}
          className="inline-flex items-center gap-2.5 rounded-[10px]
            border border-line-3 bg-white/[0.03]
            px-4 py-[10.5px] text-[13.5px] font-medium text-fg
            transition-all duration-200
            hover:border-white/[0.22] hover:bg-white/[0.06]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          {p.icon}
          Continue with {p.label}
        </button>
      ))}
    </div>
  );
}`}
            html={`<button class="ghost-btn ghost-social-btn">
  <svg><!-- GitHub icon --></svg>
  Continue with GitHub
</button>

<button class="ghost-btn ghost-social-btn">
  <svg><!-- Google icon --></svg>
  Continue with Google
</button>`}
            css={`.ghost-social-btn {
  width: 100%;
  justify-content: center;
}

.ghost-social-btn svg {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}`}
          />
        </ComponentSection>

        {/* Disabled */}
        <ComponentSection
          id="disabled"
          title="Disabled"
          description="All variants in their disabled state. Pointer events removed; opacity communicates unavailability."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <button disabled className="inline-flex cursor-not-allowed items-center gap-2 rounded-[10px] border border-transparent bg-[#ededf0] px-4 py-[11px] text-[14px] font-semibold text-[#0a0a10] opacity-40">
                  Primary
                </button>
                <button disabled className="inline-flex cursor-not-allowed items-center gap-2 rounded-[10px] border border-line-3 bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium text-fg opacity-40">
                  Ghost
                </button>
                <button disabled className="inline-flex cursor-not-allowed items-center gap-2 rounded-[10px] border border-accent/[0.35] bg-accent/[0.10] px-4 py-[11px] text-[14px] font-medium text-accent opacity-40">
                  Accent
                </button>
                <button disabled className="inline-flex cursor-not-allowed items-center gap-2 rounded-[10px] border border-red-500/[0.28] bg-red-500/[0.08] px-4 py-[11px] text-[14px] font-medium text-red-400 opacity-40">
                  Destructive
                </button>
              </div>
            }
            react={`// All button variants support native disabled
<Button disabled>Primary</Button>
<GhostButton disabled>Ghost</GhostButton>
<AccentButton disabled>Accent</AccentButton>
<DestructiveButton disabled>Destructive</DestructiveButton>

// In your base styles, add:
// "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"`}
            html={`<button class="ghost-btn-primary" disabled>Primary</button>
<button class="ghost-btn" disabled>Ghost</button>
<button class="ghost-btn-accent" disabled>Accent</button>`}
            css={`/* Disabled state — applies to all button variants */
button:disabled,
button[aria-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}`}
          />
        </ComponentSection>

        {/* ── 8 new variants ──────────────────────────────────────── */}

        {/* Gradient */}
        <ComponentSection
          id="gradient"
          title="Gradient"
          description="Vivid multicolour gradient fill. Works as a hero CTA or to make an action impossible to miss."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-[0_12px_32px_-8px_rgba(139,92,246,0.6)]" style={{ background: 'linear-gradient(135deg,#6d28d9,#c4b5fd,#38bdf8)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                  Upgrade plan
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-[0_12px_32px_-8px_rgba(236,72,153,0.5)]" style={{ background: 'linear-gradient(135deg,#ec4899,#f97316,#eab308)' }}>
                  Go Pro
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
                <button className="inline-flex items-center rounded-full border-0 px-5 py-[10px] text-[13.5px] font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-[0_10px_28px_-8px_rgba(52,211,153,0.5)]" style={{ background: 'linear-gradient(135deg,#0ea5e9,#34d399)' }}>
                  Start free
                </button>
              </div>
            }
            react={`export function GradientButton({ gradient, children, ...props }) {
  const presets = {
    purple: 'linear-gradient(135deg, #6d28d9, #c4b5fd, #38bdf8)',
    sunset: 'linear-gradient(135deg, #ec4899, #f97316, #eab308)',
    ocean:  'linear-gradient(135deg, #0ea5e9, #34d399)',
  };

  return (
    <button
      style={{ background: presets[gradient] }}
      className="inline-flex items-center gap-2 rounded-[10px] border-0
        px-4 py-[11px] text-[14px] font-semibold text-white
        transition-all duration-300
        hover:opacity-90
        hover:shadow-[0_12px_32px_-8px_rgba(139,92,246,0.6)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      {...props}
    >
      {children}
    </button>
  );
}`}
            html={`<button class="ghost-btn-gradient">
  Upgrade plan
</button>`}
            css={`.ghost-btn-gradient {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #6d28d9, #c4b5fd, #38bdf8);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 300ms ease;
}

.ghost-btn-gradient:hover {
  opacity: 0.90;
  box-shadow: 0 12px 32px -8px rgba(139,92,246,0.6);
}`}
          />
        </ComponentSection>

        {/* Neon */}
        <ComponentSection
          id="neon"
          title="Neon / Glow"
          description="Dark background with a glowing colored border and ambient shadow. Great for sci-fi or gaming UI."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-[10px] border bg-[#0a0218] px-4 py-[11px] text-[14px] font-medium transition-all duration-300 hover:shadow-[0_0_24px_rgba(196,181,253,0.5),inset_0_0_24px_rgba(196,181,253,0.06)]" style={{ borderColor: 'rgba(196,181,253,0.50)', color: '#c4b5fd', boxShadow: '0 0 12px rgba(196,181,253,0.25),inset 0 0 12px rgba(196,181,253,0.04)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                  Launch
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border bg-[#001a12] px-4 py-[11px] text-[14px] font-medium transition-all duration-300 hover:shadow-[0_0_24px_rgba(52,211,153,0.5),inset_0_0_24px_rgba(52,211,153,0.06)]" style={{ borderColor: 'rgba(52,211,153,0.45)', color: '#34d399', boxShadow: '0 0 12px rgba(52,211,153,0.22),inset 0 0 12px rgba(52,211,153,0.04)' }}>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#34d399] shadow-[0_0_6px_#34d399]" />
                  Online
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border bg-[#160018] px-4 py-[11px] text-[14px] font-medium transition-all duration-300 hover:shadow-[0_0_24px_rgba(240,171,252,0.5),inset_0_0_24px_rgba(240,171,252,0.06)]" style={{ borderColor: 'rgba(240,171,252,0.45)', color: '#f0abfc', boxShadow: '0 0 12px rgba(240,171,252,0.22),inset 0 0 12px rgba(240,171,252,0.04)' }}>
                  Power up
                </button>
              </div>
            }
            react={`export function NeonButton({ color = 'violet', children, ...props }) {
  const neons = {
    violet: { border: 'rgba(196,181,253,0.50)', text: '#c4b5fd', bg: '#0a0218',
      glow: 'rgba(196,181,253,0.25)' },
    green:  { border: 'rgba(52,211,153,0.45)',  text: '#34d399', bg: '#001a12',
      glow: 'rgba(52,211,153,0.22)' },
    pink:   { border: 'rgba(240,171,252,0.45)', text: '#f0abfc', bg: '#160018',
      glow: 'rgba(240,171,252,0.22)' },
  };
  const c = neons[color];

  return (
    <button
      style={{
        borderColor: c.border,
        color: c.text,
        background: c.bg,
        boxShadow: \`0 0 12px \${c.glow}, inset 0 0 12px \${c.glow.replace('0.22','0.04')}\`,
      }}
      className="inline-flex items-center gap-2 rounded-[10px] border
        px-4 py-[11px] text-[14px] font-medium
        transition-all duration-300
        hover:shadow-[0_0_28px_var(--glow),inset_0_0_24px_var(--glow)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/40"
      {...props}
    >
      {children}
    </button>
  );
}`}
            html={`<button class="ghost-btn-neon ghost-btn-neon--violet">
  Launch
</button>`}
            css={`.ghost-btn-neon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border-radius: 10px;
  border: 1px solid;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 300ms ease;
}

.ghost-btn-neon--violet {
  border-color: rgba(196,181,253,0.50);
  color: #c4b5fd;
  background: #0a0218;
  box-shadow: 0 0 12px rgba(196,181,253,0.25), inset 0 0 12px rgba(196,181,253,0.04);
}

.ghost-btn-neon--violet:hover {
  box-shadow: 0 0 28px rgba(196,181,253,0.55), inset 0 0 24px rgba(196,181,253,0.08);
}`}
          />
        </ComponentSection>

        {/* Shimmer */}
        <ComponentSection
          id="shimmer"
          title="Shimmer"
          description="An animated metallic highlight sweeps across the button — grabs attention without being distracting."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="inline-flex items-center gap-2 rounded-[10px] border-0 px-4 py-[11px] text-[14px] font-semibold text-white"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #6d28d9 0%, #c4b5fd 30%, #38bdf8 50%, #c4b5fd 70%, #6d28d9 100%)',
                    backgroundSize: '200% auto',
                    animation: 'btn-shimmer 3s linear infinite',
                  }}
                >
                  Shimmer CTA
                </button>
                <button
                  className="relative inline-flex items-center gap-2 overflow-hidden rounded-[10px] border border-white/[0.12] bg-white/[0.03] px-4 py-[11px] text-[14px] font-medium text-[#c8c8d8]"
                >
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-full"
                    style={{
                      backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
                      animation: 'btn-shimmer 2.5s ease-in-out infinite',
                      backgroundSize: '200% auto',
                    }}
                  />
                  Ghost shimmer
                </button>
                <button
                  className="inline-flex items-center rounded-full border-0 px-5 py-[10px] text-[13.5px] font-semibold text-[#0a0a10]"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #c4b5fd 0%, #ededf0 30%, #c4b5fd 50%, #ededf0 70%, #c4b5fd 100%)',
                    backgroundSize: '200% auto',
                    animation: 'btn-shimmer 2s linear infinite',
                  }}
                >
                  Pearl pill
                </button>
              </div>
            }
            react={`// Add to globals.css:
// @keyframes btn-shimmer {
//   0%   { background-position: 200% center; }
//   100% { background-position: -200% center; }
// }

export function ShimmerButton({ children, ...props }) {
  return (
    <button
      style={{
        backgroundImage:
          'linear-gradient(90deg, #6d28d9 0%, #c4b5fd 30%, #38bdf8 50%, #c4b5fd 70%, #6d28d9 100%)',
        backgroundSize: '200% auto',
        animation: 'btn-shimmer 3s linear infinite',
      }}
      className="inline-flex items-center gap-2 rounded-[10px] border-0
        px-4 py-[11px] text-[14px] font-semibold text-white
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      {...props}
    >
      {children}
    </button>
  );
}`}
            html={`<button class="ghost-btn-shimmer">Shimmer CTA</button>`}
            css={`@keyframes btn-shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}

.ghost-btn-shimmer {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border-radius: 10px;
  border: none;
  background-image: linear-gradient(90deg,
    #6d28d9 0%, #c4b5fd 30%, #38bdf8 50%, #c4b5fd 70%, #6d28d9 100%);
  background-size: 200% auto;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  animation: btn-shimmer 3s linear infinite;
}`}
          />
        </ComponentSection>

        {/* FAB */}
        <ComponentSection
          id="fab"
          title="FAB"
          description="Floating Action Button — circular primary action. Includes extended (label) variant for wider contexts."
        >
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-4">
                {/* Standard FAB */}
                <button aria-label="Create new" className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-transparent bg-[#ededf0] text-[#0a0a10] shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-200 hover:bg-white hover:scale-105 hover:shadow-[0_8px_32px_-4px_rgba(196,181,253,0.5)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
                </button>
                {/* Accent FAB */}
                <button aria-label="Compose" className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-accent/[0.40] bg-[linear-gradient(180deg,rgba(196,181,253,0.24),rgba(139,92,246,0.14))] text-accent shadow-[0_4px_24px_rgba(139,92,246,0.3)] transition-all duration-200 hover:scale-105 hover:shadow-[0_8px_32px_-4px_rgba(139,92,246,0.5)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
                {/* Mini FAB */}
                <button aria-label="Filter" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.05] text-[#9898b0] shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all duration-200 hover:bg-white/[0.10] hover:text-[#c8c8d8] hover:scale-105">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                </button>
                {/* Extended FAB */}
                <button className="inline-flex items-center gap-2.5 rounded-full border border-transparent bg-[#ededf0] pl-5 pr-6 py-[13px] text-[14px] font-semibold text-[#0a0a10] shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all duration-200 hover:bg-white hover:shadow-[0_8px_28px_-4px_rgba(196,181,253,0.45)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 5v14M5 12h14" /></svg>
                  New document
                </button>
              </div>
            }
            react={`export function FAB({ label, icon, size = 'md', extended, children }) {
  const sizes = {
    sm:  'h-10 w-10 rounded-full',
    md:  'h-14 w-14 rounded-full',
    ext: 'h-14 rounded-full pl-5 pr-6 gap-2.5',
  };

  return (
    <button
      aria-label={!extended ? label : undefined}
      className={\`inline-flex items-center justify-center
        border border-transparent
        bg-[#ededf0] text-[#0a0a10]
        font-semibold text-[14px]
        shadow-[0_4px_24px_rgba(0,0,0,0.4)]
        transition-all duration-200
        hover:bg-white hover:scale-105
        hover:shadow-[0_8px_32px_-4px_rgba(196,181,253,0.5)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60
        \${sizes[extended ? 'ext' : size]}\`}
    >
      {icon}
      {extended && children}
    </button>
  );
}`}
            html={`<!-- Standard FAB -->
<button class="ghost-fab" aria-label="Create new">
  <svg><!-- plus icon --></svg>
</button>

<!-- Extended FAB -->
<button class="ghost-fab ghost-fab--extended">
  <svg><!-- plus icon --></svg>
  New document
</button>`}
            css={`.ghost-fab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  border: none;
  background: #ededf0;
  color: #0a0a10;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  cursor: pointer;
  transition: all 200ms ease;
}

.ghost-fab:hover {
  background: #fff;
  transform: scale(1.05);
  box-shadow: 0 8px 32px -4px rgba(196,181,253,0.5);
}

.ghost-fab--extended {
  width: auto;
  gap: 10px;
  padding: 0 24px 0 20px;
  font-size: 14px;
  font-weight: 600;
}`}
          />
        </ComponentSection>

        {/* Toggle */}
        <ComponentSection
          id="toggle"
          title="Toggle"
          description="Stateful on/off button. Active state uses a distinct color so the current value is always clear."
        >
          <CodePreview
            preview={<ToggleDemo />}
            react={`'use client';
import { useState } from 'react';

export function ToggleButton({ defaultOn = false, onLabel, offLabel }) {
  const [on, setOn] = useState(defaultOn);

  return (
    <button
      onClick={() => setOn(o => !o)}
      aria-pressed={on}
      className={\`inline-flex items-center gap-2 rounded-[10px] border
        px-4 py-[11px] text-[14px] font-medium
        transition-all duration-200
        \${on
          ? 'border-accent/[0.40] bg-accent/[0.14] text-accent shadow-[0_0_20px_rgba(196,181,253,0.15)]'
          : 'border-white/[0.12] bg-white/[0.03] text-[#787890] hover:border-white/[0.20] hover:text-[#a8a8be]'
        }\`}
    >
      <span className={\`h-2 w-2 rounded-full transition-all duration-200
        \${on ? 'bg-accent shadow-[0_0_6px_rgba(196,181,253,0.8)]' : 'bg-[#484860]'}\`}
      />
      {on ? onLabel : offLabel}
    </button>
  );
}`}
            html={`<button
  class="ghost-btn ghost-toggle"
  aria-pressed="false"
  onclick="this.classList.toggle('ghost-toggle--on');
           this.setAttribute('aria-pressed',
             this.getAttribute('aria-pressed')==='true'?'false':'true')"
>
  <span class="ghost-toggle__dot"></span>
  Disabled
</button>`}
            css={`.ghost-toggle { display: inline-flex; align-items: center; gap: 8px; }
.ghost-toggle__dot {
  width: 8px; height: 8px; border-radius: 9999px;
  background: #484860; transition: all 200ms;
}
.ghost-toggle--on {
  border-color: rgba(196,181,253,0.40) !important;
  background: rgba(196,181,253,0.14) !important;
  color: #c4b5fd !important;
  box-shadow: 0 0 20px rgba(196,181,253,0.15);
}
.ghost-toggle--on .ghost-toggle__dot {
  background: #c4b5fd;
  box-shadow: 0 0 6px rgba(196,181,253,0.8);
}`}
          />
        </ComponentSection>

        {/* Copy */}
        <ComponentSection
          id="copy"
          title="Copy to clipboard"
          description="One-click copy with immediate visual confirmation. Three patterns: standalone, inline code, and share link."
        >
          <CodePreview
            preview={<CopyDemo />}
            react={`'use client';
import { useState } from 'react';

export function CopyButton({ text, children }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className={\`inline-flex items-center gap-2 rounded-[10px] border
        px-4 py-[11px] text-[14px] font-medium
        transition-all duration-200 \${
          copied
            ? 'border-emerald-400/[0.35] bg-emerald-400/[0.10] text-emerald-400'
            : 'border-white/[0.12] bg-white/[0.03] text-[#9898b0] hover:border-white/[0.20] hover:text-[#c0c0d0]'
        }\`}
    >
      {copied
        ? <svg><!-- check icon --></svg>
        : <svg><!-- copy icon --></svg>}
      {copied ? 'Copied!' : children}
    </button>
  );
}`}
            html={`<button
  class="ghost-btn ghost-copy-btn"
  onclick="navigator.clipboard.writeText(this.dataset.copy)
    .then(()=>{ this.textContent='Copied!';
      setTimeout(()=>this.textContent='Copy command',2000) })"
  data-copy="npm install @ghost-ui/react"
>
  Copy command
</button>`}
            css={`.ghost-copy-btn { transition: all 200ms; }
.ghost-copy-btn.copied {
  border-color: rgba(52,211,153,0.35) !important;
  background: rgba(52,211,153,0.10) !important;
  color: #34d399 !important;
}`}
          />
        </ComponentSection>

        {/* Confirm */}
        <ComponentSection
          id="confirm"
          title="Confirm"
          description="Two-step confirmation for destructive actions. First click arms it, second executes. Auto-resets after 3 s."
        >
          <CodePreview
            preview={<ConfirmDemo />}
            react={`'use client';
import { useState, useRef } from 'react';

export function ConfirmButton({ onConfirm, children }) {
  const [armed, setArmed] = useState(false);
  const timer = useRef(null);

  function handleClick() {
    if (!armed) {
      setArmed(true);
      timer.current = setTimeout(() => setArmed(false), 3000);
    } else {
      clearTimeout(timer.current);
      setArmed(false);
      onConfirm?.();
    }
  }

  return (
    <button
      onClick={handleClick}
      className={\`inline-flex items-center gap-2 rounded-[10px] border
        px-4 py-[11px] text-[14px] font-medium transition-all duration-300
        \${armed
          ? 'border-amber-400/[0.40] bg-amber-400/[0.12] text-amber-400 animate-pulse'
          : 'border-red-500/[0.28] bg-red-500/[0.07] text-red-400 hover:border-red-500/[0.45] hover:bg-red-500/[0.12]'
        }\`}
    >
      {armed ? 'Click again to confirm' : children}
    </button>
  );
}`}
            html={`<button
  class="ghost-btn-destructive"
  data-armed="false"
  onclick="const b=this;
    if(b.dataset.armed==='false'){
      b.dataset.armed='true';
      b.textContent='Click again to confirm';
      b.classList.add('armed');
      setTimeout(()=>{b.dataset.armed='false';b.textContent='Delete';b.classList.remove('armed')},3000)
    } else { /* run action */ }"
>
  Delete project
</button>`}
            css={`.ghost-btn-destructive.armed {
  border-color: rgba(251,191,36,0.40);
  background: rgba(251,191,36,0.12);
  color: #fbbf24;
  animation: pulse 1s ease-in-out infinite;
}`}
          />
        </ComponentSection>

        {/* Progress */}
        <ComponentSection
          id="progress"
          title="Progress"
          description="Two patterns: a hairline progress bar at the bottom edge, and a fill-sweep variant. Both show live percentage."
        >
          <CodePreview
            preview={<ProgressDemo />}
            react={`'use client';
import { useState } from 'react';

export function ProgressButton({ onAction, children }) {
  const [progress, setProgress] = useState(null);

  async function handleClick() {
    if (progress !== null) return;
    setProgress(0);
    // simulate work
    for (let p = 0; p <= 100; p += Math.random() * 18) {
      await new Promise(r => setTimeout(r, 200));
      setProgress(Math.min(p, 100));
    }
    setProgress(100);
    setTimeout(() => setProgress(null), 1200);
  }

  const done = progress === 100;

  return (
    <button
      onClick={handleClick}
      disabled={progress !== null && !done}
      className="relative inline-flex items-center gap-2 overflow-hidden
        rounded-[10px] border border-white/[0.12] bg-white/[0.03]
        px-4 py-[11px] text-[14px] font-medium
        transition-all duration-200 disabled:cursor-default"
      style={{ color: done ? '#34d399' : progress !== null ? '#c4b5fd' : '#9898b0' }}
    >
      {/* Progress bar */}
      {progress !== null && (
        <span
          className="absolute bottom-0 left-0 h-[2px] rounded-full bg-accent transition-all duration-200"
          style={{ width: \`\${progress}%\` }}
        />
      )}
      {/* Icon + label */}
      <svg><!-- context icon --></svg>
      {done ? 'Done!' : progress !== null ? \`\${Math.round(progress)}%\` : children}
    </button>
  );
}`}
            html={`<button class="ghost-btn ghost-progress-btn" id="upload-btn">
  <span class="ghost-progress-bar" id="upload-bar"></span>
  Upload file
</button>`}
            css={`.ghost-progress-btn {
  position: relative;
  overflow: hidden;
}

.ghost-progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0%;
  border-radius: 9999px;
  background: #c4b5fd;
  transition: width 200ms ease;
}`}
          />
        </ComponentSection>

        {/* ── 18 more variants ─────────────────────────────────────── */}

        {/* Glass */}
        <ComponentSection id="glass" title="Glass" description="Frosted glass surface — backdrop blur + subtle border. Ideal over images, gradients, or blurred backgrounds.">
          <CodePreview
            preview={
              <div className="relative flex flex-wrap items-center gap-3 overflow-hidden rounded-xl p-6" style={{ background: 'linear-gradient(135deg,#1a0533,#0a1a33,#001a1a)' }}>
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-white/[0.18] px-4 py-[11px] text-[14px] font-medium text-white/90 transition-all duration-200 hover:border-white/[0.30] hover:bg-white/[0.12]" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Glass primary
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-white/[0.12] px-4 py-[11px] text-[14px] font-medium text-white/70 transition-all duration-200 hover:border-white/[0.22] hover:bg-white/[0.08]" style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}>
                  Glass ghost
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] px-5 py-[9px] text-[13.5px] font-medium text-white/80 transition-all duration-200 hover:bg-white/[0.10]" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
                  Glass pill
                </button>
              </div>
            }
            react={`export function GlassButton({ children, ...props }) {
  return (
    <button
      style={{ backdropFilter: 'blur(12px)' }}
      className="inline-flex items-center gap-2 rounded-[10px]
        border border-white/[0.18] bg-white/[0.08]
        px-4 py-[11px] text-[14px] font-medium text-white/90
        transition-all duration-200
        hover:border-white/[0.30] hover:bg-white/[0.12]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      {...props}
    >
      {children}
    </button>
  );
}`}
            html={`<button class="ghost-btn-glass">Glass button</button>`}
            css={`.ghost-btn-glass {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: rgba(255,255,255,0.90);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease;
}
.ghost-btn-glass:hover {
  border-color: rgba(255,255,255,0.30);
  background: rgba(255,255,255,0.12);
}`}
          />
        </ComponentSection>

        {/* 3D Raised */}
        <ComponentSection id="raised" title="3D / Raised" description="Hard offset shadow creates depth. Presses flush on :active — gives physical tactile feedback.">
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-4">
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-[#c8c8d0] bg-[#ededf0] px-4 py-[11px] text-[14px] font-semibold text-[#0a0a10] transition-all duration-75 active:translate-y-[3px] active:shadow-none" style={{ boxShadow: '0 3px 0 0 #b0b0b8' }}>
                  Click me
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-accent/[0.50] px-4 py-[11px] text-[14px] font-medium text-accent transition-all duration-75 active:translate-y-[3px] active:shadow-none" style={{ background: 'rgba(196,181,253,0.10)', boxShadow: '0 3px 0 0 rgba(139,92,246,0.45)' }}>
                  3D Accent
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border border-red-500/[0.40] px-4 py-[11px] text-[14px] font-medium text-red-400 transition-all duration-75 active:translate-y-[3px] active:shadow-none" style={{ background: 'rgba(239,68,68,0.08)', boxShadow: '0 3px 0 0 rgba(185,28,28,0.45)' }}>
                  3D Danger
                </button>
              </div>
            }
            react={`export function RaisedButton({ color = 'default', children, ...props }) {
  const styles = {
    default: {
      border: '#c8c8d0', bg: '#ededf0', text: '#0a0a10', shadow: '#b0b0b8',
    },
    accent: {
      border: 'rgba(196,181,253,0.50)', bg: 'rgba(196,181,253,0.10)',
      text: '#c4b5fd', shadow: 'rgba(139,92,246,0.45)',
    },
  };
  const s = styles[color];
  return (
    <button
      style={{ boxShadow: \`0 3px 0 0 \${s.shadow}\`, borderColor: s.border, background: s.bg, color: s.text }}
      className="inline-flex items-center gap-2 rounded-[10px] border
        px-4 py-[11px] text-[14px] font-semibold
        transition-all duration-75
        active:translate-y-[3px] active:shadow-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      {...props}
    >
      {children}
    </button>
  );
}`}
            html={`<button class="ghost-btn-raised">Click me</button>`}
            css={`.ghost-btn-raised {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  border-radius: 10px;
  border: 1px solid #c8c8d0;
  background: #ededf0;
  color: #0a0a10;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 3px 0 0 #b0b0b8;
  transition: transform 75ms, box-shadow 75ms;
}
.ghost-btn-raised:active {
  transform: translateY(3px);
  box-shadow: none;
}`}
          />
        </ComponentSection>

        {/* Outline thick */}
        <ComponentSection id="outline" title="Outline thick" description="Bold 2px border, no fill. Higher visual weight than ghost — sits between ghost and filled.">
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-[10px] border-2 border-[#ededf0] bg-transparent px-4 py-[10px] text-[14px] font-semibold text-[#ededf0] transition-all duration-200 hover:bg-[#ededf0] hover:text-[#0a0a10]">
                  Default
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border-2 border-accent bg-transparent px-4 py-[10px] text-[14px] font-semibold text-accent transition-all duration-200 hover:bg-accent hover:text-[#0a0a10]">
                  Accent
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] border-2 border-red-400 bg-transparent px-4 py-[10px] text-[14px] font-semibold text-red-400 transition-all duration-200 hover:bg-red-400 hover:text-white">
                  Destructive
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border-2 border-[#ededf0] bg-transparent px-5 py-[9px] text-[13.5px] font-semibold text-[#ededf0] transition-all duration-200 hover:bg-[#ededf0] hover:text-[#0a0a10]">
                  Pill outline
                </button>
              </div>
            }
            react={`export function OutlineButton({ color = 'default', pill, children, ...props }) {
  const colors = {
    default:     'border-[#ededf0] text-[#ededf0] hover:bg-[#ededf0] hover:text-[#0a0a10]',
    accent:      'border-accent text-accent hover:bg-accent hover:text-[#0a0a10]',
    destructive: 'border-red-400 text-red-400 hover:bg-red-400 hover:text-white',
  };
  return (
    <button
      className={\`inline-flex items-center gap-2 border-2 bg-transparent
        \${pill ? 'rounded-full px-5 py-[9px]' : 'rounded-[10px] px-4 py-[10px]'}
        text-[14px] font-semibold transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/50
        \${colors[color]}\`}
      {...props}
    >
      {children}
    </button>
  );
}`}
            html={`<button class="ghost-btn-outline">Default</button>
<button class="ghost-btn-outline ghost-btn-outline--accent">Accent</button>`}
            css={`.ghost-btn-outline {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 16px; border-radius: 10px;
  border: 2px solid #ededf0; background: transparent;
  color: #ededf0; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 200ms ease;
}
.ghost-btn-outline:hover { background: #ededf0; color: #0a0a10; }
.ghost-btn-outline--accent { border-color: #c4b5fd; color: #c4b5fd; }
.ghost-btn-outline--accent:hover { background: #c4b5fd; color: #0a0a10; }`}
          />
        </ComponentSection>

        {/* Brutalist */}
        <ComponentSection id="brutalist" title="Brutalist" description="Hard black offset shadow, bold border, zero softness. Raw and unapologetic — makes a strong design statement.">
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-4">
                <button className="inline-flex items-center gap-2 rounded-none border-2 border-[#ededf0] bg-[#ededf0] px-4 py-[11px] text-[14px] font-bold text-[#0a0a10] transition-all duration-100 hover:-translate-y-[2px] hover:shadow-[4px_6px_0_0_#c4b5fd] active:translate-y-0 active:shadow-[2px_2px_0_0_#c4b5fd]" style={{ boxShadow: '4px 4px 0 0 #c4b5fd' }}>
                  BRUTALIST
                </button>
                <button className="inline-flex items-center gap-2 rounded-none border-2 border-[#ededf0] bg-transparent px-4 py-[11px] text-[14px] font-bold text-[#ededf0] transition-all duration-100 hover:-translate-y-[2px] hover:shadow-[4px_6px_0_0_#ededf0] active:translate-y-0 active:shadow-[2px_2px_0_0_#ededf0]" style={{ boxShadow: '4px 4px 0 0 rgba(237,237,240,0.5)' }}>
                  GHOST
                </button>
                <button className="inline-flex items-center gap-2 rounded-none border-2 border-accent bg-accent px-4 py-[11px] text-[14px] font-bold text-[#0a0a10] transition-all duration-100 hover:-translate-y-[2px] hover:shadow-[4px_6px_0_0_#8b5cf6] active:translate-y-0 active:shadow-[2px_2px_0_0_#8b5cf6]" style={{ boxShadow: '4px 4px 0 0 #8b5cf6' }}>
                  ACCENT
                </button>
              </div>
            }
            react={`export function BrutalistButton({ variant = 'default', children, ...props }) {
  const styles = {
    default: 'border-[#ededf0] bg-[#ededf0] text-[#0a0a10] shadow-[4px_4px_0_0_#c4b5fd] hover:shadow-[4px_6px_0_0_#c4b5fd]',
    ghost:   'border-[#ededf0] bg-transparent text-[#ededf0] shadow-[4px_4px_0_0_rgba(237,237,240,0.5)]',
    accent:  'border-accent bg-accent text-[#0a0a10] shadow-[4px_4px_0_0_#8b5cf6] hover:shadow-[4px_6px_0_0_#8b5cf6]',
  };
  return (
    <button
      className={\`inline-flex items-center gap-2 rounded-none border-2
        px-4 py-[11px] text-[14px] font-bold
        transition-all duration-100
        hover:-translate-y-[2px] active:translate-y-0 active:shadow-[2px_2px_0_0_currentColor]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent
        \${styles[variant]}\`}
      {...props}
    >
      {children}
    </button>
  );
}`}
            html={`<button class="ghost-btn-brutalist">BRUTALIST</button>`}
            css={`.ghost-btn-brutalist {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 16px; border-radius: 0;
  border: 2px solid #ededf0; background: #ededf0;
  color: #0a0a10; font-size: 14px; font-weight: 700;
  cursor: pointer; box-shadow: 4px 4px 0 0 #c4b5fd;
  transition: all 100ms ease;
}
.ghost-btn-brutalist:hover { transform: translateY(-2px); box-shadow: 4px 6px 0 0 #c4b5fd; }
.ghost-btn-brutalist:active { transform: translateY(0); box-shadow: 2px 2px 0 0 #c4b5fd; }`}
          />
        </ComponentSection>

        {/* Stacked */}
        <ComponentSection id="stacked" title="Stacked" description="Icon sits above the label — vertical layout. Common in bottom nav bars, toolbars, and compact action grids.">
          <CodePreview
            preview={
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: 'Home', active: true },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>, label: 'Search', active: false },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, label: 'Saved', active: false },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: 'Profile', active: false },
                ].map(({ icon, label, active }) => (
                  <button key={label} className={`inline-flex flex-col items-center gap-1.5 rounded-[12px] px-5 py-3 text-[11px] font-medium tracking-[0.02em] transition-all duration-150 ${active ? 'bg-accent/[0.12] text-accent' : 'text-[#787890] hover:bg-white/[0.04] hover:text-[#b0b0c4]'}`}>
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            }
            react={`export function StackedButton({ icon, label, active, ...props }) {
  return (
    <button
      aria-current={active ? 'page' : undefined}
      className={\`inline-flex flex-col items-center gap-1.5
        rounded-[12px] px-5 py-3
        text-[11px] font-medium tracking-[0.02em]
        transition-all duration-150
        \${active
          ? 'bg-accent/[0.12] text-accent'
          : 'text-[#787890] hover:bg-white/[0.04] hover:text-[#b0b0c4]'
        }\`}
      {...props}
    >
      {icon}
      {label}
    </button>
  );
}`}
            html={`<button class="ghost-btn-stacked ghost-btn-stacked--active" aria-current="page">
  <svg><!-- home icon --></svg>
  Home
</button>`}
            css={`.ghost-btn-stacked {
  display: inline-flex; flex-direction: column;
  align-items: center; gap: 6px;
  padding: 12px 20px; border-radius: 12px; border: none;
  background: transparent; color: #787890;
  font-size: 11px; font-weight: 500; letter-spacing: 0.02em;
  cursor: pointer; transition: all 150ms;
}
.ghost-btn-stacked:hover { background: rgba(255,255,255,0.04); color: #b0b0c4; }
.ghost-btn-stacked--active { background: rgba(196,181,253,0.12); color: #c4b5fd; }`}
          />
        </ComponentSection>

        {/* Keyboard shortcut */}
        <ComponentSection id="kbdshort" title="Keyboard shortcut" description="Inline keyboard hint shows discoverability of shortcut keys. Useful in command palettes, toolbars, and menus.">
          <CodePreview
            preview={
              <div className="flex flex-col gap-2 max-w-[320px]">
                {[
                  { label: 'New document', keys: ['⌘', 'N'] },
                  { label: 'Find & replace', keys: ['⌘', 'H'] },
                  { label: 'Toggle sidebar', keys: ['⌘', '\\'] },
                  { label: 'Command palette', keys: ['⌘', 'K'] },
                ].map(({ label, keys }) => (
                  <button key={label} className="flex w-full items-center justify-between rounded-[9px] border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-left text-[13.5px] text-[#9898b0] transition-all duration-150 hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-fg">
                    {label}
                    <span className="flex items-center gap-1">
                      {keys.map(k => (
                        <kbd key={k} className="inline-flex items-center justify-center rounded-[5px] border border-white/[0.10] bg-white/[0.05] px-1.5 py-0.5 font-mono text-[11px] font-medium text-[#787890]">{k}</kbd>
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            }
            react={`export function ShortcutButton({ label, keys, ...props }) {
  return (
    <button
      className="flex w-full items-center justify-between rounded-[9px]
        border border-white/[0.08] bg-white/[0.025]
        px-3.5 py-2.5 text-left text-[13.5px] text-[#9898b0]
        transition-all duration-150
        hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-fg
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      {...props}
    >
      {label}
      <span className="flex items-center gap-1">
        {keys.map(k => (
          <kbd key={k}
            className="inline-flex items-center justify-center rounded-[5px]
              border border-white/[0.10] bg-white/[0.05]
              px-1.5 py-0.5 font-mono text-[11px] font-medium text-[#787890]">
            {k}
          </kbd>
        ))}
      </span>
    </button>
  );
}`}
            html={`<button class="ghost-shortcut-btn">
  New document
  <span class="ghost-kbd-group">
    <kbd class="ghost-kbd">⌘</kbd>
    <kbd class="ghost-kbd">N</kbd>
  </span>
</button>`}
            css={`.ghost-shortcut-btn {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: 10px 14px; border-radius: 9px;
  border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.025);
  color: #9898b0; font-size: 13.5px; text-align: left;
  cursor: pointer; transition: all 150ms;
}
.ghost-shortcut-btn:hover { border-color: rgba(255,255,255,0.14); color: #ededf0; }
.ghost-kbd-group { display: flex; gap: 4px; }
.ghost-kbd {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 2px 6px; border-radius: 5px;
  border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.05);
  font-family: monospace; font-size: 11px; font-weight: 500; color: #787890;
}`}
          />
        </ComponentSection>

        {/* Magnetic */}
        <ComponentSection id="magnetic" title="Magnetic" description="Button subtly follows the cursor — creates an organic pull effect. Snaps back with a spring when the cursor leaves.">
          <CodePreview preview={<MagneticDemo />}
            react={`'use client';
import { useState, useRef } from 'react';

export function MagneticButton({ children, strength = 0.35, ...props }) {
  const wrapRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const leaving = useRef(false);

  return (
    <div
      ref={wrapRef}
      className="inline-block p-5"
      onMouseMove={e => {
        leaving.current = false;
        const r = wrapRef.current.getBoundingClientRect();
        setPos({
          x: (e.clientX - r.left - r.width  / 2) * strength,
          y: (e.clientY - r.top  - r.height / 2) * strength,
        });
      }}
      onMouseLeave={() => { leaving.current = true; setPos({ x: 0, y: 0 }); }}
    >
      <button
        style={{
          transform: \`translate(\${pos.x}px, \${pos.y}px)\`,
          transition: leaving.current
            ? 'transform 0.55s cubic-bezier(0.2,0.7,0.2,1)'
            : 'transform 0.08s ease',
        }}
        className="inline-flex items-center gap-2 rounded-[10px]
          border border-line-3 bg-white/[0.03] px-4 py-[11px]
          text-[14px] font-medium text-[#c8c8d8]"
        {...props}
      >
        {children}
      </button>
    </div>
  );
}`}
            html={`<!-- Requires JavaScript for mouse tracking -->
<div class="magnetic-wrap">
  <button class="ghost-btn magnetic-btn">Hover me</button>
</div>`}
            css={`.magnetic-wrap { display: inline-block; padding: 20px; }
.magnetic-btn { transition: transform 0.55s cubic-bezier(0.2,0.7,0.2,1); }`}
          />
        </ComponentSection>

        {/* Ripple */}
        <ComponentSection id="ripple" title="Ripple" description="Material-inspired ink ripple radiates from the tap/click point. Works on any button surface.">
          <CodePreview preview={<RippleDemo />}
            react={`'use client';
import { useState } from 'react';

export function RippleButton({ rippleColor = 'rgba(255,255,255,0.15)', children, ...props }) {
  const [ripples, setRipples] = useState([]);

  function handleClick(e) {
    const btn = e.currentTarget;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const id = Date.now() + Math.random();
    setRipples(prev => [...prev, { id, x: e.clientX - r.left - size/2, y: e.clientY - r.top - size/2, size }]);
    setTimeout(() => setRipples(prev => prev.filter(rip => rip.id !== id)), 600);
  }

  return (
    <button
      onClick={handleClick}
      className="relative overflow-hidden rounded-[10px]
        border border-line-3 bg-white/[0.03] px-4 py-[11px]
        text-[14px] font-medium text-[#9898b0]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      {...props}
    >
      {ripples.map(rip => (
        <span key={rip.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: rip.x, top: rip.y, width: rip.size, height: rip.size,
            background: rippleColor,
            animation: 'ripple 600ms ease-out forwards',
            transform: 'scale(0)', opacity: 1,
          }}
        />
      ))}
      {children}
    </button>
  );
}
// globals.css: @keyframes ripple { to { transform: scale(5); opacity: 0; } }`}
            html={`<button class="ghost-btn ghost-ripple-btn" onclick="createRipple(event, this)">
  Click me
</button>`}
            css={`@keyframes ripple { to { transform: scale(5); opacity: 0; } }

.ghost-ripple-btn { position: relative; overflow: hidden; }

.ghost-ripple {
  position: absolute; border-radius: 9999px;
  pointer-events: none; transform: scale(0); opacity: 1;
  background: rgba(255,255,255,0.15);
  animation: ripple 600ms ease-out forwards;
}`}
          />
        </ComponentSection>

        {/* Dropdown */}
        <ComponentSection id="dropdown" title="Dropdown" description="Click to reveal a contextual action list. Closes on outside click. Destructive items get red separation.">
          <CodePreview preview={<DropdownDemo />}
            react={`'use client';
import { useState, useRef, useEffect } from 'react';

export function DropdownButton({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-2 rounded-[10px]
          border border-white/[0.12] bg-white/[0.03]
          px-4 py-[11px] text-[14px] font-medium text-[#9898b0]
          transition-all duration-150 hover:border-white/[0.20] hover:text-fg"
      >
        {label}
        <svg className={\`transition-transform \${open ? 'rotate-180' : ''}\`}
          width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50
          min-w-[160px] overflow-hidden rounded-[12px]
          border border-white/[0.10] bg-[#0e0e1a]
          py-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          {items.map((item, i) => (
            <button key={item.label}
              onClick={() => setOpen(false)}
              className={\`flex w-full items-center gap-2.5 px-4 py-2
                text-[13px] transition-colors hover:bg-white/[0.05]
                \${item.destructive ? 'text-red-400 mt-1 border-t border-white/[0.06]' : 'text-[#9898b0] hover:text-fg'}\`}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}`}
            html={`<div class="ghost-dropdown">
  <button class="ghost-btn ghost-dropdown__trigger">
    Actions <svg><!-- chevron --></svg>
  </button>
  <ul class="ghost-dropdown__menu">
    <li><button>Edit</button></li>
    <li><button>Duplicate</button></li>
    <li class="ghost-dropdown__divider"><button class="danger">Delete</button></li>
  </ul>
</div>`}
            css={`.ghost-dropdown { position: relative; display: inline-block; }
.ghost-dropdown__menu {
  position: absolute; top: calc(100% + 6px); left: 0;
  min-width: 160px; list-style: none; margin: 0; padding: 6px 0;
  border-radius: 12px; border: 1px solid rgba(255,255,255,0.10);
  background: #0e0e1a; box-shadow: 0 16px 40px rgba(0,0,0,0.5);
  z-index: 50;
}`}
          />
        </ComponentSection>

        {/* Stepper */}
        <ComponentSection id="stepper" title="Quantity stepper" description="Inline +/− number control. Disables at min/max. Compact and full-size variants.">
          <CodePreview preview={<StepperDemo />}
            react={`'use client';
import { useState } from 'react';

export function Stepper({ min = 0, max = 99, defaultValue = 1 }) {
  const [qty, setQty] = useState(defaultValue);
  return (
    <div className="inline-flex items-center overflow-hidden rounded-[10px]
      border border-white/[0.12] bg-white/[0.03]">
      <button
        onClick={() => setQty(q => Math.max(min, q - 1))}
        disabled={qty === min}
        className="flex h-[46px] w-[46px] items-center justify-center
          text-[20px] font-light text-[#9898b0]
          transition-colors hover:bg-white/[0.04] hover:text-fg
          disabled:text-[#404058] disabled:cursor-not-allowed"
      >−</button>
      <span className="w-10 text-center font-mono text-[15px]
        font-semibold tabular-nums text-[#d0d0e0]">
        {qty}
      </span>
      <button
        onClick={() => setQty(q => Math.min(max, q + 1))}
        disabled={qty === max}
        className="flex h-[46px] w-[46px] items-center justify-center
          text-[20px] font-light text-[#9898b0]
          transition-colors hover:bg-white/[0.04] hover:text-fg
          disabled:text-[#404058] disabled:cursor-not-allowed"
      >+</button>
    </div>
  );
}`}
            html={`<div class="ghost-stepper">
  <button class="ghost-stepper__btn" id="minus" onclick="step(-1)">−</button>
  <span class="ghost-stepper__value" id="qty">1</span>
  <button class="ghost-stepper__btn" id="plus"  onclick="step(+1)">+</button>
</div>`}
            css={`.ghost-stepper { display: inline-flex; align-items: center; overflow: hidden; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); }
.ghost-stepper__btn { width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #9898b0; background: none; border: none; cursor: pointer; transition: all 150ms; }
.ghost-stepper__btn:hover { background: rgba(255,255,255,0.04); color: #ededf0; }
.ghost-stepper__value { width: 40px; text-align: center; font-family: monospace; font-size: 15px; font-weight: 600; color: #d0d0e0; }`}
          />
        </ComponentSection>

        {/* Reaction */}
        <ComponentSection id="reaction" title="Reaction" description="Like, star, bookmark and thumbs toggles — each with distinct active color. Counts animate on change.">
          <CodePreview preview={<ReactionDemo />}
            react={`'use client';
import { useState } from 'react';

export function LikeButton({ initialCount = 123 }) {
  const [liked, setLiked] = useState(false);
  return (
    <button
      onClick={() => setLiked(l => !l)}
      aria-pressed={liked}
      className={\`inline-flex items-center gap-2 rounded-[10px] border
        px-4 py-[11px] text-[14px] font-medium transition-all duration-200
        \${liked
          ? 'border-red-400/[0.35] bg-red-400/[0.10] text-red-400'
          : 'border-white/[0.12] bg-white/[0.03] text-[#787890] hover:border-red-400/[0.25] hover:text-red-400'
        }\`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="1.8"
        style={{ transform: liked ? 'scale(1.2)' : 'scale(1)', transition: 'transform 200ms' }}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      {liked ? initialCount + 1 : initialCount}
    </button>
  );
}`}
            html={`<button class="ghost-reaction-btn" aria-pressed="false">
  <svg><!-- heart --></svg>
  <span class="ghost-reaction-count">123</span>
</button>`}
            css={`.ghost-reaction-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); color: #787890; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 200ms; }
.ghost-reaction-btn[aria-pressed="true"] { border-color: rgba(248,113,113,0.35); background: rgba(248,113,113,0.10); color: #f87171; }`}
          />
        </ComponentSection>

        {/* Play/Pause */}
        <ComponentSection id="playpause" title="Play / Pause" description="Media control button that swaps icon on state change. Includes a full player control bar variant.">
          <CodePreview preview={<PlayPauseDemo />}
            react={`'use client';
import { useState } from 'react';

export function PlayPauseButton({ size = 48 }) {
  const [playing, setPlaying] = useState(false);
  return (
    <button
      onClick={() => setPlaying(p => !p)}
      aria-label={playing ? 'Pause' : 'Play'}
      className={\`inline-flex items-center justify-center rounded-full
        border transition-all duration-200
        \${playing
          ? 'border-accent/[0.40] bg-accent/[0.14] text-accent'
          : 'border-white/[0.12] bg-white/[0.04] text-[#9898b0] hover:border-white/[0.22] hover:text-fg'
        }\`}
      style={{ width: size, height: size }}
    >
      {playing
        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
        : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>}
    </button>
  );
}`}
            html={`<button class="ghost-play-btn" aria-label="Play">
  <svg class="icon-play"><!-- play --></svg>
  <svg class="icon-pause hidden"><!-- pause --></svg>
</button>`}
            css={`.ghost-play-btn {
  width: 48px; height: 48px; border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04);
  color: #9898b0; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 200ms;
}
.ghost-play-btn.playing { border-color: rgba(196,181,253,0.40); background: rgba(196,181,253,0.14); color: #c4b5fd; }`}
          />
        </ComponentSection>

        {/* Countdown */}
        <ComponentSection id="countdown" title="Countdown" description="Disabled until a timer expires — common for OTP resend, rate-limited actions, and undo windows.">
          <CodePreview preview={<CountdownDemo />}
            react={`'use client';
import { useState } from 'react';

export function CountdownButton({ delay = 30, children }) {
  const [sec, setSec] = useState(null);

  function start() {
    if (sec !== null) return;
    setSec(delay);
    const iv = setInterval(() => {
      setSec(s => {
        if (s <= 1) { clearInterval(iv); return null; }
        return s - 1;
      });
    }, 1000);
  }

  return (
    <button onClick={start} disabled={sec !== null}
      className={\`inline-flex items-center gap-2 rounded-[10px] border
        px-4 py-[11px] text-[14px] font-medium transition-all duration-200
        \${sec !== null
          ? 'border-amber-400/[0.30] bg-amber-400/[0.08] text-amber-400 cursor-not-allowed'
          : 'border-white/[0.12] bg-white/[0.03] text-[#9898b0] hover:border-white/[0.20] hover:text-fg'
        }\`}
    >
      {sec !== null ? \`Resend in \${sec}s\` : children}
    </button>
  );
}`}
            html={`<button id="resend-btn" class="ghost-btn">Resend code</button>`}
            css={`.ghost-btn.counting {
  border-color: rgba(251,191,36,0.30) !important;
  background: rgba(251,191,36,0.08) !important;
  color: #fbbf24 !important; cursor: not-allowed;
}`}
          />
        </ComponentSection>

        {/* Long press */}
        <ComponentSection id="longpress" title="Long press" description="Hold to execute a dangerous action. A progress bar fills during the hold — release early to cancel.">
          <CodePreview preview={<LongPressDemo />}
            react={`'use client';
import { useState, useRef } from 'react';

export function LongPressButton({ duration = 1500, onConfirm, children }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const interval = useRef(null);
  const start = useRef(0);

  function onDown() {
    setDone(false);
    start.current = Date.now();
    interval.current = setInterval(() => {
      const p = Math.min(((Date.now() - start.current) / duration) * 100, 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval.current);
        setDone(true);
        onConfirm?.();
        setTimeout(() => { setProgress(0); setDone(false); }, 1500);
      }
    }, 30);
  }

  function onUp() {
    clearInterval(interval.current);
    if (!done) setProgress(0);
  }

  return (
    <button
      onMouseDown={onDown} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchEnd={onUp}
      className="relative inline-flex items-center gap-2 overflow-hidden
        rounded-[10px] border px-4 py-[11px] text-[14px] font-medium select-none"
    >
      <span className="absolute bottom-0 left-0 h-[2.5px] rounded-full bg-accent"
        style={{ width: \`\${progress}%\` }} />
      {done ? 'Done!' : progress > 0 ? \`\${Math.round(progress)}%\` : children}
    </button>
  );
}`}
            html={`<button class="ghost-longpress-btn">Hold to delete</button>`}
            css={`.ghost-longpress-btn { position: relative; overflow: hidden; }
.ghost-longpress-bar {
  position: absolute; bottom: 0; left: 0; height: 2.5px;
  width: 0%; border-radius: 9999px; background: #c4b5fd;
}`}
          />
        </ComponentSection>

        {/* File upload */}
        <ComponentSection id="fileupload" title="File upload" description="Styled file input trigger. Supports drag-and-drop on the dashed variant. Shows filename after selection.">
          <CodePreview preview={<FileUploadDemo />}
            react={`'use client';
import { useState, useRef } from 'react';

export function FileUploadButton({ multiple, children }) {
  const ref = useRef(null);
  const [file, setFile] = useState(null);

  return (
    <>
      <input ref={ref} type="file" multiple={multiple} className="hidden"
        onChange={e => setFile(multiple
          ? \`\${e.target.files.length} files selected\`
          : e.target.files[0]?.name)} />
      <button
        onClick={() => ref.current?.click()}
        className={\`inline-flex items-center gap-2 rounded-[10px] border
          px-4 py-[11px] text-[14px] font-medium transition-all duration-200
          \${file
            ? 'border-emerald-400/[0.30] bg-emerald-400/[0.07] text-emerald-400'
            : 'border-white/[0.12] bg-white/[0.03] text-[#9898b0] hover:border-white/[0.20] hover:text-fg'
          }\`}
      >
        <svg><!-- upload icon --></svg>
        {file ?? children}
      </button>
    </>
  );
}`}
            html={`<label class="ghost-upload-btn">
  <input type="file" class="hidden">
  <svg><!-- upload --></svg>
  Choose file
</label>`}
            css={`.ghost-upload-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 16px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.03);
  color: #9898b0; font-size: 14px; font-weight: 500;
  cursor: pointer; transition: all 200ms;
}
.ghost-upload-btn:hover { border-color: rgba(255,255,255,0.20); color: #ededf0; }
.ghost-upload-btn input { display: none; }`}
          />
        </ComponentSection>

        {/* Add to cart */}
        <ComponentSection id="addtocart" title="Add to cart" description="Toggles into a stepper after the first click. Cart count animates on each addition.">
          <CodePreview preview={<AddToCartDemo />}
            react={`'use client';
import { useState } from 'react';

export function AddToCartButton({ onAdd }) {
  const [count, setCount] = useState(0);

  function add() {
    setCount(c => c + 1);
    onAdd?.(count + 1);
  }

  return (
    <button onClick={add}
      className={\`inline-flex items-center gap-2.5 rounded-[10px] border
        px-4 py-[11px] text-[14px] font-semibold
        transition-all duration-200
        \${count > 0
          ? 'border-emerald-400/[0.35] bg-emerald-400/[0.10] text-emerald-400 hover:bg-emerald-400/[0.16]'
          : 'border-transparent bg-[#ededf0] text-[#0a0a10] hover:bg-white'
        }\`}
    >
      <svg><!-- cart icon --></svg>
      {count > 0 ? \`\${count} in cart\` : 'Add to cart'}
      {count > 0 && (
        <span className="inline-flex h-5 w-5 items-center justify-center
          rounded-full bg-black/10 font-mono text-[11px] font-bold">
          {count}
        </span>
      )}
    </button>
  );
}`}
            html={`<button class="ghost-btn ghost-add-to-cart" data-count="0">
  <svg><!-- cart --></svg>
  Add to cart
</button>`}
            css={`.ghost-add-to-cart.added {
  border-color: rgba(52,211,153,0.35) !important;
  background: rgba(52,211,153,0.10) !important;
  color: #34d399 !important;
}
@keyframes cart-bump { 0%,100%{transform:scale(1)} 40%{transform:scale(1.35)} }`}
          />
        </ComponentSection>

        {/* Follow */}
        <ComponentSection id="follow" title="Follow / Subscribe" description="Follow toggles to Following on click, reveals Unfollow on hover. Subscribe uses a full-swap pattern.">
          <CodePreview preview={<FollowDemo />}
            react={`'use client';
import { useState } from 'react';

export function FollowButton() {
  const [following, setFollowing] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <button
      onClick={() => setFollowing(f => !f)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={\`inline-flex items-center gap-2 rounded-full border
        px-5 py-[9px] text-[13.5px] font-medium
        transition-all duration-200
        \${following
          ? hover
            ? 'border-red-400/[0.30] bg-red-400/[0.08] text-red-400'
            : 'border-accent/[0.30] bg-accent/[0.10] text-accent'
          : 'border-white/[0.12] bg-white/[0.03] text-[#9898b0] hover:border-white/[0.22] hover:text-fg'
        }\`}
    >
      {following && !hover && <svg><!-- check --></svg>}
      {following ? (hover ? 'Unfollow' : 'Following') : '+ Follow'}
    </button>
  );
}`}
            html={`<button class="ghost-follow-btn" aria-pressed="false">+ Follow</button>`}
            css={`.ghost-follow-btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 20px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); color: #9898b0; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all 200ms; }
.ghost-follow-btn[aria-pressed="true"] { border-color: rgba(196,181,253,0.30); background: rgba(196,181,253,0.10); color: #c4b5fd; }
.ghost-follow-btn[aria-pressed="true"]:hover { border-color: rgba(248,113,113,0.30); background: rgba(248,113,113,0.08); color: #f87171; }`}
          />
        </ComponentSection>

        {/* Swipe to confirm */}
        <ComponentSection id="swipe" title="Swipe to confirm" description="Drag the handle right to confirm a high-stakes action — common for payments, deletes, and irreversible flows.">
          <CodePreview preview={<SwipeDemo />}
            react={`'use client';
import { useState, useRef } from 'react';

export function SwipeToConfirm({ label, onConfirm }) {
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const trackRef = useRef(null);
  const dragging = useRef(false);
  const startX = useRef(0);

  function onDown(e) {
    dragging.current = true;
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onMove(e) {
    if (!dragging.current || !trackRef.current) return;
    const w = trackRef.current.getBoundingClientRect().width;
    const max = w - 48 - 8; // thumbW + padding
    setProgress(Math.max(0, Math.min((e.clientX - startX.current) / max, 1)));
  }

  function onUp() {
    dragging.current = false;
    if (progress >= 0.88) {
      setProgress(1); setConfirmed(true);
      onConfirm?.();
      setTimeout(() => { setProgress(0); setConfirmed(false); }, 2500);
    } else {
      setProgress(0);
    }
  }

  return (
    <div ref={trackRef}
      className="relative flex h-[52px] items-center overflow-hidden
        rounded-full border border-white/[0.12] bg-white/[0.04] px-1">
      {/* fill */}
      <div className="absolute inset-0 rounded-full transition-all duration-200"
        style={{ background: \`linear-gradient(90deg,rgba(196,181,253,0.18) \${progress*100}%,transparent \${progress*100}%)\` }} />
      {/* thumb */}
      <div className="relative z-10 flex h-10 w-10 cursor-grab items-center
        justify-center rounded-full bg-[#ededf0]"
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
        style={{ transform: \`translateX(\${progress*(trackRef.current?.offsetWidth-56||0)}px)\` }}>
        {confirmed ? '✓' : '→'}
      </div>
      {/* label */}
      <span className="absolute inset-0 flex items-center justify-center text-[13px] text-[#606078]"
        style={{ opacity: progress > 0.4 ? 0 : 1, transition: 'opacity 200ms' }}>
        {confirmed ? 'Confirmed!' : label}
      </span>
    </div>
  );
}`}
            html={`<div class="ghost-swipe-track">
  <div class="ghost-swipe-fill" id="swipeFill"></div>
  <div class="ghost-swipe-thumb" id="swipeThumb">→</div>
  <span class="ghost-swipe-label">Slide to confirm</span>
</div>`}
            css={`.ghost-swipe-track { position: relative; height: 52px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.04); overflow: hidden; padding: 0 4px; display: flex; align-items: center; }
.ghost-swipe-thumb { position: relative; z-index: 2; width: 40px; height: 40px; border-radius: 9999px; background: #ededf0; display: flex; align-items: center; justify-content: center; cursor: grab; }
.ghost-swipe-label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #606078; pointer-events: none; }`}
          />
        </ComponentSection>

          </div>

          {/* Props */}
          <div id="props" className="mt-16 scroll-mt-24">
            <div className="mb-5 h-px bg-[linear-gradient(90deg,rgba(255,255,255,0.06),transparent_80%)]" aria-hidden />
            <h2 className="mb-5 text-[17px] font-medium tracking-[-0.018em] text-[#c8c8d8]">Props</h2>
            <div className="overflow-hidden rounded-[14px] border border-white/[0.06] bg-[#08080f]">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-white/[0.015]">
                    {['Prop', 'Type', 'Default', 'Description'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#22223a]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {[
                    ['variant', '"primary" | "ghost" | "destructive" | "accent" | "soft" | "link"', '"ghost"', 'Visual style of the button'],
                    ['size', '"sm" | "md" | "lg"', '"md"', 'Padding and font size token'],
                    ['loading', 'boolean', 'false', 'Shows spinner, disables interaction'],
                    ['disabled', 'boolean', 'false', 'Native disabled state'],
                    ['asChild', 'boolean', 'false', 'Render as child element (e.g. Link)'],
                    ['className', 'string', '—', 'Additional Tailwind classes'],
                  ].map(([prop, type, def, desc]) => (
                    <tr key={prop} className="transition-colors hover:bg-white/[0.012]">
                      <td className="px-4 py-3 font-mono text-[12px] text-[#9a8fc4]">{prop}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-[#3a3a56]">{type}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-[#2a2a40]">{def}</td>
                      <td className="px-4 py-3 text-[#3a3a56]">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>{/* end main content column */}

        <TableOfContents items={TOC} />

      </div>{/* end two-column row */}

    </div>
  );
}

function ComponentSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <div className="mb-4 h-px bg-white/[0.07]" aria-hidden />
      <div className="mb-5">
        <h2 className="mb-2 text-[17px] font-medium tracking-[-0.018em] text-[#d0d0e0]">{title}</h2>
        <p className="text-[13.5px] leading-[1.65] text-[#787890]">{description}</p>
      </div>
      {children}
    </div>
  );
}
