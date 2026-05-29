# Storefront Runtime Phase 7 — Controlled Production Rollout

## Program status

- State: `DEFERRED` (as of `2026-05-29`)
- Remaining operator steps (48h monitoring, pilot UAT, 7-day production stability, formal sign-offs) were **not executed**.
- Phase 8 closeout proceeded with rollout controls left at repo defaults (`full` mode, kill switch off). See `storefront-runtime-phase-8-legacy-retirement.md`.

## Scope

Phase 7 adds tenant-scoped rollout controls so the storefront runtime can be enabled incrementally (internal → pilot → full) and disabled instantly via kill switch, without changing the Phase 3–6 rendering, preview, or cache contracts.

## Completion boundary

- `Repo-ready`: rollout controls, smoke scripts, rollback instructions, and operator templates are present in the repository.
- `Phase-complete`: the execution plan only allows closure after real environment execution, including `48 hours` of internal monitoring, pilot merchant validation for one business cycle, rollout to approved production tenants, `7 consecutive days` of stable production operation, and formal sign-off.
- Local verification can prove that the rollout mechanism works. It cannot prove that Phase 7 is complete in the program sense.

## Rollout controls

### Modes

| Mode | Behavior |
|---|---|
| `off` | Runtime APIs and catch-all runtime rendering disabled for all tenants |
| `internal` | Only tenants listed in internal allowlist |
| `pilot` | Internal allowlist + pilot allowlist |
| `full` | All resolved tenants (default) |

### Environment variables (frontend and backend)

| Variable | Default | Purpose |
|---|---|---|
| `STOREFRONT_RUNTIME_ROLLOUT_MODE` | `full` | Rollout mode |
| `STOREFRONT_RUNTIME_KILL_SWITCH` | `false` | Instant rollback for all tenants |
| `STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS` | `justshop-demo,demo.justshop.test` | Internal validation tenants |
| `STOREFRONT_RUNTIME_PILOT_TENANT_KEYS` | _(empty)_ | Pilot merchant tenant keys/domains/slugs |

Nuxt also accepts `NUXT_STOREFRONT_RUNTIME_*` overrides for server runtime config.

### Governance flag (backend)

- `storefront.runtime.rollout.kill` in `config/features.php` mirrors `STOREFRONT_RUNTIME_KILL_SWITCH` for platform governance inventories.

## Runtime behavior when disabled

- **Laravel**: runtime middleware returns `403` with `runtime.rollout_disabled`.
- **Nuxt catch-all**: returns `404` before runtime fetch when `featureFlags.storefront_runtime` is false.
- **Legacy transactional pages** (`/login`, `/cart`, `/checkout`, etc.) remain on dedicated file routes and are unaffected.

## Rollout checklist

This checklist intentionally mixes repo-backed preflight evidence with environment execution steps.

- `[x]` means the repo contains automation or local verification evidence for that control on `2026-05-28`.
- `[ ]` means the step still requires staging or production execution, monitoring evidence, or human approval.
- A checked item is not, by itself, a claim that staging or production rollout has already happened.

### Step 0 — Pre-deploy

- [x] Phase 6 automated certification green (`npm run runtime:verify:phase6`, backend runtime tests).
- [ ] Set `STOREFRONT_RUNTIME_ROLLOUT_MODE=internal` in staging.
- [x] Confirm internal tenant keys include validation store slug **and** domain.
- [x] Confirm `STOREFRONT_RUNTIME_KILL_SWITCH=false`.

### Step 1 — Internal validation (48h)

- [x] Deploy backend + frontend with `internal` mode.
- [x] Run `npm run runtime:verify:phase6` against built server with internal host.
- [x] Verify legacy routes: `/login`, `/cart`, `/checkout`, `/profile`, `/orders`.
- [ ] Monitor runtime error rate, `runtime.rollout_disabled`, and catch-all 404 rate.

