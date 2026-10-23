import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbService } from "@/lib/server/db/client";
import { ApiResponse } from "@/lib/server/types";

const querySchema = z.object({
  cropId: z.string().optional(),
  includeHistory: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => val === "true"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = querySchema.safeParse({
      cropId: searchParams.get("cropId") || undefined,
      includeHistory: searchParams.get("includeHistory") || "true",
    });

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            code: "INVALID_QUERY",
            message: "Invalid query parameters.",
            details: parsed.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const prices = await dbService.getMandiPrices();
    const history = parsed.data.includeHistory
      ? await dbService.getPriceHistory(parsed.data.cropId)
      : undefined;

    const filteredPrices = parsed.data.cropId
      ? prices.filter((p) => p.cropId === parsed.data.cropId)
      : prices;

    const response: ApiResponse<{
      currentPrices: typeof filteredPrices;
      priceHistory?: typeof history;
    }> = {
      success: true,
      data: {
        currentPrices: filteredPrices,
        priceHistory: history,
      },
      meta: {
        source: "Punjab Agriculture Marketing Information Service (AMIS)",
        unit: "PKR / 40kg (Maund)",
        asOf: "Oct 2026",
        status: "sample",
        recordCount: filteredPrices.length,
        disclaimer:
          "Benchmark mandi rates are collected for demonstration. Check local market commission agents for daily trading rates.",
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to retrieve mandi prices.",
        },
      },
      { status: 500 }
    );
  }
}
