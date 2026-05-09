import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { LayoutGroup, motion } from 'motion/react';
import type { GhostId, ZoneId } from '@ghost-ui/core';
import { useGhostEngine } from './context.js';
import { useGhostOrder, useRegisterNode } from './hooks.js';

// ─── Internal context ─────────────────────────────────────────────────────────

interface GhostTabCtx {
  zone: ZoneId;
  active: GhostId;
  setActive: (id: GhostId) => void;
}

const GhostTabContext = createContext<GhostTabCtx | null>(null);

function useTabCtx(): GhostTabCtx {
  const ctx = useContext(GhostTabContext);
  if (!ctx) throw new Error('[ghost-ui] GhostTab.* must be rendered inside <GhostTab>');
  return ctx;
}

// ─── GhostTab (root) ─────────────────────────────────────────────────────────

export interface GhostTabProps {
  zone: ZoneId;
  /** Initially selected tab id. Defaults to the first child's id. */
  defaultTab?: GhostId;
  /** Controlled active tab. When provided, `onTabChange` must update it. */
  activeTab?: GhostId;
  onTabChange?: (id: GhostId) => void;
  children: ReactNode;
}

export function GhostTab({
  zone,
  defaultTab,
  activeTab: activeTabProp,
  onTabChange,
  children,
}: GhostTabProps) {
  const [internalActive, setInternalActive] = useState<GhostId>(defaultTab ?? '');
  const active = activeTabProp ?? internalActive;

  const setActive = useCallback(
    (id: GhostId) => {
      if (!activeTabProp) setInternalActive(id);
      onTabChange?.(id);
    },
    [activeTabProp, onTabChange],
  );

  return (
    <GhostTabContext.Provider value={{ zone, active, setActive }}>
      {children}
    </GhostTabContext.Provider>
  );
}

// ─── GhostTabList ─────────────────────────────────────────────────────────────

export interface GhostTabListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GhostTabList({ children, ...rest }: GhostTabListProps) {
  const { zone } = useTabCtx();
  const order = useGhostOrder(zone);
  const listRef = useRef<HTMLDivElement>(null);

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

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])') ?? [],
    );
    const idx = items.findIndex((el) => el === document.activeElement);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  return (
    <LayoutGroup id={`ghost-tabs-${zone}`}>
      <div ref={listRef} role="tablist" onKeyDown={onKeyDown} {...rest}>
        {ordered.map((child) => {
          const id = (child.props as { id?: string }).id ?? '';
          return (
            <motion.div
              key={id}
              layout="position"
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              style={{ display: 'contents' }}
            >
              {child}
            </motion.div>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

// ─── GhostTabItem ─────────────────────────────────────────────────────────────

export interface GhostTabItemProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'id'> {
  id: GhostId;
  /** Optional render slot for an icon before the label */
  icon?: ReactNode;
  /** Optional badge count */
  badge?: number | string;
  weight?: number;
  pinned?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

export function GhostTabItem({
  id,
  icon,
  badge,
  weight,
  pinned,
  disabled,
  onClick,
  children,
  ...rest
}: GhostTabItemProps) {
  const { zone, active, setActive } = useTabCtx();
  useRegisterNode(id, zone, { weight, pinned });
  const engine = useGhostEngine();
  const hoverStart = useRef<number | null>(null);
  const isActive = active === id;

  // If no defaultTab was provided, activate the first mounted tab
  useEffect(() => {
    if (!active) setActive(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (disabled) return;
    engine.record('click', id, zone);
    setActive(id);
    onClick?.(e);
  }

  function handleMouseEnter() {
    hoverStart.current = performance.now();
    engine.record('hover', id, zone);
  }

  function handleMouseLeave() {
    if (hoverStart.current != null) {
      const ms = performance.now() - hoverStart.current;
      hoverStart.current = null;
      if (ms > 120) engine.record('dwell', id, zone, { ms });
    }
  }

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`ghost-tabpanel-${id}`}
      id={`ghost-tab-${id}`}
      data-ghost-id={id}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {icon && <span aria-hidden>{icon}</span>}
      {children}
      {badge != null && <span aria-label={`${badge} items`}>{badge}</span>}
    </button>
  );
}

// ─── GhostTabPanel ────────────────────────────────────────────────────────────

export interface GhostTabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Must match the id of the corresponding GhostTabItem */
  for: GhostId;
  children: ReactNode;
}

export function GhostTabPanel({ for: forId, children, ...rest }: GhostTabPanelProps) {
  const { active } = useTabCtx();
  return (
    <div
      role="tabpanel"
      id={`ghost-tabpanel-${forId}`}
      aria-labelledby={`ghost-tab-${forId}`}
      hidden={active !== forId}
      {...rest}
    >
      {children}
    </div>
  );
}

// ─── Compound ─────────────────────────────────────────────────────────────────

GhostTab.List = GhostTabList;
GhostTab.Item = GhostTabItem;
GhostTab.Panel = GhostTabPanel;