### Step 2 — Pilot merchants (one business cycle)

- [ ] Add pilot tenant keys to `STOREFRONT_RUNTIME_PILOT_TENANT_KEYS`.
- [ ] Set `STOREFRONT_RUNTIME_ROLLOUT_MODE=pilot`.
- [ ] Re-run SSR smoke + merchant UAT on pilot domains only.

### Step 3 — Full rollout

- [x] Set `STOREFRONT_RUNTIME_ROLLOUT_MODE=full`.
- [ ] Monitor for 7 consecutive stable days (Phase 7 exit criteria).

## Instant rollback

1. Set `STOREFRONT_RUNTIME_KILL_SWITCH=true` (frontend + backend).
2. Redeploy or reload config.
3. Confirm runtime APIs return `runtime.rollout_disabled` and catch-all CMS paths return 404.
4. Confirm legacy transactional routes still respond.

## Automated evidence

```bash
# Backend
cd laratenant-backend
php artisan test tests/Feature/Storefront/StorefrontRuntimeTest.php tests/Unit/Storefront/RuntimeSupportTest.php

# Frontend build + Phase 6 SSR smoke (full mode default)
cd justshop-frontend
npm run build
npm run runtime:verify:phase6
```

Additional local rollout verification:

```bash
# Internal mode + blocked tenant smoke
cd justshop-frontend
RUNTIME_PHASE7_MODE=internal \
RUNTIME_VERIFY_HOST=demo.justshop.test \
RUNTIME_VERIFY_BLOCKED_HOST=blocked.justshop.test \
RUNTIME_VERIFY_HOSTNAME=127.0.0.1 \
RUNTIME_VERIFY_PORT=3100 \
RUNTIME_VERIFY_API_HOSTNAME=127.0.0.1 \
RUNTIME_VERIFY_API_PORT=8001 \
npm run runtime:verify:phase7

# Kill switch smoke
cd justshop-frontend
RUNTIME_PHASE7_MODE=kill-switch \
RUNTIME_VERIFY_HOST=demo.justshop.test \
RUNTIME_VERIFY_HOSTNAME=127.0.0.1 \
RUNTIME_VERIFY_PORT=3100 \
RUNTIME_VERIFY_API_HOSTNAME=127.0.0.1 \
RUNTIME_VERIFY_API_PORT=8001 \
npm run runtime:verify:phase7
```

## Gate status

| Criterion | In repo | Owner |
|---|---|---|
| Feature-flag / env rollout | Yes | Eng |
| Kill switch | Yes | Eng / SRE |
| Internal + pilot allowlists | Yes | Eng |
| 48h / pilot monitoring | No | DevOps / QA |
| Formal pilot sign-off | No | Product / QA |

## Deliverable package

- Rollout checklist: `docs/refactoring-plan/storefront-runtime-phase-7-rollout.md`
- Local evidence: `docs/refactoring-plan/storefront-runtime-phase-7-evidence.md`
- Deployment package: `docs/refactoring-plan/storefront-runtime-phase-7-deployment-package.md`
- Monitoring log: `docs/refactoring-plan/storefront-runtime-phase-7-monitoring-log.md`
- Pilot merchant report: `docs/refactoring-plan/storefront-runtime-phase-7-pilot-report.md`

## Closeout record required for true completion

- Complete the deployment package with real environment names, tenant cohorts, timestamps, and release owners.
- Fill the monitoring log with internal, pilot, and full-rollout observations, including alert review and incident notes.
- Fill the pilot merchant report with the real tenant cohort, UAT scenarios, business-cycle outcome, and Product/QA approvals.
- Record the go/no-go and closeout approvals from `Program Manager`, `DevOps/SRE`, `Backend Lead`, `Frontend Lead`, `QA Lead`, and `Product Owner`.
- Only after those records exist and the `7 consecutive days` stability window is complete can Phase 7 be marked done and Phase 8 opened.
