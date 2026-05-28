# Current Cache Risks Analysis

## Overview
Caches are currently localized but not tenant-scoped, leading to high risk of cross-tenant data corruption.

## Actual Code Ownership
- **AsyncData Keys**: [useHero.ts](file:///home/leader/projects/nuxt/justshop-frontend/app/composables/useHero.ts), [useProductByCategory.ts](file:///home/leader/projects/nuxt/justshop-frontend/app/composables/useProductByCategory.ts)
- **Nitro Cache**: Not explicitly implemented but default behavior is tenant-unaware.

## Architectural Violations
- **Insufficient Cache Keys**: Keys like `hero-banners-en` are shared across all tenants.
- **SSR Payload Pollution**: The SSR payload (`nuxtApp.payload`) does not distinguish between tenants.

## Migration Difficulty: Low
- Requires a utility to generate tenant-scoped cache keys.
- Requires systematic update of all `useAsyncData` calls.

## Risk Level: High
- **Incorrect Rendering**: Users might see the wrong merchant's content if the CDN or SSR cache returns a response from another tenant.

## Proposed Migration Order
1. Create `core/cache/createTenantCacheKey.ts`.
2. Update all `useAsyncData` and `useFetch` calls to use the new utility.
3. Ensure Nitro caches (if used) are scoped by `event.context.tenant_id`.
