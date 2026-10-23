# HarvestIQ (AgriWise) — Architecture & Product Decisions (ADR)

**Reference:** Project Constitution §2 & §13

---

## ADR-001: Technical Baseline Stack
- **Status:** Approved
- **Context:** Project Constitution §8 establishes the technical baseline for the Hackathon MVP.
- **Decision:**
  - **Framework:** Next.js (App Router), React 19, TypeScript (strict mode).
  - **Styling & UI:** Tailwind CSS, shadcn/ui component primitives, Lucide React icons.
  - **Data Visualization:** Recharts for price trends, trade indicators, and scenario comparison.
  - **Forms & Validation:** React Hook Form with Zod schemas at both client and server boundaries.
  - **Internationalization:** `next-intl` supporting English (LTR) and Urdu (RTL).
  - **Database & ORM:** Neon Postgres (serverless) with Drizzle ORM.
  - **Deployment:** Vercel with GitHub CI/CD workflows.

---

## ADR-002: Pilot Region & Pilot Crop Selection
- **Status:** Approved
- **Context:** Constitution §2 limits the MVP demo to one pilot geography and 3–5 crops with verifiable data sources.
- **Decision:**
  - Pilot Region: **Punjab, Pakistan (Multan / Faisalabad agricultural belt)**.
  - Pilot Crops:
    1. **Wheat (گندم)**
    2. **Cotton (کپاس)**
    3. **Maize (مکئی)**
    4. **Basmati Rice (چاول)**
  - Rationale: High economic significance, widely documented agronomic parameters, transparent mandi price benchmarks (AMIS / Punjab Agriculture Department), and distinct seasonal cycles (Rabi vs. Kharif).

---

## ADR-003: Data Provenance & Safety First Policy
- **Status:** Approved
- **Context:** Constitution §3 and §4 mandate strict truthfulness, provenance tags, and soil safety guardrails.
- **Decision:**
  - Every price, trade indicator, and agronomic benchmark must render a `<ProvenanceBadge>` displaying:
    - Source name (e.g., "Punjab AMIS", "PARC", "Sample Benchmark")
    - Unit (e.g., "PKR / 40kg", "PKR / Acre")
    - `asOf` timestamp / reporting period
    - Status badge (`live`, `sample`, `latest_reported`)
  - Soil AI assistant answers must explicitly disclose that camera images cannot measure NPK/pH/salinity and refer to local laboratory testing before applying inputs.

---

## ADR-004: Branching Strategy & Git Change Control
- **Status:** Approved
- **Context:** Constitution §10 mandates working in small feature branches mapped to FR-IDs.
- **Decision:**
  - Branch naming convention: `feat/FR-<ID>-<short-description>` (e.g., `feat/FR-01-dashboard`).
  - Pull Requests must document PRD section, changes, verification, and update `docs/traceability.md`.
