import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import type { GhostId, ZoneId } from '@ghost-ui/core';
import { useGhostEngine } from './context.js';
import { useGhostOrder, useGhostScore, useRegisterNode } from './hooks.js';

// ─── Command type ─────────────────────────────────────────────────────────────

export interface GhostCommand {
  id: GhostId;
  label: string;
  group?: string;
  keywords?: string[];
  shortcut?: string;
  icon?: ReactNode;
  onSelect: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface GhostCommandPaletteCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const GhostCommandPaletteContext = createContext<GhostCommandPaletteCtx | null>(null);

export function GhostCommandPaletteProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <GhostCommandPaletteContext.Provider value={{ open, setOpen }}>
      {children}
    </GhostCommandPaletteContext.Provider>
  );
}

export function useGhostCommandPalette(): { open: boolean; setOpen: (v: boolean) => void } {
  const ctx = useContext(GhostCommandPaletteContext);
  if (!ctx) throw new Error('[ghost-ui] useGhostCommandPalette must be used inside GhostCommandPaletteProvider');
  return ctx;
}

// ─── GhostCommandItem ─────────────────────────────────────────────────────────

interface GhostCommandItemProps {
  command: GhostCommand;
  zone: ZoneId;
  isActive: boolean;
  onSelect: (id: GhostId) => void;
}

function GhostCommandItem({ command, zone, isActive, onSelect }: GhostCommandItemProps) {
  useRegisterNode(command.id, zone);
  const score = useGhostScore(command.id);

  return (
    <div
      role="option"
      aria-selected={isActive}
      data-active={isActive ? '' : undefined}
      onClick={() => onSelect(command.id)}
      style={{
        boxShadow: score > 0.05
          ? `inset 2px 0 0 rgba(139,141,248,${score * 0.7})`
          : undefined,
        transition: 'box-shadow 240ms ease, background 120ms ease',
        cursor: 'pointer',
      }}
      className={[
        'flex items-center gap-3 px-4 py-2.5 select-none',
        isActive ? 'bg-white/10' : 'hover:bg-white/5',
      ].join(' ')}
    >
      {command.icon && (
        <span className="shrink-0 text-white/50 w-4 h-4 flex items-center justify-center">
          {command.icon}
        </span>
      )}
      <span className="flex-1 text-sm text-white/90 truncate">{command.label}</span>
      {command.shortcut && (
        <kbd className="shrink-0 text-[11px] text-white/40 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 font-mono">
          {command.shortcut}
        </kbd>
      )}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface GhostCommandPaletteProps {
  zone: ZoneId;
  commands: GhostCommand[];
  placeholder?: string;
  hotkey?: boolean;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GhostCommandPalette({
  zone,
  commands,
  placeholder = 'Search commands…',
  hotkey = true,
}: GhostCommandPaletteProps) {
  const { open, setOpen } = useGhostCommandPalette();
  const engine = useGhostEngine();
  const order = useGhostOrder(zone);

  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!hotkey || typeof window === 'undefined') return;
    function handler(e: globalThis.KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [hotkey, open, setOpen]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return commands;
    return commands.filter((cmd) => {
      const labelMatch = cmd.label.toLowerCase().includes(q);
      const kwMatch = cmd.keywords?.join(' ').toLowerCase().includes(q) ?? false;
      return labelMatch || kwMatch;
    });
  }, [commands, query]);

  const sorted = useMemo(() => {
    if (order.length === 0) return filtered;
    const indexById = new Map(order.map((id, i) => [id, i]));
    return [...filtered].sort((a, b) => {
      const ai = indexById.get(a.id) ?? Number.POSITIVE_INFINITY;
      const bi = indexById.get(b.id) ?? Number.POSITIVE_INFINITY;
      return ai - bi;
    });
  }, [filtered, order]);

  const grouped = useMemo(() => {
    const groups: { label: string | null; commands: GhostCommand[] }[] = [];
    for (const cmd of sorted) {
      const groupLabel = cmd.group ?? null;
      const existing = groups.find((g) => g.label === groupLabel);
      if (existing) {
        existing.commands.push(cmd);
      } else {
        groups.push({ label: groupLabel, commands: [cmd] });
      }
    }
    return groups;
  }, [sorted]);

  const flatSorted = useMemo(() => sorted, [sorted]);

  function handleSelect(id: GhostId) {
    const cmd = commands.find((c) => c.id === id);
    if (!cmd) return;
    engine.record('click', id, zone);
    cmd.onSelect();
    setOpen(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % Math.max(flatSorted.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + Math.max(flatSorted.length, 1)) % Math.max(flatSorted.length, 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const active = flatSorted[activeIdx];
      if (active) handleSelect(active.id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  }

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <div
            className="fixed inset-0 backdrop-blur-sm bg-black/40 z-[99997]"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: 'spring', stiffness: 480, damping: 36 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[99998] rounded-xl border border-white/10 bg-neutral-900/95 shadow-2xl overflow-hidden"
          >
            <div className="border-b border-white/10">
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={true}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none"
              />
            </div>

            <div role="listbox" className="overflow-y-auto max-h-[360px] py-1">
              {grouped.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-white/30">No results</div>
              )}
              {grouped.map((group) => (
                <div key={group.label ?? '__ungrouped'}>
                  {group.label && (
                    <div className="px-4 pt-3 pb-1 text-[11px] font-medium tracking-wider uppercase text-white/30 select-none">
                      {group.label}
                    </div>
                  )}
                  {group.commands.map((cmd) => {
                    const globalIdx = flatSorted.indexOf(cmd);
                    return (
                      <GhostCommandItem
                        key={cmd.id}
                        command={cmd}
                        zone={zone}
                        isActive={globalIdx === activeIdx}
                        onSelect={handleSelect}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
