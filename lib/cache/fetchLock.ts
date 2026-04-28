const locks = new Map<string, Promise<unknown>>();

export async function withFetchLock<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const existing = locks.get(key);
  if (existing) return existing as Promise<T>;
  const promise = fetcher().finally(() => locks.delete(key));
  locks.set(key, promise);
  return promise;
}
