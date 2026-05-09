import React, {
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
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
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

interface GhostComboboxCtx {
  zone: ZoneId;
  query: string;
  open: boolean;
  activeId: GhostId | null;
  setQuery: (q: string) => void;
  setOpen: (v: boolean) => void;
  setActiveId: (id: GhostId | null) => void;
  select: (id: GhostId) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  wrapRef: React.RefObject<HTMLDivElement | null>;
}

const GhostComboboxContext = createContext<GhostComboboxCtx | null>(null);

function useComboCtx(): GhostComboboxCtx {
  const ctx = useContext(GhostComboboxContext);
  if (!ctx) throw new Error('[ghost-ui] GhostCombobox.* must be used inside <GhostCombobox>');
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface GhostComboboxProps {
  zone: ZoneId;
  /** Called when the user selects an option — receives (id, displayValue). */
  onSelect?: (id: GhostId, value: string) => void;
  /** Controlled input value. Paired with onQueryChange for full control. */
  value?: string;
  defaultValue?: string;
  onQueryChange?: (q: string) => void;
  children: ReactNode;
  className?: string;
}

export function GhostCombobox({
  zone,
  onSelect,
  value: valueProp,
  defaultValue = '',
  onQueryChange,
  children,
  className,
}: GhostComboboxProps) {
  const [internalQuery, setInternalQuery] = useState(defaultValue);
  const query = valueProp ?? internalQuery;
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<GhostId | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const engine = useGhostEngine();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (listRef.current?.contains(t) || wrapRef.current?.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open]);

  const setQuery = useCallback(
    (q: string) => {
      if (valueProp === undefined) setInternalQuery(q);
      onQueryChange?.(q);
      setOpen(q.length > 0);
      setActiveId(null);
    },
    [valueProp, onQueryChange],
  );

  const select = useCallback(
    (id: GhostId) => {
      engine.record('click', id, zone);
      // Read display value from the rendered option element
      const optionEl = listRef.current?.querySelector<HTMLElement>(`[data-ghost-option-id="${id}"]`);
      const displayValue = optionEl?.dataset.ghostOptionValue ?? id;
      if (valueProp === undefined) setInternalQuery(displayValue);
      onQueryChange?.(displayValue);
      onSelect?.(id, displayValue);
      setOpen(false);
      setActiveId(null);
      inputRef.current?.focus();
    },
    [engine, zone, valueProp, onQueryChange, onSelect],
  );

  const ctx: GhostComboboxCtx = {
    zone, query, open, activeId,
    setQuery, setOpen, setActiveId, select,
    inputRef, listRef, wrapRef,
  };

  return (
    <GhostComboboxContext.Provider value={ctx}>
      <div ref={wrapRef} className={className} style={{ position: 'relative' }}>
        {children}
      </div>
    </GhostComboboxContext.Provider>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

export interface GhostComboboxInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {}

export function GhostComboboxInput({ onKeyDown, onFocus, ...rest }: GhostComboboxInputProps) {
  const { zone, query, open, activeId, setQuery, setOpen, setActiveId, select, inputRef, listRef } = useComboCtx();
  const engine = useGhostEngine();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    engine.record('hover', `${zone}:input`, zone);
    if (query.length > 0) setOpen(true);
    onFocus?.(e);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>('[data-ghost-option-id]:not([aria-disabled="true"])') ?? [],
    );
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const idx = items.findIndex(el => el.dataset.ghostOptionId === activeId);
      const next = items[(idx + 1) % items.length];
      if (next?.dataset.ghostOptionId) setActiveId(next.dataset.ghostOptionId);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const idx = items.findIndex(el => el.dataset.ghostOptionId === activeId);
      const prev = items[(idx - 1 + items.length) % items.length];
      if (prev?.dataset.ghostOptionId) setActiveId(prev.dataset.ghostOptionId);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeId) select(activeId);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      setActiveId(null);
    }
    onKeyDown?.(e);
  }

  return (
    <input
      ref={inputRef}
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={open}
      aria-activedescendant={activeId ? `ghost-option-${activeId}` : undefined}
      value={query}
      onChange={handleChange}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      autoComplete="off"
      {...rest}
    />
  );
}

