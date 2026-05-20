'use client';

import { useState } from 'react';
import { CodePreview } from '../../CodePreview';
import { InstallCommand } from '../../InstallCommand';

const REACT_PILL = `'use client';
import { useState } from 'react';

const tabs = ['Overview', 'Analytics', 'Settings'];

export function PillTabs() {
  const [active, setActive] = useState('Overview');

  return (
    <div>
      <div
        role="tablist"
        className="inline-flex gap-0.5 rounded-full border border-line bg-white/[0.02] p-1"
      >
        {tabs.map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={\`rounded-full px-4 py-1.5 text-[13px] font-medium tracking-[-0.005em]
              transition-all duration-200
              \${active === tab
                ? 'bg-accent/[0.14] text-accent shadow-[inset_0_0_0_1px_rgba(196,181,253,0.20)]'
                : 'text-muted hover:text-fg'
              }\`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-6 text-[14px] leading-[1.6] text-muted">
        Content for <strong className="text-fg">{active}</strong>
      </div>
    </div>
  );
}`;

const REACT_UNDERLINE = `'use client';
import { useState } from 'react';

const tabs = [
  { id: 'preview', label: 'Preview' },
  { id: 'code', label: 'Code' },
  { id: 'docs', label: 'Docs' },
];

export function UnderlineTabs() {
  const [active, setActive] = useState('preview');

  return (
    <div>
      <div
        role="tablist"
        className="flex gap-6 border-b border-line"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={\`relative pb-3 text-[13.5px] font-medium tracking-[-0.005em]
              transition-colors duration-200
              after:absolute after:bottom-[-1px] after:left-0 after:right-0
              after:h-[2px] after:rounded-full after:transition-all after:duration-200
              \${active === tab.id
                ? 'text-fg after:bg-accent'
                : 'text-muted hover:text-fg after:bg-transparent'
              }\`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}`;

const HTML_PILL = `<div role="tablist" class="ghost-tabs-pill">
  <button role="tab" aria-selected="true" class="ghost-tab active">
    Overview
  </button>
  <button role="tab" aria-selected="false" class="ghost-tab">
    Analytics
  </button>
  <button role="tab" aria-selected="false" class="ghost-tab">
    Settings
  </button>
</div>`;

const CSS_PILL = `.ghost-tabs-pill {
  display: inline-flex;
  gap: 2px;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  padding: 4px;
}

.ghost-tab {
  border-radius: 9999px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  color: #8a8a98;
  cursor: pointer;
  border: none;
  background: transparent;
  transition: all 200ms;
}

.ghost-tab:hover { color: #ededf0; }

.ghost-tab.active {
  background: rgba(196,181,253,0.14);
  color: #c4b5fd;
  box-shadow: inset 0 0 0 1px rgba(196,181,253,0.20);
}`;

