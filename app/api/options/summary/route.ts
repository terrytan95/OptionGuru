import { NextRequest, NextResponse } from "next/server";
import { getDashboardPayload } from "@/lib/services/optionsDashboardService";
import { getProviderStatus } from "@/lib/services/providerStatusService";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "SPY";
  const payload = await getDashboardPayload(symbol);
  return NextResponse.json({ ...payload, providerStatus: getProviderStatus(payload.cacheStatus) });
}
