# Agent guide: BzzyBees current repository

This file guides planning and review. Do not infer missing features, approvals, or canonical ownership from a repository name.

## Verified current source

This repository's current code is the **CALLSHIELD-UX-001 offline concierge prototype** built with React, TypeScript, Vite, and Vitest. See README.md, package.json, src/adapters/, src/components/, src/types/, and src/tests/.

The owner also describes **BzzyBees** as a proposed BZZY creative/marketing workstream. Whether this code should remain in BzzyBees or move to a BZZY Solutions/CallShield repository is **unresolved**. Do not rename, move, delete, or reorganize existing code solely from the repository name. Propose a provenance-backed repository ownership map first.

## Working rules

- Source of truth is the checked-out files and explicit owner decisions, not assumptions about other repos.
- Keep edits small and branch-scoped. Prefer issue-linked draft PRs; do not push directly to any shared integration/release branch.
- Never silently replace the default branch. Current Main, Staging, and jules-11031760528795552868-147185b2 were inspected on 2026-10-19 and had the same commit SHA: 858a60a0fffc1ce0647402ed617ed4e1205c47cf. Verify freshness before relying on this.
- Preserve **offline-only** behavior: no network or AI provider calls, no telephony/SMS, no tokens, real customer data, or paid APIs.
- Preserve conspicuous AI disclosure, contact-consent gating, safety escalation, and clear mock-provider status.
- For code changes, use `npm ci`, `npm test`, and `npm run build` to validate; include actual command results in the PR. Do not claim tests were executed if not run.
- Avoid new external services, paid generation, live integrations, deployments, and automatic merges without explicit authorization.

## Priorities for the next worker

1. Read the existing README, fixtures, tests, and open issue #1.
2. Verify branch parity and locate any unmerged work or canonical source elsewhere before any repository rename/default-branch update.
3. Report whether this stays in BzzyBees or should be prepared for a separate owner-approved migration.
4. Propose an appropriately scoped CI workflow and real test evidence. A green badge without executed tests is not acceptable.
