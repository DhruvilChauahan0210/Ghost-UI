import type { Metadata } from 'next';
import Link from 'next/link';
import { ComponentGrid } from '../ComponentGrid';
import { PRIMARY_DESIGNS } from '../variants/primary';

export const metadata: Metadata = {
  title: 'Primary Button — All Designs · Ghost UI',
  description: `${PRIMARY_DESIGNS.length} visual interpretations of a primary button. Copy any design directly into your project.`,
};

export default function PrimaryButtonPage() {
  return (
    <div className="min-h-screen bg-[#07070a]">

      {/* Header bar */}
      <div className="sticky top-0 z-40 border-b border-white/[0.07] bg-[rgba(7,7,10,0.85)] backdrop-blur-[20px]">
        <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-8 py-4">
          <Link
            href="/library/components/button"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#525268] transition-colors hover:text-[#9090a8]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
            Button
          </Link>
          <span className="text-[#2a2a3e]">/</span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9090a8]">Primary</span>
          <span className="ml-auto inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1 font-mono text-[10.5px] text-[#525268]">
            {PRIMARY_DESIGNS.length} designs
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-8 py-12">

        {/* Hero */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] border border-accent/[0.25] bg-accent/[0.10] font-mono text-[11px] font-bold text-accent">P</span>
            <h1 className="text-[clamp(28px,4vw,44px)] font-medium tracking-[-0.04em] text-[#e8e8f0]">
              Primary button
            </h1>
          </div>
          <p className="max-w-[56ch] text-[15px] leading-[1.65] text-[#787890]">
            {PRIMARY_DESIGNS.length} distinct visual interpretations of a primary call-to-action.
            Each is production-ready — click any card to open the full preview and copy React, HTML, or AI prompt code.
          </p>
        </div>

        {/* Gallery */}
        <ComponentGrid designs={PRIMARY_DESIGNS} categoryName="Primary" />

        {/* Footer nav */}
        <div className="mt-16 flex items-center justify-between border-t border-white/[0.07] pt-8">
          <Link
            href="/library/components/button"
            className="inline-flex items-center gap-2 text-[13px] text-[#525268] transition-colors hover:text-[#9090a8]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 18-6-6 6-6" /></svg>
            Back to Button
          </Link>
          <span className="font-mono text-[11px] text-[#363650]">ghost-ui · button · primary</span>
        </div>
      </div>
    </div>
  );
}
