import { NextRequest, NextResponse } from "next/server";
import { searchSymbols } from "@/lib/services/symbolSearchService";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? "";
  if (query.trim().length < 1) return NextResponse.json({ query: "", results: [], warnings: [] });
  return NextResponse.json(await searchSymbols(query));
}
