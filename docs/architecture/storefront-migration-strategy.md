# Migration Strategy: Storefront Platform Transformation

## **1. Executive Summary**
This document outlines a phased, low-risk migration strategy to transform the existing Nuxt storefront into a multi-tenant storefront runtime platform. The primary goal is to maintain 100% uptime, SEO stability, and performance while incrementally introducing the new architecture.

---

## **2. Migration Architecture: The Dual Runtime**
We will employ a **Dual Runtime** approach where the legacy file-based routing and the new dynamic runtime coexist.

### **Mechanism: Routing Precedence**
Nuxt's router priority ensures that specific file-based routes in `app/pages/` take precedence over catch-all routes.
- **Legacy Path**: `app/pages/login.vue` handles `/login`.
- **Platform Path**: `app/pages/[...slug].vue` handles any path NOT matched by a physical file.

This allows us to migrate pages one by one (e.g., Homepage → CMS Pages → Product Pages) without a "big bang" release.

---

## **3. Migration Phases**

### **Phase 1: Foundation (Non-Destructive)**
*Objective: Prepare the infrastructure for multi-tenancy without changing UI.*
- **Tenant Middleware**: Implement Nitro middleware to resolve `tenant_id` from headers/domain.
- **API Scoping**: Update `useApi` to automatically inject `X-Tenant-Id`.
- **Cache Scoping**: Update all `useAsyncData` keys to include `tenant_id`.
- **Feature Flags**: Introduce a platform-level feature flag system to toggle the new runtime per tenant or per route.

### **Phase 2: Core Runtime & Section Registry**
*Objective: Deploy the rendering engine and registry.*
- **Section Registry**: Create a map of existing components to CMS block types.
- **Layout Manager**: Abstract layouts to support dynamic selection.
- **Catch-all Entry**: Deploy `app/pages/[...slug].vue` with a "Pass-through" logic (if CMS doesn't resolve, return 404).

### **Phase 3: Component De-coupling (Hybrid Mode)**
*Objective: Transform self-fetching components into presentational sections.*
- **Refactor Order**: Start with high-impact, low-complexity sections (Hero, Banners).
- **Compatibility Layer**: Create an "Adapter" that allows the new runtime to inject data into old components while they are being refactored.
- **SEO Preservation**: Ensure `useHead` logic is moved from components to the Route Resolver.

### **Phase 4: Route Migration (Traffic Shift)**
*Objective: Move traffic from static files to the dynamic runtime.*
- **Step 1**: Migrate "Marketing Pages" (e.g., `/about`, `/contact`) to the CMS.
- **Step 2**: Delete physical files in `app/pages/` as their routes are confirmed active in the CMS.
- **Step 3**: Final cutover for complex domains like Checkout and Auth.

---

## **4. Refactor Priorities**

| Task | Priority | Strategy |
| :--- | :--- | :--- |
| **Tenant Resolution** | **MUST REFACTOR FIRST** | Required for all subsequent platform features. |
| **API Header Injection** | **MUST REFACTOR FIRST** | Ensures backend identifies the store context. |
| **Section Data Orchestration** | High | Critical for moving data fetching out of components. |
| **Theme Engine** | Medium | Can run with a "Default Theme" adapter initially. |
| **Auth/Checkout Pages** | **DO NOT TOUCH EARLY** | High risk; migrate only after the rendering engine is stable. |

---

## **5. Safety & Stability Strategies**

### **SSR & Hydration Safety**
- **Payload Serialization**: Ensure tenant context and resolved route data are serialized into `nuxtApp.payload` to prevent hydration mismatches.
- **Static Snapshots**: During migration, run visual regression tests against SSR-rendered HTML to ensure no layout shifts.

### **SEO Preservation**
- **Redirect Mapping**: Maintain a 1:1 mapping of legacy slugs to new CMS slugs.
- **Meta Merging**: The new `[...slug].vue` must replicate the exact metadata patterns used in legacy pages.

### **Rollback Strategy**
- **Route Level**: If a dynamic route fails, the middleware can fall back to the legacy file-based route (if it still exists).
- **Tenant Level**: Revert the `X-Tenant-Id` header to a "Default Store" ID if resolution fails.

---

## **6. Monitoring & Rollout**

- **Canary Rollout**: Enable the new runtime for internal "Sandbox" tenants first.
- **Monitoring**: Track `404` rates and `500` errors on the catch-all route specifically.
- **Preview Staging**: Merchants use a `?preview=true` flag to see the new runtime version of their site before publishing.

---

## **7. Hybrid Coexistence Diagram**

```mermaid
graph TD
    User[User Request] --> NuxtRouter[Nuxt Router]
    NuxtRouter -->|File Exists| Legacy[app/pages/login.vue]
    NuxtRouter -->|No File Match| Platform[[...slug].vue]
    
    subgraph "Platform Runtime"
        Platform --> Resolver[Route Resolver]
        Resolver --> CMS[Laravel CMS]
        CMS --> Engine[Section Rendering Engine]
        Engine --> Registry[Component Registry]
    end
    
    subgraph "Shared Infrastructure"
        Legacy --> StorefrontCore[Storefront Core]
        Platform --> StorefrontCore
        StorefrontCore --> API[Tenant-aware API]
    end
```
