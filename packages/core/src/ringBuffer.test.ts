import { describe, expect, it } from 'vitest';
import { RingBuffer } from './ringBuffer.js';

describe('RingBuffer', () => {
  describe('push and size', () => {
    it('increments size on push', () => {
      const buf = new RingBuffer<number>(10);
      expect(buf.size()).toBe(0);
      buf.push(1);
      expect(buf.size()).toBe(1);
      buf.push(2);
      expect(buf.size()).toBe(2);
    });

    it('respects capacity', () => {
      const buf = new RingBuffer<number>(5);
      for (let i = 0; i < 10; i++) {
        buf.push(i);
      }
      expect(buf.size()).toBe(5);
    });

    it('size never exceeds capacity', () => {
      const buf = new RingBuffer<number>(3);
      buf.push(1);
      buf.push(2);
      buf.push(3);
      buf.push(4);
      buf.push(5);
      expect(buf.size()).toBe(3);
    });
  });

  describe('iteration', () => {
    it('iterates in order oldest to newest', () => {
      const buf = new RingBuffer<number>(5);
      buf.push(1);
      buf.push(2);
      buf.push(3);
      const arr = Array.from(buf.items());
      expect(arr).toEqual([1, 2, 3]);
    });

    it('wraps around correctly', () => {
      const buf = new RingBuffer<number>(3);
      buf.push(1);
      buf.push(2);
      buf.push(3);
      buf.push(4); // overwrites 1, order is now [2, 3, 4]
      buf.push(5); // overwrites 2, order is now [3, 4, 5]
      const arr = Array.from(buf.items());
      expect(arr).toEqual([3, 4, 5]);
    });

    it('handles partial buffer', () => {
      const buf = new RingBuffer<number>(5);
      buf.push(10);
      buf.push(20);
      const arr = Array.from(buf.items());
      expect(arr).toEqual([10, 20]);
    });

    it('returns empty iterator for empty buffer', () => {
      const buf = new RingBuffer<number>(5);
      const arr = Array.from(buf.items());
      expect(arr).toEqual([]);
    });
  });

  describe('toArray', () => {
    it('returns array of items', () => {
      const buf = new RingBuffer<string>(5);
      buf.push('a');
      buf.push('b');
      buf.push('c');
      expect(buf.toArray()).toEqual(['a', 'b', 'c']);
    });

    it('returns new array each call', () => {
      const buf = new RingBuffer<number>(5);
      buf.push(1);
      const arr1 = buf.toArray();
      const arr2 = buf.toArray();
      expect(arr1).not.toBe(arr2);
      expect(arr1).toEqual(arr2);
    });

    it('handles wraparound in toArray', () => {
      const buf = new RingBuffer<number>(3);
      buf.push(1);
      buf.push(2);
      buf.push(3);
      buf.push(4);
      buf.push(5);
      expect(buf.toArray()).toEqual([3, 4, 5]);
    });
  });

  describe('clear', () => {
    it('clears all items', () => {
      const buf = new RingBuffer<number>(5);
      buf.push(1);
      buf.push(2);
      buf.push(3);
      buf.clear();
      expect(buf.size()).toBe(0);
      expect(buf.toArray()).toEqual([]);
    });

    it('allows pushing after clear', () => {
      const buf = new RingBuffer<number>(5);
      buf.push(1);
      buf.clear();
      buf.push(2);
      expect(buf.toArray()).toEqual([2]);
    });
  });

  describe('complex scenarios', () => {
    it('handles alternating push/iterate', () => {
      const buf = new RingBuffer<number>(4);
      buf.push(1);
      expect(buf.toArray()).toEqual([1]);
      buf.push(2);
      buf.push(3);
      expect(buf.toArray()).toEqual([1, 2, 3]);
      buf.push(4);
      buf.push(5);
      expect(buf.toArray()).toEqual([2, 3, 4, 5]);
    });

    it('handles single capacity', () => {
      const buf = new RingBuffer<number>(1);
      buf.push(1);
      expect(buf.toArray()).toEqual([1]);
      buf.push(2);
      expect(buf.toArray()).toEqual([2]);
      buf.push(3);
      expect(buf.toArray()).toEqual([3]);
    });

    it('stores object references correctly', () => {
      const buf = new RingBuffer<{ id: number }>(3);
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      buf.push(obj1);
      buf.push(obj2);
      const arr = buf.toArray();
      expect(arr[0]).toBe(obj1);
      expect(arr[1]).toBe(obj2);
    });

    it('allows mutation of stored items', () => {
      const buf = new RingBuffer<{ val: number }>(3);
      const obj = { val: 1 };
      buf.push(obj);
      const arr = buf.toArray();
      arr[0]!.val = 2;
      expect(buf.toArray()[0]?.val).toBe(2);
    });
  });
});
