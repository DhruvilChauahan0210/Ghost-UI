import type { GhostId, GravityTier, ZoneId } from '@ghost-ui/core';
import { LayoutGroup, motion } from 'motion/react';
import './shake.js';
import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';

import { useGhostEngine, useGhostHoveredNode, useGhostPlan } from './context.js';
import {
  useGhostArea,
  useGhostFrustration,
  useGhostHitbox,
  useGhostIntent,
  useGhostOrder,
  useGhostScore,
  useRegisterNode,
} from './hooks.js';

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
  onRage?: (id: GhostId) => void;
}

export function GhostItem({ id, zone, weight, pinned, children, style, onRage, ...rest }: GhostItemProps) {
  useRegisterNode(id, zone, { weight, pinned });
  const engine = useGhostEngine();
  const [, setHoveredNodeId] = useGhostHoveredNode();
  const score = useGhostScore(id);
  const intent = useGhostIntent();
  const { isFrustrated } = useGhostFrustration(id);
  const [shaking, setShaking] = useState(false);
  const hoverStart = useRef<number | null>(null);
  const onRageRef = useRef(onRage);
  onRageRef.current = onRage;

  const ghostProbability = intent.find(p => p.id === id)?.probability ?? 0;

  useEffect(() => {
    if (isFrustrated) {
      setShaking(true);
      onRageRef.current?.(id);
      const t = setTimeout(() => setShaking(false), 500);
      return () => clearTimeout(t);
    }
  }, [isFrustrated, id]);

  const onMouseEnter = useCallback(() => {
    hoverStart.current = performance.now();
    engine.record('hover', id, zone);
    setHoveredNodeId(id);
  }, [engine, id, zone, setHoveredNodeId]);

  const onMouseLeave = useCallback(() => {
    if (hoverStart.current != null) {
      const ms = performance.now() - hoverStart.current;
      hoverStart.current = null;
      if (ms > 120) engine.record('dwell', id, zone, { ms });
    }
    setHoveredNodeId(null);
  }, [engine, id, zone, setHoveredNodeId]);

  const onClick = useCallback(() => engine.record('click', id, zone), [engine, id, zone]);

  const scoreGlow = pinned ? undefined : `0 0 ${24 * score}px ${4 * score}px rgba(120,120,255,${0.18 * score})`;
  const intentGlow = ghostProbability > 0.05
    ? `0 0 ${32 * ghostProbability}px ${6 * ghostProbability}px rgba(167,139,250,${0.45 * ghostProbability})`
    : undefined;

  const merged: CSSProperties = {
    position: 'relative',
    transition: 'box-shadow 240ms ease',
    boxShadow: [scoreGlow, intentGlow].filter(Boolean).join(', ') || undefined,
    animation: shaking ? 'ghost-shake 0.4s ease' : ghostProbability > 0.2 ? 'ghost-intent-pulse 1.5s ease infinite' : undefined,
    ...style,
  };

  return (
    <div
      data-ghost-id={id}
      data-ghost-score={score.toFixed(2)}
      data-ghost-frustrated={isFrustrated ? 'true' : undefined}
      data-ghost-intent={ghostProbability > 0.05 ? ghostProbability.toFixed(2) : undefined}
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
    ItemBaseProps {
  onRage?: (id: GhostId) => void;
}

export function GhostButton({
  id,
  zone,
  weight,
  pinned,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onPointerDown,
  onRage,
  style,
  children,
  ...rest
}: GhostButtonProps) {
  useRegisterNode(id, zone, { weight, pinned });
  const engine = useGhostEngine();
  const [, setHoveredNodeId] = useGhostHoveredNode();
  const score = useGhostScore(id);
  const hitbox = useGhostHitbox(id);
  const intent = useGhostIntent();
  const { isFrustrated } = useGhostFrustration(id);
  const [shaking, setShaking] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);
  const hoverStart = useRef<number | null>(null);
  const onRageRef = useRef(onRage);
  onRageRef.current = onRage;

  const ghostProbability = intent.find(p => p.id === id)?.probability ?? 0;

  useEffect(() => {
    if (isFrustrated) {
      setShaking(true);
      onRageRef.current?.(id);
      const t = setTimeout(() => setShaking(false), 500);
      return () => clearTimeout(t);
    }
  }, [isFrustrated, id]);

  const handleEnter = (e: MouseEvent<HTMLButtonElement>) => {
    hoverStart.current = performance.now();
    engine.record('hover', id, zone);
    setHoveredNodeId(id);
    onMouseEnter?.(e);
  };
  const handleLeave = (e: MouseEvent<HTMLButtonElement>) => {
    if (hoverStart.current != null) {
      const ms = performance.now() - hoverStart.current;
      hoverStart.current = null;
      if (ms > 120) engine.record('dwell', id, zone, { ms });
    }
    setHoveredNodeId(null);
    onMouseLeave?.(e);
  };
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    engine.record('click', id, zone);
    onClick?.(e);
  };

  const scoreGlow = pinned ? undefined : `0 0 ${28 * score}px ${5 * score}px rgba(120,120,255,${0.22 * score})`;
  const intentGlow = ghostProbability > 0.05
    ? `0 0 ${36 * ghostProbability}px ${7 * ghostProbability}px rgba(167,139,250,${0.5 * ghostProbability})`
    : undefined;

  const expanded: CSSProperties = {
    position: 'relative',
    boxShadow: [scoreGlow, intentGlow].filter(Boolean).join(', ') || undefined,
    transition: 'box-shadow 240ms ease, transform 240ms ease',
    animation: shaking ? 'ghost-shake 0.4s ease' : ghostProbability > 0.2 ? 'ghost-intent-pulse 1.5s ease infinite' : undefined,
    ...style,
  };

  return (
    <button
      ref={ref}
      data-ghost-id={id}
      data-ghost-score={score.toFixed(2)}
      data-ghost-frustrated={isFrustrated ? 'true' : undefined}
      data-ghost-intent={ghostProbability > 0.05 ? ghostProbability.toFixed(2) : undefined}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      onPointerDown={(e) => { onPointerDown?.(e); }}
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

interface GhostGridProps extends HTMLAttributes<HTMLDivElement> {
  zone: ZoneId;
  children: ReactNode;
  /**
   * CSS `grid-template-areas` string. Defaults to a two-column layout where
   * primary spans two rows and secondary/tertiary each occupy one row.
   */
  gridTemplateAreas?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gap?: string | number;
}

const TIER_COLORS: Record<GravityTier, string> = {
  primary: 'rgba(167,139,250,0.12)',
  secondary: 'rgba(96,165,250,0.08)',
  tertiary: 'transparent',
};

/**
 * CSS Grid container that automatically promotes high-scored nodes to larger areas.
 * Children must be `<Ghost.Item>` elements (or any element with an `id` prop matching a ghost id).
 */
export function GhostGrid({
  zone: _zone,
  children,
  gridTemplateAreas = '"primary secondary" "primary tertiary"',
  gridTemplateColumns = '2fr 1fr',
  gridTemplateRows,
  gap = '0.75rem',
  style,
  ...rest
}: GhostGridProps) {
  const plan = useGhostPlan();

  const slots = useMemo(() => {
    const arr = Children.toArray(children).filter(isValidElement) as ReactElement<{ id?: string }>[];
    return arr.map((child) => {
      const id = getId(child);
      const tier: GravityTier = (id ? plan.area?.[id] : undefined) ?? 'tertiary';
      return (
        <div
          key={id || undefined}
          data-ghost-grid-tier={tier}
          style={{
            gridArea: tier,
            borderRadius: 8,
            background: TIER_COLORS[tier],
            transition: 'background 400ms ease',
          }}
        >
          {child}
        </div>
      );
    });
  }, [children, plan.area]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateAreas,
        gridTemplateColumns,
        gridTemplateRows,
        gap,
        ...style,
      }}
      {...rest}
    >
      {slots}
    </div>
  );
}

