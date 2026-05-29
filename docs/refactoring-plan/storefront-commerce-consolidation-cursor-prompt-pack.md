# JustShop Storefront Consolidation Cursor Prompt Pack

> This document turns the storefront consolidation plan into ready-to-use Cursor prompts.
>
> Use it together with:
>
> - `docs/refactoring-plan/storefront-commerce-consolidation-execution-plan.md`
> - the mandatory execution template supplied by architectural governance
>
> This prompt pack is for implementation work only.
>
> Cursor must preserve:
>
> - canonical route ownership
> - unified shell ownership
> - SSR integrity
> - tenant isolation
> - runtime contract integrity
> - rollback safety

---

# 1. How To Use This Prompt Pack

Use prompts in this order:

1. Run the master audit prompt for the target wave.
2. Run the wave kickoff prompt.
3. Split the wave into PR-sized tasks.
4. Run the task execution prompt for one task only.
5. Verify, document, and stop for approval before the next task.

Do NOT ask Cursor to implement an entire wave in one step.

Do NOT combine multiple ownership migrations into one prompt.

Every prompt should begin by telling Cursor which `AGENTS.md` files are mandatory for that task.

Use this rule:

- always require `justshop-frontend/AGENTS.md` for storefront work
- additionally require `laratenant-backend/AGENTS.md` when the task touches backend contracts, DTOs, Laravel APIs, tenant resolution, auth/session backend behavior, runtime payload contracts, or shared frontend/backend ownership

Standard AGENTS instruction block:

```text
Mandatory context before execution:
1. Read and follow `justshop-frontend/AGENTS.md`.
2. If this task touches backend contracts, APIs, Laravel runtime behavior, DTOs, auth/session backend logic, tenant resolution, runtime payload contracts, or shared frontend/backend ownership, also read and follow `laratenant-backend/AGENTS.md`.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.
```

---

# 2. Master Program Audit Prompt

Use this before starting any wave if the current implementation may have drifted from the plan.

```text
Mandatory context before execution:
1. Read and follow `justshop-frontend/AGENTS.md`.
2. If this wave touches backend contracts, APIs, Laravel runtime behavior, DTOs, auth/session backend logic, tenant resolution, runtime payload contracts, or shared frontend/backend ownership, also read and follow `laratenant-backend/AGENTS.md`.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

Audit the current implementation against the JustShop storefront consolidation plan for the target wave.

Rules:

- Do NOT modify code
- Do NOT propose cleanup yet
- Do NOT remove files
- Do NOT assume architecture not proven in code
- Treat the execution plan as authoritative

Inspect:

- architecture
- SSR behavior
- hydration behavior
- middleware
- runtime dependencies
- DTO contracts
- route ownership
- shell ownership
- shared state
- auth behavior
- cart behavior
- tenant isolation
- stale systems
- migration blockers
- compatibility shims
- rollback exposure

Return:

1. findings
2. affected files
3. risks
4. hidden dependencies
5. migration constraints
6. rollback concerns
7. recommended PR-sized task slices

The target wave is: [WAVE NAME]
The target scope from the plan is: [PASTE WAVE OBJECTIVES / TASKS]
```

---

# 3. Standard Phase Kickoff Prompt

Use this to start one wave.

