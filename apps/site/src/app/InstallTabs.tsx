'use client';

import { useState } from 'react';
import { CopyButton } from './CopyButton';

type Tab = 'code' | 'npm' | 'pnpm' | 'bun';

const CMDS: Record<Exclude<Tab, 'code'>, string> = {
  npm:  'npm install @ghost-ui/react @ghost-ui/core',
  pnpm: 'pnpm add @ghost-ui/react @ghost-ui/core',
  bun:  'bun add @ghost-ui/react @ghost-ui/core',
};

const PKG_ARGS = '@ghost-ui/react @ghost-ui/core';

const TP = "text-white/[0.22] select-none";
const TC = "text-accent";
const TPKG = "text-emerald-300";

const TERM_HTML: Record<Exclude<Tab, 'code'>, string> = {
  npm:  `<span class="${TP}">$</span> <span class="${TC}">npm install</span> <span class="${TPKG}">${PKG_ARGS}</span>`,
  pnpm: `<span class="${TP}">$</span> <span class="${TC}">pnpm add</span> <span class="${TPKG}">${PKG_ARGS}</span>`,
  bun:  `<span class="${TP}">$</span> <span class="${TC}">bun add</span> <span class="${TPKG}">${PKG_ARGS}</span>`,
};

export function InstallTabs({
  snippetHtml,
  snippetPlain,
}: {
  snippetHtml: string;
  snippetPlain: string;
}) {
  const [tab, setTab] = useState<Tab>('code');

  const isCode = tab === 'code';
  const title = isCode ? 'app/page.tsx — Ghost UI' : 'terminal';
  const copyText = isCode ? snippetPlain : CMDS[tab];

  const dotBase = "relative inline-block h-3 w-3 rounded-full shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.25),inset_0_-1px_0_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.30)] [&>svg]:absolute [&>svg]:inset-0 [&>svg]:m-auto [&>svg]:opacity-0 [&>svg]:transition-opacity [&>svg]:duration-[160ms] group-hover:[&>svg]:opacity-100";
  const tabBase = "cursor-pointer rounded-[7px] border border-transparent bg-transparent px-[11px] py-[5px] font-mono text-[12px] text-muted transition-[color,background] duration-150";

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#08080d] shadow-[0_0_0_0.5px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.04),0_30px_80px_-30px_rgba(0,0,0,0.85),0_80px_160px_-40px_rgba(139,92,246,0.32)]">
      <div className="relative flex h-[38px] items-center border-b border-black/55 bg-[linear-gradient(180deg,rgba(60,60,72,0.85)_0%,rgba(36,36,44,0.85)_100%)] px-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
        <div className="group flex items-center gap-2">
          <span className={`${dotBase} bg-[#ff5f57]`}>
            <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="#4d0000" strokeWidth="1.2" strokeLinecap="round">
              <path d="M2 2 L6 6 M6 2 L2 6" />
            </svg>
          </span>
          <span className={`${dotBase} bg-[#febc2e]`}>
            <svg width="7" height="7" viewBox="0 0 8 8" fill="none" stroke="#663800" strokeWidth="1.4" strokeLinecap="round">
              <path d="M1.5 4 L6.5 4" />
            </svg>
          </span>
          <span className={`${dotBase} bg-[#28c941]`}>
            <svg width="8" height="8" viewBox="0 0 10 10" fill="#004d18">
              <path d="M2 2 L7 2 L2 7 Z M3 8 L8 8 L8 3 Z" />
            </svg>
          </span>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-sans text-[12px] font-medium tracking-[-0.005em] text-white/50">{title}</div>
      </div>

      <div className="flex items-center justify-between border-b border-line bg-black/30 px-3.5 py-2.5">
        <div className="inline-flex items-center gap-1.5">
          {(['code', 'npm', 'pnpm', 'bun'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              className={tab === t ? `${tabBase} border-line bg-white/[0.04] text-fg` : `${tabBase} hover:bg-white/[0.04] hover:text-white/60`}
              onClick={() => setTab(t)}
            >
              {t === 'code' ? 'app/page.tsx' : t}
            </button>
          ))}
        </div>
        <CopyButton text={copyText} />
      </div>

      {isCode ? (
        <pre className="m-0 min-h-[267px] overflow-x-auto bg-[#08080d] p-[22px] font-mono text-[13px] leading-[1.7] text-[#d6d6e0]" dangerouslySetInnerHTML={{ __html: snippetHtml }} />
      ) : (
        <pre className="m-0 min-h-[267px] overflow-x-auto bg-[#08080d] px-7 py-[22px] font-mono text-[14px] leading-[1.7] text-[#d6d6e0]" dangerouslySetInnerHTML={{ __html: TERM_HTML[tab] }} />
      )}
    </div>
  );
}
