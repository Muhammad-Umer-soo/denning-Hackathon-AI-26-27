import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbService } from "@/lib/server/db/client";
import { ApiResponse } from "@/lib/server/types";

const scenarioInputSchema = z.object({
  acres: z
    .number()
    .min(0.5, "Minimum land size for scenario is 0.5 acres.")
    .max(500, "Maximum land size for pilot calculator is 500 acres."),
  cropIds: z
    .array(z.enum(["wheat", "cotton", "maize", "rice"]))
    .min(1, "Select at least 1 crop.")
    .max(4, "Select at most 4 crops."),
});

export async function POST(request: NextRequest) {
  try {
    let rawBody;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            code: "INVALID_JSON",
            message: "Request body must be valid JSON.",
          },
        },
        { status: 400 }
      );
    }

    const validation = scenarioInputSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid scenario parameters.",
            details: validation.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const { acres, cropIds } = validation.data;
    const allCrops = await dbService.getCrops();

    const scenarios = cropIds.map((cropId) => {
      const crop = allCrops.find((c) => c.id === cropId);
      if (!crop) {
        throw new Error(`Crop ${cropId} not found`);
      }

      const totalCost = crop.costPerAcre * acres;
      const totalEstimatedRevenue = crop.revenuePerAcre * acres;
      const estimatedNetMargin = totalEstimatedRevenue - totalCost;
      const returnOnInvestmentPct = Math.round((estimatedNetMargin / totalCost) * 100);

      return {
        cropId: crop.id,
        nameEn: crop.nameEn,
        nameUr: crop.nameUr,
        season: crop.season,
        acres,
        estimatedTotalCostPKR: totalCost,
        estimatedTotalRevenuePKR: totalEstimatedRevenue,
        estimatedNetMarginPKR: estimatedNetMargin,
        estimatedRoiPct: returnOnInvestmentPct,
        benchmarkPricePerMaundPKR: crop.pricePerMaund,
        typicalWaterRequirement: crop.waterReq,
        assumptions: {
          costBasisPerAcre: crop.costPerAcre,
          revenueBasisPerAcre: crop.revenuePerAcre,
          source: crop.source,
        },
      };
    });

    const response: ApiResponse<{
      landAreaAcres: number;
      currency: string;
      scenarios: typeof scenarios;
    }> = {
      success: true,
      data: {
        landAreaAcres: acres,
        currency: "PKR (Pakistani Rupee)",
        scenarios,
      },
      meta: {
        source: "Punjab Agriculture Department & PARC Benchmarks",
        unit: "PKR",
        asOf: "Oct 2026",
        status: "sample",
        disclaimer:
          "IMPORTANT DISCLAIMER: These calculations represent planning scenarios under normal weather and market conditions. Actual yields, input prices, pest pressures, and market rates fluctuate. HarvestIQ makes no financial guarantees or commitments.",
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to calculate scenario outcomes.",
        },
      },
      { status: 500 }
    );
  }
}
