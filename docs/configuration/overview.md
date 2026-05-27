# Configuration Overview

## Purpose

This document maps where configuration currently lives in the JustShop frontend and which files own each setting category.

Code surfaces this file aligns with:

- `nuxt.config.ts`
- `.env.example`
- `app/plugins/**`
- `package.json`

## Configuration Owners

| Topic | Primary owner | Supporting files |
|---|---|---|
| Nuxt app config | `nuxt.config.ts` | `package.json` |
| Runtime config values | `nuxt.config.ts` | `.env.example`, `server/utils/api.ts`, `app/plugins/apollo.client.ts` |
| Environment variable placeholders | `.env.example` | `nuxt.config.ts` |
| Active Nuxt modules | `nuxt.config.ts` | `package.json` |
| App boot plugins | `app/plugins/**` | `nuxt.config.ts` |
| Shared route constants | `shared/utils/routes.ts` | `server/api/**`, `app/composables/**` |

## Current Configuration Shape

The current repo config is split across a few clear layers:

1. `nuxt.config.ts` defines CSS, Vite behavior, runtime config, active modules, auto-import directories, i18n behavior, and TypeScript include settings.
2. `.env.example` lists the active env variables currently used to feed runtime config.
3. `app/plugins/` defines boot-time runtime behavior such as auth bootstrap, cart bootstrap, theme initialization, shared API injection, and Apollo injection.
4. `shared/utils/routes.ts` centralizes route strings used across app and server code.

## Related Docs

Use the specialized docs for details:

- `docs/configuration/nuxt-config.md`
- `docs/configuration/runtime-config.md`
- `docs/configuration/environment-variables.md`
- `docs/configuration/modules.md`
- `docs/configuration/plugins.md`
- `docs/configuration/feature-flags.md`

## Change Rules

- Update `nuxt.config.ts` documentation when changing modules, runtime config, i18n, imports, or TypeScript settings.
- Update `.env.example` and the environment doc in the same change set when adding or removing env vars.
- Update the plugins doc whenever a plugin is added, renamed, removed, or reordered.
