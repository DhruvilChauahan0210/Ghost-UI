'use client';

import { useEffect, useRef } from 'react';

export function HeroFluid() {
  const ref = useRef<HTMLDivElement | null>(null);

  // Cursor parallax
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const tick = () => {
      cx += (tx - cx) * 0.05;
      cy += (ty - cy) * 0.05;
      root.style.setProperty('--fx', `${cx.toFixed(2)}px`);
      root.style.setProperty('--fy', `${cy.toFixed(2)}px`);
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = window.requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 60;
      ty = (e.clientY / window.innerHeight - 0.5) * 60;
      if (!raf) raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  // Pause animation + fade out when the user has scrolled past the hero —
  // keeps GPU off-budget while the noise isn't visible behind content.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let scheduled = false;
    const update = () => {
      scheduled = false;
      const past = window.scrollY > window.innerHeight * 0.7;
      el.classList.toggle('is-paused', past);
    };
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="fluid" aria-hidden>
      <svg className="fluid-svg" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="fluid-violet" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.0065" numOctaves="2" seed="3" stitchTiles="stitch" />
            <feColorMatrix
              values="
                0    0    0    0    0.46
                0    0    0    0    0.34
                0    0    0    0    0.95
                0    0    0    0.18 0
              "
            />
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
          <filter id="fluid-pink" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="11" stitchTiles="stitch" />
            <feColorMatrix
              values="
                0    0    0    0    0.85
                0    0    0    0    0.62
                0    0    0    0    1.00
                0    0    0    0.10 0
              "
            />
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>
        <rect className="fluid-layer fluid-a" width="100%" height="100%" filter="url(#fluid-violet)" />
        <rect className="fluid-layer fluid-b" width="100%" height="100%" filter="url(#fluid-pink)" />
      </svg>
    </div>
  );
}
