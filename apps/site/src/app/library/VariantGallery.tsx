'use client';

import { useState } from 'react';

export interface DesignVariant {
  name: string;
  description: string;
  preview: React.ReactNode;
  code: string;
  html?: string;
}

export function VariantGallery({ variants }: { variants: DesignVariant[] }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  function copy(name: string, code: string) {
    navigator.clipboard.writeText(code);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3">
      {variants.map(v => {
        const isExpanded = expanded === v.name;
        const isCopied = copied === v.name;

        return (
          <div
            key={v.name}
            className={`group relative flex flex-col overflow-hidden rounded-[14px] border transition-all duration-200 ${
              isExpanded
                ? 'border-accent/[0.35] bg-[#0e0e1a]'
                : 'border-white/[0.08] bg-[#0c0c14] hover:border-white/[0.14] hover:bg-[#0f0f1a]'
            }`}
          >
            {/* Preview */}
            <div
              className="flex min-h-[100px] items-center justify-center p-5"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            >
              {v.preview}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.07] px-3.5 py-2.5">
              <div className="mb-0.5 text-[12.5px] font-medium tracking-[-0.01em] text-[#c0c0d0]">
                {v.name}
              </div>
              <div className="mb-3 text-[11px] leading-[1.4] text-[#505068]">
                {v.description}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copy(v.name, v.code)}
                  className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-[8px] border py-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.06em] transition-all duration-150 ${
                    isCopied
                      ? 'border-emerald-400/[0.35] bg-emerald-400/[0.10] text-emerald-400'
                      : 'border-white/[0.08] bg-white/[0.03] text-[#606078] hover:border-white/[0.16] hover:text-[#a0a0b8]'
                  }`}
                >
                  {isCopied ? (
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
                </button>

                <button
                  onClick={() => setExpanded(isExpanded ? null : v.name)}
                  aria-label={isExpanded ? 'Collapse code' : 'Expand code'}
                  className={`inline-flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border transition-all duration-150 ${
                    isExpanded
                      ? 'border-accent/[0.30] bg-accent/[0.10] text-accent'
                      : 'border-white/[0.08] bg-white/[0.03] text-[#505068] hover:border-white/[0.16] hover:text-[#9090a8]'
                  }`}
                >
                  <svg
                    width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    aria-hidden
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Expanded code */}
            {isExpanded && (
              <div className="border-t border-accent/[0.14] bg-[#08080f]">
                <div className="max-h-[240px] overflow-auto p-4 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/[0.08]">
                  <pre className="m-0 font-mono text-[11.5px] leading-[1.7] text-[#b8b8d0]">
                    <code>{v.code}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
