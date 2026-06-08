# Shopify-Like Storefront Theme System Implementation Plan

## 🎯 Project Goal
Transform the current static storefront into a dynamic, merchant-customizable theme system similar to Shopify's Online Store 2.0 architecture.

---

## 📋 Phase Overview

### Phase 1: Core Theme Infrastructure (Backend + Database)
### Phase 2: Theme Sections & Blocks System
### Phase 3: Merchant Theme Editor (Dashboard)
### Phase 4: Storefront Dynamic Rendering
### Phase 5: Templates & Presets

---

## 🗄️ Phase 1: Database Schema & Backend Models

### New Tables Required

#### 1. `themes`
```sql
- id
- store_id (FK)
- name
- description
- is_active (boolean)
- is_published (boolean)
- version
- base_template_id (nullable, for marketplace themes)
- settings (JSON) - Global theme settings
  {
    "colors": {
      "primary": "#000000",
      "secondary": "#ffffff",
      "accent": "#ff6b6b"
    },
    "typography": {
      "heading_font": "Montserrat",
      "body_font": "Inter",
      "font_sizes": {...}
    },
    "layout": {
      "container_width": "1280px",
      "spacing_unit": "8px"
    }
  }
- created_at, updated_at, deleted_at
```

#### 2. `theme_sections`
```sql
- id
- theme_id (FK)
- section_type (enum: header, footer, hero, product_grid, collection_grid, 
                      featured_products, testimonials, newsletter, custom)
- name
- handle (slug, e.g., "header-main", "footer-primary")
- settings (JSON) - Section-specific settings
- position (integer, for ordering)
- is_active (boolean)
- created_at, updated_at
```

#### 3. `theme_blocks`
```sql
- id
- section_id (FK)
- block_type (enum: logo, navigation_menu, text, image, button, 
                    social_links, search_bar, cart_icon, custom_html)
- settings (JSON) - Block-specific settings
  {
    "content": "...",
    "alignment": "left",
    "size": "medium",
    "link": "...",
    "image_url": "..."
  }
- position (integer, for ordering within section)
- is_active (boolean)
- created_at, updated_at
```

#### 4. `theme_templates`
```sql
- id
- theme_id (FK)
- template_type (enum: home, product, collection, page, blog, article, 
                       cart, checkout, account, 404, search_results)
- name
- handle
- settings (JSON)
- created_at, updated_at
```

#### 5. `theme_template_sections` (pivot)
```sql
- id
- template_id (FK)
- section_id (FK)
- position (integer)
- created_at, updated_at
```

#### 6. `navigation_menus`
```sql
- id
- store_id (FK)
- name (e.g., "Main Menu", "Footer Menu")
- handle (e.g., "main-menu", "footer-menu")
- created_at, updated_at
```

#### 7. `navigation_menu_items`
```sql
- id
- menu_id (FK)
- parent_id (nullable FK, for nested menus)
- label
- url (nullable)
- resource_type (nullable: category, page, product, collection, external)
- resource_id (nullable)
- position (integer)
- is_active (boolean)
- open_in_new_tab (boolean)
- created_at, updated_at
```

#### 8. `store_assets`
```sql
- id
- store_id (FK)
- asset_type (enum: logo, favicon, banner, product_image, other)
- file_path
- file_name
- file_size
- mime_type
- alt_text (nullable)
- created_at, updated_at
```

#### 9. `store_pages` (for custom pages like About Us, Contact, etc.)
```sql
- id
- store_id (FK)
- title (JSON) - {"en": "...", "ar": "..."}
- slug
- content (JSON) - {"en": "...", "ar": "..."}
- meta_title (JSON)
- meta_description (JSON)
- is_published (boolean)
- template_id (nullable FK)
- created_at, updated_at, deleted_at
```

---

## 🏗️ Phase 2: Backend Implementation

### A. Models & Relationships

