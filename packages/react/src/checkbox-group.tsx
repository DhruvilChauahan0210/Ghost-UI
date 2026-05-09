import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { LayoutGroup, motion } from 'motion/react';
import type { GhostId, ZoneId } from '@ghost-ui/core';
import { useGhostEngine } from './context.js';
import { useGhostOrder, useGhostScore, useRegisterNode } from './hooks.js';

// ─── Context ──────────────────────────────────────────────────────────────────

interface GhostCheckboxGroupCtx {
  zone: ZoneId;
  checkedIds: Set<GhostId>;
  toggle: (id: GhostId) => void;
}

const GhostCheckboxGroupContext = createContext<GhostCheckboxGroupCtx | null>(null);

function useCheckboxCtx(): GhostCheckboxGroupCtx {
  const ctx = useContext(GhostCheckboxGroupContext);
  if (!ctx) throw new Error('[ghost-ui] GhostCheckboxItem must be used inside <GhostCheckboxGroup>');
  return ctx;
}

// ─── Item ─────────────────────────────────────────────────────────────────────

export interface GhostCheckboxItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  id: GhostId;
  disabled?: boolean;
  children: ReactNode;
}

export function GhostCheckboxItem({
  id,
  disabled,
  onClick,
  onKeyDown,
  style,
  children,
  ...rest
}: GhostCheckboxItemProps) {
  const { zone, checkedIds, toggle } = useCheckboxCtx();
  useRegisterNode(id, zone);
  const score = useGhostScore(id);
  const isChecked = checkedIds.has(id);

  function handleToggle() {
    if (disabled) return;
    toggle(id);
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    handleToggle();
    onClick?.(e);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
    onKeyDown?.(e);
  }

  return (
    <div
      role="checkbox"
      aria-checked={isChecked}
      aria-disabled={disabled ?? undefined}
      tabIndex={disabled ? -1 : 0}
      data-ghost-id={id}
      data-ghost-score={score.toFixed(2)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      className="flex items-center gap-3 select-none rounded-lg px-2 py-1.5 hover:bg-white/[0.04] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-400/40 focus-visible:outline-none"
      {...rest}
    >
      <div
        className="relative flex items-center justify-center w-[15px] h-[15px] rounded-[4px] shrink-0 border-2"
        style={{
          borderColor: isChecked ? 'rgb(139,141,248)' : 'rgba(255,255,255,0.25)',
          backgroundColor: isChecked ? 'rgb(139,141,248)' : 'transparent',
          boxShadow: score > 0.1
            ? `0 0 0 2px rgba(139,141,248,${score * 0.5})`
            : undefined,
          transition: 'border-color 160ms ease, background-color 160ms ease, box-shadow 240ms ease',
        }}
      >
        <svg
          viewBox="0 0 12 10"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-2.5 h-2 overflow-visible"
          aria-hidden
        >
          <motion.path
            d="M1 5 L4.5 8.5 L11 1"
            stroke="white"
            strokeWidth={2}
            initial={false}
            animate={{ pathLength: isChecked ? 1 : 0, opacity: isChecked ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, duration: 0.2 }}
          />
        </svg>
      </div>
      <span className="text-[13px] text-white/75">{children}</span>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface GhostCheckboxGroupProps {
  zone: ZoneId;
  defaultChecked?: GhostId[];
  checkedIds?: GhostId[];
  onCheckedChange?: (id: GhostId, checked: boolean, allChecked: GhostId[]) => void;
  children: ReactNode;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

function GhostCheckboxGroupInner({
  zone,
  defaultChecked,
  checkedIds: checkedIdsProp,
  onCheckedChange,
  children,
  className,
  orientation = 'vertical',
}: GhostCheckboxGroupProps) {
  const [internalChecked, setInternalChecked] = useState<Set<GhostId>>(
    () => new Set(defaultChecked ?? []),
  );
  const engine = useGhostEngine();
  const order = useGhostOrder(zone);

  const checkedIds = checkedIdsProp !== undefined ? new Set(checkedIdsProp) : internalChecked;

  function toggle(id: GhostId) {
    engine.record('click', id, zone);
    const next = new Set(checkedIds);
    const wasChecked = next.has(id);
    if (wasChecked) next.delete(id);
    else next.add(id);
    if (checkedIdsProp === undefined) setInternalChecked(next);
    onCheckedChange?.(id, !wasChecked, Array.from(next));
  }

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
    <GhostCheckboxGroupContext.Provider value={{ zone, checkedIds, toggle }}>
      <LayoutGroup id={`ghost-checkbox-${zone}`}>
        <div
          role="group"
          className={[
            orientation === 'horizontal' ? 'flex flex-row gap-6' : 'flex flex-col gap-2',
            className ?? '',
          ].join(' ').trim()}
        >
          {ordered.map((child) => {
            const id = (child.props as { id?: string }).id ?? '';
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
    </GhostCheckboxGroupContext.Provider>
  );
}

export function GhostCheckboxGroup(props: GhostCheckboxGroupProps) {
  return <GhostCheckboxGroupInner {...props} />;
}

GhostCheckboxGroup.Item = GhostCheckboxItem;
