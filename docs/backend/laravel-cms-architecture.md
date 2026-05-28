# Laravel CMS Architecture: Storefront Platform Backend

## **1. Architectural Vision**
The Laravel CMS backend serves as the **Content Authority** and **Tenancy Core** for the multi-tenant storefront platform. It provides a structured, versioned, and localized API that the Nuxt runtime consumes to orchestrate storefront rendering.

---

## **2. Database & Model Architecture**

### **Core Tenancy Guard**
Every table in the CMS domain must include a `store_id` to ensure strict data isolation.

### **Entity Inventory**

| Model | Table | Responsibility |
| :--- | :--- | :--- |
| **StoreRoute** | `store_routes` | Maps a URL path to a routable resource (Page, Product, Category). |
| **StorePage** | `store_pages` | Container for page-level metadata and configuration. |
| **StoreSectionInstance** | `store_section_instances` | A specific instance of a UI section on a page with custom settings. |
| **StoreTheme** | `store_themes` | Global theme definitions available to stores. |
| **StoreThemeAssignment** | `store_theme_assignments` | Maps a store to a theme with merchant-specific overrides. |
| **StoreNavigation** | `store_navigation` | Nested menu structures and link lists. |
| **StoreSeo** | `store_seo` | Metadata and social sharing configurations. |
| **StoreVersion** | `store_versions` | Immutable snapshots of pages or configurations for rollback/history. |

---

## **3. Route Resolution System**

### **Table Structure: `store_routes`**
- `id`: Primary Key
- `store_id`: Tenant ID
- `path`: The relative URL (e.g., `about-us`)
- `locale`: Language code
- `routable_type`: Polymorphic type (e.g., `StorePage`, `Product`)
- `routable_id`: Polymorphic ID
- **Index**: `unique(store_id, path, locale)`

### **Resolution Algorithm**
1. **Identify Store**: Resolve `store_id` via host header or internal mapping.
2. **Lookup Path**: `StoreRoute::where('store_id', $id)->where('path', $path)->where('locale', $locale)->first()`.
3. **Resolve Resource**: Eager load the `routable` relationship.
4. **Determine Action**:
   - If `StorePage`: Return full page schema (Layout + Sections).
   - If `Product`/`Category`: Return entity ID for Storefront API lookup.

---

## **4. Dynamic Content Schema**

### **Page Schema (`StorePage`)**
- `id`, `store_id`, `title`, `type` (homepage, blog, etc.)
- `status`: Enum (draft, published, scheduled)
- `layout_handle`: Reference to a theme layout (e.g., `default`, `full-width`)

### **Section Instance Schema (`StoreSectionInstance`)**
- `id`, `store_id`, `page_id`
- `type`: The component handle (e.g., `hero_banner`)
- `sort_order`: Integer for sequencing
- `settings`: **JSON** (Merchant-configured props: colors, text, images)
- `data_source`: **JSON** (Logic configuration: e.g., `{"type": "collection", "id": 45}`)
- `visibility`: JSON (Schedule, Audience rules)

---

## **5. Publishing & Versioning Workflow**

### **Draft vs. Published**
- We use a **State-Based** approach.
- `published_version_id` on `StorePage` points to the active snapshot in `store_versions`.
- **Preview Mode**: The Nuxt runtime passes a `preview_token`. The backend then serves the `draft` state instead of the `published` version.

### **Versioning Strategy**
- **Immutable Snapshots**: Every "Publish" action creates a record in `store_versions`.
- **Payload**: The entire page tree (Page + Sections + SEO) is serialized into a single JSON blob in the version record.
- **Rollback**: Restoring a version simply updates the `draft` state with the version's JSON payload.

---

## **6. API Serialization Strategy**

### **Normalized vs. JSON**
- **Normalized**: Routes, Pages, Theme Assignments, Navigation handles. (Required for high-performance querying and relational integrity).
- **JSON**: Section settings, Block content, SEO OG-data, Theme overrides. (Required for flexibility and "Page Builder" compatibility).

### **Cache Invalidation**
- **Tenant-Keyed**: Cache entries are tagged with `store_{id}`.
- **Event-Driven**: Updating a `StorePage` or `StoreNavigation` triggers a `TaggedCache` clear for that specific tenant.
- **Nuxt Sync**: On publish, an optional webhook notifies the Nuxt runtime to purge its SSR cache for that specific path.

---

## **7. SEO & Localization**

### **Polymorphic SEO**
The `StoreSeo` model is polymorphic (`seoable`), allowing it to attach metadata to Pages, Products, Categories, or even custom Blog posts uniformly.

### **Localization Strategy**
- **Path-Based**: Each language has its own entry in `store_routes`.
- **Resource Linking**: Translated pages are linked via a `translation_group_id` on the `StorePage` model to allow language switching in the UI.

---

## **8. Theme & Layout Assignment**

### **Relationship Model**
- A `Store` has many `StoreThemeAssignments`.
- One assignment is marked `is_active`.
- `custom_config` in the assignment table stores the merchant's theme-editor choices (colors, fonts), which are merged with the theme's `base_config` at runtime.