```text
# JustShop Refactoring Execution Template

## Mandatory Context
1. Read and follow `justshop-frontend/AGENTS.md`.
2. If this phase touches backend contracts, APIs, Laravel runtime behavior, DTOs, auth/session backend logic, tenant resolution, runtime payload contracts, or shared frontend/backend ownership, also read and follow `laratenant-backend/AGENTS.md`.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

## Phase Name
[WAVE NAME]

## Phase Objective
[PASTE PHASE OBJECTIVE]

## Business Goal
[PASTE CUSTOMER / STOREFRONT OUTCOME]

## Architectural Scope
Included:
- [LIST INCLUDED SYSTEMS]

Not Included:
- [LIST EXCLUDED SYSTEMS]

## Mandatory Architecture Rules

### Runtime Rules
- Runtime remains contract-driven
- DTO-first rendering only
- Runtime sections must not self-fetch
- Backend remains source of truth
- Runtime APIs remain SSR-safe

### Tenant Rules
- Every cache key must remain tenant-scoped
- Every persisted client state must become tenant-aware
- No cross-tenant localStorage leakage
- No global commerce persistence keys
- Runtime host propagation must remain intact

### SSR Rules
- No client-only regressions
- Avoid hydration flicker
- Avoid ClientOnly unless strictly required
- Public commerce pages should SSR whenever possible
- Auth/cart bootstrap behavior must remain deterministic

### Route Rules
- No silent route rewrites
- No removal of legacy routes without approval
- Canonical route ownership must be documented
- Redirect behavior must remain explicit

### API Rules
- No undocumented API contract drift
- DTO contracts must remain typed
- Shared fetch clients must remain consistent
- Runtime headers must not be bypassed

### Documentation Rules
Every implementation task MUST update:
- architecture docs
- migration logs
- compatibility notes
- rollout notes
- risk notes
- verification results

## Required Pre-Implementation Audit
First perform an inspection-only audit.

Audit rules:
- Do NOT modify code
- Do NOT propose cleanup yet
- Do NOT remove files

Inspect:
- architecture
- SSR behavior
- hydration behavior
- middleware
- runtime dependencies
- DTO contracts
- route ownership
- shell ownership
- shared state
- auth behavior
- cart behavior
- tenant isolation
- stale systems
- migration blockers

Return:
1. findings
2. affected files
3. risks
4. hidden dependencies
5. migration constraints
6. rollback concerns

## Required Execution Strategy

Cursor MUST NOT:
- refactor entire subsystems at once
- remove files during migration
- merge systems without compatibility layers
- rewrite architecture outside scope
- introduce silent route changes
- bypass SSR behavior
- bypass tenant isolation rules

Cursor MUST:
- implement in PR-sized steps
- preserve backward compatibility
- preserve SSR integrity
- preserve tenant isolation
- preserve runtime contract integrity
- document every migration step
- validate every migration step

## Required Migration Order
1. Audit
2. Architecture validation
3. Small implementation task
4. Verification
5. Documentation update
6. Regression validation
7. Approval before next task

Now:
1. perform the audit only
2. propose a safe task breakdown
3. identify the first task only
4. do not implement yet
```

---

# 4. Standard Task Execution Prompt

Use this for every single PR-sized implementation step.

```text
# JustShop Refactoring Execution Template

## Mandatory Context
1. Read and follow `justshop-frontend/AGENTS.md`.
2. If this task touches backend contracts, APIs, Laravel runtime behavior, DTOs, auth/session backend logic, tenant resolution, runtime payload contracts, or shared frontend/backend ownership, also read and follow `laratenant-backend/AGENTS.md`.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

## Task Name
[TASK NAME]

## Phase Name
[WAVE NAME]

## Objective
Describe ONE isolated architectural change only.

[PASTE SINGLE CHANGE OBJECTIVE]

## Allowed Changes
Allowed:
- [LIST ALLOWED CHANGES]

## Forbidden Changes
Forbidden:
- route rewrites outside approved scope
- API rewrites outside approved scope
- checkout changes unless explicitly in scope
- auth provider changes
- backend schema changes
- middleware rewrites outside approved scope
- deleting legacy systems
- hidden refactors

## Required Compatibility Guarantees
Cursor must preserve:
- runtime SSR
- tenant propagation
- existing auth flows
- existing cart flows
- existing route behavior
- existing middleware behavior
- existing DTO contracts

## Required Validation
Cursor MUST verify:
- SSR rendering
- hydration integrity
- route integrity
- tenant header propagation
- runtime payload integrity
- TypeScript integrity
- stale imports
- broken links
- cart behavior where relevant
- auth behavior where relevant
- navigation continuity where relevant

## Required Deliverables
Return:
1. Summary
2. Architectural reasoning
3. Files changed
4. Why each file changed
5. Compatibility considerations
6. Risks discovered
7. Validation results
8. Remaining blockers

## Execution Rules
- Work in the smallest useful step
- Preserve backwards compatibility
- Add compatibility adapters where needed
- Do not remove old systems during the same step unless explicitly approved
- Update migration notes for this task

Do the work now.
```

---

# 5. Wave Prompt Pack

These prompts are ready to paste into Cursor and then refine with the current file list after the audit.

---

## Wave 1 Prompt

