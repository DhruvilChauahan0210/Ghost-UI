import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { memoryAdapter, localStorageAdapter, indexedDBAdapter } from './persistence.js';
import type { GhostEvent, PersistenceAdapter } from './index.js';

const testEvents = (): GhostEvent[] => [
  { id: 'a', zone: 'z', type: 'click', ts: Date.now() },
  { id: 'b', zone: 'z', type: 'hover', ts: Date.now() + 1000 },
];

describe('memoryAdapter', () => {
  it('saves and loads events', async () => {
    const adapter = memoryAdapter();
    const events = testEvents();
    await adapter.save(events);
    const loaded = await adapter.load();
    expect(loaded).toEqual(events);
  });

  it('starts empty', async () => {
    const adapter = memoryAdapter();
    const loaded = await adapter.load();
    expect(loaded).toEqual([]);
  });

  it('overwrites on save', async () => {
    const adapter = memoryAdapter();
    const events1 = testEvents();
    await adapter.save(events1);
    const events2: GhostEvent[] = [
      { id: 'c', zone: 'z', type: 'click', ts: Date.now() },
    ];
    await adapter.save(events2);
    const loaded = await adapter.load();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.id).toBe('c');
  });

  it('clears events', async () => {
    const adapter = memoryAdapter();
    const events = testEvents();
    await adapter.save(events);
    await adapter.clear();
    const loaded = await adapter.load();
    expect(loaded).toEqual([]);
  });
});

describe('localStorageAdapter', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    const mockLocalStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    };
    (global as any).window = {
      localStorage: mockLocalStorage,
    };
    (global as any).localStorage = mockLocalStorage;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('saves and loads events', async () => {
    const adapter = localStorageAdapter();
    const events = testEvents();
    await adapter.save(events);
    const loaded = await adapter.load();
    expect(loaded).toEqual(events);
  });

  it('serializes to JSON in localStorage', async () => {
    const adapter = localStorageAdapter('test-key');
    const events = testEvents();
    await adapter.save(events);
    const raw = store['test-key'];
    expect(raw).toBeDefined();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveProperty('version');
    expect(parsed).toHaveProperty('events');
    expect(parsed.events).toEqual(events);
  });

  it('returns empty array on parse error', async () => {
    store['test-key'] = 'invalid json';
    const adapter = localStorageAdapter('test-key');
    const loaded = await adapter.load();
    expect(loaded).toEqual([]);
  });

  it('clears from localStorage', async () => {
    const adapter = localStorageAdapter('test-key');
    const events = testEvents();
    await adapter.save(events);
    expect(store['test-key']).toBeDefined();
    await adapter.clear();
    expect(store['test-key']).toBeUndefined();
  });

  it('handles write quota errors gracefully', async () => {
    const adapter = localStorageAdapter();
    vi.mocked(localStorage).setItem = vi.fn(() => {
      throw new Error('QuotaExceededError');
    });
    // Should not throw
    await adapter.save(testEvents());
  });

  it('handles unavailable localStorage gracefully', async () => {
    const adapter = localStorageAdapter();
    delete (global as any).localStorage;
    const loaded = await adapter.load();
    expect(loaded).toEqual([]);
    await adapter.save(testEvents()); // should not throw
  });
});

describe('indexedDBAdapter', () => {
  // Note: Real IndexedDB tests in browsers; here we verify structure
  it('creates adapter without throwing', () => {
    const adapter = indexedDBAdapter();
    expect(adapter).toHaveProperty('load');
    expect(adapter).toHaveProperty('save');
    expect(adapter).toHaveProperty('clear');
  });

  it('returns empty array when IndexedDB unavailable', async () => {
    delete (global as any).indexedDB;
    const adapter = indexedDBAdapter();
    const loaded = await adapter.load();
    expect(loaded).toEqual([]);
  });

  it('handles undefined global gracefully', async () => {
    const oldIndexedDB = (global as any).indexedDB;
    delete (global as any).indexedDB;
    const adapter = indexedDBAdapter();
    const loaded = await adapter.load();
    expect(loaded).toEqual([]);
    (global as any).indexedDB = oldIndexedDB;
  });
});

describe('adapter contract', () => {
  describe('memoryAdapter', () => {
    let adapter: PersistenceAdapter;

    beforeEach(() => {
      adapter = memoryAdapter();
    });

    it('load returns array', async () => {
      const loaded = await adapter.load();
      expect(Array.isArray(loaded)).toBe(true);
    });

    it('save accepts array', async () => {
      const events = testEvents();
      await expect(adapter.save(events)).resolves.not.toThrow();
    });

    it('clear resolves without error', async () => {
      await expect(adapter.clear()).resolves.not.toThrow();
    });

    it('persists empty array', async () => {
      await adapter.save([]);
      const loaded = await adapter.load();
      expect(loaded).toEqual([]);
    });

    it('persists large arrays', async () => {
      const large: GhostEvent[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `node-${i}`,
        zone: 'z',
        type: 'click' as const,
        ts: Date.now() + i,
      }));
      await adapter.save(large);
      const loaded = await adapter.load();
      expect(loaded).toHaveLength(1000);
    });
  });

  describe('localStorageAdapter (contract)', () => {
    let adapter: PersistenceAdapter;
    let store: Record<string, string>;

    beforeEach(() => {
      store = {};
      const mockLocalStorage = {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
      };
      (global as any).window = {
        localStorage: mockLocalStorage,
      };
      (global as any).localStorage = mockLocalStorage;
      adapter = localStorageAdapter();
    });

    it('load returns array', async () => {
      const loaded = await adapter.load();
      expect(Array.isArray(loaded)).toBe(true);
    });

    it('save accepts array', async () => {
      const events = testEvents();
      await expect(adapter.save(events)).resolves.not.toThrow();
    });

    it('clear resolves without error', async () => {
      await expect(adapter.clear()).resolves.not.toThrow();
    });

    it('persists empty array', async () => {
      await adapter.save([]);
      const loaded = await adapter.load();
      expect(loaded).toEqual([]);
    });

    it('persists large arrays', async () => {
      const large: GhostEvent[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `node-${i}`,
        zone: 'z',
        type: 'click' as const,
        ts: Date.now() + i,
      }));
      await adapter.save(large);
      const loaded = await adapter.load();
      expect(loaded).toHaveLength(1000);
    });
  });
});
