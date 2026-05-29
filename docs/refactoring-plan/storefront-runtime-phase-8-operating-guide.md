# Storefront Runtime — Steady-State Operating Guide

## Purpose

Final operating reference after Phase 8 closeout. Supersedes “migration in progress” assumptions in older runtime-analysis reports where they conflict with live code.

## Runtime ownership

| Layer | Authority |
|---|---|
| Laravel | Tenant resolution, route resolution, page/navigation/theme payloads, preview validation, SEO assembly, cache invalidation |
| Nuxt | SSR orchestration, catch-all rendering, layout/section registry, DTO consumption, hydration |

## Default configuration (production)

| Variable | Recommended default |
|---|---|
| `STOREFRONT_RUNTIME_ROLLOUT_MODE` | `full` |
| `STOREFRONT_RUNTIME_KILL_SWITCH` | `false` |
| `NUXT_API_BASE` / `NUXT_PUBLIC_API_BASE` | Point at Laravel `api/v1` |

Use `internal` or `pilot` only when deliberately constraining cohorts (see Phase 7 rollout doc).

## Standard verification

```bash
# Contracts
cd justshop-frontend && npm run runtime:contracts:check

# Backend runtime suite
cd laratenant-backend
php artisan test tests/Feature/Storefront/StorefrontRuntimeTest.php tests/Unit/Storefront/RuntimeServicesTest.php tests/Unit/Storefront/RuntimeSupportTest.php

# Frontend build
cd justshop-frontend && npm run build

# SSR smoke (requires backend + .output server)
npm run runtime:verify:phase6
npm run runtime:verify:phase7
```

## Route families

| Traffic | Entry |
|---|---|
| Home, marketing, category, product CMS pages | `app/pages/[...slug].vue` |
| Login, register, cart, profile, orders, checkout, Google auth, verify-email | Dedicated `app/pages/*` (preserved) |
| Search | `app/pages/search.vue` (preserved) |

## Emergency rollback

1. Set `STOREFRONT_RUNTIME_KILL_SWITCH=true` on frontend and backend.  
2. Redeploy or reload config.  
3. Confirm runtime APIs return `runtime.rollout_disabled` and CMS catch-all paths 404.  
4. Confirm legacy transactional routes still return 200.

## Content publish flow

Publishing in Laravel should invalidate runtime cache tags for affected tenant artifacts (`route`, `page`, `navigation`, `theme`, `seo`). Preview requests must bypass shared caches (see preview security spec).

## Maintenance rules

- Do not add section-level API fetching; props come from runtime page payloads.  
- Do not consume raw Laravel models in Vue components; use contract DTOs.  
- Do not remove legacy transactional routes without an approved backlog item in `storefront-runtime-phase-8-decommission-backlog.md`.  
- Update contract schemas and examples when changing runtime API fields.

## Program status

| Phase | Status |
|---|---|
| 1–6 | Repo implementation complete; Phase 6 formal ops sign-off optional |
| 7 | Deferred (operator evidence not required for Phase 8 closeout) |
| 8 | Complete — see `storefront-runtime-phase-8-legacy-retirement.md` |