```text
# JustShop Refactoring Execution Template

## Mandatory Context
1. Read and follow `justshop-frontend/AGENTS.md`.
2. Route resolution, redirects, and shared route contracts may touch backend/runtime ownership. If this wave affects runtime route resolution, Laravel redirects, DTO-backed route payloads, or shared route authority, also read and follow `laratenant-backend/AGENTS.md`.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

## Phase Name
Wave 1 — Canonical Route Recovery

## Phase Objective
Recover one authoritative storefront route system.

This wave must:
- create canonical storefront route ownership
- normalize shop, category, product, search, cart, orders, and auth-related route generation
- preserve legacy compatibility redirects during migration
- preserve deep-link continuity and localized route correctness

## Business Goal
- consistent storefront navigation
- stable breadcrumbs
- predictable product and search URLs
- no broken shared links, campaign links, or customer journey links

## Architectural Scope
Included:
- shared route constants
- route builders
- localized route generation
- breadcrumb route ownership
- search result route generation
- cart and order item links
- redirect mapping

Not Included:
- checkout rewrite
- auth rewrite
- runtime product rewrite
- cart refactor
- deleting legacy pages

## Mandatory Constraints
- no silent route rewrites
- no route deletions without approved compatibility mapping
- no component-local route literals after migration targets are touched
- redirect behavior must remain explicit and logged
- locale-aware route behavior must remain intact

## Required Pre-Implementation Audit
Audit only.

Inspect:
- route constants
- storefront links
- breadcrumbs
- search result links
- cart links
- order links
- localized route generation
- redirect handlers
- runtime resolve redirects
- stale route families

Return:
1. route ownership findings
2. affected files
3. stale route families
4. redirect dependencies
5. localization risks
6. rollback concerns
7. first PR-sized task

Do NOT implement yet.
```

---

## Wave 2 Prompt

```text
# JustShop Refactoring Execution Template

## Mandatory Context
1. Read and follow `justshop-frontend/AGENTS.md`.
2. If shell work touches runtime payloads, backend navigation payloads, tenant shell payloads, or shared runtime ownership, also read and follow `laratenant-backend/AGENTS.md`.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

## Phase Name
Wave 2 — Storefront Shell Consolidation

## Phase Objective
Create one storefront shell architecture shared by runtime and legacy storefront surfaces.

This wave must:
- unify header behavior
- unify footer behavior
- normalize layout ownership
- centralize navigation ownership
- expose auth/cart/search visibility through one shell model
- preserve runtime and legacy coexistence during migration

## Business Goal
- unified storefront experience
- consistent navigation and branding
- stable mobile navigation
- visible account, cart, and search continuity across page families

## Architectural Scope
Included:
- storefront layouts
- shared shell wrappers
- header abstractions
- footer abstractions
- navigation rendering
- shell state
- mobile shell behavior

Not Included:
- checkout rewrite
- auth provider rewrite
- backend API redesign
- search engine replacement
- immediate deletion of old header/footer/layout files

## Critical Rules
- consolidate behavior before retiring duplication
- no standalone legacy shell may survive once the shared shell path is authoritative
- runtime shell state must remain SSR-safe
- legacy-hosted pages may be mounted inside the shared shell bridge

## Required Pre-Implementation Audit
Audit only.

Inspect:
- runtime header
- legacy header
- footer implementations
- layout families
- mobile navigation
- account entry points
- cart visibility
- search visibility
- shell hydration behavior
- shell-specific middleware assumptions

Return:
1. shell ownership findings
2. affected files
3. hidden dependencies
4. hydration risks
5. compatibility bridge needs
6. rollback concerns
7. first PR-sized task

Do NOT implement yet.
```

---

## Wave 3 Prompt

```text
# JustShop Refactoring Execution Template

## Mandatory Context
1. Read and follow `justshop-frontend/AGENTS.md`.
2. Also read and follow `laratenant-backend/AGENTS.md` because auth SSR, session restoration, DTOs, tenant-safe persistence, callbacks, and shared auth contracts may cross frontend/backend boundaries.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

## Phase Name
Wave 3 — Auth SSR Stabilization

## Phase Objective
Make storefront identity SSR-aware and converge auth behavior into one storefront lifecycle.

This wave must:
- centralize auth bootstrap
- make shell-level identity SSR-aware
- normalize tenant-scoped auth persistence
- complete password recovery and email verification flows
- normalize social auth callbacks
- unify auth-aware shell visibility

## Business Goal
- stable signed-in storefront continuity
- predictable login/logout behavior
- no delayed identity reveal across storefront surfaces
- complete recovery and verification flows

## Architectural Scope
Included:
- auth bootstrap
- auth persistence
- auth middleware
- shell auth visibility
- social auth callback handling
- password reset flows
- email verification flows

Not Included:
- auth provider rewrite
- backend auth rewrite
- checkout auth redesign
- customer dashboard rewrite

## Critical Rules
- no duplicate bootstrap owners after migrated surfaces are switched
- SSR auth awareness must remain deterministic
- tenant-scoped persistence must prevent cross-tenant restoration
- auth changes must not silently break cart continuity

## Required Pre-Implementation Audit
Audit only.

Inspect:
- auth store ownership
- auth bootstrap plugins
- middleware redirects
- cookie / persistence rules
- SSR identity behavior
- social callback flow
- password reset flow
- email verification flow
- account visibility in shell
- auth/cart coupling

Return:
1. auth architecture findings
2. affected files
3. duplicate bootstrap paths
4. persistence risks
5. redirect risks
6. rollback concerns
7. first PR-sized task

Do NOT implement yet.
```

