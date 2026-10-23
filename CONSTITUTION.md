# HarvestIQ (AgriWise) — Project Constitution

**Version:** 1.0  
**Purpose:** Governing principles for planning, building, reviewing, and demoing the hackathon MVP.

This constitution is based on the AgriWise PRD and the team's HarvestIQ Goal Prompts and Instruction Prompts. It governs all agents and contributors. If a request conflicts with this constitution or the PRD's MVP boundaries, pause, explain the conflict, and propose an in-scope alternative.

---

## 1. Mission

HarvestIQ helps farmers answer: **What could I grow? What will it require? What is the market showing? Where can I find trusted support?**

It also provides authorized planners with aggregated production and import/export indicators. Build a credible end-to-end demo, not a broad product based on unsupported claims.

---

## 2. PRD Traceability and MVP Scope

- Every feature and agent task must map to a PRD section and/or FR-ID (FR-01–FR-09).
- Maintain `docs/traceability.md` (FR-ID → feature → issue → PR → test) and `docs/decisions.md` for open questions.
- Limit the demo to **one pilot geography and 3–5 crops**, using data whose source can be explained.
- Prioritize FR-01–FR-07: farmer dashboard, crop information, prices, soil assistant, production/trade indicators, and verified scheme directory. FR-08/FR-09 are secondary if time/data permit.
- Anything not traceable to the PRD is scope creep and must be reviewed by the PRD Guardian.

### Explicitly out of scope

Do not build bank-account opening/management, custody of funds, loan disbursement or lending decisions; guaranteed prices, yields, profits, fertilizer doses or loan approvals; automated government scheme allocation/policy decisions; nationwide coverage without confirmed sources; or soil diagnosis/fertilizer prescriptions from a photo alone.

---

## 3. Truthfulness, Provenance, and Freshness

- Every displayed price, production, or trade value must show source, unit, observation timestamp/reporting period, and status.
- Label data `live`, `delayed`, `latest_reported`, `preliminary`, `final`, or `sample` as applicable. Never present stale/sample data as live.
- Distinguish official/source data, user input, estimates, and AI-generated content.
- Demo/mock data is allowed only when visibly labeled and attributed to a sample source.
- If reliable data is unavailable, show a clear unavailable state; never invent or silently substitute stale values.
- Maintain a source register (owner/provider, update frequency, coverage, units, license/permission, fallback).
- Estimates must state assumptions and local currency. Yield/revenue scenarios are not promises.

---

## 4. Agronomy and Soil-AI Safety

- Localize guidance by geography, crop, season, and farm conditions; use expert review where feasible.
- Crop guides should cover: overview; climate/soil; varieties; planting calendar; land preparation; seed/spacing; water/irrigation; fertilizer; labor/machinery; harvest/post-harvest; pests/diseases; cost assumptions; estimated yield/revenue.
- Give fertilizer ranges only when supported by a trusted, cited agronomic source and applicable conditions. Otherwise refer to a soil test or local agronomist/extension officer.
- A soil photo alone cannot reliably establish nutrient levels, pH, salinity, or fertilizer dosage. Never prescribe exact nutrients/doses from an image.
- Soil-assistant responses must explain likely observations, confidence, limitations, missing context (crop, location, season, irrigation, soil-test values), and safe next steps.
- Label AI output and display a visible disclaimer. Require consent for uploads, validate file type/size, strip EXIF where applicable, and support deletion.
- Treat unsafe agronomy output as high severity; add guardrail tests and involve AI Safety.

---

## 5. Finance Scheme Integrity

- List only official/authorized schemes. Include provider, eligibility, documents, deadlines if known, benefits, repayment terms if applicable, official URL, and `verified_at`.
- Tell farmers to confirm eligibility and terms with the provider; never promise approval/subsidy/disbursement.
- Never collect bank credentials, card numbers, or unnecessary sensitive financial data.
- Future banking integrations require an authorized partner, consent, and security/compliance review; they are outside this MVP.

---

## 6. Privacy and Security

- Collect minimum personal data; obtain consent for optional profile data and soil uploads; provide deletion/export controls where applicable.
- Enforce user ownership and authorization server-side, not only in UI.
- Planner views must be aggregated and must not expose identifiable farmers; use minimum aggregation groups (e.g. five) where appropriate.
- Use role-based access (farmer/officer/planner/admin as implemented).
- Keep secrets out of source, client bundles, network responses, and logs. Validate environment variables.
- Validate inputs at client/server boundaries and rate-limit soil-assistant endpoints.
- Destructive database/repository/deployment or secret-management actions require human approval.

