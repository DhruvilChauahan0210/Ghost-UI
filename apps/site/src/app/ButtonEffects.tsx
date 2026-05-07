'use client';

import { useEffect } from 'react';

const SELECTOR = '.btn, .gbtn, .feature, .nav-cta, .copy-btn, .status-reset';

export function ButtonEffects() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest<HTMLElement>(SELECTOR);
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--bx', `${e.clientX - r.left}px`);
      el.style.setProperty('--by', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);
  return null;
}
