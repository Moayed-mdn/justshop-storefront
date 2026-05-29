# JustShop Storefront Commerce Consolidation Program

## Executive Architecture & Phase Plan (Part 1)

---

### 1. Program Name

**JustShop Storefront Commerce Consolidation Program**

This program follows the previously completed:

**«Storefront Runtime Integration Program»**

The runtime program established:

- multi-tenant runtime rendering,
- SSR storefront infrastructure,
- runtime contracts,
- DTO-driven sections,
- tenant-safe cache isolation,
- and Laravel-driven page resolution.

This consolidation program transforms that runtime foundation into a coherent commerce storefront experience.

---

### 2. Program Goal

Transform the storefront from:

**«a hybrid runtime + legacy commerce application»**

into:

**«a unified, SSR-aware, tenant-safe commerce storefront platform.»**

The goal is **NOT**:

- Shopify feature parity,
- checkout replatforming,
- or a full commerce rewrite.

The goal **IS**:

- storefront continuity,
- commerce cohesion,
- canonical routing,
- unified shell behavior,
- SSR-aware customer state,
- and runtime-native commerce integration.

---

### 3. Current State Summary

The storefront currently operates as two partially connected systems.

**Runtime system** owns:

- catalog rendering,
- category pages,
- product pages,
- marketing pages,
- navigation payloads,
- theme payloads,
- runtime SSR rendering.

**Legacy commerce system** owns:

- authentication,
- cart,
- orders,
- profile,
- search,
- checkout outcomes,
- customer session behavior.

These systems currently:

- use different shells,
- use different routing assumptions,
- use different state ownership boundaries,
- and expose inconsistent customer experiences.

The storefront therefore behaves like:

- a completed runtime infrastructure layer,
- but an incomplete commerce application layer.

---

### 4. Desired End State

After this program:

The storefront must behave as **ONE application**.

Users must not perceive:

- runtime pages,
- legacy pages,
- or shell transitions.

The storefront must provide:

**Unified application shell**

- one header system,
- one footer system,
- one navigation model,
- one locale experience,
- one customer identity experience,
- one cart visibility model.

**Canonical storefront routing**

- one product URL structure,
- one shop URL structure,
- one navigation contract,
- one route ownership model.

**Runtime-aware commerce**

- runtime pages understand auth state,
- runtime pages understand cart state,
- runtime shell exposes commerce capabilities,
- runtime rendering becomes the real storefront foundation.

**SSR-aware customer experience**

- SSR-safe auth hydration,
- SSR-safe cart awareness,
- SSR-safe shell rendering,
- minimized hydration flashes.

**Tenant-safe client persistence**

- tenant-scoped auth persistence,
- tenant-scoped cart persistence,
- tenant-scoped locale persistence,
- tenant-safe commerce continuity.

**Unified storefront architecture**

- normalized API layers,
- normalized DTO contracts,
- normalized runtime/commerce boundaries,
- reduced legacy compatibility drift.

---

### 5. Explicit Non-Goals

The following are **OUTSIDE** this program.

**Not included**

- Checkout replatforming (remains legacy-owned unless explicitly approved later)
- Full auth rewrite (existing flows should be consolidated, not rewritten from scratch)
- Marketplace ecosystem (no plugin/app ecosystem work)
- Theme editor (no visual merchant theme builder)
- Subscription commerce
- Advanced personalization
- Headless mobile app platform
- Full GraphQL migration
- Full frontend rewrite (forbidden)

---

### 6. Architectural Principles

**Principle 1 — Runtime becomes the storefront foundation**

The runtime is no longer “catalog-only infrastructure.” It becomes:

- the canonical storefront rendering layer,
- and the canonical storefront shell owner.

**Principle 2 — Commerce capabilities integrate INTO runtime**

Auth/cart/search/profile/order awareness must integrate into:

- runtime shell,
- runtime navigation,
- runtime rendering contracts.

The runtime must not remain commerce-blind.

**Principle 3 — One canonical route system**

The storefront may not expose:

- multiple product route patterns,
- multiple shop route assumptions,
- or multiple navigation truths.

All route generation must derive from:

- one canonical storefront route contract.

**Principle 4 — One shell system**

There must not be:

- runtime shell,
- auth shell,
- legacy shell,
- standalone shell families.

The storefront shell becomes:

- composable,
- runtime-aware,
- auth-aware,
- cart-aware,
- locale-aware,
- tenant-aware.

**Principle 5 — SSR-first storefront behavior**

Critical storefront UX must not depend on:

- client-only hydration,
- localStorage bootstrap,
- or post-mount identity fetches.

SSR ownership must expand to:

- customer shell state,
- cart visibility,
- navigation continuity,
- runtime commerce awareness.

**Principle 6 — Tenant safety everywhere**

Every persistence layer must become tenant-aware. Includes:

- cookies,
- localStorage,
- cache keys,
- auth persistence,
- cart persistence,
- locale persistence.

**Principle 7 — Consolidation before expansion**

The platform must consolidate routing, shell behavior, state ownership, and API boundaries **BEFORE** adding new commerce features, personalization, subscriptions, advanced search, or AI commerce layers.

---

### 7. Major Program Streams

| Stream | Goal |
|--------|------|
| A | Route Consolidation |
| B | Unified Storefront Shell |
| C | Auth & Session Consolidation |
| D | Cart Consolidation |
| E | Search Consolidation |
| F | Runtime Commerce Parity |
| G | API & State Normalization |
| H | Legacy Surface Retirement |

---

### 8. Phase Structure

| Phase | Goal |
|-------|------|
| 0 | Program Guardrails & Canonical Contracts |
| 1 | Route Consolidation |
| 2 | Unified Shell Architecture |
| 3 | Auth & Session SSR Consolidation |
| 4 | Cart Consolidation |
| 5 | Search Consolidation |
| 6 | Runtime Commerce Capability Parity |
| 7 | API / State Normalization |
| 8 | Legacy Surface Retirement |
| 9 | Certification & Production Readiness |

---

### 9. Phase 0 — Program Guardrails & Canonical Contracts

**Goal**

Prevent further architectural drift before consolidation begins. This phase freezes route ownership, shell ownership, runtime ownership, state ownership, and storefront contracts. No new storefront features may be added before Phase 0 closes.

**Required Deliverables**

**9.1 Canonical Route Contract** – Create authoritative storefront route definitions. Must define: home, shop, category, product, cart, login, email verification, profile, orders, search, checkout return flows. All route builders must consume one shared contract source. Hardcoded storefront URLs become forbidden.

**9.2 Storefront Shell Ownership Document** – Define shell composition rules, layout ownership, header/footer ownership, runtime shell boundaries, auth/cart/search injection boundaries. Must explicitly declare which shell survives long-term and which become deprecated.

**9.3 Storefront State Ownership Matrix** – Document ownership for auth, user, cart, locale, tenant, theme, navigation, filters, search state. Every state domain must have one owner, one persistence strategy, one SSR strategy.

**9.4 Tenant Persistence Specification** – Define tenant-safe cookie naming, tenant-safe localStorage naming, tenant-safe cache namespacing. Global persistence keys become forbidden.

**9.5 Runtime Commerce Integration Specification** – Define how runtime pages consume auth state, cart state, locale state, search entry points, customer shell state. Runtime pages must stop being commerce-blind.

**Exit Criteria**

Phase 0 closes only when canonical route contracts exist, shell ownership is frozen, state ownership is frozen, persistence standards are frozen, runtime commerce integration contracts are frozen. No implementation migrations yet. This phase is architecture stabilization only.

---

### 10. Phase 1 — Route Consolidation

**Goal**

Eliminate competing storefront route systems. The storefront must expose one canonical URL model, one navigation truth, one route-generation mechanism.

**Current Problems Being Solved**

Current storefront problems include: "/products", "/shop", "/products/:slug", "/products/product/:slug" coexisting simultaneously. Search, cart, breadcrumbs, runtime rendering, and navigation currently disagree on route ownership.

**Required Deliverables**

**10.1 Canonical Route Model Implementation** – Implement authoritative route generators for storefront home, shop, category, product, cart, login/register/email verification, profile, orders, search, checkout returns. All storefront links must consume canonical route builders only.

**10.2 Runtime Route Alignment** – Align runtime backend route resolution, frontend route helpers, search result links, cart item links, breadcrumb links, navigation links. No stale route shapes may remain.

**10.3 Legacy Route Compatibility Layer** – Temporary compatibility redirects may exist only during migration, must be explicitly documented, include sunset dates, and decommission ownership.

**10.4 Navigation Normalization** – Unify runtime navigation, legacy header navigation, breadcrumbs, mobile navigation assumptions. Navigation must derive from one route contract system.

**Forbidden During Phase 1**

- No checkout migration
- No auth rewrite
- No new marketing features
- No new runtime section types

Focus only: routing, navigation, canonical URL ownership.

**Exit Criteria**

Phase 1 closes only when stale product route patterns are removed, runtime and legacy navigation agree, search/cart/orders link correctly, breadcrumbs are canonical, one storefront route system exists.

---

### 11. Phase 2 — Unified Storefront Shell Architecture

**Goal**

Eliminate storefront shell fragmentation. The storefront must stop behaving like multiple independent applications.

**Current Problems Being Solved**

Current storefront shell fragmentation includes runtime shell, legacy shell, auth shell, standalone shell pages with different headers, footers, navigation systems, and customer affordances.

**Required Deliverables**

**11.1 Unified Header System** – Create one storefront header architecture supporting runtime navigation, customer auth state, cart visibility, search entry, locale switching, tenant branding, mobile navigation, responsive layouts. Runtime pages and legacy commerce pages must use the same header system.

**11.2 Unified Footer System** – Create one storefront footer architecture supporting runtime navigation payloads, tenant branding, storefront informational links, locale awareness.

**11.3 Unified Layout Composition** – Replace competing layout families with one composable storefront shell system. Layouts may vary visually, but shell ownership must remain unified.

**11.4 Runtime Shell Commerce Awareness** – Runtime shell must consume auth state, cart state, customer visibility, locale visibility, search visibility. The runtime shell may no longer behave as a content-only renderer.

**11.5 Mobile Navigation Consolidation** – Unify runtime mobile navigation, legacy mobile navigation, account entry points, cart entry points, search entry points.

**Exit Criteria**

Phase 2 closes only when shell transitions disappear, runtime and legacy pages share one shell family, auth/cart/search visibility is consistent, mobile navigation is unified, storefront continuity exists across page families.

---

# JustShop Storefront Commerce Consolidation Program

## Execution Plan (Part 2)

---

### 12. Phase 3 — Auth & Session SSR Consolidation

**Goal**

Transform authentication and customer identity from partially client-hydrated legacy behavior into SSR-aware storefront identity infrastructure. This phase does **not** replace authentication. It consolidates auth ownership, session hydration, customer visibility, and storefront identity continuity.

**Current Problems Being Solved**

Current auth problems include: runtime pages are auth-blind, public pages SSR without customer identity, identity appears after hydration, duplicate user-fetch paths exist, auth shell is detached from storefront shell, Google auth is partially isolated, password reset flow is incomplete, cart/auth coupling is fragile, token persistence is not tenant-aware.

**Required Deliverables**

**12.1 Canonical Auth Bootstrap Flow** – Create one authoritative storefront auth bootstrap lifecycle. The storefront may not fetch user state from multiple unrelated locations, bootstrap auth differently per page family, or rely on scattered middleware logic.

**12.2 SSR-Aware Customer Hydration** – Customer identity must become SSR-aware. SSR storefront rendering must reliably know whether the customer is authenticated, basic customer shell state, customer navigation visibility, account/cart visibility. This does not require full customer profile SSR hydration, but does require shell-level customer continuity during SSR.

**12.3 Runtime Shell Auth Integration** – Runtime shell must expose authenticated navigation, account entry points, login/register visibility, customer state visibility. Runtime pages may no longer appear anonymous while the customer is authenticated elsewhere.

**12.4 Tenant-Scoped Auth Persistence** – Replace global auth persistence assumptions. Auth persistence must become tenant-safe, including cookie naming, persistence ownership, auth restoration logic, logout behavior. Cross-tenant auth leakage risks must be eliminated.

**12.5 Password Recovery Completion** – Complete missing storefront auth recovery flows including forgot-password page, reset-password page, consistent redirect behavior, storefront shell integration.

**12.6 Email Verification Completion** – Normalize verification route ownership, token validation handling, redirect behavior, logged-in continuity, and storefront shell integration for account verification flows.

**12.7 Google/Social Auth Consolidation** – Normalize redirect flow ownership, callback handling, auth bootstrap behavior, post-login customer continuity. Social auth must behave like the normal storefront auth lifecycle, not a parallel implementation path.

**12.8 Auth Middleware Normalization** – Normalize guest middleware, auth middleware, redirect behavior, runtime page auth awareness.

**Forbidden During Phase 3**

- No auth provider replacement
- No backend auth rewrite
- No checkout auth redesign
- No OAuth provider expansion

Focus only: storefront auth continuity, SSR identity, runtime awareness, tenant-safe persistence.

**Exit Criteria**

Phase 3 closes only when runtime shell understands customer identity, auth hydration flashes are minimized, storefront identity is SSR-aware, auth persistence is tenant-safe, password recovery exists, email verification is normalized, social auth is normalized, duplicate auth bootstrap paths are removed.

---

### 13. Phase 4 — Cart Consolidation

**Goal**

Transform the cart from partially client-only legacy behavior into a storefront-wide commerce state system. The cart must become shell-aware, runtime-aware, tenant-safe, SSR-compatible where appropriate, and globally reliable.

**Current Problems Being Solved**

Current cart problems include: runtime shell has no cart visibility, runtime product detail lacks commerce behavior, guest cart is global across tenants, cart hydration is client-only, cart page is hydration-gated, cart merge behavior is fragile, guest/server cart models diverge, no storefront-wide cart continuity exists.

**Required Deliverables**

**13.1 Canonical Cart Ownership Model** – Define authoritative cart source of truth, guest cart ownership, authenticated cart ownership, cart persistence boundaries, cart synchronization lifecycle. Cart ownership may not remain implicit.

**13.2 Runtime Cart Awareness** – Runtime shell must expose cart badge, cart entry point, cart visibility, cart continuity. Runtime pages must stop behaving like commerce-disconnected content pages.

**13.3 Runtime Product Commerce Integration** – Runtime product rendering must support add-to-cart behavior, cart feedback, product purchase continuity, commerce-aware product interactions. The storefront may not expose runtime product pages without commerce capability.

**13.4 Tenant-Scoped Cart Persistence** – Replace global guest cart persistence. Guest cart storage must become tenant-aware, including localStorage keys, merge behavior, cart restoration logic, logout behavior.

**13.5 SSR-Compatible Cart Visibility** – The storefront shell must support SSR-aware cart visibility. This does not require full guest cart SSR rendering, but does require stable shell-level cart continuity.

**13.6 Cart Merge Hardening** – Normalize guest-to-authenticated merge, partial failure handling, retry behavior, stale item handling, inventory mismatch handling. Silent merge failure patterns become forbidden.

**13.7 Cart UI Consolidation** – Normalize cart badge, cart interactions, cart loading states, empty cart states, cart feedback UX.

**Forbidden During Phase 4**

- No checkout rewrite
- No order pipeline redesign
- No inventory engine redesign
- No multi-cart experimentation

Focus only: storefront cart continuity, runtime integration, persistence safety, commerce UX cohesion.

**Exit Criteria**

Phase 4 closes only when runtime pages expose cart continuity, runtime products support commerce actions, cart persistence is tenant-safe, shell cart behavior is unified, cart hydration instability is minimized, guest merge reliability is hardened.

---

### 14. Phase 5 — Search Consolidation

**Goal**

Integrate search into the storefront runtime architecture. Search must stop behaving like an isolated client-only legacy subsystem.

**Current Problems Being Solved**

Current search problems include: runtime shell has no search, search is client-only, GraphQL bypasses runtime infrastructure, search links use stale routes, no SSR search ownership exists, no canonical search contract exists, autocomplete is isolated from storefront state.

**Required Deliverables**

**14.1 Canonical Search Route Ownership** – Define storefront search route ownership, search URL contracts, search query normalization, canonical search parameter handling.

**14.2 Unified Search Entry System** – Search entry points must become unified across runtime pages, legacy pages, desktop navigation, mobile navigation.

**14.3 Runtime Search Integration** – Runtime shell must expose search access, search continuity, runtime-aware navigation behavior.

**14.4 Search Route Canonicalization** – All search results must link to canonical storefront product routes. Stale route shapes become forbidden.

**14.5 SSR-Aware Search Rendering** – Search pages must support SSR-compatible rendering behavior. This does not require fully server-rendered instant search, but does require SEO-compatible search page ownership, predictable rendering lifecycle, reduced client-only dependence.

**14.6 Search Client Normalization** – Normalize GraphQL ownership, fetch ownership, tenant propagation, auth propagation, error handling, caching behavior.

**14.7 Search UX Consolidation** – Normalize autocomplete behavior, mobile search, loading states, empty states, search transitions, storefront continuity.

**Forbidden During Phase 5**

- No Elasticsearch migration
- No Algolia migration
- No AI search
- No recommendation engine
- No semantic/vector search

Focus only: storefront integration, routing correctness, SSR compatibility, runtime continuity.

**Exit Criteria**

Phase 5 closes only when runtime shell exposes search, search routes are canonical, stale search product links are removed, search rendering is SSR-compatible, search behaves consistently across storefront surfaces.

---

### 15. Phase 6 — Runtime Commerce Capability Parity

**Goal**

Expand runtime rendering from content/catalog rendering into commerce-capable storefront rendering. This phase upgrades runtime pages from presentation-only to storefront-capable commerce surfaces.

**Current Problems Being Solved**

