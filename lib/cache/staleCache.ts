import { memoryCache } from "@/lib/cache/memoryCache";

export async function withStaleCache<T>(
  key: string,
  ttlSeconds: number,
  staleTtlSeconds: number,
  fetcher: () => Promise<T>
): Promise<{ value: T; cacheStatus: "fresh" | "stale" | "miss" }> {
  const fresh = memoryCache.getFresh<T>(key);
  if (fresh) return { value: fresh, cacheStatus: "fresh" };
  const stale = memoryCache.getStale<T>(key);
  if (stale) return { value: stale, cacheStatus: "stale" };
  const value = await fetcher();
  memoryCache.set(key, value, ttlSeconds, staleTtlSeconds);
  return { value, cacheStatus: "miss" };
}