export default function TabsPage() {
  const [pillTab, setPillTab] = useState('Overview');
  const [underlineTab, setUnderlineTab] = useState('preview');
  const [cardTab, setCardTab] = useState('react');

  return (
    <div className="px-[clamp(24px,4vw,56px)] py-[clamp(40px,6vw,72px)]">

      <nav className="mb-8 flex items-center gap-2 font-mono text-[12px] text-muted" aria-label="breadcrumb">
        <a href="/library" className="transition-colors hover:text-fg">Library</a>
        <span>/</span>
        <span>Components</span>
        <span>/</span>
        <span className="text-fg">Tabs</span>
      </nav>

      <div className="mb-10 max-w-[640px]">
        <h1 className="mb-3 text-[clamp(32px,4vw,48px)] font-medium tracking-[-0.045em] text-[#f5f5f7]">Tabs</h1>
        <p className="text-[15px] leading-[1.65] text-muted">
          Three tab styles: pill (toggle-group), underline (classic nav), and card (elevated). Full keyboard navigation and ARIA tabpanel support.
        </p>
      </div>

      <div className="mb-10 max-w-[480px]">
        <div className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-2">Installation</div>
        <InstallCommand command="npx @ghost-ui/cli add tabs" />
      </div>

      <div className="flex flex-col gap-10 max-w-[860px]">

        {/* Pill tabs */}
        <div>
          <div className="mb-4">
            <h2 className="mb-1.5 text-[18px] font-medium tracking-[-0.02em] text-[#f4f4f7]">Pill</h2>
            <p className="text-[13.5px] leading-[1.55] text-muted">Contained pill-style tabs. Great for view switches and filter groups.</p>
          </div>
          <CodePreview
            preview={
              <div className="inline-flex gap-0.5 rounded-full border border-line bg-white/[0.02] p-1">
                {['Overview', 'Analytics', 'Settings'].map(t => (
                  <button
                    key={t}
                    onClick={() => setPillTab(t)}
                    className={`rounded-full px-4 py-1.5 text-[13px] font-medium tracking-[-0.005em] transition-all duration-200 ${pillTab === t ? 'bg-accent/[0.14] text-accent shadow-[inset_0_0_0_1px_rgba(196,181,253,0.20)]' : 'text-muted hover:text-fg'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            }
            react={REACT_PILL}
            html={HTML_PILL}
            css={CSS_PILL}
          />
        </div>

        {/* Underline tabs */}
        <div>
          <div className="mb-4">
            <h2 className="mb-1.5 text-[18px] font-medium tracking-[-0.02em] text-[#f4f4f7]">Underline</h2>
            <p className="text-[13.5px] leading-[1.55] text-muted">Classic underline indicator. Sits flush with a divider line. Ideal for page-level navigation.</p>
          </div>
          <CodePreview
            preview={
              <div className="flex gap-6 border-b border-line">
                {[{ id: 'preview', label: 'Preview' }, { id: 'code', label: 'Code' }, { id: 'docs', label: 'Docs' }].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setUnderlineTab(t.id)}
                    className={`relative pb-3 text-[13.5px] font-medium tracking-[-0.005em] transition-colors duration-200 after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:rounded-full after:transition-all after:duration-200 ${underlineTab === t.id ? 'text-fg after:bg-accent' : 'text-muted hover:text-fg after:bg-transparent'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            }
            react={REACT_UNDERLINE}
            html={`<div role="tablist" class="ghost-tabs-underline">
  <button role="tab" aria-selected="true" class="ghost-tab-underline active">Preview</button>
  <button role="tab" aria-selected="false" class="ghost-tab-underline">Code</button>
  <button role="tab" aria-selected="false" class="ghost-tab-underline">Docs</button>
</div>`}
            css={`.ghost-tabs-underline {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.ghost-tab-underline {
  position: relative;
  padding-bottom: 12px;
  font-size: 13.5px;
  font-weight: 500;
  color: #8a8a98;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 200ms;
}

.ghost-tab-underline::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0; right: 0;
  height: 2px;
  border-radius: 99px;
  background: transparent;
  transition: background 200ms;
}

.ghost-tab-underline.active { color: #ededf0; }
.ghost-tab-underline.active::after { background: #c4b5fd; }`}
          />
        </div>

        {/* Card tabs */}
        <div>
          <div className="mb-4">
            <h2 className="mb-1.5 text-[18px] font-medium tracking-[-0.02em] text-[#f4f4f7]">Card</h2>
            <p className="text-[13.5px] leading-[1.55] text-muted">Elevated card-style tabs for code/preview toggles or compact switchers in panels.</p>
          </div>
          <CodePreview
            preview={
              <div className="flex gap-1.5 rounded-xl border border-line bg-[#0c0c12] p-1.5">
                {['React', 'HTML', 'CSS'].map(t => (
                  <button
                    key={t}
                    onClick={() => setCardTab(t.toLowerCase())}
                    className={`rounded-lg px-3.5 py-2 font-mono text-[12px] font-medium uppercase tracking-[0.06em] transition-all duration-200 ${cardTab === t.toLowerCase() ? 'bg-accent/[0.12] text-accent border border-accent/[0.20]' : 'text-muted hover:bg-white/[0.04] hover:text-fg border border-transparent'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            }
            react={`'use client';
import { useState } from 'react';

const tabs = ['React', 'HTML', 'CSS'];

export function CardTabs() {
  const [active, setActive] = useState('react');

  return (
    <div className="flex gap-1.5 rounded-xl border border-line bg-[#0c0c12] p-1.5">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActive(tab.toLowerCase())}
          className={\`rounded-lg px-3.5 py-2 font-mono text-[12px] font-medium
            uppercase tracking-[0.06em] transition-all duration-200 border
            \${active === tab.toLowerCase()
              ? 'bg-accent/[0.12] text-accent border-accent/[0.20]'
              : 'text-muted hover:bg-white/[0.04] hover:text-fg border-transparent'
            }\`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}`}
            html={`<div class="ghost-tabs-card">
  <button class="ghost-tab-card active">React</button>
  <button class="ghost-tab-card">HTML</button>
  <button class="ghost-tab-card">CSS</button>
</div>`}
            css={`.ghost-tabs-card {
  display: flex;
  gap: 6px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.06);
  background: #0c0c12;
  padding: 6px;
}

.ghost-tab-card {
  border-radius: 8px;
  padding: 8px 14px;
  font-family: monospace;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8a8a98;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 200ms;
}

.ghost-tab-card:hover {
  background: rgba(255,255,255,0.04);
  color: #ededf0;
}

.ghost-tab-card.active {
  background: rgba(196,181,253,0.12);
  color: #c4b5fd;
  border-color: rgba(196,181,253,0.20);
}`}
          />
        </div>

      </div>
    </div>
  );
}