Current runtime gaps include: product detail is commerce-light, abandoned richer product components exist outside runtime, runtime rendering does not own enough commerce capability, runtime shell lacks storefront parity, legacy commerce components remain partially stranded.

**Required Deliverables**

**15.1 Runtime Product Detail Consolidation** – Create canonical runtime product rendering behavior. Runtime product pages must support commerce interactions, pricing continuity, inventory visibility, cart integration, customer continuity.

**15.2 Runtime Commerce Section Expansion** – Normalize runtime section capability for richer product rendering, richer category rendering, merchandising continuity, storefront commerce interactions.

**15.3 Legacy Commerce Component Integration Audit** – Audit and consolidate reusable commerce components, abandoned runtime-compatible components, duplicate product rendering systems. The storefront may not maintain parallel product-detail architectures long-term.

**15.4 Runtime Shell Capability Expansion** – Runtime shell must become capable of acting as the primary storefront shell, not merely a runtime content wrapper.

**15.5 Commerce UX Consistency Pass** – Normalize loading states, empty states, product interactions, navigation transitions, runtime rendering continuity, mobile runtime behavior.

**Forbidden During Phase 6**

- No checkout migration
- No subscription commerce
- No personalization engine
- No recommendation engine
- No merchant visual editor

Focus only: runtime storefront maturity, commerce parity, storefront continuity.

**Exit Criteria**

Phase 6 closes only when runtime product pages are commerce-capable, abandoned product architectures are consolidated, runtime rendering behaves like a real storefront layer, runtime shell achieves storefront parity.

---

### 16. Phase 7 — API & State Normalization

**Goal**

Normalize fragmented storefront integration layers. The storefront must stop operating through partially disconnected API systems, duplicated state ownership, and fragmented client models.

**Current Problems Being Solved**

Current fragmentation includes: REST proxy, runtime proxy, Apollo GraphQL, browser redirect auth, duplicated user bootstrap, duplicated route assumptions, mixed DTO standards, mixed fetch ownership.

**Required Deliverables**

**16.1 Storefront API Ownership Matrix** – Define authoritative ownership for runtime APIs, commerce APIs, GraphQL APIs, auth APIs, cart APIs, search APIs.

**16.2 Unified Storefront Fetch Standards** – Normalize error handling, auth injection, tenant propagation, locale propagation, DTO transformation, retry behavior, SSR behavior.

**16.3 DTO Contract Consolidation** – Normalize storefront DTO standards. The storefront may not maintain drifting response contracts, mixed route assumptions, or inconsistent transformation logic.

**16.4 State Ownership Consolidation** – Reduce overlapping ownership, duplicated hydration logic, disconnected shell/runtime state. Every storefront state domain must have one owner, one lifecycle, one persistence boundary.

**16.5 Runtime Waterfall Reduction** – Reduce unnecessary runtime fetches, repeated navigation payload requests, duplicated shell fetch behavior. Promote app-shell-aware storefront state.

**16.6 Error Handling Normalization** – Normalize storefront errors, auth errors, cart errors, search errors, runtime fetch failures, runtime fallback behavior.

**Forbidden During Phase 7**

- No backend service decomposition
- No microservice migration
- No frontend framework migration
- No GraphQL-first rewrite

Focus only: storefront consistency, ownership clarity, normalization, stability.

**Exit Criteria**

Phase 7 closes only when storefront API ownership is clear, DTO drift is reduced, duplicated state ownership is removed, storefront fetch behavior is normalized, runtime waterfalls are reduced.

---

# JustShop Storefront Commerce Consolidation Program

## Execution Plan (Part 3)

---

### 17. Phase 8 — Tenant Isolation Hardening

**Goal**

Eliminate cross-tenant storefront leakage risks. The storefront must evolve from backend-safe but frontend-optimistic tenancy into end-to-end tenant-safe storefront behavior. This phase hardens persistence, identity, cart state, routing assumptions, runtime awareness, and storefront isolation boundaries.

**Current Problems Being Solved**

Current tenant risks include: global guest cart persistence, global auth persistence, locale preference leakage, optimistic tenant bootstrap behavior, runtime shell assuming active tenant before backend validation, Apollo requests missing explicit storefront tenant propagation, shell continuity crossing tenant boundaries.

**Required Deliverables**

**17.1 Tenant-Scoped Client Persistence** – All storefront persistence must become tenant-aware, including auth persistence, guest cart persistence, storefront preferences, locale persistence where appropriate, client-side commerce continuity. Global browser persistence assumptions become forbidden.

**17.2 Tenant Validation Hardening** – Frontend tenant bootstrap must become authoritative-aware. The storefront may not confidently initialize tenant shell state before backend runtime validation confirms tenant validity.

**17.3 Tenant-Aware Runtime Recovery** – Normalize invalid host handling, invalid tenant handling, missing tenant handling, suspended tenant behavior, unpublished storefront behavior, tenant recovery UX.

**17.4 Tenant-Aware Search Isolation** – Search requests must become explicitly tenant-aware. Search isolation may not depend solely on deployment topology, implicit backend assumptions, or host-level coincidence.

**17.5 Tenant-Safe Auth Behavior** – Normalize login continuity, logout behavior, token restoration, customer state ownership, cross-tenant session handling.

**17.6 Tenant-Safe Cart Ownership** – Normalize guest cart boundaries, authenticated cart continuity, cart merge ownership, cart restoration behavior across storefronts.

**17.7 Tenant Isolation Verification Suite** – Expand storefront verification coverage for auth isolation, cart isolation, locale isolation, runtime isolation, persistence isolation, invalid host handling, invalid tenant recovery.

**Forbidden During Phase 8**

- No multi-store customer federation
- No shared-cart commerce experiments
- No tenant marketplace layer
- No cross-store customer identity unification

Focus only: storefront isolation correctness, tenant-safe persistence, isolation reliability.

**Exit Criteria**

Phase 8 closes only when storefront persistence is tenant-aware, optimistic tenant leakage is removed, search explicitly propagates tenant identity, auth/cart continuity is tenant-safe, tenant isolation verification coverage exists.

---

### 18. Phase 9 — SSR & Hydration Stabilization

**Goal**

Stabilize storefront rendering behavior across SSR, hydration, runtime rendering, legacy commerce rendering, and shell continuity. This phase reduces hydration flashes, shell instability, rendering inconsistencies, and client-only storefront dependence.

**Current Problems Being Solved**

Current SSR/hydration problems include: auth flashes after hydration, cart badge hydration-only rendering, client-only search results, cart hydration gating, duplicate auth fetches, runtime shell swaps, theme overrides after hydration, runtime vs legacy rendering inconsistencies.

**Required Deliverables**

**18.1 Storefront SSR Ownership Matrix** – Define authoritative SSR ownership for auth state, cart shell state, runtime rendering, search rendering, navigation rendering, storefront shell state.

**18.2 Hydration Flash Reduction** – Minimize identity flashes, cart flashes, theme flashes, shell swaps, late storefront state replacement.

**18.3 Runtime & Legacy Shell Transition Stabilization** – Normalize transitions between runtime pages, legacy commerce pages, auth pages, standalone flows. The storefront must stop feeling like multiple unrelated applications stitched together.

**18.4 Cart Rendering Stabilization** – Reduce client-only cart gating, hydration skeleton replacement behavior, unstable cart rendering ownership.

**18.5 Search Rendering Stabilization** – Reduce fully client-only search rendering, autocomplete instability, mount-only rendering dependence.

**18.6 Duplicate Fetch Elimination** – Reduce repeated auth fetches, repeated navigation fetches, duplicated shell bootstrapping, duplicated storefront initialization behavior.

**18.7 Head & Theme Stabilization** – Normalize theme ownership, runtime theme injection, meta handling, storefront head management.

**Forbidden During Phase 9**

- No partial hydration experiments
- No islands architecture migration
- No streaming SSR redesign
- No frontend rendering framework replacement

Focus only: storefront rendering stability, SSR continuity, hydration reliability.

**Exit Criteria**

Phase 9 closes only when storefront hydration flashes are minimized, shell transitions feel unified, duplicate initialization behavior is reduced, storefront SSR ownership is stable.

---

### 19. Phase 10 — Performance & Runtime Optimization

**Goal**

Optimize storefront runtime behavior after architectural consolidation is complete. This phase is intentionally late. Performance optimization before consolidation would optimize duplicated systems, fragmented fetches, and unstable ownership.

**Current Problems Being Solved**

Current performance issues include: runtime request waterfalls, repeated navigation loading, duplicated shell rendering, client-heavy commerce flows, excessive hydration work, repeated storefront bootstrap behavior, sequential guest cart merging, no autocomplete caching.

**Required Deliverables**

**19.1 Runtime Waterfall Reduction** – Reduce runtime resolve/page/navigation/theme waterfalls, duplicated storefront shell fetches, repeated runtime context loading.

**19.2 App Shell State Promotion** – Promote stable storefront shell data into reusable app-level state ownership, including navigation, tenant shell context, theme continuity, storefront metadata where appropriate.

**19.3 Client Fetch Reduction** – Reduce unnecessary post-mount fetches, duplicated bootstrap calls, repeated storefront initialization behavior.

**19.4 Search Optimization** – Improve autocomplete efficiency, repeated query handling, search transition performance, storefront search responsiveness.

**19.5 Cart Operation Optimization** – Improve guest merge efficiency, cart synchronization performance, cart restoration behavior, redundant cart refreshes.

**19.6 Runtime Rendering Efficiency** – Reduce duplicated layout wrappers, redundant shell rendering, unnecessary runtime rendering overhead.

**19.7 Logging & Debug Noise Reduction** – Normalize storefront logging verbosity, development runtime diagnostics, request spam, production-safe observability behavior.

**Forbidden During Phase 10**

- No premature micro-optimizations
- No CDN architecture redesign
- No backend infrastructure migration
- No speculative caching systems

Focus only: storefront runtime efficiency, rendering performance, runtime stability.

**Exit Criteria**

Phase 10 closes only when runtime waterfalls are reduced, storefront shell fetch duplication is minimized, client-heavy rendering paths are reduced, storefront runtime behavior is measurably more efficient.

---

### 20. Phase 11 — Legacy Surface Retirement

**Goal**

Retire transitional storefront architecture safely. This phase removes migration remnants, dead compatibility layers, abandoned runtime experiments, stale routing assumptions, duplicated storefront systems. This phase only begins after runtime storefront capability is stable.

**Current Problems Being Solved**

Current debt includes: duplicate layouts, stale route constants, abandoned product-detail implementations, unused composables, legacy compatibility redirects, fragmented shell systems, dead runtime migration remnants.

**Required Deliverables**

**20.1 Legacy Route Retirement Audit** – Retire stale route patterns, transitional redirects, obsolete storefront path assumptions. The storefront must end with one canonical route system.

**20.2 Shell System Consolidation** – Reduce storefront shell ownership to one primary storefront shell architecture. Retire redundant wrappers, transitional shell duplication, abandoned auth shell behavior.

**20.3 Product Architecture Cleanup** – Retire abandoned product rendering systems, duplicate product detail implementations, orphaned catalog rendering remnants.

**20.4 Unused API Surface Retirement** – Audit and retire unused Nitro routes, dead compatibility endpoints, obsolete migration proxies.

**20.5 State & Composable Cleanup** – Remove dead composables, duplicated ownership patterns, obsolete storefront migration utilities.

**20.6 Runtime Registry Cleanup** – Normalize runtime section registration, section ownership, storefront rendering registry clarity.

**20.7 Documentation & Architecture Refresh** – Update storefront architecture documentation, runtime ownership documentation, commerce ownership boundaries, SSR ownership rules, routing contracts.

**Forbidden During Phase 11**

- No large behavioral rewrites
- No opportunistic feature additions
- No unstable cleanup without verification
- No deletion without ownership confirmation

Focus only: safe retirement, consolidation, architectural clarity.

**Exit Criteria**

Phase 11 closes only when one canonical route system exists, storefront shell duplication is reduced, abandoned runtime remnants are removed, obsolete compatibility layers are retired, storefront ownership is clearer and simpler.

---

### 21. Phase 12 — Storefront Certification & Rollout

**Goal**

Certify the storefront as a cohesive commerce platform, not a transitional hybrid runtime migration. This phase validates stability, tenant isolation, storefront continuity, commerce flows, SSR behavior, and rollout readiness.

**Required Deliverables**

**21.1 Storefront Commerce Verification Suite** – Expand verification coverage for auth, cart, search, routing, runtime rendering, shell continuity, tenant isolation, hydration stability, mobile continuity, and SEO-safe route migration.

**21.2 End-to-End Storefront Flow Validation** – Validate browse-to-cart, login continuity, guest-to-authenticated transitions, search-to-product flow, runtime-to-commerce flow continuity, locale continuity, shell continuity, password reset continuity, email verification continuity, and checkout handoff continuity.

**21.3 Tenant Isolation Certification** – Verify persistence isolation, auth isolation, cart isolation, runtime cache isolation, search isolation.

**21.4 SSR & Hydration Certification** – Verify shell continuity, hydration stability, rendering ownership, storefront SSR consistency.

**21.5 Rollout Controls** – Provide rollout gates, feature controls, kill switches, rollback capability, storefront fallback strategies, production smoke checks, and staged tenant cohorts.

**21.6 Operational Readiness** – Prepare storefront monitoring, runtime diagnostics, error visibility, storefront observability, regression packs, support handover, and hypercare ownership.

**21.7 Final Architectural Audit** – Perform ownership verification, route verification, storefront shell verification, API ownership verification, commerce continuity verification.

**Exit Criteria**

The consolidation program completes only when:

- storefront routing is unified,
- storefront shell continuity is unified,
- runtime rendering is commerce-capable,
- auth/cart/search behave consistently,
- storefront persistence is tenant-safe,
- runtime and legacy fragmentation are reduced,
- storefront SSR behavior is stable,
- storefront UX feels cohesive,
- and the storefront behaves like **one commerce platform**, not multiple stitched systems.

---

### 22. Final Program Outcome

**What This Program Produces**

After all phases complete, JustShop storefront becomes: a unified multi-tenant commerce storefront, runtime-driven, SSR-capable, commerce-aware, tenant-safe, and operationally cohesive.

**What Will Exist After Completion**

The storefront will have:

- **Unified storefront shell** – including auth visibility, cart visibility, search, locale switching, runtime continuity, stable navigation.
- **Unified routing system** – including canonical product routes, canonical shop routes, canonical search routes, runtime-owned storefront navigation.
- **Runtime commerce capability** – including runtime-aware product detail, runtime-aware commerce interactions, cart continuity, storefront parity.
- **SSR-aware storefront identity** – including customer continuity, stable auth hydration, stable cart visibility, reduced client-only dependence.
- **Tenant-safe storefront persistence** – including auth isolation, cart isolation, storefront continuity isolation, tenant-aware browser persistence.
- **Consolidated storefront architecture** – including reduced duplication, normalized API ownership, reduced migration remnants, reduced shell fragmentation.

---

### 23. What This Program Does NOT Yet Produce

Even after full completion, this is still **NOT** yet:

- full Shopify parity,
- full headless commerce operating system,
- visual merchant site builder,
- live merchant theme editor,
- advanced CMS experience builder,
- app ecosystem,
- plugin marketplace,
- subscription commerce engine,
- AI personalization platform,
- advanced merchandising engine,
- omnichannel commerce suite.

---

### 24. What Comes AFTER This Program

After consolidation completes successfully, the platform becomes ready for future programs like:

- **Merchant Theme Studio** – Visual merchant theming and live editing.
- **Runtime Checkout Migration** – Moving checkout into the unified runtime architecture.
- **Runtime Customer Account Area** – Orders/profile/wishlist inside runtime rendering.
- **Runtime Search Platform** – Advanced search architecture.
- **Merchant CMS Experience Builder** – Composable merchant-managed landing experiences.
- **Marketplace Extensions** – Plugin/app ecosystem.
- **Advanced Commerce Features** – Subscriptions, bundles, personalization, recommendations, loyalty systems.

---

### 25. Final Reality Statement

This program is not "building Shopify."

This program is transforming the current hybrid storefront into a stable, unified commerce platform foundation.

Right now, the storefront is runtime-rendered in some areas, legacy-driven in others, and fragmented at the shell, routing, state, and commerce layers.

After this program, the storefront becomes operationally cohesive, technically unified, commerce-capable, tenant-safe, and ready for future platform evolution.

That foundation is what makes future Shopify-level platform capabilities realistically possible.


# JustShop Storefront Commerce Consolidation Program
## Part 4 — Tactical Execution & Delivery Strategy

---

# 26. Recommended Real Execution Order

The strategic phases describe architectural goals.

This section defines:
- actual implementation order,
- dependency sequencing,
- risk-aware delivery strategy,
- and safe migration choreography.

The storefront is already live as a hybrid system.

That means:
- wrong sequencing can destabilize the runtime,
- break SSR,
- fragment routing further,
- or create irreversible state drift.

This execution order is optimized for:
- storefront continuity,
- migration safety,
- and progressive stabilization.

---

# 27. Recommended Program Order

## Stage A — Route & Shell Stabilization First

Do FIRST:

1. Routing consolidation
2. Canonical route contracts
3. Runtime shell consolidation
4. Navigation normalization
5. Header/footer unification

Why:

Everything else depends on:
- stable storefront ownership,
- stable shell continuity,
- and canonical navigation.

If auth/cart/search are integrated BEFORE shell stabilization:
- duplication spreads deeper,
- runtime and legacy divergence worsens,
- and later cleanup becomes dangerous.

---

## Stage B — Auth & Cart Foundation

Do SECOND:

1. Auth SSR consolidation
2. Runtime auth awareness
3. Tenant-safe auth persistence
4. Cart consolidation
5. Runtime cart awareness
6. Product commerce parity

Why:

Commerce continuity depends on:
- customer continuity,
- shell continuity,
- and shared storefront state.

