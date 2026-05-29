# Deployment

## Purpose

This document records the current deployment reality for the JustShop frontend and the minimum deployment procedure that can be supported from the repository itself.

Code surfaces this file aligns with:

- `package.json`
- `nuxt.config.ts`
- `.env.example`
- `server/api/**`
- `public/robots.txt`
- `docs/refactoring-plan/storefront-runtime-phase-7-rollout.md`

## Current Repository Reality

The live repo does not currently include:

- hosting-platform configuration
- container definitions
- `.github` deployment workflows
- infrastructure-as-code files

That means the exact production deployment target is external to the repository. This document therefore captures the repo-backed deployment prerequisites, smoke checks, and rollback framing, not platform-specific commands that are not present in code.

## Minimum Deployment Prerequisites

- correct environment values for API base, GraphQL URL, and site URL
- correct storefront runtime rollout values for `STOREFRONT_RUNTIME_ROLLOUT_MODE`, `STOREFRONT_RUNTIME_KILL_SWITCH`, and tenant allowlists when the runtime migration is being deployed
- installed dependencies
- successful `npm run build`
- a deployment environment that can serve the built Nuxt application

## Storefront Runtime Rollout Package

The repository now contains a repo-backed Phase 7 rollout package for the storefront runtime migration:

- `docs/refactoring-plan/storefront-runtime-phase-7-rollout.md`
- `docs/refactoring-plan/storefront-runtime-phase-7-deployment-package.md`
- `docs/refactoring-plan/storefront-runtime-phase-7-monitoring-log.md`
- `docs/refactoring-plan/storefront-runtime-phase-7-pilot-report.md`
- `docs/refactoring-plan/storefront-runtime-phase-7-evidence.md`

Use that package when deploying the new storefront runtime behind internal, pilot, or full rollout cohorts. This owner document remains the generic deployment baseline for the frontend repository.

## Minimum Repo-Backed Deployment Procedure

1. install dependencies
2. provide production or staging env values
3. run `npm run build`
4. deploy the built application using the hosting platform’s existing process
5. run post-deploy smoke checks

## Post-Deploy Smoke Checks

- homepage loads
- runtime CMS routes render through the catch-all page when the tenant is in the enabled rollout cohort
- product list and product detail pages load
- search page and autocomplete work
- cart works for a guest session
- login and register screens load correctly
- profile is reachable for an authenticated user
- orders list and order detail work for an authenticated user
- guest order tracking works
- checkout return pages render correctly

For storefront runtime rollout steps, also run the repo-backed scripts referenced in the Phase 7 package:

- `npm run runtime:verify:phase6`
- `npm run runtime:verify:phase7`

## Rollback Framing

The repository does not define a rollback script or platform workflow.

Current rollback expectation:

- set `STOREFRONT_RUNTIME_KILL_SWITCH=true` first when the storefront runtime rollout is the failing change
- revert to the last known-good deployment using the hosting platform’s external rollback process
- re-run the smoke checks above
- capture the failure symptoms and affected flows

## Current Gaps

- No deployment automation is visible in the repo.
- No platform-specific start, restart, or rollback contract is encoded here.
- Deployment evidence must be gathered manually.
- Storefront runtime Phase 7 operator closeout is deferred; steady-state ownership is documented in `docs/refactoring-plan/storefront-runtime-phase-8-operating-guide.md`.
- Re-open the Phase 7 rollout package only when executing a formal internal → pilot → full production program.

## Change Rules

- Update this document if deployment automation, platform config, or rollback procedures become part of the repository.
- Do not add speculative platform steps here unless the repo gains code-backed deployment ownership.
