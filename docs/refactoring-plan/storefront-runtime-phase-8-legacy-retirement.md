# Storefront Runtime Phase 8 — Legacy Retirement And Program Closeout

## Status

- State: `COMPLETE` (repo-backed closeout on `2026-05-29`)
- Scope: legacy runtime audit, keep/retire decisions, approved code removal, and program handover package
- Phase 7 remainder: **deferred** — production pilot monitoring, 7-day stability window, and formal rollout sign-offs are not required to close Phase 8 in this repository (see [Phase 7 deferral](#phase-7-deferral))

## Phase 7 deferral

The execution plan lists Phase 7 entry criteria as “Phase 6 certified” plus operational rollout evidence. The team chose to **stop Phase 7 before environment-owned closeout** and complete Phase 8 locally:

| Phase 7 item | Decision |
|---|---|
| Staging `internal` mode deployment record | Deferred — use `STOREFRONT_RUNTIME_ROLLOUT_MODE=full` (default) unless ops re-opens Phase 7 |
| 48h internal monitoring log | Deferred |
| Pilot merchant cohort + UAT | Deferred |
| 7 consecutive stable production days | Deferred |
| Formal Program / DevOps / Product sign-off on rollout | Deferred |

**What remains available:** rollout env vars, kill switch, `npm run runtime:verify:phase6`, `npm run runtime:verify:phase7`, and operator templates under `storefront-runtime-phase-7-*.md`.

## Audit summary

The active storefront path no longer uses mocked runtime resolvers. CMS catalog and marketing traffic is served through `app/pages/[...slug].vue` and Laravel runtime APIs. Transactional and account flows stay on dedicated file routes by design.

## Legacy retirement decision log

| ID | Surface | Decision | Rationale | Evidence |
|---|---|---|---|---|
| R-01 | `app/pages/[...slug].vue` + `src/core/runtime/**` | **KEEP** (primary runtime) | Production CMS/catalog rendering | Phase 6 smoke, runtime tests |
| R-02 | `legacyPassthrough` contract + resolver behavior | **KEEP** | Defers transactional paths to file routes without duplicate handlers | `StorefrontRuntimeTest::test_resolve_endpoint_marks_legacy_passthrough_routes_explicitly` |
| R-03 | `server/middleware/01.tenant.ts` legacy prefix list | **KEEP** | Aligns Nitro with backend passthrough for auth/checkout/cart | Matches `storefront-runtime-contracts.md` preserved routes |
| R-04 | `app/pages/login.vue`, `register.vue`, `cart.vue`, `profile.vue` | **KEEP** | High-risk transactional flows; dual-runtime policy | Phase 7 legacy regression smoke |
| R-05 | `app/pages/checkout/**`, `orders/**`, `auth/google/callback.vue`, `verify-email/**` | **KEEP** | Checkout and account journeys not migrated to catch-all | Same |
| R-06 | `app/pages/search.vue` | **KEEP** | Search still file-based; not in runtime page-type contract | Post-retirement smoke checklist |
| R-07 | `app/composables/useHero.ts` | **RETIRED** | Replaced by runtime page payloads + presentational sections; zero imports | Removed `2026-05-29` |
| R-08 | `app/composables/useBestSellers.ts` | **RETIRED** | Same as R-07 | Removed `2026-05-29` |
| R-09 | `src/core/rendering/useSectionData.ts` | **RETIRED** | Superseded by Laravel runtime `sections[].props`; zero imports | Removed `2026-05-29` |
| R-10 | Deleted static catalog pages (`index.vue`, `products/**`) | **ALREADY RETIRED** (Phase 4 route migration) | Traffic uses catch-all | `docs/runtime-analysis/phase4-completion-report.md` |
| R-11 | Phase 7 operator templates (monitoring log, pilot report) | **KEEP** (reference) | Reusable if ops resumes rollout | `storefront-runtime-phase-7-monitoring-log.md` |
| R-12 | `STOREFRONT_RUNTIME_*` rollout controls | **KEEP** | Kill switch and cohort gating for operations | `storefront-runtime-phase-7-rollout.md` |

## Removed in this closeout

```text
app/composables/useHero.ts
app/composables/useBestSellers.ts
src/core/rendering/useSectionData.ts
```

## Regression evidence (repo-backed)

```bash
cd laratenant-backend
php artisan test tests/Feature/Storefront/StorefrontRuntimeTest.php tests/Unit/Storefront/RuntimeServicesTest.php tests/Unit/Storefront/RuntimeSupportTest.php

cd justshop-frontend
npm run runtime:contracts:check
npm run build
# With backend + built server running:
npm run runtime:verify:phase6
npm run runtime:verify:phase7
```

Legacy route smoke (manual or scripted): `/login`, `/cart`, `/checkout/cancel`, `/profile`, `/orders`, `/search`.

## Related deliverables

| Deliverable | Owner document |
|---|---|
| Decommission backlog (future work) | `storefront-runtime-phase-8-decommission-backlog.md` |
| Support handover | `storefront-runtime-phase-8-support-handover.md` |
| Steady-state operating guide | `storefront-runtime-phase-8-operating-guide.md` |

## Exit criteria

| Criterion | Met |
|---|---|
| Keep/retire list for every legacy route family | Yes — table above |
| Approved legacy code removed with evidence | Yes — R-07–R-09 |
| Documentation and handover package updated | Yes — linked deliverables |
| Regression commands documented | Yes |
| Formal multi-role sign-off | **Not in repo** — attach externally if required |

## Program milestone

- **M8** (legacy runtime retirement decision approved): satisfied for repo scope via this log and removals R-07–R-09.
- **M7** (production rollout completed): **not claimed** — deferred per [Phase 7 deferral](#phase-7-deferral).
