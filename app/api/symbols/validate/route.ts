import { NextRequest, NextResponse } from "next/server";
import { validateOptionableSymbol } from "@/lib/services/optionableService";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol") ?? "";
  if (!symbol.trim()) {
    return NextResponse.json({ error: { code: "INVALID_SYMBOL", message: "Missing symbol." } }, { status: 400 });
  }
  return NextResponse.json(await validateOptionableSymbol(symbol));
}