---

## 7. UX, Accessibility, and Localization

- Mobile-first for limited bandwidth, digital literacy, and device capability.
- Plain language, readable typography, semantic/keyboard-accessible controls, visible focus, and adequate touch targets.
- Prepare Urdu/RTL support; color must not be the only status signal.
- Provide loading, empty, error, and unavailable states. Show freshness and AI/estimate disclaimers where decisions are made.

---

## 8. Approved Technical Baseline

Unless a human-approved, PRD-aligned decision changes it:

- Next.js App Router, React, TypeScript strict mode.
- Tailwind CSS, shadcn/ui, Recharts.
- React Hook Form, Zod, next-intl (Urdu RTL).
- Neon Postgres, Drizzle ORM, `@neondatabase/serverless`.
- pnpm, ESLint, Prettier; Vitest and Playwright as appropriate.
- Vercel deployment and GitHub repository/workflow.

### Engineering rules

- Prefer React Server Components; use client components only for necessary interactivity.
- Keep database access in server-only modules; client components never query the DB.
- Avoid `any`; document an exception if unavoidable.
- Validate inputs and environment variables with Zod.
- Shared data cards must require source, unit, timestamp/`asOf`, and status.
- Keep user-facing strings in localization files.
- Async features need loading/empty/error/unavailable states.
- Cache reference data without misrepresenting its freshness.

---

## 9. Database and Migration Safety

- Inspect schema before changing it. Use versioned migrations and test them on a Neon branch before production.
- Price/production/trade records must enforce provenance, unit, time/period, and status.
- Use transactions for multi-statement changes and seeds; mark seeded records as `sample`.
- Store soil images outside the DB; store object keys and necessary metadata only.
- Use least-privilege roles and scoped queries.
- Never experiment with destructive SQL in production. Stop and request human approval before `DROP`/`TRUNCATE` or deleting projects/branches.

---

## 10. GitHub Change Control

- Create/update an issue before implementation; include FR-ID and PRD section.
- Work in small feature/fix branches and PRs; do not push directly to protected `main`.
- PRs state what/why, FR-ID, verification, limitations; include UI screenshots/preview where useful.
- CI must pass typecheck, lint, tests, build, and secret scan before merge.
- Update traceability in the feature PR. Never commit `.env`; use placeholder `.env.example`.
- Human review is required for merges and sensitive operational changes.

---

## 11. Agent Roles and Handoffs

Coordinate through the Master Orchestrator. Roles include PRD Guardian, Data Provenance, Agronomy Content, AI Safety, Finance Directory, Planner Insights, UX & Accessibility, Frontend, Neon Backend, Vercel Deploy, GitHub Manager, and Debug.

Suggested order: establish repo/FR issues; choose pilot geography and crops; design schema and seed labeled data on a branch; implement issue-by-issue; review provenance, safety, privacy, and accessibility; deploy preview and smoke-test; debug; complete FR acceptance checklist.

Every agent completion report must state:

- What changed.
- Relevant PRD section/FR-ID.
- How verified (tests/commands/results).
- Risks/blockers.
- Next handoff.

Do not guess when a source or claim cannot be verified.

---

## 12. Definition of Done

A feature is complete only when it maps to an FR-ID; happy and relevant empty/error/unavailable paths work; data provenance/freshness is visible; estimates and AI are labeled and bounded; privacy/accessibility are reviewed; tests are updated; typecheck, lint, tests, and build pass; preview is verified; and traceability is updated.

Hackathon success means farmers can complete core tasks, compare at least two crops using cost/market information, understand soil-AI limitations, and planners see aggregates without farmer identity—not merely that many screens exist.

---

## 13. Conflict Resolution and Amendments

1. Applicable law, provider requirements, and security obligations take precedence.
2. This constitution and approved PRD take precedence over agent goals, prompts, and implementation preferences.
3. If this constitution and PRD seem to conflict, pause and ask the human product owner; do not silently reinterpret.
4. Amend only with documented human approval and record the reason/impact in `docs/decisions.md`.

**Guiding principle:** Build a useful, localized, transparent agriculture decision-support MVP. Prefer verified information and clear limitations over confident guesses, and prefer a small end-to-end demo over unsupported breadth.
