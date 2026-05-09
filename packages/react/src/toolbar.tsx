import {
  Children,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { LayoutGroup, motion } from 'motion/react';
import type { GhostId, ZoneId } from '@ghost-ui/core';
import { useGhostEngine } from './context.js';
import { useGhostOrder, useGhostScore, useRegisterNode } from './hooks.js';

// ─── GhostToolbar ─────────────────────────────────────────────────────────────

export interface GhostToolbarProps extends HTMLAttributes<HTMLDivElement> {
  zone: ZoneId;
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
}

export function GhostToolbar({ zone, children, orientation = 'horizontal', ...rest }: GhostToolbarProps) {
  const order = useGhostOrder(zone);

  const ordered = useMemo(() => {
    const arr = Children.toArray(children).filter(isValidElement) as ReactElement<{ id?: string }>[];
    if (order.length === 0) return arr;
    const indexById = new Map(order.map((id, i) => [id, i]));
    return [...arr].sort((a, b) => {
      const ai = indexById.get((a.props as { id?: string }).id ?? '') ?? Number.POSITIVE_INFINITY;
      const bi = indexById.get((b.props as { id?: string }).id ?? '') ?? Number.POSITIVE_INFINITY;
      return ai - bi;
    });
  }, [children, order]);

  return (
    <LayoutGroup id={`ghost-toolbar-${zone}`}>
      <div role="toolbar" aria-orientation={orientation} {...rest}>
        {ordered.map((child) => {
          const id = (child.props as { id?: string }).id;
          if (!id) return child;
          return (
            <motion.div
              key={id}
              layout="position"
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            >
              {child}
            </motion.div>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

// ─── GhostToolbarButton ───────────────────────────────────────────────────────

export interface GhostToolbarButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'id'> {
  id: GhostId;
  zone: ZoneId;
  tooltip?: string;
  children: ReactNode;
}

export function GhostToolbarButton({
  id,
  zone,
  tooltip,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
  children,
  ...rest
}: GhostToolbarButtonProps) {
  useRegisterNode(id, zone);
  const engine = useGhostEngine();
  const score = useGhostScore(id);
  const hoverStart = useRef<number | null>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      engine.record('click', id, zone);
      onClick?.(e);
    },
    [engine, id, zone, onClick],
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      hoverStart.current = performance.now();
      engine.record('hover', id, zone);
      onMouseEnter?.(e);
    },
    [engine, id, zone, onMouseEnter],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (hoverStart.current != null) {
        const ms = performance.now() - hoverStart.current;
        hoverStart.current = null;
        if (ms > 120) engine.record('dwell', id, zone, { ms });
      }
      onMouseLeave?.(e);
    },
    [engine, id, zone, onMouseLeave],
  );

  const scoreGlow = score > 0
    ? `0 0 ${28 * score}px ${5 * score}px rgba(120,120,255,${0.22 * score})`
    : undefined;

  return (
    <button
      role="button"
      data-ghost-id={id}
      data-ghost-score={score.toFixed(2)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        boxShadow: scoreGlow,
        transition: 'box-shadow 240ms ease',
        ...style,
      }}
      {...rest}
    >
      {tooltip && <title>{tooltip}</title>}
      {children}
    </button>
  );
}

// ─── GhostToolbarSeparator ────────────────────────────────────────────────────

export interface GhostToolbarSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
}

export function GhostToolbarSeparator({ orientation = 'vertical', ...rest }: GhostToolbarSeparatorProps) {
  return <div role="separator" aria-orientation={orientation} {...rest} />;
}

// ─── Compound ─────────────────────────────────────────────────────────────────

GhostToolbar.Button = GhostToolbarButton;
GhostToolbar.Separator = GhostToolbarSeparator;
