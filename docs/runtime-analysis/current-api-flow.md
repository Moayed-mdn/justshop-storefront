# Current API Flow Analysis

## Overview
The API layer uses a custom `useApi` composable for client-side requests and `useServerApi` for Nitro server-side proxying.

## Actual Code Ownership
- **Client API**: [useApi.ts](file:///home/leader/projects/nuxt/justshop-frontend/app/composables/useApi.ts)
- **Server API**: [server/utils/api.ts](file:///home/leader/projects/nuxt/justshop-frontend/server/utils/api.ts)
- **Proxy Handlers**: [server/api/](file:///home/leader/projects/nuxt/justshop-frontend/server/api/)

## Architectural Violations
- **Missing Tenant Headers**: Requests do not include `X-Tenant-Id` or other platform-required headers.
- **Mixed Concerns**: `useApi.ts` handles transport, auth, localization, and UI (toasts) in a single file.
- **Direct Backend Leakage**: Components often consume raw backend responses without DTO normalization.
- **Inconsistent Localization**: Locale is pulled from cookies/headers manually in multiple places.

## Migration Difficulty: Medium
- Requires splitting `useApi.ts` into specialized modules.
- Requires introducing a DTO layer in `core/api/dto/`.

## Risk Level: High
- Security: Potential for cross-tenant data access if headers are missing.
- Maintenance: Tight coupling between frontend and backend shapes.

## Proposed Migration Order
1. Refactor `useApi.ts` into `core/api/` modules (headers, transport, errors).
2. Implement Nitro middleware to inject tenant context.
3. Introduce DTO transformers for core storefront resources (Product, Category).
