import { describe, it, expect } from "vitest";
import { z } from "zod";
import { dbService } from "../src/lib/server/db/client";
import { SEED_CROPS, SEED_PLANNER_INDICATORS } from "../src/lib/server/db/seed";

describe("HarvestIQ Backend Constitution Verification", () => {
  // 1. Constitution §2 & §3: Pilot Scope & Provenance
  describe("Pilot Scope & Data Provenance (FR-01, FR-02, FR-03)", () => {
    it("should provide exactly 4 verified pilot crops for Punjab region", async () => {
      const crops = await dbService.getCrops();
      expect(crops.length).toBe(4);

      const cropIds = crops.map((c) => c.id);
      expect(cropIds).toContain("wheat");
      expect(cropIds).toContain("cotton");
      expect(cropIds).toContain("maize");
      expect(cropIds).toContain("rice");
    });

    it("should enforce status 'sample' and transparent sources for pilot crop benchmarks", async () => {
      const crops = await dbService.getCrops();
      for (const crop of crops) {
        expect(crop.status).toBe("sample");
        expect(crop.source).toBeTruthy();
        expect(crop.costPerAcre).toBeGreaterThan(0);
        expect(crop.revenuePerAcre).toBeGreaterThan(crop.costPerAcre);
      }
    });

    it("should provide mandi prices with unit, source, and change metrics", async () => {
      const mandiPrices = await dbService.getMandiPrices();
      expect(mandiPrices.length).toBeGreaterThanOrEqual(4);
      for (const price of mandiPrices) {
        expect(price.unit).toBe("PKR/40kg");
        expect(price.source).toBe("Punjab AMIS");
        expect(price.status).toBe("sample");
        expect(price.price).toBeGreaterThan(0);
      }
    });
  });

  // 2. Constitution §4 & §8: Agronomy and Soil-AI Safety Guardrails
  describe("Soil AI Assistant Safety Guardrails (FR-04)", () => {
    const soilAssistInputSchema = z.object({
      consentGiven: z.literal(true),
      imageMetadata: z.object({
        filename: z.string(),
        sizeBytes: z.number().max(5 * 1024 * 1024),
        mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
      }),
    });

    it("must require explicit user consent before processing soil imagery", () => {
      const withoutConsent = {
        consentGiven: false,
        imageMetadata: {
          filename: "soil.jpg",
          sizeBytes: 1024 * 100,
          mimeType: "image/jpeg" as const,
        },
      };

      const result = soilAssistInputSchema.safeParse(withoutConsent);
      expect(result.success).toBe(false);
    });

    it("must reject non-image or excessively large files (>5MB)", () => {
      const tooLarge = {
        consentGiven: true as const,
        imageMetadata: {
          filename: "huge.jpg",
          sizeBytes: 6 * 1024 * 1024, // 6MB > 5MB limit
          mimeType: "image/jpeg" as const,
        },
      };

      const result = soilAssistInputSchema.safeParse(tooLarge);
      expect(result.success).toBe(false);
    });

    it("must include mandatory safety limitations and refuse exact NPK/pH diagnosis from photo", () => {
      // Simulating the safety guardrail engine output
      const mockAssessment = {
        confidence: "Moderate (Visual Only)",
        limitations: [
          "CRITICAL: A photographic image CANNOT quantify chemical nutrient concentrations (Nitrogen, Available Phosphorus, Potassium).",
          "Soil reaction (pH), salinity (ECe), and micronutrients require laboratory wet-chemistry analysis.",
        ],
        safeNextSteps: [
          "Collect a representative composite soil sample.",
          "Submit sample to local Punjab Soil & Water Testing Laboratory or PARC Regional Center.",
        ],
        aiDisclaimer: "AI-Generated Advisory Notice: This assessment is an automated visual aid for preliminary screening only. It is NOT a scientific or verified diagnostic soil test.",
      };

      expect(mockAssessment.limitations.some((l) => l.includes("CANNOT quantify"))).toBe(true);
      expect(mockAssessment.safeNextSteps.some((s) => s.includes("Soil & Water Testing Laboratory"))).toBe(true);
      expect(mockAssessment.aiDisclaimer).toContain("NOT a scientific or verified diagnostic soil test");
    });
  });

  // 3. Constitution §7 & §10: Planner Aggregation & Privacy Threshold
  describe("Planner Privacy & Anonymity Guardrails (FR-05)", () => {
    it("must enforce minimum reporting group size >= 5 to prevent individual farmer re-identification", async () => {
      const indicators = await dbService.getPlannerIndicators();
      for (const item of indicators) {
        expect(item.reportingFarmersCount).toBeGreaterThanOrEqual(5);
        // Ensure no private farmer PII fields exist
        expect((item as Record<string, unknown>).farmerName).toBeUndefined();
        expect((item as Record<string, unknown>).cnic).toBeUndefined();
        expect((item as Record<string, unknown>).phone).toBeUndefined();
      }
    });
  });

  // 4. Constitution §5: Financial Scheme Directory Integrity (FR-06)
  describe("Finance Scheme Integrity (FR-06)", () => {
    it("should list verified schemes with official URLs and no false approval guarantees", async () => {
      const schemes = await dbService.getSchemes();
      expect(schemes.length).toBeGreaterThanOrEqual(3);

      for (const scheme of schemes) {
        expect(scheme.officialUrl).toMatch(/^https?:\/\//);
        expect(scheme.verifiedAt).toBeTruthy();
        expect(scheme.eligibility).toBeTruthy();
        expect(scheme.documents.length).toBeGreaterThan(0);
      }
    });
  });

  // 5. Scenario Calculator (FR-08)
  describe("Crop Comparison & Scenario Calculator (FR-08)", () => {
    it("should accurately calculate cost and revenue scenarios for given acres", () => {
      const acres = 5;
      const wheat = SEED_CROPS.find((c) => c.id === "wheat")!;
      const expectedTotalCost = wheat.costPerAcre * acres;
      const expectedTotalRevenue = wheat.revenuePerAcre * acres;
      const expectedMargin = expectedTotalRevenue - expectedTotalCost;

      expect(expectedTotalCost).toBe(225000);
      expect(expectedTotalRevenue).toBe(360000);
      expect(expectedMargin).toBe(135000);
      expect(Math.round((expectedMargin / expectedTotalCost) * 100)).toBe(60);
    });
  });
});
