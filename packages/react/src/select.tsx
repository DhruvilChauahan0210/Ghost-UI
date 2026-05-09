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
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import type { GhostId, ZoneId } from '@ghost-ui/core';
import { useGhostEngine } from './context.js';
import { useGhostOrder, useGhostScore, useRegisterNode } from './hooks.js';

// ─── Context ──────────────────────────────────────────────────────────────────

interface GhostSelectCtx {
  zone: ZoneId;
  value: string | null;
  open: boolean;
  activeId: GhostId | null;
  placeholder: string;
  setOpen: (v: boolean) => void;
  setActiveId: (id: GhostId | null) => void;
  select: (id: GhostId, displayValue: string) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
}

const GhostSelectContext = createContext<GhostSelectCtx | null>(null);

function useSelectCtx(): GhostSelectCtx {
  const ctx = useContext(GhostSelectContext);
  if (!ctx) throw new Error('[ghost-ui] GhostSelect.* must be rendered inside <GhostSelect>');
  return ctx;
}

// ─── GhostSelect ──────────────────────────────────────────────────────────────

export interface GhostSelectProps {
  zone: ZoneId;
  value?: string;
  onValueChange?: (id: GhostId, value: string) => void;
  placeholder?: string;
  children: ReactNode;
  className?: string;
}

export function GhostSelect({
  zone,
  value: valueProp,
  onValueChange,
  placeholder = 'Select…',
  children,
  className,
}: GhostSelectProps) {
  const [internalValue, setInternalValue] = useState<string | null>(null);
  const value = valueProp !== undefined ? valueProp : internalValue;
  const [open, setOpenRaw] = useState(false);
  const [activeId, setActiveId] = useState<GhostId | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const engine = useGhostEngine();

  const setOpen = useCallback((v: boolean) => {
    setOpenRaw(v);
    if (!v) setActiveId(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (listRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open, setOpen]);

  const select = useCallback(
    (id: GhostId, displayValue: string) => {
      engine.record('click', id, zone);
      if (valueProp === undefined) setInternalValue(displayValue);
      onValueChange?.(id, displayValue);
      setOpen(false);
    },
    [engine, zone, valueProp, onValueChange, setOpen],
  );

  const ctx: GhostSelectCtx = useMemo(
    () => ({ zone, value, open, activeId, placeholder, setOpen, setActiveId, select, triggerRef, listRef }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [zone, value, open, activeId, placeholder, setOpen, setActiveId, select],
  );

  return (
    <GhostSelectContext.Provider value={ctx}>
      <div className={`relative ${className ?? ''}`}>{children}</div>
    </GhostSelectContext.Provider>
  );
}

// ─── GhostSelectTrigger ───────────────────────────────────────────────────────

export interface GhostSelectTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function GhostSelectTrigger({ children, onClick, className, ...rest }: GhostSelectTriggerProps) {
  const { value, open, placeholder, setOpen, triggerRef } = useSelectCtx();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      setOpen(!open);
    },
    [onClick, open, setOpen],
  );

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={handleClick}
      className={`flex w-full items-center justify-between gap-2 px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-[13px] text-white/80 hover:bg-white/[0.06] hover:text-white/95 hover:border-white/[0.14] transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400/40 cursor-pointer ${className ?? ''}`}
      {...rest}
    >
      <span>{children ?? value ?? placeholder}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={14}
        height={14}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="shrink-0 text-white/30"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

// ─── GhostSelectContent ───────────────────────────────────────────────────────

export interface GhostSelectContentProps {
  children: ReactNode;
  maxHeight?: number;
  className?: string;
}

export function GhostSelectContent({ children, maxHeight = 280, className }: GhostSelectContentProps) {
  const { zone, open, activeId, setOpen, setActiveId, select, triggerRef, listRef } = useSelectCtx();
  const order = useGhostOrder(zone);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const [placed, setPlaced] = useState(false);

  const sorted = useMemo(() => {
    const arr = Children.toArray(children).filter(isValidElement) as ReactElement<{ id?: string }>[];
    if (order.length === 0) return arr;
    const indexById = new Map(order.map((id, i) => [id, i]));
    return [...arr].sort((a, b) => {
      const ai = indexById.get((a.props as { id?: string }).id ?? '') ?? Number.POSITIVE_INFINITY;
      const bi = indexById.get((b.props as { id?: string }).id ?? '') ?? Number.POSITIVE_INFINITY;
      return ai - bi;
    });
  }, [children, order]);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) { setPlaced(false); return; }
    const r = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const top = spaceBelow >= maxHeight + 8
      ? r.bottom + window.scrollY + 4
      : r.top + window.scrollY - maxHeight - 4;
    setPos({ top, left: r.left + window.scrollX, width: r.width });
    setPlaced(true);
  }, [open, maxHeight, triggerRef]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const el = listRef.current;
      if (!el) return;
      const items = Array.from(
        el.querySelectorAll<HTMLElement>('[data-ghost-select-option]:not([aria-disabled="true"])'),
      );
      const idx = items.findIndex((item) => item.dataset.ghostSelectOption === activeId);

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const next = items[(idx + 1) % items.length];
          if (next?.dataset.ghostSelectOption) setActiveId(next.dataset.ghostSelectOption);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prev = items[(idx - 1 + items.length) % items.length];
          if (prev?.dataset.ghostSelectOption) setActiveId(prev.dataset.ghostSelectOption);
          break;
        }
        case 'Enter':
          e.preventDefault();
          if (activeId) {
            const optEl = el.querySelector<HTMLElement>(`[data-ghost-select-option="${activeId}"]`);
            const displayValue = optEl?.dataset.ghostSelectValue ?? activeId;
            select(activeId, displayValue);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
          break;
      }
    },
    [activeId, listRef, select, setActiveId, setOpen, triggerRef],
  );

  useEffect(() => {
    if (!open || !placed || !listRef.current) return;
    const first = listRef.current.querySelector<HTMLElement>(
      '[data-ghost-select-option]:not([aria-disabled="true"])',
    );
    first?.focus();
  }, [open, placed, listRef]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && placed && (
        <motion.div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={activeId ? `ghost-select-option-${activeId}` : undefined}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4, transition: { duration: 0.1 } }}
          transition={{ type: 'spring', stiffness: 500, damping: 36 }}
          onKeyDown={handleKeyDown}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: pos.width,
            zIndex: 9999,
            maxHeight,
            overflowY: 'auto',
          }}
          className={`rounded-xl border border-white/[0.07] bg-[#0d0d10] shadow-2xl shadow-black/80 py-1.5 overflow-hidden backdrop-blur-sm ${className ?? ''}`}
        >
          {sorted}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ─── GhostSelectOption ────────────────────────────────────────────────────────

