# JustShop Storefront Runtime — Plan Summary

This document is a plain-language overview of the **Storefront Runtime Integration** program for the JustShop multi-tenant e-commerce platform. It is written for readers who did not work on the codebase and can be shared externally.

**Repositories:** `justshop-frontend` (Nuxt) + `laratenant-backend` (Laravel)  
**Original plan length:** 18 weeks, 9 phases (0–8)  
**Authoritative technical doc:** [storefront-runtime-integration-execution-plan.md](./storefront-runtime-integration-execution-plan.md)

---

## 1. What problem this solves

Before this work, the public storefront behaved partly like a normal Nuxt app (hardcoded pages, components fetching their own data) and partly like a future “platform” (catch-all route, mocks). That made it hard to:

- Run **many merchant stores** on one codebase
- Serve **CMS-driven pages** from Laravel
- Keep **tenant data isolated** (cache, API, SEO)
- Roll out changes **safely** (preview, cache, feature flags)

The program replaces **mocked runtime behavior** with a **real, contract-driven pipeline**: Laravel owns business data and rules; Nuxt owns rendering and SSR.

---

## 2. Target architecture (who owns what)

| Layer | Owns |
|--------|------|
| **Laravel (backend)** | Which store is this request for (domain → tenant), URL → page type (home, marketing, category, product), page JSON (sections + SEO), navigation, theme tokens, preview tokens, cache invalidation |
| **Nuxt (frontend)** | SSR, catch-all page `app/pages/[...slug].vue`, reading DTOs only (no raw Laravel models in Vue), layout + section registry, hydration |

**Dual runtime (important):** High-risk flows stay on **dedicated Nuxt pages** until explicitly migrated later:

- Login, register, cart, checkout, orders, profile, email verification, Google auth
- Search (still file-based today)

Catalog and marketing traffic use the **new catch-all runtime**.

---

## 3. Non-negotiable rules

1. **Contracts first** — No feature work until API/DTO contracts are frozen.
2. **DTOs only in the UI** — Sections get `sections[].props`; they must not call APIs themselves.
3. **Tenant in every cache key** — tenant + locale + runtime version + path.
4. **Structured logs** — `tenant_id`, `locale`, `path`, `request_id`.
5. **Do not delete legacy routes** without approval, evidence, and regression tests.
6. **No phase closes** with open Severity 1 or 2 bugs.

---

## 4. Phases at a glance

| Phase | Weeks (plan) | Goal | Status (repo) |
|-------|----------------|------|----------------|
| **0** | 1 | Program setup: environments, CI, RACI, traceability | Organizational; not tracked in code |
| **1** | 2–3 | Freeze **runtime contracts** (API, DTOs, SEO, cache keys, preview security) | **Done** |
| **2** | 4–6 | **Laravel** runtime APIs: resolve route, page, navigation, theme, preview | **Done** |
| **3** | 7–9 | **Nuxt** wires catch-all to real APIs (no mocks on active path) | **Done** |
| **4** | 10–11 | Section/layout hardening: presentational sections, safe fallbacks | **Done** |
| **5** | 12–13 | Preview mode + tenant-safe cache invalidation | **Done** |
| **6** | 14–15 | Certification: SEO, isolation, performance baselines, observability | **Done** (automated in repo; production dashboards optional) |
| **7** | 16–17 | Controlled production rollout (internal → pilot → full, kill switch) | **Deferred** (controls built; formal pilot/monitoring not run) |
| **8** | 18 | Legacy retirement log + handover docs + safe code cleanup | **Done** (repo closeout) |

**Program milestones M1–M6 and M8:** met in the repository. **M7** (production rollout completed) was **not** claimed; rollout tooling remains for ops if needed.

---

## 5. What each phase delivered (concrete)

### Phase 1 — Contracts

Specs for runtime API, DTO mapping, logging, cache keys, SEO, preview security. Validated in CI via `npm run runtime:contracts:check`.

### Phase 2 — Backend APIs

Endpoints under `/api/v1/storefront/runtime/`:

- `resolve` — path → page type + id
- `page/{id}` — sections + SEO
- `navigation`, `theme`
- `preview/validate`

Tenant resolved from **HTTP Host** (e.g. `demo.justshop.test` must exist on the `stores.domain` row).

### Phase 3 — Frontend integration

`useRouteResolver` and `useStorefrontPayload` call Laravel. Catch-all renders `RuntimeSectionRenderer` from `sections[].component`.

### Phase 4 — Sections

Runtime sections (Hero, Category grid, Category summary, Product grid, etc.) only render props from the payload.

### Phase 5 — Preview and cache

Preview bypasses shared cache; publishing invalidates tenant-scoped runtime cache.

### Phase 6 — Certification