---

## Wave 4 Prompt

```text
# JustShop Refactoring Execution Template

## Mandatory Context
1. Read and follow `justshop-frontend/AGENTS.md`.
2. Also read and follow `laratenant-backend/AGENTS.md` because cart ownership, merge behavior, checkout handoff, DTOs, and commerce APIs may cross frontend/backend boundaries.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

## Phase Name
Wave 4 — Cart Consolidation

## Phase Objective
Create one storefront cart lifecycle that is shell-aware, runtime-aware, tenant-safe, and migration-safe.

This wave must:
- define one cart owner
- expose runtime cart visibility
- support runtime product commerce interactions
- tenant-scope guest cart persistence
- harden merge and recovery behavior
- reduce client-only cart instability

## Business Goal
- persistent cart continuity
- visible cart state across the storefront
- reliable guest-to-authenticated merge
- stable handoff into checkout

## Architectural Scope
Included:
- cart store ownership
- cart persistence
- runtime cart badge / shell entry
- add-to-cart interactions on runtime products
- cart merge logic
- cart rendering states

Not Included:
- checkout rewrite
- order pipeline redesign
- inventory redesign
- multi-cart experiments

## Critical Rules
- cart ownership may not remain implicit
- guest and authenticated cart models must have one documented reconciliation path
- merge failures must be visible and recoverable
- SSR cart shell visibility must not regress

## Required Pre-Implementation Audit
Audit only.

Inspect:
- cart store
- guest cart persistence
- auth cart merge paths
- runtime product add-to-cart behavior
- cart badge visibility
- cart page hydration gates
- checkout handoff assumptions
- logout semantics

Return:
1. cart ownership findings
2. affected files
3. merge risks
4. persistence risks
5. runtime product blockers
6. rollback concerns
7. first PR-sized task

Do NOT implement yet.
```

---

## Wave 5 Prompt

```text
# JustShop Refactoring Execution Template

## Mandatory Context
1. Read and follow `justshop-frontend/AGENTS.md`.
2. Also read and follow `laratenant-backend/AGENTS.md` because search contracts, runtime headers, tenant propagation, auth propagation, and shared API ownership may cross frontend/backend boundaries.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

## Phase Name
Wave 5 — Search Reintegration

## Phase Objective
Move search into storefront ownership with canonical routes, SSR-safe behavior, and normalized tenant-aware integration.

This wave must:
- unify search entry points
- normalize canonical search routes
- normalize product linking from search
- reduce client-only search dependence
- normalize search API ownership and propagation

## Business Goal
- consistent storefront search access
- SEO-safe search page behavior
- no stale product links from search results
- stable mobile and desktop search continuity

## Architectural Scope
Included:
- search routes
- search page rendering
- autocomplete ownership
- runtime shell search entry
- search API client ownership
- tenant and auth propagation in search

Not Included:
- search engine replacement
- AI search
- recommendation engine work
- full GraphQL migration

## Critical Rules
- no stale route generation may survive in search outputs
- tenant propagation must remain explicit
- search SSR ownership must be documented
- autocomplete must not become a hidden parallel system

## Required Pre-Implementation Audit
Audit only.

Inspect:
- search pages
- autocomplete components
- GraphQL search integration
- search route generation
- search result links
- SEO assumptions
- mobile search behavior
- tenant propagation
- auth propagation

Return:
1. search architecture findings
2. affected files
3. stale route risks
4. SSR risks
5. API normalization blockers
6. rollback concerns
7. first PR-sized task

Do NOT implement yet.
```

