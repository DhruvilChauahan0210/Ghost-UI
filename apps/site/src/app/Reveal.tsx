'use client';

import { useEffect, useRef, type ReactNode } from 'react';

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
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('in');
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add('in');
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const className = `reveal${delay ? ` delay-${delay}` : ''}`;
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
