# Styling And UI

## Purpose

This document describes the current styling and UI composition approach in the JustShop frontend.

Code surfaces this file aligns with:

- `app/assets/css/**`
- `app/components/**`
- `app/app.vue`
- `app/app.config.ts`
- `app/components/ui/**`
- `app/composables/useTheme.ts`
- `.stylelintrc.json`

## Current Styling Stack

The live repo currently combines:

- Tailwind CSS imported through `app/assets/css/main.css`
- `@nuxt/ui` for app shell and toast behavior
- custom CSS tokens under `app/assets/css/tokens/**`
- shared component-level CSS files under `app/assets/css/components/**`
- shared page-level CSS files under `app/assets/css/pages/**`
- small local `<style scoped>` blocks inside selected Vue components

## Main Entry Points

Current top-level styling entry points are:

- `app/assets/css/main.css` imports Tailwind, `@nuxt/ui`, tokens, base CSS, component CSS, and page CSS
- `app/app.vue` wraps the app in `UApp` and sets theme-related head metadata
- `app/app.config.ts` contains current `@nuxt/ui` app config overrides for toast slots

## Current CSS Structure

| Path | Current role |
|---|---|
| `app/assets/css/tokens/**` | Global design tokens such as colors, spacing, typography, shadows, breakpoints, z-index, borders, and animations |
| `app/assets/css/base/**` | Base stylesheet setup such as reset behavior |
| `app/assets/css/components/**` | Shared feature and UI styles for headers, forms, cards, layout, search, skeletons, and more |
| `app/assets/css/pages/**` | Page-specific styles for checkout, home, cart, orders, profile, and product screens |

## Token Rules

- Reuse existing CSS custom properties before introducing new hardcoded values.
- Prefer semantic tokens such as `--color-primary`, `--color-bg-page`, and `--color-text-primary` over raw palette values inside components.
- Keep token additions grouped in the existing token files rather than scattering new global variables across page or component styles.
- Preserve the current dark-theme token override block in `app/assets/css/tokens/_colors.css` when adding theme-aware styling.

## UI Composition Rules

- Keep feature-specific UI in feature folders under `app/components/`.
- Use `app/components/ui/` only for genuinely shared UI elements such as `CartButton`, `Drawer`, `LoadingSpinner`, `Price`, and `ThemeToggle`.
- Keep larger page shells or repeated storefront structure in layout-oriented feature components such as `LayoutShop`.
- Use `@nuxt/ui` where it already owns app-level primitives, especially `UApp` and toast behavior, instead of re-implementing those concerns locally.

## Current Styling Patterns

The live repo currently mixes:

- Tailwind utility classes
- CSS custom properties
- occasional scoped component styles for small transitions or interaction polish

Examples visible today:

- `ui/CartButton.vue` uses scoped transition styles for cart button state changes
- `search/SearchDropdown.vue` uses token-backed utility classes for dropdown styling
- `topbar/TopbarLanguageSwitcher.vue` uses CSS variables plus a local transition style block
- page files such as `cart.vue` use small scoped style blocks only for localized layout adjustments

## Theme Rules

- Theme state currently flows through `useTheme.ts` and `app/plugins/theme.client.ts`.
- `app/app.vue` also sets a theme-related `theme-color` meta tag and injects a theme initialization script.
- Treat theme support as present but incomplete: the current `useTheme.ts` implementation forces light mode rather than performing a true toggle, even though dark-theme token overrides exist.
- New styling work should remain compatible with the token-based dark theme layer instead of assuming light-only styling forever.

## Style Tooling Reality

- `.stylelintrc.json` is present and extends `stylelint-config-standard-vue` and `stylelint-config-tailwindcss`.
- No stylelint npm script is currently exposed in `package.json`.
- This means style conventions exist, but automated stylesheet linting is not currently wired into the project scripts.

## Current Gaps And Debt

- Mixed `Product` and `product` component directory casing creates styling and ownership inconsistency.
- Some pages and components still use direct color utility classes such as `text-gray-*` or `bg-gray-*` alongside the token system.
- Theme infrastructure exists in tokens and UI, but the active toggle logic currently does not enable true dark/light switching.
- There is no dedicated visual regression or component preview workflow visible in the repo.

## Change Rules

- Update this document when the CSS entry structure, token system, `@nuxt/ui` usage, or theme implementation changes.
- If a new styling tool or lint command is added, document it here and in the testing or setup docs as relevant.
- If theme behavior is fixed or expanded later, remove the current limitation note in the same change set.
