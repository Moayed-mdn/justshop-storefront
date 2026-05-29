# Storefront Runtime Contract Test Matrix v1

## Purpose

This matrix defines the Phase 1 schema-validation coverage, positive examples, negative examples, and future implementation test obligations for the storefront runtime contracts.

## Validation Command

```bash
npm run runtime:contracts:check
```

## Schema Matrix

| Contract | Schema file | Positive examples | Negative examples |
|---|---|---|---|
| Route resolution request | `src/core/runtime/contracts/schemas/route-resolution-request.schema.json` | `route-resolution-request.valid.json` | `invalid/route-resolution-request.missing-path.json` |
| Route resolution response | `src/core/runtime/contracts/schemas/route-resolution-response.schema.json` | `route-resolution-response.matched.json`, `route-resolution-response.redirect.json`, `route-resolution-response.not-found.json` | `invalid/route-resolution-response.missing-route-type.json` |
| Page payload request | `src/core/runtime/contracts/schemas/page-payload-request.schema.json` | `page-payload-request.valid.json` | documented negative cases below |
| Page payload response | `src/core/runtime/contracts/schemas/page-payload-response.schema.json` | `page-payload-response.marketing.json` | `invalid/page-payload-response.missing-section-props.json` |
| Navigation payload request | `src/core/runtime/contracts/schemas/navigation-payload-request.schema.json` | `navigation-payload-request.valid.json` | documented negative cases below |
| Navigation payload response | `src/core/runtime/contracts/schemas/navigation-payload-response.schema.json` | `navigation-payload-response.default.json` | documented negative cases below |
| Theme payload request | `src/core/runtime/contracts/schemas/theme-payload-request.schema.json` | `theme-payload-request.valid.json` | documented negative cases below |
| Theme payload response | `src/core/runtime/contracts/schemas/theme-payload-response.schema.json` | `theme-payload-response.default.json` | documented negative cases below |
| Preview validation request | `src/core/runtime/contracts/schemas/preview-validation-request.schema.json` | `preview-validation-request.valid.json` | `invalid/preview-validation-request.missing-token.json` |
| Preview validation response | `src/core/runtime/contracts/schemas/preview-validation-response.schema.json` | `preview-validation-response.valid.json` | `invalid/preview-validation-response.bad-state.json` |
| Runtime error response | `src/core/runtime/contracts/schemas/runtime-error-response.schema.json` | `runtime-error-response.invalid-preview.json` | `invalid/runtime-error-response.missing-request-id.json` |

## Positive Cases Required

- matched homepage route
- matched marketing page route
- matched category page route
- matched product page route
- valid route-resolution request envelope
- valid page-payload request envelope
- valid navigation request envelope
- valid theme request envelope
- valid preview-validation request envelope
- redirect route
- not-found route
- published page payload
- localized navigation payload
- localized theme payload
- authorized preview validation
- normalized runtime errors

## Negative Cases Required

- unknown tenant
- suspended or inactive tenant
- invalid locale
- route-resolution request missing path
- route not found
- page payload not found after route resolution
- preview token missing
- preview token malformed
- preview token expired
- preview token tenant mismatch
- preview token page mismatch
- cache key missing tenant, locale, runtime version, or path
- runtime log missing `tenant_id`, `locale`, `path`, or `request_id`

## Future Phase Mapping

| Future phase | Required automation |
|---|---|
| Phase 2 | backend unit, integration, contract, and negative-path tests |
| Phase 3 | frontend DTO normalization, integration, SSR, and hydration tests |
| Phase 5 | security and cache invalidation tests for preview flows |
| Phase 6 | performance, SEO, and tenant isolation certification tests — see `tests/Feature/Storefront/StorefrontRuntimeTest.php` and `npm run runtime:verify:phase6` |

## Phase 1 Evidence

Phase 1 is considered implementation-ready when:

- schemas are checked in
- positive and negative examples are checked in or documented
- the validation command passes
- the owner docs point to the contract package
- implementation work for Phases 2 and 3 can reference these frozen contracts directly
