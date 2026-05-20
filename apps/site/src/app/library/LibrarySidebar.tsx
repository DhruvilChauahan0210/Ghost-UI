'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SECTIONS = [
  {
    title: 'Getting started',
    items: [
      { label: 'Introduction', href: '/library' },
      { label: 'Installation',  href: '/library#install' },
      { label: 'Theming',       href: '/library#theming' },
    ],
  },
  {
    title: 'Components',
    count: 9,
    items: [
      { label: 'Alert',   href: '/library/components/alert' },
      { label: 'Avatar',  href: '/library/components/avatar' },
      { label: 'Badge',   href: '/library/components/badge' },
      { label: 'Button',  href: '/library/components/button' },
      { label: 'Card',    href: '/library/components/card' },
      { label: 'Input',   href: '/library/components/input' },
      { label: 'Select',  href: '/library/components/select' },
      { label: 'Switch',  href: '/library/components/switch' },
      { label: 'Tabs',    href: '/library/components/tabs' },
    ],
  },
  {
    title: 'Ghost primitives',
    items: [
      { label: 'Ghost.Button',  href: '/library/ghost/button',   badge: 'AI' },
      { label: 'Ghost.Slot',    href: '/library/ghost/slot',     badge: 'AI' },
      { label: 'GhostProvider', href: '/library/ghost/provider', badge: 'AI' },
    ],
  },
] as const;

export function LibrarySidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-[72px] bottom-0 w-[256px] overflow-y-auto border-r border-white/[0.07] bg-[#07070a] max-[1024px]:hidden">

      {/* Search */}
      <div className="px-4 pt-7 pb-5">
        <button className="flex w-full items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-left transition-all duration-150 hover:border-white/[0.14] hover:bg-white/[0.05]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#666680]" aria-hidden><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <span className="flex-1 text-[13px] text-[#505068]">Search components…</span>
          <kbd className="rounded-[5px] border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-[#505068]">⌘K</kbd>
        </button>
      </div>

      <div className="mx-4 h-px bg-white/[0.06]" />

      {/* Nav */}
      <nav className="px-3 py-5 pb-8">
        {SECTIONS.map((section, si) => (
          <div key={section.title} className={si > 0 ? 'mt-6' : ''}>
            {/* Category header */}
            <div className="mb-1.5 flex items-center justify-between px-2 py-1">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.20em] text-[#525268]">
                {section.title}
              </span>
              {'count' in section && section.count && (
                <span className="rounded-full border border-white/[0.07] px-1.5 font-mono text-[9px] font-medium tabular-nums text-[#525268]">
                  {section.count}
                </span>
              )}
            </div>

            {/* Items */}
            <ul className="flex flex-col gap-px">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/library' && pathname?.startsWith(item.href));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`group relative flex items-center rounded-[9px] px-3 py-[7px] text-[13.5px] tracking-[-0.005em] transition-all duration-150 ${
                        isActive
                          ? 'bg-accent/[0.10] font-medium text-[#d8d0f8]'
                          : 'text-[#666680] hover:bg-white/[0.04] hover:text-[#a8a8be]'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-r-full bg-accent opacity-80" />
                      )}
                      <span className="flex-1 pl-1">{item.label}</span>
                      {'badge' in item && item.badge ? (
                        <span className="rounded-full border border-accent/[0.25] bg-accent/[0.10] px-[7px] py-px font-mono text-[9px] font-semibold uppercase tracking-[0.06em] text-accent">
                          {item.badge}
                        </span>
                      ) : isActive ? (
                        <span className="font-mono text-[11px] text-accent/60">→</span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Quick install */}
      <div className="mx-4 mb-6 overflow-hidden rounded-[12px] border border-white/[0.08] bg-[#0e0e18]">
        <div className="border-b border-white/[0.06] px-4 py-2.5">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#525268]">Quick install</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-3">
          <span className="font-mono text-[12px] text-[#525268] select-none">$</span>
          <code className="font-mono text-[12.5px] text-[#b8aee4]">npx @ghost-ui/cli init</code>
        </div>
      </div>
    </aside>
  );
}
