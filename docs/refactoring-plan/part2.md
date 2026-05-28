# Storefront Platform Refactor Master Plan — Part 2

## 11. Catch-all Runtime Architecture ( [...slug].vue )

### Objective
Replace the current file-based storefront dependency with a runtime-driven resolver architecture while preserving Nuxt routing compatibility and SEO stability.

### 11.1 Responsibilities of [...slug].vue
The catch-all route becomes the orchestration entry point for ALL merchant-managed pages.
It **MUST**:
- Resolve tenant context.
- Resolve route metadata.
- Resolve layout.
- Fetch storefront payload.
- Inject SEO metadata.
- Trigger section rendering.
- Handle redirects.
- Handle preview mode.
- Handle localized routes.
- Handle runtime failures.
- Support SSR and hydration.

It **MUST NOT**:
- Fetch raw product/category data directly.
- Contain business logic.
- Contain hardcoded section mappings.
- Know backend response internals.
- Render sections manually.

### 11.2 Required Files
- `app/pages/[...slug].vue`
- `core/runtime/useRouteResolver.ts`
- `core/runtime/useStorefrontPayload.ts`
- `core/runtime/useRuntimeSeo.ts`
- `core/rendering/SectionRenderer.vue`
- `core/rendering/LayoutManager.vue`
- `core/error/RuntimeErrorBoundary.vue`
- `core/tenant/useTenant.ts`

### 11.3 Required Runtime Flow

#### Step 1 — Tenant Resolution
Before route resolution:
1. Incoming Request
2. Nitro Middleware
3. Resolve `tenant_id`
4. Inject into `event.context`

#### Required Middleware
`server/middleware/01.tenant.ts`

#### Middleware Responsibilities
**MUST**:
- Resolve tenant by hostname.
- Validate tenant status.
- Inject tenant into context.
- Cache tenant lookup.
- Handle suspended tenants.
- Handle maintenance mode.
- Support preview domains.
- Support localhost fallback.

**MUST NOT**:
- Perform page resolution.
- Fetch storefront payload.
- Handle SEO.

### 11.4 Route Resolution Layer

#### Required Composable
`core/runtime/useRouteResolver.ts`

#### Responsibilities
**MUST**:
- Call `/api/v1/storefront/resolve`.
- Pass tenant + locale + path.
- Normalize resolver responses.
- Handle redirects.
- Handle 404.
- Handle invalid locales.
- Support preview tokens.

### 11.5 Resolver Response Contract
Frontend **MUST** normalize:
```typescript
interface RuntimeResolvedRoute {
  status: 'matched' | 'not_found' | 'redirect'
  type: 'page' | 'product' | 'category' | 'collection'
  resourceId: string
  redirectUrl?: string
  cacheTtl: number
}
```
**Important**: NO component should directly consume backend resolver payloads. ALWAYS normalize.

### 11.6 Storefront Payload Loader

#### Required File
`core/runtime/useStorefrontPayload.ts`

#### Responsibilities
**MUST**:
- Fetch storefront page payload.
- Support SSR.
- Support preview mode.
- Normalize sections.
- Normalize theme payload.
- Normalize SEO payload.
- Normalize navigation.
- Normalize localization.

**MUST NOT**:
- Render sections.
- Mutate payload structure.
- Inject UI concerns.

### 11.7 Async Data Strategy

#### Required Pattern
```typescript
const { data } = await useAsyncData(
  runtimeKey,
  () => fetchPayload(),
)
```
Runtime Key **MUST** include:
- `tenant_id`
- locale
- path
- preview state
- payload version

**Example**: `tenant:5:locale:en:path:/about-us:preview:false`

### 11.8 SEO Runtime Engine

#### Required File
`core/runtime/useRuntimeSeo.ts`

#### Responsibilities
**MUST**:
- Merge tenant SEO.
- Merge entity SEO.
- Inject canonical URLs.
- Inject JSON-LD.
- Handle hreflang.
- Handle OpenGraph.
- Handle Twitter cards.
- Handle robots directives.

**MUST NOT**:
- Depend on page components.
- Depend on legacy `useHead()` calls.

### 11.9 Required Migration Rule
**IMPORTANT**: Legacy pages **MUST** gradually stop owning SEO. SEO ownership must move into: **Route Resolver → Runtime SEO Engine**, NOT: **Page Component → useHead()**.

---

## 12. Section Rendering Engine

### Objective
Create a schema-driven rendering engine where the backend controls section composition while Nuxt only orchestrates rendering.

### 12.1 Required Files
- `core/rendering/SectionRenderer.vue`
- `core/rendering/registry.ts`
- `core/rendering/useSectionRegistry.ts`
- `core/rendering/useSectionData.ts`
- `core/rendering/SectionBoundary.vue`
- `core/rendering/SectionFallback.vue`
- `core/rendering/useLazyHydration.ts`

