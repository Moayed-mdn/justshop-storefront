# Storefront Runtime DTO Mapping Specification v1

## Purpose

This specification defines how Laravel-owned source models and resources must be transformed into stable runtime DTOs before Nuxt consumes them.

## Mapping Principles

- DTOs are the only allowed integration surface between Laravel runtime APIs and Nuxt storefront rendering.
- Raw Eloquent models, unnormalized resource arrays, and backend-only fields must not be passed directly to frontend components.
- Serializer output must be deterministic for SSR and hydration.
- DTO keys use `camelCase`.
- Localized values are resolved in Laravel before serialization.
- Section DTOs are presentational-only and must not require frontend section components to fetch direct data.

## Source To DTO Ownership

| DTO | Backend source baseline | Normalization outcome |
|---|---|---|
| `RuntimeRouteResolutionResponse` | tenant/domain resolution service plus route lookup services | single resolved route contract with cache metadata |
| `RuntimePagePayloadResponse` | `MarketingPageResource`, marketing repositories, commerce page adapters | normalized page dto with sections and seo |
| `RuntimeNavigationResponse` | future navigation/menu service | header/footer navigation trees |
| `RuntimeThemeResponse` | store settings and theme configuration services | theme tokens, assets, and direction settings |
| `RuntimePreviewValidationResponse` | preview validation service | page-scoped authorization state |
| `RuntimeErrorResponse` | runtime exception mappers | stable machine-readable errors |

## Tenant Mapping Rules

| Source field | DTO field | Rule |
|---|---|---|
| `Store.id` | `requestContext.tenantId` | Convert to string |
| `Store.slug` | `requestContext.tenantKey` | Use normalized slug/key for cache keys and tags |
| `Store.domain` | not exposed directly in standard DTO responses | Used for tenant resolution and canonical URL generation |
| `Store.status`, `Store.is_active`, `Store::isOperational()` | error or allow runtime | Inactive tenants return `runtime.tenant_inactive`; do not leak raw lifecycle fields |

## Marketing Page Mapping Rules

The current backend baseline for marketing page serialization is `MarketingPageResource`.

| Backend source | DTO target | Rule |
|---|---|---|
| `id` | `data.page.id` | Convert to string |
| localized `title` | `data.page.title` | Resolve locale before serialization |
| localized `slug` | `data.page.slug` | Resolve locale before serialization and strip leading slash |
| `page_type` or template/type enum | `data.page.pageType` | Normalize to `home`, `marketing_page`, `category_page`, or `product_page` |
| layout/template mapping | `data.page.layout` | Normalize to `default`, `marketing`, `catalog`, or `product` |
| publication status | `data.page.status` | `published` for public responses, `draft` only with preview authorization |
| `updated_at` | `data.page.updatedAt` | ISO 8601 |
| `published_at` | `data.page.publishedAt` | ISO 8601 or `null` |

## Section Mapping Rules

| Source shape | DTO field | Rule |
|---|---|---|
| source section identifier | `sections[].id` | Must be stable across SSR and hydration |
| source section type enum/string | `sections[].type` | Preserve semantic type key |
| runtime component registry key | `sections[].component` | Map explicitly; do not infer in Vue components |
| merchant settings and prefetched content | `sections[].props` | Normalize into presentational-only props |
| serializer version | `sections[].version` | Start at `1` |
| completeness/fallback status | `sections[].dataState` | `ready`, `empty`, or `error` |

### Section Hard Rules

- Section props must be JSON-serializable.
- Section DTOs must not include backend model class names.
- Section DTOs must not include API endpoints for the section to fetch later.
- Invalid or unknown source sections must map to a safe fallback component in later phases, not to raw content blobs.

## SEO Mapping Rules

| Backend source | DTO target | Rule |
|---|---|---|
| resolved SEO title | `data.page.seo.title` | Locale-resolved final title |
| resolved SEO description | `data.page.seo.description` | Locale-resolved final description |
| resolved canonical | `data.page.seo.canonicalUrl` | Absolute URL, tenant and locale aware |
| robots directives | `data.page.seo.robots` | Normalize to supported string enum |
| alternate locale URLs | `data.page.seo.hreflang[]` | One entry per supported locale |
| OG metadata | `data.page.seo.openGraph.*` | Normalize to explicit object |
| Twitter metadata | `data.page.seo.twitter.*` | Normalize to explicit object |
| structured data | `data.page.seo.jsonLd[]` | Array of JSON-LD objects |

## Navigation Mapping Rules

| Source field | DTO field | Rule |
|---|---|---|
| menu item id | `id` | Stable string |
| localized label | `label` | Locale-resolved |
| internal route or absolute URL | `path` | Relative path unless `external = true` |
| external-link flag | `external` | Explicit boolean |
| nested children | `children[]` | Recursive DTOs using same shape |

## Theme Mapping Rules

| Source field | DTO field | Rule |
|---|---|---|
| tenant theme key | `data.themeKey` | Stable identifier |
| color and font tokens | `data.tokens.*` | Flatten to runtime-safe token object |
| logo and favicon assets | `data.assets.*` | Absolute URL or `null` |
| locale direction | `data.settings.direction` | Must reflect locale direction, not browser guesswork |
| design radius token | `data.settings.radius` | Restrict to enum |

## Preview Mapping Rules

| Source field | DTO field | Rule |
|---|---|---|
| preview validation result | `data.valid` | Final authorization boolean |
| preview auth state | `data.previewState` | `authorized`, `denied`, or `expired` |
| page binding | `data.pageId` | Must match the requested page id |
| expiry | `data.expiresAt` | ISO 8601 or `null` |
| cache policy | `data.cacheBypass` | `true` for authorized preview responses |

## Error Normalization Rules

| Source condition | Runtime error code | Rule |
|---|---|---|
| unknown domain | `runtime.tenant_not_found` | Do not leak store resolution internals |
| inactive tenant | `runtime.tenant_inactive` | Normalize lifecycle status into one runtime error |
| invalid locale | `runtime.invalid_locale` | Return contract error rather than raw validation bag |
| missing route | `runtime.route_not_found` | Resolver-level failure |
| missing page payload | `runtime.page_not_found` | Payload-level failure |
| preview mismatch | `runtime.preview_invalid` | Use when tenant/page scope does not match |
| preview expired | `runtime.preview_expired` | Use when token is past expiry |
| generic validation issue | `runtime.validation_failed` | Use for bad request input |
| unexpected exception | `runtime.internal_error` | Catch-all normalized failure |
