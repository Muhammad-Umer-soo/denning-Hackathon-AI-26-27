import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { GET as getHealth } from "../src/app/api/health/route";
import { GET as getCrops } from "../src/app/api/crops/route";
import { GET as getCropDetail } from "../src/app/api/crops/[id]/route";
import { GET as getPrices } from "../src/app/api/prices/route";
import { GET as getSchemes } from "../src/app/api/schemes/route";
import { GET as getPlannerIndicators } from "../src/app/api/planner/indicators/route";
import { POST as postSoilAssist } from "../src/app/api/soil/assist/route";
import { POST as postCalculator } from "../src/app/api/calculator/scenarios/route";
import { GET as getSupport } from "../src/app/api/support/route";

describe("HarvestIQ API Handlers Integration", () => {
  it("GET /api/health returns operational status and pilot region", async () => {
    const res = await getHealth();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.pilotRegion).toContain("Punjab");
    expect(json.data.cropsCount).toBe(4);
  });

  it("GET /api/crops returns 4 pilot crops with provenance metadata", async () => {
    const req = new NextRequest("http://localhost:3000/api/crops");
    const res = await getCrops(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBe(4);
    expect(json.meta.status).toBe("sample");
    expect(json.meta.source).toBeTruthy();
  });

  it("GET /api/crops/[id] returns detail for valid crop and 404 for unknown crop", async () => {
    const req = new NextRequest("http://localhost:3000/api/crops/wheat");
    const res = await getCropDetail(req, { params: Promise.resolve({ id: "wheat" }) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.id).toBe("wheat");
    expect(json.data.nameUr).toBe("گندم");

    // Invalid crop
    const resNotFound = await getCropDetail(req, { params: Promise.resolve({ id: "banana" }) });
    expect(resNotFound.status).toBe(404);
  });

  it("GET /api/prices returns current mandi prices and historical trends", async () => {
    const req = new NextRequest("http://localhost:3000/api/prices?includeHistory=true");
    const res = await getPrices(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.currentPrices.length).toBeGreaterThanOrEqual(4);
    expect(json.data.priceHistory.length).toBeGreaterThan(0);
    expect(json.meta.unit).toBe("PKR / 40kg (Maund)");
  });

  it("GET /api/schemes returns verified government schemes and disclaimer", async () => {
    const res = await getSchemes();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThanOrEqual(3);
    expect(json.meta.disclaimer).toContain("We do not process loan applications");
  });

  it("GET /api/planner/indicators enforces RBAC (403 for farmer, 200 for planner)", async () => {
    // 1. Without planner role (defaults to farmer) -> 403 Forbidden
    const unauthReq = new NextRequest("http://localhost:3000/api/planner/indicators");
    const unauthRes = await getPlannerIndicators(unauthReq);
    expect(unauthRes.status).toBe(403);

    // 2. With planner role header -> 200 OK
    const plannerReq = new NextRequest("http://localhost:3000/api/planner/indicators", {
      headers: { "x-user-role": "planner" },
    });
    const plannerRes = await getPlannerIndicators(plannerReq);
    expect(plannerRes.status).toBe(200);
    const json = await plannerRes.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThan(0);
    // Anonymity guardrail: min group size
    for (const ind of json.data) {
      expect(ind.reportingFarmersCount).toBeGreaterThanOrEqual(5);
    }
  });

  it("POST /api/soil/assist rejects request without consent and accepts valid request with safety disclaimers", async () => {
    // 1. Without consent
    const noConsentReq = new NextRequest("http://localhost:3000/api/soil/assist", {
      method: "POST",
      body: JSON.stringify({
        consentGiven: false,
        imageMetadata: { filename: "soil.jpg", sizeBytes: 1000, mimeType: "image/jpeg" },
      }),
    });
    const noConsentRes = await postSoilAssist(noConsentReq);
    expect(noConsentRes.status).toBe(400);

    // 2. With consent and valid metadata
    const validReq = new NextRequest("http://localhost:3000/api/soil/assist", {
      method: "POST",
      body: JSON.stringify({
        consentGiven: true,
        cropHint: "Wheat",
        district: "Multan",
        imageMetadata: { filename: "soil_sample.jpg", sizeBytes: 50000, mimeType: "image/jpeg" },
      }),
    });
    const validRes = await postSoilAssist(validReq);
    expect(validRes.status).toBe(200);
    const json = await validRes.json();
    expect(json.success).toBe(true);
    expect(json.data.aiDisclaimer).toContain("NOT a scientific or verified diagnostic soil test");
    expect(json.data.limitations.some((l: string) => l.includes("CANNOT quantify"))).toBe(true);
  });

  it("POST /api/calculator/scenarios computes scenarios and bounds land area", async () => {
    const req = new NextRequest("http://localhost:3000/api/calculator/scenarios", {
      method: "POST",
      body: JSON.stringify({
        acres: 10,
        cropIds: ["wheat", "cotton"],
      }),
    });
    const res = await postCalculator(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.landAreaAcres).toBe(10);
    expect(json.data.scenarios.length).toBe(2);
    expect(json.meta.disclaimer).toContain("IMPORTANT DISCLAIMER");
  });

  it("GET /api/support returns extension support contacts", async () => {
    const res = await getSupport();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.length).toBeGreaterThanOrEqual(3);
  });
});
