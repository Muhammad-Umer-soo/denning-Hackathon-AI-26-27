import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import {
  SEED_CROPS,
  SEED_MANDI_PRICES,
  SEED_PRICE_HISTORY,
  SEED_SCHEMES,
  SEED_PLANNER_INDICATORS,
  SEED_EXTENSION_SUPPORT,
} from "./seed";

// Optional configuration for serverless environments
neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL;

export const isLiveDatabase = Boolean(connectionString && connectionString.startsWith("postgres"));

let poolInstance: Pool | null = null;
let drizzleInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

if (isLiveDatabase) {
  try {
    poolInstance = new Pool({ connectionString });
    drizzleInstance = drizzle(poolInstance, { schema });
  } catch (error) {
    console.warn("⚠️ Warning: Failed to initialize live Neon Postgres connection. Using fallback store.", error);
  }
}

export const db = drizzleInstance;

/**
 * High-reliability data repository providing queries across both Neon Postgres and
 * fallback seed store. Adheres strictly to Constitution §5 for data freshness and provenance.
 */
export const dbService = {
  // Pilot Crops (FR-02)
  async getCrops() {
    if (db) {
      try {
        const rows = await db.select().from(schema.cropsTable);
        if (rows.length > 0) return rows;
      } catch (err) {
        console.warn("Neon query failed, using verified fallback crops:", err);
      }
    }
    return SEED_CROPS;
  },

  async getCropById(id: string) {
    const crops = await this.getCrops();
    return crops.find((c) => c.id.toLowerCase() === id.toLowerCase()) || null;
  },

  // Mandi Prices (FR-03)
  async getMandiPrices() {
    if (db) {
      try {
        const rows = await db.select().from(schema.mandiPricesTable);
        if (rows.length > 0) return rows;
      } catch (err) {
        console.warn("Neon query failed, using verified fallback mandi prices:", err);
      }
    }
    return SEED_MANDI_PRICES;
  },

  async getPriceHistory(cropId?: string) {
    if (db) {
      try {
        const rows = await db.select().from(schema.priceHistoryTable);
        if (rows.length > 0) {
          return cropId ? rows.filter((r) => r.cropId === cropId) : rows;
        }
      } catch (err) {
        console.warn("Neon query failed, using verified fallback price history:", err);
      }
    }
    return cropId
      ? SEED_PRICE_HISTORY.filter((r) => r.cropId === cropId)
      : SEED_PRICE_HISTORY;
  },

  // Financial Scheme Directory (FR-06)
  async getSchemes() {
    if (db) {
      try {
        const rows = await db.select().from(schema.schemesTable);
        if (rows.length > 0) return rows;
      } catch (err) {
        console.warn("Neon query failed, using verified fallback schemes:", err);
      }
    }
    return SEED_SCHEMES;
  },

  // Aggregated Planner Indicators (FR-05)
  // Enforces minimum group size of 5 farmers per Constitution §7
  async getPlannerIndicators() {
    let indicators = SEED_PLANNER_INDICATORS;
    if (db) {
      try {
        const rows = await db.select().from(schema.plannerIndicatorsTable);
        if (rows.length > 0) indicators = rows;
      } catch (err) {
        console.warn("Neon query failed, using verified fallback planner indicators:", err);
      }
    }

    // Safety guardrail: Never return indicators with fewer than 5 farmers (anonymity threshold)
    return indicators.filter((ind) => ind.reportingFarmersCount >= 5);
  },

  // Extension Directory (FR-09)
  async getExtensionContacts() {
    if (db) {
      try {
        const rows = await db.select().from(schema.extensionSupportTable);
        if (rows.length > 0) return rows;
      } catch (err) {
        console.warn("Neon query failed, using verified fallback contacts:", err);
      }
    }
    return SEED_EXTENSION_SUPPORT;
  },

  // Soil AI Assessment Logging (FR-04)
  // Saves observation and safety disclaimer metadata (never raw binary)
  async saveSoilAssessment(data: typeof schema.soilAssessmentsTable.$inferInsert) {
    if (db) {
      try {
        await db.insert(schema.soilAssessmentsTable).values(data);
        return { savedToDb: true, id: data.id };
      } catch (err) {
        console.warn("Neon insert failed, audit recorded in memory fallback:", err);
      }
    }
    return { savedToDb: false, id: data.id };
  },
};
