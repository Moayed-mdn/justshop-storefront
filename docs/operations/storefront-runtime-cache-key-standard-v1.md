# Storefront Runtime Cache Key Standard v1

## Purpose

This specification defines the canonical key format for all storefront runtime cache artifacts.

## Canonical Format

```text
storefront_runtime:{runtime_version}:tenant:{tenant_key}:locale:{locale}:artifact:{artifact}:path:{normalized_path}
```

## Required Segments

| Segment | Required | Example | Rule |
|---|---|---|---|
| `storefront_runtime` | Yes | `storefront_runtime` | Fixed prefix |
| `{runtime_version}` | Yes | `2026-05-28` | Serializer/runtime contract version |
| `{tenant_key}` | Yes | `justshop-demo` | Tenant slug/key, never omitted |
| `{locale}` | Yes | `en` | Final resolved locale |
| `{artifact}` | Yes | `page` | `route`, `page`, `navigation`, `theme`, `seo` |
| `{normalized_path}` | Yes | `/about-us` | Normalized route/path identity |

## Normalization Rules

- `/` remains `/`.
- Non-root paths drop trailing slashes.
- Query strings are excluded from the canonical path unless a later approved contract explicitly promotes them into route identity.
- Locale-prefixed paths remain locale-specific only when that prefix is part of the resolved storefront path.
- The path segment must represent the route or resource identity used by the runtime resolver.

## Artifact Rules

| Artifact | Example key | Notes |
|---|---|---|
| `route` | `storefront_runtime:2026-05-28:tenant:justshop-demo:locale:en:artifact:route:path:/about-us` | Route resolution output |
| `page` | `storefront_runtime:2026-05-28:tenant:justshop-demo:locale:en:artifact:page:path:/about-us` | Page payload DTO |
| `navigation` | `storefront_runtime:2026-05-28:tenant:justshop-demo:locale:en:artifact:navigation:path:/about-us` | Navigation payload |
| `theme` | `storefront_runtime:2026-05-28:tenant:justshop-demo:locale:en:artifact:theme:path:/about-us` | Theme payload |
| `seo` | `storefront_runtime:2026-05-28:tenant:justshop-demo:locale:en:artifact:seo:path:/about-us` | SEO payload when cached separately |

## Preview Rules

- Authorized preview requests must bypass shared public caches.
- Preview requests must not reuse the public runtime key space.
- If a private preview cache is introduced later, it must still include tenant, locale, runtime version, and path, plus a preview-scoped marker that is not shareable across tenants or pages.

## Tag Rules

Every cacheable response must emit tags that allow tenant-safe invalidation later:

- `tenant:{tenant_key}`
- `locale:{locale}`
- `artifact:{artifact}`
- `path:{normalized_path}`
- `page:{page_id}` where applicable
