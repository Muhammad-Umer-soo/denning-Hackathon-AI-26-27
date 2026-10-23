import { NextResponse } from "next/server";
import { isLiveDatabase } from "@/lib/server/db/client";
import { ApiResponse } from "@/lib/server/types";

export async function GET() {
  const response: ApiResponse<{
    status: string;
    pilotRegion: string;
    cropsCount: number;
    dbMode: "neon_postgres" | "verified_fallback_sample";
    serverTime: string;
    version: string;
  }> = {
    success: true,
    data: {
      status: "operational",
      pilotRegion: "Punjab (Multan / Faisalabad Belt), Pakistan",
      cropsCount: 4,
      dbMode: isLiveDatabase ? "neon_postgres" : "verified_fallback_sample",
      serverTime: new Date().toISOString(),
      version: "1.0.0 (MVP)",
    },
    meta: {
      source: "HarvestIQ System Diagnostics",
      asOf: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      status: "live",
      disclaimer: "Governed by HarvestIQ Backend Constitution v1.0",
    },
  };

  return NextResponse.json(response);
}