### 12.2 Registry Architecture

#### Required Pattern
```typescript
export const sectionRegistry = {
  hero_banner: defineAsyncComponent(...),
  featured_collection: defineAsyncComponent(...),
}
```
Registry **MUST**:
- Support versioning.
- Support async loading.
- Support lazy hydration.
- Support fallback rendering.
- Support theme overrides.
- Support future app injection.

### 12.3 Registry Versioning
**REQUIRED**: Registry keys **MUST** support version suffixes.
**Example**: `hero_banner:v1`, `hero_banner:v2`.
**Reason**: Avoid breaking old merchant pages after theme upgrades.

### 12.4 Section Component Rules
ALL section components **MUST** become **Presentational-only components**.

**MUST NOT**:
- Fetch data.
- Read route.
- Read query params.
- Know API endpoints.
- Read cookies.
- Read tenant context directly.

**MUST**:
- Accept props.
- Render props.
- Emit UI events only.
- Support skeleton state.
- Support SSR.
- Support lazy hydration.

### 12.5 Data Orchestration Layer

#### Required File
`core/rendering/useSectionData.ts`

#### Responsibilities
**MUST**:
- Fetch section-specific data.
- Resolve collection sources.
- Resolve product sources.
- Resolve CMS sources.
- Normalize API responses.
- Deduplicate requests.
- Parallelize fetches.

**MUST NOT**:
- Render components.
- Own layouts.
- Know theme implementation.

### 12.6 Rendering Flow
Payload → `SectionRenderer` → Registry Lookup → Data Orchestrator → Normalized Props → Presentational Component

### 12.7 Error Isolation

#### Required Wrapper
```vue
<NuxtErrorBoundary>
  <ResolvedSection />
</NuxtErrorBoundary>
```

#### Required Behavior
If one section crashes:
- The page **MUST** continue rendering.
- The section **MUST** fallback gracefully.
- The runtime **MUST** log the failure.

### 12.8 Section Fallback Requirements
Fallback component **MUST**:
- Show safe placeholder.
- Avoid layout shift.
- Avoid hydration mismatch.
- Avoid exposing stack traces.
- Report telemetry.

---

## 13. Theme Runtime System

### Objective
Transform the current static CSS architecture into a tenant-aware runtime theme engine.

### 13.1 Required Files
- `core/theme/useTheme.ts`
- `core/theme/useThemeTokens.ts`
- `core/theme/useThemeStyles.ts`
- `core/theme/useThemeHydration.ts`
- `server/plugins/theme-injector.ts`

### 13.2 Theme Runtime Responsibilities
**MUST**:
- Resolve active theme.
- Resolve merchant overrides.
- Inject CSS variables.
- Prevent FOUC.
- Support preview mode.
- Support live switching.
- Support inheritance.

**MUST NOT**:
- Control routing.
- Fetch storefront pages.
- Own component rendering.

### 13.3 CSS Variable Injection

#### Required SSR Injection
```html
<style id="tenant-theme">
:root {
  --color-primary: #FF5733;
}
</style>
```
**MUST** happen during SSR, NOT after hydration.

### 13.4 Theme Isolation Rules
Merchant customization **MUST** be limited to:
- Colors
- Typography
- Spacing
- Layout variants
- Section settings
- Safe CSS overrides

Merchant customization **MUST NEVER** allow:
- Arbitrary JavaScript
- DOM manipulation
- Runtime scripts
- API access
- Server access

### 13.5 Theme File Ownership
**Core owns**: Runtime engine, Injection engine, Layout system, Theme contracts.
**Themes own**: Styling, Presentational layouts, Design tokens, Section visuals.

---

## 14. API Orchestration Layer

### Objective
Move frontend/business coupling out of composables and into a normalized orchestration boundary.

### 14.1 Required Structure
- `server/api/storefront/`
  - `resolve.get.ts`
  - `page/[id].get.ts`
  - `navigation.get.ts`
  - `theme.get.ts`

### 14.2 Nitro Layer Responsibilities
**MUST**:
- Normalize responses.
- Inject tenant headers.
- Inject locale headers.
- Normalize errors.
- Transform DTOs.
- Merge backend services.
- Cache responses.

**MUST NOT**:
- Render UI.
- Know component structure.
- Handle frontend state.

### 14.3 DTO Layer

#### Required Directory
`core/api/dto/`

#### Required DTOs
- `StorefrontProductDto`
- `StorefrontCategoryDto`
- `StorefrontPageDto`
- `StorefrontThemeDto`

### 14.4 Critical Refactor Rule
Frontend components **MUST NEVER** consume raw Laravel responses.
**ALWAYS**: Laravel → Nitro DTO Transform → Frontend

### 14.5 Error Normalization