Cart should NOT be deeply refactored before:
- shell ownership becomes stable.

---

## Stage C — Search Integration

Do THIRD:

1. Search route normalization
2. Runtime shell search integration
3. Canonical product link migration
4. Search SSR stabilization
5. Search API normalization

Why:

Search touches:
- routing,
- navigation,
- product contracts,
- runtime awareness.

If search is migrated before routing consolidation:
- stale route patterns spread further.

---

## Stage D — Runtime Commerce Expansion

Do FOURTH:

1. Runtime product detail parity
2. Commerce-capable runtime rendering
3. Runtime section expansion
4. Legacy product architecture retirement

Why:

Runtime commerce parity should happen AFTER:
- routing,
- shell,
- auth,
- cart,
- and search foundations stabilize.

Otherwise:
- runtime product architecture must be rewritten twice.

---

## Stage E — Platform Hardening

Do FIFTH:

1. Tenant isolation hardening
2. SSR stabilization
3. Runtime waterfall reduction
4. API normalization
5. State normalization
6. Performance optimization

Why:

Optimization before ownership clarity creates:
- optimized instability.

---

## Stage F — Retirement & Certification

Do LAST:

1. Legacy cleanup
2. Route retirement
3. Dead surface retirement
4. Final verification
5. Rollout certification

Why:

Deleting transitional systems too early is one of the highest risks in this storefront.

---

# 28. Exact Recommended Engineering Sequence

## Wave 1 — Canonical Route Recovery

### Objectives

Recover one authoritative storefront route system.

### Tasks

- Create canonical storefront route registry
- Remove stale `/products/product/:slug` assumptions
- Normalize shop route ownership
- Normalize localized route generation
- Normalize breadcrumb route ownership
- Normalize product URL builders
- Normalize search result URL generation
- Normalize cart/order item URL generation

### High Risk Areas

- search results
- breadcrumbs
- localized links
- legacy redirects
- runtime resolve redirects

### Must NOT Happen Yet

- deleting legacy pages
- runtime product rewrite
- cart refactor
- auth refactor

---

# 29. Wave 2 — Storefront Shell Consolidation

## Objectives

Create one storefront shell architecture.

## Tasks

### Header Consolidation

Unify:
- runtime header
- legacy header
- auth visibility
- cart visibility
- search visibility
- locale switching
- theme controls
- mobile navigation

### Footer Consolidation

Normalize:
- footer rendering
- tenant branding ownership
- runtime footer payload usage
- storefront navigation ownership

### Layout Consolidation

Reduce:
- runtime layout duplication
- auth shell fragmentation
- standalone rendering exceptions

### Navigation Ownership

Normalize:
- backend runtime navigation
- storefront shell rendering
- mobile navigation ownership
- locale-aware navigation handling

---

## Critical Rule

Do NOT immediately delete:
- `Header.vue`
- `RuntimeHeader.vue`
- `Footer.vue`
- runtime layouts

First:
- consolidate behavior,
- then retire duplication.

---

# 30. Wave 3 — Auth SSR Stabilization

## Objectives

Make storefront identity SSR-aware.

## Tasks

### Centralize Auth Bootstrap

Replace:
- scattered auth hydration.

Create:
- one storefront auth initialization lifecycle.

### Runtime Auth Awareness

Runtime shell must understand:
- authenticated state,
- customer visibility,
- account visibility.

### Tenant-Safe Persistence

Replace:
- global auth cookie assumptions.

### Complete Recovery Flows

Implement:
- forgot-password page,
- reset-password page,
- email verification flow,
- unified redirects.

### Social Auth Normalization

Normalize:
- Google callback lifecycle,
- token restoration,
- storefront continuity.

---

## Dangerous Areas

- SSR auth hydration
- token persistence
- middleware redirects
- runtime SSR rendering
- auth/cart coupling

---

## Must NOT Happen Yet

- checkout migration
- customer dashboard rewrite
- account-area redesign

---

# 31. Wave 4 — Cart Consolidation

## Objectives

Create one storefront commerce state lifecycle.

## Tasks

### Runtime Cart Integration

Add:
- runtime cart badge,
- runtime cart entry,
- runtime shell cart continuity.

### Product Commerce Parity

Runtime product pages must support:
- add-to-cart,
- purchase continuity,
- product commerce interactions.

### Tenant-Safe Guest Cart

Replace:
- global `guest_cart` ownership.

### Cart Merge Hardening

Normalize:
- merge failures,
- stale item handling,
- recovery behavior.

### Cart Rendering Stabilization

Reduce:
- client-only cart rendering.

---

## Dangerous Areas

- logout behavior
- merge logic
- SSR cart assumptions
- runtime product parity

---

## Must NOT Happen Yet

- checkout rewrite
- order pipeline rewrite
- inventory redesign

---

# 32. Wave 5 — Search Reintegration

## Objectives

Move search into storefront ownership.

## Tasks

### Runtime Shell Search

Expose search consistently across:
- runtime pages,
- legacy pages,
- mobile layouts.

### Canonical Search Routes

Normalize:
- search URLs,
- query handling,
- product links.

### SSR Search Stabilization

Reduce:
- client-only rendering dependence.

### Search API Ownership

Normalize:
- GraphQL integration,
- storefront headers,
- tenant propagation,
- auth propagation.

---

## Dangerous Areas

- GraphQL assumptions
- tenant propagation
- autocomplete behavior
- SEO indexing

---

# 33. Wave 6 — Runtime Commerce Capability Expansion

## Objectives

Transform runtime rendering into real storefront rendering.

## Tasks

### Runtime Product Detail Expansion

Integrate:
- pricing,
- commerce controls,
- inventory visibility,
- richer media handling,
- cart continuity.

### Runtime Commerce Sections

Expand runtime rendering capability.

### Product Architecture Consolidation

Merge:
- abandoned product-detail systems,
- runtime product rendering,
- reusable commerce components.

---

## Critical Rule

Do NOT create:
- third product rendering architecture.

There are already:
- legacy product remnants,
- runtime product summary,
- abandoned richer runtime detail systems.

Adding another layer worsens fragmentation.

---

# 34. Wave 7 — Tenant Isolation Hardening

## Objectives

Eliminate storefront leakage risks.

## Tasks

### Tenant-Safe Persistence

Normalize:
- auth,
- cart,
- locale,
- storefront preferences.

### Tenant Validation Hardening

Remove:
- optimistic storefront tenant assumptions.

### Search Isolation

Normalize:
- tenant propagation in search.

### Runtime Recovery

Handle:
- invalid tenants,
- suspended tenants,
- unpublished storefronts.

---

# 35. Wave 8 — SSR & Hydration Stabilization

## Objectives

Reduce storefront instability.

## Tasks

### Hydration Flash Reduction

Reduce:
- auth flashes,
- cart flashes,
- shell swaps,
- theme swaps.

### Duplicate Fetch Reduction

Reduce:
- duplicate auth fetches,
- duplicate navigation loads,
- duplicate storefront initialization.

### Runtime Transition Stabilization

Normalize:
- runtime-to-legacy transitions.

---

# 36. Wave 9 — API & State Normalization

## Objectives

Reduce integration fragmentation.

## Tasks

### Fetch Standardization

Normalize:
- error handling,
- tenant propagation,
- auth propagation,
- DTO transforms.

### State Ownership Recovery

Reduce:
- overlapping ownership,
- duplicate hydration paths.

### Runtime Waterfall Reduction

Promote:
- reusable storefront shell state.

---

# 37. Wave 10 — Performance Optimization

## Objectives

Optimize only AFTER consolidation stabilizes.

## Tasks

### Runtime Fetch Reduction

Reduce:
- resolve/page/theme/navigation waterfalls.

### Search Optimization

Optimize:
- autocomplete,
- repeated search queries.

### Cart Optimization

Improve:
- merge performance,
- synchronization behavior.

### Shell Efficiency

Reduce:
- duplicated rendering,
- duplicated layouts.

---

# 38. Wave 11 — Legacy Retirement

## Objectives

Safely remove transitional systems.

## Tasks

### Remove Stale Routes

Retire:
- stale product route assumptions,
- compatibility redirects.

### Remove Dead Runtime Migration Surfaces

Audit:
- abandoned composables,
- dead API routes,
- duplicate rendering systems.

### Reduce Layout Duplication

Retire:
- redundant runtime wrappers,
- abandoned auth shell behavior.

---

# 39. Recommended Team Structure

## Recommended Core Teams

### Team A — Runtime & Routing

Owns:
- routing,
- runtime rendering,
- layouts,
- shell continuity,
- SSR ownership.

### Team B — Commerce State

Owns:
- auth,
- cart,
- customer continuity,
- session persistence.

### Team C — Search & API Integration

Owns:
- search,
- GraphQL integration,
- API normalization,
- DTO normalization.

### Team D — Platform Hardening

Owns:
- tenant isolation,
- performance,
- observability,
- verification.

---

# 40. High-Risk Refactors

The following refactors are dangerous enough that they should NEVER be bundled together.

---

## Dangerous Combination #1

Do NOT combine:
- routing rewrite,
- shell rewrite,
- runtime product rewrite.

Risk:
- storefront navigation collapse.

---

## Dangerous Combination #2

Do NOT combine:
- auth persistence rewrite,
- cart merge rewrite,
- SSR auth hydration rewrite.

Risk:
- customer session instability.

---

## Dangerous Combination #3

Do NOT combine:
- search migration,
- GraphQL refactor,
- route canonicalization.

Risk:
- storefront SEO fragmentation.

---

## Dangerous Combination #4

Do NOT remove:
- legacy components,
- stale layouts,
- transitional APIs,
BEFORE:
- runtime parity verification exists.

Risk:
- irreversible storefront regression.

---

# 41. Mandatory Engineering Rules

## Rule 1 — One Ownership Per Domain

Every storefront concern must have:
- one owner,
- one lifecycle,
- one persistence strategy.

---

## Rule 2 — Runtime Must Become Commerce-Aware

Runtime rendering may no longer remain:
- content-only.

---

## Rule 3 — Route Constants Must Become Authoritative

No component-local route strings.

No stale route assumptions.

No duplicate route truth.

---

## Rule 4 — Tenant Safety Is Mandatory

Every persistence mechanism must become:
- tenant-aware.

---

## Rule 5 — SSR Ownership Must Be Explicit

Every storefront domain must explicitly define:
- SSR ownership,
- hydration ownership,
- client-only boundaries.

---

## Rule 6 — Legacy Retirement Happens LAST

Transitional systems are removed only after:
- runtime parity exists,
- storefront verification passes,
- rollback safety exists.

---

# 42. Final Tactical Recommendation

The storefront is currently:
- structurally transitional,
- partially unified,
- and operationally fragmented.

The biggest mistake would be:
- attempting a massive rewrite.

The correct approach is:
- progressive consolidation,
- ownership recovery,
- runtime capability expansion,
- and controlled retirement.

The runtime foundation already exists.

The real remaining work is:
- storefront unification.

That means:
- shell unification,
- route unification,
- commerce continuity,
- tenant-safe persistence,
- and runtime commerce parity.

Once those are complete,
JustShop stops behaving like:
- a migrated storefront experiment

and starts behaving like:
- a cohesive commerce platform foundation.


# JustShop Storefront Commerce Consolidation Program
## Part 5 — Operational Playbook, Governance & AI Execution Strategy

---

# 43. Purpose of This Document

Parts 1–4 defined:
- architecture,
- consolidation goals,
- migration sequencing,
- and tactical engineering execution.

This document defines:
- how the program should actually be operated,
- governed,
- verified,
- delegated,
- and executed safely over time.

Especially important because:
- the storefront already exists,
- runtime is partially live,
- legacy systems are still active,
- and AI-assisted implementation is heavily involved.

This is not only an engineering challenge.

It is:
- an operational stability challenge.

---

# 44. Core Program Reality

The storefront currently contains:

- live runtime infrastructure,
- live legacy commerce infrastructure,
- overlapping route ownership,
- overlapping shell ownership,
- overlapping rendering assumptions,
- and partially shared commerce state.

That means:
- incorrect implementation order can silently destabilize production.

The primary objective is NOT:
- feature speed.

The primary objective is:
- controlled architectural convergence.

---

# 45. Recommended Delivery Philosophy

## DO

- consolidate progressively
- recover ownership first
- stabilize shell continuity
- normalize contracts
- isolate risks
- preserve rollback safety
- certify each migration wave

---

## DO NOT

- perform massive rewrites
- rewrite runtime from scratch
- redesign the entire commerce stack at once
- merge unrelated refactors together
- delete legacy systems prematurely
- optimize before ownership stabilizes

---

# 46. Program Governance Structure

## Recommended Governance Layers

### Layer 1 — Architectural Authority

Responsible for:
- ownership rules,
- route truth,
- SSR rules,
- shell ownership,
- runtime capability standards.

This layer decides:
- what the storefront architecture IS.

Not:
- how individual features are coded.

---

### Layer 2 — Migration Coordination

Responsible for:
- implementation sequencing,
- migration choreography,
- rollout timing,
- dependency management,
- regression prevention.

This layer prevents:
- conflicting refactors.

---

### Layer 3 — Feature Delivery

Responsible for:
- implementation work,
- component migration,
- runtime integration,
- storefront behavior delivery.

---

### Layer 4 — Verification & Certification

Responsible for:
- storefront verification,
- SSR verification,
- tenant isolation verification,
- runtime parity verification,
- regression auditing.

---

# 47. Mandatory Architectural Laws

These are NOT suggestions.

These are enforcement rules.

---

## Law 1 — One Route Truth

At the end of consolidation:
- only one canonical storefront route system may exist.

Forbidden:
- duplicate product route assumptions,
- duplicate shop route assumptions,
- component-local route literals.

---

## Law 2 — One Storefront Shell

The storefront must converge into:
- one shell architecture.

Runtime shell and legacy shell divergence must eventually disappear.

---

## Law 3 — Runtime Is Not Content-Only

Runtime rendering must evolve into:
- commerce-aware rendering.

The runtime layer cannot remain:
- presentation-only.

---

## Law 4 — Tenant Isolation Is End-to-End

Tenant safety is NOT only backend safety.

It must include:
- browser persistence,
- auth continuity,
- cart continuity,
- search behavior,
- storefront shell continuity.

---

## Law 5 — SSR Ownership Must Be Explicit

Every storefront domain must define:
- SSR owner,
- hydration owner,
- client-only boundaries.

Implicit hydration behavior becomes forbidden.

---

## Law 6 — No Parallel Architectures

Do NOT create:
- replacement systems beside old systems.

Consolidate existing ownership.

Do not multiply architectures.

---

# 48. AI-Assisted Development Rules

This storefront is already large enough that:
- uncontrolled AI generation can create severe architectural drift.

Cursor/AI agents must operate under strict execution rules.

---

# 49. Cursor Execution Model

## Cursor Is NOT Allowed To

- invent new route systems
- create alternative shell architectures
- introduce duplicate state owners
- bypass DTO contracts
- bypass runtime ownership rules
- introduce temporary hacks without explicit approval
- silently rename storefront contracts
- create component-local API assumptions

---

## Cursor MUST

- follow canonical route contracts
- use existing ownership boundaries
- preserve SSR safety
- preserve tenant safety
- preserve runtime ownership
- document every migration
- preserve rollback paths
- avoid hidden architectural divergence

---

# 50. Required Cursor Prompt Structure

Every major implementation task should include:

## Section A — Objective

What business/system outcome is being achieved.

---

## Section B — Architectural Boundaries

Explicitly define:
- what may change,
- what may NOT change,
- ownership rules,
- SSR constraints,
- runtime constraints.

---

## Section C — Existing Systems Involved

List:
- layouts,
- composables,
- stores,
- runtime APIs,
- middleware,
- rendering systems.

---

## Section D — Forbidden Actions

Explicitly prohibit:
- route rewrites,
- API rewrites,
- hidden refactors,
- deletion without verification,
- duplicate implementations.

---

## Section E — Required Verification

Require:
- SSR verification,
- tenant verification,
- route verification,
- hydration verification,
- runtime verification.

---

# 51. Recommended Pull Request Standards

Every storefront PR should answer:

## 1. Ownership

Which storefront system now owns this behavior?

---

## 2. Runtime Impact

Does this affect:
- runtime rendering,
- runtime SSR,
- runtime routing,
- runtime payload contracts?

---

## 3. Shell Impact

Does this affect:
- storefront shell continuity,
- navigation,
- auth/cart/search visibility?

---

## 4. Tenant Impact

Does this affect:
- persistence,
- auth,
- cart,
- runtime isolation,
- storefront continuity?

---

## 5. SSR/Hydration Impact

Does this introduce:
- client-only behavior,
- hydration flashes,
- duplicate fetches,
- delayed storefront continuity?

---

## 6. Migration Impact

Does this:
- retire old behavior,
- coexist with old behavior,
- or introduce another temporary layer?

---

# 52. Mandatory Verification Gates

Every major wave must pass:

---

## Gate A — Route Verification

Verify:
- canonical routes,
- localized routes,
- search links,
- product links,
- breadcrumb continuity.

---

## Gate B — Runtime Verification

Verify:
- runtime rendering,
- runtime SSR,
- runtime layouts,
- runtime navigation,
- runtime payload continuity.

---

## Gate C — Commerce Verification

Verify:
- auth continuity,
- cart continuity,
- product interactions,
- search continuity.

---

## Gate D — Tenant Isolation Verification

Verify:
- auth isolation,
- cart isolation,
- persistence isolation,
- storefront continuity isolation.

---

## Gate E — Hydration Verification

Verify:
- no major flashes,
- no duplicate initialization,
- no shell instability.

---

# 53. Rollback Strategy Rules

Every migration wave must support:
- partial rollback,
- route rollback,
- shell rollback,
- runtime fallback,
- feature disablement.

---

## Forbidden Rollout Pattern

