export class RingBuffer<T> {
  private buf: (T | undefined)[];
  private head = 0;
  private len = 0;

  constructor(public readonly capacity: number) {
    this.buf = new Array(capacity);
  }

  push(item: T): void {
    this.buf[this.head] = item;
    this.head = (this.head + 1) % this.capacity;
    if (this.len < this.capacity) this.len++;
  }

  size(): number {
    return this.len;
  }

  /** iterate oldest -> newest */
  *items(): IterableIterator<T> {
    if (this.len === 0) return;
    const start = (this.head - this.len + this.capacity) % this.capacity;
    for (let i = 0; i < this.len; i++) {
      const idx = (start + i) % this.capacity;
      const v = this.buf[idx];
      if (v !== undefined) yield v;
    }
  }

  toArray(): T[] {
    return Array.from(this.items());
  }

  clear(): void {
    this.buf = new Array(this.capacity);
    this.head = 0;
    this.len = 0;
  }
}