---

## Wave 6 Prompt

```text
# JustShop Refactoring Execution Template

## Mandatory Context
1. Read and follow `justshop-frontend/AGENTS.md`.
2. Also read and follow `laratenant-backend/AGENTS.md` because runtime payload contracts, product DTOs, pricing/inventory visibility, and commerce-aware runtime rendering may cross frontend/backend boundaries.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

## Phase Name
Wave 6 — Runtime Commerce Capability Expansion

## Phase Objective
Transform runtime product rendering into real storefront-capable commerce rendering without creating a third architecture.

This wave must:
- expand runtime product detail capability
- integrate pricing, inventory, and commerce controls
- expand runtime commerce sections
- consolidate abandoned duplicate product systems

## Business Goal
- runtime product pages feel like real commerce pages
- stronger storefront continuity
- consistent mobile and desktop product experience

## Architectural Scope
Included:
- runtime product detail rendering
- runtime commerce components
- runtime section capabilities
- reusable product commerce components
- product architecture consolidation

Not Included:
- checkout migration
- personalization engine
- recommendation engine
- merchant visual editor

## Critical Rules
- do NOT create a third product architecture
- runtime remains contract-driven
- commerce interactions must preserve existing cart continuity
- duplicate product systems must be audited before any removal

## Required Pre-Implementation Audit
Audit only.

Inspect:
- runtime product detail surface
- legacy product remnants
- abandoned richer product systems
- pricing display ownership
- inventory visibility ownership
- add-to-cart interactions
- media rendering ownership

Return:
1. product architecture findings
2. affected files
3. duplication map
4. contract risks
5. migration blockers
6. rollback concerns
7. first PR-sized task

Do NOT implement yet.
```

---

## Wave 7 Prompt

```text
# JustShop Refactoring Execution Template

## Mandatory Context
1. Read and follow `justshop-frontend/AGENTS.md`.
2. Also read and follow `laratenant-backend/AGENTS.md` because tenant resolution, host validation, storefront recovery behavior, runtime payload validation, and search propagation may cross frontend/backend boundaries.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

## Phase Name
Wave 7 — Tenant Isolation Hardening

## Phase Objective
Remove storefront leakage risks and make tenant safety explicit across persistence, runtime recovery, and search behavior.

This wave must:
- tenant-scope all storefront persistence
- harden tenant validation
- normalize invalid host / invalid tenant handling
- normalize suspended and unpublished storefront recovery
- verify auth/cart/search isolation

## Business Goal
- no cross-tenant leakage
- safe storefront behavior on invalid or unpublished hosts
- consistent tenant-bound commerce continuity

## Architectural Scope
Included:
- auth persistence
- cart persistence
- locale persistence
- storefront preferences
- tenant bootstrap
- runtime tenant recovery behavior
- search tenant propagation

Not Included:
- multi-store customer federation
- shared-cart experiments
- tenant marketplace features

## Critical Rules
- no optimistic tenant restoration before tenant validity is confirmed
- no global persistence keys
- invalid host handling must fail closed
- tenant isolation verification is mandatory

## Required Pre-Implementation Audit
Audit only.

Inspect:
- tenant bootstrap
- host propagation
- persistence keys
- auth restoration
- cart restoration
- locale restoration
- invalid tenant handling
- invalid host handling
- suspended / unpublished storefront handling
- search propagation

Return:
1. tenant isolation findings
2. affected files
3. persistence leakage risks
4. bootstrap risks
5. recovery blockers
6. rollback concerns
7. first PR-sized task

Do NOT implement yet.
```

---

## Wave 8 Prompt