export interface GhostSelectOptionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  id: GhostId;
  value?: string;
  disabled?: boolean;
  children: ReactNode;
}

export function GhostSelectOption({
  id,
  value,
  disabled = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  children,
  ...rest
}: GhostSelectOptionProps) {
  const { zone, activeId, setActiveId, select } = useSelectCtx();
  useRegisterNode(id, zone);
  const score = useGhostScore(id);
  const engine = useGhostEngine();
  const hoverStart = useRef<number | null>(null);
  const displayValue = value ?? id;
  const isActive = activeId === id;

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseEnter?.(e);
      if (disabled) return;
      setActiveId(id);
      hoverStart.current = performance.now();
      engine.record('hover', id, zone);
    },
    [onMouseEnter, disabled, setActiveId, id, engine, zone],
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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      onClick?.(e);
      select(id, displayValue);
    },
    [disabled, onClick, select, id, displayValue],
  );

  return (
    <div
      id={`ghost-select-option-${id}`}
      role="option"
      aria-selected={isActive}
      aria-disabled={disabled || undefined}
      data-ghost-select-option={id}
      data-ghost-select-value={displayValue}
      data-ghost-score={score.toFixed(2)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: disabled ? 'default' : 'pointer',
        boxShadow: score > 0.1 ? `inset 2px 0 0 rgba(139,141,248,${score * 0.7})` : undefined,
        transition: 'box-shadow 240ms ease, background 120ms ease',
      }}
      className={`px-3 py-2 text-[13px] text-white/70 hover:bg-white/[0.06] hover:text-white/95 outline-none select-none transition-colors duration-100${isActive ? ' bg-white/[0.08] text-white/95' : ''}${disabled ? ' opacity-40 cursor-default' : ''}`}
      {...rest}
    >
      {children}
    </div>
  );
}

// ─── Compound ─────────────────────────────────────────────────────────────────

GhostSelect.Trigger = GhostSelectTrigger;
GhostSelect.Content = GhostSelectContent;
GhostSelect.Option = GhostSelectOption;