```php
// app/Models/Theme.php
class Theme extends Model
{
    use HasStoreScoping, SoftDeletes;
    
    protected $fillable = [
        'store_id', 'name', 'description', 'is_active', 
        'is_published', 'version', 'base_template_id', 'settings'
    ];
    
    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
        'is_published' => 'boolean',
    ];
    
    public function sections()
    {
        return $this->hasMany(ThemeSection::class)->orderBy('position');
    }
    
    public function templates()
    {
        return $this->hasMany(ThemeTemplate::class);
    }
}

// app/Models/ThemeSection.php
class ThemeSection extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'theme_id', 'section_type', 'name', 'handle', 
        'settings', 'position', 'is_active'
    ];
    
    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];
    
    public function blocks()
    {
        return $this->hasMany(ThemeBlock::class, 'section_id')->orderBy('position');
    }
}

// app/Models/ThemeBlock.php
class ThemeBlock extends Model
{
    protected $fillable = [
        'section_id', 'block_type', 'settings', 'position', 'is_active'
    ];
    
    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];
}

// app/Models/NavigationMenu.php
class NavigationMenu extends Model
{
    use HasStoreScoping;
    
    protected $fillable = ['store_id', 'name', 'handle'];
    
    public function items()
    {
        return $this->hasMany(NavigationMenuItem::class, 'menu_id')
            ->whereNull('parent_id')
            ->orderBy('position');
    }
}

// app/Models/NavigationMenuItem.php
class NavigationMenuItem extends Model
{
    protected $fillable = [
        'menu_id', 'parent_id', 'label', 'url', 
        'resource_type', 'resource_id', 'position', 
        'is_active', 'open_in_new_tab'
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'open_in_new_tab' => 'boolean',
    ];
    
    public function children()
    {
        return $this->hasMany(NavigationMenuItem::class, 'parent_id')
            ->orderBy('position');
    }
}

// app/Models/StorePage.php
class StorePage extends Model
{
    use HasStoreScoping, SoftDeletes;
    
    protected $fillable = [
        'store_id', 'title', 'slug', 'content', 
        'meta_title', 'meta_description', 
        'is_published', 'template_id'
    ];
    
    protected $casts = [
        'title' => 'array',
        'content' => 'array',
        'meta_title' => 'array',
        'meta_description' => 'array',
        'is_published' => 'boolean',
    ];
}
```

### B. Enums

```php
// app/Enums/Theme/SectionTypeEnum.php
enum SectionTypeEnum: string
{
    use EnumTrait;
    
    case HEADER = 'header';
    case FOOTER = 'footer';
    case HERO = 'hero';
    case PRODUCT_GRID = 'product_grid';
    case COLLECTION_GRID = 'collection_grid';
    case FEATURED_PRODUCTS = 'featured_products';
    case TESTIMONIALS = 'testimonials';
    case NEWSLETTER = 'newsletter';
    case IMAGE_BANNER = 'image_banner';
    case TEXT_CONTENT = 'text_content';
    case VIDEO = 'video';
    case CUSTOM = 'custom';
}

// app/Enums/Theme/BlockTypeEnum.php
enum BlockTypeEnum: string
{
    use EnumTrait;
    
    case LOGO = 'logo';
    case NAVIGATION_MENU = 'navigation_menu';
    case TEXT = 'text';
    case IMAGE = 'image';
    case BUTTON = 'button';
    case SOCIAL_LINKS = 'social_links';
    case SEARCH_BAR = 'search_bar';
    case CART_ICON = 'cart_icon';
    case LANGUAGE_SELECTOR = 'language_selector';
    case CUSTOM_HTML = 'custom_html';
    case LINK = 'link';
    case COPYRIGHT = 'copyright';
}

// app/Enums/Theme/TemplateTypeEnum.php
enum TemplateTypeEnum: string
{
    use EnumTrait;
    
    case HOME = 'home';
    case PRODUCT = 'product';
    case COLLECTION = 'collection';
    case PAGE = 'page';
    case BLOG = 'blog';
    case ARTICLE = 'article';
    case CART = 'cart';
    case ACCOUNT = 'account';
    case SEARCH_RESULTS = 'search_results';
    case NOT_FOUND = '404';
}
```

### C. API Endpoints (Merchant Admin)

