# Storefront Routing & Runtime Architecture Audit

## **Executive Summary**

This audit evaluates the current Nuxt routing and rendering architecture against the requirements for a Shopify-like multi-tenant storefront runtime. The current system is heavily reliant on **static file-based routing** and **hardcoded component ownership**, which presents a significant barrier to merchant-managed dynamic content and a flexible theme engine.

---

## **Current Architecture Audit**

### **1. Pages Architecture & Route Ownership**
- **Static Ownership**: Routes are owned by the filesystem (e.g., `app/pages/products/product/[slug].vue`). This creates a rigid hierarchy where "Page Types" are fixed at compile-time.
- **Route Conflicts**: Current structure (e.g., `/products/category/[slug]` vs `/products/product/[slug]`) is verbose and non-SEO friendly compared to standard e-commerce patterns like `/[category-slug]/[product-slug]`.
- **Ownership Leakage**: Individual page components (e.g., [product/[slug].vue](file:///home/leader/projects/nuxt/justshop-frontend/app/pages/products/product/%5Bslug%5D.vue)) own their own data fetching and state management, making it impossible for a CMS to override or reorder sections on these pages.

### **2. Rendering & SSR Behavior**
- **Hybrid Rendering**: Nuxt uses Universal Rendering (SSR + Hydration).
- **SEO Ownership**: Distributed across `app.vue` and individual pages using `useHead`. There is no centralized SEO engine to resolve metadata from a tenant/CMS context.
- **Middleware**: Used for Auth/Guest gating ([auth.ts](file:///home/leader/projects/nuxt/justshop-frontend/app/middleware/auth.ts)). It is currently tenant-unaware.

### **3. Localization Routing**
- **Strategy**: `prefix_except_default` via `@nuxtjs/i18n`.
- **Risk**: Localization is handled at the URL level, but the actual content resolution (slugs) isn't synchronized with the merchant's localized CMS entries in a dynamic way.

### **4. Route Scalability Risks**
- **Multi-tenancy Gap**: There is no mechanism to resolve routes based on the request domain or a `tenant_id`. All tenants would share the same route structure and page logic.
- **Dynamic Slug Limitation**: Standard Nuxt routing cannot resolve "vanity URLs" (e.g., `/black-friday-sale`) without a dedicated file or a complex regex-based router configuration.

---

## **Proposed Architecture: Storefront Platform Runtime**

To support a dynamic, multi-tenant storefront, the architecture must move toward a **Resolver-based Runtime**.

### **1. Future Dynamic Route Resolution**
Introduce a **Catch-all Route Handler** (`app/pages/[...slug].vue`) that serves as the entry point for all storefront requests.

```mermaid
graph TD
    Request[Incoming URL /slug] --> Resolver[Route Resolver Middleware]
    Resolver -->|Identify Tenant| Context[Tenant Context]
    Resolver -->|Query Backend| API[Laravel Route API]
    API -->|Return| RouteData[Route Metadata: Type, EntityID, Template]
    RouteData -->|Inject| CatchAll[[...slug].vue]
    CatchAll -->|Switch| Layout[Dynamic Layout Manager]
```

### **2. Page Resolver Strategy**
- **Route API**: A backend endpoint (e.g., `GET /api/v1/resolve-route?path=/my-product`) that returns the resource type (`product`, `category`, `cms_page`) and the corresponding ID.
- **Runtime Resolution**: The frontend resolves the resource type to a specific **Page Template** and **Layout**.

### **3. Storefront Rendering Pipeline (Section Rendering)**
Instead of hardcoded pages, templates will use a **Section Renderer** to loop through a merchant's configured sections.

```vue
<!-- Proposed Structure for [...slug].vue -->
<template>
  <component :is="resolvedLayout">
    <SectionRenderer :sections="pageData.sections" />
  </component>
</template>
```

### **4. SEO Rendering Ownership**
- **Centralized SEO Engine**: A global utility or Nitro plugin that merges tenant-level SEO (Site Title, Icon) with entity-level SEO (Product Meta) fetched during the route resolution phase.

### **5. Tenant-Aware Routing**
- **Domain Mapping**: Middleware to map `request.url.hostname` to a `tenant_id`.
- **Scoped Cache**: All Nuxt `useAsyncData` keys must be prefixed with the `tenant_id` to prevent cross-tenant cache leakage.

---

## **Implementation Roadmap (Phased)**

| Phase | Component | Action |
| :--- | :--- | :--- |
| **Phase 1** | **Tenant Resolver** | Nitro middleware to inject `tenant_id` into H3 context. |
| **Phase 2** | **Route Resolver** | Implement `[...slug].vue` to fetch route type from Laravel. |
| **Phase 3** | **Section Registry** | Map CMS "Block Names" to Vue components in `app/components/sections/`. |
| **Phase 4** | **Dynamic Layouts** | Support for merchant-selectable layouts (e.g., `minimal`, `full-width`). |

---

## **Safe to Postpone vs. Must Fix Now**

| Task | Priority | Rationale |
| :--- | :--- | :--- |
| **Tenant Context Injection** | **MUST FIX NOW** | Foundation for all multi-tenant logic. |
| **SEO Centralization** | **MUST FIX NOW** | Critical for platform-wide SEO performance. |
| **Catch-all Route Entry** | **MUST FIX NOW** | Required to break away from file-based limitations. |
| **Visual Theme Editor** | Safe to Postpone | Merchants can use preset themes via CSS variables initially. |
| **Advanced Page Builder** | Safe to Postpone | Can start with basic "Sections" before full drag-and-drop. |
