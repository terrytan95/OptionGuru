export class TokenBucket {
  private tokens: number;
  private lastRefillAt: number;

  constructor(
    private readonly capacity: number,
    private readonly refillTokens: number,
    private readonly refillMs: number
  ) {
    this.tokens = capacity;
    this.lastRefillAt = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefillAt;
    if (elapsed <= 0) return;
    const tokensToAdd = (elapsed / this.refillMs) * this.refillTokens;
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefillAt = now;
  }

  tryAcquire(cost = 1): boolean {
    this.refill();
    if (this.tokens < cost) return false;
    this.tokens -= cost;
    return true;
  }

  getSnapshot() {
    this.refill();
    const remaining = Math.floor(this.tokens);
    const missing = Math.max(0, 1 - this.tokens);
    const msUntilOne = missing === 0 ? 0 : (missing / this.refillTokens) * this.refillMs;
    return {
      capacity: this.capacity,
      remaining,
      used: this.capacity - remaining,
      nextRefillAt: new Date(Date.now() + msUntilOne).toISOString()
    };
  }
}