```php
// routes/api/v1/merchant/theme.php

Route::prefix('/stores/{store}/theme')->group(function () {
    
    // Theme Management
    Route::get('/', [ThemeController::class, 'index']);
    Route::post('/', [ThemeController::class, 'create']);
    Route::get('/{theme}', [ThemeController::class, 'show']);
    Route::put('/{theme}', [ThemeController::class, 'update']);
    Route::post('/{theme}/publish', [ThemeController::class, 'publish']);
    Route::post('/{theme}/duplicate', [ThemeController::class, 'duplicate']);
    Route::delete('/{theme}', [ThemeController::class, 'destroy']);
    
    // Sections
    Route::get('/{theme}/sections', [ThemeSectionController::class, 'index']);
    Route::post('/{theme}/sections', [ThemeSectionController::class, 'create']);
    Route::put('/sections/{section}', [ThemeSectionController::class, 'update']);
    Route::post('/sections/{section}/reorder', [ThemeSectionController::class, 'reorder']);
    Route::delete('/sections/{section}', [ThemeSectionController::class, 'destroy']);
    
    // Blocks
    Route::post('/sections/{section}/blocks', [ThemeBlockController::class, 'create']);
    Route::put('/blocks/{block}', [ThemeBlockController::class, 'update']);
    Route::post('/blocks/{block}/reorder', [ThemeBlockController::class, 'reorder']);
    Route::delete('/blocks/{block}', [ThemeBlockController::class, 'destroy']);
    
    // Navigation Menus
    Route::get('/menus', [NavigationMenuController::class, 'index']);
    Route::post('/menus', [NavigationMenuController::class, 'create']);
    Route::put('/menus/{menu}', [NavigationMenuController::class, 'update']);
    Route::delete('/menus/{menu}', [NavigationMenuController::class, 'destroy']);
    
    // Menu Items
    Route::post('/menus/{menu}/items', [NavigationMenuItemController::class, 'create']);
    Route::put('/menu-items/{item}', [NavigationMenuItemController::class, 'update']);
    Route::post('/menu-items/{item}/reorder', [NavigationMenuItemController::class, 'reorder']);
    Route::delete('/menu-items/{item}', [NavigationMenuItemController::class, 'destroy']);
    
    // Assets (Logo, Images, etc.)
    Route::post('/assets/upload', [StoreAssetController::class, 'upload']);
    Route::get('/assets', [StoreAssetController::class, 'index']);
    Route::delete('/assets/{asset}', [StoreAssetController::class, 'destroy']);
    
    // Pages
    Route::get('/pages', [StorePageController::class, 'index']);
    Route::post('/pages', [StorePageController::class, 'create']);
    Route::get('/pages/{page}', [StorePageController::class, 'show']);
    Route::put('/pages/{page}', [StorePageController::class, 'update']);
    Route::delete('/pages/{page}', [StorePageController::class, 'destroy']);
});
```

### D. DTOs & Actions

```php
// app/DTOs/Theme/CreateThemeDTO.php
class CreateThemeDTO
{
    public function __construct(
        public int $storeId,
        public string $name,
        public ?string $description,
        public array $settings,
        public ?int $baseTemplateId = null,
    ) {}
}

// app/Actions/Theme/CreateThemeAction.php
class CreateThemeAction
{
    public function __construct(
        private ThemeRepository $themeRepository
    ) {}
    
    public function execute(CreateThemeDTO $dto): Theme
    {
        return $this->themeRepository->create([
            'store_id' => $dto->storeId,
            'name' => $dto->name,
            'description' => $dto->description,
            'settings' => $dto->settings,
            'base_template_id' => $dto->baseTemplateId,
            'is_active' => false,
            'is_published' => false,
            'version' => '1.0.0',
        ]);
    }
}

// app/Actions/Theme/PublishThemeAction.php
class PublishThemeAction
{
    public function __construct(
        private ThemeRepository $themeRepository
    ) {}
    
    public function execute(int $themeId, int $storeId): Theme
    {
        DB::transaction(function () use ($themeId, $storeId) {
            // Unpublish all other themes
            $this->themeRepository->unpublishAllForStore($storeId);
            
            // Publish this theme
            return $this->themeRepository->update($themeId, [
                'is_published' => true,
                'is_active' => true,
            ]);
        });
    }
}
```

---

## 🎨 Phase 3: Merchant Dashboard (laratenant-commerce)

### A. New Routes & Pages

