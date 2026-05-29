# Storefront Runtime Phase 8 — Decommission Backlog

## Purpose

Track **future** retirements that are out of scope for the Phase 8 repo closeout. Do not delete these without replacement evidence and regression coverage.

## Backlog

| ID | Item | Blocker | Owner | Target trigger |
|---|---|---|---|---|
| B-01 | Migrate `app/pages/search.vue` to runtime catch-all | Runtime search page type + SEO contract | Frontend Lead | Product approves search in CMS runtime |
| B-02 | Migrate checkout funnel to runtime or dedicated checkout service | PCI/flow UAT, two production release cycles | Product + QA | Post stable checkout contract |
| B-03 | Migrate auth pages to centralized auth app or runtime shells | SSO/product decision | Frontend Lead | Auth platform decision |
| B-04 | Remove `legacyPassthrough` once all paths have runtime or dedicated owners | B-01–B-03 complete | Solution Architect | Zero passthrough traffic in metrics |
| B-05 | Replace host-derived tenant shell in `src/core/tenant/resolver.ts` with live resolve API | Backend tenant discovery endpoint for SSR bootstrap | Backend Lead | Optional hardening |
| B-06 | Complete Phase 7 operator closeout (monitoring log, pilot report, 7-day stability) | Staging/production execution | DevOps / Program Manager | Ops re-opens rollout program |
| B-07 | Production dashboards and load tests from Phase 6 manual items | Observability stack | DevOps/SRE | Production certification |
| B-08 | Tighten `LayoutManager` / section registry typing (`any` removal) | Typed layout registry | Frontend Lead | Maintenance sprint |

## Completed decommission (Phase 8)

| ID | Item | Closed |
|---|---|---|
| D-08-01 | `useHero.ts` | `2026-05-29` |
| D-08-02 | `useBestSellers.ts` | `2026-05-29` |
| D-08-03 | `useSectionData.ts` | `2026-05-29` |
