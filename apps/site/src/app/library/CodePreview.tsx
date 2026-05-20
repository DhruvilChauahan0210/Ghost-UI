'use client';

import { useState } from 'react';

type Tab = 'preview' | 'react' | 'html' | 'css';

interface Props {
  preview: React.ReactNode;
  react: string;
  html: string;
  css?: string;
  defaultTab?: Tab;
  minHeight?: number;
}

const LANG: Partial<Record<Tab, string>> = { react: 'TSX', html: 'HTML', css: 'CSS' };

function hl(code: string): string {
  const e = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return e
    .replace(/(\/\/[^\n]*)/g, '<em style="color:#4a4a68;font-style:italic">$1</em>')
    .replace(/\/\*([\s\S]*?)\*\//g, '<em style="color:#4a4a68;font-style:italic">/*$1*/</em>')
    .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span style="color:#86d9b0">$1</span>')
    .replace(/\b(import|export|from|default|const|let|var|function|return|type|interface|extends|implements|class|new|this|if|else|for|while|of|in|async|await|true|false|null|undefined|void|readonly)\b/g, '<span style="color:#c4b5fd">$1</span>')
    .replace(/(&lt;\/?[A-Z][A-Za-z.]*)/g, '<span style="color:#e879f9">$1</span>')
    .replace(/(&lt;\/?)([a-z][a-z0-9-]*)(?=[\s&]|&gt;|\/&gt;)/g, '$1<span style="color:#e879f9">$2</span>')
    .replace(/(?<=\s)([a-zA-Z][a-zA-Z0-9-]*)(?==(?!&gt;))/g, '<span style="color:#fbbf24">$1</span>')
    .replace(/(?<![a-zA-Z"'`\-_#])\b(\d+(?:\.\d+)?(px|%|rem|em|s|ms)?)\b(?![a-zA-Z"'`])/g, '<span style="color:#f97316">$1</span>');
}

export function CodePreview({ preview, react, html, css, defaultTab = 'preview', minHeight = 200 }: Props) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [copied, setCopied] = useState(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'preview', label: 'Preview' },
    { id: 'react', label: 'React' },
    { id: 'html', label: 'HTML' },
    ...(css ? [{ id: 'css' as Tab, label: 'CSS' }] : []),
  ];

  function getCode(): string {
    if (tab === 'react') return react;
    if (tab === 'html') return html;
    if (tab === 'css') return css ?? '';
    return '';
  }

  function copy() {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const codeLines = getCode().split('\n');

  return (
    <div className="overflow-hidden rounded-[14px] border border-white/[0.10] bg-[#0c0c14] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">

      {/* ── Window chrome ─────────────────────────────────────────── */}
      <div className="flex h-[42px] items-center border-b border-white/[0.08] bg-[#0e0e18]">
        {/* Traffic lights */}
        <div className="flex shrink-0 items-center gap-[6px] px-4">
          <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57] shadow-[inset_0_-1px_0_rgba(0,0,0,0.3)]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e] shadow-[inset_0_-1px_0_rgba(0,0,0,0.3)]" />
          <span className="h-[11px] w-[11px] rounded-full bg-[#28c941] shadow-[inset_0_-1px_0_rgba(0,0,0,0.3)]" />
        </div>

        <div className="mx-3 h-4 w-px shrink-0 bg-white/[0.08]" />

        {/* Tabs */}
        <div className="flex flex-1 items-center gap-0.5">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex h-[42px] items-center px-3.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.08em] transition-colors duration-150 ${
                tab === t.id ? 'text-[#e8e8f4]' : 'text-[#666680] hover:text-[#a8a8bc]'
              }`}
            >
              {tab === t.id && (
                <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-accent" />
              )}
              {t.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-2.5 px-4">
          {tab !== 'preview' && LANG[tab] && (
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5a5a74]">
              {LANG[tab]}
            </span>
          )}
          {tab !== 'preview' && (
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.10] bg-white/[0.04] px-2.5 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-[#7878920] transition-all duration-150 hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-[#b8b8cc]"
            >
              {copied ? (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>
                  Done
                </>
              ) : (
                <>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      {tab === 'preview' ? (
        <div
          className="flex flex-wrap items-center justify-center gap-4 p-10"
          style={{
            minHeight,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        >
          {preview}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex min-w-0">
            {/* Line numbers */}
            <div
              aria-hidden
              className="select-none shrink-0 border-r border-white/[0.06] bg-[#0a0a12] px-4 py-5 text-right font-mono text-[12px] leading-[1.75] text-[#3a3a54]"
            >
              {codeLines.map((_, i) => (
                <div key={i}>{String(i + 1).padStart(3)}</div>
              ))}
            </div>
            {/* Code */}
            <div className="flex-1 overflow-x-auto bg-[#0c0c14] px-6 py-5">
              <pre className="m-0 font-mono text-[12.5px] leading-[1.75] text-[#c4c4d8]">
                <code dangerouslySetInnerHTML={{ __html: hl(getCode()) }} />
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
