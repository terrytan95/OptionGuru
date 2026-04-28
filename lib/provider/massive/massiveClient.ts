import type { ApiBudgetPriority } from "@/lib/rateLimit/apiBudget";

export class MassiveClient {
  async get<T>(_pathOrUrl: string, _params?: Record<string, string | number | boolean>, _priority?: ApiBudgetPriority): Promise<T> {
    throw new Error("PROVIDER_NOT_CONFIGURED: Massive integration is staged for the snapshot phase.");
  }
}
