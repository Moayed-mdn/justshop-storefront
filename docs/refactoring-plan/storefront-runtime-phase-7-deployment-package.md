# Storefront Runtime Phase 7 Deployment Package

## Status

- State: `PENDING / human-owned`
- Scope: deployment and rollback package for controlled storefront runtime rollout
- Prepared from local verification date: `2026-05-28`

## Repositories

- Frontend: `/home/leader/projects/laravel/tenant/justshop-frontend`
- Backend: `/home/leader/projects/laravel/tenant/laratenant-backend`

## Required runtime configuration

### Backend

- `STOREFRONT_RUNTIME_ROLLOUT_MODE=full` by default in production
- `STOREFRONT_RUNTIME_KILL_SWITCH=false`
- `STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS=justshop-demo,demo.justshop.test`
- `STOREFRONT_RUNTIME_PILOT_TENANT_KEYS=` as assigned for pilot

### Frontend

- `STOREFRONT_RUNTIME_ROLLOUT_MODE=full` by default in production
- `STOREFRONT_RUNTIME_KILL_SWITCH=false`
- `STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS=justshop-demo,demo.justshop.test`
- `STOREFRONT_RUNTIME_PILOT_TENANT_KEYS=` as assigned for pilot
- Optional Nuxt SSR overrides:
  - `NUXT_STOREFRONT_RUNTIME_ROLLOUT_MODE`
  - `NUXT_STOREFRONT_RUNTIME_KILL_SWITCH`
  - `NUXT_STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS`
  - `NUXT_STOREFRONT_RUNTIME_PILOT_TENANT_KEYS`

## Deployment sequence

1. Deploy backend runtime APIs with rollout configuration set to the target cohort mode.
2. Deploy frontend SSR build with matching rollout configuration.
3. Restart or reload application processes so updated env/config values take effect.
4. Run post-deploy smoke checks with real tenant host headers.
5. Record results in `storefront-runtime-phase-7-monitoring-log.md`.

## Post-deploy smoke commands

### Backend verification

```bash
cd /home/leader/projects/laravel/tenant/laratenant-backend
php artisan test tests/Feature/Storefront/StorefrontRuntimeTest.php tests/Unit/Storefront/RuntimeSupportTest.php tests/Unit/Storefront/RuntimeServicesTest.php
```

### Frontend build verification

```bash
cd /home/leader/projects/laravel/tenant/justshop-frontend
npm run build
```

### Full-mode SSR smoke

```bash
cd /home/leader/projects/laravel/tenant/justshop-frontend
RUNTIME_VERIFY_HOST=<tenant-host> RUNTIME_VERIFY_HOSTNAME=127.0.0.1 RUNTIME_VERIFY_PORT=3100 npm run runtime:verify:phase6
```

### Internal-mode rollout smoke

```bash
cd /home/leader/projects/laravel/tenant/justshop-frontend
RUNTIME_PHASE7_MODE=internal \
RUNTIME_VERIFY_HOST=<allowlisted-host> \
RUNTIME_VERIFY_BLOCKED_HOST=<blocked-host> \
RUNTIME_VERIFY_HOSTNAME=127.0.0.1 \
RUNTIME_VERIFY_PORT=3100 \
RUNTIME_VERIFY_API_HOSTNAME=127.0.0.1 \
RUNTIME_VERIFY_API_PORT=8001 \
npm run runtime:verify:phase7
```

### Kill-switch rollback smoke

```bash
cd /home/leader/projects/laravel/tenant/justshop-frontend
RUNTIME_PHASE7_MODE=kill-switch \
RUNTIME_VERIFY_HOST=<tenant-host> \
RUNTIME_VERIFY_HOSTNAME=127.0.0.1 \
RUNTIME_VERIFY_PORT=3100 \
RUNTIME_VERIFY_API_HOSTNAME=127.0.0.1 \
RUNTIME_VERIFY_API_PORT=8001 \
npm run runtime:verify:phase7
```

## Rollback procedure

1. Set `STOREFRONT_RUNTIME_KILL_SWITCH=true` on backend and frontend.
2. Redeploy or restart application processes.
3. Confirm runtime APIs return `runtime.rollout_disabled`.
4. Confirm CMS catch-all storefront paths return `404`.
5. Confirm legacy transactional routes still respond.

## Human approvals required

- `Program Manager`
- `DevOps/SRE`
- `Backend Lead`
- `Frontend Lead`
- `QA Lead`
- `Product Owner`

## Completion criteria

- Internal rollout deployed and monitored for `48h`
- Pilot merchants validated for one business cycle
- Full rollout deployed with `7 consecutive days` stable operation
- Monitoring log and pilot report completed
- Formal go/no-go and closeout approvals recorded