```
/en/stores/{storeId}/theme/
├── /                           → Theme Overview & Selector
├── /editor                     → Visual Theme Editor (main feature)
├── /sections                   → Manage Sections
├── /navigation                 → Navigation Menu Builder
├── /assets                     → Asset Library (Logo, Images)
├── /pages                      → Custom Pages (About, Contact, etc.)
└── /settings                   → Global Theme Settings
```

### B. Key Components to Build

#### 1. **Theme Editor (Visual Builder)**
```tsx
// src/app/[locale]/stores/[storeId]/theme/editor/page.tsx

Features:
- Live preview of storefront
- Drag-and-drop section reordering
- Click to edit section/block settings
- Side panel with settings form
- Mobile/tablet/desktop preview toggle
- Undo/redo functionality
- Save draft / Publish
```

#### 2. **Section Manager**
```tsx
// src/components/theme/SectionManager.tsx

Features:
- List all available section types
- Add new sections
- Configure section settings
- Preview section appearance
- Reorder sections
```

#### 3. **Block Editor**
```tsx
// src/components/theme/BlockEditor.tsx

Features:
- Add blocks to sections
- Configure block settings (text, images, links, etc.)
- Image uploader with preview
- Color picker
- Font selector
```

#### 4. **Navigation Menu Builder**
```tsx
// src/components/theme/NavigationMenuBuilder.tsx

Features:
- Create multiple menus (header, footer, mobile)
- Drag-and-drop menu items
- Nested menu support (dropdowns)
- Link to: pages, categories, products, collections, external URLs
- Visual preview of menu structure
```

#### 5. **Logo & Asset Uploader**
```tsx
// src/components/theme/AssetUploader.tsx

Features:
- Upload logo (light/dark variants)
- Favicon upload
- Banner images
- Asset library with search/filter
- Crop/resize functionality
```

### C. State Management (Zustand Stores)

```typescript
// src/stores/themeStore.ts
interface ThemeStore {
  activeTheme: Theme | null;
  sections: ThemeSection[];
  isEditing: boolean;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  
  fetchTheme: (storeId: number) => Promise<void>;
  updateSection: (sectionId: number, settings: object) => Promise<void>;
  addSection: (sectionType: string) => Promise<void>;
  reorderSections: (sections: ThemeSection[]) => Promise<void>;
  publishTheme: () => Promise<void>;
}
```

---

## 🌐 Phase 4: Storefront Dynamic Rendering (justshop-frontend)

### A. Dynamic Layout System

```vue
<!-- pages/[...slug].vue -->
<template>
  <div class="storefront-dynamic">
    <!-- Header Section (from theme) -->
    <ThemeSection 
      v-if="headerSection" 
      :section="headerSection" 
    />
    
    <!-- Page Content Sections -->
    <ThemeSection 
      v-for="section in pageSections" 
      :key="section.id"
      :section="section" 
    />
    
    <!-- Footer Section (from theme) -->
    <ThemeSection 
      v-if="footerSection" 
      :section="footerSection" 
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { data: themeData } = await useFetch('/api/storefront/theme');

const headerSection = computed(() => 
  themeData.value?.sections.find(s => s.section_type === 'header')
);

const footerSection = computed(() => 
  themeData.value?.sections.find(s => s.section_type === 'footer')
);

const pageSections = computed(() => 
  themeData.value?.sections.filter(s => 
    s.section_type !== 'header' && s.section_type !== 'footer'
  )
);
</script>
```

### B. Dynamic Section Components

```vue
<!-- components/theme/ThemeSection.vue -->
<template>
  <component 
    :is="sectionComponent" 
    :section="section" 
    :blocks="section.blocks"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  section: ThemeSection;
}>();

const sectionComponent = computed(() => {
  const componentMap = {
    'header': HeaderSection,
    'footer': FooterSection,
    'hero': HeroSection,
    'product_grid': ProductGridSection,
    'featured_products': FeaturedProductsSection,
    'newsletter': NewsletterSection,
    // ... more section types
  };
  
  return componentMap[props.section.section_type] || DefaultSection;
});
</script>
```

### C. Block Rendering Components

```vue
<!-- components/theme/HeaderSection.vue -->
<template>
  <header 
    :style="headerStyles"
    class="site-header"
  >
    <div class="container">
      <div class="header-content">
        <!-- Render each block dynamically -->
        <ThemeBlock 
          v-for="block in blocks" 
          :key="block.id"
          :block="block"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const props = defineProps<{
  section: ThemeSection;
  blocks: ThemeBlock[];
}>();

const headerStyles = computed(() => ({
  backgroundColor: props.section.settings?.backgroundColor,
  padding: props.section.settings?.padding,
  // ... more dynamic styles
}));
</script>
```

