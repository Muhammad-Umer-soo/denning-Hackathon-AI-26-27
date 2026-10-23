import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/server/auth";
import { dbService } from "@/lib/server/db/client";
import { ApiResponse } from "@/lib/server/types";

export async function GET(request: NextRequest) {
  try {
    // 1. Role-based authorization: Only planner or admin roles allowed (Constitution §7)
    const { authorized, response } = requireRole(request, ["planner", "admin"]);
    if (!authorized && response) {
      return response;
    }

    // 2. Fetch aggregated indicators (enforces min group size >= 5 server-side)
    const rawIndicators = await dbService.getPlannerIndicators();

    // Secondary strict server-side aggregation guardrail
    const safeAggregated = rawIndicators.filter((item) => item.reportingFarmersCount >= 5);

    const apiResponse: ApiResponse<typeof safeAggregated> = {
      success: true,
      data: safeAggregated,
      meta: {
        source: "Pakistan Bureau of Statistics / Punjab Crop Reporting Service",
        unit: "Metric Tons",
        asOf: "Oct 2026",
        status: "sample",
        recordCount: safeAggregated.length,
        reportingPeriod: "Fiscal Year 2025-2026",
        disclaimer:
          "Macro indicators are aggregated for regional policy and supply planning. Individual farmer identities and micro-level holdings are strictly protected.",
      },
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to retrieve aggregated planner indicators.",
        },
      },
      { status: 500 }
    );
  }
}
