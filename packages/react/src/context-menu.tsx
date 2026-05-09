import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
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
import { useGhostOrder, useGhostScore, useRegisterNode } from './hooks.js';

// ─── Context ──────────────────────────────────────────────────────────────────

interface GhostContextMenuCtx {
  zone: ZoneId;
  open: boolean;
  pos: { x: number; y: number };
  snapOrder: GhostId[];
  openAt: (x: number, y: number, order: GhostId[]) => void;
  setOpen: (v: boolean) => void;
  close: () => void;
  recordItem: (id: GhostId) => void;
}

const GhostContextMenuContext = createContext<GhostContextMenuCtx | null>(null);

function useContextMenuCtx(): GhostContextMenuCtx {
  const ctx = useContext(GhostContextMenuContext);
  if (!ctx) throw new Error('[ghost-ui] GhostContextMenu.* must be rendered inside <GhostContextMenu>');
  return ctx;
}

// ─── GhostContextMenu ─────────────────────────────────────────────────────────

export interface GhostContextMenuProps {
  zone: ZoneId;
  children: ReactNode;
  className?: string;
}

export function GhostContextMenu({ zone, children, className }: GhostContextMenuProps) {
  const [open, setOpenRaw] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [snapOrder, setSnapOrder] = useState<GhostId[]>([]);
  const liveOrder = useGhostOrder(zone);
  const engine = useGhostEngine();
  const contentRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpenRaw(false), []);
  const setOpen = useCallback((v: boolean) => setOpenRaw(v), []);

  const openAt = useCallback((x: number, y: number, order: GhostId[]) => {
    setPos({ x, y });
    setSnapOrder(order);
    setOpenRaw(true);
  }, []);

  const recordItem = useCallback(
    (id: GhostId) => {
      engine.record('click', id, zone);
      close();
    },
    [engine, zone, close],
  );

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (contentRef.current?.contains(e.target as Node)) return;
      close();
    }
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open, close]);

  // Expose contentRef on a stable object so GhostContextMenuContent can attach its ref
  const contentRefHolder = useRef(contentRef);

  const ctx: GhostContextMenuCtx = useMemo(
    () => ({ zone, open, pos, snapOrder, openAt, setOpen, close, recordItem }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [zone, open, pos, snapOrder, openAt, setOpen, close, recordItem],
  );

  return (
    <GhostContextMenuContext.Provider value={ctx}>
      <_GhostContextMenuContentRefContext.Provider value={contentRefHolder.current}>
        <div className={className}>{children}</div>
      </_GhostContextMenuContentRefContext.Provider>
    </GhostContextMenuContext.Provider>
  );
}

// Internal context to share the content ref between root and Content component
const _GhostContextMenuContentRefContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

// ─── GhostContextMenuTrigger ──────────────────────────────────────────────────

export interface GhostContextMenuTriggerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GhostContextMenuTrigger({
  children,
  onContextMenu,
  className,
  ...rest
}: GhostContextMenuTriggerProps) {
  const { zone, openAt } = useContextMenuCtx();
  const liveOrder = useGhostOrder(zone);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      onContextMenu?.(e);
      openAt(e.clientX, e.clientY, [...liveOrder]);
    },
    [onContextMenu, openAt, liveOrder],
  );

  return (
    <div
      data-ghost-context-trigger=""
      onContextMenu={handleContextMenu}
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
}

// ─── GhostContextMenuContent ──────────────────────────────────────────────────

export interface GhostContextMenuContentProps {
  children: ReactNode;
  className?: string;
}

