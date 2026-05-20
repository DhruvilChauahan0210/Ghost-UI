'use client';

import React, { useState, useEffect, useCallback } from 'react';

export interface ComponentDesign {
  name: string;
  description: string;
  preview: React.ReactNode;
  code: string;
  html?: string;
  css?: string;
  prompt?: string;
}

interface ComponentGridProps {
  designs: ComponentDesign[];
  categoryName: string;
}

type CodeType = 'nextjs' | 'html' | 'prompt';

function BookmarkIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function GhostBrandIcon({ size = 22 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-[6px] text-[11px] font-bold text-white"
      style={{ width: size, height: size, background: 'linear-gradient(135deg,#c4b5fd,#8b5cf6)' }}
    >
      G
    </span>
  );
}


/* ─── Helpers ────────────────────────────────────────────────────────────── */

function hlHtml(raw: string): string {
  const e = raw.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return e
    .replace(/(&lt;\/?[a-zA-Z][a-zA-Z0-9-]*)(?=[\s/&]|&gt;)/g,'<span style="color:#f472b6">$1</span>')
    .replace(/\s([a-zA-Z-]+)(?==)/g,' <span style="color:#fbbf24">$1</span>')
    .replace(/"([^"]*)"/g,'"<span style="color:#86d9b0">$1</span>"');
}

