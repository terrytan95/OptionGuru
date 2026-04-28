import { NextRequest, NextResponse } from "next/server";
import { getDashboardPayload } from "@/lib/services/optionsDashboardService";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "SPY";
  const payload = await getDashboardPayload(symbol);
  return NextResponse.json({ symbol: payload.snapshot.underlyingSymbol, rows: payload.expirationRows, warnings: payload.warnings });
}
