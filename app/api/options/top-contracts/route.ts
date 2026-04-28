import { NextRequest, NextResponse } from "next/server";
import { getDashboardPayload } from "@/lib/services/optionsDashboardService";
import type { TopContractRankBy } from "@/lib/analytics/topContracts";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "SPY";
  const rankBy = (request.nextUrl.searchParams.get("rankBy") ?? "premium") as TopContractRankBy;
  const payload = await getDashboardPayload(symbol, rankBy);
  return NextResponse.json({ symbol: payload.snapshot.underlyingSymbol, rankBy, rows: payload.topContracts, warnings: payload.warnings });
}
