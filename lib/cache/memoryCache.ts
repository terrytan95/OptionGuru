export interface CacheEntry<T> {
  value: T;
  createdAt: number;
  ttlMs: number;
  staleTtlMs: number;
}

export class MemoryCache {
  private entries = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, value: T, ttlSeconds: number, staleTtlSeconds = ttlSeconds): void {
    this.entries.set(key, {
      value,
      createdAt: Date.now(),
      ttlMs: ttlSeconds * 1000,
      staleTtlMs: staleTtlSeconds * 1000
    });
  }

  getFresh<T>(key: string): T | null {
    const entry = this.entries.get(key);
    if (!entry) return null;
    return Date.now() - entry.createdAt <= entry.ttlMs ? (entry.value as T) : null;
  }

  getStale<T>(key: string): T | null {
    const entry = this.entries.get(key);
    if (!entry) return null;
    return Date.now() - entry.createdAt <= entry.staleTtlMs ? (entry.value as T) : null;
  }

  has(key: string): boolean {
    return this.entries.has(key);
  }
}

export const memoryCache = new MemoryCache();