```text
# JustShop Refactoring Execution Template

## Mandatory Context
1. Read and follow `justshop-frontend/AGENTS.md`.
2. If SSR stabilization touches runtime payload composition, backend-provided shell state, DTO-backed head/theme data, or shared initialization contracts, also read and follow `laratenant-backend/AGENTS.md`.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

## Phase Name
Wave 8 — SSR & Hydration Stabilization

## Phase Objective
Reduce storefront instability across SSR, hydration, and mixed runtime/legacy navigation.

This wave must:
- reduce auth flashes
- reduce cart flashes
- reduce shell swaps
- reduce theme swaps
- reduce duplicate storefront initialization
- stabilize runtime-to-legacy transitions

## Business Goal
- stable perceived storefront continuity
- less flicker
- less hydration mismatch risk
- more predictable navigation behavior

## Architectural Scope
Included:
- shell hydration behavior
- auth hydration behavior
- cart hydration behavior
- runtime transitions
- duplicate fetch paths
- head and theme stabilization

Not Included:
- islands architecture migration
- streaming SSR redesign
- framework replacement

## Critical Rules
- no new ClientOnly usage unless strictly justified
- shell continuity must remain authoritative
- duplicate bootstrap elimination must not remove rollback safety
- explicit client-only boundaries must be documented

## Required Pre-Implementation Audit
Audit only.

Inspect:
- hydration mismatches
- auth flashes
- cart flashes
- shell swaps
- theme swaps
- duplicate bootstrap calls
- duplicate fetch paths
- runtime-to-legacy transitions
- client-only boundaries

Return:
1. SSR / hydration findings
2. affected files
3. mismatch risks
4. duplicate fetch owners
5. transition blockers
6. rollback concerns
7. first PR-sized task

Do NOT implement yet.
```

---

## Wave 9 Prompt

```text
# JustShop Refactoring Execution Template

## Mandatory Context
1. Read and follow `justshop-frontend/AGENTS.md`.
2. Also read and follow `laratenant-backend/AGENTS.md` because this wave directly affects DTOs, shared fetch clients, API contracts, runtime headers, and frontend/backend ownership boundaries.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

## Phase Name
Wave 9 — API & State Normalization

## Phase Objective
Reduce integration fragmentation and recover one ownership model per API and state domain.

This wave must:
- standardize fetch behavior
- normalize tenant and auth propagation
- normalize DTO transforms
- remove duplicate state ownership
- promote reusable storefront shell state where appropriate

## Business Goal
- fewer inconsistent failures
- more predictable storefront data behavior
- more stable SSR and hydration flows

## Architectural Scope
Included:
- shared fetch clients
- DTO transforms
- state ownership boundaries
- shell state promotion
- error normalization
- runtime API behavior

Not Included:
- microservice migration
- backend service decomposition
- full GraphQL-first rewrite
- framework migration

## Critical Rules
- no undocumented contract drift
- components may not become API-specific adapters
- one canonical writer / owner per state domain
- normalization must preserve rollback capability

## Required Pre-Implementation Audit
Audit only.

Inspect:
- fetch wrappers
- API clients
- DTO transforms
- state stores
- duplicated hydration paths
- duplicated bootstrap paths
- error handling paths
- tenant and auth header propagation

Return:
1. API/state findings
2. affected files
3. ownership conflicts
4. DTO drift risks
5. normalization blockers
6. rollback concerns
7. first PR-sized task

Do NOT implement yet.
```

---

## Wave 10 Prompt

```text
# JustShop Refactoring Execution Template

## Mandatory Context
1. Read and follow `justshop-frontend/AGENTS.md`.
2. If performance work touches runtime payload shape, backend fetch orchestration, cache behavior, tenant headers, or shared API behavior, also read and follow `laratenant-backend/AGENTS.md`.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

## Phase Name
Wave 10 — Performance Optimization

## Phase Objective
Optimize storefront runtime behavior only after ownership consolidation is stable.

This wave must:
- reduce waterfalls
- reduce duplicate shell fetches
- reduce unnecessary post-mount fetches
- optimize search repetition and autocomplete
- optimize cart synchronization
- reduce duplicated rendering work

## Business Goal
- faster storefront interactions
- lower perceived latency
- less redundant loading during navigation

## Architectural Scope
Included:
- runtime fetch behavior
- navigation / theme / page waterfalls
- shell state reuse
- search query efficiency
- cart synchronization efficiency
- duplicated rendering paths

Not Included:
- CDN redesign
- backend infrastructure migration
- speculative caching redesign

## Critical Rules
- do not optimize unstable ownership
- do not hide correctness problems under caching
- do not bypass tenant or SSR safeguards for performance

## Required Pre-Implementation Audit
Audit only.

Inspect:
- request waterfalls
- duplicate fetches
- redundant hydration work
- repeated search requests
- repeated cart refreshes
- shell rendering duplication
- candidate app-shell state reuse

Return:
1. performance findings
2. affected files
3. measurement gaps
4. optimization risks
5. blockers caused by unresolved ownership
6. rollback concerns
7. first PR-sized task

Do NOT implement yet.
```

