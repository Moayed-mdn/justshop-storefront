# Feature Flags

## Purpose

This document describes storefront runtime rollout flags and governance rules for the JustShop frontend.

## Active flags

| Flag | Owner | Default | Runtime scope | Related docs |
|---|---|---|---|---|
| `storefront_runtime` (context) | Frontend Lead | `true` when tenant is in rollout cohort | Server SSR + catch-all page | `docs/refactoring-plan/storefront-runtime-phase-7-rollout.md` |

`storefront_runtime` is derived from `runtimeConfig.storefrontRuntimeRollout` and the resolved tenant identity (slug, id, domain). It is set in `server/middleware/01.tenant.ts` and consumed by `app/pages/[...slug].vue`.

## Environment configuration

| Variable | Default | Effect |
|---|---|---|
| `STOREFRONT_RUNTIME_ROLLOUT_MODE` | `full` | `off`, `internal`, `pilot`, or `full` |
| `STOREFRONT_RUNTIME_KILL_SWITCH` | `false` | Disables runtime for all tenants when `true` |
| `STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS` | `justshop-demo,demo.justshop.test` | Internal validation allowlist |
| `STOREFRONT_RUNTIME_PILOT_TENANT_KEYS` | _(empty)_ | Pilot merchant allowlist |

Nuxt server overrides: `NUXT_STOREFRONT_RUNTIME_*`.

## Reserved flags

| Flag | Owner | Default | Runtime scope | Notes |
|---|---|---|---|---|
| `dynamic_rendering` | Frontend Lead | off | client/server | Reserved for future platform toggles |
| `new_checkout` | Product | off | client/server | Reserved; checkout remains on legacy routes |
| `merchant_previews` | CMS | off | client/server | Preview uses query + token path today |

## Safety rules

- Do not enable runtime for a tenant without matching backend allowlist configuration.
- Use `STOREFRONT_RUNTIME_KILL_SWITCH=true` for instant rollback before code revert.
- Document any new flag in this file in the same change set.
