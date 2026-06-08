# Theme Integration - Quick Reference

**Quick guide for using the new dynamic theme system in justshop-frontend**

---

## 🚀 Quick Start

### 1. Fetch and Apply Theme in a Component

```vue
<script setup lang="ts">
import { injectThemeTokens, loadGoogleFonts } from '~/utils/cssInjector';
import { extractThemeTokens, extractGoogleFonts } from '~/utils/themeTokens';

const { theme, fetchTheme, colors, typography, loading } = useStoreTheme();

onMounted(async () => {
  // Fetch theme data
  await fetchTheme();
  
  if (theme.value) {
    // Extract CSS tokens
    const tokens = extractThemeTokens(theme.value);
    
    // Inject CSS variables
    injectThemeTokens(tokens);
    
    // Load Google Fonts
    const fonts = extractGoogleFonts(theme.value);
    if (fonts.length) {
      loadGoogleFonts(fonts);
    }
  }
});
</script>

<template>
  <div v-if="loading">Loading theme...</div>
  <div v-else>
    <h1 :style="{ color: colors.primary }">
      Welcome to {{ theme?.name }}
    </h1>
  </div>
</template>
```

---

### 2. Fetch and Display Navigation Menu

```vue
<script setup lang="ts">
const { menu, fetchMenu, topLevelItems } = useStoreNavigation('main-menu');

onMounted(async () => {
  await fetchMenu();
});
</script>

<template>
  <nav v-if="menu">
    <ul>
      <li v-for="item in topLevelItems" :key="item.id">
        <NuxtLink :to="item.url">{{ item.label }}</NuxtLink>
      </li>
    </ul>
  </nav>
</template>
```

---

### 3. Get Theme Sections

```vue
<script setup lang="ts">
const { getSection, getSectionBlocks } = useStoreTheme();

const headerSection = getSection('header');
const headerBlocks = computed(() => 
  headerSection.value ? getSectionBlocks(headerSection.value.id).value : []
);
</script>

<template>
  <header v-if="headerSection">
    <div v-for="block in headerBlocks" :key="block.id">
      <!-- Render blocks here -->
    </div>
  </header>
</template>
```

---

## 📚 API Reference

### useStoreTheme()

Theme management composable.

**State**:
- `theme` - Complete theme object
- `loading` - Loading state
- `error` - Error object
- `initialized` - Whether theme has been loaded
- `colors` - Theme colors object
- `typography` - Theme typography object
- `layout` - Theme layout object
- `settings` - All theme settings

**Methods**:
- `fetchTheme()` - Fetch theme from API
- `loadFromCache()` - Load from sessionStorage
- `getSection(type)` - Get section by type
- `getSections(type)` - Get all sections of type
- `getSectionBlocks(sectionId)` - Get blocks for section
- `clearCache()` - Clear cached theme
- `refresh()` - Force refetch

**Example**:
```typescript
const { 
  theme, 
  loading, 
  error, 
  colors, 
  typography, 
  fetchTheme, 
  getSection 
} = useStoreTheme();

await fetchTheme();
const header = getSection('header');
```

---

### useStoreNavigation(handle)

Navigation menu management composable.

**Parameters**:
- `handle` - Menu handle (default: 'main-menu')

**State**:
- `menu` - Navigation menu object
- `loading` - Loading state
- `error` - Error object
- `initialized` - Whether menu has been loaded
- `topLevelItems` - Top-level menu items (no parent)
- `hierarchicalItems` - Menu items with nested children
- `hasItems` - Whether menu has items
- `isActive` - Whether menu is active

**Methods**:
- `fetchMenu(handle?)` - Fetch menu by handle
- `loadFromCache(handle?)` - Load from sessionStorage
- `getChildItems(parentId)` - Get child items
- `clearCache(handle?)` - Clear cached menu
- `refresh(handle?)` - Force refetch

**Example**:
```typescript
const { 
  menu, 
  loading, 
  topLevelItems, 
  hierarchicalItems, 
  fetchMenu 
} = useStoreNavigation('main-menu');

await fetchMenu();
```

---

### Theme Token Utilities

**extractThemeTokens(theme)**
```typescript
import { extractThemeTokens } from '~/utils/themeTokens';

const tokens = extractThemeTokens(theme.value);
// Returns: { '--color-primary': '#3b82f6', ... }
```

**extractGoogleFonts(theme)**
```typescript
import { extractGoogleFonts } from '~/utils/themeTokens';

const fonts = extractGoogleFonts(theme.value);
// Returns: ['Inter', 'Roboto']
```

**generateGoogleFontsUrl(fonts)**
```typescript
import { generateGoogleFontsUrl } from '~/utils/themeTokens';

const url = generateGoogleFontsUrl(['Inter', 'Roboto']);
// Returns: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;...'
```

---

### CSS Injection Utilities

**injectThemeTokens(tokens)**
```typescript
import { injectThemeTokens } from '~/utils/cssInjector';

injectThemeTokens(tokens);
// Injects CSS variables to :root
```

**getCSSVariable(name)**
```typescript
import { getCSSVariable } from '~/utils/cssInjector';

const primary = getCSSVariable('color-primary');
// Returns: '#3b82f6'
```

**loadGoogleFonts(fonts)**
```typescript
import { loadGoogleFonts } from '~/utils/cssInjector';

loadGoogleFonts(['Inter', 'Roboto']);
// Loads fonts via <link> element
```

