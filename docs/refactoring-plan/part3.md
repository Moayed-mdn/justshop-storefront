# Storefront Platform Refactor Master Plan — Part 3

## 21. Detailed File-by-File Refactor Plan

### Objective
Provide an explicit migration mapping from the CURRENT Nuxt storefront structure into the FUTURE storefront platform architecture.
This section exists specifically so another engineer or AI agent can execute the migration safely without guessing ownership boundaries.

### 21.1 Current → Future Ownership Mapping

| Current File/Area | Current Problem | Future Owner | Required Action |
| :--- | :--- | :--- | :--- |
| `app/composables/useApi.ts` | Mixed transport + UI error logic | `core/api/` | Split into transport, auth, tenant, error layers |
| `app/composables/useProduct.ts` | Route-coupled fetching | `domains/catalog/` | Remove route ownership |
| `app/composables/useProductFilters.ts` | Duplicated filter mapping | `domains/catalog/filters/` | Create shared filter manager |
| `app/stores/cart.ts` | Frontend business logic | `domains/checkout/` | Backend-authoritative cart |
| `app/components/hero/*` | Self-fetching UI | `themes/*` | Convert into presentational sections |
| `shared/utils/routes.ts` | Mixed API/runtime ownership | `core/runtime/routes/` | Split by domain |
| `app.vue` | Distributed SEO/runtime boot | `core/runtime/` | Move runtime orchestration out |
| `layouts/default.vue` | Static layout ownership | `core/rendering/LayoutManager.vue` | Dynamic runtime layouts |
| `middleware/auth.ts` | Tenant-unaware | `core/runtime/middleware/` | Tenant-aware middleware |
| `server/api/*` | Thin proxy only | `server/api/storefront/` | Full orchestration layer |

---

## 22. Detailed Infrastructure Refactor

### 22.1 Refactor useApi.ts

#### Current Problems
Mixed responsibilities:
- request transport
- auth handling
- localization
- toast UI
- token handling
- tenant handling
- error handling

This violates architectural separation.

#### Required Final Structure
`core/api/`
- `client.ts`
- `transport.ts`
- `headers.ts`
- `auth.ts`
- `tenant.ts`
- `localization.ts`
- `errors.ts`
- `dto/`

#### Responsibilities Breakdown
**transport.ts**
- **MUST**: create fetch instance, handle retries, handle timeout, handle serialization.
- **MUST NOT**: show UI errors, know auth state, know components.

**headers.ts**
- **MUST**: inject locale, inject tenant, inject version, inject preview tokens.

**auth.ts**
- **MUST**: inject auth tokens, handle refresh flow, normalize auth failures.
- **MUST NOT**: redirect pages, mutate router.

**errors.ts**
- **MUST**: normalize backend errors, map runtime errors, create typed frontend errors.

### 22.2 Refactor Runtime Cache Keys

#### Current Problem
Current keys: `hero-banners-en`. This creates:
- cross-tenant leakage
- invalid hydration
- stale SSR

#### Required Pattern
`tenant:{tenantId}:locale:{locale}:domain:{domain}:key:{resource}`

#### Example
`tenant:15:locale:en:domain:catalog:key:featured-products`

#### Required Utility
`core/cache/createRuntimeKey.ts`

#### MUST Rules
ALL `useAsyncData`, `useFetch`, runtime payloads, route payloads, and theme payloads MUST use tenant-scoped keys.

### 22.3 Refactor Localization Ownership

#### Current Problem
Localization currently depends on:
- cookies
- filesystem prefixes
- local route assumptions

**NOT**:
- runtime CMS slugs
- localized route resolution
- localized storefront payloads

#### Required Final Ownership
`core/localization/`

#### Required Structure
- `resolveLocale.ts`
- `resolveDirection.ts`
- `resolveLocalizedPath.ts`
- `useRuntimeLocale.ts`

#### MUST Rules
Locale resolution MUST happen **Before route resolution**, NOT inside components.

---

## 23. Domain-by-Domain Refactor Plan

### 23.1 Catalog Domain Refactor

#### Current Problems
Current catalog logic is:
- route-coupled
- page-coupled
- query-coupled
- duplicated
- not reusable

#### Required Final Structure
`domains/catalog/`
- `composables/`
- `services/`
- `filters/`
- `dto/`
- `contracts/`

#### Required Extraction
Extract out of pages, UI sections, and route watchers:
- filter management
- sorting
- pagination
- product mapping
- collection fetching
- search params

#### Required Shared Filter Manager
`domains/catalog/filters/useFilterManager.ts`
- **MUST**: own URL sync, own filter state, own pagination, own sort state, support SSR, support runtime rendering.

