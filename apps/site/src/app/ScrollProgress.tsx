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
    <div className="scroll-progress" aria-hidden>
      <span ref={ref} />
    </div>
  );
}