---

## Wave 11 Prompt

```text
# JustShop Refactoring Execution Template

## Mandatory Context
1. Read and follow `justshop-frontend/AGENTS.md`.
2. If retirement touches shared DTOs, Laravel routes, runtime APIs, backend-owned redirects, or shared compatibility layers, also read and follow `laratenant-backend/AGENTS.md`.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

## Phase Name
Wave 11 — Legacy Retirement

## Phase Objective
Safely retire transitional systems only after verification, compatibility replacement, and rollback safety are proven.

This wave must:
- retire stale route assumptions
- retire temporary redirects when approved
- retire dead migration surfaces
- retire duplicate shell wrappers
- retire dead API routes and obsolete migration proxies
- update architecture documentation and removal tracking

## Business Goal
- simpler storefront architecture
- less duplicated behavior
- lower long-term maintenance risk

## Architectural Scope
Included:
- stale routes
- compatibility redirects
- duplicate layout / shell wrappers
- abandoned composables
- dead API routes
- dead migration utilities
- deprecation tracking

Not Included:
- opportunistic rewrites
- behavior redesign
- unverified deletions

## Critical Rules
- legacy retirement happens last
- nothing is removed without replacement evidence
- compatibility layers remain until metrics and verification prove they are removable
- every removal must have rollback and owner approval

## Required Pre-Implementation Audit
Audit only.

Inspect:
- stale routes
- redirect usage
- duplicate shell wrappers
- abandoned product systems
- dead API routes
- obsolete migration utilities
- hidden dependencies
- deprecation register state

Return:
1. retirement findings
2. affected files
3. hidden dependency risks
4. compatibility layers still in use
5. rollback concerns
6. removal prerequisites
7. first PR-sized task

Do NOT implement yet.
```

---

# 6. Micro-Prompt Templates By Task Type

Use these when splitting a wave into smaller tasks.

---

## Route Task Prompt

```text
Mandatory context before execution:
1. Read and follow `justshop-frontend/AGENTS.md`.
2. If this task touches backend contracts, APIs, Laravel runtime behavior, DTOs, auth/session backend logic, tenant resolution, runtime payload contracts, or shared frontend/backend ownership, also read and follow `laratenant-backend/AGENTS.md`.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

Implement one PR-sized route consolidation step only.

Scope:
- canonical route builders
- redirect mapping
- localized route behavior
- breadcrumb or search link alignment

Do NOT:
- delete legacy routes
- rewrite unrelated route families
- modify auth, cart, or shell ownership outside the touched route path

Preserve:
- existing route behavior
- deep-link continuity
- redirect explicitness
- localized routing integrity

Return:
1. changed files
2. route behavior affected
3. compatibility mapping added
4. validation performed
5. remaining stale route areas
```

---

## Shell Task Prompt

```text
Mandatory context before execution:
1. Read and follow `justshop-frontend/AGENTS.md`.
2. If this task touches backend contracts, APIs, Laravel runtime behavior, DTOs, auth/session backend logic, tenant resolution, runtime payload contracts, or shared frontend/backend ownership, also read and follow `laratenant-backend/AGENTS.md`.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

Implement one PR-sized shell consolidation task only.

Scope:
- shared shell wrapper
- header / footer abstraction
- navigation interface
- shell state hookup

Do NOT:
- delete old shell files
- rewrite routes
- rewrite auth provider logic
- rewrite cart store logic

Preserve:
- SSR shell behavior
- tenant branding
- auth/cart/search visibility
- mobile continuity

Return:
1. changed files
2. shell ownership change introduced
3. compatibility bridge used
4. validation performed
5. remaining shell fragmentation
```

---

## Auth Task Prompt

```text
Mandatory context before execution:
1. Read and follow `justshop-frontend/AGENTS.md`.
2. Also read and follow `laratenant-backend/AGENTS.md` because auth tasks commonly cross frontend/backend ownership.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

Implement one PR-sized auth consolidation task only.

Scope:
- bootstrap ownership
- shell auth visibility
- password reset
- email verification
- social callback normalization
- tenant-safe persistence

Do NOT:
- replace auth provider
- redesign checkout auth
- rewrite unrelated middleware

Preserve:
- SSR identity behavior
- existing login/logout flows
- cart continuity
- redirect correctness

Return:
1. changed files
2. auth lifecycle change introduced
3. compatibility fallback retained
4. validation performed
5. remaining auth blockers
```

