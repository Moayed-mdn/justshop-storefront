# Storefront Runtime API Contracts

## **1. Architectural Vision**
The Storefront Runtime API is a high-performance, schema-driven interface designed to support dynamic, multi-tenant storefront rendering. It optimizes for **SSR speed**, **CDN cacheability**, and **minimal client-side overhead** by strictly separating route resolution from content delivery.

---

## **2. Core Contracts**

### **A. RouteResolutionResult**
**Endpoint**: `GET /api/v1/storefront/resolve?path={path}`
**Responsibility**: The initial handshake that determines "what" is being requested.

```typescript
interface RouteResolutionResult {
  status: 'matched' | 'not_found' | 'redirect';
  tenant_id: string;
  locale: string;
  type: 'page' | 'product' | 'category' | 'collection';
  resource_id: string | number;
  redirect_url?: string; // For 301/302 redirects
  cache_ttl: number;     // CDN cache hints
}
```

### **B. StorefrontPagePayload**
**Endpoint**: `GET /api/v1/storefront/page/{id}`
**Responsibility**: The complete schema for rendering a storefront page.

```typescript
interface StorefrontPagePayload {
  id: string;
  version: string;
  type: string;
  layout: string;
  seo: SeoPayload;
  theme: ThemePayload;
  tenant: TenantPayload;
  sections: SectionPayload[];
  navigation: NavigationPayload;
  localization: LocalizationPayload;
}
```

### **C. Section & Block Payloads**
**Responsibility**: Presentational data and merchant settings for a UI section.

```typescript
interface SectionPayload {
  id: string;
  type: string; // e.g., 'hero_banner', 'product_grid'
  version: string;
  settings: Record<string, any>; // Merchant-configured props
  blocks: BlockPayload[];
  data_source?: {
    type: string;
    id: string | number;
    initial_data?: any; // Prefetched data for SSR
  };
  lazy_load: boolean;
  error_isolated: boolean;
}

interface BlockPayload {
  id: string;
  type: string;
  content: Record<string, any>;
}
```

### **D. Theme & Tenant Payloads**
**Responsibility**: Visual identity and store configuration.

```typescript
interface ThemePayload {
  id: string;
  tokens: {
    colors: Record<string, string>;
    typography: Record<string, string>;
    spacing: Record<string, string>;
  };
  overrides: {
    custom_css?: string;
    layout_settings?: Record<string, any>;
  };
}

interface TenantPayload {
  id: string;
  name: string;
  domain: string;
  features: string[]; // Enabled platform features
  status: 'active' | 'maintenance' | 'suspended';
}
```

---

## **3. Specialized Payloads**

### **E. SEO & Localization**
```typescript
interface SeoPayload {
  title: string;
  meta: Array<{ name?: string; property?: string; content: string }>;
  json_ld?: Record<string, any>;
  canonical_url: string;
}

interface LocalizationPayload {
  current_locale: string;
  current_currency: string;
  available_locales: string[];
  direction: 'ltr' | 'rtl';
}
```

### **F. Navigation & Preview**
```typescript
interface NavigationPayload {
  header: MenuItem[];
  footer: MenuItem[];
}

interface MenuItem {
  label: string;
  url: string;
  children?: MenuItem[];
  icon?: string;
}

interface PreviewPayload {
  is_preview: boolean;
  draft_version_id?: string;
  preview_token?: string;
}
```

---

## **4. Error & Pagination Contracts**

### **G. ErrorPayload**
```typescript
interface ErrorPayload {
  code: string; // e.g., 'TENANT_NOT_FOUND', 'RESOURCE_DELETED'
  message: string;
  action?: 'redirect_home' | 'show_404' | 'maintenance_mode';
  details?: Record<string, any>;
}
```

### **H. Pagination Contract**
```typescript
interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    next_cursor?: string; // For cursor-based pagination
  };
}
```

---

## **5. Operational Rules**

### **Normalization & Serialization**
- **CamelCase**: All API keys must use camelCase for frontend consistency.
- **Flattened Assets**: Image URLs must be absolute and include CDN base paths.
- **Date Format**: All timestamps must follow ISO 8601.

### **Versioning Rules**
- **Header-based**: `X-Storefront-Version: 2026-05-28`.
- **Breaking Changes**: Incremental versions must be additive. Breaking changes require a new endpoint namespace or major version header.

### **Caching Strategy (CDN)**
- **Route Resolver**: Cached for 5 mins, bypassed on `X-Preview-Token`.
- **Page Payloads**: Cached for 1 hr, invalidated via webhook on merchant "Publish".
- **Tenant Context**: Cached for 24 hrs, invalidated on plan changes.

---

## **6. Hydration & SSR Strategy**

| Payload Component | Delivery Strategy | Reason |
| :--- | :--- | :--- |
| **Route Resolver** | **SSR Only** | Required to determine initial layout/page. |
| **SEO Payload** | **SSR Only** | Critical for Search Engines & Social scrapers. |
| **Theme Tokens** | **SSR Only** | Prevents Flash of Unstyled Content (FOUC). |
| **Tenant Payload** | **SSR Only** | Required for initial context and feature flags. |
| **Initial Sections**| **SSR + Hydration** | Critical "Above the Fold" content. |
| **Below-the-fold** | **Lazy-load** | Reduces initial HTML payload size. |
| **Complex Data** | **Deferred Fetch** | e.g., Related products or heavy search results. |