// ─── List ─────────────────────────────────────────────────────────────────────

export interface GhostComboboxListProps {
  children: ReactNode;
  maxHeight?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function GhostComboboxList({ children, maxHeight = 280, style, ...rest }: GhostComboboxListProps) {
  const { zone, open, listRef, wrapRef } = useComboCtx();
  const order = useGhostOrder(zone);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const [placed, setPlaced] = useState(false);

  // Sort options by Ghost score — most-picked options float to the top
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

  useLayoutEffect(() => {
    if (!open || !wrapRef.current) { setPlaced(false); return; }
    const r = wrapRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const top = spaceBelow >= maxHeight + 8
      ? r.bottom + window.scrollY + 4
      : r.top + window.scrollY - maxHeight - 4;
    setPos({ top, left: r.left + window.scrollX, width: r.width });
    setPlaced(true);
  }, [open, maxHeight, wrapRef]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && placed && (
        <motion.div
          ref={listRef}
          role="listbox"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4, transition: { duration: 0.1 } }}
          transition={{ type: 'spring', stiffness: 500, damping: 36 }}
          style={{
            position: 'absolute',
            top: pos.top,
            left: pos.left,
            width: pos.width,
            zIndex: 99998,
            maxHeight,
            overflowY: 'auto',
            ...style,
          }}
          {...rest}
        >
          {ordered}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ─── Option ───────────────────────────────────────────────────────────────────

export interface GhostComboboxOptionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  id: GhostId;
  /** String inserted into the input when selected. Defaults to id. */
  value?: string;
  disabled?: boolean;
  weight?: number;
  children: ReactNode;
}

export function GhostComboboxOption({
  id,
  value,
  disabled,
  weight,
  onClick,
  onMouseEnter,
  style,
  children,
  ...rest
}: GhostComboboxOptionProps) {
  const { zone, activeId, setActiveId, select } = useComboCtx();
  useRegisterNode(id, zone, { weight });
  const score = useGhostScore(id);
  const engine = useGhostEngine();
  const hoverStart = useRef<number | null>(null);
  const isActive = activeId === id;

  function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
    setActiveId(id);
    hoverStart.current = performance.now();
    engine.record('hover', id, zone);
    onMouseEnter?.(e);
  }

  function handleMouseLeave() {
    if (hoverStart.current != null) {
      const ms = performance.now() - hoverStart.current;
      hoverStart.current = null;
      if (ms > 120) engine.record('dwell', id, zone, { ms });
    }
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    select(id);
    onClick?.(e);
  }

  return (
    <div
      id={`ghost-option-${id}`}
      role="option"
      aria-selected={isActive}
      aria-disabled={disabled ?? undefined}
      data-ghost-option-id={id}
      data-ghost-option-value={value ?? id}
      data-ghost-score={score.toFixed(2)}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: disabled ? 'default' : 'pointer',
        boxShadow: score > 0.1
          ? `inset 2px 0 0 rgba(139,141,248,${score * 0.7})`
          : undefined,
        transition: 'box-shadow 240ms ease, background 120ms ease',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

export interface GhostComboboxEmptyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function GhostComboboxEmpty({ children = 'No results', ...rest }: GhostComboboxEmptyProps) {
  return (
    <div role="status" aria-live="polite" {...rest}>
      {children}
    </div>
  );
}

// ─── Compound ─────────────────────────────────────────────────────────────────

GhostCombobox.Input = GhostComboboxInput;
GhostCombobox.List = GhostComboboxList;
GhostCombobox.Option = GhostComboboxOption;
GhostCombobox.Empty = GhostComboboxEmpty;
