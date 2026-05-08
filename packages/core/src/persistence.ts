import type { GhostEvent } from './types.js';

export interface PersistenceAdapter {
  load(): Promise<GhostEvent[]>;
  save(events: GhostEvent[]): Promise<void>;
  clear(): Promise<void>;
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
