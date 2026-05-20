'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { DesignVariant } from '../../VariantGallery';

interface Props {
  variants: DesignVariant[];
  categorySlug: string;
  totalDesigns: number;
}

const DURATION = 5000;

export function ButtonCarousel({ variants, categorySlug, totalDesigns }: Props) {
  const [idx, setIdx]       = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused]   = useState(false);

  const elapsed  = useRef(0);
  const rafRef   = useRef<number>(0);
  const lastTs   = useRef<number>(0);
  const pausedRef = useRef(false);

  const goTo = useCallback((next: number) => {
    elapsed.current = 0;
    setVisible(false);
    setTimeout(() => {
      setIdx(next);
      setVisible(true);
    }, 200);
  }, []);

  const prev = useCallback(() => goTo((idx - 1 + variants.length) % variants.length), [idx, variants.length, goTo]);
  const next = useCallback(() => goTo((idx + 1) % variants.length),                   [idx, variants.length, goTo]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    function tick(ts: number) {
      if (lastTs.current === 0) lastTs.current = ts;
      const delta = ts - lastTs.current;
      lastTs.current = ts;

      if (!pausedRef.current) {
        elapsed.current += delta;

        if (elapsed.current >= DURATION) {
          elapsed.current = 0;
          setVisible(false);
          setTimeout(() => {
            setIdx(i => (i + 1) % variants.length);
            setVisible(true);
          }, 200);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); lastTs.current = 0; };
  }, [variants.length]);

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  const current = variants[idx];

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/[0.09] bg-[#08080f] shadow-[0_8px_40px_rgba(0,0,0,0.5)]">

      {/* ── Stage ─────────────────────────────────────────────────────── */}
      <div
        className="relative flex min-h-[200px] items-center justify-center overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Ambient glow — breathes with the accent */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(139,92,246,0.10) 0%, rgba(196,181,253,0.04) 50%, transparent 75%)',
          }}
        />

        {/* Vignette edges */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_50%,transparent_40%,rgba(8,8,15,0.9)_100%)]" />

        {/* Prev arrow */}
        <button
          onClick={prev}
          aria-label="Previous design"
          className="absolute left-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-[#0c0c18]/80 text-[#606078] opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:border-white/[0.20] hover:text-[#c0c0d0] active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m15 18-6-6 6-6"/></svg>
        </button>

        {/* Button preview */}
        <div
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.96)',
            transition: visible
              ? 'opacity 280ms cubic-bezier(0.2,0.7,0.2,1), transform 280ms cubic-bezier(0.2,0.7,0.2,1)'
              : 'opacity 180ms ease-in, transform 180ms ease-in',
          }}
          className="relative z-10"
        >
          {current?.preview}
        </div>

        {/* Next arrow */}
        <button
          onClick={next}
          aria-label="Next design"
          className="absolute right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-[#0c0c18]/80 text-[#606078] opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 hover:border-white/[0.20] hover:text-[#c0c0d0] active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m9 18 6-6-6-6"/></svg>
        </button>

        {/* Pause indicator */}
        {paused && (
          <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-[#0c0c18]/70 px-2.5 py-1 backdrop-blur-sm">
            <svg width="8" height="10" viewBox="0 0 8 10" fill="currentColor" className="text-[#404058]" aria-hidden>
              <rect x="0" y="0" width="2.5" height="10" rx="1"/>
              <rect x="5.5" y="0" width="2.5" height="10" rx="1"/>
            </svg>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.10em] text-[#404058]">Paused</span>
          </div>
        )}
      </div>

      {/* ── Info strip ────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.07] px-5 pt-4 pb-3.5">
        <div className="flex items-start justify-between gap-4">

          {/* Left: name + description */}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_6px_rgba(196,181,253,0.7)] transition-all duration-300"
              />
              <span
                className="font-mono text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#c0c0d0] transition-all duration-200"
                style={{
                  opacity:    visible ? 1 : 0,
                  transform:  visible ? 'translateX(0)' : 'translateX(-6px)',
                  transition: 'opacity 250ms, transform 250ms',
                }}
              >
                {current?.name}
              </span>
            </div>
            <p
              className="mt-1.5 line-clamp-1 text-[12px] leading-[1.5] text-[#484860]"
              style={{
                opacity:    visible ? 1 : 0,
                transition: 'opacity 300ms 60ms',
              }}
            >
              {current?.description}
            </p>
          </div>

          {/* Right: counter + CTA */}
          <div className="flex shrink-0 items-center gap-3">
            <span className="font-mono text-[11px] tabular-nums text-[#363650]">
              {String(idx + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(variants.length).padStart(2, '0')}
            </span>
            <a
              href={`/library/components/button/${categorySlug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-accent/[0.22] bg-accent/[0.07] px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-accent transition-all duration-150 hover:border-accent/[0.45] hover:bg-accent/[0.15] hover:shadow-[0_0_12px_rgba(196,181,253,0.15)]"
            >
              View all {totalDesigns}
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Dot strip */}
        <div className="mt-3.5 flex items-center gap-1.5">
          {variants.map((v, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to ${v.name}`}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                i === idx
                  ? 'w-6 bg-accent'
                  : 'w-[3px] bg-white/[0.12] hover:bg-white/[0.28]'
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