export function GhostContextMenuContent({ children, className }: GhostContextMenuContentProps) {
  const { open, pos, snapOrder, close } = useContextMenuCtx();
  const sharedRef = useContext(_GhostContextMenuContentRefContext);
  const ownRef = useRef<HTMLDivElement | null>(null);
  const [adjustedPos, setAdjustedPos] = useState({ x: pos.x, y: pos.y });
  const [visible, setVisible] = useState(false);

  // Attach the own ref to the shared ref holder so the root can detect outside clicks
  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      ownRef.current = el;
      if (sharedRef) sharedRef.current = el;
    },
    [sharedRef],
  );

  useLayoutEffect(() => {
    if (!open) { setVisible(false); return; }
    setAdjustedPos({ x: pos.x, y: pos.y });
    setVisible(false);
  }, [open, pos]);

  useLayoutEffect(() => {
    if (!open || !ownRef.current) return;
    const rect = ownRef.current.getBoundingClientRect();
    const vW = window.innerWidth;
    const vH = window.innerHeight;
    let x = pos.x;
    let y = pos.y;
    if (x + rect.width > vW - 8) x = pos.x - rect.width;
    if (y + rect.height > vH - 8) y = pos.y - rect.height;
    setAdjustedPos({ x: Math.max(8, x), y: Math.max(8, y) });
    setVisible(true);
  }, [open, pos]);

  const sorted = useMemo(() => {
    const arr = Children.toArray(children).filter(isValidElement) as ReactElement[];
    if (snapOrder.length === 0) return arr;
    const indexById = new Map(snapOrder.map((id, i) => [id, i]));
    return [...arr].sort((a, b) => {
      const aid = (a.props as { id?: string }).id ?? '';
      const bid = (b.props as { id?: string }).id ?? '';
      return (indexById.get(aid) ?? Infinity) - (indexById.get(bid) ?? Infinity);
    });
  }, [children, snapOrder]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const el = ownRef.current;
      if (!el) return;
      const items = Array.from(
        el.querySelectorAll<HTMLElement>('[data-ghost-context-item]:not([aria-disabled="true"])'),
      );
      const idx = items.indexOf(document.activeElement as HTMLElement);
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          items[(idx + 1) % items.length]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          items[(idx - 1 + items.length) % items.length]?.focus();
          break;
        case 'Home':
          e.preventDefault();
          items[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          items[items.length - 1]?.focus();
          break;
        case 'Escape':
          e.preventDefault();
          close();
          break;
      }
    },
    [close],
  );

  useEffect(() => {
    if (!open || !visible || !ownRef.current) return;
    const first = ownRef.current.querySelector<HTMLElement>(
      '[data-ghost-context-item]:not([aria-disabled="true"])',
    );
    first?.focus();
  }, [open, visible]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={setRef}
          role="menu"
          aria-orientation="vertical"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: visible ? 1 : 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.1 } }}
          transition={{ type: 'spring', stiffness: 500, damping: 36 }}
          onKeyDown={handleKeyDown}
          style={{
            position: 'fixed',
            top: adjustedPos.y,
            left: adjustedPos.x,
            zIndex: 9999,
            outline: 'none',
          }}
          className={`rounded-xl border border-white/[0.07] bg-[#0d0d10] shadow-2xl shadow-black/80 py-1.5 min-w-[180px] overflow-hidden backdrop-blur-sm ${className ?? ''}`}
        >
          {sorted}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ─── GhostContextMenuItem ─────────────────────────────────────────────────────

export interface GhostContextMenuItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  id: GhostId;
  disabled?: boolean;
  destructive?: boolean;
  children: ReactNode;
}

export function GhostContextMenuItem({
  id,
  disabled = false,
  destructive = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onKeyDown,
  children,
  className,
  ...rest
}: GhostContextMenuItemProps) {
  const { zone, recordItem } = useContextMenuCtx();
  useRegisterNode(id, zone);
  const score = useGhostScore(id);
  const engine = useGhostEngine();
  const hoverStart = useRef<number | null>(null);

  const handleSelect = useCallback(() => {
    if (disabled) return;
    recordItem(id);
  }, [disabled, recordItem, id]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      handleSelect();
    },
    [onClick, handleSelect],
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseEnter?.(e);
      if (disabled) return;
      hoverStart.current = performance.now();
      engine.record('hover', id, zone);
    },
    [onMouseEnter, disabled, engine, id, zone],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(e);
      if (hoverStart.current != null) {
        const ms = performance.now() - hoverStart.current;
        hoverStart.current = null;
        if (ms > 120 && !disabled) engine.record('dwell', id, zone, { ms });
      }
    },
    [onMouseLeave, disabled, engine, id, zone],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect();
      }
    },
    [onKeyDown, handleSelect],
  );

  return (
    <div
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      data-ghost-id={id}
      data-ghost-context-item=""
      data-ghost-score={score.toFixed(2)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      style={{
        cursor: disabled ? 'default' : 'pointer',
        boxShadow: score > 0.1 ? `inset 2px 0 0 rgba(139,141,248,${score * 0.7})` : undefined,
        transition: 'box-shadow 240ms ease',
      }}
      className={`flex items-center gap-2.5 px-3 py-2.5 text-[12.5px] hover:bg-white/[0.06] hover:text-white/95 outline-none select-none transition-colors duration-100 focus:bg-white/[0.08]${destructive ? ' text-red-400' : ' text-white/75'}${disabled ? ' opacity-40 cursor-default' : ''} ${className ?? ''}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

// ─── GhostContextMenuSeparator ────────────────────────────────────────────────

export interface GhostContextMenuSeparatorProps extends HTMLAttributes<HTMLHRElement> {}

export function GhostContextMenuSeparator({ className, ...rest }: GhostContextMenuSeparatorProps) {
  return <hr role="separator" className={`border-t border-white/[0.06] my-1.5 mx-0 ${className ?? ''}`.trim()} {...rest} />;
}

// ─── Compound ─────────────────────────────────────────────────────────────────

GhostContextMenu.Trigger = GhostContextMenuTrigger;
GhostContextMenu.Content = GhostContextMenuContent;
GhostContextMenu.Item = GhostContextMenuItem;
GhostContextMenu.Separator = GhostContextMenuSeparator;
