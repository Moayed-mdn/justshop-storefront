# Storefront Template-Everything Refactoring Plan

## Making Every Page Merchant-Controllable (Shopify-Style)

---

## Status

- **Status:** Draft — planning phase
- **Scope:** All three apps — backend (Laravel), admin (Next.js), storefront (Nuxt)
- **Goal:** Eliminate ALL hardcoded pages/sections — every storefront surface becomes template/section/block-driven
- **Relationship to existing plans:** This is a MAJOR new initiative that builds on the runtime foundation. The existing programs established runtime rendering for CMS pages. This program extends that pattern to **every page** and **every layout area**.

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Target Architecture](#2-target-architecture)
3. [Three-App Consistency Model](#3-three-app-consistency-model)
4. [Phase 0: Foundation — Shared Contracts & Type Alignment](#4-phase-0-foundation)
5. [Phase 1: Backend — Unified Template & Section System](#5-phase-1-backend)
6. [Phase 2: Admin — System Page Editors & Section Groups](#6-phase-2-admin)
7. [Phase 3: Storefront — System Pages Become Templates](#7-phase-3-storefront)
8. [Phase 4: Theme Settings Expansion](#8-phase-4-theme-settings)
9. [Phase 5: Blocks & Metaobjects](#9-phase-5-blocks-metaobjects)
10. [Phase 6: Legacy Retirement & Verification](#10-phase-6-legacy-retirement)

---

## 1. Current State Assessment

### What the merchant CAN control today

| Feature | Backend | Admin UI | Storefront Rendering |
|---|---|---|---|
| Colors (primary, secondary, etc.) | Theme.settings.colors | Theme Settings > Colors | themeTokens.ts → CSS vars |
| Fonts | Theme.settings.fonts | Theme Settings > Typography | Google Fonts link |
| Button styles | Theme.settings.buttons | Theme Settings > Buttons | CSS variables |
| Color schemes | Theme.settings.color_schemes | Theme Settings > Color Schemes | colorScheme.ts |
| Navigation menus | NavigationMenu + Items | Navigation Editor | StorefrontShellHeader/Footer |
| Theme assets (logo, favicon, images) | StoreAsset | Theme Assets | Asset URLs in theme |
| CMS marketing pages | StoreMarketingPage + Sections | CMS Pages > Content Builder | [...slug].vue → SectionRenderer |
| Page templates | PageTemplate (legacy JSON model) | Page Templates | TemplateResolutionService |
| Section schemas | SectionSchema (definition only) | — (read-only for page templates) | SectionDataResolverService |

### What the merchant CANNOT control (19 pages + 8 shell areas + 14 settings)

**Pages with zero admin control:** cart, checkout/success, checkout/cancel, login, register, forgot-password, reset-password, verify-email, profile, orders, orders/detail, orders/track, search, categories, shop, shop/category, shop/product, 404, hero-banners (legacy)

**Shell areas:** topbar (phone, promo text), header logo assignment, header links fallback, footer info/description, footer link lists, footer bottom bar, accepted payments icons, social media links

**Global settings:** logo_url, favicon_url assignment, store tagline, RTL/LTR direction, global border radius, container width, default SEO meta, search placeholder, products per page, empty states / 404 content, cookie consent bar, maintenance mode, custom CSS/JS

---

## 2. Target Architecture

### Hierarchical Model (Shopify Online Store 2.0)

```
Theme
├── config/settings_schema.json   → Global theme settings (logo, favicon, colors, fonts, etc.)
├── layout/
│   ├── theme.liquid               → Layout file with section groups
│   └── customers/                 → Customer account layout
├── sections/
│   ├── header-group.json          → Section group for header (announcement bar, header, etc.)
│   ├── footer-group.json          → Section group for footer (footer, copyright, etc.)
│   └── *.liquid                   → Individual section files
├── blocks/
│   └── *.liquid                   → Reusable theme blocks
├── templates/
│   ├── index.json                 → Home page template
│   ├── product.json               → Product page template
│   ├── collection.json            → Category/collection page template
│   ├── cart.json                  → Cart page template
│   ├── search.json                → Search page template
│   ├── page.json                  → CMS/marketing page template
│   ├── customers/
│   │   ├── login.json             → Login page template
│   │   ├── register.json          → Register page template
│   │   ├── account.json           → Profile/account page template
│   │   └── order.json             → Order detail page template
│   └── 404.json                   → 404 page template
└── config/
    └── settings_data.json         → Saved setting values
```

### Our Mapped Architecture

```
Theme
├── settings (JSON column)         → Global theme settings merged from schemas
├── sectionGroups (new model)      → header-group, footer-group (JSON containers)
│   ├── sections []                → List of section references by template_section pivot
│   └── order []                   → Ordered list of section IDs
├── templates (ThemeTemplate)      → One per page type
│   ├── type (TemplateTypeEnum)    → home, product, category, cart, search, page,
│   │                                login, register, account, order, 404, etc.
│   ├── sections []                → BelongsToMany via pivot (position, settings overrides)
│   └── order []                   → Section order array
├── templateSections (*)           → Sections belong to theme, referenced by templates
│   ├── settings (JSON)            → Default section settings
│   ├── blocks [] (new)            → Blocks within a section (settings, content)
│   └── type (SectionTypeEnum)     → Section type identifier
├── sectionSchemas (standalone)    → Schema definitions for each section type
│   ├── settings []                → Setting definitions (id, label, type, default)
│   ├── blocks []                  → Block definitions (type, name, settings)
│   └── presets []                 → Default preset configurations
└── store assets                   → Logo, favicon, images
```

---

## 3. Three-App Consistency Model

### Shared Contract: `TemplateTypeEnum`

This enum MUST be identical in meaning across all three apps:

| Value | Page | Storefront Route |
|---|---|---|
| `home` | Homepage | `/` |
| `product` | Product detail | `/shop/product/{slug}` |
| `category` | Category listing | `/shop/category/{slug}` |
| `collection` | Collection (legacy) | `/shop/collection/{slug}` |
| `cart` | Shopping cart | `/cart` |
| `checkout` | Checkout | `/checkout/*` |
| `checkout_success` | Order success | `/checkout/success` |
| `checkout_cancel` | Order cancelled | `/checkout/cancel` |
| `search` | Search results | `/search` |
| `page` | CMS/marketing page | `/{slug}` |
| `login` | Customer login | `/login` |
| `register` | Customer registration | `/register` |
| `forgot_password` | Password reset request | `/forgot-password` |
| `reset_password` | Password reset confirm | `/reset-password` |
| `verify_email` | Email verification | `/verify-email/{id}/{hash}` |
| `account` | Customer profile | `/profile` |
| `orders` | Order history | `/orders` |
| `order` | Single order detail | `/orders/{orderNumber}` |
| `order_track` | Guest order tracking | `/orders/track` |
| `categories` | All categories | `/categories` |
| `blog` | Blog listing | `/blog` |
| `blog_post` | Blog article | `/blog/{slug}` |
| `error_404` | Not found | `/*` (fallback) |
| `error_500` | Server error | — |
| `header_group` | Section group (not a page) | Layout-level |
| `footer_group` | Section group (not a page) | Layout-level |

### Shared Contract: `SectionSchema`

Every section type has a schema definition that all three apps understand:

```typescript
// Backend (PHP array) / Admin (TypeScript) / Storefront (TypeScript)
interface SectionSchemaDefinition {
  type: string;                    // e.g. "hero", "product-grid", "header"
  name: string;                    // Display name
  description?: string;
  category: 'layout' | 'content' | 'commerce';
  settings: SettingDefinition[];   // Dynamic form fields
  blocks?: BlockDefinition[];      // Child block types this section accepts
  presets?: Preset[];              // Default configurations
  enabled_on?: TemplateType[];     // Which template types can use this section
  disabled_on?: TemplateType[];
}

interface SettingDefinition {
  type: 'text' | 'textarea' | 'richtext' | 'number' | 'checkbox' 
      | 'select' | 'color' | 'image_picker' | 'url' | 'link_list'
      | 'range' | 'header' | 'paragraph';
  id: string;
  label: string;
  default?: unknown;
  options?: { value: string; label: string }[];
  placeholder?: string;
  info?: string;
}

interface BlockDefinition {
  type: string;                    // e.g. "slide", "link", "social-icon"
  name: string;
  limit?: number;
  settings: SettingDefinition[];
}
```

### Shared Contract: `ThemeSettings` (Expanded)

```typescript
interface ThemeSettings {
  // Existing
  colors: { primary, secondary, accent, background, text, textMuted, border, success, error, warning };
  typography: { headingFont, bodyFont, headingWeight, bodyWeight, baseFontSize, lineHeight, letterSpacing };
  buttons: { primary, secondary, outline };
  color_schemes: Record<string, ColorScheme>;

  // NEW — moving from hardcoded/static to theme-controlled
  branding: {
    logo_url: string | null;       // From StoreAsset
    favicon_url: string | null;
    store_name: string;
    tagline: string;
  };
  layout: {
    container_width: 'boxed' | 'full_width';
    page_width: string;            // e.g. "1280px"
    border_radius: string;
    direction: 'ltr' | 'rtl';
  };
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    linkedin?: string;
    pinterest?: string;
  };
  topbar: {
    show_topbar: boolean;
    phone: string;
    announcement_text: string;
    announcement_link: string;
  };
  footer: {
    show_newsletter: boolean;
    copyright_text: string;
    payment_icons: string[];       // Which payment methods to show
  };
  seo: {
    default_title: string;
    default_description: string;
    default_og_image: string;
  };
  search: {
    placeholder: string;
    show_suggestions: boolean;
    products_per_page: number;
  };
  maintenance: {
    enabled: boolean;
    message: string;
  };
  custom_css: string;
  custom_js: string;
}
```

### Data Flow: Three-App Consistency

```
Admin (Next.js)                 Backend (Laravel)              Storefront (Nuxt)
─────────────────               ────────────────               ─────────────────
User edits                      
  template                                                                     
       │                                                                       
       ▼                                                                       
PUT /templates/{id} ─────────► ThemeTemplateController                        
       │                         • validates                                  
       │                         • stores to DB                               
       │                         • returns saved                              
       │                                                                       
       ▼                                                                       
User saves                                                                     
  theme settings                                                              
       │                                                                       
       ▼                                                                       
PUT /themes/{id}/ ────────────► ThemeController::updateSettings              
  settings                      • validates schema                             
                                • stores settings JSON                        
                                • clears runtime cache                         
                                                                               
                                  GET /runtime/ ────────────────► [...slug].vue
                                    theme                                     │
                                  GET /runtime/ ──────────────────► LayoutManager
                                    page/{id}                     SectionRenderer
                                  GET /runtime/ ──────────────────► StorefrontShell
                                    navigation                    (header/footer
                                                                   from section groups)
```

### Shared Type Files (Key Principle)

**The type definitions for template, section, block, and theme settings must be defined ONCE and shared:**

1. **Backend (Source of Truth):**
   - PHP enums: `TemplateTypeEnum`, `SectionTypeEnum`, `BlockTypeEnum`
   - PHP DTOs: `ResolvedTemplate`, `ResolvedSection`, `ResolvedBlock`
   - JSON Schema: `SectionSchema.settings` (stored as JSON, consumed by all)

2. **Admin (TypeScript):**
   - Generate or manually sync types from backend contracts
   - `src/types/theme.ts` — `TemplateView`, `SectionView`, `BlockView`, `ThemeSettings`
   - `src/types/schema.ts` — `SectionSchemaDefinition`, `SettingDefinition`, `BlockDefinition`

3. **Storefront (TypeScript):**
   - `types/` or `src/core/runtime/types.ts` — `RuntimeTemplate`, `RuntimeSection`, `RuntimeBlock`
   - `app/utils/themeTokens.ts` — Token extraction (already exists, needs expansion)

---

## 4. Phase 0: Foundation — Shared Contracts & Type Alignment

### Duration: 2 weeks

### Backend Tasks

1. **Extend `TemplateTypeEnum`** — Add all system page types (cart, search, login, register, account, order, 404, etc.)

2. **Extend `SectionTypeEnum`** — Add types for system-page-specific sections:
   - `cart_items`, `cart_summary`, `cart_empty`
   - `search_form`, `search_results`, `search_filters`
   - `login_form`, `register_form`, `reset_password_form`
   - `account_profile`, `account_orders`, `account_addresses`
   - `order_details`, `order_tracking`

3. **Create `ThemeSectionGroup` model** — New model for header-group and footer-group:
   ```php
   Schema::create('theme_section_groups', function (Blueprint $table) {
       $table->id();
       $table->foreignId('theme_id')->constrained()->cascadeOnDelete();
       $table->string('name');         // 'header-group', 'footer-group'
       $table->string('handle');       // 'header', 'footer'
       $table->json('sections');       // { "section-id": { "type": "...", "settings": {...} } }
       $table->json('order');          // ["section-id-1", "section-id-2"]
       $table->timestamps();
   });
   ```

4. **Create `ThemeBlockInstance` model** (separate from schema-level `BlockDefinition`):
   ```php
   Schema::create('theme_block_instances', function (Blueprint $table) {
       $table->id();
       $table->morphs('container');    // section_id OR template_section pivot
       $table->string('type');         // Block type identifier
       $table->string('name');
       $table->json('settings');
       $table->json('content');
       $table->integer('position');
       $table->boolean('is_enabled')->default(true);
       $table->timestamps();
   });
   ```

5. **Merge `PageTemplate` into `ThemeTemplate`**:
   - Add migration to copy all `PageTemplate` records into `ThemeTemplate` with `theme_id = store.active_theme_id`
   - Add `type` column to `ThemeTemplate` (already exists as `TemplateTypeEnum`)
   - Add JSON `section_order` column to pivot or store on `ThemeTemplate` directly
   - Create `StoreMarketingPage.template_id` FK to `ThemeTemplate` (replace `page_template_id`)
   - Mark `PageTemplate` model as deprecated

6. **Add `store_id` to `SectionSchema`** (optional per-store overrides) or keep it global

7. **Expand `Theme.settings` JSON schema** to include branding, layout, social, topbar, footer, seo, search, maintenance, custom_css fields

### Admin Tasks

1. **Consolidate duplicate type definitions:**
   - Deduplicate `ButtonSettings` (currently in 2 places)
   - Deduplicate `ColorSettings` (currently in 3 places)
   - Deduplicate `TypographySettings` (currently in 2 places)
   - Create shared source of truth: `src/types/theme.ts`

2. **Create new type files:**
   - `src/types/template.ts` — Template and template-section types
   - `src/types/block.ts` — Block instance types
   - `src/types/section-group.ts` — Header/footer section group types
   - `src/types/schema.ts` — Shared schema definition types

3. **Add `TemplateTypeEnum` constant/type** matching backend

4. **Consolidate the two theme settings editors** (`/merchant/theme/settings/[id]` and `/merchant/themes/[id]/settings`) into one

### Storefront Tasks

1. **Create shared type definitions** mirroring backend contracts:
   - `RuntimeTemplate` — template with sections, section order
   - `RuntimeSectionGroup` — header/footer group with sections
   - `RuntimeBlock` — block instance with type, settings, content

2. **Align `cssInjector.ts` or `themeTokens.ts`** to handle expanded theme settings

### Verification

- [ ] Backend `TemplateTypeEnum` contains ALL page types
- [ ] `ThemeSectionGroup` migration runs cleanly
- [ ] `ThemeBlockInstance` migration runs cleanly
- [ ] `PageTemplate` → `ThemeTemplate` migration copies all data without loss
- [ ] Admin builds without type errors after deduplication
- [ ] Storefront builds with new type definitions
- [ ] All three apps agree on `TemplateTypeEnum` values

---

## 5. Phase 1: Backend — Unified Template & Section System

### Duration: 3-4 weeks

### API Endpoints

#### New/Extended Endpoints

| Method | Endpoint | Purpose | Current Status |
|---|---|---|---|
| `GET` | `/merchant/themes/{theme}/section-groups` | List header/footer section groups | **New** |
| `PUT` | `/merchant/themes/{theme}/section-groups/{group}` | Update section group content | **New** |
| `GET` | `/merchant/themes/{theme}/templates` | List ALL templates (all types) | Exists (partial) |
| `POST` | `/merchant/themes/{theme}/templates` | Create template of any type | Exists |
| `GET` | `/merchant/templates/{template}` | Get template with sections | Exists |
| `PUT` | `/merchant/templates/{template}` | Update template (type, sections, order) | Exists (needs expansion) |
| `POST` | `/merchant/templates/{template}/duplicate` | Duplicate template | Route exists, needs impl |
| `GET` | `/merchant/templates/types` | List all available template types | **New** |
| `GET` | `/merchant/templates/system` | List system page templates (cart, search, auth, etc.) | **New** |
| `GET` | `/merchant/themes/{theme}/sections/{section}/blocks` | List blocks in a section | Exists (ThemeBlock) |
| `POST` | `/merchant/themes/{theme}/sections/{section}/blocks` | Create block instance | Exists |
| `PUT` | `/merchant/themes/{theme}/sections/{section}/blocks/{block}` | Update block | Exists |
| `DELETE` | `/merchant/themes/{theme}/sections/{section}/blocks/{block}` | Delete block | Exists |
| `POST` | `/merchant/themes/{theme}/sections/{section}/blocks/reorder` | Reorder blocks | Exists |

#### Runtime Endpoints (Storefront-facing)

| Method | Endpoint | Purpose | Change |
|---|---|---|---|
| `GET` | `/runtime/resolve` | Resolve path to route type | Already returns type — extend to cover ALL types |
| `GET` | `/runtime/page/{id}` | Get page payload for CMS pages | Keep as-is |
| `GET` | `/runtime/template/{type}` | Get template of a specific type | **New** — returns template JSON for system pages |
| `GET` | `/runtime/section-groups` | Get header/footer section groups | **New** — returns current theme's header/footer |
| `GET` | `/runtime/theme` | Get active theme | Extend to return expanded settings |
| `GET` | `/runtime/navigation` | Get navigation | Keep as-is |

### Key Backend Changes

#### 1. `StorefrontRuntimeController` — System Page Templates

Add method to return a resolved template for any page type:
```php
public function templateByType(Request $request, string $type): JsonResponse
{
    $store = $this->resolveStore($request);
    $theme = $store->activeTheme;
    
    $template = $theme->templates()
        ->where('type', $type)
        ->where('is_default', true)
        ->first();
    
    if (!$template) {
        // Return a default template with no sections
        // (the frontend will render its fallback UI)
        $template = $this->createDefaultTemplate($theme, $type);
    }
    
    return response()->json([
        'data' => $this->resolveTemplateService->buildTemplateResponse($template),
    ]);
}
```

#### 2. `TemplateResolutionService` — System Template Resolution

Extend `resolveSystemPageTemplate()` to handle all template types:
```php
public function resolveSystemPageTemplate(
    int $storeId, 
    string $type,           // 'cart', 'login', 'search', etc.
    ?int $resourceId = null // Optional resource ID (e.g. order number)
): ResolvedTemplate
```

#### 3. `SectionDataResolverService` — System Page Data Resolver

Add resolvers for system page sections:
```php
private function resolveCartSectionData(array $settings, Store $store, string $locale): array
{
    // Returns section settings only — cart items come from the frontend's cart composable
    return [
        'show_breadcrumb' => $settings['show_breadcrumb'] ?? true,
        'show_header' => $settings['show_header'] ?? true,
        'empty_state_message' => $settings['empty_state_message'] ?? null,
        'show_continue_shopping' => $settings['show_continue_shopping'] ?? true,
    ];
}

private function resolveSearchSectionData(array $settings, Store $store, string $locale): array
{
    return [
        'placeholder' => $settings['placeholder'] ?? null,
        'show_categories' => $settings['show_categories'] ?? true,
        'show_brands' => $settings['show_brands'] ?? true,
        'products_per_page' => $settings['products_per_page'] ?? 12,
    ];
}

private function resolveLoginSectionData(array $settings, Store $store, string $locale): array
{
    return [
        'show_oauth' => $settings['show_oauth'] ?? true,
        'show_register_link' => $settings['show_register_link'] ?? true,
        'show_forgot_password' => $settings['show_forgot_password'] ?? true,
        'header_text' => $settings['header_text'] ?? null,
    ];
}
```

#### 4. `SectionDataResolverService` — Section Group Data

Add resolver for header/footer section groups:
```php
public function resolveSectionGroupData(
    string $groupHandle,     // 'header' or 'footer'
    Theme $theme,
    Store $store,
    string $locale
): array
{
    $group = $theme->sectionGroups()->where('handle', $groupHandle)->first();
    if (!$group) {
        return $this->getDefaultSectionGroup($groupHandle, $theme, $store, $locale);
    }
    
    $resolved = [];
    foreach ($group->order as $sectionId) {
        $sectionConfig = $group->sections[$sectionId] ?? null;
        if (!$sectionConfig) continue;
        
        $resolved[] = [
            'id' => $sectionId,
            'type' => $sectionConfig['type'],
            'data' => $this->resolveSectionData(
                $sectionConfig['type'],
                $sectionConfig['settings'] ?? [],
                $store,
                $locale
            ),
        ];
    }
    
    return [
        'handle' => $groupHandle,
        'sections' => $resolved,
    ];
}
```

#### 5. Default Templates/Seeders

Create default templates for each system page type so merchants get a working store out of the box:

- **`cart.json`**: `CartItemsSection` + `CartSummarySection`
- **`search.json`**: `SearchFormSection` + `SearchResultsSection` + `SearchFiltersSection`
- **`login.json`**: `LoginFormSection`
- **`register.json`**: `RegisterFormSection`
- **`account.json`**: `AccountProfileSection` + `AccountOrdersSection`
- **`order.json`**: `OrderDetailSection`
- **`404.json`**: `Error404Section`

Default header group: `AnnouncementBarSection` + `HeaderSection`
Default footer group: `FooterSection` + `CopyrightSection`

### Verification

- [ ] All system page template types exist in DB seeder
- [ ] `GET /runtime/template/{type}` returns valid template JSON for every type
- [ ] `GET /runtime/section-groups` returns header and footer section groups
- [ ] Default templates render meaningful content (not empty)
- [ ] Old `PageTemplate` migration completes without data loss
- [ ] Backend tests pass for all new endpoints

---

## 6. Phase 2: Admin — System Page Editors & Section Groups

### Duration: 4-5 weeks

### New Admin Pages/Routes

| Route | Component | Purpose |
|---|---|---|
| `/merchant/templates/system` | `SystemTemplatesContent` | List all system page templates (cart, search, auth, etc.) |
| `/merchant/templates/system/{type}/edit` | `SystemTemplateEditor` | Edit template for a specific system page type |
| `/merchant/theme/section-groups` | `SectionGroupsContent` | Edit header/footer section groups |
| `/merchant/theme/section-groups/{handle}` | `SectionGroupEditor` | Add/remove/reorder sections in header or footer |
| `/merchant/theme/branding` | `BrandingSettings` | Logo, favicon, store name, tagline |
| `/merchant/theme/layout` | `LayoutSettings` | Container width, border radius, direction |
| `/merchant/theme/social` | `SocialLinksSettings` | Social media links |
| `/merchant/theme/topbar` | `TopbarSettings` | Announcement bar, phone, promo text |
| `/merchant/theme/footer-content` | `FooterContentSettings` | Copyright text, payment icons |
| `/merchant/theme/seo` | `SeoSettings` | Default meta title/description |
| `/merchant/theme/search-settings` | `SearchSettingsEditor` | Search placeholder, products per page |
| `/merchant/theme/maintenance` | `MaintenanceSettings` | Maintenance mode toggle |
| `/merchant/theme/custom-code` | `CustomCodeEditor` | Custom CSS/JS injection |

### Key UI Components to Build

#### 1. `SystemTemplateEditor`

Reuses the existing `PageTemplateEditContent` component pattern but:
- Pre-selects the template type (not user-choosable)
- Shows a preview of the page type (cart, search, login, etc.)
- Lists available sections filtered by `enabled_on` for that template type
- Shows section settings form (reusing `SectionSettingsForm`)
- Shows section order (drag-to-reorder)

#### 2. `SectionGroupEditor`

New component for header/footer:
- Visual preview of header or footer area
- Add section button (dropdown of available section types)
- Each section has: expand/collapse, settings form, move up/down, remove
- Sections: announcement-bar, header-logo, header-nav, header-search, header-cart, etc.
- Same component structure as section list in `PageTemplateEditContent`

#### 3. `SectionSettingsForm` Expansion

Extend the existing `SectionSettingsForm` to support ALL setting types:
- `richtext` — Rich text editor (TinyMCE or similar)
- `image_picker` — Image picker from theme assets
- `url` — URL input with validation
- `range` — Slider with min/max
- `color` — Color picker (already exists)
- `header` — Section header (non-editable)
- `paragraph` — Info text (non-editable)

#### 4. Consolidated Theme Settings

Merge the two existing theme settings editors into one:
- Tab 1: Colors (primary, secondary, accent, background, text, etc.)
- Tab 2: Color Schemes (existing `ColorSchemeManager`)
- Tab 3: Typography (heading + body fonts, weights, sizes)
- Tab 4: Buttons (primary, secondary, outline styles)
- Tab 5: Branding (logo upload, favicon, store name, tagline)
- Tab 6: Layout (container width, border radius, direction)
- Tab 7: Social (social media links)
- Tab 8: Topbar (show/hide, phone, announcement text)
- Tab 9: Footer Content (copyright, payment icons)
- Tab 10: SEO (default meta title/description)
- Tab 11: Search (placeholder, products per page)
- Tab 12: Custom Code (CSS/JS injection)
- Tab 13: Maintenance (toggle + message)

### API Integration

All new page components use existing CRUD patterns:
- `useThemeSettings` hook (extend for new settings fields)
- `useSystemTemplates` hook (new — wraps template API for system pages)
- `useSectionGroups` hook (new — CRUD for header/footer groups)
- `useStoreSettings` hook (for logo, favicon, store name)

### Verification

- [ ] Admin can edit cart page template (add/remove sections)
- [ ] Admin can edit login page template
- [ ] Admin can edit header section group (add announcement bar, reorder sections)
- [ ] Admin can edit footer section group
- [ ] Admin can upload and assign logo (branding settings)
- [ ] Admin can set social media links
- [ ] Admin can customize topbar text
- [ ] Admin can inject custom CSS
- [ ] All settings persist to backend via API
- [ ] TypeScript compiles without errors

---

## 7. Phase 3: Storefront — System Pages Become Templates

### Duration: 4-5 weeks

### Rendering Pipeline Changes

**Current pipeline for system pages:**
```
app.vue → NuxtLayout → HardcodedPage.vue (cart, login, etc.)
```

**Target pipeline for ALL pages:**
```
app.vue → NuxtLayout → StorefrontShell (reads section groups)
                         ├── header (from header-group)
                         ├── <slot> (from template sections)
                         └── footer (from footer-group)
```

### New Runtime Endpoint Consumption

Update `[...slug].vue` — or create a parallel catch-all — to handle system page types:

```typescript
// In the route resolver, handle ALL page types
const { data: resolvedRoute } = await useAsyncData(
  () => createCacheKey({ resource: 'route', ... }),
  async () => {
    const result = await resolveRoute(path);
    
    if (result.status === 'found') {
      // System page types (cart, login, search, etc.) — fetch template
      if (['cart', 'search', 'login', 'register', 'account', 'orders', 'order', '404']
          .includes(result.type)) {
        const [template, sectionGroups, theme] = await Promise.all([
          fetchTemplateByType(result.type),
          fetchSectionGroups(),
          fetchTheme(),
        ]);
        return { type: result.type, template, sectionGroups, theme };
      }
      
      // CMS pages — existing flow
      const [page, navigation, theme] = await Promise.all([
        fetchPage(result.id),
        fetchNavigation(),
        fetchTheme(),
      ]);
      return { type: 'page', page, navigation, theme };
    }
    
    // 404 — fetch the 404 template
    const [template, sectionGroups, theme] = await Promise.all([
      fetchTemplateByType('404'),
      fetchSectionGroups(),
      fetchTheme(),
    ]);
    return { type: '404', template, sectionGroups, theme };
  }
);
```

### Changes to Each System Page

#### Cart Page (`app/pages/cart.vue`)

**Current:** Hardcoded template with CartBreadcrumb, CartHeader, CartItemsList, CartSummary, etc.  
**Target:** Fetches `cart.json` template from backend, renders sections:
```vue
<template>
  <RuntimeSectionRenderer
    v-if="templateSections.length"
    :sections="templateSections"
  />
  <div v-else class="container py-8">
    <!-- Fallback: render cart items directly if no template -->
    <CartItemsList />
    <CartSummary />
  </div>
</template>
```

The cart sections would be:
- `cart-items`: Renders `CartItemsList` component with settings like `show_header`, `show_clear_button`
- `cart-summary`: Renders `CartSummary` component with settings like `show_checkout_button`, `show_coupon_field`
- `cart-empty`: Renders `CartEmpty` with settings for `message`, `show_continue_shopping`

**Important:** Cart data (items, totals) still comes from the frontend's `useCart()` composable — it's the DATA SOURCE, not the TEMPLATE. The template only controls LAYOUT. Sections receive the cart data as a prop.

#### Login/Register Pages (`app/pages/login.vue`, `register.vue`)

**Current:** Hardcoded with AuthCard, AuthHeader, AuthFormInput, etc.  
**Target:** Fetches `login.json` / `register.json` template:
- `login-form`: Renders login form with settings like `show_oauth`, `show_register_link`
- `register-form`: Renders registration form with settings

Auth layout (`auth.vue`) still wraps these pages but renders the template sections instead of hardcoded content.

#### Profile Page (`app/pages/profile.vue`)

**Current:** Hardcoded sections for avatar, personal info, password, danger zone  
**Target:** Fetches `account.json` template:
- `account-profile`: Renders profile form (avatar, name, email, phone)
- `account-password`: Renders password change form
- `account-danger-zone`: Renders account deletion section

#### Search Page (`app/pages/search.vue`)

**Current:** Hardcoded search form + results + categories + brands  
**Target:** Fetches `search.json` template:
- `search-form`: Renders search input with settings for `placeholder`
- `search-results`: Renders results grid with settings for `products_per_page`
- `search-filters`: Renders filter sidebar with settings for enabled filter types

Search data still comes from GraphQL — only the layout is templated.

#### Orders Pages (`app/pages/orders/index.vue`, `orders/[orderNumber].vue`)

**Current:** Hardcoded  
**Target:** Fetches `orders.json` / `order.json` template

#### Categories Page (`app/pages/categories.vue`)

**Current:** Hardcoded grid  
**Target:** Fetches `categories.json` template

#### 404 Page

**Current:** Nuxt default 404  
**Target:** Fetches `404.json` template — merchant can customize the 404 page with sections

### Header/Footer Become Section Groups

**Current:** `StorefrontShell.vue` hardcodes `<Topbar>`, `<StorefrontShellHeader>`, `<StorefrontShellFooter>`  
**Target:** `StorefrontShell.vue` renders header/footer from section groups:

```vue
<template>
  <div class="flex min-h-screen flex-col">
    <!-- Header section group → announcement bar, header, etc. -->
    <template v-for="section in headerSections" :key="section.id">
      <component :is="getSectionComponent(section.type)" v-bind="section.data" />
    </template>
    
    <!-- Main content -->
    <main class="flex-1"><slot /></main>
    
    <!-- Footer section group → footer, copyright, etc. -->
    <template v-for="section in footerSections" :key="section.id">
      <component :is="getSectionComponent(section.type)" v-bind="section.data" />
    </template>
  </div>
</template>
```

### Section-to-Component Mapping (New Registry Entries)

Add to `src/core/rendering/registry.ts`:

| Section Type | Component | Notes |
|---|---|---|
| `cart-items` | `CartItemsSection` | New component wrapping CartItemsList |
| `cart-summary` | `CartSummarySection` | New component wrapping CartSummary |
| `cart-empty` | `CartEmptySection` | New component wrapping CartEmpty |
| `search-form` | `SearchFormSection` | New component wrapping search input |
| `search-results` | `SearchResultsSection` | New component wrapping results grid |
| `search-filters` | `SearchFiltersSection` | New component wrapping FilterSidebar |
| `login-form` | `LoginFormSection` | New component wrapping AuthCard + form |
| `register-form` | `RegisterFormSection` | New component wrapping AuthCard + form |
| `account-profile` | `AccountProfileSection` | New component wrapping ProfilePersonalInfoSection |
| `account-password` | `AccountPasswordSection` | New component wrapping ProfilePasswordSection |
| `account-orders` | `AccountOrdersSection` | New component wrapping Orders list |
| `order-detail` | `OrderDetailSection` | New component wrapping Order Detail |
| `announcement-bar` | `AnnouncementBarSection` | New component — top announcement banner |
| `header-main` | `HeaderMainSection` | Refactored from StorefrontShellHeader |
| `footer-main` | `FooterMainSection` | Refactored from StorefrontShellFooter |
| `copyright-bar` | `CopyrightBarSection` | New component wrapping copyright notice |
| `error-404` | `Error404Section` | New component — customizable 404 page |
| `error-500` | `Error500Section` | New component — customizable error page |

### Fallback Behavior

For every system page, if no template is configured (or API fails):
- **Cart page**: Render the existing hardcoded cart template
- **Login page**: Render the existing hardcoded auth form
- **Search page**: Render the existing hardcoded search layout
- **etc.**

This ensures the storefront never breaks — templates are OPTIONAL upgrades.

### Verification

- [ ] Storefront fetches cart template from `/runtime/template/cart`
- [ ] Cart page renders sections from template (items + summary)
- [ ] Login page renders from `login.json` template
- [ ] Search page renders from `search.json` template
- [ ] Header comes from header-group (not hardcoded)
- [ ] Footer comes from footer-group (not hardcoded)
- [ ] Removing a section from the template hides it on the storefront
- [ ] Adding a section to the template shows it on the storefront
- [ ] Fallback rendering works when no template exists
- [ ] Cart data, auth state, search data all still function from composables
- [ ] SSR works for all system page templates
- [ ] Language switching works on all template-driven pages

---

## 8. Phase 4: Theme Settings Expansion

### Duration: 2 weeks

### Backend

1. **Add new fields to `Theme.settings` JSON validation** — Define validation rules for all new settings fields (branding, layout, social, topbar, footer, seo, search, maintenance, custom_css)

2. **Add API endpoint to upload/assign logo and favicon** — Either extend `PUT /stores/{store}` or create `POST /stores/{store}/branding`

3. **Ensure runtime API returns all expanded settings** — `GET /runtime/theme` should return the full `ThemeSettings` object

### Admin

1. **Branding Settings page** — Logo upload (asset picker), favicon upload, store name, tagline
2. **Layout Settings page** — Container width, border radius, direction toggle
3. **Social Links Settings page** — Social media URL inputs
4. **Topbar Settings page** — Toggle, phone, announcement text
5. **Footer Content Settings page** — Copyright text, payment icons checklist
6. **SEO Settings page** — Default meta title, description, OG image
7. **Search Settings page** — Placeholder text, products per page
8. **Custom Code page** — CSS textarea, JS textarea
9. **Maintenance page** — Toggle, message

### Storefront

1. **Update `themeTokens.ts`** to extract and apply all new settings as CSS variables
2. **Update `StorefrontShell.vue`** to use topbar settings (show/hide, phone, announcement)
3. **Update footer components** to use copyright text, payment icons from theme settings
4. **Add custom CSS/JS injection** — Inject `custom_css` as `<style>` tag, `custom_js` as `<script>` tag
5. **Add maintenance mode** — Check `maintenance.enabled` on route resolve, show message page

### Verification

- [ ] Logo uploadable and appears in storefront header
- [ ] Favicon uploadable and appears in browser tab
- [ ] Social links configurable and appear in footer
- [ ] Topbar text configurable and appears
- [ ] Copyright text configurable
- [ ] Custom CSS injects into page
- [ ] Maintenance mode blocks storefront and shows message
- [ ] RTL direction flips layout

---

## 9. Phase 5: Blocks & Metaobjects

### Duration: 3-4 weeks

### Blocks System

**What blocks solve:** Sections like footer, features, testimonials, gallery, pricing all contain repeatable content items. Currently these are hardcoded as section settings arrays. Blocks make them merchant-addable/removable/reorderable.

**Block types to create:**

| Block Type | Used In Section(s) | Settings |
|---|---|---|
| `link` | Footer, Navigation | label, url, target |
| `link_group` | Footer | heading, links[] (nested blocks) |
| `social_icon` | Footer, Social Links | platform, url |
| `payment_icon` | Footer | payment_method |
| `feature` | Feature List | icon, title, body |
| `testimonial` | Testimonials | quote, author, role, rating, avatar |
| `gallery_item` | Gallery/Team | image, name, role, bio |
| `pricing_plan` | Pricing | name, price, currency, period, features list, cta |
| `faq_item` | FAQ | question, answer |
| `slide` | Slideshow/Hero | image, title, subtitle, cta |
| `stat` | Content/Stats | value, label |
| `promise` | Content/Promises | icon, title, body |
| `metric` | Content/Metrics | value, label, note |

**Block instances** are stored as `ThemeBlockInstance` records (or inline in the template JSON). Each section can have a `max_blocks` limit.

### Metaobject System (Simplified)

A lightweight alternative to Shopify's metaobjects — allows merchants to create custom data types:

**Backend:**
- `MetaobjectDefinition` model: name, fields (JSON schema), plural name
- `MetaobjectEntry` model: definition_id, fields (JSON key-value)
- API: CRUD for definitions and entries

**Admin:**
- `MetaobjectDefinitions` page — Create custom data types (e.g., "Brand", "Author", "Ingredient")
- `MetaobjectEntries` page — Create entries for each definition (like a mini CMS)

**Storefront:**
- Sections can reference metaobject entries via dynamic source settings
- `section.settings.brand → metaobject::brand::123` resolves to entry data

### Verification

- [ ] Blocks can be added/removed/reordered in footer section
- [ ] Feature list section uses blocks instead of hardcoded array
- [ ] FAQ section uses blocks
- [ ] Testimonial section uses blocks
- [ ] Metaobject definitions can be created from admin
- [ ] Metaobject entries can be created and edited
- [ ] Sections can reference metaobject entries as dynamic sources
- [ ] Storefront renders block-driven sections correctly

---

## 10. Phase 6: Legacy Retirement & Verification

### Duration: 2 weeks

### Deprecation/Removal List

| File/Component | Replacement | Action |
|---|---|---|
| `app/pages/cart.vue` (hardcoded) | Template-driven sections | Retain as fallback, mark deprecated |
| `app/pages/login.vue` | Template-driven sections | Retain as fallback, mark deprecated |
| `app/pages/register.vue` | Template-driven sections | Retain as fallback, mark deprecated |
| `app/pages/profile.vue` | Template-driven sections | Retain as fallback, mark deprecated |
| `app/pages/search.vue` | Template-driven sections | Retain as fallback, mark deprecated |
| `app/pages/categories.vue` | Template-driven sections | Retain as fallback, mark deprecated |
| `app/pages/orders/*.vue` | Template-driven sections | Retain as fallback, mark deprecated |
| `app/components/topbar/Topbar.vue` (hardcoded) | Announcement Bar section | Remove after migration |
| `app/components/footer/Footer.vue` (hardcoded) | Footer section + blocks | Remove after migration |
| `app/components/footer/FooterAuth.vue` | Minimal footer template | Remove after migration |
| `app/components/footer/FooterBottom.vue` | Copyright section | Remove after migration |
| `app/components/footer/FooterInfo.vue` | Logo + text section | Remove after migration |
| `app/components/footer/FooterLinkList.vue` | Link blocks | Remove after migration |
| `app/components/footer/FooterAcceptedPayments.vue` | Payment icons block | Remove after migration |
| `app/pages/merchant/hero-banners/*` (legacy) | CMS page sections | Remove |
| `app/models/PageTemplate.php` | ThemeTemplate model | Remove |
| `PageTemplateOverride` model | Template section pivot | Remove |
| `src/types/cms.ts` (hardcoded section types) | Schema-driven types | Remove |
| Duplicate theme settings editors | Consolidated editor | Remove one |

### Verification Checklist (Final)

- [ ] Every storefront page is template-driven (at least optionally)
- [ ] Header and footer are section-group-driven
- [ ] Merchant can customize every page via admin
- [ ] Merchant can customize header/footer via admin
- [ ] All theme settings are editable via admin
- [ ] No hardcoded content remains in system pages (only fallbacks)
- [ ] Blocks work in sections that need them
- [ ] Backend, admin, and storefront share consistent types
- [ ] API contracts are stable and versioned
- [ ] Existing tests still pass
- [ ] SSR works on all pages
- [ ] Language switching works on all pages
- [ ] Cache isolation works across tenants

---

## Implementation Timeline Estimate

| Phase | Duration | Weeks |
|---|---|---|
| Phase 0: Foundation — Shared Contracts | 2 weeks | 1-2 |
| Phase 1: Backend — Unified Template System | 3-4 weeks | 3-6 |
| Phase 2: Admin — System Page Editors | 4-5 weeks | 7-11 |
| Phase 3: Storefront — System Pages as Templates | 4-5 weeks | 12-16 |
| Phase 4: Theme Settings Expansion | 2 weeks | 17-18 |
| Phase 5: Blocks & Metaobjects | 3-4 weeks | 19-22 |
| Phase 6: Legacy Retirement & Verification | 2 weeks | 23-24 |
| **Total** | **~24 weeks** | |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| System pages break during template migration | Medium | High | Keep all hardcoded pages as fallbacks; feature-flag template mode |
| Backward compatibility with existing CMS pages | Low | High | Existing CMS page flow unchanged; new template system is additive |
| Admin panel becomes too complex | Medium | Medium | New settings tabs use existing component patterns; avoid over-engineering |
| Type drift between three apps | Medium | Medium | Define types in ONE place (backend DTOs); generate TypeScript types |
| Merchant confusion with too many settings | High | Low | Use sensible defaults; all new settings are optional with fallbacks |
| Performance of fetching templates for every page | Low | Medium | Cache template responses aggressively; templates change rarely |
| SSR complexity for dynamic sections | Medium | Medium | Follow existing section render patterns; test each template type |

---

## Appendix A: Section Schema Definitions for System Pages

### Cart Page Sections

```json
{
  "type": "cart-items",
  "name": "Cart Items",
  "category": "commerce",
  "settings": [
    { "type": "checkbox", "id": "show_header", "label": "Show page header", "default": true },
    { "type": "checkbox", "id": "show_clear_button", "label": "Show clear cart button", "default": true },
    { "type": "text", "id": "empty_state_title", "label": "Empty cart title", "default": "Your cart is empty" },
    { "type": "textarea", "id": "empty_state_message", "label": "Empty cart message" },
    { "type": "text", "id": "continue_shopping_url", "label": "Continue shopping URL", "default": "/" }
  ]
}
```

```json
{
  "type": "cart-summary",
  "name": "Cart Summary",
  "category": "commerce",
  "settings": [
    { "type": "checkbox", "id": "show_coupon_field", "label": "Show coupon code field", "default": true },
    { "type": "checkbox", "id": "show_shipping_estimate", "label": "Show shipping estimate", "default": false },
    { "type": "checkbox", "id": "show_tax_estimate", "label": "Show tax estimate", "default": false },
    { "type": "text", "id": "checkout_button_text", "label": "Checkout button text", "default": "Proceed to Checkout" }
  ]
}
```

### Login Page Sections

```json
{
  "type": "login-form",
  "name": "Login Form",
  "category": "content",
  "settings": [
    { "type": "text", "id": "header_text", "label": "Header text", "default": "Welcome back" },
    { "type": "checkbox", "id": "show_oauth", "label": "Show Google OAuth", "default": true },
    { "type": "checkbox", "id": "show_register_link", "label": "Show register link", "default": true },
    { "type": "checkbox", "id": "show_forgot_password", "label": "Show forgot password link", "default": true }
  ]
}
```

## Appendix B: File Manifest

### Backend New/Modified Files

| File | Action |
|---|---|
| `app/Enums/Theme/TemplateTypeEnum.php` | **Modify** — Add all system types |
| `app/Enums/Theme/SectionTypeEnum.php` | **Modify** — Add system section types |
| `app/Enums/Theme/BlockTypeEnum.php` | **Modify** — Add new block types |
| `app/Models/Theme/ThemeSectionGroup.php` | **Create** |
| `app/Models/Theme/ThemeBlockInstance.php` | **Create** |
| `app/Models/Metaobject/MetaobjectDefinition.php` | **Create** |
| `app/Models/Metaobject/MetaobjectEntry.php` | **Create** |
| `database/migrations/xxxx_create_theme_section_groups_table.php` | **Create** |
| `database/migrations/xxxx_create_theme_block_instances_table.php` | **Create** |
| `database/migrations/xxxx_create_metaobject_*_table.php` | **Create** |
| `database/migrations/xxxx_merge_page_templates_into_theme_templates.php` | **Create** |
| `app/Http/Controllers/Api/Merchant/Theme/ThemeSectionGroupController.php` | **Create** |
| `app/Http/Controllers/Api/Storefront/Runtime/StorefrontRuntimeController.php` | **Modify** — Add templateByType |
| `app/Services/Storefront/Runtime/StorefrontRuntimeService.php` | **Modify** |
| `app/Services/Theme/SectionDataResolverService.php` | **Modify** — Add system page resolvers |
| `app/Services/Theme/TemplateResolutionService.php` | **Modify** — System template resolution |
| `routes/api/v1/merchant/theme.php` | **Modify** — Add section group routes |
| `routes/api/v1/storefront/runtime.php` | **Modify** — Add template/section-group routes |
| `database/seeders/SystemPageTemplateSeeder.php` | **Create** |

### Admin New/Modified Files

| File | Action |
|---|---|
| `src/types/template.ts` | **Create** |
| `src/types/block.ts` | **Create** |
| `src/types/section-group.ts` | **Create** |
| `src/types/schema.ts` | **Create** |
| `src/types/theme.ts` | **Modify** — Expand settings, remove duplicates |
| `src/features/templates/system/SystemTemplatesContent.tsx` | **Create** |
| `src/features/templates/system/SystemTemplateEditor.tsx` | **Create** |
| `src/features/theme/section-groups/SectionGroupsContent.tsx` | **Create** |
| `src/features/theme/section-groups/SectionGroupEditor.tsx` | **Create** |
| `src/features/theme/settings/ThemeSettingsTabs.tsx` | **Create** (consolidated editor) |
| `src/features/theme/settings/BrandingSettings.tsx` | **Create** |
| `src/features/theme/settings/LayoutSettings.tsx` | **Create** |
| `src/features/theme/settings/SocialLinksSettings.tsx` | **Create** |
| `src/features/theme/settings/TopbarSettings.tsx` | **Create** |
| `src/features/theme/settings/FooterContentSettings.tsx` | **Create** |
| `src/features/theme/settings/SeoSettings.tsx` | **Create** |
| `src/features/theme/settings/SearchSettingsEditor.tsx` | **Create** |
| `src/features/theme/settings/CustomCodeEditor.tsx` | **Create** |
| `src/features/theme/settings/MaintenanceSettings.tsx` | **Create** |
| `src/features/metaobjects/MetaobjectDefinitions.tsx` | **Create** |
| `src/features/metaobjects/MetaobjectEntries.tsx` | **Create** |
| `src/features/page-templates/PageTemplateEditContent.tsx` | **Modify** — Support system template types |
| `src/features/page-templates/SectionSettingsForm.tsx` | **Modify** — Add setting types |
| `src/features/theme/settings/ColorSettingsEditor.tsx` | **Remove** (consolidated) |
| `src/features/dashboard/theme-settings/` | **Remove** (consolidated) |

### Storefront New/Modified Files

| File | Action |
|---|---|
| `types/runtime-template.ts` | **Create** |
| `types/runtime-block.ts` | **Create** |
| `types/runtime-section-group.ts` | **Create** |
| `app/utils/themeTokens.ts` | **Modify** — Expanded settings |
| `app/composables/useRuntimeTemplate.ts` | **Create** |
| `app/composables/useSectionGroup.ts` | **Create** |
| `app/pages/[...slug].vue` | **Modify** — Handle all page types |
| `app/pages/cart.vue` | **Modify** — Use template + fallback |
| `app/pages/search.vue` | **Modify** — Use template + fallback |
| `app/pages/login.vue` | **Modify** — Use template + fallback |
| `app/pages/register.vue` | **Modify** — Use template + fallback |
| `app/pages/profile.vue` | **Modify** — Use template + fallback |
| `app/pages/categories.vue` | **Modify** — Use template + fallback |
| `app/pages/orders/index.vue` | **Modify** — Use template + fallback |
| `app/pages/orders/[orderNumber].vue` | **Modify** — Use template + fallback |
| `app/components/shell/StorefrontShell.vue` | **Modify** — Section group-driven |
| `app/components/shell/StorefrontShellHeader.vue` | **Deprecate** (split into sections) |
| `app/components/shell/StorefrontShellFooter.vue` | **Deprecate** (split into sections) |
| `app/components/topbar/Topbar.vue` | **Deprecate** |
| `app/components/footer/Footer.vue` | **Deprecate** |
| `app/components/theme/sections/HeaderSection.vue` | **Modify** — Register in section registry |
| `app/components/theme/sections/FooterSection.vue` | **Modify** — Register in section registry |
| `src/core/rendering/sections/CartItemsSection.vue` | **Create** |
| `src/core/rendering/sections/CartSummarySection.vue` | **Create** |
| `src/core/rendering/sections/CartEmptySection.vue` | **Create** |
| `src/core/rendering/sections/SearchFormSection.vue` | **Create** |
| `src/core/rendering/sections/SearchResultsSection.vue` | **Create** |
| `src/core/rendering/sections/SearchFiltersSection.vue` | **Create** |
| `src/core/rendering/sections/LoginFormSection.vue` | **Create** |
| `src/core/rendering/sections/RegisterFormSection.vue` | **Create** |
| `src/core/rendering/sections/AccountProfileSection.vue` | **Create** |
| `src/core/rendering/sections/AccountPasswordSection.vue` | **Create** |
| `src/core/rendering/sections/AccountOrdersSection.vue` | **Create** |
| `src/core/rendering/sections/OrderDetailSection.vue` | **Create** |
| `src/core/rendering/sections/AnnouncementBarSection.vue` | **Create** |
| `src/core/rendering/sections/HeaderMainSection.vue` | **Create** |
| `src/core/rendering/sections/FooterMainSection.vue` | **Create** |
| `src/core/rendering/sections/CopyrightBarSection.vue` | **Create** |
| `src/core/rendering/sections/Error404Section.vue` | **Create** |
| `src/core/rendering/registry.ts` | **Modify** — Register all new sections |
