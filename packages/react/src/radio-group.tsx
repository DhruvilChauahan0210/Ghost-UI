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

interface GhostRadioGroupCtx {
  zone: ZoneId;
  value: string | null;
  onChange: (id: GhostId) => void;
}

const GhostRadioGroupContext = createContext<GhostRadioGroupCtx | null>(null);

function useRadioCtx(): GhostRadioGroupCtx {
  const ctx = useContext(GhostRadioGroupContext);
  if (!ctx) throw new Error('[ghost-ui] GhostRadioItem must be used inside <GhostRadioGroup>');
  return ctx;
}

// ─── Item ─────────────────────────────────────────────────────────────────────

export interface GhostRadioItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  id: GhostId;
  value?: string;
  disabled?: boolean;
  children: ReactNode;
}

export function GhostRadioItem({
  id,
  value,
  disabled,
  onClick,
  onKeyDown,
  style,
  children,
  ...rest
}: GhostRadioItemProps) {
  const { zone, value: selectedValue, onChange } = useRadioCtx();
  useRegisterNode(id, zone);
  const score = useGhostScore(id);
  const resolvedValue = value ?? id;
  const isChecked = selectedValue === resolvedValue;

  function handleSelect() {
    if (disabled) return;
    onChange(id);
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    handleSelect();
    onClick?.(e);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === ' ') {
      e.preventDefault();
      handleSelect();
    }
    onKeyDown?.(e);
  }

  return (
    <div
      role="radio"
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
      className="group flex items-center gap-3 select-none rounded-lg px-2 py-1.5 hover:bg-white/[0.04] transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-indigo-400/40 focus-visible:outline-none"
      {...rest}
    >
      <div
        className="relative flex items-center justify-center w-[15px] h-[15px] rounded-full border-2 shrink-0"
        style={{
          borderColor: isChecked ? 'rgb(139,141,248)' : 'rgba(255,255,255,0.25)',
          boxShadow: score > 0.1
            ? `0 0 0 2px rgba(139,141,248,${score * 0.5})`
            : undefined,
          transition: 'border-color 160ms ease, box-shadow 240ms ease',
        }}
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-[rgb(139,141,248)]"
          initial={false}
          animate={{ scale: isChecked ? 1 : 0, opacity: isChecked ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      <span className="text-[13px] leading-snug text-white/75">{children}</span>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface GhostRadioGroupProps {
  zone: ZoneId;
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: GhostId) => void;
  children: ReactNode;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
}

function GhostRadioGroupInner({
  zone,
  value: valueProp,
  defaultValue,
  onValueChange,
  children,
  className,
  orientation = 'vertical',
}: GhostRadioGroupProps) {
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);
  const value = valueProp !== undefined ? valueProp : internalValue;
  const order = useGhostOrder(zone);
  const engine = useGhostEngine();

  function onChange(id: GhostId) {
    engine.record('click', id, zone);
    const resolvedValue = id;
    if (valueProp === undefined) setInternalValue(resolvedValue);
    onValueChange?.(id);
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
    <GhostRadioGroupContext.Provider value={{ zone, value, onChange }}>
      <LayoutGroup id={`ghost-radio-${zone}`}>
        <div
          role="radiogroup"
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
    </GhostRadioGroupContext.Provider>
  );
}

export function GhostRadioGroup(props: GhostRadioGroupProps) {
  return <GhostRadioGroupInner {...props} />;
}

GhostRadioGroup.Item = GhostRadioItem;
