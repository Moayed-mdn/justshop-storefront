# Current Routing Flow Analysis

## Overview
The current storefront uses standard Nuxt file-based routing with static route definitions in a shared utility file.

## Actual Code Ownership
- **Route Definitions**: [routes.ts](file:///home/leader/projects/nuxt/justshop-frontend/shared/utils/routes.ts)
- **Pages**: [app/pages/](file:///home/leader/projects/nuxt/justshop-frontend/app/pages/)
- **Navigation**: Handled by `<NuxtLink>` and `APP_ROUTES` constants.

## Architectural Violations
- **File-based dependency**: Storefront pages (Product, Category, Home) are hardcoded in the filesystem.
- **No Runtime Resolution**: The system cannot resolve routes dynamically via a backend API.
- **Static Mapping**: URL structures are fixed (e.g., `/products/product/[slug]`) and cannot be customized per tenant or CMS configuration.

## Migration Difficulty: Medium
- Transitioning to `[...slug].vue` requires a stable Route Resolver API.
- Legacy routes must be maintained during transition.

## Risk Level: High
- Blocks multi-tenant customization.
- Blocks CMS-managed URL structures.

## Proposed Migration Order
1. Implement `core/runtime/router/useRouteResolver.ts`.
2. Introduce `app/pages/[...slug].vue` as a fallback/catch-all.
3. Gradually move static pages to the dynamic runtime.
