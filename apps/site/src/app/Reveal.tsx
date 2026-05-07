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
          entry.target.classList.add('in');
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
      el.classList.add('in');
      return;
    }
    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  const className = `reveal${delay ? ` delay-${delay}` : ''}`;
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
