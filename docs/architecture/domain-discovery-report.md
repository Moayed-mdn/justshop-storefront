# Domain Discovery Report: Multi-Tenant Storefront Platform

## **Executive Summary**

This report identifies the core business domains and subdomains within the Nuxt storefront codebase. The current architecture follows a standard Nuxt 4 structure, but the transition to a multi-tenant platform requires a shift toward a **Domain-Driven Architecture (DDA)** to ensure clear boundaries between storefront-specific logic and platform-wide core functionality.

---

## **Business Domain Mapping**

| Domain | Subdomain | Ownership | Runtime Responsibility |
| :--- | :--- | :--- | :--- |
| **Identity** | Auth, Session | `app/stores/auth.ts`, `useAuth` | JWT handling, login/register, token persistence. |
| **Catalog** | Products, Categories | `useProduct`, `useProductDetail` | Listing, detail fetching, related products, variant selection. |
| **Search** | Search Engine | `server/api/search.get.ts`, `graphql/` | Full-text search via GraphQL/Apollo client. |
| **Cart** | Guest Cart, Sync | `app/stores/cart.ts`, `useCart` | LocalStorage persistence, merge-on-login, item management. |
| **Checkout** | Payment, Stripe | `useCheckout`, `server/api/checkout/` | Session creation, Stripe redirect, status verification. |
| **Customer** | Profile, Orders | `useProfile`, `useOrders` | Personal info, order history, address management. |
| **Storefront** | UI, Layout | `app/components/layout/`, `app.vue` | Layout orchestration, navigation, topbar/header/footer. |
| **Marketing** | CMS, Banners | `useHero`, `HeroSection.vue` | Hero banners, best-sellers, promotional content. |
| **Infrastructure**| API, I18n, Theme | `useApi`, `useTheme`, `@nuxtjs/i18n` | Proxying, localization, light/dark mode state. |

---

## **Architectural Issues Detected**

### **1. Mixed Responsibilities (Cross-Domain Leakage)**
- **Auth & Cart Coupling**: `useAuth.ts` explicitly calls `cartStore.onLogin()`. Auth should ideally trigger an event or use a plugin to notify other domains instead of having direct knowledge of the cart.
- **UI & Data Fetching**: Composables like `useProduct` are heavily coupled to `useRoute` and `route.query`. This makes it difficult to reuse catalog logic outside of the standard `/products` page (e.g., in a dynamic CMS block).

### **2. Duplicated Logic**
- **Filter Syncing**: Filtering logic is duplicated across `useProduct.ts` and `useProductByCategory.ts`. Both implement similar `watch(filters, syncToUrl)` patterns.
- **Cart Recalculation**: Recalculation logic exists in both `cartHelpers` and the store actions, creating potential for drift in how totals are computed.

### **3. Misplaced Files**
- **`shared/utils/routes.ts`**: Contains both frontend and backend routes. While centralized, it mixes internal app routing with external API contracts.
- **`app/composables/useCachedData.ts`**: This is a generic infrastructure concern but sits alongside domain-specific composables like `useProduct`.

---

## **Proposed Domain-Driven Architecture**

We recommend restructuring the application into three main layers: **Platform Core**, **Storefront Domain**, and **UI/App Layer**.

### **Proposed Folder Structure**
```text
src/
├── core/                 # Framework-agnostic infrastructure
│   ├── api/              # useApi, ofetch instance
│   ├── i18n/             # Localization engine
│   └── theme/            # Theme variables & injection
├── domains/              # Business logic (Pure Types & Composables)
│   ├── catalog/          # Products, Search, Filters
│   ├── checkout/         # Cart, Stripe, Payment
│   ├── customer/         # Profile, Orders
│   └── identity/         # Auth, Session
├── platform/             # Multi-tenant specific logic
│   ├── tenant/           # Domain resolution, tenant context
│   └── rendering/        # Dynamic Section Renderer, CMS Engine
└── ui/                   # Shared UI Components (Design System)
    ├── atoms/
    ├── molecules/
    └── organisms/
```

---

## **Domain Migration Difficulty**

| Domain | Migration Difficulty | Strategy |
| :--- | :--- | :--- |
| **Catalog** | 🟡 Medium | Extract filter logic into a standalone `useFilterManager`. |
| **Cart** | 🟡 Medium | Decouple from `useAuth` using a plugin or event-based sync. |
| **Identity** | 🟢 Low | Already fairly isolated in `useAuth` and `auth.ts` store. |
| **Infrastructure** | 🔴 High | Requires extracting `useApi` and `i18n` into a platform-core layer. |
| **Marketing** | 🔴 High | Needs a total shift from static banners to a dynamic CMS block system. |

---

## **Recommendations for Future Modules**

1.  **`@shop/core`**: Move `useApi`, `useCachedData`, and `useTheme` here. This should remain framework-agnostic where possible.
2.  **`@shop/catalog`**: A module dedicated to product discovery, filtering, and search.
3.  **`@shop/checkout`**: Encapsulate cart logic and Stripe integrations.
4.  **`@shop/rendering`**: A new module for the "Storefront Runtime" to handle the `[...slug].vue` resolution and section rendering.

---

## **Ownership Boundaries**

- **Framework-Agnostic**: Utility functions ([price.ts](file:///home/leader/projects/nuxt/justshop-frontend/app/utils/price.ts)), API Fetcher ([useApi.ts](file:///home/leader/projects/nuxt/justshop-frontend/app/composables/useApi.ts)), and Types ([product.ts](file:///home/leader/projects/nuxt/justshop-frontend/types/product.ts)).
- **Storefront-Core**: Tenant resolution, multi-tenant i18n, and the Dynamic Section Renderer.
- **App-Layer**: Nuxt pages, layouts, and component compositions.
