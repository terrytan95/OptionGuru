import { NextRequest, NextResponse } from "next/server";
import { getHeatmapPayload } from "@/lib/services/optionsDashboardService";
import type { HeatmapType } from "@/lib/analytics/heatmaps";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "SPY";
  const type = (request.nextUrl.searchParams.get("type") ?? "volume") as HeatmapType;
  return NextResponse.json(await getHeatmapPayload(symbol, type));
}
