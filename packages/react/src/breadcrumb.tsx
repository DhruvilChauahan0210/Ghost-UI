import {
  Children,
  isValidElement,
  useCallback,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import type { GhostId, ZoneId } from '@ghost-ui/core';
import { useGhostEngine } from './context.js';
import { useGhostScore, useRegisterNode } from './hooks.js';

// ─── GhostBreadcrumb ──────────────────────────────────────────────────────────

export interface GhostBreadcrumbProps extends HTMLAttributes<HTMLElement> {
  zone: ZoneId;
  children: ReactNode;
  separator?: ReactNode;
}

export function GhostBreadcrumb({ zone: _zone, children, separator = '›', ...rest }: GhostBreadcrumbProps) {
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <nav aria-label="Breadcrumb" {...rest}>
      <ol className="flex items-center gap-0 list-none m-0 p-0">
        {items.map((child, i) => (
          <li key={i} className="flex items-center">
            {child}
            {i < items.length - 1 && (
              <span aria-hidden className="mx-2 select-none text-white/20 text-[11px]">
                {separator}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ─── GhostBreadcrumbItem ──────────────────────────────────────────────────────

export interface GhostBreadcrumbItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
  id: GhostId;
  zone: ZoneId;
  href?: string;
  current?: boolean;
  children: ReactNode;
}

export function GhostBreadcrumbItem({
  id,
  zone,
  href,
  current = false,
  children,
  style,
  ...rest
}: GhostBreadcrumbItemProps) {
  useRegisterNode(id, zone);
  const engine = useGhostEngine();
  const score = useGhostScore(id);
  const hoverStart = useRef<number | null>(null);

  const handleClick = useCallback(() => {
    if (!current) engine.record('click', id, zone);
  }, [engine, id, zone, current]);

  const handleMouseEnter = useCallback(() => {
    hoverStart.current = performance.now();
    if (!current) engine.record('hover', id, zone);
  }, [engine, id, zone, current]);

  const handleMouseLeave = useCallback(() => {
    if (hoverStart.current != null) {
      const ms = performance.now() - hoverStart.current;
      hoverStart.current = null;
      if (ms > 120 && !current) engine.record('dwell', id, zone, { ms });
    }
  }, [engine, id, zone, current]);

  const textGlow = score > 0.1
    ? `drop-shadow(0 0 ${6 * score}px rgba(139,141,248,${score}))`
    : undefined;

  const innerStyle = {
    filter: textGlow,
    transition: 'filter 240ms ease',
  };

  if (current) {
    return (
      <span
        aria-current="page"
        data-ghost-id={id}
        data-ghost-score={score.toFixed(2)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ ...innerStyle, ...(style as React.CSSProperties) }}
        className="text-[12px] font-medium text-white/85"
        {...(rest as HTMLAttributes<HTMLSpanElement>)}
      >
        {children}
      </span>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        data-ghost-id={id}
        data-ghost-score={score.toFixed(2)}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={innerStyle}
        className="text-[12px] text-white/45 hover:text-white/80 transition-colors duration-150 no-underline"
        {...(rest as HTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      data-ghost-id={id}
      data-ghost-score={score.toFixed(2)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={innerStyle}
      className="bg-transparent border-0 p-0 cursor-pointer text-[12px] text-white/45 hover:text-white/80 transition-colors duration-150"
      {...(rest as HTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
