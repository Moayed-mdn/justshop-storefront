# Shopify-Like Storefront Master Plan

## Status

- Status: Active working plan
- Scope: `justshop-frontend` storefront only
- Primary audience: storefront engineering, product, UX, and QA
- Backend assumption: keep the current Laravel commerce backend as the business authority

## Purpose

This document is the short execution-facing master plan for turning `justshop-frontend` into a Shopify-like multi-tenant storefront experience.

It does not replace the detailed program record in `storefront-commerce-consolidation-execution-plan.md`. Instead, it gives the team a compact working reference for product direction, architectural priorities, execution order, and phase-level delivery boundaries.

## Product Goal

Build a unified, tenant-safe, SSR-first storefront that feels like a modern Shopify storefront:

- one consistent storefront shell
- one canonical routing model
- one coherent commerce journey across home, collections, products, search, cart, and account
- strong mobile UX
- strong SEO and performance fundamentals
- runtime-driven content and merchandising that can scale without another frontend rewrite

## In Scope

- `justshop-frontend` storefront UX and architecture
- unified storefront shell and route ownership
- product, collection, search, cart, and account experience
- storefront content, merchandising, and theme runtime foundations
- SSR, SEO, performance, and mobile polish
- legacy retirement inside the storefront app once the replacement paths are stable

## Out Of Scope

- merchant dashboard work
- backend platform rewrite
- checkout replatform beyond required storefront integration
- merchant-facing theme editor
- apps ecosystem, subscriptions, or advanced platform expansion
- greenfield rewrite of the entire frontend

## Current Assessment

The frontend already has a strong runtime foundation, tenant resolution, proxy integration, and the beginnings of unified storefront routing. The main problem is not missing infrastructure. The main problem is storefront cohesion.

Today the app still behaves like a hybrid between runtime storefront surfaces and older commerce surfaces. That creates shell drift, route inconsistency, split ownership of navigation and search, and uneven product-to-cart-to-account continuity.

The plan is therefore:

1. unify the storefront
2. harden the commerce experience
3. expand runtime-driven merchandising
4. retire legacy leftovers safely

## Strategic Decisions

### 1. Runtime Becomes The Storefront Foundation

Do not build a second storefront beside the runtime system. The runtime shell becomes the final storefront shell, and commerce flows must converge into it.

### 2. Canonical Route Ownership Is Mandatory

Every storefront URL must resolve through one canonical route model and one route-builder system. No new hardcoded path families should be introduced.

### 3. Commerce Cohesion Comes Before Feature Expansion

Do not add major storefront features on top of split shells or drifting routes. First make the store feel like one product.

### 4. Backend Remains The Source Of Business Truth

Product data, pricing, cart rules, account authority, tenancy, permissions, and checkout authority remain backend-owned. The frontend owns presentation, interaction quality, SSR delivery, and client continuity.

### 5. Mobile, SEO, And Performance Are First-Class Requirements

The storefront is not complete when pages merely exist. It is complete when the browsing and buying experience feels fast, stable, trustworthy, and indexable.

## Target Storefront Outcomes

At completion, the storefront should provide:

- a unified shell across home, content, collections, products, search, cart, and account
- stable tenant-aware navigation and locale continuity
- high-confidence product detail pages built for conversion
- strong collection and search discovery flows
- visible cart and account entry points everywhere they should exist
- consistent rendering and state behavior across SSR and hydration
- a runtime-powered merchandising model that supports future extensibility

## Experience Pillars

### Unified Shell

One header, one footer, one mobile navigation system, one search entry, one cart entry, and one account entry across the storefront.

### Strong Commerce Pages

Home, collection, product, search, cart, and account must all feel like parts of the same store, not separate sub-applications.

### Conversion-Oriented Product Experience

Product pages should present clear media, pricing, variant selection, stock status, purchase actions, trust elements, and related merchandising in a conversion-friendly layout.

### Fast Discovery

Customers should move smoothly from homepage to collection, from collection to product, and from search to product without route confusion or context loss.

### Tenant-Safe Continuity

Cart persistence, customer identity, locale, and navigation must remain store-aware and predictable.

## Delivery Phases

## Phase 1: Product Alignment And Canonical Model

Objective: freeze the target storefront shape before broad implementation.

Deliverables:

- approved canonical storefront information architecture
- approved route model for home, collections, products, search, cart, and account
- approved shell ownership model
- approved state ownership model for auth, cart, and search entry points
- concise acceptance criteria for a Shopify-like storefront baseline

Exit criteria:

- no unresolved disagreement on final storefront paths
- no unresolved disagreement on shell ownership
- no unresolved disagreement on runtime versus legacy authority

## Phase 2: Unified Storefront Shell

Objective: make the storefront feel like one product.

Deliverables:

- unified storefront layout ownership
- consistent header, footer, and mobile navigation
- integrated cart badge and account entry
- integrated search trigger and mobile search affordances
- shared shell behavior across runtime and commerce surfaces

Exit criteria:

