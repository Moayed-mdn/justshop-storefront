# Nuxt Config

## Purpose

This document describes the current `nuxt.config.ts` contents and what each active section controls.

Code surface this file aligns with:

- `nuxt.config.ts`

## Current Top-Level Config

| Section | Current value or behavior | Notes |
|---|---|---|
| `compatibilityDate` | `2025-07-15` | Nuxt compatibility target |
| `devtools` | enabled with timeline enabled | Developer tooling is currently on |
| `css` | `@/assets/css/main.css` | Main stylesheet entry |
| `vite.plugins` | `@tailwindcss/vite` | Tailwind integration |
| `vite.optimizeDeps.include` | `@apollo/client/core`, `graphql-tag` | Helps GraphQL search dependencies |
| `runtimeConfig.apiBase` | sourced from `NUXT_PUBLIC_API_BASE` | Server-side field currently mirrors the public API base |
| `runtimeConfig.public.apiBase` | sourced from `NUXT_PUBLIC_API_BASE` | Client-visible |
| `runtimeConfig.public.graphqlUrl` | sourced from `NUXT_PUBLIC_GRAPHQL_URL` | Client-visible |
| `modules` | six active modules | See modules doc for ownership |
| `imports.dirs` | `shared/utils` | Makes shared utilities auto-importable in app code |
| `nitro.imports.dirs` | `shared/utils` | Makes shared utilities available in Nitro |
| `i18n` | English default, Arabic secondary locale | Prefix except default locale strategy |
| `typescript.tsConfig.include` | `../types/**/*.d.ts` | Extends generated Nuxt TS config |

## CSS And Build Settings

Current frontend styling and build-related settings:

- The app loads a single main CSS entry at `app/assets/css/main.css`.
- Vite registers `tailwindcss()` from `@tailwindcss/vite`.
- Vite pre-optimizes `@apollo/client/core` and `graphql-tag` for the GraphQL search path.

## Runtime And Imports

- `runtimeConfig` currently derives values from `NUXT_PUBLIC_API_BASE` and `NUXT_PUBLIC_GRAPHQL_URL`.
- Shared utilities in `shared/utils` are auto-imported into both app and Nitro contexts.
- The current runtime config does not define any extra private-only secrets beyond `apiBase`, but `server/utils/api.ts` still treats `config.apiBase` as the server-side field.

## i18n Settings

Current `@nuxtjs/i18n` settings include:

- default locale: `en`
- strategy: `prefix_except_default`
- base URL: `NUXT_PUBLIC_SITE_URL` or `http://localhost:3000`
- browser language cookie: `i18n_redirected`
- redirect on root with `alwaysRedirect: true`
- locales: English (`en-US`, `ltr`) and Arabic (`ar-SA`, `rtl`)

The config points `langDir` to `locales`, which resolves to the locale bundles under `i18n/locales/` in the current repo structure.

## TypeScript Settings

The current TypeScript customization adds `../types/**/*.d.ts` to the generated Nuxt TS config include list. This matters because the repo maintains shared declaration files in the top-level `types/` directory.

## Change Rules

- Keep this doc synchronized with every key that exists in `nuxt.config.ts`.
- Document commented-out module entries as inactive, not active behavior.
- Move env semantics to `docs/configuration/environment-variables.md` instead of duplicating long tables here.
