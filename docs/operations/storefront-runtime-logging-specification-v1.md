# Storefront Runtime Logging Specification v1

## Purpose

This specification defines the required runtime log and trace schema for the storefront runtime.

## Required Structured Fields

Every runtime log emitted by Laravel runtime APIs must include these fields:

| Field | Type | Allowed values | Nullable | Example | Notes |
|---|---|---|---|---|---|
| `tenant_id` | `string` | resolved tenant id | Yes | `store_42` | `null` only before tenant resolution succeeds |
| `tenant_key` | `string` | normalized store slug/key | Yes | `justshop-demo` | Cache and routing correlation field |
| `locale` | `string` | `en`, `ar` | No | `en` | Final resolved locale |
| `path` | `string` | normalized storefront path | No | `/about-us` | No trailing slash except `/` |
| `request_id` | `string` | opaque request id | No | `req_01jwx4m3r8z7h8v0y7k4p91d3e` | Correlates all runtime events |
| `runtime_version` | `string` | contract version | No | `2026-05-28` | Matches serializer version |
| `artifact` | `string` | `route`, `page`, `navigation`, `theme`, `seo`, `preview` | No | `page` | Runtime artifact family |
| `event` | `string` | see event catalog | No | `runtime.page.loaded` | Machine-readable event name |
| `status` | `string` | `success`, `failure`, `bypassed` | No | `success` | Outcome class |
| `duration_ms` | `integer` | non-negative integer | Yes | `42` | Required for completed operations |

## Event Catalog

| Event | When emitted |
|---|---|
| `runtime.tenant.resolved` | domain-to-tenant resolution succeeds |
| `runtime.tenant.rejected` | tenant missing or inactive |
| `runtime.route.resolved` | route resolution completes |
| `runtime.route.redirect` | redirect response selected |
| `runtime.page.loaded` | page DTO serialization completes |
| `runtime.navigation.loaded` | navigation DTO serialization completes |
| `runtime.theme.loaded` | theme DTO serialization completes |
| `runtime.preview.validated` | preview token validation completes |
| `runtime.cache.hit` | cache hit for any runtime artifact |
| `runtime.cache.miss` | cache miss for any runtime artifact |
| `runtime.cache.bypass` | preview or non-cacheable request bypasses shared cache |
| `runtime.error.normalized` | normalized runtime error response emitted |

## Trace Propagation Rules

- Nuxt must send `X-Request-Id` on runtime requests once the runtime wiring phase begins.
- Laravel must return or echo the same request id in `requestContext.requestId`.
- Every runtime log line for the request must reuse the same `request_id`.
- Preview validation and page payload loading must keep the same request id across the request chain.

## Example Log Record

```json
{
  "tenant_id": "store_42",
  "tenant_key": "justshop-demo",
  "locale": "en",
  "path": "/about-us",
  "request_id": "req_01jwx4m3r8z7h8v0y7k4p91d3e",
  "runtime_version": "2026-05-28",
  "artifact": "page",
  "event": "runtime.page.loaded",
  "status": "success",
  "duration_ms": 42
}
```

## Redaction Rules

- Do not log preview tokens, auth tokens, cookies, or raw serialized section props containing secrets.
- Error details may include machine-readable causes but must not include stack traces in public API responses.
- Tenant resolution failures may include host/domain internally, but public runtime errors must remain normalized.
