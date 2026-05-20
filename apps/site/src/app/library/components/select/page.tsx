'use client';

import { useState } from 'react';
import { CodePreview } from '../../CodePreview';
import { InstallCommand } from '../../InstallCommand';

const REACT_DEFAULT = `'use client';
import { useState } from 'react';

const options = ['Designer', 'Engineer', 'Product', 'Marketing'];

export function Select() {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-[220px]">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between rounded-[10px]
          border border-line-2 bg-white/[0.03] px-4 py-[11px]
          text-[14px] text-left transition-[border-color] duration-200
          hover:border-line-3 focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-accent/50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? 'text-fg' : 'text-muted'}>
          {value || 'Select role…'}
        </span>
        <svg
          className={\`transition-transform \${open ? 'rotate-180' : ''}\`}
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-[10px]
            border border-line-2 bg-[#0c0c12]
            shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
        >
          {options.map(opt => (
            <li
              key={opt}
              role="option"
              aria-selected={value === opt}
              onClick={() => { setValue(opt); setOpen(false); }}
              className={\`flex cursor-pointer items-center justify-between
                px-4 py-2.5 text-[13.5px] transition-colors
                \${value === opt ? 'text-accent bg-accent/[0.08]' : 'text-muted hover:bg-white/[0.04] hover:text-fg'}\`}
            >
              {opt}
              {value === opt && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`;

const HTML_DEFAULT = `<div class="ghost-select-wrapper">
  <button
    class="ghost-select-trigger"
    aria-haspopup="listbox"
    aria-expanded="false"
  >
    <span>Select role…</span>
    <svg><!-- chevron --></svg>
  </button>

  <ul class="ghost-select-dropdown" role="listbox">
    <li role="option">Designer</li>
    <li role="option">Engineer</li>
    <li role="option">Product</li>
    <li role="option">Marketing</li>
  </ul>
</div>`;

const CSS_DEFAULT = `.ghost-select-wrapper { position: relative; width: 220px; }

.ghost-select-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.03);
  color: #8a8a98;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 200ms;
}

.ghost-select-trigger:hover { border-color: rgba(255,255,255,0.16); }

.ghost-select-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.10);
  background: #0c0c12;
  box-shadow: 0 16px 40px rgba(0,0,0,0.5);
  z-index: 10;
}

.ghost-select-dropdown li {
  padding: 10px 16px;
  font-size: 13.5px;
  color: #8a8a98;
  cursor: pointer;
  transition: all 150ms;
}

.ghost-select-dropdown li:hover { background: rgba(255,255,255,0.04); color: #ededf0; }
.ghost-select-dropdown li[aria-selected="true"] { color: #c4b5fd; background: rgba(196,181,253,0.08); }`;

export default function SelectPage() {
  const [val, setVal] = useState('');
  const [open, setOpen] = useState(false);
  const opts = ['Designer', 'Engineer', 'Product', 'Marketing'];

  return (
    <div className="px-[clamp(24px,4vw,56px)] py-[clamp(40px,6vw,72px)]">

      <nav className="mb-8 flex items-center gap-2 font-mono text-[12px] text-muted" aria-label="breadcrumb">
        <a href="/library" className="transition-colors hover:text-fg">Library</a>
        <span>/</span>
        <span>Components</span>
        <span>/</span>
        <span className="text-fg">Select</span>
      </nav>

      <div className="mb-10 max-w-[640px]">
        <h1 className="mb-3 text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.045em] text-[#f5f5f7]">Select</h1>
        <p className="text-[15px] leading-[1.65] text-muted">
          Accessible dropdown for selecting from a list of options. Keyboard navigable, with checked state and empty placeholder support.
        </p>
      </div>

      <div className="mb-10 max-w-[480px]">
        <div className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-2">Installation</div>
        <InstallCommand command="npx @ghost-ui/cli add select" />
      </div>

      <div className="flex flex-col gap-10 max-w-[860px]">

        <div>
          <div className="mb-4">
            <h2 className="mb-1.5 text-[18px] font-medium tracking-[-0.02em] text-[#f4f4f7]">Default</h2>
            <p className="text-[13.5px] leading-[1.55] text-muted">Standard single-value dropdown. Click to open, click option to select.</p>
          </div>
          <CodePreview
            preview={
              <div className="relative w-[220px]">
                <button
                  onClick={() => setOpen(o => !o)}
                  className="flex w-full items-center justify-between rounded-[10px] border border-line-2 bg-white/[0.03] px-4 py-[11px] text-[14px] text-left transition-[border-color] duration-200 hover:border-line-3"
                >
                  <span className={val ? 'text-fg' : 'text-muted'}>{val || 'Select role…'}</span>
                  <svg className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m6 9 6 6 6-6" /></svg>
                </button>
                {open && (
                  <ul className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-[10px] border border-line-2 bg-[#0c0c12] shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                    {opts.map(opt => (
                      <li
                        key={opt}
                        onClick={() => { setVal(opt); setOpen(false); }}
                        className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-[13.5px] transition-colors ${val === opt ? 'bg-accent/[0.08] text-accent' : 'text-muted hover:bg-white/[0.04] hover:text-fg'}`}
                      >
                        {opt}
                        {val === opt && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            }
            react={REACT_DEFAULT}
            html={HTML_DEFAULT}
            css={CSS_DEFAULT}
          />
        </div>

      </div>
    </div>
  );
}