```vue
<!-- components/theme/ThemeBlock.vue -->
<template>
  <component 
    :is="blockComponent" 
    :block="block"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  block: ThemeBlock;
}>();

const blockComponent = computed(() => {
  const componentMap = {
    'logo': LogoBlock,
    'navigation_menu': NavigationMenuBlock,
    'text': TextBlock,
    'button': ButtonBlock,
    'social_links': SocialLinksBlock,
    'search_bar': SearchBarBlock,
    'cart_icon': CartIconBlock,
    // ... more block types
  };
  
  return componentMap[props.block.block_type] || DefaultBlock;
});
</script>
```

### D. API Endpoint for Storefront

```php
// routes/api/v1/storefront/theme.php

Route::get('/theme', [StorefrontThemeController::class, 'active']);
Route::get('/navigation/{handle}', [StorefrontNavigationController::class, 'show']);
Route::get('/pages/{slug}', [StorefrontPageController::class, 'show']);
```

---

## 📦 Phase 5: Default Templates & Presets

### A. Seed Default Theme

```php
// database/seeders/DefaultThemeSeeder.php

class DefaultThemeSeeder extends Seeder
{
    public function run(int $storeId): void
    {
        $theme = Theme::create([
            'store_id' => $storeId,
            'name' => 'Default Theme',
            'description' => 'Clean and modern default theme',
            'is_active' => true,
            'is_published' => true,
            'version' => '1.0.0',
            'settings' => [
                'colors' => [
                    'primary' => '#2563eb',
                    'secondary' => '#64748b',
                    'accent' => '#f59e0b',
                ],
                'typography' => [
                    'heading_font' => 'Inter',
                    'body_font' => 'Inter',
                ],
            ],
        ]);

        // Create Header Section
        $header = ThemeSection::create([
            'theme_id' => $theme->id,
            'section_type' => SectionTypeEnum::HEADER,
            'name' => 'Main Header',
            'handle' => 'header-main',
            'position' => 1,
            'is_active' => true,
            'settings' => [
                'backgroundColor' => '#ffffff',
                'height' => '80px',
                'sticky' => true,
            ],
        ]);

        // Header Blocks
        ThemeBlock::create([
            'section_id' => $header->id,
            'block_type' => BlockTypeEnum::LOGO,
            'position' => 1,
            'is_active' => true,
            'settings' => [
                'width' => '150px',
                'alignment' => 'left',
            ],
        ]);

        ThemeBlock::create([
            'section_id' => $header->id,
            'block_type' => BlockTypeEnum::NAVIGATION_MENU,
            'position' => 2,
            'is_active' => true,
            'settings' => [
                'menu_handle' => 'main-menu',
                'alignment' => 'center',
            ],
        ]);

        ThemeBlock::create([
            'section_id' => $header->id,
            'block_type' => BlockTypeEnum::SEARCH_BAR,
            'position' => 3,
            'is_active' => true,
            'settings' => ['placeholder' => 'Search products...'],
        ]);

        ThemeBlock::create([
            'section_id' => $header->id,
            'block_type' => BlockTypeEnum::CART_ICON,
            'position' => 4,
            'is_active' => true,
            'settings' => ['showCount' => true],
        ]);

        // Create Footer Section
        $footer = ThemeSection::create([
            'theme_id' => $theme->id,
            'section_type' => SectionTypeEnum::FOOTER,
            'name' => 'Main Footer',
            'handle' => 'footer-main',
            'position' => 999,
            'is_active' => true,
            'settings' => [
                'backgroundColor' => '#1e293b',
                'textColor' => '#ffffff',
            ],
        ]);

        // Footer Blocks
        ThemeBlock::create([
            'section_id' => $footer->id,
            'block_type' => BlockTypeEnum::NAVIGATION_MENU,
            'position' => 1,
            'is_active' => true,
            'settings' => ['menu_handle' => 'footer-menu'],
        ]);

        ThemeBlock::create([
            'section_id' => $footer->id,
            'block_type' => BlockTypeEnum::SOCIAL_LINKS,
            'position' => 2,
            'is_active' => true,
            'settings' => [
                'links' => [
                    ['platform' => 'facebook', 'url' => ''],
                    ['platform' => 'twitter', 'url' => ''],
                    ['platform' => 'instagram', 'url' => ''],
                ],
            ],
        ]);

        ThemeBlock::create([
            'section_id' => $footer->id,
            'block_type' => BlockTypeEnum::COPYRIGHT,
            'position' => 3,
            'is_active' => true,
            'settings' => [
                'text' => '© 2026 {store_name}. All rights reserved.',
            ],
        ]);

        // Create default navigation menus
        $this->createDefaultMenus($storeId);
    }

    private function createDefaultMenus(int $storeId): void
    {
        $mainMenu = NavigationMenu::create([
            'store_id' => $storeId,
            'name' => 'Main Menu',
            'handle' => 'main-menu',
        ]);

        NavigationMenuItem::create([
            'menu_id' => $mainMenu->id,
            'label' => 'Home',
            'url' => '/',
            'position' => 1,
            'is_active' => true,
        ]);

        NavigationMenuItem::create([
            'menu_id' => $mainMenu->id,
            'label' => 'Shop',
            'url' => '/shop',
            'position' => 2,
            'is_active' => true,
        ]);

        $footerMenu = NavigationMenu::create([
            'store_id' => $storeId,
            'name' => 'Footer Menu',
            'handle' => 'footer-menu',
        ]);

        NavigationMenuItem::create([
            'menu_id' => $footerMenu->id,
            'label' => 'About Us',
            'url' => '/pages/about',
            'position' => 1,
            'is_active' => true,
        ]);

        NavigationMenuItem::create([
            'menu_id' => $footerMenu->id,
            'label' => 'Contact',
            'url' => '/pages/contact',
            'position' => 2,
            'is_active' => true,
        ]);
    }
}
```

