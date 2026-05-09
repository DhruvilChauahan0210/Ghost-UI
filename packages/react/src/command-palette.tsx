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
          ? `inset 3px 0 0 rgba(139,141,248,${score * 0.8})`
          : undefined,
        cursor: 'pointer',
      }}
      className={[
        'flex items-center gap-3 px-3 py-2.5 mx-1 rounded-lg select-none transition-all duration-100',
        isActive
          ? 'bg-indigo-500/[0.12] ring-1 ring-inset ring-indigo-400/20'
          : 'hover:bg-white/[0.04]',
      ].join(' ')}
    >
      {command.icon && (
        <span className="w-7 h-7 rounded-md bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0 text-white/50 text-[13px]">
          {command.icon}
        </span>
      )}
      <span className="flex-1 text-[13px] text-white/85 truncate">{command.label}</span>
      {command.shortcut && (
        <kbd className="text-[11px] text-white/30 bg-white/[0.04] border border-white/[0.07] rounded-md px-1.5 py-0.5 font-mono shrink-0">
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
            className="fixed top-[18%] left-1/2 -translate-x-1/2 w-full max-w-[560px] z-[99998] rounded-2xl border border-white/[0.08] bg-[#08080c]/97 backdrop-blur-xl shadow-[0_32px_80px_rgba(0,0,0,0.85),0_0_0_0.5px_rgba(255,255,255,0.04)] overflow-hidden"
          >
            <div className="border-b border-white/[0.06] flex items-center gap-3 px-4">
              <svg className="w-4 h-4 shrink-0 text-white/25" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="8.5" cy="8.5" r="5.5" />
                <path d="M14 14l3.5 3.5" strokeLinecap="round" />
              </svg>
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
                className="flex-1 bg-transparent py-4 text-[14px] text-white/90 placeholder:text-white/25 outline-none"
              />
            </div>

            <div
              role="listbox"
              className="max-h-[360px] overflow-y-auto py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/[0.08] [&::-webkit-scrollbar-thumb]:rounded-full"
            >
              {grouped.length === 0 && (
                <div className="px-4 py-10 text-center text-[13px] text-white/25">No results</div>
              )}
              {grouped.map((group) => (
                <div key={group.label ?? '__ungrouped'}>
                  {group.label && (
                    <div className="px-4 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/25 select-none">
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

            <div className="border-t border-white/[0.05] px-4 py-2 flex items-center gap-4">
              <span className="text-[11px] text-white/20 flex items-center gap-1.5">
                <kbd className="text-[10px] bg-white/[0.06] border border-white/[0.08] rounded px-1 py-0.5 font-mono leading-none">↑↓</kbd>
                navigate
              </span>
              <span className="text-[11px] text-white/20 flex items-center gap-1.5">
                <kbd className="text-[10px] bg-white/[0.06] border border-white/[0.08] rounded px-1 py-0.5 font-mono leading-none">↵</kbd>
                select
              </span>
              <span className="text-[11px] text-white/20 flex items-center gap-1.5">
                <kbd className="text-[10px] bg-white/[0.06] border border-white/[0.08] rounded px-1 py-0.5 font-mono leading-none">esc</kbd>
                dismiss
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
