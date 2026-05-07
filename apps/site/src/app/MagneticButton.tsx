'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

export function MagneticButton({ href, children, className = 'btn primary', external = true }: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    const radius = 90;
    const strength = 0.22;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        tx = dx * strength;
        ty = dy * strength;
      } else {
        tx = 0;
        ty = 0;
      }
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        raf = 0;
      });
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      el.style.transform = 'translate3d(0,0,0)';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      style={{ willChange: 'transform' }}
    >
      {children}
    </a>
  );
}
