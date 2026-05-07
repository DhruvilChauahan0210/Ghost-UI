'use client';

import { useEffect } from 'react';

/**
 * Full-viewport fluid noise — SVG fractal-noise texture rendered as a soft
 * violet wash. Drifts on its own via CSS transform + scale; the cursor
 * shifts the texture origin via a 3D-ish parallax. No blobs, no orbs —
 * pure procedural noise like flowing smoke.
 */
export function HeroFluid() {
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

  return (
    <div className="fluid" aria-hidden>
      <svg className="fluid-svg" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Base noise — very low alpha, heavily blurred, blends with page */}
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
          {/* Secondary noise — even softer cyan / pink, almost imperceptible */}
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