Do NOT:
- migrate everything simultaneously.

---

## Required Rollout Pattern

Use:
- progressive enablement,
- feature gating,
- runtime verification,
- staged rollout.

---

# 54. Recommended Environment Strategy

## Environment A — Local Runtime Integration

Purpose:
- development integration.

---

## Environment B — Consolidation QA

Purpose:
- migration verification.

Must contain:
- multiple tenants,
- localized storefronts,
- authenticated customers,
- runtime pages,
- legacy pages.

---

## Environment C — Runtime Certification

Purpose:
- SSR certification,
- hydration certification,
- rollout readiness.

---

## Environment D — Production Rollout

Purpose:
- staged enablement.

Must support:
- feature gating,
- runtime rollback,
- tenant allowlists.

---

# 55. Recommended Metrics

## Architectural Metrics

Track:
- duplicate route usage,
- shell divergence,
- client-only rendering dependence,
- duplicate fetch counts,
- stale route references.

---

## Commerce Metrics

Track:
- cart continuity,
- login continuity,
- guest merge failures,
- search success paths.

---

## Runtime Metrics

Track:
- runtime resolve latency,
- runtime payload latency,
- navigation payload reuse,
- hydration mismatch frequency.

---

## Tenant Metrics

Track:
- tenant mismatch incidents,
- persistence leakage incidents,
- cross-tenant continuity failures.

---

# 56. Red Flags That Require Immediate Architectural Review

Immediate review required if:

- another route system appears
- another shell system appears
- another product rendering architecture appears
- another persistence strategy appears
- runtime rendering becomes bypassed
- component-local API assumptions spread
- SSR ownership becomes unclear
- tenant assumptions become implicit

---

# 57. What Success Actually Looks Like

Success is NOT:
- “the runtime works.”

Success is:
- the storefront behaving like one coherent commerce platform.

That means:

- one shell experience
- one route system
- one storefront identity lifecycle
- one commerce continuity model
- one runtime rendering architecture
- one tenant-safe persistence strategy
- one predictable SSR model

---

# 58. Final Operational Recommendation

The storefront should now be treated as:
- a long-term platform foundation,
not:
- a migration experiment.

That changes how engineering decisions are made.

The goal is no longer:
- “make runtime pages work.”

The goal becomes:
- platform coherence,
- storefront continuity,
- and architectural durability.

The runtime foundation is already strong enough.

The remaining challenge is:
- consolidation discipline.

If the execution order stays controlled,
if ownership remains strict,
and if parallel architectures stop multiplying,
then JustShop can evolve from:
- a hybrid storefront migration

into:
- a true multi-tenant commerce platform foundation.

# JustShop Storefront Commerce Consolidation Program
## Part 6 — Target Platform Blueprint & Future-State Architecture

---

# 59. Purpose of This Document

Parts 1–5 defined:

- what currently exists,
- what is fragmented,
- how consolidation should happen,
- how migration should be executed,
- and how the program should be governed.

This document defines:
- the actual target platform.

Not:
- transitional architecture.

Not:
- migration safety.

Not:
- hybrid coexistence.

This is the destination state.

The purpose is to answer:

"What does JustShop become after consolidation is complete?"

---

# 60. Final Vision

The end-state storefront should behave as:

- one unified commerce runtime,
- one SSR storefront platform,
- one tenant-aware rendering system,
- one commerce continuity layer,
- and one canonical customer experience.

The customer must never feel:
- route ownership changes,
- shell swaps,
- rendering mode changes,
- or architecture boundaries.

The storefront should feel like:
- one cohesive commerce operating system.

---

# 61. Final Platform Characteristics

The final storefront platform should provide:

---

## Unified Runtime Rendering

All in-program storefront surfaces must operate through:
- one runtime-aware storefront application architecture.

This means the program must end with:
- one canonical storefront shell,
- one canonical route authority,
- one unified storefront context model,
- and one predictable SSR/hydration lifecycle.

This does **NOT** require every surface to become runtime-native during this program.

At program end, surfaces may be:
- runtime-rendered directly,
- or legacy-hosted inside the unified storefront shell under canonical route ownership.

Including:

- homepage
- category pages
- product pages
- marketing pages
- search pages
- cart
- authentication surfaces

Program-end canonical but potentially legacy-hosted surfaces:

- checkout flows
- orders
- profile/account pages

Future runtime-native surfaces after optional follow-up programs:

- wishlist/favorites
- recommendations
- future merchant extensions

---

## Unified Shell Experience

The storefront must have:
- one canonical shell.

Meaning:

- one header system
- one footer system
- one navigation architecture
- one mobile navigation system
- one auth visibility model
- one cart visibility model
- one locale system
- one tenant theme system

No shell fragmentation.

No shell switching.

No runtime-vs-legacy distinction.

---

## Unified Commerce State

Commerce continuity becomes global.

Meaning:

- auth continuity
- cart continuity
- checkout continuity
- profile continuity
- search continuity
- locale continuity
- tenant continuity

must all survive:

- SSR
- hydration
- route transitions
- runtime rendering
- navigation changes
- login transitions
- logout transitions
- locale switches

---

## Unified Tenant Runtime

The storefront becomes:
- tenant-native.

Meaning:

- tenant identity exists at all layers,
- tenant isolation exists at all layers,
- tenant branding exists at all layers,
- tenant routing exists at all layers,
- tenant persistence exists at all layers.

Tenant-awareness is no longer:
- a runtime feature.

It becomes:
- platform DNA.

---

# 62. Final Route Architecture

The platform should converge into:
- one canonical route system.

---

## Canonical Route Ownership

### Home

```text
/
```

---

### Shop Landing

```text
/shop
```

---

### Categories

```text
/products/category/:slug
```

---

### Product Detail

```text
/products/:slug
```

---

### Search

```text
/search
```

---

### Cart

```text
/cart
```

---

### Checkout

```text
/checkout
```

Sub-routes may exist.

During this program, checkout may remain legacy-owned behind:
- canonical route ownership,
- unified shell continuity,
- unified storefront context,
- and normalized auth/cart/search continuity.

Runtime-native checkout is explicitly future work under the optional checkout evolution program.

---

### Orders

```text
/orders
/orders/:orderNumber
```

Orders may remain legacy-owned during this program if:
- canonical routes are authoritative,
- unified shell continuity exists,
- auth continuity is preserved,
- and DTO / API boundaries are normalized.

---

### Profile

```text
/profile
```

Profile/account areas may remain legacy-owned during this program under the same rules as orders.

---

### Authentication

```text
/login
/register
/verify-email
/forgot-password
/reset-password
```

---

### Marketing Pages

```text
/:slug
```

---

## Final Rule

Only ONE canonical route may exist for:
- product detail,
- shop root,
- category detail,
- customer flows.

Canonical route ownership does **not** by itself require runtime-native page ownership in this program.

For this program:
- route authority must be unified,
- shell continuity must be unified,
- storefront context must be unified,
- but checkout / orders / profile may remain legacy-rendered until optional future programs are approved.

All stale route patterns must eventually disappear.

---

# 63. Final Rendering Architecture

The storefront should evolve into:
- a unified storefront rendering pipeline led by the runtime layer.

---

## Final Rendering Flow

```text
Request
  ↓
Tenant Resolution
  ↓
Runtime Route Resolution
  ↓
Storefront Surface Ownership Resolution
  ↓
Unified Storefront Context Build
  ↓
Shell State Resolution
  ↓
Runtime Payload Resolution
  OR
Legacy Commerce Adapter Resolution
  ↓
SSR Rendering
  ↓
Hydration Continuity
```

---

# 64. Final Runtime Responsibilities

The runtime layer should eventually own:

---

## Routing

Including:
- canonical URLs,
- redirects,
- locale-aware routing,
- tenant-aware routing.

---

## Navigation

Including:
- header nav,
- footer nav,
- mobile nav,
- account nav.

---

## Theme

Including:
- tenant branding,
- typography,
- radius,
- color tokens,
- dark/light adaptation.

---

## Commerce Context

Including:
- auth visibility,
- cart visibility,
- account visibility,
- wishlist visibility,
- notifications.

---

## Search Context

Including:
- search availability,
- search suggestions,
- search indexing awareness.

---

## Layout Ownership

Including:
- shell continuity,
- responsive behavior,
- runtime layouts.

---

# 65. Final Shell Blueprint

The final shell should contain:

---

## Header Zone

### Left

- logo
- store identity
- tenant branding

---

### Center

- primary navigation
- categories
- marketing pages

---

### Right

- search
- locale switcher
- theme toggle
- account menu
- cart indicator
- notifications

---

## Mobile Shell

Must include:

- mobile runtime navigation
- mobile account controls
- mobile cart access
- mobile search
- locale controls

No separate mobile architecture.

---

## Footer Zone

Must support:

- tenant-managed links
- policies
- social links
- marketing blocks
- runtime-managed navigation groups

---

# 66. Final Search Architecture

Search must become:
- a first-class storefront runtime capability.

Not:
- a detached Apollo implementation.

---

## Final Search Requirements

### SSR-Compatible

Search results must SSR.

---

### Runtime-Aware

Search must understand:

- tenant
- locale
- storefront visibility
- pricing visibility
- inventory visibility

---

### Unified Search Entry

Search must exist:

- in the unified shell,
- in mobile shell,
- in runtime rendering,
- in commerce flows.

---

### Canonical Product Linking

Search must use:
- canonical product routes only.

---

### Search UX

Should support:

- autocomplete
- suggestions
- categories
- recent searches
- trending searches
- filters
- sorting
- pagination
- SEO-aware result rendering

---

# 67. Final Authentication Architecture

Authentication should evolve into:
- SSR-aware commerce identity.

---

## Final Auth Characteristics

### SSR Identity Awareness

Public pages should SSR:
- logged-in shell state.

---

### Unified Auth Ownership

One ownership model for:

- login
- logout
- registration
- verification
- password reset
- social auth
- session refresh

---

### Unified Account Experience

Account state must exist consistently across:

- runtime pages
- search
- cart
- checkout
- profile
- orders

---

### Tenant-Aware Sessions

Auth persistence must be:
- tenant-aware.

---

# 68. Final Cart Architecture

The cart must become:
- globally continuous.

---

## Final Cart Requirements

### SSR-Aware Cart State

Cart badge and shell visibility must SSR.

---

### Unified Cart Source Of Truth

No dual guest/server ownership divergence.

---

### Tenant Isolation

Cart persistence must be:
- tenant-scoped.

---

### Checkout Continuity

Cart continuity must survive:

- login
- logout
- checkout
- locale switches
- route transitions

---

### Runtime Product Integration

All runtime product experiences must support:

- add-to-cart
- quantity control
- inventory awareness
- pricing awareness
- cart synchronization

---

# 69. Final Theme Architecture

The final theme system should unify:

- tenant branding
- storefront tokens
- dark/light behavior
- shell styling
- runtime rendering
- SEO/browser meta integration

---

## Final Theme Rule

There must NOT be:

- one runtime theme system
- and one legacy local theme system.

There should be:
- one layered theme architecture.

---

# 70. Final State Management Architecture

The final platform should have:
- explicit ownership.

---

## Global Platform State

Examples:

- storefront context
- tenant context
- auth context
- cart context
- shell context
- locale context

---

## Feature State

Examples:

- filters
- modals
- temporary UI state
- checkout step state

---

## Persistence Rules

Every persisted item must define:

- tenant scope
- expiration strategy
- SSR compatibility
- hydration strategy

---

# 71. Final API Architecture

The final storefront should converge into:
- one predictable API strategy.

---

## Final API Characteristics

### Unified API Client

Avoid fragmented:

- runtime fetches
- Apollo bypasses
- custom browser redirects
- competing wrappers

---

### Unified DTO Standards

All storefront responses should follow:
- stable DTO contracts.

---

### Runtime-Native APIs

Search,
cart,
auth,
profile,
orders,
and commerce flows

should all become runtime-compatible.

---

### Consistent Error Handling

One storefront-wide strategy for:

- errors
- notifications
- redirects
- auth expiration
- retry logic

---

# 72. Final SSR Model

The storefront should eventually achieve:
- predictable SSR.

---

## SSR Principles

### SSR By Default

Public storefront content SSRs by default.

---

### Explicit Client Boundaries

Client-only rendering must be:
- deliberate,
not accidental.

---

### Hydration Stability

Hydration should not:

- swap shells
- swap layouts
- reveal delayed identity
- reveal delayed cart state

---

### Runtime Shell Continuity

The shell must remain:
- stable across hydration.

---

# 73. Final Tenant Isolation Blueprint

Tenant isolation should become:
- end-to-end.

---

## Tenant-Isolated Layers

### Runtime Cache

Already mostly correct.

---

### Auth Persistence

Must become:
- tenant-aware.

---

### Cart Persistence

Must become:
- tenant-aware.

---

### Locale Persistence

Must become:
- tenant-aware.

---

### Search

Must become:
- tenant-aware.

---

### Shell Context

Must become:
- tenant-native.

---

# 74. Future Merchant Capabilities

Once consolidation succeeds,
JustShop becomes capable of:

---

## Merchant Runtime Customization

Including:

- tenant themes
- navigation control
- shell configuration
- runtime section composition
- storefront layout configuration

---

## Merchant Runtime Extensions

Including:

- promotional blocks
- recommendation engines
- CMS experiences
- campaign pages
- merchandising systems

---

## Runtime Commerce Features

Including:

- dynamic pricing
- inventory personalization
- recommendations
- loyalty systems
- wishlist systems
- customer segmentation

---

# 75. What the Platform Still Will NOT Be

Even after consolidation,
JustShop still will NOT yet equal:
- full Shopify ecosystem maturity.

Because Shopify additionally contains:

- app ecosystems
- embedded apps
- merchant extension APIs
- large-scale workflow automation
- advanced merchant operations
- extensive analytics systems
- marketplace ecosystems
- deep app-store integrations
- mature plugin/runtime extension frameworks
- enterprise operations tooling

---

# 76. What JustShop WILL Become

After successful consolidation,
JustShop becomes:

- a true unified multi-tenant commerce platform,
- with coherent SSR storefront architecture,
- coherent runtime rendering,
- coherent commerce continuity,
- and strong platform foundations.

Meaning:

It becomes:
- architecturally legitimate.

Not:
- a hybrid migration layer.

---

# 77. Final Strategic Truth

The storefront runtime program already solved:
- runtime rendering infrastructure.

The consolidation program solves:
- platform coherence.

That is the missing step between:

"runtime-capable storefront"

and:

"real commerce platform foundation"

---

# 78. Final End-State Summary

After the consolidation program is fully completed,
JustShop should provide:

- one storefront shell
- one route system
- one runtime architecture
- one commerce continuity model
- one tenant-safe persistence model
- one SSR strategy
- one storefront identity lifecycle
- one navigation architecture
- one canonical commerce experience

At that point,
JustShop stops feeling like:
- a migrated Nuxt application.

And starts behaving like:
- a real multi-tenant commerce platform.


# JustShop Storefront Commerce Consolidation Program
## Part 7 — Execution Backlog, Milestone Matrix & Delivery Roadmap

---

# 79. Purpose of This Document

Parts 1–6 defined:

- current-state architecture,
- fragmentation,
- consolidation strategy,
- operational governance,
- and final target-state architecture.

This document converts the program into:

- an executable delivery roadmap,
- milestone structure,
- backlog hierarchy,
- and implementation tracking system.

This is the layer that transforms:

"architecture planning"

into:

"real multi-quarter execution."

---

# 80. Recommended Program Structure

The consolidation program should NOT be managed:

- as one giant migration.

It should be managed as:

- controlled platform convergence waves.

Recommended structure:

```text
Program
  → Streams
    → Waves
      → Milestones
        → Tasks
```

---

# 81. Primary Execution Streams

The storefront should be divided into dedicated execution streams.

---

# Stream A — Route Consolidation

Purpose:
- eliminate competing route systems.

Primary goals:

- canonical route ownership
- stale route elimination
- route constant normalization
- runtime canonical linking
- redirect normalization

High-risk areas:

- product links
- breadcrumbs
- search links
- order links
- cart links

---

# Stream B — Shell Consolidation

Purpose:
- unify storefront shell behavior.

Primary goals:

- unified header
- unified footer
- runtime commerce awareness
- unified mobile nav
- shell continuity

High-risk areas:

- hydration
- SSR continuity
- runtime layouts
- auth visibility
- cart visibility

---

# Stream C — Auth & Session Consolidation

Purpose:
- create unified SSR-aware identity.

Primary goals:

- centralized auth bootstrap
- SSR auth awareness
- tenant-aware auth persistence
- unified verification/reset flows
- social auth normalization

High-risk areas:

- hydration mismatch
- session continuity
- token handling
- SSR race conditions

---

# Stream D — Cart Consolidation

Purpose:
- create globally continuous cart behavior.

Primary goals:

- tenant-aware persistence
- SSR-aware cart visibility
- runtime product integration
- guest/server reconciliation
- shell cart continuity

High-risk areas:

- guest cart merges
- stale localStorage
- cart loss
- checkout continuity

---

# Stream E — Search Consolidation

Purpose:
- integrate search into runtime architecture.

Primary goals:

- unified shell search
- SSR-compatible search
- canonical links
- runtime-aware indexing
- search contract normalization

High-risk areas:

- GraphQL compatibility
- stale route generation
- SEO regressions

---

# Stream F — Runtime Commerce Capability

Purpose:
- evolve runtime into commerce-aware rendering.

Primary goals:

- richer product detail runtime sections
- cart interactions
- auth-aware runtime rendering
- shell commerce integration

High-risk areas:

- hydration
- SSR ownership
- component duplication

---

# Stream G — State & Persistence Normalization

Purpose:
- eliminate fragmented state ownership.

Primary goals:

- unified ownership
- tenant-scoped persistence
- explicit persistence strategy
- predictable hydration