- no shell jump between major storefront pages
- no duplicated primary navigation systems
- mobile and desktop shell behavior align with one design language

## Phase 3: Canonical Routing Consolidation

Objective: remove route drift and make storefront navigation predictable.

Deliverables:

- canonical route builders used across cards, breadcrumbs, links, and redirects
- cleanup of route-family inconsistencies
- normalized storefront navigation and breadcrumbs
- legacy path handling only as explicit compatibility behavior

Exit criteria:

- no new hardcoded storefront paths
- no conflicting path families for the same destination
- internal navigation resolves through canonical helpers

## Phase 4: Commerce Core Experience

Objective: raise the store from data display to sales-ready commerce experience.

Deliverables:

- storefront-grade homepage sections
- strong collection and listing pages with sorting and filtering
- conversion-oriented product detail pages
- better empty states, merchandising blocks, and related product pathways

Exit criteria:

- the product page supports real purchase intent, not only content display
- collection pages support real browse-and-filter behavior
- homepage supports merchandising and featured commerce content

## Phase 5: Cart, Auth, And Account Continuity

Objective: make customer state stable across browsing and purchase flows.

Deliverables:

- cart entry available from the shell
- robust guest cart persistence
- customer state continuity across login and return visits
- account pages aligned visually and structurally with the storefront shell
- stable cart and identity behavior across tenant boundaries

Exit criteria:

- customer can browse, add to cart, authenticate, and continue cleanly
- cart state does not feel detached from the storefront
- account surfaces no longer feel like a separate application

## Phase 6: Search And Discovery

Objective: make discovery fast, coherent, and storefront-native.

Deliverables:

- unified storefront search entry
- improved search results experience
- autocomplete or quick-result discovery flow
- search state and URL behavior aligned with canonical routing

Exit criteria:

- search is clearly part of the storefront shell
- search result pages feel equivalent in quality to collection pages
- search-to-product journey is fast and predictable

## Phase 7: Runtime Merchandising And Theme Foundations

Objective: turn the runtime system into a durable merchandising engine for the storefront.

Deliverables:

- homepage and marketing section extensibility
- tenant-aware branding and theme token continuity
- reusable runtime sections around commerce surfaces
- clear boundaries for content-driven and commerce-driven sections

Exit criteria:

- runtime is not only a page renderer but a storefront composition layer
- merchandising sections can evolve without another architecture split

## Phase 8: SEO, Performance, And Mobile Polish

Objective: make the storefront production-grade.

Deliverables:

- canonical metadata and crawl hygiene
- improved loading states and perceived performance
- image and request-flow optimizations
- better mobile ergonomics and sticky action behavior where needed

Exit criteria:

- major storefront pages meet agreed SEO baselines
- mobile browsing and buying feel deliberate and stable
- performance work is integrated into the storefront experience, not bolted on

## Phase 9: Legacy Retirement And Certification

Objective: finish the transformation and remove obsolete storefront structures.

Deliverables:

- retirement list for superseded pages, helpers, and layouts
- final gap review against the target storefront experience
- release readiness checklist for the unified storefront baseline

Exit criteria:

- hybrid storefront behavior is no longer the default reality
- legacy paths are either retired or explicitly documented as compatibility layers
- the team can describe one storefront architecture, not two

## First 8 Weeks

### Weeks 1-2

- lock target experience and canonical route model
- confirm shell, navigation, and state ownership
- convert the current long-form program into execution backlog slices

### Weeks 3-4

- implement the unified shell foundation
- align header, footer, mobile navigation, search entry, cart entry, and account entry

### Weeks 5-6

- complete canonical route consolidation
- remove route drift in cards, breadcrumbs, and internal navigation

### Weeks 7-8

- deliver the first strong product, collection, and homepage commerce baseline
- tighten cart integration inside the unified storefront shell

## Success Metrics

- customers experience one storefront shell across all major pages
- route behavior is predictable and canonical
- product pages feel sales-ready
- cart and account continuity are stable
- search is storefront-native
- mobile UX is credible for real shopping sessions
- SEO and SSR behavior support discoverability and reliability
- tenant isolation remains intact

## Main Risks

- implementing new features before shell and route consolidation is complete
- allowing runtime and legacy commerce ownership to coexist indefinitely
- leaving search, cart, or account outside the unified shell model
- over-investing in cosmetic UI changes before fixing navigation and state continuity
- postponing mobile and SEO work until after large-scale page delivery

## Working Rule

When a tradeoff appears, prefer decisions that increase storefront unity, route consistency, tenant safety, and long-term runtime ownership.

## Relationship To Existing Documents

- Use `storefront-commerce-consolidation-execution-plan.md` for the detailed active program sequence and phase history.
- Use `audits/storefront-commerce-consolidation-audit.md` for the current-state problem statement.
- Use `docs/architecture/storefront-routes.md` and `docs/architecture/storefront-shell.md` as owner documents for implementation rules once execution starts.
- Use this document as the short product-and-execution north star for the storefront transformation.
