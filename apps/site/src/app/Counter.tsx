'use client';

import { useEffect, useRef } from 'react';

export function Counter({
  value,
  suffix = '',
  prefix = '',
  duration = 1100,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const write = (n: number) => {
      el.textContent = `${prefix}${n}${suffix}`;
    };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      write(value);
      return;
    }
    write(0);
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) ** 3;
          write(Math.round(value * eased));
          if (t < 1) raf = window.requestAnimationFrame(tick);
        };
        raf = window.requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration, prefix, suffix]);

  return <span ref={ref} />;
}
