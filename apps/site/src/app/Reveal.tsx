'use client';

import { useEffect, useRef, type ReactNode } from 'react';

let sharedIO: IntersectionObserver | null = null;
const getIO = (): IntersectionObserver | null => {
  if (typeof IntersectionObserver === 'undefined') return null;
  if (sharedIO) return sharedIO;
  sharedIO = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-revealed', '');
          sharedIO?.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 },
  );
  return sharedIO;
};

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4;
  as?: 'div' | 'section' | 'header';
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = getIO();
    if (!io) {
      el.setAttribute('data-revealed', '');
      return;
    }
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref as never}
      className="translate-y-[14px] opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] data-[revealed]:translate-y-0 data-[revealed]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
      style={delay ? { transitionDelay: `${DELAY_MS[delay]}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

const DELAY_MS: Record<1 | 2 | 3 | 4, number> = { 1: 60, 2: 140, 3: 220, 4: 300 };
