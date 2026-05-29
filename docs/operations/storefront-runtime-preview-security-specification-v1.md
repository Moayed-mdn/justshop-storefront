# Storefront Runtime Preview Security Specification v1

## Purpose

This specification defines the Phase 1 preview token rules that later preview APIs and runtime fetches must enforce.

## Token Requirements

| Claim or property | Type | Allowed values | Nullable | Example | Notes |
|---|---|---|---|---|---|
| `token_id` | `string` | opaque identifier | No | `pvt_01jwx4mj2vfd9a0q4zjqx2f81g` | Unique token id |
| `tenant_id` | `string` | resolved tenant id | No | `store_42` | Tenant-scoped |
| `page_id` | `string` | resolved page id | No | `mkt_about_us` | Page-scoped |
| `locale` | `string` | `en`, `ar` | No | `en` | Locale-scoped |
| `expires_at` | `string` | ISO 8601 timestamp | No | `2026-05-28T10:15:00Z` | Mandatory expiry |
| `issued_by` | `string` | authorized issuer identifier | No | `cms_admin_7` | Audit field |

## Validation Rules

- Preview validation is required before draft payload delivery.
- A token is valid only when tenant, page, locale, and expiry all match the request.
- Tokens must be rejected when replayed against a different tenant or page.
- Tokens must be rejected when expired.
- Authorized preview responses must set `cacheBypass = true`.
- Preview-authorized payloads must never enter shared public caches.

## Response States

| State | Meaning | Expected response |
|---|---|---|
| `authorized` | token is valid for tenant, page, locale, and time window | `valid = true`, `cacheBypass = true` |
| `denied` | token missing, malformed, or scope mismatch | `valid = false`, normalized runtime error when necessary |
| `expired` | token scope matches but time window has passed | `valid = false`, `runtime.preview_expired` |

## Negative Paths Required

- missing token
- malformed token
- expired token
- tenant mismatch
- page mismatch
- locale mismatch
- replay attempt across tenant or page boundaries

## Logging Rules

- Logs must include `tenant_id`, `locale`, `path`, and `request_id`.
- Logs must not include the raw preview token.
- Preview denial reasons may be logged with machine-readable causes such as `tenant_page_scope_mismatch`.