---

## 🚀 Implementation Priority & Timeline

### Week 1-2: Foundation
- [ ] Create database migrations
- [ ] Build models & relationships
- [ ] Create enums
- [ ] Implement repositories
- [ ] Build DTOs & actions
- [ ] Create API endpoints
- [ ] Write default theme seeder

### Week 3-4: Merchant Dashboard
- [ ] Theme overview page
- [ ] Navigation menu builder
- [ ] Asset uploader (logo, images)
- [ ] Custom pages CRUD
- [ ] Section manager
- [ ] Block editor

### Week 5-6: Visual Theme Editor
- [ ] Live preview iframe
- [ ] Drag-and-drop sections
- [ ] Settings side panel
- [ ] Responsive preview toggle
- [ ] Save/publish functionality

### Week 7-8: Storefront Rendering
- [ ] Dynamic layout system
- [ ] Section components (header, footer, hero, etc.)
- [ ] Block components (logo, nav, search, cart, etc.)
- [ ] API integration
- [ ] SSR optimization

### Week 9-10: Polish & Templates
- [ ] Create 3-5 preset themes
- [ ] Theme marketplace foundation
- [ ] Documentation
- [ ] Testing
- [ ] Performance optimization

---

## 🎯 Key Features to Prioritize

### Must-Have (MVP):
1. ✅ Header customization (logo, navigation, search, cart)
2. ✅ Footer customization (links, social, copyright)
3. ✅ Navigation menu builder
4. ✅ Asset management (logo upload)
5. ✅ Custom pages (About, Contact, etc.)
6. ✅ Basic theme settings (colors, fonts)

### Nice-to-Have (V2):
- Hero banner builder
- Product grid section
- Testimonials section
- Newsletter signup
- Multiple theme variants
- Theme marketplace
- Import/export themes
- Advanced CSS editor
- Theme preview before publish

---

## 📝 Next Steps

1. **Review this plan** - Does this align with your vision?
2. **Prioritize features** - What's most important to build first?
3. **Start with migrations** - I can generate all database migrations
4. **Build API layer** - Then create backend models & endpoints
5. **Dashboard UI** - Create merchant theme editor
6. **Storefront rendering** - Make it dynamic

Would you like me to start implementing Phase 1 (database schema & backend models)?