#### Product Page Refactor
Current Problem: Product pages currently own fetching, SEO, route assumptions, and related products.
Required Future: Product pages become **Runtime templates**.
**Example Flow**: Route Resolver → Resource Type = product → Load Product Template → Section Renderer → Presentational Components.

### 23.2 Search Domain Refactor

#### Current Problems
Search ownership is fragmented across GraphQL layer, composables, page state, and query sync.

#### Required Final Structure
`domains/search/`
- `engine/`
- `adapters/`
- `dto/`
- `composables/`

#### Required Rules
Search MUST support: SSR, tenant-aware indexing, localized indexing, debounced hydration, lazy loading, and runtime-driven sections.

### 23.3 Customer Domain Refactor

#### Required Final Structure
`domains/customer/`
- `profile/`
- `orders/`
- `addresses/`

#### MUST Rules
Customer domain MUST remain isolated from storefront runtime, CMS, and theme engine.
**Reason**: Customer functionality is transactional, security-sensitive, and session-sensitive. This should migrate LAST.

### 23.4 Checkout Domain Refactor

#### Required Strategy
Checkout should initially remain on the **Legacy runtime**.
**Reason**: Checkout has payment risk, session risk, cart synchronization risk, auth risk, and pricing risk.

#### Migration Sequence
ONLY migrate checkout AFTER:
- tenant runtime stabilizes
- rendering engine stabilizes
- API orchestration stabilizes
- cart isolation stabilizes

---

## 24. Section Component Refactor Strategy

### 24.1 Current Component Problem
Current sections fetch data internally, own loading state, own route state, own SEO assumptions, and own pagination. This blocks CMS rendering.

### 24.2 Required Final Component Pattern
ALL sections MUST become:
```vue
<script setup lang="ts">
defineProps<{
  section: CmsSection
  data: unknown
}>()
</script>
```

#### MUST Rules
- **Components MUST**: render props only, support SSR, support skeleton state, support empty state, support runtime injection, support theme overrides.
- **Components MUST NEVER**: fetch data, know API routes, know tenant, know locale, know runtime payload shape.

### 24.3 Migration Adapter Layer
Required Temporary Layer: `core/rendering/adapters/`
- **Purpose**: Allow old components to temporarily work inside the new runtime.
- **Example**: Legacy `HeroSection` → Adapter → Presentational Props.
- **IMPORTANT**: Adapters are temporary migration tools, NOT permanent architecture.

---

## 25. Dynamic Layout Engine Plan

### 25.1 Current Problem
Layouts are static, filesystem-owned, and globally hardcoded.

#### Required Final Structure
`core/rendering/layouts/`

#### Required Layout Manager
```vue
<NuxtLayout :name="resolvedLayout">
  <SectionRenderer />
</NuxtLayout>
```

#### Layout Responsibilities
- **MUST**: render structural wrappers, inject navigation, inject theme styles, inject runtime slots, inject SEO wrappers.
- **MUST NOT**: fetch business data, own sections, own domain logic.

### 25.2 Navigation Refactor
Current Problem: Navigation is static and filesystem-oriented.
Required Final Ownership: **CMS Navigation Engine**.
**Navigation MUST support**: localized menus, tenant menus, nested menus, footer menus, preview mode, and runtime updates.

---

## 26. Preview Mode Architecture

### 26.1 Objective
Allow merchants to preview unpublished storefront changes safely.

#### Required Architecture
Preview mode MUST:
- bypass CDN cache
- bypass published payloads
- use draft payloads
- remain tenant-scoped
- remain authenticated

#### Required Preview Flow
Merchant opens preview → Generate preview token → Frontend receives `?preview=true` → Runtime injects preview token → Backend serves draft version.

#### Required Security Rules
Preview tokens MUST: expire, remain tenant-scoped, remain page-scoped, and never expose unpublished content globally.

---

## 27. SEO Migration Plan

### 27.1 Current Problem
SEO ownership is fragmented across page-level, component-level, composable-level, and duplicated.

#### Required Final Ownership
`core/seo/`

#### Required Structure
- `useRuntimeSeo.ts`
- `mergeSeo.ts`
- `jsonld/`
- `canonical/`
- `hreflang/`

### 27.2 SEO Rules
- **ONLY the runtime should**: inject meta tags, inject canonical URLs, inject JSON-LD, inject OG tags, inject robots tags.
- **Components MUST NEVER**: own canonical URLs, inject global metadata, inject sitewide SEO.

### 27.3 Structured Data Ownership
Runtime MUST support: Product JSON-LD, Breadcrumb JSON-LD, Organization JSON-LD, Collection JSON-LD, and CMS Page JSON-LD.

