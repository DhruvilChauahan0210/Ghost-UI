import {
  Children,
  cloneElement,
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
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import type { GhostId, ZoneId } from '@ghost-ui/core';
import { useGhostEngine, useGhostHoveredNode } from './context.js';
import { useGhostOrder, useGhostScore, useRegisterNode } from './hooks.js';

// ─── Internal context ─────────────────────────────────────────────────────────

interface GhostMenuCtx {
  zone: ZoneId;
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
}

const GhostMenuContext = createContext<GhostMenuCtx | null>(null);

function useMenuCtx(): GhostMenuCtx {
  const ctx = useContext(GhostMenuContext);
  if (!ctx) throw new Error('[ghost-ui] GhostMenu.* must be rendered inside <GhostMenu>');
  return ctx;
}

// ─── GhostMenu ────────────────────────────────────────────────────────────────

export interface GhostMenuProps {
  /** Zone id — all items in this menu share it. Must be unique per menu. */
  zone: ZoneId;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function GhostMenu({ zone, children, onOpenChange }: GhostMenuProps) {
  const [open, setOpenRaw] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const setOpen = useCallback(
    (v: boolean) => {
      setOpenRaw(v);
      onOpenChange?.(v);
    },
    [onOpenChange],
  );

  // Close when clicking outside both trigger and content
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

  return (
    <GhostMenuContext.Provider value={{ zone, open, setOpen, triggerRef, contentRef }}>
      {children}
    </GhostMenuContext.Provider>
  );
}

// ─── GhostMenu.Trigger ────────────────────────────────────────────────────────

export interface GhostMenuTriggerProps {
  /** Must be a single React element (button, div, etc.) */
  children: ReactElement;
}

export function GhostMenuTrigger({ children }: GhostMenuTriggerProps) {
  const { open, setOpen, triggerRef } = useMenuCtx();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return cloneElement(children as ReactElement<any>, {
    ref: triggerRef,
    'aria-expanded': open,
    'aria-haspopup': 'menu',
    onClick: (e: React.MouseEvent) => {
      (children.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e);
      setOpen(!open);
    },
  });
}

// ─── GhostMenu.Content ────────────────────────────────────────────────────────

export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export interface GhostMenuContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  placement?: MenuPlacement;
}

export function GhostMenuContent({
  placement = 'bottom-start',
  style,
  children,
  ...rest
}: GhostMenuContentProps) {
  const { zone, open, setOpen, triggerRef, contentRef } = useMenuCtx();
  const liveOrder = useGhostOrder(zone);

  // Snapshot the sort order when the menu opens so items don't
  // shuffle while the user is looking at them.
  const [snapOrder, setSnapOrder] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open) {
      setSnapOrder(liveOrder);
      setVisible(false); // hide until positioned
    }
    // liveOrder intentionally excluded — we only snapshot, not track
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Compute position after content renders so we know its actual size
  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !contentRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const content = contentRef.current.getBoundingClientRect();
    const vH = window.innerHeight;
    const vW = window.innerWidth;

    const isEnd = placement.endsWith('end');
    const prefersTop = placement.startsWith('top');

    let top = prefersTop
      ? trigger.top - content.height - 4
      : trigger.bottom + 4;

    let left = isEnd ? trigger.right - content.width : trigger.left;

    // Auto-flip vertically if not enough room
    if (!prefersTop && top + content.height > vH - 8 && trigger.top > content.height + 4) {
      top = trigger.top - content.height - 4;
    }
    if (prefersTop && top < 8 && trigger.bottom + content.height < vH - 8) {
      top = trigger.bottom + 4;
    }

    // Clamp to viewport
    left = Math.max(8, Math.min(left, vW - content.width - 8));
    top = Math.max(8, top);

    setPos({ top, left });
    setVisible(true);
  }, [open, placement, triggerRef, contentRef]);

  // Keyboard navigation — handled at the content level so we intercept
  // before individual items, allowing arrow keys to move between items.
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const el = contentRef.current;
      if (!el) return;
      const items = Array.from(
        el.querySelectorAll<HTMLElement>(
          '[data-ghost-menu-item]:not([aria-disabled="true"])',
        ),
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
          setOpen(false);
          (triggerRef.current as HTMLElement | null)?.focus();
          break;
        case 'Tab':
          // Let tab close the menu but proceed with normal focus movement
          setOpen(false);
          break;
      }
    },
    [contentRef, setOpen, triggerRef],
  );

  // Focus first enabled item when menu opens
  useEffect(() => {
    if (!open || !visible || !contentRef.current) return;
    const first = contentRef.current.querySelector<HTMLElement>(
      '[data-ghost-menu-item]:not([aria-disabled="true"])',
    );
    first?.focus();
  }, [open, visible, contentRef]);

  // Sort children using the snapshotted order
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

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      ref={contentRef}
      role="menu"
      aria-orientation="vertical"
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        zIndex: 9999,
        minWidth: 200,
        outline: 'none',
        opacity: visible ? 1 : 0,
        ...style,
      }}
      {...rest}
    >
      {sorted}
    </div>,
    document.body,
  );
}

