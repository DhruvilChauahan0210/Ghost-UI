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

export function GhostBreadcrumb({ zone: _zone, children, separator = '/', ...rest }: GhostBreadcrumbProps) {
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <nav aria-label="Breadcrumb" {...rest}>
      <ol style={{ display: 'flex', alignItems: 'center', listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((child, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'center' }}>
            {child}
            {i < items.length - 1 && (
              <span aria-hidden style={{ margin: '0 0.5em', userSelect: 'none' }}>
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
        style={{ ...innerStyle, ...(style as React.CSSProperties) }}
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
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', ...innerStyle, ...(style as React.CSSProperties) }}
      {...(rest as HTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
