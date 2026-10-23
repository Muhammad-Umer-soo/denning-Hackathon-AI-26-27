# HarvestIQ (AgriWise) — Traceability Matrix

**Version:** 1.0  
**Status:** Active  
**Reference:** HarvestIQ Project Constitution & AgriWise PRD

---

## 1. Functional Requirements Matrix (FR-01 – FR-09)

| FR-ID | Feature Description | Priority | PRD Section | Issue | Branch / PR | Test / Verification | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-01** | **Farmer Dashboard**: Unified view showing pilot region, current season, weather summary, and crop suggestions | P0 (Core MVP) | §2.1 Farmer Experience | Planned | - | Unit / Component test | Planned |
| **FR-02** | **Crop Catalog & Agronomy Guides**: 3–5 pilot crops with comprehensive localized guides (planting, irrigation, costs, yield estimates) | P0 (Core MVP) | §2.2 Crop Intelligence | Planned | - | Content validation & unit test | Planned |
| **FR-03** | **Market & Mandi Price Intelligence**: Localized mandi prices with transparent provenance (source, unit, asOf timestamp, sample/live status) | P0 (Core MVP) | §2.3 Market Insights | Planned | - | Provenance card tests | Planned |
| **FR-04** | **Soil Assistant with Safety Guardrails**: AI-assisted soil observation analysis with disclaimers, limitations, and safety-first next steps | P0 (Core MVP) | §2.4 Soil Assistant | Planned | - | AI Safety & guardrail tests | Planned |
| **FR-05** | **Aggregated Planner Indicators**: Macro-level production and trade indicators (import/export balance) for authorized planners | P1 (Core MVP) | §2.5 Planner Insights | Planned | - | Aggregation privacy test (min group size) | Planned |
| **FR-06** | **Verified Financial Scheme Directory**: Curated list of authorized government schemes, eligibility, required documents, and official links | P1 (Core MVP) | §2.6 Finance Directory | Planned | - | Verification link & schema validation | Planned |
| **FR-07** | **UX, Accessibility & Urdu/RTL Support**: Mobile-first responsive UI, Urdu (اردو) language support, RTL layout, accessible contrast | P1 (Core MVP) | §2.7 UX & Localization | Planned | - | Playwright visual / a11y audit | Planned |
| **FR-08** | **Interactive Crop Comparison & Scenario Calculator**: Compare 2+ crops side-by-side with transparent cost/revenue assumptions | P2 (Secondary) | §2.8 Decision Support | Planned | - | Calculation accuracy tests | Planned |
| **FR-09** | **Extension Officer & Trusted Support Directory**: Contact points for verified local extension offices and agricultural departments | P2 (Secondary) | §2.9 Support Directory | Planned | - | Directory display & link test | Planned |

---

## 2. Pilot Scope Definition

- **Pilot Geography**: Punjab (e.g., Multan / Faisalabad agricultural zone), Pakistan.
- **Pilot Crops (4 crops)**:
  1. **Wheat (گندم)** — Major staple / Rabi season
  2. **Cotton (کپاس)** — Major cash crop / Kharif season
  3. **Maize (مکئی)** — High-yield grain & fodder
  4. **Basmati Rice (چاول)** — Major export & cash crop
- **Currency & Units**: PKR (₨), Maund (40 kg), Acre.
- **Data Status Labels**: `live`, `delayed`, `latest_reported`, `preliminary`, `final`, `sample`.

---

## 3. Scope Boundaries & Disclaimers

As governed by Constitution §2:
- ❌ No bank account opening, custody of funds, loan disbursement, or automatic lending decisions.
- ❌ No guaranteed yields, prices, or profit promises.
- ❌ No chemical fertilizer dosages prescribed from photo alone.
- ❌ No unverified nationwide extrapolation.
