# Current SEO Flow Analysis

## Overview
SEO is currently managed in a decentralized manner, often using `useHead` in `app.vue` or partially within page components.

## Actual Code Ownership
- **Global SEO**: [app.vue](file:///home/leader/projects/nuxt/justshop-frontend/app/app.vue)
- **Locale SEO**: Handled by `@nuxtjs/i18n` in `app.vue`.
- **Page SEO**: Missing or fragmented in individual pages like [product detail](file:///home/leader/projects/nuxt/justshop-frontend/app/pages/products/product/[slug].vue).

## Architectural Violations
- **Distributed Ownership**: SEO is not centralized; pages/components own their meta tags.
- **No Runtime SEO**: SEO metadata is not driven by the CMS/Route Resolver.
- **Duplicate Meta Tags**: Risk of duplication between global and page-level SEO.

## Migration Difficulty: Medium
- Requires centralizing SEO logic into a runtime engine.
- Requires removing distributed `useHead`/`useSeoMeta` calls.

## Risk Level: Medium
- **SEO Regressions**: Loss of metadata during refactoring if not carefully managed.
- **Inconsistent Canonical URLs**: Especially in multi-tenant/multi-domain setups.

## Proposed Migration Order
1. Implement `core/seo/useRuntimeSeo.ts`.
2. Move SEO metadata into the Route Resolver response.
3. Centralize meta injection in the catch-all route.