interface GhostCanvasProps extends HTMLAttributes<HTMLDivElement> {
  zone: ZoneId;
  children: ReactNode;
}

/**
 * Absolutely-positioned canvas where each child floats to a position driven by its score.
 * Higher-scored nodes occupy positions closer to the top-left (primary visual zone).
 * Uses Framer Motion springs for smooth transitions.
 * Children must be `<Ghost.Item>` elements (or any element with an `id` prop matching a ghost id).
 */
export function GhostCanvas({ zone: _zone, children, style, ...rest }: GhostCanvasProps) {
  const plan = useGhostPlan();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 600, h: 400 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      if (e) setDims({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const arr = useMemo(
    () => Children.toArray(children).filter(isValidElement) as ReactElement<{ id?: string }>[],
    [children],
  );

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
      {...rest}
    >
      {arr.map((child) => {
        const id = getId(child);
        const pos = (id ? plan.position?.[id] : undefined) ?? { x: 0.5, y: 0.5 };
        return (
          <motion.div
            key={id || undefined}
            data-ghost-canvas-id={id}
            style={{ position: 'absolute', top: 0, left: 0 }}
            animate={{
              x: pos.x * dims.w,
              y: pos.y * dims.h,
            }}
            transition={{ type: 'spring', stiffness: 80, damping: 18, mass: 1 }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}

export const Ghost = {
  Slot: GhostSlot,
  Item: GhostItem,
  Button: GhostButton,
  Grid: GhostGrid,
  Canvas: GhostCanvas,
};
