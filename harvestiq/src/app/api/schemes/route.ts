import { NextResponse } from "next/server";
import { dbService } from "@/lib/server/db/client";
import { ApiResponse } from "@/lib/server/types";

export async function GET() {
  try {
    const schemes = await dbService.getSchemes();

    const response: ApiResponse<typeof schemes> = {
      success: true,
      data: schemes,
      meta: {
        source: "Official Provincial & Federal Government Portals",
        asOf: "Sep–Oct 2026",
        status: "sample",
        recordCount: schemes.length,
        disclaimer:
          "HarvestIQ provides informational directory access only. We do not process loan applications, custody funds, or guarantee scheme eligibility or disbursement. Always verify terms directly with the official authority.",
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to retrieve financial schemes directory.",
        },
      },
      { status: 500 }
    );
  }
}
