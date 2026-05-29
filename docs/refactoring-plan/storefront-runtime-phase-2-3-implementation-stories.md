# Storefront Runtime Phase 2 And Phase 3 Implementation Stories

## Purpose

This handoff document converts the frozen Phase 1 storefront runtime contracts into implementation-ready stories for Phase 2 and Phase 3, as required by the execution plan exit criteria.

## Contract Sources

- `docs/architecture/storefront-runtime-api-contract-specification-v1.md`
- `docs/architecture/storefront-runtime-dto-mapping-specification-v1.md`
- `docs/development/storefront-runtime-contract-test-matrix-v1.md`
- `docs/operations/storefront-runtime-cache-key-standard-v1.md`
- `docs/operations/storefront-runtime-logging-specification-v1.md`
- `docs/operations/storefront-runtime-seo-contract-specification-v1.md`
- `docs/operations/storefront-runtime-preview-security-specification-v1.md`
- `src/core/runtime/contracts/types.ts`
- `src/core/runtime/contracts/schemas/**`
- `src/core/runtime/contracts/examples/**`

## Phase 2 Stories

### Story P2-1: Tenant Resolution By Domain

- Implement Laravel domain-to-store resolution using `Host` as the authority.
- Enforce `Store::isOperational()` before any runtime payload is returned.
- Return normalized runtime errors `runtime.tenant_not_found` and `runtime.tenant_inactive`.
- Cover supported locales `en` and `ar` and reject unsupported locales with `runtime.invalid_locale`.

### Story P2-2: Runtime Route Resolution API

- Implement `GET /api/v1/storefront/runtime/resolve`.
- Serialize responses to `RuntimeRouteResolutionResponse`.
- Support outcomes `matched`, `redirect`, and `not_found`.
- Support route families `home`, `marketing_page`, `category_page`, `product_page`, and legacy passthrough decisions.
- Emit contract-compliant cache metadata, including tenant, locale, runtime version, artifact, and path.

### Story P2-3: Runtime Page Payload API

- Implement `GET /api/v1/storefront/runtime/page/{id}`.
- Serialize payloads to `RuntimePagePayloadResponse`.
- Transform Laravel CMS and commerce sources into normalized DTOs.
- Keep section payloads presentational-only and SSR-stable.
- Reuse Laravel-owned SEO assembly for the page DTO.

### Story P2-4: Navigation And Theme APIs

- Implement `GET /api/v1/storefront/runtime/navigation`.
- Implement `GET /api/v1/storefront/runtime/theme`.
- Serialize responses to `RuntimeNavigationResponse` and `RuntimeThemeResponse`.
- Ensure payloads are tenant-scoped, locale-aware, and cache-tagged for later invalidation.

### Story P2-5: Preview Validation API

- Implement `POST /api/v1/storefront/runtime/preview/validate`.
- Validate tenant-scoped, page-scoped, locale-scoped, expiring preview tokens.
- Return `RuntimePreviewValidationResponse` and normalized preview errors.
- Mark authorized preview responses as cache-bypassed.

### Story P2-6: Observability And Error Normalization

- Emit runtime logs with `tenant_id`, `tenant_key`, `locale`, `path`, `request_id`, `runtime_version`, `artifact`, `event`, `status`, and `duration_ms`.
- Normalize runtime exceptions to `RuntimeErrorResponse`.
- Publish API examples from contract-compliant runtime endpoints for frontend consumption.

## Phase 3 Stories

### Story P3-1: Replace Mock Route Resolution

- Replace `mockResolve()` in `src/core/runtime/router/useRouteResolver.ts`.
- Consume `GET /api/v1/storefront/runtime/resolve` through DTO-safe integrations only.
- Handle `redirect`, `not_found`, and legacy passthrough explicitly.

### Story P3-2: Replace Mock Payload Loading

- Replace `getMockPayload()` in `src/core/runtime/router/useStorefrontPayload.ts`.
- Load page payloads, navigation, and theme from the approved runtime APIs.
- Keep frontend consumption limited to approved DTOs from Phase 1.

### Story P3-3: Replace Mock Tenant Resolution

- Replace the mock tenant resolver in `src/core/tenant/resolver.ts`.
- Preserve SSR-safe behavior across server and client contexts.
- Propagate request headers including locale, request id, contract version, and preview token where applicable.

### Story P3-4: Catch-All Route Integration

- Update `app/pages/[...slug].vue` to consume the production runtime DTOs only.
- Ensure `useAsyncData` keys include tenant, locale, route/path, runtime version, and preview state.
- Preserve legacy-sensitive route families on dual runtime paths until later approval gates are met.

### Story P3-5: SSR, Hydration, And Error Handling

- Ensure SSR output is deterministic from runtime DTOs.
- Prevent hydration mismatch by keeping section identities, layouts, and SEO payloads stable.
- Render normalized runtime errors safely and consistently.

## Required Tests Derived From The Contracts

- Phase 2: unit, integration, contract, negative-path, and performance baseline tests.
- Phase 3: frontend DTO normalization, integration, SSR, hydration, and legacy regression tests.
- Phase 5+: preview security, cache invalidation, tenant isolation, performance, and SEO certification tests continue from the same contract package.