Backend tests + `npm run runtime:verify:phase6` (SSR smoke on home, marketing, category, product).

### Phase 7 — Rollout (optional ops)

Env flags: `STOREFRONT_RUNTIME_ROLLOUT_MODE`, `STOREFRONT_RUNTIME_KILL_SWITCH`, tenant allowlists. Verification: `npm run runtime:verify:phase7`. Formal 48h monitoring, pilot UAT, and 7-day stability were **deferred** by team choice.

### Phase 8 — Closeout

Documented what to keep vs retire; removed unused migration composables; handover + operating guides. See [storefront-runtime-phase-8-legacy-retirement.md](./storefront-runtime-phase-8-legacy-retirement.md).

---

## 6. How a page request works (end-to-end)

```text
Browser  →  demo.justshop.test:3000/products/category/electronics
    ↓
Nuxt middleware (tenant from Host)
    ↓
Catch-all page loads:
    1) GET runtime/resolve?path=/products/category/electronics
    2) GET runtime/page/{id} + navigation + theme
    ↓
Laravel: Host → store → category "electronics" → products in category tree
    ↓
JSON: sections[] e.g. CategorySummarySection + ProductGridSection
    ↓
Nuxt: map theme tokens to CSS variables → render sections
```

**Common local pitfall:** Using `localhost` instead of `demo.justshop.test` — backend cannot resolve tenant → `runtime.tenant_not_found`.

---

## 7. Colors and branding

| Page type | Who sets colors |
|-----------|------------------|
| Runtime pages (home, category, product, CMS) | **Backend** sends theme tokens (`colorPrimary`, etc.); **frontend** applies them as CSS variables |
| Legacy pages (login, cart, checkout, …) | **Frontend** CSS design tokens + light/dark toggle |

Today, runtime theme values come from Laravel config (`config/storefront_runtime.php`), not yet from per-merchant admin UI.

---

## 8. Demo store (local)

Seeders build a full catalog (categories, many products, heroes, reviews). `DemoStorePresentationSeeder` improves the demo:

- Store name **JustShop Demo**
- Homepage: hero + departments + featured products
- Product images via placeholder URLs (needs internet for `picsum.photos`)
- Category pages include product grids

**Refresh demo data:**

```bash
cd laratenant-backend
php artisan migrate:fresh --seed
php artisan cache:clear
```

**Local URL:** `http://demo.justshop.test:3000` (add `127.0.0.1 demo.justshop.test` to `/etc/hosts`).

---

## 9. Verification commands

```bash
# Backend
cd laratenant-backend
php artisan test tests/Feature/Storefront/StorefrontRuntimeTest.php

# Frontend
cd justshop-frontend
npm run runtime:contracts:check
npm run build
npm run runtime:verify:phase6   # needs built server + backend running
npm run runtime:verify:phase7   # rollout / kill-switch smoke
```

---

## 10. What is intentionally still future work

| Item | Why not “done” |
|------|----------------|
| Migrate cart/checkout/auth to runtime | High risk; kept on legacy routes |
| Migrate search to runtime | Separate GraphQL flow today |
| Per-merchant theme in database | Config-based theme for now |
| Formal production rollout (Phase 7 ops) | Deferred; tooling exists |
| Merchant-uploaded product images | Demo uses external placeholder images |
| Production load tests and dashboards | Ops/environment owned |

Tracked in: [storefront-runtime-phase-8-decommission-backlog.md](./storefront-runtime-phase-8-decommission-backlog.md)

---

## 11. Related documentation

| Topic | Document |
|--------|----------|
| Full execution plan | [storefront-runtime-integration-execution-plan.md](./storefront-runtime-integration-execution-plan.md) |
| Contract hub | [../architecture/storefront-runtime-contracts.md](../architecture/storefront-runtime-contracts.md) |
| Phase 7 rollout | [storefront-runtime-phase-7-rollout.md](./storefront-runtime-phase-7-rollout.md) |
| Phase 8 closeout | [storefront-runtime-phase-8-legacy-retirement.md](./storefront-runtime-phase-8-legacy-retirement.md) |
| Operating guide | [storefront-runtime-phase-8-operating-guide.md](./storefront-runtime-phase-8-operating-guide.md) |
| Support handover | [storefront-runtime-phase-8-support-handover.md](./storefront-runtime-phase-8-support-handover.md) |

---

## 12. One-sentence summary

We turned the JustShop storefront into a **multi-tenant, Laravel-driven, Nuxt-rendered runtime**: contracts first, real APIs, SSR catalog/CMS pages, safe preview/cache, tests and rollout flags in the repo; checkout/login stay on legacy pages for now; the **engineering plan is complete in code**, while **formal production pilot rollout** was optional and deferred.
