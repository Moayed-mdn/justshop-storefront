# Storefront Runtime Phase 8 — Support Handover

## Audience

Platform operations, support engineers, and on-call responders maintaining `justshop-frontend` + `laratenant-backend` storefront runtime.

## System overview

```text
Browser → Nuxt (tenant middleware) → catch-all [...slug].vue
              ↓                              ↓
         legacy file routes          Laravel /api/v1/storefront/runtime/*
         (auth, cart, checkout)      resolve → page / navigation / theme
```

## What support owns day-to-day

| Area | Owner doc | Quick action |
|---|---|---|
| Runtime contracts and DTO rules | `docs/architecture/storefront-runtime-contracts.md` | Schema drift → `npm run runtime:contracts:check` |
| Env and rollout flags | `docs/configuration/feature-flags.md`, `storefront-runtime-phase-7-rollout.md` | Kill switch: `STOREFRONT_RUNTIME_KILL_SWITCH=true` |
| Deployment smoke | `docs/operations/deployment.md` | `npm run build` + post-deploy checklist |
| Incidents | `docs/operations/incident-playbook.md` | Collect `request_id`, tenant host, path |
| Logging fields | `docs/operations/storefront-runtime-logging-specification-v1.md` | Search logs by `tenant_id`, `path`, `request_id` |
| Cache keys | `docs/operations/storefront-runtime-cache-key-standard-v1.md` | Tenant-scoped purge via backend invalidation |
| Steady-state runbook | `storefront-runtime-phase-8-operating-guide.md` | Normal operations |

## Symptom → action

| Symptom | Likely cause | Action |
|---|---|---|
| CMS pages 404, transactional pages OK | Runtime disabled for tenant or kill switch | Check `STOREFRONT_RUNTIME_ROLLOUT_MODE` and kill switch; see rollout doc |
| API `runtime.rollout_disabled` | Backend rollout gate | Align backend env with frontend; redeploy |
| Hydration or SEO mismatch | Payload/cache | Bypass CDN; verify canonical/JSON-LD with `runtime:verify:phase6` |
| Preview 403 | Token scope/expiry | `docs/operations/storefront-runtime-preview-security-specification-v1.md` |
| Cart/login broken | Unrelated to runtime catch-all | Test legacy routes; do not enable catch-all for `/cart` paths |

## Escalation

1. Frontend Lead — Nuxt SSR, catch-all, section registry  
2. Backend Lead — runtime APIs, CMS serialization, cache invalidation  
3. DevOps/SRE — rollout env, CDN, hosting (not in frontend repo)

## Handover acceptance

Support can operate the platform using the documents above without implementation-team involvement for routine runtime incidents. Re-open Phase 7 operator templates only when executing a formal production rollout program.