High-risk areas:

- stale state
- cross-tenant leakage
- race conditions

---

# Stream H — API & Contract Consolidation

Purpose:
- unify storefront API behavior.

Primary goals:

- unified API client
- unified DTO standards
- consistent error handling
- runtime-native commerce APIs

High-risk areas:

- DTO drift
- backward compatibility
- proxy fragmentation

---

# 82. Recommended Program Phases

---

# Phase 1 — Stabilization

Goal:
- stop architectural drift.

Focus:

- canonical route audit
- route constant repair
- stale route removal
- runtime verification hardening
- ownership documentation

Expected outcome:
- no further fragmentation.

---

# Phase 2 — Shell Convergence

Goal:
- unify storefront shell experience.

Focus:

- runtime header expansion
- runtime cart visibility
- runtime auth visibility
- runtime search integration
- unified mobile navigation

Expected outcome:
- storefront feels visually continuous.

---

# Phase 3 — Commerce Continuity

Goal:
- unify auth/cart/search continuity.

Focus:

- SSR-aware auth
- SSR-aware cart visibility
- tenant-scoped persistence
- unified storefront identity lifecycle

Expected outcome:
- commerce continuity stabilizes.

---

# Phase 4 — Runtime Commerce Evolution

Goal:
- make runtime commerce-native.

Focus:

- runtime product detail evolution
- richer commerce sections
- runtime checkout preparation
- runtime account awareness

Expected outcome:
- runtime becomes commerce-aware.

---

# Phase 5 — Legacy Retirement

Goal:
- remove obsolete architecture.

Focus:

- layout consolidation
- shell duplication removal
- stale composable retirement
- dead API removal
- legacy runtime bridges removal

Expected outcome:
- one coherent storefront platform.

---

# 83. Recommended Milestone Sequence

---

## Milestone M1 — Canonical Route Recovery

Success criteria:

- stale product URLs removed
- canonical route helpers normalized
- breadcrumbs corrected
- search links corrected

---

## Milestone M2 — Unified Runtime Shell

Success criteria:

- runtime header contains auth/cart/search
- runtime shell continuity stabilized
- mobile runtime navigation implemented

---

## Milestone M3 — SSR Commerce Awareness

Success criteria:

- SSR auth awareness exists
- SSR cart awareness exists
- hydration flashes reduced

---

## Milestone M4 — Tenant-Safe Persistence

Success criteria:

- auth persistence tenant-scoped
- cart persistence tenant-scoped
- locale persistence tenant-scoped

---

## Milestone M5 — Runtime Search Integration

Success criteria:

- search exists in unified shell
- canonical product linking enforced
- SSR search results functional

---

## Milestone M6 — Runtime Commerce Capability

Success criteria:

- runtime product detail supports commerce interactions
- add-to-cart fully runtime-native
- runtime shell commerce-aware

---

## Milestone M7 — Shell Retirement

Success criteria:

- duplicate layouts retired
- duplicate headers retired
- duplicate footers retired

---

## Milestone M8 — Platform Coherence Certification

Success criteria:

- storefront behaves as one platform
- no competing route systems
- no shell fragmentation
- no major hydration instability
- no major tenant leakage risks

---

# 84. Recommended Engineering Velocity Strategy

The storefront should prioritize:

```text
Stability > Velocity
Architecture > Convenience
Convergence > Rewrite
Continuity > Feature Count
```

---

# 85. Recommended Team Parallelization

Avoid having multiple engineers modify:

- runtime routing,
- shell ownership,
- auth bootstrap,
- or cart ownership

simultaneously.

These are convergence-critical systems.

---

## Safe Parallel Work Areas

Can be parallelized more safely:

- runtime sections
- UI refinements
- SEO improvements
- mobile UX refinements
- merchant runtime capabilities
- analytics instrumentation

---

# 86. Recommended Risk Matrix

| Area | Risk | Severity |
|---|---|---|
| Routing | Broken canonical navigation | Critical |
| Shell | Runtime/legacy continuity break | Critical |
| Auth | Session instability | Critical |
| Cart | Cart loss or merge failure | Critical |
| Search | Broken product discovery | High |
| Tenant persistence | Cross-tenant leakage | Critical |
| Hydration | Shell flickering | High |
| Runtime payloads | DTO drift | High |
| Legacy retirement | Hidden runtime dependency breakage | High |

---

# 87. Recommended Success KPIs

---

## Platform KPIs

- one canonical route system
- one storefront shell
- one commerce continuity model
- one runtime rendering architecture

---

## SSR KPIs

- reduced hydration mismatches
- reduced client-only rendering
- reduced shell swaps

---

## Commerce KPIs

- cart continuity success rate
- login continuity success rate
- checkout continuity success rate

---

## Tenant KPIs

- zero known persistence leakage
- zero cross-tenant cart contamination
- zero cross-tenant auth contamination

---

# 88. Final Delivery Recommendation

The storefront should now be treated as:

- a platform convergence program,
not:
- a page migration project.

The runtime already proved:
- rendering capability.

The remaining work is:

- architectural convergence,
- commerce continuity,
- and platform stabilization.

---

# 89. How Many Parts Should Exist?

Recommended final documentation structure:

| Part | Purpose |
|---|---|
| Part 1 | Current-State Audit |
| Part 2 | Consolidation Strategy |
| Part 3 | Architectural Refactoring Plan |
| Part 4 | Tactical Execution Plan |
| Part 5 | Operational Governance & AI Execution |
| Part 6 | Target Platform Blueprint |
| Part 7 | Execution Backlog & Milestone Matrix |
| Part 8 (Optional) | Backend Runtime Evolution Plan |
| Part 9 (Optional) | Checkout & Commerce Engine Evolution |
| Part 10 (Optional) | Merchant CMS & Theme Runtime Expansion |

---

# 90. Recommended Stopping Point

Parts 1–7 are sufficient to:

- execute the storefront consolidation program,
- coordinate engineering work,
- manage AI implementation safely,
- and guide long-term storefront evolution.

The optional future parts are only necessary when:

- backend runtime capabilities evolve further,
- checkout becomes runtime-native,
- or merchant runtime extensibility expands significantly.

---

# 91. Implementation Readiness Addendum

Parts 1–7 define the architecture, sequencing, and roadmap.

This addendum makes the program implementation-ready by closing the remaining execution gaps:

- final program-end ownership clarity,
- temporary coexistence and compatibility layers,
- state and persistence migration choreography,
- rollout and rollback controls,
- verification detail,
- observability expectations,
- deprecation governance,
- and production stabilization requirements.

This addendum is authoritative for implementation readiness.

If any broader future-state language elsewhere in this document conflicts with these execution rules:
- this addendum wins for the current program.

---

# 92. Authoritative Program-End Boundary

The purpose of this section is to remove ambiguity between:
- the long-term platform vision,
- and what this program must actually complete before implementation begins.

At the end of THIS program, JustShop must deliver:

- one canonical storefront route system,
- one unified storefront shell,
- one runtime-aware storefront context model,
- SSR-aware auth shell continuity,
- SSR-aware cart shell continuity,
- runtime-integrated search,
- tenant-safe persistence,
- normalized API / DTO ownership,
- and safe retirement of transitional storefront duplication.

At the end of THIS program, the following surfaces must be canonical and storefront-coherent, but may remain legacy-rendered behind the unified shell:

- checkout
- orders
- profile / account pages

For those surfaces, the program requires:

- canonical route ownership,
- unified shell continuity,
- unified navigation continuity,
- unified auth continuity,
- unified locale continuity,
- unified tenant safety rules,
- and normalized API / DTO expectations.

This program does NOT require:

- runtime-native checkout,
- runtime-native orders,
- runtime-native profile,
- runtime-native wishlist,
- runtime-native recommendations.

Those remain future programs unless explicitly approved.

---

# 93. Compatibility Layer & Dual-Run Strategy

The storefront is already live.

Therefore consolidation must use controlled coexistence instead of assuming clean replacement.

Every temporary compatibility layer must define:

- owner,
- reason for existence,
- activation scope,
- removal trigger,
- rollback impact,
- verification method,
- and sunset target wave.

Required temporary compatibility layers:

**93.1 Route Compatibility Layer**

- legacy-to-canonical redirects
- localized route alias handling
- stale product/search/order/deep-link redirects
- redirect logging for unmigrated entry points

**93.2 Shell Host Bridge**

- legacy-rendered pages mount inside the canonical storefront shell
- shell state remains authoritative for header, footer, locale, auth/cart visibility, and navigation
- no standalone legacy shell may survive once this bridge is active

**93.3 Auth Bootstrap Bridge**

- old auth restoration paths may coexist temporarily
- the new canonical auth bootstrap becomes the read authority first
- legacy auth restoration becomes fallback only during migration
- duplicate user bootstrap paths must be observable before removal

**93.4 Persistence Migration Shim**

- read old keys where required
- write canonical tenant-scoped keys only once a domain is migrated
- support deterministic stale-key cleanup
- prevent cross-tenant restoration from old global keys

**93.5 Cart Reconciliation Bridge**

- guest cart, authenticated cart, SSR badge state, and checkout continuity must remain interoperable during migration
- merge failures must degrade visibly, not silently
- canonical cart owner must be explicit before any legacy cart logic is removed

**93.6 Search Client Adapter**

- preserve existing search behavior while normalizing tenant propagation, auth propagation, route generation, and error handling
- old Apollo or direct-search assumptions must be wrapped, not multiplied

**93.7 DTO Translation Layer**

- legacy commerce endpoints may temporarily emit non-canonical shapes
- storefront consumers must normalize through one DTO boundary
- components may not absorb endpoint-specific payload differences directly

**93.8 Middleware Coexistence Bridge**

- guest-only, auth-only, and mixed runtime/legacy navigation rules must behave consistently during transition
- redirect ownership must stay centralized

Compatibility layer removal rule:

- no compatibility layer may be removed until metrics, verification, rollback safety, and replacement ownership are all confirmed.

---

# 94. Persistence Key Migration & State Reconciliation Strategy

Tenant-safe persistence cannot be implemented as a one-step rename.

Each persisted domain must migrate through the following sequence:

1. Inventory current keys, scopes, expirations, and restoration behavior.
2. Define the canonical tenant-scoped key schema.
3. Introduce compatibility read rules where needed.
4. Switch canonical writes to tenant-scoped keys.
5. Validate restoration, logout, login, and tenant-switch continuity.
6. Clean up stale keys safely after verification.

This applies to:

- auth persistence
- guest cart persistence
- locale persistence
- storefront preferences
- any cached client storefront context

Required rules:

**94.1 One Canonical Writer Per Domain**

- during migration, read compatibility may be dual
- write ownership may not be dual

**94.2 Cross-Tenant Collision Prevention**

- global keys must never restore state into another tenant
- unknown tenant or host mismatch must suppress restoration until tenant validity is confirmed

**94.3 Logout / Login / Tenant Switch Semantics**

- logout must clear tenant-scoped auth continuity correctly
- login must reconcile guest and authenticated state predictably
- tenant switch must not drag auth, cart, or locale state across storefront boundaries unless explicitly allowed and verified

**94.4 Expiration & Cleanup Rules**

- every persisted item must define TTL or invalidation behavior
- stale compatibility keys must have a removal wave and owner

**94.5 Recovery Rules**

- corrupt persisted state must fail closed
- recovery behavior must be deterministic and observable

---

# 95. SEO, Redirect & Deep-Link Preservation Strategy

Canonical route migration is not complete unless it preserves discovery, indexing, and old entry points.

This program must explicitly protect:

- search engine indexed URLs,
- localized URLs,
- email links,
- social share links,
- ad / campaign links,
- bookmarks,
- order links,
- password reset links,
- social auth return flows.

Required deliverables:

**95.1 Redirect Inventory**

- inventory every known stale storefront route family
- map each route family to canonical destinations
- document whether redirects are permanent, temporary, or transitional only

**95.2 Deep-Link Preservation Matrix**

- product links
- category links
- search links
- cart links
- checkout return links
- auth recovery links
- orders / profile links

**95.3 SEO Ownership Checklist**

- canonical tag ownership
- hreflang ownership
- sitemap ownership
- robots behavior
- structured data ownership
- product schema continuity

**95.4 Redirect Safety Rules**

- no redirect chains
- no locale-dropping redirects without explicit rule
- no tenant-leaking redirects
- no auth-breaking redirects for recovery flows

**95.5 SEO Validation Gates**

- verify canonical URLs
- verify hreflang output
- verify product schema continuity
- verify search indexing safety
- verify stale route retirement does not orphan indexable pages

---

# 96. Phase Prerequisites & No-Go Conditions

No phase may begin solely because the previous phase is partially complete.

Each high-risk wave must have explicit prerequisites and no-go conditions.

**96.1 Before Shell Consolidation**

Must already exist:

- canonical route contract
- navigation ownership rules
- preliminary route compatibility plan

Do NOT proceed if:

- route generation is still fragmented
- breadcrumbs are still ambiguous
- localized route handling is still unstable

**96.2 Before Auth SSR Consolidation**

Must already exist:

- unified shell host target
- tenant persistence contract
- redirect ownership rules

Do NOT proceed if:

- auth bootstrap still depends on page-family-specific behavior
- tenant validation remains optimistic

**96.3 Before Cart Consolidation**

Must already exist:

- auth bootstrap authority
- canonical persistence writer rules
- cart merge owner

Do NOT proceed if:

- guest and authenticated cart ownership are still implicit
- logout semantics are still undefined

**96.4 Before Search Consolidation**

Must already exist:

- canonical route generation
- product link authority
- search API ownership target

Do NOT proceed if:

- search still emits stale routes
- tenant propagation is still inconsistent

**96.5 Before Tenant / SSR Hardening**

Must already exist:

- canonical API ownership
- canonical state ownership
- compatibility layers for any remaining legacy paths

Do NOT proceed if:

- duplicate bootstrap paths remain invisible
- fetch ownership is still disputed

**96.6 Before Retirement**

Must already exist:

- production verification evidence
- rollback safety
- deprecation register entries
- owner approval for each removal target

Do NOT proceed if:

- any replacement path still depends on silent fallbacks
- metrics cannot prove the old path is unused or safe to remove

---

# 97. Validation Matrix & Mandatory Test Coverage

The program must define verification by domain, not only by wave.

Every high-risk migration must pass:

- local verification,
- multi-tenant QA verification,
- runtime certification verification,
- rollout verification,
- and rollback verification where applicable.

Required validation domains:

**97.1 Route Validation**

- canonical routes
- localized routes
- breadcrumb continuity
- deep-link preservation
- redirect correctness

**97.2 SSR / Hydration Validation**

- no shell swaps
- no late identity reveal beyond approved boundaries
- no late cart badge reveal beyond approved boundaries
- no hydration mismatch spikes
- explicit client-only boundary review

**97.3 Tenant Validation**

- host-to-tenant resolution correctness
- invalid host handling
- invalid tenant handling
- missing tenant handling
- suspended tenant behavior
- unpublished storefront behavior

**97.4 Commerce Flow Validation**

- browse-to-product-to-cart
- guest-to-login cart continuity
- logout cart continuity
- password reset continuity
- email verification continuity
- social auth continuity
- checkout handoff continuity

**97.5 Search Validation**

- SSR-compatible search rendering
- autocomplete continuity
- canonical product linking
- filter / sort / pagination continuity
- tenant-aware search propagation

**97.6 Mobile Validation**

- mobile shell continuity
- mobile navigation continuity
- mobile auth visibility
- mobile cart/search continuity

**97.7 Rollback Validation**

- each high-risk toggle must be tested in reverse
- rollback may not rely on undocumented manual fixes

---

# 98. Rollout Controls, Feature Gates & Kill Switches

Progressive rollout is mandatory.

Every high-risk migration must define:

- enablement toggle,
- scope of effect,
- owner,
- rollback action,
- observability signal,
- and tenant / environment eligibility.

Minimum required controllable toggles:

- canonical route redirect layer
- unified shell host bridge
- SSR auth bootstrap
- tenant-scoped auth persistence
- tenant-scoped guest cart persistence
- cart merge logic v2
- canonical search routes
- runtime search entry integration
- runtime commerce interactions on product pages
- legacy compatibility layer retirement

Required rollout pattern:

1. local verification
2. consolidation QA
3. runtime certification
4. internal / allowlisted tenant rollout
5. low-risk production cohort
6. broader production rollout
7. post-rollout verification

Required kill-switch rule:

- disabling a new layer must leave the storefront in a previously verified state, not an undefined mixed state.

---

# 99. Rollback Runbooks & Recovery Procedures

Rollback must be operationally specific.

Each high-risk domain requires a runbook for:

- route rollback
- shell rollback
- auth bootstrap rollback
- persistence rollback
- cart merge rollback
- search rollback
- SSR / hydration rollback

Every rollback runbook must define:

- trigger symptoms
- who decides
- exact toggle actions
- state cleanup steps
- cache invalidation steps
- validation steps after rollback
- whether legacy compatibility layers must be re-enabled

Required rule:

- no migration is complete until its rollback runbook has been written and reviewed.

---

# 100. Observability, Alerting & Production Signals

Metrics alone are insufficient.

The program must define operational visibility before major rollout.

Required observability domains:

**100.1 Route Signals**

- stale route hits
- redirect volume
- redirect loop detection
- deep-link miss rate

**100.2 Shell Signals**

- shell render failures
- shell fallback frequency
- cross-surface navigation continuity errors

**100.3 Auth Signals**

- duplicate bootstrap frequency
- login continuity failures
- logout cleanup failures
- password reset failures
- social auth callback failures
- email verification failures

**100.4 Cart Signals**

- guest cart restoration failures
- merge failures
- cart badge mismatch incidents
- checkout handoff failures

**100.5 Search Signals**

- search request failures
- stale result link hits
- SSR / hydration search mismatch rate

