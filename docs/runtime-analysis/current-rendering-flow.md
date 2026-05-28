# Current Rendering Flow Analysis

## Overview
Rendering is currently handled by standard Vue components within Nuxt pages. Data fetching is often initiated by the components themselves.

## Actual Code Ownership
- **Layouts**: [layouts/default.vue](file:///home/leader/projects/nuxt/justshop-frontend/app/layouts/default.vue)
- **Component Fetching**: [HeroSection.vue](file:///home/leader/projects/nuxt/justshop-frontend/app/components/hero/HeroSection.vue), [ProductRelatedProducts.vue](file:///home/leader/projects/nuxt/justshop-frontend/app/components/product/ProductRelatedProducts.vue)
- **Data Composables**: [useHero.ts](file:///home/leader/projects/nuxt/justshop-frontend/app/composables/useHero.ts), [useProductDetail.ts](file:///home/leader/projects/nuxt/justshop-frontend/app/composables/useProductDetail.ts)

## Architectural Violations
- **Self-Fetching Components**: Components like `HeroSection` call `useHero` directly, violating the "Presentational-only" rule.
- **Client-Side Only Fetching**: Some pages use `onMounted` for data fetching (e.g., product detail page), which breaks SSR SEO and causes layout shifts.
- **No Rendering Engine**: There is no centralized section renderer; pages manually compose components.

## Migration Difficulty: High
- Requires refactoring almost all storefront components to accept props instead of fetching data.
- Requires building the `SectionRenderer` and `ComponentRegistry`.

## Risk Level: Medium
- Hydration mismatches during the transition.
- Layout shifts if async components aren't handled correctly.

## Proposed Migration Order
1. Create `SectionRenderer.vue` and `registry.ts`.
2. Refactor `HeroSection` and `HeroBanner` into the new presentational pattern.
3. Implement `useStorefrontPayload.ts` to orchestrate data fetching at the page level.
