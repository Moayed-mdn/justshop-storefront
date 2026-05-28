# JUSTSHOP STOREFRONT PLATFORM TRANSFORMATION PLAN
## Part 1 — Core Platform Refactor & Runtime Foundation

### 1. PLATFORM TRANSFORMATION OBJECTIVE
The goal is NOT to refactor a Nuxt storefront.
The goal is to transform the current application into a:
- multi-tenant storefront runtime
- schema-driven rendering platform
- CMS-orchestrated commerce engine
- themeable storefront infrastructure
- tenant-isolated SSR platform

The future architecture must support:
- merchant-managed storefronts
- dynamic CMS pages
- tenant-aware SSR
- dynamic layouts
- theme inheritance
- section rendering
- route resolution
- storefront API orchestration
- future apps/extensions
- platform-wide caching
- preview environments
- multi-domain storefronts

**WITHOUT:**
- rebuilding the frontend per merchant
- hardcoded page ownership
- tenant cache leakage
- business logic duplication
- frontend pricing orchestration

---

### 2. NON-NEGOTIABLE ARCHITECTURAL RULES
These rules are mandatory and must never be violated during implementation.

#### RULE 1 — TENANT ISOLATION IS THE HIGHEST PRIORITY
Everything must become tenant-aware. Required isolation layers:
- SSR payloads
- cache keys
- API requests
- route resolution
- theme resolution
- CMS payloads
- SEO metadata
- localization
- storefront configuration

No shared runtime state may exist between tenants. Every cache key MUST include:
- tenant_id
- locale
- environment
- route

**Example:** `tenant:12:locale:en:route:/products/shoes`

#### RULE 2 — THE FRONTEND MUST NOT BECOME A BUSINESS ENGINE
The frontend runtime may orchestrate rendering. It must NOT own:
- pricing calculations
- inventory logic
- discount logic
- tax calculations
- recommendation algorithms
- merchandising rules

Those belong to backend services. Frontend responsibilities:
- rendering
- hydration
- layout orchestration
- section composition
- SEO injection
- progressive loading

#### RULE 3 — CMS COMPONENTS MUST BE PRESENTATIONAL
Sections must become “dumb components”.
- **Bad:** `HeroBanner.vue` -> fetches data -> owns API calls -> transforms backend responses
- **Correct:** `HeroBanner.vue` receives props only.

All orchestration must move to:
- Storefront Runtime
- Data Orchestrator
- Section Resolver

#### RULE 4 — FILE-BASED ROUTING MUST STOP BEING THE PLATFORM CORE
Nuxt filesystem routing remains only for:
- auth
- checkout
- account
- admin/internal flows
- temporary migration compatibility

The storefront itself must become:
- resolver-driven
- CMS-driven
- runtime-driven

The platform entrypoint becomes: `app/pages/[...slug].vue`

#### RULE 5 — STOREFRONT RUNTIME CONTRACTS ARE PLATFORM LAW
The contracts defined in `storefront-runtime-contracts.md` become the source of truth. Frontend components must NEVER depend directly on:
- Laravel model names
- database fields
- backend implementation details

Everything must pass through DTO normalization.

#### RULE 6 — THEMES ARE PRESENTATIONAL ONLY
Themes may control:
- layouts
- tokens
- CSS
- animations
- section visuals

Themes may NOT control:
- business logic
- API behavior
- auth flows
- routing
- checkout security
- tenant resolution

#### RULE 7 — DUAL RUNTIME MIGRATION IS MANDATORY
The migration must NEVER use a “big bang rewrite”. The system must support:
- Legacy Runtime + Platform Runtime simultaneously.

---

### 3. TARGET PLATFORM ARCHITECTURE
The final architecture becomes:
```text
src/
├── core/
├── domains/
├── platform/
├── themes/
├── ui/
├── server/
└── app/
```

---

### 4. FINAL RESPONSIBILITY MODEL

#### CORE
Platform infrastructure. Owns:
- tenant runtime
- API orchestration
- rendering engine
- route resolver
- cache system
- SEO engine
- error normalization

**Must NEVER contain:**
- UI business components
- checkout logic
- catalog logic

#### DOMAINS
Business capabilities. Examples:
```text
domains/
  catalog/
  checkout/
  customer/
  identity/
```
Own:
- business composables
- DTO types
- domain services
- domain stores

**Must NEVER:**
- resolve layouts
- control SSR runtime
- inject themes

#### PLATFORM
Runtime orchestration layer. Owns:
- CMS rendering
- section registry
- layout manager
- route runtime
- dynamic rendering
- preview runtime

#### THEMES
Pure presentation layer. Owns:
- tokens
- layouts
- section styles
- visuals

**Must NEVER:**
- fetch APIs
- mutate stores
- own business rules

#### UI
Reusable design system. Examples:
- buttons
- modals
- cards
- typography
- loaders

---

### 5. IMPLEMENTATION PHASES
Implementation MUST follow this exact order. Changing the order introduces major architectural risk.

