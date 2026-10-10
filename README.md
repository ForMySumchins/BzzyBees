# CALLSHIELD-UX-001 — Offline Conversational Concierge UX Slice

This repository contains the client-side CallShield concierge experience built for BZZY using BZZY architecture vocabulary:

- **Mantis**: Captured, normalized interaction evidence schema and record management.
- **Universal Client Data (UCD)**: Per-business configuration boundary controlling business personality, tone (formality, warmth, initiative), and trade capabilities.
- **Field Operator**: Contractor-facing review queue, triage status display, and local follow-up handoff.

---

## 🔒 Offline Boundary & Security Commitments

This implementation operates strictly **100% offline** on the client side:
- **Zero Paid APIs / Credits**: No LLM, OpenAI, Anthropic, or external inference APIs are invoked.
- **Zero Third-Party Accounts / Credentials**: Requires no API keys, accounts, or tokens (`CREDENTIALS: NONE`).
- **No Network Calls or Webhooks**: Provider adapter (`OfflineConciergeAdapter` and `OfflineRulesAdapter`) uses deterministic rules and fixtures only.
- **No Telephony Operations**: No phone calls, SMS sending, call recordings, speech synthesis, or Twilio integrations.
- **Local-Only Review Actions**: Review actions in the Field Operator panel ("Mark Reviewed", "Prepare Callback") update local browser state only without sending external network messages.

---

## ✨ Features & Requirements Compliance

1. **Customer-Facing Concierge**:
   - Conversational-first hybrid UI with structured intake view option.
   - Initial disclosure identifies as an **"AI assistant"** (and strictly avoids "automated" / "an automated system").
   - Trade-specialized qualification using fictional HVAC reference businesses ("Sumchin Family Heating & Air" and "Apex Precision HVAC").
   - Explicitly avoids claims of binding bookings, remote pricing guarantees, or remote diagnoses.
   - Explicit consent checkbox required prior to enabling sensitive contact detail input fields.
   - Visible fallback paths: Human callback request, message capture, and emergency/safety guidance directing users to local 911 or utility services.

2. **Intake and Triage**:
   - Captures normalized Mantis interaction records with request summary, trade/service category, urgency state, consent state, contact fields, and fallback reasons.
   - Deterministic offline rules adapter evaluating 3 seeded scenarios:
     1. **Safety / Gas Smell (Urgent)** -> `safety_urgent`
     2. **After-Hours AC Outage** -> `after_hours`
     3. **Routine Estimate / Maintenance** -> `routine_estimate`

3. **Contractor Dashboard (Field Operator)**:
   - Displays captured interaction queue with triage badges, consent status, and next best action.
   - Displays prominent **Mock Provider Status** banner (`Offline / Sandboxed`).
   - Local-only review actions ("Mark Reviewed", "Prepare Callback").

---

## 🚀 Running the Application & Test Suite

### Installation
```bash
npm install
```

### Running the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` (or the port indicated in terminal).

### Running Automated Tests
```bash
npm test
```
Executes all 6 test suites (8 unit/integration tests) covering disclosure, deterministic triage, consent gating, UCD personality switching, offline adapter isolation, and contractor dashboard rendering.

### Production Build
```bash
npm run build
```
Compiles TypeScript and bundles static assets using Vite into `dist/`.

---

## 📂 Changed Paths & Structure

- `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`: Vite, React, TypeScript, Vitest, and Tailwind setup.
- `src/types/`: Vocabulary type definitions (`ucd.ts`, `mantis.ts`, `fieldOperator.ts`, `concierge.ts`).
- `src/adapters/`: `offlineRulesAdapter.ts` (deterministic triage) and `offlineConciergeAdapter.ts` (mock provider adapter).
- `src/fixtures/`: `ucdFixtures.ts` (business profiles and scenario seeders).
- `src/components/`: `ConciergeView.tsx` (customer UI) and `ContractorDashboard.tsx` (Field Operator UI).
- `src/App.tsx`, `src/main.tsx`, `src/index.css`: App shell, layout, and styling.
- `src/tests/`: Vitest test suites (`disclosure.test.tsx`, `triage.test.ts`, `consent.test.tsx`, `personality.test.ts`, `offlineAdapter.test.ts`, `contractorDashboard.test.tsx`).

---

## 📊 Test Evidence Summary

All 8 automated tests pass cleanly:
```
✓ src/tests/disclosure.test.tsx (1 test)
✓ src/tests/contractorDashboard.test.tsx (1 test)
✓ src/tests/consent.test.tsx (1 test)
✓ src/tests/personality.test.ts (1 test)
✓ src/tests/offlineAdapter.test.ts (1 test)
✓ src/tests/triage.test.ts (3 tests)

Test Files  6 passed (6)
     Tests  8 passed (8)
```