---

## Cart Task Prompt

```text
Mandatory context before execution:
1. Read and follow `justshop-frontend/AGENTS.md`.
2. Also read and follow `laratenant-backend/AGENTS.md` because cart tasks commonly cross frontend/backend ownership.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

Implement one PR-sized cart consolidation task only.

Scope:
- cart badge continuity
- tenant-scoped persistence
- merge hardening
- runtime product cart integration
- cart rendering stabilization

Do NOT:
- rewrite checkout
- redesign inventory
- introduce a second cart owner

Preserve:
- guest cart behavior
- authenticated cart continuity
- SSR-safe shell visibility
- merge rollback safety

Return:
1. changed files
2. cart ownership change introduced
3. compatibility bridge retained
4. validation performed
5. remaining cart risks
```

---

## Search Task Prompt

```text
Mandatory context before execution:
1. Read and follow `justshop-frontend/AGENTS.md`.
2. Also read and follow `laratenant-backend/AGENTS.md` because search tasks commonly cross frontend/backend ownership.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

Implement one PR-sized search consolidation task only.

Scope:
- canonical search routes
- shell search entry
- SSR search behavior
- tenant/auth propagation
- search result link normalization

Do NOT:
- replace search engine
- perform broad GraphQL rewrite
- bypass runtime propagation rules

Preserve:
- search continuity
- autocomplete continuity
- canonical product linking
- SEO-safe rendering behavior

Return:
1. changed files
2. search ownership change introduced
3. compatibility adapter retained
4. validation performed
5. remaining search blockers
```

---

# 7. Required Verification Prompt

Use this after each implementation task.

```text
Mandatory context before execution:
1. Read and follow `justshop-frontend/AGENTS.md`.
2. If the completed task touched backend contracts, APIs, Laravel runtime behavior, DTOs, tenant resolution, runtime payload contracts, or shared frontend/backend ownership, also read and follow `laratenant-backend/AGENTS.md`.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

Verify the completed task against the JustShop storefront consolidation rules.

Check:
- SSR rendering
- hydration integrity
- route integrity
- tenant propagation
- runtime payload integrity
- stale imports
- broken links
- TypeScript integrity
- task-specific auth/cart/search behavior where relevant

Required commands when applicable:
- npm run build
- npm run runtime:contracts:check
- npm run runtime:verify:phase6
- npm run runtime:verify:phase7
- php artisan test

Return:
1. validation results
2. failures
3. architectural regressions
4. rollback concerns
5. documentation updates still required
```

---

# 8. Required Documentation Update Prompt

Use this after each successful task.

```text
Mandatory context before execution:
1. Read and follow `justshop-frontend/AGENTS.md`.
2. If the completed task touched backend contracts, APIs, Laravel runtime behavior, DTOs, tenant resolution, runtime payload contracts, or shared frontend/backend ownership, also read and follow `laratenant-backend/AGENTS.md`.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

Update documentation for the completed JustShop consolidation task.

You must update only the documentation affected by this task.

Include:
- migration log entry
- compatibility note
- rollout note
- risk note
- verification result
- pending removal note if a legacy surface still exists

Return:
1. docs updated
2. what changed in each doc
3. deferred documentation still pending
```

---

# 9. Approval Gate Prompt

Use this between tasks.

```text
Mandatory context before execution:
1. Read and follow `justshop-frontend/AGENTS.md`.
2. If the completed task touched backend contracts, APIs, Laravel runtime behavior, DTOs, tenant resolution, runtime payload contracts, or shared frontend/backend ownership, also read and follow `laratenant-backend/AGENTS.md`.
3. Treat AGENTS rules as mandatory constraints, not optional guidance.

Stop and assess whether the completed task is safe to continue from.

Return:
1. what changed
2. what remains unstable
3. whether rollback is clear
4. whether the next task is safe
5. the exact next PR-sized task

Do NOT implement the next task yet.
```

---

# 10. Final Rule

Do not use Cursor as a rewrite engine.

Use Cursor as:

- an implementation assistant under architectural control
- a migration worker for one bounded task at a time
- a verifier against SSR, tenant, routing, and DTO constraints

If a prompt would cause Cursor to:

- merge multiple ownership domains,
- refactor an entire subsystem,
- delete legacy systems prematurely,
- or guess architecture not proven in code,

stop and rewrite the prompt into a smaller task.
