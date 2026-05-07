import type { GhostEvent } from './types.js';

export interface PersistenceAdapter {
  load(): Promise<GhostEvent[]>;
  save(events: GhostEvent[]): Promise<void>;
  clear(): Promise<void>;
}

export const memoryAdapter = (): PersistenceAdapter => {
  let store: GhostEvent[] = [];
  return {
    async load() {
      return store;
    },
    async save(events) {
      store = events;
    },
    async clear() {
      store = [];
    },
  };
};

export const localStorageAdapter = (key = 'ghost-ui:events'): PersistenceAdapter => {
  const safe = typeof window !== 'undefined' && 'localStorage' in window;
  return {
    async load() {
      if (!safe) return [];
      try {
        const raw = window.localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as GhostEvent[]) : [];
      } catch {
        return [];
      }
    },
    async save(events) {
      if (!safe) return;
      try {
        window.localStorage.setItem(key, JSON.stringify(events));
      } catch {
        // quota / serialization — non-fatal
      }
    },
    async clear() {
      if (!safe) return;
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    },
  };
};
