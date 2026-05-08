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

const TERM_HTML: Record<Exclude<Tab, 'code'>, string> = {
  npm:  `<span class="tp">$</span> <span class="tc">npm install</span> <span class="tpkg">${PKG_ARGS}</span>`,
  pnpm: `<span class="tp">$</span> <span class="tc">pnpm add</span> <span class="tpkg">${PKG_ARGS}</span>`,
  bun:  `<span class="tp">$</span> <span class="tc">bun add</span> <span class="tpkg">${PKG_ARGS}</span>`,
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

  return (
    <div className="mac mac-code">
      <div className="mac-titlebar">
        <div className="mac-controls">
          <span className="mac-dot close" />
          <span className="mac-dot min" />
          <span className="mac-dot max" />
        </div>
        <div className="mac-title">{title}</div>
      </div>

      <div className="code-head">
        <div className="code-tabs">
          {(['code', 'npm', 'pnpm', 'bun'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              className={`code-tab${tab === t ? ' active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'code' ? 'app/page.tsx' : t}
            </button>
          ))}
        </div>
        <CopyButton text={copyText} />
      </div>

      {isCode ? (
        <pre className="snippet" dangerouslySetInnerHTML={{ __html: snippetHtml }} />
      ) : (
        <pre className="snippet snippet-term" dangerouslySetInnerHTML={{ __html: TERM_HTML[tab] }} />
      )}
    </div>
  );
}
