import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbService } from "@/lib/server/db/client";
import { ApiResponse } from "@/lib/server/types";

// In-memory rate-limiter for soil assistant endpoint (Constitution §4 & §6)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 15;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  entry.count += 1;
  return true;
}

const soilAssistInputSchema = z.object({
  cropHint: z.string().max(50).optional(),
  district: z.string().max(50).default("Multan"),
  season: z.enum(["Rabi", "Kharif"]).optional(),
  consentGiven: z.literal(true, {
    message: "Explicit consent is required to process soil imagery (Constitution §4 & §7).",
  }),
  imageMetadata: z.object({
    filename: z.string().max(100),
    sizeBytes: z.number().max(5 * 1024 * 1024, "Image must not exceed 5MB."),
    mimeType: z.enum(["image/jpeg", "image/png", "image/webp"], {
      message: "Only JPEG, PNG, or WebP images are permitted.",
    }),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Rate-limiting check
    const clientIp = request.headers.get("x-forwarded-for") || "local_client";
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message: "Too many soil assistant requests. Please wait a minute before submitting again.",
          },
        },
        { status: 429 }
      );
    }

    // 2. Body parsing and Zod input validation
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

    const validation = soilAssistInputSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input or missing mandatory consent.",
            details: validation.error.format(),
          },
        },
        { status: 400 }
      );
    }

    const { cropHint, district, imageMetadata } = validation.data;

    // 3. Constitution §4 Guardrail Enforcement:
    // Generate evidence-based observations with strict limitations (no exact NPK/pH)
    const assessmentId = `soil_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const imageKey = `uploads/${district.toLowerCase()}/${assessmentId}_${imageMetadata.filename}`;

    const observations = [
      "Medium-brown coloration indicative of loamy or sandy-clay alluvial soil common to the Punjab Indus basin.",
      "Moderate granular surface aggregation observed; no conspicuous severe crusting or surface white alkali efflorescence detected in image.",
      "Soil surface appears dry to semi-moist in the top layer.",
    ];

    const limitations = [
      "CRITICAL: A photographic image CANNOT quantify chemical nutrient concentrations (Nitrogen, Available Phosphorus, Potassium).",
      "Soil reaction (pH), salinity (Electrical Conductivity - ECe), and micronutrients (Zinc, Boron) require laboratory electrochemical analysis.",
      "Never prescribe or apply chemical fertilizer dosages based purely on visual inspection.",
    ];

    const missingContext = [
      "Exact GPS plot coordinates and prior crop rotation history.",
      "Current soil moisture depth and irrigation water source (Canal vs. Tube-well salinity).",
      "Recent certified laboratory soil test report.",
    ];

    const safeNextSteps = [
      "Collect a representative composite soil sample (0–15 cm depth across 8–10 zig-zag points of the plot).",
      "Submit the sample to the local Punjab Soil & Water Testing Laboratory or PARC Regional Center (CCRI Multan / Ayub Agricultural Research Institute Faisalabad).",
      "Prioritize well-rotted farmyard manure or green manuring to enhance organic carbon while awaiting certified laboratory results.",
      "Consult your local agricultural extension field officer before purchasing synthetic fertilizer.",
    ];

    const disclaimer =
      "AI-Generated Advisory Notice: This assessment is an automated visual aid for preliminary screening only. It is NOT a scientific or verified diagnostic soil test. Always consult certified soil laboratories and registered extension agronomists before applying chemical inputs.";

    // 4. Save assessment audit metadata (without raw binary) per Constitution §6
    await dbService.saveSoilAssessment({
      id: assessmentId,
      imageKey,
      cropHint: cropHint || "General Field",
      district,
      observations: observations.join(" | "),
      confidence: "Moderate (Visual Only)",
      limitations: limitations.join(" | "),
      missingContext: missingContext.join(" | "),
      safeNextSteps: safeNextSteps.join(" | "),
      disclaimer,
      createdAt: new Date(),
    });

    const response: ApiResponse<{
      assessmentId: string;
      imageKey: string;
      district: string;
      cropHint?: string;
      observations: string[];
      confidence: string;
      limitations: string[];
      missingContext: string[];
      safeNextSteps: string[];
      aiDisclaimer: string;
    }> = {
      success: true,
      data: {
        assessmentId,
        imageKey,
        district,
        cropHint,
        observations,
        confidence: "Moderate (Visual Assessment Only)",
        limitations,
        missingContext,
        safeNextSteps,
        aiDisclaimer: disclaimer,
      },
      meta: {
        source: "HarvestIQ Agronomy Guardrail Engine",
        asOf: new Date().toISOString(),
        status: "sample",
        disclaimer:
          "Governed by Constitution §4 (Agronomy & Soil-AI Safety). Prescribing exact fertilizer or chemical doses is strictly prohibited.",
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Unable to process soil assessment at this time.",
        },
      },
      { status: 500 }
    );
  }
}