#### PHASE 1 — TENANT FOUNDATION (MANDATORY FIRST)
Goal: Introduce tenant awareness without changing UI behavior.

**5.1 Create Tenant Runtime**
Create: `src/core/tenant/`
Required modules:
```text
tenant/
  resolver/
  composables/
  middleware/
  cache/
  types/
```

**5.2 Implement Nitro Tenant Middleware**
Create: `server/middleware/01.tenant.ts`
Responsibilities:
- resolve hostname
- resolve tenant
- inject tenant context
- attach request metadata

Must support:
- production domains
- preview domains
- localhost
- staging environments

Must reject:
- suspended tenants
- unknown tenants

**5.3 Create Storefront Context**
Create `StorefrontContext` interface:
- tenant
- locale
- currency
- theme
- preview
- route
- featureFlags
- requestId

Expose via: `useStorefrontContext()`. This becomes globally available. All future systems MUST consume this context.

**5.4 Implement Tenant-Aware API Layer**
Refactor: `useApi`, `useServerApi`, Nitro proxies.
Requirements:
- auto inject tenant headers
- auto inject locale
- auto inject preview state
- normalize errors

Required headers:
- `X-Tenant-Id`
- `X-Storefront-Locale`
- `X-Storefront-Version`
- `X-Preview-Token`

**5.5 Implement Tenant Cache Scoping**
Every `useAsyncData`, Nitro cache, payload cache, and API cache must become tenant-scoped.
Create: `core/cache/`
Required utility: `createTenantCacheKey()`

**5.6 Introduce Feature Flag Runtime**
Create: `core/runtime/feature-flags/`
Must support:
- tenant-based flags
- route-based flags
- preview flags
- runtime toggles

---

### 6. PHASE 2 — STOREFRONT CORE RUNTIME
Goal: Build runtime infrastructure before migrating pages.

**6.1 Create Runtime Route Resolver**
Create: `core/runtime/router/`
Responsibilities:
- resolve path
- identify resource type
- fetch CMS route metadata
- handle redirects
- handle 404s

**Must NEVER:** render components directly.

**6.2 Implement Catch-all Route**
Create: `app/pages/[...slug].vue`
Responsibilities:
- call resolver
- fetch runtime payload
- initialize rendering pipeline

This becomes the storefront runtime entrypoint.

**6.3 Create Rendering Engine**
Create: `core/rendering/`
Required modules:
```text
rendering/
  renderer/
  registry/
  orchestrator/
  hydration/
  boundaries/
```

**6.4 Create Component Registry**
Required structure:
```text
registry/
  sections/
  blocks/
  layouts/
  capabilities/
```
Registry responsibilities:
- component lookup
- lazy loading
- version resolution
- compatibility validation

**6.5 Create Section Renderer**
Responsibilities:
- loop sections
- inject props
- isolate errors
- handle async sections
- support lazy hydration

Must support:
- fallback rendering
- missing component protection
- loading boundaries

**6.6 Create Layout Runtime**
Responsibilities:
- dynamic layouts
- theme-aware layouts
- runtime layout injection

Replace `<NuxtLayout name="default" />` with runtime selection.

---

### 7. PHASE 3 — API ORCHESTRATION LAYER
Goal: Stop exposing raw backend structures to frontend components.

**7.1 Create Storefront API Namespace**
Introduce: `/api/storefront/*`
This becomes the ONLY frontend-facing API boundary.

**7.2 Create DTO Layer**
Create: `core/api/dto/`
Responsibilities:
- normalization
- transformation
- serialization safety
- versioning

Required DTOs: products, collections, navigation, SEO, tenant, themes, pages, sections.

**7.3 Create Error Normalization Layer**
Standardize: validation errors, auth errors, tenant errors, CMS errors, rendering errors.

---

### 8. PHASE 4 — COMPONENT DECOUPLING
Goal: Transform self-fetching components into presentational sections.

**8.1 Refactor Strategy**
DO NOT refactor everything at once. Migration order:
1. Hero banners
2. Marketing blocks
3. Collections
4. Product grids
5. Navigation
6. Footer
7. Category pages
8. Product pages
9. Checkout
10. Auth

**8.2 Create Compatibility Adapter Layer**
Create: `platform/adapters/`
Responsibilities:
- transform old props
- bridge runtime payloads
- support hybrid rendering

**8.3 Remove Component-Owned Fetching**
Every section must stop calling APIs, reading routes directly, and transforming backend data. Move all orchestration to:
- runtime
- section orchestrator
- DTO transformers

---

### 9. PHASE 5 — SEO RUNTIME
Goal: Centralize SEO ownership.

**9.1 Create SEO Engine**
Create: `core/seo/`
Responsibilities:
- merge tenant SEO
- merge entity SEO
- inject structured data
- canonical handling
- locale alternates

**9.2 Remove Distributed SEO Ownership**
Pages/components must stop manually owning SEO or duplicating meta generation. SEO becomes runtime-controlled.