**applyThemeWithTransition(tokens, duration)**
```typescript
import { applyThemeWithTransition } from '~/utils/cssInjector';

applyThemeWithTransition(tokens, 300);
// Applies theme with 300ms transition
```

---

## 🎨 Using CSS Variables

After injecting theme tokens, use them in your styles:

```vue
<template>
  <div class="themed-component">
    <h1>Hello World</h1>
    <button class="btn">Click Me</button>
  </div>
</template>

<style scoped>
.themed-component {
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-body);
}

h1 {
  color: var(--color-primary);
  font-family: var(--font-heading);
}

.btn {
  background-color: var(--color-primary);
  color: white;
  padding: 12px 24px;
  border-radius: var(--layout-border-radius);
}
</style>
```

---

## 🔧 Available CSS Variables

After theme injection, these variables are available:

### Colors
- `--color-primary`
- `--color-secondary`
- `--color-accent`
- `--color-background`
- `--color-text`
- `--color-text-light`
- `--color-text-dark`
- `--color-success`
- `--color-warning`
- `--color-error`
- `--color-border`

### Typography
- `--font-heading`
- `--font-body`
- `--font-size-base`
- `--line-height-base`

### Layout
- `--layout-container-width`
- `--layout-spacing-unit`
- `--layout-border-radius`
- `--layout-header-height`
- `--layout-footer-padding`

---

## 📖 Type Definitions

### Theme Types

```typescript
interface Theme {
  id: number;
  store_id: number;
  name: string;
  description: string | null;
  version: string;
  is_active: boolean;
  settings: ThemeSettings;
  sections: ThemeSection[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

interface ThemeSection {
  id: number;
  theme_id: number;
  section_type: string;
  position: number;
  settings: Record<string, any>;
  is_visible: boolean;
  blocks: ThemeBlock[];
  created_at: string;
  updated_at: string;
}

interface ThemeBlock {
  id: number;
  section_id: number;
  block_type: string;
  position: number;
  settings: Record<string, any>;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}
```

### Navigation Types

```typescript
interface NavigationMenu {
  id: number;
  store_id: number;
  handle: string;
  title: string;
  description: string | null;
  location: 'header' | 'footer' | 'sidebar' | 'mobile' | null;
  is_active: boolean;
  items: NavigationMenuItem[];
  created_at: string;
  updated_at: string;
}

interface NavigationMenuItem {
  id: number;
  menu_id: number;
  parent_id: number | null;
  label: string;
  url: string;
  target: '_self' | '_blank' | '_parent' | '_top';
  css_classes: string | null;
  position: number;
  is_visible: boolean;
  children?: NavigationMenuItem[];
  created_at: string;
  updated_at: string;
}
```

---

## 🧪 Testing

### Quick Test in Browser Console

```javascript
// Get theme
const { theme, fetchTheme } = useStoreTheme();
await fetchTheme();
console.log('Theme:', theme.value);

// Get navigation
const { menu, fetchMenu } = useStoreNavigation('main-menu');
await fetchMenu();
console.log('Menu:', menu.value);

// Test CSS variables
import { getCSSVariable } from '~/utils/cssInjector';
console.log('Primary:', getCSSVariable('color-primary'));
```

### Test Page

Create `pages/test-theme.vue` using the example in `TEST_SESSION_13.md`.

---

## 🐛 Troubleshooting

### Theme Not Loading
1. Check backend is running
2. Check API endpoint: `curl http://demo.justshop.test:3000/api/storefront/runtime/theme`
3. Check browser console for errors
4. Clear cache: `useStoreTheme().clearCache()`

### CSS Variables Not Applied
1. Verify `injectThemeTokens()` was called
2. Check DevTools → Elements → `<html>` → Styles
3. Look for CSS variables in `:root`
4. Test: `getCSSVariable('color-primary')`

### Navigation Not Loading
1. Check API: `curl 'http://demo.justshop.test:3000/api/storefront/runtime/navigation?handle=main-menu'`
2. Verify menu exists in backend
3. Check handle matches
4. Clear cache: `useStoreNavigation().clearCache()`

---

## 📝 Notes

### Cache Behavior
- Theme cached in sessionStorage for 5 minutes
- Navigation cached per menu handle
- Cache key format: `store-theme`, `nav-{handle}`
- Cache cleared on page close (sessionStorage)

### SSR Compatibility
- All composables use Nuxt `useState`
- CSS injection only runs on client
- Theme data available during SSR
- Hydration-safe

### Multiple Menus
```typescript
// Footer menu
const footer = useStoreNavigation('footer-menu');

// Mobile menu
const mobile = useStoreNavigation('mobile-menu');

// Each has independent state
```

---

## 🚀 Next Steps

Now that SESSION 13 is complete, proceed to:

### SESSION 14: Dynamic Header Component
Create dynamic header with theme blocks.

**To start**:
```
run SESSION 14 from STOREFRONT_INTEGRATION_PLAN.md
```

---

## 📚 Documentation

- `SESSION_13_COMPLETE.md` - Implementation details
- `TEST_SESSION_13.md` - Testing guide
- `STOREFRONT_INTEGRATION_PLAN.md` - Master plan
- `STOREFRONT_INTEGRATION_STATUS.md` - Progress tracker

---

**Last Updated**: June 6, 2026  
**Version**: 1.0.0  
**Status**: SESSION 13 Complete ✅

