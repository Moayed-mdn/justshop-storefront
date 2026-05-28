# Current Tenant Risks Analysis

## Overview
The current system is tenant-unaware. It assumes a single-tenant environment, which poses significant risks for a multi-tenant platform.

## Actual Code Ownership
- **Context**: No centralized tenant context exists.
- **Middleware**: [middleware/auth.ts](file:///home/leader/projects/nuxt/justshop-frontend/app/middleware/auth.ts) is tenant-unaware.
- **API**: [useApi.ts](file:///home/leader/projects/nuxt/justshop-frontend/app/composables/useApi.ts) lacks tenant identification.

## Architectural Violations
- **Tenant Leakage**: No isolation between different hostnames/tenants.
- **No Validation**: No middleware to verify if a tenant exists or is active.
- **Missing Serialization**: Tenant context is not serialized into the Nuxt SSR payload.

## Migration Difficulty: Medium
- Requires implementing a robust tenant resolution logic (hostname-based).
- Requires updating all data-fetching mechanisms to be tenant-aware.

## Risk Level: Critical
- **Data Privacy**: One tenant could potentially access another tenant's data if not properly isolated at the API and cache layers.
- **Operational**: Suspended tenants would still be accessible.

## Proposed Migration Order
1. Implement `server/middleware/01.tenant.ts` for hostname-based resolution.
2. Create `core/tenant/useTenant.ts` and `useStorefrontContext()`.
3. Inject tenant ID into all outgoing API requests.
