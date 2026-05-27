# Modules

## Purpose

This document lists the active Nuxt modules registered in the current application and why they exist.

Code surfaces this file aligns with:

- `nuxt.config.ts`
- `package.json`

## Active Modules

| Module | Current role | Notes |
|---|---|---|
| `@vueuse/nuxt` | Makes VueUse utilities available in the Nuxt app | Active in `nuxt.config.ts` |
| `@nuxtjs/i18n` | Locale routing, translations, and locale-aware head support | Active in `nuxt.config.ts` |
| `nuxt-ssr-api-logger` | SSR API logging integration | Active in `nuxt.config.ts`; behavior details belong in later operations docs |
| `@pinia/nuxt` | Registers Pinia for global app state | Supports `auth` and `cart` stores |
| `@nuxt/ui` | Provides UI primitives such as `UApp` and toast support | Visible in `app/app.vue` and page/component usage |
| `pinia-plugin-persistedstate/nuxt` | Enables persisted Pinia state configuration | Used by `app/stores/auth.ts` |

## Inactive Or Not Registered

| Package | Current status | Why it matters |
|---|---|---|
| `@nuxt/icon` | installed but commented out in `nuxt.config.ts` | Do not document it as an active module unless it is re-enabled |

## Non-Module Dependencies Worth Noting

These packages are important but are not Nuxt modules in `nuxt.config.ts`:

- `@apollo/client`
- `graphql`
- `graphql-tag`
- `@tailwindcss/vite`
- `tailwindcss`
- `pinia`
- `vue-router`

## Change Rules

- Update this doc whenever the `modules` array changes.
- Keep installed-but-inactive packages clearly separated from active modules.
- Document operational impact here, but keep plugin-specific runtime details in `docs/configuration/plugins.md`.