// ─── GhostMenu.Item ───────────────────────────────────────────────────────────

export interface GhostMenuItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id' | 'onSelect'> {
  id: GhostId;
  onSelect?: () => void;
  disabled?: boolean;
  /** Optional icon rendered to the left of the label */
  icon?: ReactNode;
  /** Keyboard shortcut hint, e.g. "⌘K" — display only, not wired */
  shortcut?: string;
  /** 'danger' tints the item red to signal a destructive action */
  variant?: 'default' | 'danger';
}

export function GhostMenuItem({
  id,
  onSelect,
  disabled = false,
  icon,
  shortcut,
  variant = 'default',
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onKeyDown,
  style,
  ...rest
}: GhostMenuItemProps) {
  const { zone, setOpen } = useMenuCtx();
  useRegisterNode(id, zone);
  const engine = useGhostEngine();
  const [, setHoveredNodeId] = useGhostHoveredNode();
  const score = useGhostScore(id);
  const hoverStart = useRef<number | null>(null);

  const handleSelect = useCallback(() => {
    if (disabled) return;
    engine.record('click', id, zone);
    setOpen(false);
    onSelect?.();
  }, [disabled, engine, id, zone, setOpen, onSelect]);

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
      setHoveredNodeId(id);
    },
    [onMouseEnter, disabled, engine, id, zone, setHoveredNodeId],
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(e);
      if (hoverStart.current != null) {
        const ms = performance.now() - hoverStart.current;
        hoverStart.current = null;
        if (ms > 120 && !disabled) engine.record('dwell', id, zone, { ms });
      }
      setHoveredNodeId(null);
    },
    [onMouseLeave, disabled, engine, id, zone, setHoveredNodeId],
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
      data-ghost-menu-item=""
      data-ghost-score={score.toFixed(2)}
      data-ghost-variant={variant}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: disabled ? 'default' : 'pointer', ...style }}
      {...rest}
    >
      {icon !== undefined && (
        <span aria-hidden data-ghost-menu-icon="" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {icon}
        </span>
      )}
      <span data-ghost-menu-label="" style={{ flex: 1, minWidth: 0 }}>
        {children}
      </span>
      {shortcut !== undefined && (
        <span aria-hidden data-ghost-menu-shortcut="" style={{ flexShrink: 0 }}>
          {shortcut}
        </span>
      )}
    </div>
  );
}

// ─── GhostMenu.Separator ──────────────────────────────────────────────────────

export type GhostMenuSeparatorProps = HTMLAttributes<HTMLDivElement>;

export function GhostMenuSeparator({ style, ...rest }: GhostMenuSeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      style={{ height: 1, margin: '4px 0', ...style }}
      {...rest}
    />
  );
}

// ─── Compound component namespace ─────────────────────────────────────────────

GhostMenu.Trigger = GhostMenuTrigger;
GhostMenu.Content = GhostMenuContent;
GhostMenu.Item = GhostMenuItem;
GhostMenu.Separator = GhostMenuSeparator;
