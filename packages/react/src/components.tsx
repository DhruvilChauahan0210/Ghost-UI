import type { GhostId, ZoneId } from '@ghost-ui/core';
import { LayoutGroup, motion } from 'motion/react';
import {
  Children,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useGhostEngine } from './context.js';
import { useGhostHitbox, useGhostOrder, useGhostScore, useRegisterNode } from './hooks.js';

interface SlotProps extends HTMLAttributes<HTMLDivElement> {
  zone: ZoneId;
  children: ReactNode;
  /** disable Motion layout animation */
  staticLayout?: boolean;
}

/**
 * Reorders its children based on the optimizer's plan for `zone`.
 * Children must be `<Ghost.Item>` (or any element with a `data-ghost-id`).
 */
export function GhostSlot({ zone, children, staticLayout, ...rest }: SlotProps) {
  const order = useGhostOrder(zone);

  const ordered = useMemo(() => {
    const arr = Children.toArray(children).filter(isValidElement) as ReactElement<{ id?: string }>[];
    if (order.length === 0) return arr;
    const indexById = new Map(order.map((id, i) => [id, i]));
    return [...arr].sort((a, b) => {
      const ai = indexById.get(getId(a)) ?? Number.POSITIVE_INFINITY;
      const bi = indexById.get(getId(b)) ?? Number.POSITIVE_INFINITY;
      return ai - bi;
    });
  }, [children, order]);

  return (
    <LayoutGroup id={`ghost-zone-${zone}`}>
      <div {...rest}>
        {ordered.map((child) => {
          const id = getId(child);
          if (!id) return child;
          return staticLayout ? (
            child
          ) : (
            <motion.div key={id} layout="position" transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
              {child}
            </motion.div>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

function getId(el: ReactElement<{ id?: string }>): string {
  return (el.props && (el.props as { id?: string }).id) || '';
}

interface ItemBaseProps {
  id: GhostId;
  zone: ZoneId;
  weight?: number;
  pinned?: boolean;
}

interface GhostItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'>, ItemBaseProps {
  children: ReactNode;
}

export function GhostItem({ id, zone, weight, pinned, children, style, ...rest }: GhostItemProps) {
  useRegisterNode(id, zone, { weight, pinned });
  const engine = useGhostEngine();
  const score = useGhostScore(id);
  const hoverStart = useRef<number | null>(null);

  const onMouseEnter = useCallback(() => {
    hoverStart.current = performance.now();
    engine.record('hover', id, zone);
  }, [engine, id, zone]);

  const onMouseLeave = useCallback(() => {
    if (hoverStart.current != null) {
      const ms = performance.now() - hoverStart.current;
      hoverStart.current = null;
      if (ms > 120) engine.record('dwell', id, zone, { ms });
    }
  }, [engine, id, zone]);

  const onClick = useCallback(() => engine.record('click', id, zone), [engine, id, zone]);

  const merged: CSSProperties = {
    position: 'relative',
    transition: 'box-shadow 240ms ease',
    boxShadow: pinned ? undefined : `0 0 ${24 * score}px ${4 * score}px rgba(120,120,255,${0.18 * score})`,
    ...style,
  };

  return (
    <div
      data-ghost-id={id}
      data-ghost-score={score.toFixed(2)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={merged}
      {...rest}
    >
      {children}
    </div>
  );
}

interface GhostButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'id'>,
    ItemBaseProps {}

export function GhostButton({
  id,
  zone,
  weight,
  pinned,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onPointerDown,
  style,
  children,
  ...rest
}: GhostButtonProps) {
  useRegisterNode(id, zone, { weight, pinned });
  const engine = useGhostEngine();
  const score = useGhostScore(id);
  const hitbox = useGhostHitbox(id);
  const ref = useRef<HTMLButtonElement | null>(null);
  const hoverStart = useRef<number | null>(null);

  const handleEnter = (e: MouseEvent<HTMLButtonElement>) => {
    hoverStart.current = performance.now();
    engine.record('hover', id, zone);
    onMouseEnter?.(e);
  };
  const handleLeave = (e: MouseEvent<HTMLButtonElement>) => {
    if (hoverStart.current != null) {
      const ms = performance.now() - hoverStart.current;
      hoverStart.current = null;
      if (ms > 120) engine.record('dwell', id, zone, { ms });
    }
    onMouseLeave?.(e);
  };
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    engine.record('click', id, zone);
    onClick?.(e);
  };

  const expanded: CSSProperties = {
    position: 'relative',
    boxShadow: pinned
      ? undefined
      : `0 0 ${28 * score}px ${5 * score}px rgba(120,120,255,${0.22 * score})`,
    transition: 'box-shadow 240ms ease, transform 240ms ease',
    ...style,
  };

  return (
    <button
      ref={ref}
      data-ghost-id={id}
      data-ghost-score={score.toFixed(2)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      onPointerDown={(e) => {
        // detect near-misses on the surrounding ghost-padding overlay (handled below)
        onPointerDown?.(e);
      }}
      style={expanded}
      {...rest}
    >
      {children}
      {!pinned && (hitbox.top || hitbox.right || hitbox.bottom || hitbox.left) ? (
        <span
          aria-hidden
          onPointerDown={(e) => {
            const r = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            engine.record('miss', id, zone, { dx: e.clientX - cx, dy: e.clientY - cy });
            // forward to the button so the click still registers
            (e.currentTarget.previousElementSibling as HTMLElement | null)?.click?.();
          }}
          style={{
            position: 'absolute',
            top: -hitbox.top,
            right: -hitbox.right,
            bottom: -hitbox.bottom,
            left: -hitbox.left,
            pointerEvents: 'auto',
            zIndex: -1,
          }}
        />
      ) : null}
    </button>
  );
}

export const Ghost = {
  Slot: GhostSlot,
  Item: GhostItem,
  Button: GhostButton,
};
