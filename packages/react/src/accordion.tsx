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
  type ReactElement,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { GhostId, ZoneId } from '@ghost-ui/core';
import { useGhostEngine, useGhostPlan } from './context.js';
import { useGhostOrder, useGhostScore, useRegisterNode } from './hooks.js';

// ─── Root context ─────────────────────────────────────────────────────────────

interface GhostAccordionCtx {
  zone: ZoneId;
  openIds: Set<GhostId>;
  toggle: (id: GhostId) => void;
}

const GhostAccordionContext = createContext<GhostAccordionCtx | null>(null);

function useAccordionCtx(): GhostAccordionCtx {
  const ctx = useContext(GhostAccordionContext);
  if (!ctx) throw new Error('[ghost-ui] GhostAccordion.* must be rendered inside <GhostAccordion>');
  return ctx;
}

// ─── Item context ─────────────────────────────────────────────────────────────

interface GhostAccordionItemCtx {
  id: GhostId;
  isOpen: boolean;
}

const GhostAccordionItemContext = createContext<GhostAccordionItemCtx | null>(null);

function useAccordionItemCtx(): GhostAccordionItemCtx {
  const ctx = useContext(GhostAccordionItemContext);
  if (!ctx) throw new Error('[ghost-ui] GhostAccordion.Trigger / .Content must be inside <GhostAccordion.Item>');
  return ctx;
}

// ─── GhostAccordion ───────────────────────────────────────────────────────────

export interface GhostAccordionProps {
  zone: ZoneId;
  multiple?: boolean;
  children: ReactNode;
  className?: string;
}

export function GhostAccordion({ zone, multiple = false, children, className }: GhostAccordionProps) {
  const [openIds, setOpenIds] = useState<Set<GhostId>>(new Set());
  const engine = useGhostEngine();
  const plan = useGhostPlan();
  const order = useGhostOrder(zone);

  // Auto-expand items whose score exceeds 0.4 on first render
  const autoExpandedRef = useRef(false);
  useEffect(() => {
    if (autoExpandedRef.current) return;
    autoExpandedRef.current = true;
    const highScore = Object.entries(plan.emphasis)
      .filter(([, score]) => score > 0.4)
      .map(([id]) => id as GhostId);
    if (highScore.length > 0) {
      setOpenIds(multiple ? new Set(highScore) : new Set(highScore.slice(0, 1)));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = useCallback(
    (id: GhostId) => {
      setOpenIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          engine.record('click', id, zone);
          if (!multiple) next.clear();
          next.add(id);
        }
        return next;
      });
    },
    [engine, zone, multiple],
  );

  // Sort children by Ghost order so high-scoring items drift up
  const sorted = useMemo(() => {
    const arr = Children.toArray(children).filter(isValidElement) as ReactElement[];
    if (order.length === 0) return arr;
    const indexById = new Map(order.map((id, i) => [id, i]));
    return [...arr].sort((a, b) => {
      const aid = (a.props as { id?: string }).id ?? '';
      const bid = (b.props as { id?: string }).id ?? '';
      return (indexById.get(aid) ?? Infinity) - (indexById.get(bid) ?? Infinity);
    });
  }, [children, order]);

  return (
    <GhostAccordionContext.Provider value={{ zone, openIds, toggle }}>
      <div className={className}>
        {sorted.map((child) => {
          const id = (child.props as { id?: string }).id ?? '';
          return (
            <motion.div key={id} layout transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
              {child}
            </motion.div>
          );
        })}
      </div>
    </GhostAccordionContext.Provider>
  );
}

// ─── GhostAccordionItem ───────────────────────────────────────────────────────

export interface GhostAccordionItemProps {
  id: GhostId;
  zone: ZoneId;
  weight?: number;
  children: ReactNode;
  className?: string;
}

export function GhostAccordionItem({ id, zone, weight, children, className }: GhostAccordionItemProps) {
  const { openIds } = useAccordionCtx();
  useRegisterNode(id, zone, { weight });
  const score = useGhostScore(id);
  const isOpen = openIds.has(id);

  return (
    <GhostAccordionItemContext.Provider value={{ id, isOpen }}>
      <div
        data-ghost-id={id}
        data-ghost-score={score.toFixed(2)}
        data-state={isOpen ? 'open' : 'closed'}
        style={{ borderLeftColor: `rgba(139,141,248,${score * 0.6})` }}
        className={`border-l-2 ${className ?? ''}`}
      >
        {children}
      </div>
    </GhostAccordionItemContext.Provider>
  );
}

// ─── GhostAccordionTrigger ────────────────────────────────────────────────────

export interface GhostAccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function GhostAccordionTrigger({ children, onClick, className, ...rest }: GhostAccordionTriggerProps) {
  const { toggle } = useAccordionCtx();
  const { id, isOpen } = useAccordionItemCtx();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      toggle(id);
    },
    [onClick, toggle, id],
  );

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls={`ghost-accordion-panel-${id}`}
      id={`ghost-accordion-trigger-${id}`}
      data-ghost-accordion-trigger=""
      onClick={handleClick}
      className={`flex w-full items-center justify-between ${className ?? ''}`}
      {...rest}
    >
      {children}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        aria-hidden
        className="shrink-0"
      >
        <polyline points="6 9 12 15 18 9" />
      </motion.svg>
    </button>
  );
}

// ─── GhostAccordionContent ────────────────────────────────────────────────────

export interface GhostAccordionContentProps {
  children: ReactNode;
  className?: string;
}

export function GhostAccordionContent({ children, className }: GhostAccordionContentProps) {
  const { id, isOpen } = useAccordionItemCtx();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          id={`ghost-accordion-panel-${id}`}
          role="region"
          aria-labelledby={`ghost-accordion-trigger-${id}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
          className="overflow-hidden"
        >
          <div className={className}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Compound ─────────────────────────────────────────────────────────────────

GhostAccordion.Item = GhostAccordionItem;
GhostAccordion.Trigger = GhostAccordionTrigger;
GhostAccordion.Content = GhostAccordionContent;
