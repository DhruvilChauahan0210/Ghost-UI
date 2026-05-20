'use client';

import { useEffect, useRef, useState } from 'react';

export interface TocItem {
  id: string;
  label: string;
}

export interface TocGroup {
  label: string;
  items: TocItem[];
}

interface Props {
  items?: TocItem[];
  groups?: TocGroup[];
}

export function TableOfContents({ items, groups }: Props) {
  const [active, setActive] = useState<string>('');
  const listRef = useRef<HTMLUListElement>(null);

  const allItems: TocItem[] = groups
    ? groups.flatMap(g => g.items)
    : (items ?? []);

  useEffect(() => {
    if (allItems.length === 0) return;

    function findActive() {
      // Offset = fixed nav height (72px) + a little breathing room
      const OFFSET = 96;
      let current = allItems[0]?.id ?? '';

      for (const item of allItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - OFFSET <= 0) {
          current = item.id;
        }
      }
      return current;
    }

    function onScroll() {
      setActive(findActive());
    }

    // Set immediately on mount
    setActive(findActive());
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allItems.map(i => i.id).join(',')]);

  // Keep active item scrolled into view within the TOC list
  useEffect(() => {
    if (!active || !listRef.current) return;
    const btn = listRef.current.querySelector(`[data-id="${active}"]`) as HTMLElement | null;
    btn?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const renderItems = (list: TocItem[]) =>
    list.map(item => {
      const isActive = item.id === active;
      return (
        <li key={item.id} className="relative">
          {isActive && (
            <span className="absolute left-0 top-[5px] bottom-[5px] w-[2px] rounded-full bg-accent/70" />
          )}
          <button
            data-id={item.id}
            onClick={() => scrollTo(item.id)}
            className={`w-full py-[5px] pl-4 pr-2 text-left text-[12.5px] tracking-[-0.005em] transition-colors duration-150 ${
              isActive
                ? 'font-medium text-[#c8c0f0]'
                : 'text-[#585870] hover:text-[#9090a8]'
            }`}
          >
            {item.label}
          </button>
        </li>
      );
    });

  return (
    <aside className="sticky top-[96px] hidden w-[188px] shrink-0 xl:block">
      <div className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.20em] text-[#525268]">
        On this page
      </div>
      <div className="mb-3 h-px bg-white/[0.07]" />

      <nav>
        <ul
          ref={listRef}
          className="flex max-h-[calc(100vh-220px)] flex-col gap-px overflow-y-auto [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/[0.08]"
        >
          {groups ? (
            groups.map((group, gi) => (
              <div key={group.label}>
                {gi > 0 && <div className="mx-1 my-2 h-px bg-white/[0.05]" />}
                <div className="mb-1 px-4 pt-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.20em] text-[#363650]">
                  {group.label}
                </div>
                {renderItems(group.items)}
              </div>
            ))
          ) : (
            renderItems(items ?? [])
          )}
        </ul>
      </nav>

      <div className="mt-5 h-px bg-white/[0.07]" />
      <div className="mt-3 text-[11.5px] leading-[1.55] text-[#484860]">
        Something wrong?{' '}
        <a
          href="https://github.com/"
          target="_blank"
          rel="noreferrer"
          className="text-[#686880] underline-offset-3 transition-colors hover:text-[#9090a8] hover:underline"
        >
          Edit this page
        </a>
      </div>
    </aside>
  );
}
