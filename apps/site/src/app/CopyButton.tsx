'use client';

import { useState } from 'react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="copy-btn relative isolate cursor-pointer overflow-hidden rounded-[7px] border border-line-2 bg-white/[0.03] px-2.5 py-[5px] font-mono text-[11px] text-fg transition-colors duration-200 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(80px_circle_at_var(--bx,50%)_var(--by,50%),rgba(196,181,253,0.22),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-200 before:content-[''] hover:border-line-3 hover:bg-white/[0.06] hover:before:opacity-100"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        } catch {}
      }}
    >
      {copied ? 'copied ✓' : 'copy'}
    </button>
  );
}