**100.6 Tenant Signals**

- tenant mismatch incidents
- invalid host incidents
- cross-tenant persistence restoration attempts
- unpublished / suspended storefront recovery events

**100.7 Rollout Signals**

- toggle state visibility
- cohort-specific error rates
- rollback trigger thresholds

Alerts must exist for:

- cross-tenant leakage indicators
- auth continuity collapse
- cart loss / merge spikes
- route integrity regressions
- hydration mismatch spikes

---

# 101. Post-Rollout Hypercare & Production Stabilization

Certification is not the end of the migration.

After each high-risk production rollout, the program must enter hypercare.

Hypercare requirements:

- named owners for first-response triage
- elevated monitoring window
- daily review of rollout metrics
- tenant-specific issue tracking
- rollback readiness retained until hypercare closes

Hypercare closes only when:

- rollout metrics are stable
- no unresolved critical tenant leakage risk exists
- no unresolved auth or cart continuity regression exists
- rollback is no longer the preferred recovery path

Final retirement work must not begin until the related hypercare period closes.

---

# 102. Deprecation Register, Sunset Dates & Removal Governance

Legacy retirement requires explicit governance.

Create a deprecation register for every transitional system, including:

- old route families
- temporary redirects
- duplicate shell wrappers
- old auth bootstrap paths
- old persistence keys
- old cart merge logic
- old search client assumptions
- dead DTO transforms
- dead migration proxies

Each register entry must define:

- system name
- current owner
- replacement owner
- verification evidence
- rollback dependency
- sunset target wave
- final removal approval status

Nothing is considered retired merely because new behavior exists.

Retirement requires:

- replacement verification,
- production evidence,
- rollback safety,
- and explicit approval.

---

# 103. Documentation, Runbooks & Support Handover

Implementation readiness requires operational documentation, not only architecture text.

The following artifacts are mandatory before broad production rollout:

- migration log per wave
- compatibility layer inventory
- redirect inventory
- persistence migration map
- rollout checklist
- rollback runbooks
- deprecation register
- architecture diagrams for route / shell / state / SSR ownership
- support handover guide
- production smoke test checklist

Support handover must define:

- who owns rollout decisions
- who owns first-line storefront incidents
- who owns tenant-isolation incidents
- who owns rollback approval

---

# 104. Implementation Readiness Exit Criteria

The program is ready for active implementation only when all of the following are true:

- the program-end boundary is explicit and accepted
- checkout / orders / profile ownership is explicitly classified as in-program legacy-hosted or future runtime-native
- all required compatibility layers are identified with owners
- persistence migration rules are written
- rollout toggles and kill switches are defined
- rollback runbooks are drafted for every high-risk domain
- validation matrices include SSR, hydration, tenant, SEO, mobile, commerce, and rollback coverage
- observability signals and alert thresholds are defined
- deprecation governance exists
- hypercare is part of the rollout lifecycle
- no contradictory future-state language is being used as implementation scope

Only after these criteria are satisfied should broad implementation begin.


@@@@@


# 105. What Backend Evolution Unlocks

Once runtime evolution is completed, the backend becomes capable of powering a true platform storefront architecture instead of merely serving SSR page payloads.

This unlocks the next generation of platform capabilities.

---

## Unified Storefront Runtime

The storefront stops behaving like:

```text
legacy commerce app + runtime renderer
```

and becomes:

```text
single runtime-driven commerce platform
```

Meaning:

* one shell,
* one routing authority,
* one storefront context,
* one runtime contract system,
* one rendering ownership model.

---

## Runtime-Native Commerce

Commerce stops being:

* isolated feature pages.

And becomes:

* embedded storefront infrastructure.

This enables:

* runtime-aware cart visibility,
* runtime-aware account visibility,
* runtime-aware recommendations,
* runtime-aware merchandising,
* runtime-aware pricing,
* runtime-aware personalization.

---

## Merchant-Controlled Storefronts

The runtime eventually becomes:

* merchant-composable infrastructure.

Meaning merchants can eventually control:

* storefront layout composition,
* homepage composition,
* campaign composition,
* navigation composition,
* merchandising placement,
* recommendation placement,
* runtime feature enablement.

Without requiring:

* frontend redeploys.

---

## Progressive Runtime Extensibility

The runtime architecture becomes capable of supporting:

* extension systems,
* plugin systems,
* marketplace systems,
* merchant feature modules,
* enterprise feature tiers,
* rollout-safe capability toggles.

---

## SEO Platform Ownership

The runtime eventually becomes:

* the authoritative SEO orchestration layer.

Supporting:

* canonical ownership,
* hreflang ownership,
* structured data orchestration,
* search metadata,
* product schema,
* campaign SEO,
* merchant SEO overrides.

---

## Runtime Personalization

Future runtime infrastructure can support:

* customer segmentation,
* recommendation engines,
* behavioral merchandising,
* personalized storefront sections,
* dynamic campaigns,
* runtime experimentation.

---

## Runtime-Safe Future Scaling

The runtime architecture becomes scalable for:

* multi-region storefronts,
* large merchant catalogs,
* high-volume traffic,
* runtime caching layers,
* CDN-aware rendering,
* edge rendering evolution,
* future headless channels.

---

# 106. Final Backend Runtime End-State

The final backend runtime should behave like:

```text
A tenant-native commerce orchestration platform.
```

Not merely:

```text
A page resolver.
```

The backend runtime should become responsible for:

* storefront orchestration,
* runtime composition,
* commerce visibility,
* SEO authority,
* shell context,
* capability orchestration,
* merchant storefront configuration,
* search orchestration,
* future personalization infrastructure.

---

# 107. Important Strategic Clarification

The goal is NOT:

```text
"move everything into one gigantic runtime endpoint"
```

That would create:

* unstable payloads,
* excessive coupling,
* scaling problems,
* poor cache behavior.

Instead:

The goal is:

* structured runtime orchestration,
* DTO-governed contracts,
* layered runtime capabilities,
* lightweight shell context,
* progressive commerce awareness.

---

# 108. Final Architectural Principle

The frontend should increasingly become:

```text
A runtime renderer.
```

While the backend increasingly becomes:

```text
The authoritative commerce runtime platform.
```

This preserves:

* SSR consistency,
* tenant safety,
* runtime extensibility,
* cache isolation,
* platform governance,
* future merchant configurability.

---

# 109. Relationship to the Main Consolidation Program

This Backend Runtime Evolution Plan is:

* an extension of the Storefront Commerce Consolidation Program.

It does NOT replace:

* the consolidation roadmap.

Instead:

It defines:

* the next-generation platform evolution after storefront consolidation stabilizes.

Meaning:

Parts 1–7:

* consolidate the storefront architecture.

Part 8:

* evolves the backend runtime into platform-grade commerce infrastructure.

---

# 110. Final Backend Runtime Vision

The final JustShop runtime platform should eventually support:

```text
Multi-tenant commerce
+
runtime-driven storefronts
+
merchant composability
+
runtime-aware commerce
+
SSR-safe orchestration
+
future extensibility
```

inside:

* one coherent runtime platform architecture.

This is the long-term platform direction.

---

## Fully Runtime-Native Storefronts

Including:

- commerce-aware SSR
- personalized storefront rendering
- campaign-aware storefront rendering
- dynamic merchandising

---

## Advanced Merchant Experiences

Including:

- merchant storefront composition
- merchant runtime extensions
- configurable commerce experiences

---

## Future Marketplace Capabilities

Including:

- runtime extension systems
- merchant plugins
- app ecosystems
- dynamic storefront capabilities

---

# 106. Final Strategic Truth

The frontend consolidation program solves:
- storefront coherence.

The backend runtime evolution program solves:
- platform intelligence.

Together,
these programs transform JustShop from:

```text
A migrated Nuxt storefront
```

into:

```text
A true runtime-driven commerce platform
```

---

# 107. Final End-State Summary

After backend runtime evolution succeeds,
JustShop should provide:

- runtime-native commerce rendering
- unified storefront orchestration
- runtime-aware commerce visibility
- runtime-aware search
- runtime-aware checkout
- merchant-configurable runtime composition
- extensible runtime capabilities
- tenant-native commerce infrastructure

At that point,
JustShop stops behaving like:
- a storefront consuming APIs.

And starts behaving like:
- a real commerce runtime platform.


Here's the complete consolidated markdown file, including the original Parts 1–3 (Phases 0–12) **and** the newly provided **Part 10 — Merchant CMS & Theme Runtime Expansion**.

