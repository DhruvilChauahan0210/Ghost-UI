'use client';

import { useEffect } from 'react';

export function MouseTracker() {
  useEffect(() => {
    let raf = 0;
    let mx = 50;
    let my = 50;
    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / window.innerWidth) * 100;
      my = (e.clientY / window.innerHeight) * 100;
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mx', `${mx}%`);
        document.documentElement.style.setProperty('--my', `${my}%`);
        raf = 0;
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
