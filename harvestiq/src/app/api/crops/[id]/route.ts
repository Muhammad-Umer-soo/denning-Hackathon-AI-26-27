import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbService } from "@/lib/server/db/client";
import { ApiResponse } from "@/lib/server/types";

const paramsSchema = z.object({
  id: z.enum(["wheat", "cotton", "maize", "rice"]),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const rawParams = await context.params;
    const parsed = paramsSchema.safeParse(rawParams);

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Crop with id '${rawParams.id}' is not in the pilot catalog (Wheat, Cotton, Maize, Rice).`,
          },
        },
        { status: 404 }
      );
    }

    const crop = await dbService.getCropById(parsed.data.id);
    if (!crop) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Crop '${parsed.data.id}' not found.`,
          },
        },
        { status: 404 }
      );
    }

    const response: ApiResponse<typeof crop> = {
      success: true,
      data: crop,
      meta: {
        source: crop.source,
        unit: "PKR / Maund / Acre",
        asOf: "Oct 2026",
        status: "sample",
        disclaimer:
          "Agronomic guidelines and yield scenarios are estimates for pilot planning, not guarantees of financial outcome.",
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to retrieve crop details.",
        },
      },
      { status: 500 }
    );
  }
}