```markdown
# JustShop Storefront Commerce Consolidation Program

## Executive Architecture & Phase Plan (Part 1)

---

### 1. Program Name

**JustShop Storefront Commerce Consolidation Program**

This program follows the previously completed:

**«Storefront Runtime Integration Program»**

The runtime program established:

- multi-tenant runtime rendering,
- SSR storefront infrastructure,
- runtime contracts,
- DTO-driven sections,
- tenant-safe cache isolation,
- and Laravel-driven page resolution.

This consolidation program transforms that runtime foundation into a coherent commerce storefront experience.

---

### 2. Program Goal

Transform the storefront from:

**«a hybrid runtime + legacy commerce application»**

into:

**«a unified, SSR-aware, tenant-safe commerce storefront platform.»**

The goal is **NOT**:

- Shopify feature parity,
- checkout replatforming,
- or a full commerce rewrite.

The goal **IS**:

- storefront continuity,
- commerce cohesion,
- canonical routing,
- unified shell behavior,
- SSR-aware customer state,
- and runtime-native commerce integration.

---

### 3. Current State Summary

The storefront currently operates as two partially connected systems.

**Runtime system** owns:

- catalog rendering,
- category pages,
- product pages,
- marketing pages,
- navigation payloads,
- theme payloads,
- runtime SSR rendering.

**Legacy commerce system** owns:

- authentication,
- cart,
- orders,
- profile,
- search,
- checkout outcomes,
- customer session behavior.

These systems currently:

- use different shells,
- use different routing assumptions,
- use different state ownership boundaries,
- and expose inconsistent customer experiences.

The storefront therefore behaves like:

- a completed runtime infrastructure layer,
- but an incomplete commerce application layer.

---

### 4. Desired End State

After this program:

The storefront must behave as **ONE application**.

Users must not perceive:

- runtime pages,
- legacy pages,
- or shell transitions.

The storefront must provide:

**Unified application shell**

- one header system,
- one footer system,
- one navigation model,
- one locale experience,
- one customer identity experience,
- one cart visibility model.

**Canonical storefront routing**

- one product URL structure,
- one shop URL structure,
- one navigation contract,
- one route ownership model.

**Runtime-aware commerce**

- runtime pages understand auth state,
- runtime pages understand cart state,
- runtime shell exposes commerce capabilities,
- runtime rendering becomes the real storefront foundation.

**SSR-aware customer experience**

- SSR-safe auth hydration,
- SSR-safe cart awareness,
- SSR-safe shell rendering,
- minimized hydration flashes.

**Tenant-safe client persistence**

- tenant-scoped auth persistence,
- tenant-scoped cart persistence,
- tenant-scoped locale persistence,
- tenant-safe commerce continuity.

**Unified storefront architecture**

- normalized API layers,
- normalized DTO contracts,
- normalized runtime/commerce boundaries,
- reduced legacy compatibility drift.

---

### 5. Explicit Non-Goals

The following are **OUTSIDE** this program.

**Not included**

- Checkout replatforming (remains legacy-owned unless explicitly approved later)
- Full auth rewrite (existing flows should be consolidated, not rewritten from scratch)
- Marketplace ecosystem (no plugin/app ecosystem work)
- Theme editor (no visual merchant theme builder)
- Subscription commerce
- Advanced personalization
- Headless mobile app platform
- Full GraphQL migration
- Full frontend rewrite (forbidden)

---

### 6. Architectural Principles

**Principle 1 — Runtime becomes the storefront foundation**

The runtime is no longer “catalog-only infrastructure.” It becomes:

- the canonical storefront rendering layer,
- and the canonical storefront shell owner.

**Principle 2 — Commerce capabilities integrate INTO runtime**

Auth/cart/search/profile/order awareness must integrate into:

- runtime shell,
- runtime navigation,
- runtime rendering contracts.

The runtime must not remain commerce-blind.

**Principle 3 — One canonical route system**

The storefront may not expose:

- multiple product route patterns,
- multiple shop route assumptions,
- or multiple navigation truths.

All route generation must derive from:

- one canonical storefront route contract.

**Principle 4 — One shell system**

There must not be:

- runtime shell,
- auth shell,
- legacy shell,
- standalone shell families.

The storefront shell becomes:

- composable,
- runtime-aware,
- auth-aware,
- cart-aware,
- locale-aware,
- tenant-aware.

**Principle 5 — SSR-first storefront behavior**

Critical storefront UX must not depend on:

- client-only hydration,
- localStorage bootstrap,
- or post-mount identity fetches.

SSR ownership must expand to:

- customer shell state,
- cart visibility,
- navigation continuity,
- runtime commerce awareness.

**Principle 6 — Tenant safety everywhere**

Every persistence layer must become tenant-aware. Includes:

- cookies,
- localStorage,
- cache keys,
- auth persistence,
- cart persistence,
- locale persistence.

**Principle 7 — Consolidation before expansion**

The platform must consolidate routing, shell behavior, state ownership, and API boundaries **BEFORE** adding new commerce features, personalization, subscriptions, advanced search, or AI commerce layers.

---

### 7. Major Program Streams

| Stream | Goal |
|--------|------|
| A | Route Consolidation |
| B | Unified Storefront Shell |
| C | Auth & Session Consolidation |
| D | Cart Consolidation |
| E | Search Consolidation |
| F | Runtime Commerce Parity |
| G | API & State Normalization |
| H | Legacy Surface Retirement |

---

### 8. Phase Structure

| Phase | Goal |
|-------|------|
| 0 | Program Guardrails & Canonical Contracts |
| 1 | Route Consolidation |
| 2 | Unified Shell Architecture |
| 3 | Auth & Session SSR Consolidation |
| 4 | Cart Consolidation |
| 5 | Search Consolidation |
| 6 | Runtime Commerce Capability Parity |
| 7 | API / State Normalization |
| 8 | Legacy Surface Retirement |
| 9 | Certification & Production Readiness |

---

### 9. Phase 0 — Program Guardrails & Canonical Contracts

**Goal**

Prevent further architectural drift before consolidation begins. This phase freezes route ownership, shell ownership, runtime ownership, state ownership, and storefront contracts. No new storefront features may be added before Phase 0 closes.

**Required Deliverables**

**9.1 Canonical Route Contract** – Create authoritative storefront route definitions. Must define: home, shop, category, product, cart, login, profile, orders, search, checkout return flows. All route builders must consume one shared contract source. Hardcoded storefront URLs become forbidden.

**9.2 Storefront Shell Ownership Document** – Define shell composition rules, layout ownership, header/footer ownership, runtime shell boundaries, auth/cart/search injection boundaries. Must explicitly declare which shell survives long-term and which become deprecated.

**9.3 Storefront State Ownership Matrix** – Document ownership for auth, user, cart, locale, tenant, theme, navigation, filters, search state. Every state domain must have one owner, one persistence strategy, one SSR strategy.

**9.4 Tenant Persistence Specification** – Define tenant-safe cookie naming, tenant-safe localStorage naming, tenant-safe cache namespacing. Global persistence keys become forbidden.

**9.5 Runtime Commerce Integration Specification** – Define how runtime pages consume auth state, cart state, locale state, search entry points, customer shell state. Runtime pages must stop being commerce-blind.

**Exit Criteria**

Phase 0 closes only when canonical route contracts exist, shell ownership is frozen, state ownership is frozen, persistence standards are frozen, runtime commerce integration contracts are frozen. No implementation migrations yet. This phase is architecture stabilization only.

---

### 10. Phase 1 — Route Consolidation

**Goal**

Eliminate competing storefront route systems. The storefront must expose one canonical URL model, one navigation truth, one route-generation mechanism.

**Current Problems Being Solved**

Current storefront problems include: "/products", "/shop", "/products/:slug", "/products/product/:slug" coexisting simultaneously. Search, cart, breadcrumbs, runtime rendering, and navigation currently disagree on route ownership.

**Required Deliverables**

**10.1 Canonical Route Model Implementation** – Implement authoritative route generators for storefront home, shop, category, product, cart, login/register, profile, orders, search, checkout returns. All storefront links must consume canonical route builders only.

**10.2 Runtime Route Alignment** – Align runtime backend route resolution, frontend route helpers, search result links, cart item links, breadcrumb links, navigation links. No stale route shapes may remain.

**10.3 Legacy Route Compatibility Layer** – Temporary compatibility redirects may exist only during migration, must be explicitly documented, include sunset dates, and decommission ownership.

**10.4 Navigation Normalization** – Unify runtime navigation, legacy header navigation, breadcrumbs, mobile navigation assumptions. Navigation must derive from one route contract system.

**Forbidden During Phase 1**

- No checkout migration
- No auth rewrite
- No new marketing features
- No new runtime section types

Focus only: routing, navigation, canonical URL ownership.

**Exit Criteria**

Phase 1 closes only when stale product route patterns are removed, runtime and legacy navigation agree, search/cart/orders link correctly, breadcrumbs are canonical, one storefront route system exists.

---

### 11. Phase 2 — Unified Storefront Shell Architecture

**Goal**

Eliminate storefront shell fragmentation. The storefront must stop behaving like multiple independent applications.

**Current Problems Being Solved**

Current storefront shell fragmentation includes runtime shell, legacy shell, auth shell, standalone shell pages with different headers, footers, navigation systems, and customer affordances.

**Required Deliverables**

**11.1 Unified Header System** – Create one storefront header architecture supporting runtime navigation, customer auth state, cart visibility, search entry, locale switching, tenant branding, mobile navigation, responsive layouts. Runtime pages and legacy commerce pages must use the same header system.

**11.2 Unified Footer System** – Create one storefront footer architecture supporting runtime navigation payloads, tenant branding, storefront informational links, locale awareness.

**11.3 Unified Layout Composition** – Replace competing layout families with one composable storefront shell system. Layouts may vary visually, but shell ownership must remain unified.

**11.4 Runtime Shell Commerce Awareness** – Runtime shell must consume auth state, cart state, customer visibility, locale visibility, search visibility. The runtime shell may no longer behave as a content-only renderer.

**11.5 Mobile Navigation Consolidation** – Unify runtime mobile navigation, legacy mobile navigation, account entry points, cart entry points, search entry points.

**Exit Criteria**

Phase 2 closes only when shell transitions disappear, runtime and legacy pages share one shell family, auth/cart/search visibility is consistent, mobile navigation is unified, storefront continuity exists across page families.

---

# JustShop Storefront Commerce Consolidation Program

## Execution Plan (Part 2)

---

### 12. Phase 3 — Auth & Session SSR Consolidation

**Goal**

Transform authentication and customer identity from partially client-hydrated legacy behavior into SSR-aware storefront identity infrastructure. This phase does **not** replace authentication. It consolidates auth ownership, session hydration, customer visibility, and storefront identity continuity.

**Current Problems Being Solved**

Current auth problems include: runtime pages are auth-blind, public pages SSR without customer identity, identity appears after hydration, duplicate user-fetch paths exist, auth shell is detached from storefront shell, Google auth is partially isolated, password reset flow is incomplete, cart/auth coupling is fragile, token persistence is not tenant-aware.

**Required Deliverables**

**12.1 Canonical Auth Bootstrap Flow** – Create one authoritative storefront auth bootstrap lifecycle. The storefront may not fetch user state from multiple unrelated locations, bootstrap auth differently per page family, or rely on scattered middleware logic.

**12.2 SSR-Aware Customer Hydration** – Customer identity must become SSR-aware. SSR storefront rendering must reliably know whether the customer is authenticated, basic customer shell state, customer navigation visibility, account/cart visibility. This does not require full customer profile SSR hydration, but does require shell-level customer continuity during SSR.

**12.3 Runtime Shell Auth Integration** – Runtime shell must expose authenticated navigation, account entry points, login/register visibility, customer state visibility. Runtime pages may no longer appear anonymous while the customer is authenticated elsewhere.

**12.4 Tenant-Scoped Auth Persistence** – Replace global auth persistence assumptions. Auth persistence must become tenant-safe, including cookie naming, persistence ownership, auth restoration logic, logout behavior. Cross-tenant auth leakage risks must be eliminated.

**12.5 Password Recovery Completion** – Complete missing storefront auth recovery flows including forgot-password page, reset-password page, consistent redirect behavior, storefront shell integration.

**12.6 Google/Social Auth Consolidation** – Normalize redirect flow ownership, callback handling, auth bootstrap behavior, post-login customer continuity. Social auth must behave like the normal storefront auth lifecycle, not a parallel implementation path.

**12.7 Auth Middleware Normalization** – Normalize guest middleware, auth middleware, redirect behavior, runtime page auth awareness.

**Forbidden During Phase 3**

- No auth provider replacement
- No backend auth rewrite
- No checkout auth redesign
- No OAuth provider expansion

Focus only: storefront auth continuity, SSR identity, runtime awareness, tenant-safe persistence.

**Exit Criteria**

Phase 3 closes only when runtime shell understands customer identity, auth hydration flashes are minimized, storefront identity is SSR-aware, auth persistence is tenant-safe, password recovery exists, social auth is normalized, duplicate auth bootstrap paths are removed.

---

### 13. Phase 4 — Cart Consolidation

**Goal**

Transform the cart from partially client-only legacy behavior into a storefront-wide commerce state system. The cart must become shell-aware, runtime-aware, tenant-safe, SSR-compatible where appropriate, and globally reliable.

**Current Problems Being Solved**

Current cart problems include: runtime shell has no cart visibility, runtime product detail lacks commerce behavior, guest cart is global across tenants, cart hydration is client-only, cart page is hydration-gated, cart merge behavior is fragile, guest/server cart models diverge, no storefront-wide cart continuity exists.

**Required Deliverables**

**13.1 Canonical Cart Ownership Model** – Define authoritative cart source of truth, guest cart ownership, authenticated cart ownership, cart persistence boundaries, cart synchronization lifecycle. Cart ownership may not remain implicit.

**13.2 Runtime Cart Awareness** – Runtime shell must expose cart badge, cart entry point, cart visibility, cart continuity. Runtime pages must stop behaving like commerce-disconnected content pages.

**13.3 Runtime Product Commerce Integration** – Runtime product rendering must support add-to-cart behavior, cart feedback, product purchase continuity, commerce-aware product interactions. The storefront may not expose runtime product pages without commerce capability.

**13.4 Tenant-Scoped Cart Persistence** – Replace global guest cart persistence. Guest cart storage must become tenant-aware, including localStorage keys, merge behavior, cart restoration logic, logout behavior.

**13.5 SSR-Compatible Cart Visibility** – The storefront shell must support SSR-aware cart visibility. This does not require full guest cart SSR rendering, but does require stable shell-level cart continuity.

**13.6 Cart Merge Hardening** – Normalize guest-to-authenticated merge, partial failure handling, retry behavior, stale item handling, inventory mismatch handling. Silent merge failure patterns become forbidden.

**13.7 Cart UI Consolidation** – Normalize cart badge, cart interactions, cart loading states, empty cart states, cart feedback UX.

**Forbidden During Phase 4**

- No checkout rewrite
- No order pipeline redesign
- No inventory engine redesign
- No multi-cart experimentation

Focus only: storefront cart continuity, runtime integration, persistence safety, commerce UX cohesion.

**Exit Criteria**

Phase 4 closes only when runtime pages expose cart continuity, runtime products support commerce actions, cart persistence is tenant-safe, shell cart behavior is unified, cart hydration instability is minimized, guest merge reliability is hardened.

---

### 14. Phase 5 — Search Consolidation

**Goal**

Integrate search into the storefront runtime architecture. Search must stop behaving like an isolated client-only legacy subsystem.

**Current Problems Being Solved**

Current search problems include: runtime shell has no search, search is client-only, GraphQL bypasses runtime infrastructure, search links use stale routes, no SSR search ownership exists, no canonical search contract exists, autocomplete is isolated from storefront state.

**Required Deliverables**

**14.1 Canonical Search Route Ownership** – Define storefront search route ownership, search URL contracts, search query normalization, canonical search parameter handling.

**14.2 Unified Search Entry System** – Search entry points must become unified across runtime pages, legacy pages, desktop navigation, mobile navigation.

**14.3 Runtime Search Integration** – Runtime shell must expose search access, search continuity, runtime-aware navigation behavior.

**14.4 Search Route Canonicalization** – All search results must link to canonical storefront product routes. Stale route shapes become forbidden.

**14.5 SSR-Aware Search Rendering** – Search pages must support SSR-compatible rendering behavior. This does not require fully server-rendered instant search, but does require SEO-compatible search page ownership, predictable rendering lifecycle, reduced client-only dependence.

**14.6 Search Client Normalization** – Normalize GraphQL ownership, fetch ownership, tenant propagation, auth propagation, error handling, caching behavior.

**14.7 Search UX Consolidation** – Normalize autocomplete behavior, mobile search, loading states, empty states, search transitions, storefront continuity.

**Forbidden During Phase 5**

- No Elasticsearch migration
- No Algolia migration
- No AI search
- No recommendation engine
- No semantic/vector search

Focus only: storefront integration, routing correctness, SSR compatibility, runtime continuity.

**Exit Criteria**

Phase 5 closes only when runtime shell exposes search, search routes are canonical, stale search product links are removed, search rendering is SSR-compatible, search behaves consistently across storefront surfaces.

---

### 15. Phase 6 — Runtime Commerce Capability Parity

**Goal**

Expand runtime rendering from content/catalog rendering into commerce-capable storefront rendering. This phase upgrades runtime pages from presentation-only to storefront-capable commerce surfaces.

**Current Problems Being Solved**

Current runtime gaps include: product detail is commerce-light, abandoned richer product components exist outside runtime, runtime rendering does not own enough commerce capability, runtime shell lacks storefront parity, legacy commerce components remain partially stranded.

**Required Deliverables**

**15.1 Runtime Product Detail Consolidation** – Create canonical runtime product rendering behavior. Runtime product pages must support commerce interactions, pricing continuity, inventory visibility, cart integration, customer continuity.

**15.2 Runtime Commerce Section Expansion** – Normalize runtime section capability for richer product rendering, richer category rendering, merchandising continuity, storefront commerce interactions.

**15.3 Legacy Commerce Component Integration Audit** – Audit and consolidate reusable commerce components, abandoned runtime-compatible components, duplicate product rendering systems. The storefront may not maintain parallel product-detail architectures long-term.

**15.4 Runtime Shell Capability Expansion** – Runtime shell must become capable of acting as the primary storefront shell, not merely a runtime content wrapper.

**15.5 Commerce UX Consistency Pass** – Normalize loading states, empty states, product interactions, navigation transitions, runtime rendering continuity, mobile runtime behavior.

**Forbidden During Phase 6**

- No checkout migration
- No subscription commerce
- No personalization engine
- No recommendation engine
- No merchant visual editor

Focus only: runtime storefront maturity, commerce parity, storefront continuity.

**Exit Criteria**

Phase 6 closes only when runtime product pages are commerce-capable, abandoned product architectures are consolidated, runtime rendering behaves like a real storefront layer, runtime shell achieves storefront parity.

---

### 16. Phase 7 — API & State Normalization

**Goal**

Normalize fragmented storefront integration layers. The storefront must stop operating through partially disconnected API systems, duplicated state ownership, and fragmented client models.

**Current Problems Being Solved**

Current fragmentation includes: REST proxy, runtime proxy, Apollo GraphQL, browser redirect auth, duplicated user bootstrap, duplicated route assumptions, mixed DTO standards, mixed fetch ownership.

**Required Deliverables**

**16.1 Storefront API Ownership Matrix** – Define authoritative ownership for runtime APIs, commerce APIs, GraphQL APIs, auth APIs, cart APIs, search APIs.

**16.2 Unified Storefront Fetch Standards** – Normalize error handling, auth injection, tenant propagation, locale propagation, DTO transformation, retry behavior, SSR behavior.

**16.3 DTO Contract Consolidation** – Normalize storefront DTO standards. The storefront may not maintain drifting response contracts, mixed route assumptions, or inconsistent transformation logic.

**16.4 State Ownership Consolidation** – Reduce overlapping ownership, duplicated hydration logic, disconnected shell/runtime state. Every storefront state domain must have one owner, one lifecycle, one persistence boundary.

**16.5 Runtime Waterfall Reduction** – Reduce unnecessary runtime fetches, repeated navigation payload requests, duplicated shell fetch behavior. Promote app-shell-aware storefront state.

**16.6 Error Handling Normalization** – Normalize storefront errors, auth errors, cart errors, search errors, runtime fetch failures, runtime fallback behavior.

**Forbidden During Phase 7**

- No backend service decomposition
- No microservice migration
- No frontend framework migration
- No GraphQL-first rewrite

Focus only: storefront consistency, ownership clarity, normalization, stability.

**Exit Criteria**

Phase 7 closes only when storefront API ownership is clear, DTO drift is reduced, duplicated state ownership is removed, storefront fetch behavior is normalized, runtime waterfalls are reduced.

---

# JustShop Storefront Commerce Consolidation Program

## Execution Plan (Part 3)

---

### 17. Phase 8 — Tenant Isolation Hardening

**Goal**

Eliminate cross-tenant storefront leakage risks. The storefront must evolve from backend-safe but frontend-optimistic tenancy into end-to-end tenant-safe storefront behavior. This phase hardens persistence, identity, cart state, routing assumptions, runtime awareness, and storefront isolation boundaries.

**Current Problems Being Solved**

Current tenant risks include: global guest cart persistence, global auth persistence, locale preference leakage, optimistic tenant bootstrap behavior, runtime shell assuming active tenant before backend validation, Apollo requests missing explicit storefront tenant propagation, shell continuity crossing tenant boundaries.

**Required Deliverables**

**17.1 Tenant-Scoped Client Persistence** – All storefront persistence must become tenant-aware, including auth persistence, guest cart persistence, storefront preferences, locale persistence where appropriate, client-side commerce continuity. Global browser persistence assumptions become forbidden.

**17.2 Tenant Validation Hardening** – Frontend tenant bootstrap must become authoritative-aware. The storefront may not confidently initialize tenant shell state before backend runtime validation confirms tenant validity.

**17.3 Tenant-Aware Runtime Recovery** – Normalize invalid tenant handling, missing tenant handling, suspended tenant behavior, unpublished storefront behavior, tenant recovery UX.

**17.4 Tenant-Aware Search Isolation** – Search requests must become explicitly tenant-aware. Search isolation may not depend solely on deployment topology, implicit backend assumptions, or host-level coincidence.

**17.5 Tenant-Safe Auth Behavior** – Normalize login continuity, logout behavior, token restoration, customer state ownership, cross-tenant session handling.

**17.6 Tenant-Safe Cart Ownership** – Normalize guest cart boundaries, authenticated cart continuity, cart merge ownership, cart restoration behavior across storefronts.

**17.7 Tenant Isolation Verification Suite** – Expand storefront verification coverage for auth isolation, cart isolation, locale isolation, runtime isolation, persistence isolation, invalid tenant recovery.

**Forbidden During Phase 8**

- No multi-store customer federation
- No shared-cart commerce experiments
- No tenant marketplace layer
- No cross-store customer identity unification

Focus only: storefront isolation correctness, tenant-safe persistence, isolation reliability.

**Exit Criteria**

Phase 8 closes only when storefront persistence is tenant-aware, optimistic tenant leakage is removed, search explicitly propagates tenant identity, auth/cart continuity is tenant-safe, tenant isolation verification coverage exists.

---

### 18. Phase 9 — SSR & Hydration Stabilization

**Goal**

Stabilize storefront rendering behavior across SSR, hydration, runtime rendering, legacy commerce rendering, and shell continuity. This phase reduces hydration flashes, shell instability, rendering inconsistencies, and client-only storefront dependence.

**Current Problems Being Solved**

Current SSR/hydration problems include: auth flashes after hydration, cart badge hydration-only rendering, client-only search results, cart hydration gating, duplicate auth fetches, runtime shell swaps, theme overrides after hydration, runtime vs legacy rendering inconsistencies.

**Required Deliverables**

**18.1 Storefront SSR Ownership Matrix** – Define authoritative SSR ownership for auth state, cart shell state, runtime rendering, search rendering, navigation rendering, storefront shell state.

**18.2 Hydration Flash Reduction** – Minimize identity flashes, cart flashes, theme flashes, shell swaps, late storefront state replacement.

**18.3 Runtime & Legacy Shell Transition Stabilization** – Normalize transitions between runtime pages, legacy commerce pages, auth pages, standalone flows. The storefront must stop feeling like multiple unrelated applications stitched together.

**18.4 Cart Rendering Stabilization** – Reduce client-only cart gating, hydration skeleton replacement behavior, unstable cart rendering ownership.

**18.5 Search Rendering Stabilization** – Reduce fully client-only search rendering, autocomplete instability, mount-only rendering dependence.

**18.6 Duplicate Fetch Elimination** – Reduce repeated auth fetches, repeated navigation fetches, duplicated shell bootstrapping, duplicated storefront initialization behavior.

**18.7 Head & Theme Stabilization** – Normalize theme ownership, runtime theme injection, meta handling, storefront head management.

**Forbidden During Phase 9**

- No partial hydration experiments
- No islands architecture migration
- No streaming SSR redesign
- No frontend rendering framework replacement

Focus only: storefront rendering stability, SSR continuity, hydration reliability.

**Exit Criteria**

Phase 9 closes only when storefront hydration flashes are minimized, shell transitions feel unified, duplicate initialization behavior is reduced, storefront SSR ownership is stable.

---

### 19. Phase 10 — Performance & Runtime Optimization

**Goal**

Optimize storefront runtime behavior after architectural consolidation is complete. This phase is intentionally late. Performance optimization before consolidation would optimize duplicated systems, fragmented fetches, and unstable ownership.

**Current Problems Being Solved**

Current performance issues include: runtime request waterfalls, repeated navigation loading, duplicated shell rendering, client-heavy commerce flows, excessive hydration work, repeated storefront bootstrap behavior, sequential guest cart merging, no autocomplete caching.

**Required Deliverables**

**19.1 Runtime Waterfall Reduction** – Reduce runtime resolve/page/navigation/theme waterfalls, duplicated storefront shell fetches, repeated runtime context loading.

**19.2 App Shell State Promotion** – Promote stable storefront shell data into reusable app-level state ownership, including navigation, tenant shell context, theme continuity, storefront metadata where appropriate.

**19.3 Client Fetch Reduction** – Reduce unnecessary post-mount fetches, duplicated bootstrap calls, repeated storefront initialization behavior.

**19.4 Search Optimization** – Improve autocomplete efficiency, repeated query handling, search transition performance, storefront search responsiveness.

**19.5 Cart Operation Optimization** – Improve guest merge efficiency, cart synchronization performance, cart restoration behavior, redundant cart refreshes.

**19.6 Runtime Rendering Efficiency** – Reduce duplicated layout wrappers, redundant shell rendering, unnecessary runtime rendering overhead.

**19.7 Logging & Debug Noise Reduction** – Normalize storefront logging verbosity, development runtime diagnostics, request spam, production-safe observability behavior.

**Forbidden During Phase 10**

- No premature micro-optimizations
- No CDN architecture redesign
- No backend infrastructure migration
- No speculative caching systems

Focus only: storefront runtime efficiency, rendering performance, runtime stability.

**Exit Criteria**

Phase 10 closes only when runtime waterfalls are reduced, storefront shell fetch duplication is minimized, client-heavy rendering paths are reduced, storefront runtime behavior is measurably more efficient.

---

### 20. Phase 11 — Legacy Surface Retirement

**Goal**

Retire transitional storefront architecture safely. This phase removes migration remnants, dead compatibility layers, abandoned runtime experiments, stale routing assumptions, duplicated storefront systems. This phase only begins after runtime storefront capability is stable.

**Current Problems Being Solved**

Current debt includes: duplicate layouts, stale route constants, abandoned product-detail implementations, unused composables, legacy compatibility redirects, fragmented shell systems, dead runtime migration remnants.

**Required Deliverables**

**20.1 Legacy Route Retirement Audit** – Retire stale route patterns, transitional redirects, obsolete storefront path assumptions. The storefront must end with one canonical route system.

**20.2 Shell System Consolidation** – Reduce storefront shell ownership to one primary storefront shell architecture. Retire redundant wrappers, transitional shell duplication, abandoned auth shell behavior.

**20.3 Product Architecture Cleanup** – Retire abandoned product rendering systems, duplicate product detail implementations, orphaned catalog rendering remnants.

**20.4 Unused API Surface Retirement** – Audit and retire unused Nitro routes, dead compatibility endpoints, obsolete migration proxies.

**20.5 State & Composable Cleanup** – Remove dead composables, duplicated ownership patterns, obsolete storefront migration utilities.

**20.6 Runtime Registry Cleanup** – Normalize runtime section registration, section ownership, storefront rendering registry clarity.

**20.7 Documentation & Architecture Refresh** – Update storefront architecture documentation, runtime ownership documentation, commerce ownership boundaries, SSR ownership rules, routing contracts.

**Forbidden During Phase 11**

- No large behavioral rewrites
- No opportunistic feature additions
- No unstable cleanup without verification
- No deletion without ownership confirmation

Focus only: safe retirement, consolidation, architectural clarity.

**Exit Criteria**

Phase 11 closes only when one canonical route system exists, storefront shell duplication is reduced, abandoned runtime remnants are removed, obsolete compatibility layers are retired, storefront ownership is clearer and simpler.

---

### 21. Phase 12 — Storefront Certification & Rollout

**Goal**

Certify the storefront as a cohesive commerce platform, not a transitional hybrid runtime migration. This phase validates stability, tenant isolation, storefront continuity, commerce flows, SSR behavior, and rollout readiness.

**Required Deliverables**

**21.1 Storefront Commerce Verification Suite** – Expand verification coverage for auth, cart, search, routing, runtime rendering, shell continuity, tenant isolation, hydration stability.

**21.2 End-to-End Storefront Flow Validation** – Validate browse-to-cart, login continuity, guest-to-authenticated transitions, search-to-product flow, runtime-to-commerce flow continuity, locale continuity, shell continuity.

**21.3 Tenant Isolation Certification** – Verify persistence isolation, auth isolation, cart isolation, runtime cache isolation, search isolation.

**21.4 SSR & Hydration Certification** – Verify shell continuity, hydration stability, rendering ownership, storefront SSR consistency.

**21.5 Rollout Controls** – Provide rollout gates, feature controls, rollback capability, storefront fallback strategies.

**21.6 Operational Readiness** – Prepare storefront monitoring, runtime diagnostics, error visibility, storefront observability.

**21.7 Final Architectural Audit** – Perform ownership verification, route verification, storefront shell verification, API ownership verification, commerce continuity verification.

**Exit Criteria**

The consolidation program completes only when:

- storefront routing is unified,
- storefront shell continuity is unified,
- runtime rendering is commerce-capable,
- auth/cart/search behave consistently,
- storefront persistence is tenant-safe,
- runtime and legacy fragmentation are reduced,
- storefront SSR behavior is stable,
- storefront UX feels cohesive,
- and the storefront behaves like **one commerce platform**, not multiple stitched systems.

---

### 22. Final Program Outcome

**What This Program Produces**

After all phases complete, JustShop storefront becomes: a unified multi-tenant commerce storefront, runtime-driven, SSR-capable, commerce-aware, tenant-safe, and operationally cohesive.

**What Will Exist After Completion**

The storefront will have:

- **Unified storefront shell** – including auth visibility, cart visibility, search, locale switching, runtime continuity, stable navigation.
- **Unified routing system** – including canonical product routes, canonical shop routes, canonical search routes, runtime-owned storefront navigation.
- **Runtime commerce capability** – including runtime-aware product detail, runtime-aware commerce interactions, cart continuity, storefront parity.
- **SSR-aware storefront identity** – including customer continuity, stable auth hydration, stable cart visibility, reduced client-only dependence.
- **Tenant-safe storefront persistence** – including auth isolation, cart isolation, storefront continuity isolation, tenant-aware browser persistence.
- **Consolidated storefront architecture** – including reduced duplication, normalized API ownership, reduced migration remnants, reduced shell fragmentation.

---

### 23. What This Program Does NOT Yet Produce

Even after full completion, this is still **NOT** yet:

- full Shopify parity,
- full headless commerce operating system,
- visual merchant site builder,
- live merchant theme editor,
- advanced CMS experience builder,
- app ecosystem,
- plugin marketplace,
- subscription commerce engine,
- AI personalization platform,
- advanced merchandising engine,
- omnichannel commerce suite.

---

### 24. What Comes AFTER This Program

After consolidation completes successfully, the platform becomes ready for future programs like:

- **Merchant Theme Studio** – Visual merchant theming and live editing.
- **Runtime Checkout Migration** – Moving checkout into the unified runtime architecture.
- **Runtime Customer Account Area** – Orders/profile/wishlist inside runtime rendering.
- **Runtime Search Platform** – Advanced search architecture.
- **Merchant CMS Experience Builder** – Composable merchant-managed landing experiences.
- **Marketplace Extensions** – Plugin/app ecosystem.
- **Advanced Commerce Features** – Subscriptions, bundles, personalization, recommendations, loyalty systems.

---

### 25. Final Reality Statement

This program is not "building Shopify."

This program is transforming the current hybrid storefront into a stable, unified commerce platform foundation.

Right now, the storefront is runtime-rendered in some areas, legacy-driven in others, and fragmented at the shell, routing, state, and commerce layers.

After this program, the storefront becomes operationally cohesive, technically unified, commerce-capable, tenant-safe, and ready for future platform evolution.

That foundation is what makes future Shopify-level platform capabilities realistically possible.

---

# JustShop Storefront Commerce Consolidation Program

## Part 10 — Merchant CMS & Theme Runtime Expansion

---

### 120. Purpose of This Document

Parts 1–9 transformed JustShop from:

- A fragmented storefront application

into:

- A runtime-driven commerce platform architecture

**Part 10 defines the next evolution: Merchant-Operable Storefront Infrastructure**

This is the layer where:

- merchants control storefront composition,
- merchants configure experiences,
- merchants manage campaigns,
- merchants customize themes,
- merchants orchestrate content,
- and the storefront evolves into a configurable commerce operating system.

This document defines:

- the merchant CMS strategy,
- runtime theme architecture,
- visual composition systems,
- runtime extensibility,
- merchant experience tooling,
- and future storefront ecosystem capabilities.

---

### 121. Strategic Goal

The final goal is **NOT** merely:

- A CMS

The goal is:

- **A Merchant Runtime Experience Platform**

Meaning:

Merchants can shape storefront behavior, orchestrate commerce experiences, compose landing pages, manage themes, customize sections, control merchandising, and extend storefront functionality, **without engineering intervention**.

---

### 122. Current Merchant Experience Reality

The current runtime already supports:

- runtime-rendered pages,
- marketing pages,
- runtime sections,
- theme payloads,
- navigation payloads,
- SSR storefront rendering.

But merchant control remains limited.

Today:

- runtime composition is still engineering-defined,
- sections are static,
- themes are mostly config-driven,
- page composition is backend-owned,
- storefront extensibility is minimal.

Meaning:

The platform currently behaves like:

- An engineering-controlled storefront runtime

not:

- A merchant-operable commerce platform

---

### 123. Current Merchant Platform Limitations

**Limitation A — Section Registry Is Static**

Runtime sections are registered in frontend code. Merchants cannot reorder arbitrary sections, configure section behavior deeply, install new section types, or compose advanced layouts.

**Limitation B — Theme System Is Thin**

Current theme payloads mainly support colors, radius, typography direction, branding basics. Missing component theming, merchant theme presets, layout customization, visual storefront systems.

**Limitation C — No Visual Composition Layer**

Current page composition is DTO-driven, backend-generated, engineering-oriented. There is no visual editor, merchant preview workflow, live composition interface, or layout builder.

**Limitation D — No Merchant Runtime Extensions**

Merchants cannot extend storefront capabilities, install runtime features, attach custom storefront logic, or enable storefront plugins.

**Limitation E — CMS Is Content-Oriented Only**

Current CMS capabilities are mostly marketing-page rendering, not commerce experience orchestration.

---

### 124. Strategic Merchant Platform Vision

The final merchant platform should support:

**Runtime-Composable Storefronts**

Merchants should compose storefronts using sections, layouts, blocks, commerce widgets, and merchandising widgets.

**Themeable Commerce Experiences**

Merchants should control storefront identity, storefront visuals, typography, layout systems, spacing systems, and merchandising presentation.

**Visual Storefront Editing**

Merchants should eventually visually edit storefronts, preview changes, publish safely, rollback changes, and schedule campaigns.

**Extensible Runtime Infrastructure**

The storefront should eventually support extensions, plugins, apps, and custom runtime capabilities.

---

### 125. Final Merchant Experience Vision

The final merchant experience should behave like:

- Shopify Themes
- Shopify Sections
- Shopify CMS
- Shopify Online Store
- Storefront Extensions

But:

- runtime-native,
- tenant-native,
- SSR-native,
- DTO-driven,
- and multi-tenant from the beginning.

---

### 126. Merchant Platform Evolution Phases

#### Merchant Evolution Phase 1 — Runtime Composition Expansion

**Goal:** evolve runtime composition into merchant-configurable infrastructure.

**Section Composition Contracts** – Sections should evolve into merchant-configurable runtime entities. Each section should eventually support configuration schema, merchant-editable settings, merchant visibility rules, device visibility, and localization overrides.

**Section Slot Architecture** – Layouts should eventually expose slots (e.g., `homepage.hero`, `homepage.featured`, `homepage.footer`, `category.sidebar`, `product.recommendations`). Merchants can place sections into slots, reorder sections, enable/disable sections.

**Runtime Layout Definitions** – Layouts should eventually become runtime-defined structures, not hardcoded frontend wrappers.

#### Merchant Evolution Phase 2 — Theme System Expansion

**Goal:** evolve themes into full storefront identity systems.

**Design Token Architecture** – Themes should eventually expose a structured design token system (colors, spacing, radius, typography, shadows, breakpoints, component overrides).

**Component-Level Theming** – Merchants should eventually customize buttons, cards, navigation, banners, product grids, forms, and overlays.

**Theme Presets** – Eventually support merchant theme presets, reusable theme packages, downloadable themes.

**Theme Versioning** – Themes should support draft versions, publish versions, rollback versions, preview versions.

#### Merchant Evolution Phase 3 — Visual Storefront Builder

**Goal:** introduce merchant-operated visual composition.

**Visual Page Builder** – Merchants should eventually drag sections, reorder layouts, configure blocks, and edit storefront pages visually.

**Live Preview Runtime** – The storefront should support real-time preview rendering, unpublished preview states, and draft runtime rendering.

**Safe Preview Isolation** – Preview infrastructure must remain tenant-isolated, cache-isolated, and never leak unpublished changes publicly.

**Block-Level Editing** – Eventually support inline editing, visual content editing, and visual merchandising editing.

#### Merchant Evolution Phase 4 — Commerce Experience Management

**Goal:** evolve CMS into commerce orchestration.

**Campaign Infrastructure** – Merchants should eventually control promotional banners, campaign sections, scheduled campaigns, homepage takeovers, and seasonal storefronts.

**Merchandising Infrastructure** – Merchants should eventually configure featured products, recommendation groups, category emphasis, and dynamic merchandising.

**Personalization Infrastructure** – Future capabilities may include customer-segment targeting, localized campaigns, and dynamic homepage variants.

#### Merchant Evolution Phase 5 — Runtime Extension Platform

**Goal:** make storefront runtime extensible.

**Runtime Extension Registry** – The platform should eventually support runtime extension registration, runtime capability injection, and extension lifecycle management.

**Storefront App Infrastructure** – Future extensions may support reviews, loyalty, subscriptions, analytics, recommendations, and marketing integrations.

**Runtime Extension Contracts** – Extensions must interact through DTO contracts, capability contracts, and extension APIs. Never direct component mutation.

---

### 127. Recommended Runtime CMS Architecture

The CMS should eventually separate:

- **Content Domain** – owns text, media, page content, marketing content.
- **Composition Domain** – owns layouts, section ordering, runtime composition.
- **Theme Domain** – owns design systems, visual identity, theme versions.
- **Experience Domain** – owns campaigns, personalization, merchandising, storefront orchestration.

---

### 128. Recommended Runtime Section Model

Sections should eventually become structured runtime entities.

Example:
```json
{
  "type": "HeroSection",
  "slot": "homepage.hero",
  "settings": {},
  "visibility": {},
  "capabilities": {}
}
```

**Important Rule:** Frontend sections consume contracts only. Never merchant-authored arbitrary code.

---

### 129. Runtime Block Architecture

Eventually support nested blocks, reusable blocks, configurable blocks, and commerce-aware blocks. Examples: image blocks, CTA blocks, product blocks, recommendation blocks, countdown blocks, campaign blocks.

---

### 130. Merchant Media Infrastructure

The platform should eventually support:

- **Asset Management** – image uploads, video uploads, CDN delivery, optimization pipelines.
- **Media Versioning** – draft assets, published assets, replacement workflows.
- **Commerce Media** – product media, campaign media, storefront media.

---

### 131. Merchant Localization Infrastructure

Eventually support localized storefront content, localized campaigns, localized themes, localized navigation, localized merchandising.

---

### 132. Merchant Scheduling Infrastructure

Merchants should eventually schedule campaigns, banners, seasonal storefronts, homepage variants, and flash sales.

---

### 133. Merchant Preview Infrastructure

Preview systems should support safe unpublished previews, preview links, staged publishing, approval workflows, and environment separation.

---

### 134. Recommended Theme Runtime Rules

**Rule 1 — Themes Are Data, Not Code** – Themes should remain configuration-driven, not arbitrary executable storefront logic.

**Rule 2 — Runtime Contracts Are Authoritative** – Merchant customization must remain contract-safe.

**Rule 3 — Visual Editing Must Preserve SSR** – Never destroy SSR integrity, runtime performance, or SEO correctness.

**Rule 4 — Merchant Changes Must Be Isolated** – Merchant changes must remain tenant-scoped, cache-safe, rollback-safe.

**Rule 5 — Runtime Extensions Must Be Capability-Based** – Extensions should expose capabilities, not uncontrolled system access.

---

### 135. Recommended Merchant Governance Model

Eventually support:

- **Draft Workflows** – merchants create, preview, and publish drafts.
- **Approval Workflows** – reviewer roles, publishing approvals, staged publishing.
- **Audit Logs** – track theme changes, storefront changes, campaign changes, publish history.

---

### 136. Recommended Future Merchant Capabilities

Eventually support:

- **Theme Marketplace** – merchants install storefront themes, design systems, templates.
- **Extension Marketplace** – merchants install storefront apps, runtime extensions, integrations.
- **Storefront Templates** – fashion templates, electronics templates, grocery templates, B2B templates.

---

### 137. Recommended Future Runtime Capabilities

Future runtime infrastructure may support:

- **AI-Assisted Merchandising** – recommendation optimization, campaign suggestions, storefront optimization.
- **Dynamic Runtime Personalization** – customer targeting, personalized storefront layouts, campaign segmentation.
- **Runtime Experimentation** – A/B testing, runtime experiments, conversion optimization.

---

### 138. Merchant UX Vision

The final merchant experience should allow merchants to:

- edit storefronts visually,
- manage campaigns safely,
- configure themes easily,
- preview storefront changes instantly,
- orchestrate commerce experiences,
- extend storefront functionality,
- operate multiple storefront experiences confidently.

**Without** engineering involvement for normal storefront operations.

---

### 139. What This Unlocks

Once merchant runtime expansion succeeds, JustShop becomes capable of:

- **Shopify-Class Storefront Management** – themes, sections, campaigns, storefront composition, merchant extensibility.
- **Enterprise Commerce Experiences** – merchandising orchestration, seasonal storefronts, personalized experiences, multi-market storefronts.
- **Future Ecosystem Expansion** – extensions, marketplaces, third-party storefront capabilities, merchant runtime ecosystems.

---

### 140. Final Strategic Truth

Parts 1–9 created a coherent commerce platform architecture.

**Part 10 creates a merchant-operable commerce platform ecosystem.**

This is the transition from:

- A storefront platform

into:

- A configurable commerce operating system

---

### 141. Final End-State Summary

After merchant runtime expansion succeeds, JustShop should provide:

- merchant-composable storefronts
- runtime-managed themes
- visual storefront editing
- runtime-safe preview workflows
- campaign orchestration
- merchandising orchestration
- extensible storefront runtime capabilities
- tenant-native merchant tooling
- runtime extension infrastructure
- future marketplace capability

At that point, JustShop stops behaving like:

- A storefront engineers maintain

And starts behaving like:

- **A commerce platform merchants operate**
```

This is the complete markdown file containing both the original consolidation plan (Parts 1–3, Phases 0–12) and the newly provided Part 10 (Merchant CMS & Theme Runtime Expansion).
