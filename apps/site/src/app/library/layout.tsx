import type { ReactNode } from 'react';
import { ButtonEffects } from '../ButtonEffects';
import { ScrollProgress } from '../ScrollProgress';
import { LibrarySidebar } from './LibrarySidebar';

const BRAND_MARK = "relative inline-block h-[22px] w-[22px] rounded-md bg-[conic-gradient(from_220deg_at_50%_50%,#c4b5fd,#8b5cf6,#38bdf8,#c4b5fd)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.20),0_0_14px_rgba(167,139,250,0.40)] transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] after:absolute after:inset-[5px] after:rounded after:bg-[rgba(10,10,14,0.95)] after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] after:content-['']";
const NAV_LINK = "inline-flex h-full items-center rounded-full px-3 text-[13px] font-medium tracking-[-0.005em] text-muted no-underline transition-colors duration-200 hover:bg-white/[0.04] hover:text-fg";

export default function LibraryLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <ButtonEffects />

      <header className="fixed top-[18px] left-1/2 z-[60] inline-flex -translate-x-1/2 items-center rounded-full border border-white/[0.08] bg-[rgba(10,10,14,0.72)] p-[5px] shadow-[0_12px_38px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[22px] backdrop-saturate-[160%] transition-[border-color,box-shadow] duration-200 hover:border-white/[0.14] hover:shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_32px_rgba(167,139,250,0.10),inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="flex h-[38px] items-center">
          <a
            className="group inline-flex h-full items-center gap-[9px] rounded-full pl-1.5 pr-3 text-[13.5px] font-medium tracking-[-0.012em] text-fg no-underline transition-colors duration-200 hover:bg-white/[0.03]"
            href="/"
          >
            <span className={`${BRAND_MARK} group-hover:rotate-45`} aria-hidden />
            <span>Ghost UI</span>
            <span className="rounded-full border border-accent/[0.24] bg-accent/[0.12] px-1.5 py-px font-mono text-[9.5px] font-medium uppercase tracking-[0.04em] text-accent">v0.1</span>
          </a>
          <span className="mx-1 h-5 w-px bg-line-2 max-[720px]:hidden" aria-hidden />
          <nav className="flex h-full items-center gap-px px-0.5 max-[720px]:hidden">
            <a className={NAV_LINK} href="/#how-it-works">How it works</a>
            <a className={NAV_LINK} href="/#how">Architecture</a>
            <a className={NAV_LINK} href="/#install">Install</a>
            <a
              className="inline-flex h-full items-center rounded-full px-3 text-[13px] font-medium tracking-[-0.005em] text-accent no-underline bg-accent/[0.08] transition-colors duration-200 hover:bg-accent/[0.14]"
              href="/library"
            >
              Library
            </a>
          </nav>
          <span className="mx-1 h-5 w-px bg-line-2" aria-hidden />
          <a
            className="nav-cta relative isolate inline-flex h-full items-center gap-[7px] overflow-hidden rounded-full border border-accent/[0.28] bg-[linear-gradient(180deg,rgba(196,181,253,0.16),rgba(196,181,253,0.04))] px-3.5 text-[13px] font-medium tracking-[-0.005em] text-[#f4f0ff] no-underline transition-[background,border-color] duration-200 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(140px_circle_at_var(--bx,50%)_var(--by,50%),rgba(196,181,253,0.30),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-200 before:content-[''] hover:border-accent/50 hover:bg-[linear-gradient(180deg,rgba(196,181,253,0.24),rgba(196,181,253,0.06))] hover:before:opacity-100 [&>*]:relative [&>*]:z-[1]"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="text-[12px] text-[#fbbf24]" aria-hidden>★</span>
            <span>Star</span>
            <span className="font-mono text-[11px] font-medium tabular-nums text-white/60">1.2k</span>
          </a>
        </div>
      </header>

      {/* Atmospheric background */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        {/* Radial ambient glow top-left (near sidebar) */}
        <div className="absolute -left-32 top-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.06),transparent)]" />
        {/* Subtle horizontal scanlines */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_39px,rgba(255,255,255,0.012)_39px,rgba(255,255,255,0.012)_40px)]" />
        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.032]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '160px 160px',
          }}
        />
      </div>

      <div className="relative z-[1] flex min-h-screen pt-[72px]">
        <LibrarySidebar />
        <main className="min-w-0 flex-1 pl-[256px] max-[1024px]:pl-0">
          {children}
        </main>
      </div>
    </>
  );
}
