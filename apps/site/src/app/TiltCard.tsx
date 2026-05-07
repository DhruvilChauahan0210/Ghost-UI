'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function TiltCard({
  children,
  className = '',
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let rx = 0;
    let ry = 0;
    let tgtRx = 0;
    let tgtRy = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tgtRy = (px - 0.5) * max * 2;
      tgtRx = (0.5 - py) * max * 2;
      el.style.setProperty('--tx', `${px * 100}%`);
      el.style.setProperty('--ty', `${py * 100}%`);
      schedule();
    };
    const onLeave = () => {
      tgtRx = 0;
      tgtRy = 0;
      schedule();
    };
    const tick = () => {
      rx += (tgtRx - rx) * 0.15;
      ry += (tgtRy - ry) * 0.15;
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      if (Math.abs(tgtRx - rx) > 0.05 || Math.abs(tgtRy - ry) > 0.05) {
        raf = window.requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    const schedule = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(tick);
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [max]);

  return (
    <div ref={ref} className={`tilt ${className}`} style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}>
      {children}
    </div>
  );
}
