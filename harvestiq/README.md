# 🌾 HarvestIQ (AgriWise)

> **Helping Pakistani farmers answer:** *What could I grow? What will it require? What is the market showing? Where can I find trusted support?*

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6?logo=typescript)](https://typescriptlang.org)
[![Neon Postgres](https://img.shields.io/badge/Neon-Postgres_18-00e5a0?logo=postgresql)](https://neon.tech)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Hackathon_MVP-orange)]()

---

## 📋 Overview

HarvestIQ is an agriculture decision-support MVP built for the **Denning AI Hackathon**. It provides farmers in **Punjab, Pakistan (Multan / Faisalabad belt)** with crop intelligence, real-time mandi prices, soil AI assistance, verified government schemes, and planning tools — all with transparent data provenance and safety guardrails.

**Pilot Scope:** 4 crops (Wheat 🌾, Cotton 🌿, Maize 🌽, Basmati Rice 🍚) × 1 geography (Punjab).

---

## ✨ Features (FR-01 → FR-09)

| FR-ID | Feature | Route | Description |
|-------|---------|-------|-------------|
| **FR-01** | Farmer Dashboard | `/` | Weather, mandi snapshot, crop cards, quick links |
| **FR-02** | Crop Catalog | `/crops`, `/crops/[id]` | Full agronomy guides with planting, irrigation, cost & yield data |
| **FR-03** | Mandi Prices | `/prices` | Live price cards + 6-month Recharts trend charts |
| **FR-04** | Soil AI Assistant | `/soil` | Photo-based soil observations with mandatory safety disclaimers |
| **FR-05** | Planner Indicators | `/planner` | Aggregated production & trade data (RBAC-protected) |
| **FR-06** | Scheme Directory | `/schemes` | Verified government financial schemes with eligibility & docs |
| **FR-07** | Urdu/RTL Support | All pages | Noto Nastaliq Urdu font, RTL-ready layout |
| **FR-08** | Crop Comparison | `/planner` | Interactive cost vs revenue calculator with Recharts |
| **FR-09** | Support Directory | `/support` | Extension officer contacts (PARC, UAF, Punjab Agri Dept) |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript (strict) |
| **Styling** | Tailwind CSS v4, Lucide React icons |
| **Charts** | Recharts |
| **Database** | Neon Postgres (serverless) + Drizzle ORM |
| **Validation** | Zod (client + server boundaries) |
| **Forms** | React Hook Form |
| **Testing** | Vitest (18 tests) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- A [Neon](https://neon.tech) account (free tier works)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-org/harvestiq.git
cd harvestiq

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your real keys (see below)

# 4. Run dev server
npm run dev
```

Open **http://localhost:3000**

### Environment Variables

Copy `.env.example` → `.env.local` and fill in:

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENROUTER_API_KEY` | OpenRouter AI key for soil assistant | Optional |
| `DATABASE_URL` | Neon Postgres connection string | Optional (falls back to sample data) |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub PAT for CI | Optional |
| `NEON_API_KEY` | Neon MCP API key | Optional |
| `STITCH_API_KEY` | Google Stitch API key | Optional |

> ⚠️ **Never commit `.env.local`** — it is git-ignored.

---

## 📡 Backend API Routes

All endpoints return standardized `ApiResponse<T>` with provenance metadata:

```
GET  /api/health                → System status & database mode
GET  /api/crops                 → 4 pilot crops (filter: ?season=Rabi|Kharif)
GET  /api/crops/[id]            → Full agronomy guide for a crop
GET  /api/prices                → Mandi prices + 6-month history
GET  /api/schemes               → Verified government schemes
GET  /api/planner/indicators    → Aggregated indicators (planner role required)
GET  /api/support               → Extension officer directory
POST /api/soil/assist           → AI soil observation (consent required)
POST /api/calculator/scenarios  → Crop comparison calculator
```

---

## 🛡️ Safety & Governance

This project is governed by the [CONSTITUTION.md](../CONSTITUTION.md):

- **Data Provenance (§3):** Every data card shows source, unit, timestamp, and `sample`/`live` status via `<ProvenanceBadge>`.
- **Soil AI Safety (§4):** Camera images **cannot** diagnose NPK/pH/salinity. Exact fertilizer doses are never prescribed from a photo.
- **Finance Integrity (§5):** No loan approvals, no custody of funds, no guaranteed disbursements.
- **Privacy (§6):** Planner endpoints enforce RBAC + minimum group size ≥ 5 to protect farmer anonymity.
- **No Secrets in Code (§7):** All keys in `.env.local` (git-ignored), validated by Zod at startup.

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Output:
# ✓ tests/backend.test.ts      (9 tests)  — Constitution verification
# ✓ tests/api-routes.test.ts   (9 tests)  — API handler integration
# Test Files  2 passed (2)
#      Tests  18 passed (18)
```

---

## 🗄️ Database Schema

7 tables in Neon Postgres (Drizzle ORM):

| Table | Purpose | Rows |
|-------|---------|------|
| `crops` | Pilot crop agronomic parameters | 4 |
| `mandi_prices` | Current market prices | 4 |
| `price_history` | 6-month benchmark trends | 24 |
| `schemes` | Verified government schemes | 3 |
| `planner_indicators` | Regional production/trade data | 4 |
| `extension_support` | Extension officer directory | 3 |
| `soil_assessments` | Soil AI audit log | 0+ |

---

## 📁 Project Structure

```
harvestiq/
├── src/
│   ├── app/
│   │   ├── api/              # Backend API routes
│   │   │   ├── health/
│   │   │   ├── crops/
│   │   │   ├── prices/
│   │   │   ├── schemes/
│   │   │   ├── planner/
│   │   │   ├── soil/
│   │   │   ├── calculator/
│   │   │   └── support/
│   │   ├── crops/            # Crop catalog pages
│   │   ├── prices/           # Mandi prices page
│   │   ├── soil/             # Soil AI assistant
│   │   ├── schemes/          # Finance schemes
│   │   ├── planner/          # Planner dashboard
│   │   ├── support/          # Extension directory
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx          # Dashboard
│   ├── components/           # Reusable UI components
│   └── lib/
│       ├── data.ts           # Client-side sample data
│       ├── utils.ts          # Utility functions
│       └── server/           # Server-only modules
│           ├── env.ts        # Zod env validation
│           ├── auth.ts       # RBAC guard
│           ├── types.ts      # API & Provenance types
│           └── db/
│               ├── schema.ts # Drizzle ORM schema
│               ├── client.ts # Neon connection + repository
│               └── seed.ts   # Verified sample seed data
├── tests/
│   ├── backend.test.ts       # Constitution verification tests
│   └── api-routes.test.ts    # API integration tests
├── docs/
│   ├── traceability.md       # FR-ID → feature → test matrix
│   └── decisions.md          # Architecture Decision Records
├── .env.example              # Environment template (safe to commit)
├── .env.local                # Real secrets (git-ignored)
├── CONSTITUTION.md           # Project governance
└── package.json
```

---

## 👥 Team

Built for the **Denning AI Hackathon 2026** 🇵🇰

---

## 📜 License

Hackathon MVP — All rights reserved.
