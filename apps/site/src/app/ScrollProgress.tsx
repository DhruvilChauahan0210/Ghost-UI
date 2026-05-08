'use client';

import { useEffect, useRef } from 'react';

export function ScrollProgress() {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const scroll = window.scrollY;
      const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const p = Math.min(1, Math.max(0, scroll / max));
      if (ref.current) ref.current.style.setProperty('--p', `${(p * 100).toFixed(2)}%`);
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 z-[60] h-px w-full bg-white/[0.04]" aria-hidden>
      <span
        ref={ref}
        className="block h-full w-[var(--p,0%)] bg-gradient-to-r from-accent-2 to-accent shadow-[0_0_12px_rgba(167,139,250,0.7)]"
      />
    </div>
  );
}