function hlCss(raw: string): string {
  return raw
    .replace(/([.#]?[a-zA-Z][a-zA-Z0-9_:-]*)(?=\s*\{)/g,'<span style="color:#f472b6">$1</span>')
    .replace(/\b([a-z-]+)(?=\s*:)/g,'<span style="color:#38bdf8">$1</span>')
    .replace(/:\s*([^;{\n]+)/g,(m,v)=>`:<span style="color:#86d9b0"> ${v.trim()}</span>`)
    .replace(/\b(\d+(?:\.\d+)?(?:px|%|em|rem|s|ms)?)\b/g,'<span style="color:#fb923c">$1</span>');
}

function hlNext(raw: string): string {
  const e = raw.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return e
    .replace(/(\/\/[^\n]*)/g,'<em style="color:#4a4a68;font-style:italic">$1</em>')
    .replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g,'<span style="color:#86d9b0">$1</span>')
    .replace(/\b(import|export|from|default|const|let|var|function|return|type|interface|extends|class|new|if|else|async|await)\b/g,'<span style="color:#c4b5fd">$1</span>')
    .replace(/(&lt;\/?[A-Z][A-Za-z.]*)/g,'<span style="color:#f0abfc">$1</span>')
    .replace(/(&lt;\/?)([a-z][a-z0-9-]*)(?=[\s&]|&gt;|\/&gt;)/g,'$1<span style="color:#f0abfc">$2</span>')
    .replace(/(?<=\s)([a-zA-Z][a-zA-Z0-9-]*)(?==(?!&gt;))/g,'<span style="color:#fbbf24">$1</span>');
}

interface PanelProps {
  lang: string;
  iconBg: string;
  iconLabel: string;
  code: string;
  highlight: (s: string) => string;
}

function CodePanelBlock({ lang, iconBg, iconLabel, code, highlight }: PanelProps) {
  const [copied, setCopied] = React.useState(false);
  const lines = code.split('\n');

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden border-r border-white/[0.06] last:border-r-0">
      {/* Panel header */}
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/[0.07] bg-[#0d0d18] px-3">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[9px] font-bold text-white"
          style={{ background: iconBg }}
        >
          {iconLabel}
        </span>
        <span className="font-mono text-[12px] font-semibold tracking-[0.04em] text-[#b8b8cc]">{lang}</span>
        <div className="ml-auto">
          <button
            onClick={copy}
            className="flex h-6 items-center gap-1 rounded-[5px] border border-white/[0.06] bg-white/[0.03] px-2 font-mono text-[10px] text-[#525268] transition-all hover:border-white/[0.12] hover:text-[#9898b0]"
          >
            {copied ? (
              <><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>Copied</>
            ) : (
              <><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>
            )}
          </button>
        </div>
      </div>

      {/* Code body */}
      <div className="flex flex-1 overflow-auto bg-[#0a0a12] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/[0.08]">
        {/* Gutter */}
        <div className="select-none shrink-0 border-r border-white/[0.04] bg-[#08080f] px-3 py-4 text-right font-mono text-[11.5px] leading-[1.7] text-[#2a2a40]">
          {lines.map((_, i) => <div key={i}>{String(i + 1).padStart(2)}</div>)}
        </div>
        {/* Code */}
        <pre className="m-0 flex-1 overflow-x-auto p-4 font-mono text-[12px] leading-[1.7] text-[#c0c0d4]">
          <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
        </pre>
      </div>
    </div>
  );
}

/* ─── Modal ───────────────────────────────────────────────────────────────── */

interface ComponentModalProps {
  designs: ComponentDesign[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  categoryName: string;
}

type ViewMode  = 'preview' | 'code' | 'prompt';
type CodeFormat = 'nextjs' | 'html';

function ComponentModal({ designs, activeIndex, onClose, onNavigate, categoryName }: ComponentModalProps) {
  const [viewMode, setViewMode]     = React.useState<ViewMode>('preview');
  const [codeFormat, setCodeFormat] = React.useState<CodeFormat>('nextjs');
  const [darkPreview, setDarkPreview] = React.useState(false);
  const [copied, setCopied]           = React.useState(false);
  const [refreshKey, setRefreshKey]   = React.useState(0);

  const design = designs[activeIndex]!;

  function copyAll() {
    let content = '';
    if (viewMode === 'prompt') {
      content = design.prompt ?? '';
    } else if (codeFormat === 'html') {
      const parts: string[] = [];
      if (design.html) parts.push(design.html);
      if (design.css)  parts.push(design.css);
      content = parts.join('\n\n');
    } else {
      content = design.code;
    }
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft'  && activeIndex > 0)                      onNavigate(activeIndex - 1);
      if (e.key === 'ArrowRight' && activeIndex < designs.length - 1)     onNavigate(activeIndex + 1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, designs.length, onClose, onNavigate]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#07070a]">

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <header className="flex h-11 shrink-0 items-center gap-2.5 border-b border-white/[0.08] bg-[#0f0f14] px-4">

        {/* Left: brand + name */}
        <GhostBrandIcon size={20} />
        <span className="text-[13px] font-medium text-[#e8e8f0]">{design.name}</span>
        <span className="text-[#2a2a3e]">·</span>
        <span className="text-[11.5px] text-[#424260]">{categoryName}</span>

        {/* Center: Preview / Code / Prompt toggle */}
        <div className="mx-auto flex items-center gap-px rounded-[10px] border border-white/[0.08] bg-white/[0.02] p-[3px]">
          {([
            { id: 'preview', label: 'Preview' },
            { id: 'code',    label: 'Code'    },
            { id: 'prompt',  label: 'Prompt'  },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              className={`rounded-[7px] px-3.5 py-1 text-[12px] font-medium transition-all duration-150 ${
                viewMode === tab.id
                  ? 'bg-white/[0.10] text-[#e8e8f0] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                  : 'text-[#484862] hover:text-[#8888a0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <button
            onClick={() => setDarkPreview(v => !v)}
            disabled={viewMode !== 'preview'}
            className={`flex h-7 w-7 items-center justify-center rounded-[7px] transition-colors ${viewMode === 'preview' ? 'text-[#787890] hover:bg-white/[0.06] hover:text-[#c4c4d4]' : 'cursor-default text-[#252538]'}`}
            title="Toggle preview theme"
          >
            {darkPreview ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Refresh */}
          <button onClick={() => setRefreshKey(k => k + 1)} className="flex h-7 w-7 items-center justify-center rounded-[7px] text-[#787890] transition-colors hover:bg-white/[0.06] hover:text-[#c4c4d4]">
            <RefreshIcon />
          </button>

          {/* Copy all */}
          <button
            onClick={copyAll}
            className="flex h-7 items-center gap-1.5 rounded-[8px] bg-[#2563eb] px-3 text-[12.5px] font-medium text-white transition-colors hover:bg-[#1d4ed8]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
            {copied ? 'Copied!' : 'Copy code'}
          </button>

          {/* Close */}
          <button onClick={onClose} className="ml-1 flex h-7 w-7 items-center justify-center rounded-[7px] text-[#787890] transition-colors hover:bg-white/[0.06] hover:text-[#c4c4d4]">
            <XIcon />
          </button>
        </div>
      </header>

      {/* ── Code format sub-bar (only in Code mode) ─────────────────────── */}
      {viewMode === 'code' && (
        <div className="flex h-9 shrink-0 items-center gap-4 border-b border-white/[0.06] bg-[#0b0b14] px-4">
          <span className="font-mono text-[9.5px] font-bold uppercase tracking-[0.20em] text-[#2e2e46]">Format</span>
          <div className="flex items-center gap-px rounded-[8px] border border-white/[0.07] bg-white/[0.015] p-[3px]">
            {([
              { id: 'nextjs', label: 'Next.js'      },
              { id: 'html',   label: 'HTML + CSS + JS' },
            ] as const).map(f => (
              <button
                key={f.id}
                onClick={() => setCodeFormat(f.id)}
                className={`rounded-[5px] px-3 py-[3px] font-mono text-[10.5px] font-medium uppercase tracking-[0.06em] transition-all duration-150 ${
                  codeFormat === f.id
                    ? 'bg-white/[0.10] text-[#d0d0e4]'
                    : 'text-[#363652] hover:text-[#686882]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Body ─────────────────────────────────────────────────────────── */}

      {/* Preview (full height) */}
      {viewMode === 'preview' && (
        <div
          key={refreshKey}
          className={`relative flex flex-1 items-center justify-center overflow-hidden transition-colors duration-300 ${darkPreview ? 'btn-theme-dark' : 'btn-theme-light'}`}
          style={{ background: darkPreview ? '#000' : '#fff' }}
        >
          {design.preview}
          {activeIndex > 0 && (
            <button onClick={() => onNavigate(activeIndex - 1)} className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.10] bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white">
              <ChevronLeftIcon />
            </button>
          )}
          {activeIndex < designs.length - 1 && (
            <button onClick={() => onNavigate(activeIndex + 1)} className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.10] bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:bg-black/60 hover:text-white">
              <ChevronRightIcon />
            </button>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/[0.10] bg-black/40 px-3 py-1 font-mono text-[11px] text-white/50 backdrop-blur-sm">
            {activeIndex + 1} / {designs.length}
          </div>
        </div>
      )}

      {/* Code (split: panels on top, preview below) */}
      {viewMode === 'code' && (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* ── Code panels (top ~45%) ── */}
          <div className="flex" style={{ height: '44%' }}>
            {codeFormat === 'html' ? (
              <>
                <CodePanelBlock
                  lang="HTML"
                  iconBg="#ef4444"
                  iconLabel="/"
                  code={design.html ?? '<!-- No HTML available -->'}
                  highlight={hlHtml}
                />
                <CodePanelBlock
                  lang="CSS"
                  iconBg="#3b82f6"
                  iconLabel="."
                  code={design.css ?? '/* No CSS available */'}
                  highlight={hlCss}
                />
                <CodePanelBlock
                  lang="JS"
                  iconBg="#f59e0b"
                  iconLabel="JS"
                  code={'// No JavaScript needed for this component.'}
                  highlight={s => s}
                />
              </>
            ) : (
              <CodePanelBlock
                lang="Next.js / React"
                iconBg="#0070f3"
                iconLabel="▲"
                code={design.code}
                highlight={hlNext}
              />
            )}
          </div>

          {/* ── Divider ── */}
          <div className="relative flex h-[3px] shrink-0 items-center bg-white/[0.05]">
            <div className="absolute left-1/2 -translate-x-1/2 flex h-5 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-[#0f0f18] text-[#2e2e46]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden><path d="M8 9l4-4 4 4M8 15l4 4 4-4"/></svg>
            </div>
          </div>

          {/* ── Live preview (bottom ~55%) ── */}
          <div
            key={refreshKey}
            className={`relative flex flex-1 items-center justify-center overflow-hidden transition-colors duration-300 ${darkPreview ? 'btn-theme-dark' : 'btn-theme-light'}`}
            style={{ background: darkPreview ? '#000' : '#fff' }}
          >
            {design.preview}
            <div className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#484860]">
              Live Preview
            </div>
          </div>
        </div>
      )}

      {/* Prompt */}
      {viewMode === 'prompt' && (
        <div className="flex flex-1 flex-col overflow-hidden bg-[#08080f]">
          <div className="max-w-[800px] flex-1 overflow-auto p-10">
            <div className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.20em] text-[#3a3a52]">AI Prompt</div>
            <p className="text-[15px] leading-[1.85] text-[#9898b0]">
              {design.prompt ?? 'No prompt available for this design.'}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}



function DesignCard({
  design,
  onClick,
}: {
  design: ComponentDesign;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full cursor-pointer rounded-[20px] bg-[#111113] text-left transition-transform duration-200 hover:scale-[1.015]"
    >
      {/* Preview area */}
      <div className="btn-theme-light m-3 flex min-h-[200px] items-center justify-center rounded-[14px] bg-white p-8">
        {design.preview}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 pb-3 pt-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#c4b5fd,#8b5cf6)' }}
          >
            G
          </span>
          <span className="text-[13px] font-medium text-white">{design.name}</span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); }}
          className="flex h-7 w-7 items-center justify-center rounded-[7px] text-[#787890] transition-colors hover:bg-white/[0.06] hover:text-[#c4c4d4]"
        >
          <BookmarkIcon size={13} />
        </button>
      </div>
    </button>
  );
}

export function ComponentGrid({ designs, categoryName }: ComponentGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const closeModal = useCallback(() => setActiveIndex(null), []);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {designs.map((design, i) => (
          <DesignCard key={design.name} design={design} onClick={() => setActiveIndex(i)} />
        ))}
      </div>

      {activeIndex !== null && (
        <ComponentModal
          designs={designs}
          activeIndex={activeIndex}
          onClose={closeModal}
          onNavigate={setActiveIndex}
          categoryName={categoryName}
        />
      )}
    </>
  );
}
