# SEO

## Purpose

This document describes the current SEO and metadata behavior visible in the JustShop frontend.

Code surfaces this file aligns with:

- `nuxt.config.ts`
- `app/app.vue`
- `app/pages/**`
- `public/robots.txt`
- `i18n/locales/**`

## Current SEO Foundations

The live repo currently has these SEO-relevant foundations:

- locale-aware routing through `@nuxtjs/i18n`
- `baseUrl` configured in `nuxt.config.ts`
- `useLocaleHead()` in `app/app.vue` for `lang`, `dir`, and SEO-related head behavior
- `public/robots.txt` allowing crawling

## Current Route Localization

- The i18n strategy is `prefix_except_default`.
- English is the default locale.
- Arabic is configured as RTL.
- Localized links are expected through `NuxtLinkLocale`, locale path helpers, and the i18n routing setup.

## Current Metadata Usage

Explicit page-level head usage is visible today in:

- `app/app.vue`
- `app/pages/cart.vue`
- `app/pages/orders/index.vue`
- `app/pages/search.vue`
- `app/pages/products/category/[slug].vue`

Current metadata coverage is therefore partial, not exhaustive across all route families.

## Current Crawl Rules

`public/robots.txt` currently contains:

- `User-Agent: *`
- `Disallow:`

This means crawling is broadly allowed by default.

## Current Gaps

- No sitemap file or sitemap module is visible in the repo.
- No centralized SEO composable is visible.
- Many pages do not yet define route-specific titles or descriptions.
- Product detail pages currently do not show richer SEO metadata ownership in the live code inspected for Phase 4.

## Runtime Contract Reference

The storefront runtime migration now defines the Laravel-owned target SEO payload in:

- `docs/operations/storefront-runtime-seo-contract-specification-v1.md`

That specification is the Phase 1 target contract for future runtime pages. This owner document still describes the current live frontend SEO implementation and gaps.

## Operational Checks

When SEO-relevant code changes:

- confirm localized routes still resolve correctly
- confirm `baseUrl` matches the deployed environment
- confirm `lang` and `dir` head attributes are still correct
- confirm route titles or descriptions still render where expected
- confirm `robots.txt` still matches the intended crawl policy

## Change Rules

- Update this document when metadata ownership, crawl policy, sitemap behavior, or locale routing strategy changes.
- If richer SEO automation or metadata helpers are introduced later, document the owner surface here.