---

## 28. SSR & Hydration Protection Plan

### 28.1 Current Risk
The migration introduces major hydration risks: tenant mismatch, locale mismatch, theme mismatch, section mismatch, and async rendering mismatch.

#### Required SSR Rules
MUST serialize into `nuxtApp.payload`: tenant payload, theme payload, route payload, localization payload, and preview state.

### 28.2 Hydration Safety Rules
Runtime MUST avoid: client-only tenant resolution, post-hydration theme injection, async layout swapping after mount, and route mutation during hydration.

### 28.3 Async Component Rules
Async sections MUST: have deterministic placeholders, avoid layout shift, avoid SSR mismatch, and preserve section height.

---

## 29. Performance Architecture Plan

### 29.1 Runtime Performance Goals
The future runtime MUST support: SSR-first rendering, edge cacheability, tenant cache isolation, section lazy hydration, payload chunking, async section rendering, and CDN invalidation.

### 29.2 Required Optimization Areas
- **Route Resolution**: MUST remain lightweight, remain cacheable, and avoid loading full page payloads.
- **Storefront Payloads**: MUST support chunking, support lazy sections, and support deferred fetches.
- **Theme Runtime**: MUST inject SSR styles, avoid runtime stylesheet generation, and avoid repaint loops.

### 29.3 Lazy Section Strategy
Below-the-fold sections MUST: lazy hydrate, lazy fetch if possible, and use intersection observers.

---

## 30. Security & Tenant Isolation Plan

### 30.1 Critical Security Objective
Prevent ALL forms of cross-tenant leakage.
**MUST Isolate**: cache keys, API payloads, theme payloads, preview payloads, localized payloads, navigation payloads, and SEO payloads.

### 30.2 Required Security Layers
- **Layer 1 — Tenant Middleware**: Validates tenant existence, domain ownership, and suspension state.
- **Layer 2 — API Scoping**: Injects `X-Tenant-Id` INTO ALL REQUESTS.
- **Layer 3 — Runtime Cache Isolation**: ALL runtime cache keys MUST include `tenant_id`, locale, and runtime version.
- **Layer 4 — Preview Isolation**: Preview mode MUST bypass public cache, remain authenticated, and remain scoped.

---

## 31. Required Backend Coordination Tasks

### 31.1 Backend MUST Build
**Required APIs**:
- `/api/v1/storefront/resolve`
- `/api/v1/storefront/page/{id}`
- `/api/v1/storefront/navigation`
- `/api/v1/storefront/theme`

**Required Contracts**:
- Backend MUST guarantee: versioned payloads, stable DTO contracts, camelCase serialization, ISO date formatting, tenant scoping, and locale scoping.

### 31.2 Backend MUST Support
CMS Runtime Features: section ordering, layout selection, route resolution, SEO payloads, preview payloads, localized payloads, theme overrides, and navigation payloads.

### 31.3 Backend MUST NOT
Backend MUST NOT: expose raw admin payloads, expose internal DB structures, expose unversioned schemas, or expose unnormalized assets.

---

## 32. Final Engineering Rules

### 32.1 Architecture Rules
**NEVER**: allow sections to self-fetch, allow pages to own SEO, allow layouts to own business data, allow components to know tenants, allow themes to own logic, or allow raw backend payloads into UI.

### 32.2 Runtime Rules
**ALWAYS**: resolve tenant first, resolve locale second, resolve route third, resolve payload fourth, and render sections last.

### 32.3 Migration Rules
**ALWAYS**: migrate incrementally, preserve SEO, preserve SSR, preserve route stability, preserve hydration consistency, preserve tenant isolation, and preserve cache isolation.

---

## 33. Final End-State Architecture

**Final Runtime Flow**:
Incoming Request → Tenant Middleware → Locale Resolver → Route Resolver → Storefront Payload Loader → SEO Runtime Engine → Theme Runtime Injection → Layout Manager → Section Renderer → Presentational Components

---

## 34. Final Result of the Transformation

After completion, the platform will support:
- **Multi-tenancy**: tenant isolation, domain-based storefronts, and merchant-specific branding.
- **Dynamic CMS Rendering**: schema-driven pages, merchant-managed layouts, dynamic sections, and preview mode.
- **Runtime Rendering**: SSR-first storefronts, lazy hydration, dynamic layouts, and dynamic SEO.
- **Theme System**: runtime themes, merchant customization, theme inheritance, and live preview.
- **Scalability**: tenant-aware caching, CDN invalidation, DTO versioning, and backend/frontend decoupling.
- **Long-term Maintainability**: strict ownership boundaries, reusable domains, rendering isolation, stable contracts, and extensible architecture.
