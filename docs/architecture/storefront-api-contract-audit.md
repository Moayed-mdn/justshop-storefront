# API Contract Audit: Storefront Platform

## **Executive Summary**

This audit analyzes the current API contracts between the Nuxt storefront and the Laravel backend. While the project uses a Nitro proxy layer to centralize requests, several architectural risks were identified, including **implicit frontend-owned business logic**, **inconsistent error handling**, and **lack of normalized DTOs (Data Transfer Objects)**. 

To support a multi-tenant platform, the API boundary must shift from a simple proxy to a robust **Storefront API Orchestration Layer**.

---

## **Endpoint Inventory & Ownership**

| Endpoint (Nitro) | Backend Path (Laravel) | Method | Primary Owner | Responsibility |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/login` | `auth/login` | POST | `useAuth` | Session initiation & token issuance. |
| `/api/products` | `products` | GET | `useProduct` | Catalog discovery & filtering. |
| `/api/cart` | `cart` | GET | `useCartStore` | Server-side cart retrieval. |
| `/api/cart/items` | `cart/items` | POST | `useCartStore` | Item addition with backend validation. |
| `/api/checkout/session`| `checkout/session` | POST | `useCheckout` | Stripe session creation (Guest). |
| `/api/orders` | `orders` | GET | `useOrders` | Customer order history. |
| `/api/search` | GraphQL Engine | POST | `apollo.client.ts` | External search indexing (Apollo). |

---

## **Contract Analysis**

### **1. Request/Response Shapes**
- **Inconsistency**: Pagination metadata varies between endpoints. Standard products use `meta.pagination` ([api.ts](file:///home/leader/projects/nuxt/justshop-frontend/types/api.ts)), while some legacy types use `pagination` at the root ([shopLayout.ts](file:///home/leader/projects/nuxt/justshop-frontend/types/api/shopLayout.ts)).
- **Normalization Gap**: Response objects like `ProductCard` ([product.ts](file:///home/leader/projects/nuxt/justshop-frontend/types/product.ts)) include UI-specific fields (e.g., `primary_image` as a full URL). This couples the backend to frontend asset resolution logic.

### **2. Auth & Session Flows**
- **Implicit Contract**: The frontend assumes the backend will handle cart merging upon login, but `useCartStore` also manually iterates through `guestCart` items to call `addItem` repeatedly ([cart.ts:L305](file:///home/leader/projects/nuxt/justshop-frontend/app/stores/cart.ts#L305)). This is an **N+1 request anti-pattern**.
- **Risk**: Token expiration is handled reactively in `useApi.ts`. A proactive "Silent Refresh" contract is missing.

### **3. Frontend-Owned Business Logic**
- **Cart Recalculation**: `cartHelpers.recalculateGuestCart` ([cart.ts:L54](file:///home/leader/projects/nuxt/justshop-frontend/app/stores/cart.ts#L54)) duplicates backend pricing logic. In a multi-tenant platform, taxes, discounts, and shipping rules are too complex for the frontend to mirror accurately.
- **Filter Mapping**: `useProductFilters` ([useProductFilters.ts](file:///home/leader/projects/nuxt/justshop-frontend/app/composables/useProductFilters.ts)) manually maps UI state to API query parameters (e.g., `min_price`).

---

## **Detected Risks & Inconsistencies**

| Risk Area | Severity | Detection |
| :--- | :--- | :--- |
| **Error Handling** | 🟡 Medium | `useApi.ts` uses `useAppToast` for some errors but returns `null` for others, leading to inconsistent UI feedback. |
| **Pricing** | 🔴 High | `formatPrice` ([price.ts](file:///home/leader/projects/nuxt/justshop-frontend/app/utils/price.ts)) defaults to `USD`. In a multi-tenant app, currency must be derived from the tenant context. |
| **Localization** | 🟡 Medium | `Accept-Language` is injected via `useCookie('i18n_redirected')`. If the cookie is missing, the backend may default to an incorrect locale. |
| **Coupling** | 🔴 High | UI components expect specific object keys (e.g., `product_name`). If the backend renames a column, the entire UI breaks due to lack of an abstraction layer (DTO). |

---

## **Architectural Recommendations**

### **1. Storefront API Boundary (`/api/storefront/*`)**
We recommend introducing a dedicated `/api/storefront/` namespace in Nitro to serve as an **Orchestration Layer**.
- **Role**: Aggregate data from multiple backend services (Laravel, CMS, Search).
- **Benefit**: Shields the frontend from backend structural changes.

### **2. DTO Strategy (Data Transfer Objects)**
- **Recommendation**: Implement a `transform` layer in Nitro server routes. 
- **Example**: Instead of passing the raw Laravel model, Nitro should map it to a standardized `StorefrontProduct` type.

### **3. Versioning & Stability**
- **Recommendation**: Implement header-based versioning (e.g., `X-API-Version: 2026-05`). 
- **Requirement**: For a platform, never make breaking changes to the `/api/storefront/` contract without a 6-month deprecation period.

### **4. Pagination & Normalization**
- **Recommendation**: Standardize on the `ApiPaginated` envelope defined in `types/api.ts` for ALL listing endpoints.
- **Action**: Deprecate root-level `pagination` objects found in `types/api/shopLayout.ts`.

---

## **Ownership Matrix**

| Responsibility | Current Owner | Recommended Owner |
| :--- | :--- | :--- |
| **Tenant Resolution** | None | Nitro Middleware |
| **Data Transformation** | Composables | Nitro Server Routes |
| **Error Normalization** | `useApi.ts` | Nitro `onResponseError` |
| **Pricing Logic** | Frontend + Backend | Backend Only (Frontend just displays) |
| **Localization Sync** | `useApi.ts` | Nitro Middleware |
