# Coding Standards

## Purpose

This document defines the current coding standards for the JustShop frontend repository.

Code surfaces this file aligns with:

- `app/components/**`
- `app/composables/**`
- `app/stores/**`
- `app/pages/**`
- `app/layouts/**`
- `app/middleware/**`
- `app/plugins/**`
- `app/utils/**`
- `server/api/**`
- `server/utils/api.ts`
- `shared/utils/routes.ts`
- `i18n/locales/**`
- `nuxt.config.ts`
- `package.json`

## Working Principles

- Prefer current code-backed patterns over generic Nuxt conventions when the repo already shows a clear house style.
- Keep runtime boundaries explicit: client, server, or both.
- Reuse shared route contracts and existing helpers before introducing new abstractions.
- Treat auth, cart, checkout, profile, orders, and backend integration code as sensitive areas that require conservative changes.
- Record live inconsistencies as debt instead of copying them into new code.

## Naming Rules

### Files And Directories

- Use lowercase kebab-case for markdown files under `docs/`.
- Keep Vue component filenames in PascalCase.
- Feature-scoped folders: lowercase kebab-case (e.g., `app/components/product/`).
- Shared/Generic components: Directly under `app/components/` in PascalCase.
- Keep composables in `useXxx.ts` form with one clear responsibility per file.
- Keep Pinia store ids short and lowercase, matching the current `auth` and `cart` store pattern.
- Keep route middleware files short and lowercase, matching `auth.ts`, `guest.ts`, and `google-auth.ts`.
- Keep shared route literals centralized in `shared/utils/routes.ts` instead of duplicating strings in pages, components, or server handlers.
- Keep Nitro route handlers aligned with Nuxt file-based routing and HTTP suffix naming such as `.get.ts`, `.post.ts`, `.put.ts`, `.patch.ts`, and `.delete.ts`.

### Symbols

- Use `camelCase` for variables, functions, and composable return values.
- Use readable boolean prefixes such as `is`, `has`, `can`, and `should`.
- Use domain names that reflect the runtime boundary when needed, such as `authStore`, `localePath`, `apiQuery`, or `showErrorToast`.
- Prefer descriptive names over short abbreviations unless the abbreviation is already established in the repo, such as `API`.

## File Placement Rules

- Put route-backed screens in `app/pages/`.
- Put reusable visual building blocks in `app/components/`.
- Put shared composition logic in `app/composables/`.
- Put global cross-page state only in `app/stores/`.
- Put app boot behavior and injected helpers in `app/plugins/`.
- Put server request handlers in `server/api/`.
- Put backend proxy helpers in `server/utils/`.
- Put plain shared utilities that are not composables in `app/utils/` or `shared/utils/` based on whether they are app-only or shared with Nitro.
- Put feature translations in `i18n/locales/<locale>/` and keep bundles grouped by feature namespace.

## Imports And Shared Contracts

- Reuse `API_ROUTES`, `EXTERNAL_API_ROUTES`, and `APP_ROUTES` from `shared/utils/routes.ts` instead of hardcoding path strings.
- Prefer existing domain types from `types/**` instead of redefining response or entity shapes inline.
- Keep backend-facing calls behind `server/api/**` unless the architecture is explicitly changed.
- Avoid introducing another request helper when `useApi.ts`, the injected `$api`, `useClientApi.ts`, `app/utils/serverApi.ts`, and `server/utils/api.ts` already overlap. New code should follow the owner docs and only add a new surface with explicit review and documentation updates.

## Vue And Nuxt Conventions

- Use `<script setup>` for Vue single-file components and pages, matching the current repo pattern.
- Keep page-level route metadata in `definePageMeta(...)`.
- Use layouts for shared page shells and middleware for navigation/access control, not for feature-specific rendering logic.
- Keep client-only UI behind `ClientOnly` or explicit client guards when browser APIs are involved.
- Keep plugin suffixes accurate. Use `.client.ts` only when the code must never run on the server.

## SSR And Runtime Boundary Rules

- Guard all `window`, `document`, `localStorage`, `matchMedia`, and `FormData` assumptions when code may run during SSR.
- Follow the current store and composable pattern of using `import.meta.server`, `import.meta.client`, or `process.client` checks around browser-only APIs.
- Preserve the current plugin ordering semantics, especially `01.auth.client.ts` before `02.cart.client.ts`.
- Do not expose server-only behavior as client-safe behavior in docs or code.

## Data And Side-Effect Rules

- Keep page and component fetch behavior aligned with the current documented flow: app code calls internal `server/api` routes, and Nitro handlers proxy to the external backend.
- Keep cross-cutting auth, cart, toast, locale, and checkout side effects inside composables, stores, and plugins instead of scattering them through presentational components.
- Prefer composables for reusable feature workflows such as auth, cart, checkout, orders, profile, and theme handling.
- Keep store actions focused on state ownership and synchronization, especially for persisted auth state and guest cart logic.
- When handling forms with file uploads, preserve multipart behavior by not forcing `Content-Type: application/json` on `FormData`.

## UI, Styling, And Accessibility Expectations

- Keep component templates readable by pushing repeated logic into computed values, composables, or child components.
- Reuse the existing CSS token system in `app/assets/css/tokens/**` and the aggregated stylesheet entry in `app/assets/css/main.css`.
- Use `@nuxt/ui` where the repo already depends on it, but keep repo-specific styling in the current CSS structure under `app/assets/css/`.
- Keep interactive controls accessible with explicit labels, button types, and focus-visible behavior when custom styling is added.
- Keep localized user-facing copy in `i18n/locales/**` rather than hardcoding new strings in components where localization already exists.

## Comment Policy

- Add short comments only where the behavior is not obvious from the code.
- Prefer comments that explain why a boundary or workaround exists, not what basic syntax does.
- Add or keep comments around SSR guards, auth flow edge cases, cart merge logic, and runtime config behavior when that context would otherwise be easy to miss.
- Remove stale comments when the related behavior changes.

## Dependency And Change Control

- Do not add a new dependency without explicit review approval.
- Any approved dependency change must also update the relevant owner docs, especially configuration, styling, or setup documentation.
- Update documentation in the same change set whenever code changes affect routes, plugins, stores, modules, runtime config, environment variables, deployment behavior, or external integrations.

## Current Inconsistencies To Contain

These patterns exist in the live repo today, but they should be treated as debt and not copied into new code unless the user explicitly requests a cleanup pass:

- `app/components/Product/**` and `app/components/product/**` use mixed directory casing.
- `useUseProduct()` and `useUseBestSellers()` are valid live composables but do not match the preferred `useXxx` naming style.
- `server/api/best_seller.get.ts` uses snake_case naming while most other route handlers follow nested directory and path-segment naming.
- Multiple request-helper surfaces currently overlap across composables, plugins, and utilities.

## Change Rules

- Update this document when repo-wide naming, dependency, comment, or code organization rules change.
- When a rule is not yet consistently enforced in code, document the preferred target state and call out the current exception explicitly.
