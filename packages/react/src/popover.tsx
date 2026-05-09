import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import type { GhostId, ZoneId } from '@ghost-ui/core';
import { useGhostEngine } from './context.js';
import { useGhostScore, useRegisterNode } from './hooks.js';

// ─── Context ──────────────────────────────────────────────────────────────────

interface GhostPopoverCtx {
  zone: ZoneId;
  id: GhostId;
  open: boolean;
  setOpen: (v: boolean) => void;
  placement: 'top' | 'bottom' | 'left' | 'right';
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const GhostPopoverContext = createContext<GhostPopoverCtx | null>(null);

function usePopoverCtx(): GhostPopoverCtx {
  const ctx = useContext(GhostPopoverContext);
  if (!ctx) throw new Error('[ghost-ui] GhostPopover.* must be rendered inside <GhostPopover>');
  return ctx;
}

// ─── GhostPopover ─────────────────────────────────────────────────────────────

export interface GhostPopoverProps {
  zone: ZoneId;
  id: GhostId;
  children: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export function GhostPopover({ zone, id, children, placement = 'bottom' }: GhostPopoverProps) {
  useRegisterNode(id, zone);
  const [open, setOpenRaw] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const setOpen = useCallback((v: boolean) => setOpenRaw(v), []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (contentRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open, setOpen]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  return (
    <GhostPopoverContext.Provider value={{ zone, id, open, setOpen, placement, triggerRef, contentRef }}>
      {children}
    </GhostPopoverContext.Provider>
  );
}

// ─── GhostPopoverTrigger ──────────────────────────────────────────────────────

export interface GhostPopoverTriggerProps {
  children: ReactElement;
  asChild?: boolean;
}

export function GhostPopoverTrigger({ children }: GhostPopoverTriggerProps) {
  const { zone, id, open, setOpen, triggerRef } = usePopoverCtx();
  const engine = useGhostEngine();
  const score = useGhostScore(id);

  const scoreGlow = score > 0
    ? `0 0 ${28 * score}px ${5 * score}px rgba(120,120,255,${0.22 * score})`
    : undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return cloneElement(children as ReactElement<any>, {
    ref: triggerRef,
    'aria-expanded': open,
    'aria-haspopup': 'dialog',
    'data-ghost-id': id,
    'data-ghost-score': score.toFixed(2),
    style: {
      ...(children.props as { style?: React.CSSProperties }).style,
      boxShadow: scoreGlow,
      transition: 'box-shadow 240ms ease',
    },
    onClick: (e: React.MouseEvent) => {
      (children.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e);
      engine.record('click', id, zone);
      setOpen(!open);
    },
  });
}

// ─── GhostPopoverContent ──────────────────────────────────────────────────────

export interface GhostPopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  offset?: number;
}

export function GhostPopoverContent({ children, offset = 8, style, ...rest }: GhostPopoverContentProps) {
  const { open, placement, triggerRef, contentRef } = usePopoverCtx();
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [placed, setPlaced] = useState(false);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !contentRef.current) {
      setPlaced(false);
      return;
    }

    const trigger = triggerRef.current.getBoundingClientRect();
    const content = contentRef.current.getBoundingClientRect();
    const vW = window.innerWidth;
    const vH = window.innerHeight;

    let resolvedPlacement = placement;

    if (placement === 'bottom' && trigger.bottom + content.height + offset > vH - 8 && trigger.top > content.height + offset + 8) {
      resolvedPlacement = 'top';
    } else if (placement === 'top' && trigger.top - content.height - offset < 8 && trigger.bottom + content.height + offset < vH - 8) {
      resolvedPlacement = 'bottom';
    } else if (placement === 'right' && trigger.right + content.width + offset > vW - 8 && trigger.left > content.width + offset + 8) {
      resolvedPlacement = 'left';
    } else if (placement === 'left' && trigger.left - content.width - offset < 8 && trigger.right + content.width + offset < vW - 8) {
      resolvedPlacement = 'right';
    }

    let top = 0;
    let left = 0;

    switch (resolvedPlacement) {
      case 'bottom':
        top = trigger.bottom + offset;
        left = trigger.left + trigger.width / 2 - content.width / 2;
        break;
      case 'top':
        top = trigger.top - content.height - offset;
        left = trigger.left + trigger.width / 2 - content.width / 2;
        break;
      case 'left':
        top = trigger.top + trigger.height / 2 - content.height / 2;
        left = trigger.left - content.width - offset;
        break;
      case 'right':
        top = trigger.top + trigger.height / 2 - content.height / 2;
        left = trigger.right + offset;
        break;
    }

    top = Math.max(8, Math.min(top, vH - content.height - 8));
    left = Math.max(8, Math.min(left, vW - content.width - 8));

    setPos({ top, left });
    setPlaced(true);
  }, [open, placement, offset, triggerRef, contentRef]);

  const initialY = placement === 'bottom' ? -4 : placement === 'top' ? 4 : 0;
  const initialX = placement === 'right' ? -4 : placement === 'left' ? 4 : 0;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={contentRef}
          role="dialog"
          initial={{ opacity: 0, scale: 0.95, y: initialY, x: initialX }}
          animate={{ opacity: placed ? 1 : 0, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: initialY, x: initialX }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={(rest as { className?: string }).className}
          data-ghost-popover=""
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            zIndex: 9999,
            ...style,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ─── Compound ─────────────────────────────────────────────────────────────────

GhostPopover.Trigger = GhostPopoverTrigger;
GhostPopover.Content = GhostPopoverContent;
