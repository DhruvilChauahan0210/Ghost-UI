'use client';

import { useState } from 'react';

export function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-hidden rounded-[12px] border border-white/[0.10] bg-[#0c0c14] shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
      {/* Terminal header */}
      <div className="flex h-9 items-center gap-[6px] border-b border-white/[0.07] bg-[#0e0e18] px-3.5">
        <span className="h-[10px] w-[10px] rounded-full bg-[#ff5f57]" />
        <span className="h-[10px] w-[10px] rounded-full bg-[#febc2e]" />
        <span className="h-[10px] w-[10px] rounded-full bg-[#28c941]" />
        <span className="ml-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#525268]">Terminal</span>
      </div>

      {/* Command row */}
      <button
        onClick={copy}
        className="group flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-white/[0.025]"
      >
        <span className="shrink-0 select-none font-mono text-[13px] text-[#666680]">$</span>
        <code className="flex-1 font-mono text-[13px] tracking-[-0.005em] text-[#c4b5fd]">{command}</code>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em] transition-all duration-150 ${
            copied
              ? 'border-emerald-400/[0.35] bg-emerald-400/[0.10] text-emerald-400'
              : 'border-white/[0.10] bg-white/[0.04] text-[#787892] group-hover:border-white/[0.18] group-hover:text-[#b0b0c4]'
          }`}
        >
          {copied ? (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>
              Copied
            </>
          ) : (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              Copy
            </>
          )}
        </span>
      </button>
    </div>
  );
}
