import type { GhostEvent } from './types.js';

export interface PersistenceAdapter {
  load(): Promise<GhostEvent[]>;
  save(events: GhostEvent[]): Promise<void>;
  clear(): Promise<void>;
}

// ─── Server adapter ───────────────────────────────────────────────────────────

/**
 * HTTP contract your backend must implement:
 *
 *   GET  {url}?userId={id}                      → 200 { events: GhostEvent[] }
 *   POST {url}   body: { userId, events }        → 200 | 204
 *   DELETE {url}?userId={id}                     → 200 | 204
 *
 * All endpoints must accept/return `Content-Type: application/json`.
 */
export interface ServerAdapterOptions {
  /**
   * Stable identifier for this user's event stream.
   * Auto-generated and persisted to localStorage under "ghost-ui:uid" if omitted.
   */
  userId?: string;
  /** Extra HTTP headers on every request — use for auth tokens, API keys, etc. */
  headers?: Record<string, string>;
  /**
   * How often (ms) to flush queued events to the server.
   * Events are batched and sent on this interval rather than on every interaction.
   * Default: 5000
   */
  flushIntervalMs?: number;
  /**
   * Maximum number of events sent in a single POST.
   * If the queue is larger, multiple requests are made sequentially.
   * Default: 100
   */
  batchSize?: number;
  /**
   * Local fallback adapter used when the server is unreachable.
   * Events are buffered here and re-uploaded when connectivity returns.
   * Defaults to localStorageAdapter keyed to the resolved userId.
   */
  fallback?: PersistenceAdapter;
  /** Called on non-fatal network errors (logging, monitoring). */
  onError?: (err: unknown) => void;
}

const SCHEMA_VERSION = 1;

interface VersionedEventStore {
  version: number;
  events: GhostEvent[];
}

function migrateEvents(data: unknown): GhostEvent[] {
  // Handle both versioned and legacy (non-versioned) formats
  if (data && typeof data === 'object' && 'version' in data && 'events' in data) {
    const versioned = data as VersionedEventStore;
    if (versioned.version === SCHEMA_VERSION) {
      return versioned.events;
    }
    // Future migrations can go here
    // if (versioned.version === 0) { ... migrate to v1 ... }
    return versioned.events;
  }
  // Legacy format: assume it's just the events array
  if (Array.isArray(data)) {
    return data;
  }
  return [];
}

export const memoryAdapter = (): PersistenceAdapter => {
  let store: GhostEvent[] = [];
  return {
    async load() {
      return store;
    },
    async save(events) {
      store = [...events];
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
        if (!raw) return [];
        const data = JSON.parse(raw);
        return migrateEvents(data);
      } catch {
        return [];
      }
    },
    async save(events) {
      if (!safe) return;
      try {
        const versioned: VersionedEventStore = { version: SCHEMA_VERSION, events };
        window.localStorage.setItem(key, JSON.stringify(versioned));
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

export const indexedDBAdapter = (dbName = 'ghost-ui', storeName = 'events'): PersistenceAdapter => {
  const safe = typeof window !== 'undefined' && 'indexedDB' in window;
  let dbPromise: Promise<IDBDatabase | null> | null = null;

  const getDB = async (): Promise<IDBDatabase | null> => {
    if (!safe) return null;
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve) => {
      try {
        const req = window.indexedDB.open(dbName, 1);
        req.onerror = () => resolve(null);
        req.onsuccess = () => resolve(req.result);
        req.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName);
          }
        };
      } catch {
        resolve(null);
      }
    });

    return dbPromise;
  };

  return {
    async load() {
      try {
        const db = await getDB();
        if (!db) return [];
        return new Promise((resolve) => {
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const req = store.get('__events__');
          req.onsuccess = () => resolve(migrateEvents(req.result));
          req.onerror = () => resolve([]);
        });
      } catch {
        return [];
      }
    },
    async save(events) {
      try {
        const db = await getDB();
        if (!db) return;
        const versioned: VersionedEventStore = { version: SCHEMA_VERSION, events };
        return new Promise<void>((resolve) => {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          const req = store.put(versioned, '__events__');
          req.onsuccess = () => resolve();
          req.onerror = () => resolve();
        });
      } catch {
        // non-fatal
      }
    },
    async clear() {
      try {
        const db = await getDB();
        if (!db) return;
        return new Promise<void>((resolve) => {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          const req = store.delete('__events__');
          req.onsuccess = () => resolve();
          req.onerror = () => resolve();
        });
      } catch {
        // non-fatal
      }
    },
  };
};

// ─── Server adapter implementation ───────────────────────────────────────────

