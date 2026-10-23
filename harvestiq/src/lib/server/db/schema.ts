import { pgTable, text, integer, timestamp, real, jsonb } from "drizzle-orm/pg-core";

/**
 * Pilot Crops Table
 * FR-02: Crop Catalog & Agronomy Guides
 */
export const cropsTable = pgTable("crops", {
  id: text("id").primaryKey(), // wheat, cotton, maize, rice
  nameEn: text("name_en").notNull(),
  nameUr: text("name_ur").notNull(),
  season: text("season").notNull(), // Rabi, Kharif
  icon: text("icon").notNull(),
  description: text("description").notNull(),
  climate: text("climate").notNull(),
  soil: text("soil").notNull(),
  yieldPerAcre: text("yield_per_acre").notNull(),
  costPerAcre: integer("cost_per_acre").notNull(), // PKR
  revenuePerAcre: integer("revenue_per_acre").notNull(), // PKR
  pricePerMaund: integer("price_per_maund").notNull(), // PKR / 40kg
  waterReq: text("water_req").notNull(),
  plantingWindow: text("planting_window").notNull(),
  source: text("source").notNull(), // PARC / Punjab Agriculture Dept
  status: text("status").notNull().default("sample"), // sample, live, latest_reported
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Mandi Prices Table
 * FR-03: Mandi Price Intelligence
 */
export const mandiPricesTable = pgTable("mandi_prices", {
  id: text("id").primaryKey(),
  cropId: text("crop_id").notNull().references(() => cropsTable.id),
  cropName: text("crop_name").notNull(),
  cropNameUr: text("crop_name_ur").notNull(),
  marketName: text("market_name").notNull(), // Multan, Faisalabad
  price: integer("price").notNull(),
  unit: text("unit").notNull(), // PKR/40kg
  changePct: real("change_pct").notNull(),
  status: text("status").notNull().default("sample"), // sample, live, delayed
  source: text("source").notNull(), // Punjab AMIS
  asOf: text("as_of").notNull(),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

/**
 * Historical Mandi Prices Table
 * FR-03: 6-Month Historical Trends
 */
export const priceHistoryTable = pgTable("price_history", {
  id: text("id").primaryKey(),
  cropId: text("crop_id").notNull().references(() => cropsTable.id),
  month: text("month").notNull(),
  year: integer("year").notNull(),
  price: integer("price").notNull(),
  unit: text("unit").notNull(),
  status: text("status").notNull().default("sample"),
  source: text("source").notNull(),
});

/**
 * Verified Government Financial Schemes Table
 * FR-06: Financial Scheme Directory
 */
export const schemesTable = pgTable("schemes", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  eligibility: text("eligibility").notNull(),
  benefits: text("benefits").notNull(),
  documents: jsonb("documents").$type<string[]>().notNull(),
  officialUrl: text("official_url").notNull(),
  verifiedAt: text("verified_at").notNull(),
  status: text("status").notNull().default("active"),
  source: text("source").notNull(),
});

/**
 * Aggregated Planner Indicators Table
 * FR-05: Macro-Level Production & Trade Indicators
 * Note: Must enforce min aggregation group size (>= 5 farmers) per Constitution §7 & §10
 */
export const plannerIndicatorsTable = pgTable("planner_indicators", {
  id: text("id").primaryKey(),
  cropId: text("crop_id").notNull().references(() => cropsTable.id),
  cropName: text("crop_name").notNull(),
  region: text("region").notNull(), // Punjab Agricultural Belt
  season: text("season").notNull(),
  year: integer("year").notNull(),
  estimatedProductionTons: integer("estimated_production_tons").notNull(),
  exportVolumeTons: integer("export_volume_tons").notNull(),
  importVolumeTons: integer("import_volume_tons").notNull(),
  reportingFarmersCount: integer("reporting_farmers_count").notNull(), // Must be >= 5
  source: text("source").notNull(), // Pakistan Bureau of Statistics / Punjab Dept
  status: text("status").notNull().default("sample"),
  asOf: text("as_of").notNull(),
});

/**
 * Soil AI Assessments Table
 * FR-04: Soil Assistant Audit Record
 * Note: Images stored in object storage / keys only, not raw binaries (Constitution §6)
 */
export const soilAssessmentsTable = pgTable("soil_assessments", {
  id: text("id").primaryKey(),
  imageKey: text("image_key").notNull(),
  cropHint: text("crop_hint"),
  district: text("district").notNull().default("Multan"),
  observations: text("observations").notNull(),
  confidence: text("confidence").notNull(),
  limitations: text("limitations").notNull(),
  missingContext: text("missing_context").notNull(),
  safeNextSteps: text("safe_next_steps").notNull(),
  disclaimer: text("disclaimer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Extension Officer & Support Directory Table
 * FR-09: Trusted Support Directory
 */
export const extensionSupportTable = pgTable("extension_support", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameUr: text("name_ur").notNull(),
  role: text("role").notNull(),
  organization: text("organization").notNull(),
  phone: text("phone").notNull(),
  district: text("district").notNull(),
  address: text("address").notNull(),
  hours: text("hours").notNull(),
  officialUrl: text("official_url").notNull(),
  verifiedAt: text("verified_at").notNull(),
});
