# BzzyBees repository inventory

Date: 2026-10-19. Evidence snapshot, not an authorization to migrate source.

- GitHub: https://github.com/ForMySumchins/BzzyBees
- Current default branch at inspection: `jules-11031760528795552868-147185b2`
- Existing candidates: `Main` and `Staging`
- Verified branch head parity at inspection: all three referenced commit `858a60a0fffc1ce0647402ed617ed4e1205c47cf`.
- Application described by README: `CALLSHIELD-UX-001`, an offline customer concierge and BZZY Bee operator review interface.
- Package: `bzzy-bees-callshield-ux` with Vite/React/TypeScript/Vitest; commands `npm ci`, `npm test`, `npm run build`.
- Existing ticket: https://github.com/ForMySumchins/BzzyBees/issues/1
- An offline/sandbox boundary is documented; verification of all runtime behavior and fresh test results remains necessary.
- Historical workstream naming may conflict: proposed `BzzyBees` marketing/creative brand vs actual CallShield/BZZY Solutions concierge source.

## Required reconciliation before source relocation

1. Identify canonical home of CallShield, BzzyBees creative work, and other BZZY Solutions modules using actual files/commit provenance and owner-approved architecture.
2. Choose one release default branch only after checks and PR comparison; preserve historical references.
3. Keep repo movement, renames, redirect choices, history re-writes and branch deletions out of initial audit.
4. Establish a cheap, real test/build CI gate for the existing offline frontend, with lockfile-defined Node dependencies, while avoiding expensive/paid services.
5. Produce a concrete proposed PR sequence and blockers.

## Non-goals

No deployment, API integration, live telephone/SMS, automated customer contact, external scraping, paid generation, repository rename, migration, or merge.
