'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function CursorGlow({
  children,
  className = '',
  intensity = 1,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let tx = 50;
    let ty = 30;
    let opacity = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 100;
      ty = ((e.clientY - r.top) / r.height) * 100;
      opacity = 1;
      schedule();
    };
    const onLeave = () => {
      opacity = 0;
      schedule();
    };
    const apply = () => {
      el.style.setProperty('--gx', `${tx}%`);
      el.style.setProperty('--gy', `${ty}%`);
      el.style.setProperty('--go', `${opacity * intensity}`);
      raf = 0;
    };
    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(apply);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [intensity]);

  return (
    <div ref={ref} className={`cursor-glow ${className}`}>
      {children}
    </div>
  );
}
