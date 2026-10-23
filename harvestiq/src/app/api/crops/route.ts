import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbService } from "@/lib/server/db/client";
import { ApiResponse } from "@/lib/server/types";

const querySchema = z.object({
  season: z.enum(["Rabi", "Kharif", "all"]).optional().default("all"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      season: searchParams.get("season") || "all",
    });

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            code: "INVALID_QUERY_PARAMS",
            message: "Season must be 'Rabi', 'Kharif', or 'all'.",
            details: parsed.error.issues,
          },
        },
        { status: 400 }
      );
    }

    let crops = await dbService.getCrops();
    if (parsed.data.season !== "all") {
      crops = crops.filter((c) => c.season.toLowerCase() === parsed.data.season.toLowerCase());
    }

    const response: ApiResponse<typeof crops> = {
      success: true,
      data: crops,
      meta: {
        source: "Punjab Agriculture Department / PARC",
        asOf: "Oct 2026",
        status: "sample",
        recordCount: crops.length,
        disclaimer: "Agronomic guidelines are benchmarks for Punjab pilot conditions.",
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to retrieve crops catalog.",
        },
      },
      { status: 500 }
    );
  }
}
