import { NextResponse } from "next/server";
import { getProviderStatus } from "@/lib/services/providerStatusService";

export function GET() {
  return NextResponse.json(getProviderStatus());
}