#### Required Error Contract
```typescript
interface StorefrontError {
  code: string
  message: string
  action?: string
}
```

#### Required Error Codes
- `TENANT_NOT_FOUND`
- `PAGE_NOT_FOUND`
- `SECTION_NOT_FOUND`
- `THEME_NOT_FOUND`
- `MAINTENANCE_MODE`
- `UNAUTHORIZED_PREVIEW`

---

## 15. Localization Runtime

### Objective
Create tenant-aware localized route resolution.

### 15.1 Current Problem
Current i18n:
- only changes URL prefixes
- does **NOT** synchronize CMS slugs
- does **NOT** synchronize localized pages
- does **NOT** synchronize tenant route resolution

### 15.2 Required Localization Flow
Request → Resolve locale → Resolve tenant → Resolve localized slug → Fetch localized storefront payload

### 15.3 Required Rules
**MUST**:
- Resolve locale before route resolution.
- Support localized slugs.
- Support localized SEO.
- Support RTL.
- Support localized navigation.
- Support localized sections.

**MUST NOT**:
- Hardcode translations in components.
- Depend on filesystem routes.

---

## 16. Cart & Checkout Isolation Refactor

### Objective
Decouple cart state from auth state and remove frontend-owned pricing logic.

### 16.1 Current Problems
- Auth directly calls cart logic.
- Cart recalculates totals locally.
- Guest merge causes N+1 requests.
- Pricing rules duplicated.
- Shipping assumptions duplicated.

### 16.2 Required Refactor
Cart **MUST** become **Backend-authoritative**.

Frontend **MUST**:
- display totals
- display line items
- display calculated discounts

Frontend **MUST NOT**:
- calculate taxes
- calculate discounts
- calculate shipping
- calculate totals

### 16.3 Required Event System
Instead of Auth → Cart coupling, use: **Auth Event → Cart Subscriber**.

### 16.4 Required Event Layer
`core/events/`

#### Example Events
- `AUTH_LOGGED_IN`
- `AUTH_LOGGED_OUT`
- `TENANT_CHANGED`
- `LOCALE_CHANGED`

---

## 17. Monitoring & Observability

### Objective
Prevent silent runtime failures in production.

### 17.1 Required Monitoring Areas
**MUST** monitor:
- Route resolver failures
- Section rendering failures
- Missing registry components
- Tenant lookup failures
- Hydration mismatches
- SSR timing
- API latency
- Preview mode failures
- Theme injection failures

### 17.2 Required Logging Structure
Every runtime log **MUST** include:
- `tenant_id`
- locale
- path
- runtime version
- section id
- request id

### 17.3 Required Error Telemetry
**MUST** integrate:
- frontend runtime errors
- SSR runtime errors
- Nitro errors
- API orchestration errors

---

## 18. Final Migration Rules

### CRITICAL RULES
**DO NOT**:
- Rewrite everything at once.
- Replace all routes immediately.
- Remove legacy pages early.
- Migrate checkout first.
- Migrate auth first.
- Mix old and new SEO ownership.
- Allow raw backend payloads into components.

**MUST**:
- Keep dual runtime active.
- Migrate incrementally.
- Maintain SSR parity.
- Maintain SEO parity.
- Maintain route stability.
- Maintain tenant isolation.
- Maintain cache isolation.
- Add observability before rollout.

---

## 19. Final Recommended Execution Order

### Stage 1 — Infrastructure
1. Tenant middleware
2. Tenant-aware cache keys
3. API header injection
4. Error normalization
5. Runtime logging

### Stage 2 — Runtime Foundation
1. Route resolver
2. Catch-all route
3. Storefront payload loader
4. SEO runtime engine
5. Layout manager

### Stage 3 — Rendering Engine
1. Section registry
2. Section renderer
3. Presentational refactor
4. Lazy hydration
5. Error boundaries

### Stage 4 — Theme Runtime
1. Theme tokens
2. SSR style injection
3. Merchant overrides
4. Theme inheritance
5. Preview switching

### Stage 5 — Domain Migration
1. Marketing pages
2. Homepage
3. Collections
4. Categories
5. Product pages
6. Navigation

### Stage 6 — High-Risk Domains
1. Cart
2. Checkout
3. Customer account
4. Authentication

---

## 20. Final Architectural Outcome

After the migration:

**Nuxt becomes**:
- a runtime orchestrator
- a rendering engine
- a tenant-aware SSR platform
- a schema-driven storefront runtime

**Laravel becomes**:
- the CMS authority
- the route authority
- the content authority
- the business logic authority
- the tenancy authority

**Themes become**:
- fully presentational
- runtime swappable
- merchant configurable
- isolated from business logic

**Components become**:
- reusable
- schema-driven
- data-agnostic
- tenant-safe
- SSR-safe