function resolveUserId(provided?: string): string {
  if (provided) return provided;
  const KEY = 'ghost-ui:uid';
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(KEY);
      if (stored) return stored;
      const id = uid();
      window.localStorage.setItem(KEY, id);
      return id;
    } catch {
      // localStorage blocked (private browsing, permissions)
    }
  }
  return uid();
}

function uid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function appendUserId(base: string, userId: string): string {
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}userId=${encodeURIComponent(userId)}`;
}

export const serverAdapter = (
  url: string,
  opts: ServerAdapterOptions = {},
): PersistenceAdapter => {
  const {
    headers = {},
    flushIntervalMs = 5000,
    batchSize = 100,
    onError,
  } = opts;

  const userId = resolveUserId(opts.userId);
  const fallback = opts.fallback ?? localStorageAdapter(`ghost-ui:offline:${userId}`);

  const pending: GhostEvent[] = [];
  // Number of events from the full engine log already queued or confirmed sent.
  // Lets us diff on each save() call instead of re-queuing the entire log.
  let knownCount = 0;
  let flushTimer: ReturnType<typeof setInterval> | null = null;
  let flushing = false;
  let visibilityListenerAdded = false;

  async function flushOnce(): Promise<void> {
    if (flushing || pending.length === 0) return;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;

    flushing = true;
    // Drain the queue in batchSize chunks
    while (pending.length > 0) {
      const batch = pending.slice(0, batchSize);
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...headers },
          body: JSON.stringify({ userId, events: batch }),
          keepalive: true,
        });
        if (!res.ok) throw new Error(`[ghost-ui] server ${res.status} ${res.statusText}`);
        pending.splice(0, batch.length);
      } catch (err) {
        onError?.(err);
        break; // leave remaining events in pending for next flush
      }
    }
    flushing = false;
  }

  function flushBeacon(): void {
    if (pending.length === 0 || typeof navigator === 'undefined') return;
    // sendBeacon is fire-and-forget but survives page unload
    const body = JSON.stringify({ userId, events: pending });
    const sent = navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
    if (sent) pending.length = 0;
  }

  function ensureFlushLoop(): void {
    if (flushTimer) return;
    flushTimer = setInterval(() => { void flushOnce(); }, flushIntervalMs);

    if (typeof document !== 'undefined' && !visibilityListenerAdded) {
      visibilityListenerAdded = true;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flushBeacon();
      });
    }
  }

  return {
    async load() {
      ensureFlushLoop();
      try {
        const res = await fetch(appendUserId(url, userId), { headers });
        if (!res.ok) throw new Error(`[ghost-ui] server ${res.status}`);
        const data = await res.json() as { events?: GhostEvent[] };
        const events = Array.isArray(data.events) ? data.events : [];
        knownCount = events.length;
        // Keep fallback in sync so offline reads return fresh data
        await fallback.save(events);
        return events;
      } catch (err) {
        onError?.(err);
        // Offline — load from fallback; mark knownCount=0 so all events get uploaded later
        knownCount = 0;
        return fallback.load();
      }
    },

    async save(events) {
      const newEvents = events.slice(knownCount);
      if (newEvents.length > 0) {
        pending.push(...newEvents);
        knownCount = events.length;
      }
      // Always persist locally for offline resilience
      await fallback.save(events);
      // Kick off a flush (debounced by the interval)
      void flushOnce();
    },

    async clear() {
      pending.length = 0;
      knownCount = 0;
      await fallback.clear();
      try {
        await fetch(appendUserId(url, userId), {
          method: 'DELETE',
          headers,
        });
      } catch (err) {
        onError?.(err);
      }
    },
  };
};

// ─── Composite adapter ────────────────────────────────────────────────────────

/**
 * Chains multiple adapters together.
 *
 * - `load()` — returns events from the first adapter that succeeds and has data.
 *              Falls through to the next adapter if the current one returns [].
 * - `save()` — writes to all adapters in parallel.
 * - `clear()` — clears all adapters in parallel.
 *
 * @example
 * // Server is primary; localStorage is offline fallback
 * compositeAdapter(
 *   serverAdapter('https://api.example.com/ghost'),
 *   localStorageAdapter('my-app'),
 * )
 */
export const compositeAdapter = (...adapters: PersistenceAdapter[]): PersistenceAdapter => ({
  async load() {
    for (const adapter of adapters) {
      try {
        const events = await adapter.load();
        if (events.length > 0) return events;
      } catch {
        // try next
      }
    }
    return [];
  },
  async save(events) {
    await Promise.allSettled(adapters.map((a) => a.save(events)));
  },
  async clear() {
    await Promise.allSettled(adapters.map((a) => a.clear()));
  },
});
