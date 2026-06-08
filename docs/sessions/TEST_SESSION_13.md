# SESSION 13 Testing Guide

Quick tests to verify the SESSION 13 implementation works correctly.

---

## 🧪 Quick Test in Browser Console

### 1. Test Theme Composable

Open your browser console on `http://demo.justshop.test:3000` and run:

```javascript
// Import the composable (in a .vue component)
const { theme, fetchTheme, colors, typography } = useStoreTheme();

// Fetch theme
await fetchTheme();

// Check theme data
console.log('Theme:', theme.value);
console.log('Colors:', colors.value);
console.log('Typography:', typography.value);

// Check sections
const { getSection } = useStoreTheme();
const headerSection = getSection('header');
console.log('Header Section:', headerSection.value);
```

---

### 2. Test Navigation Composable

```javascript
// Import the composable
const { menu, fetchMenu, topLevelItems } = useStoreNavigation('main-menu');

// Fetch menu
await fetchMenu();

// Check menu data
console.log('Menu:', menu.value);
console.log('Top Level Items:', topLevelItems.value);
```

---

### 3. Test Token Extraction

```javascript
import { extractThemeTokens, extractGoogleFonts } from '~/utils/themeTokens';

const { theme } = useStoreTheme();
await fetchTheme();

// Extract tokens
const tokens = extractThemeTokens(theme.value);
console.log('CSS Tokens:', tokens);

// Extract fonts
const fonts = extractGoogleFonts(theme.value);
console.log('Google Fonts:', fonts);
```

---

### 4. Test CSS Injection

```javascript
import { injectThemeTokens, getCSSVariable } from '~/utils/cssInjector';
import { extractThemeTokens } from '~/utils/themeTokens';

const { theme } = useStoreTheme();
await fetchTheme();

// Extract and inject
const tokens = extractThemeTokens(theme.value);
injectThemeTokens(tokens);

// Verify injection
console.log('Primary Color:', getCSSVariable('color-primary'));
console.log('Body Font:', getCSSVariable('font-body'));

// Check in DevTools
// Open Elements tab → <html> element → Styles → element.style
// You should see all --color-*, --font-*, --layout-* variables
```

---

## 🧪 Component Test

Create a test component to verify everything works:

```vue
<!-- pages/test-theme.vue -->
<script setup lang="ts">
const { theme, fetchTheme, loading, error, colors, typography } = useStoreTheme();
const { menu, fetchMenu: fetchNav, topLevelItems } = useStoreNavigation('main-menu');

const { injectThemeTokens, loadGoogleFonts, getCSSVariable } = await import('~/utils/cssInjector');
const { extractThemeTokens, extractGoogleFonts } = await import('~/utils/themeTokens');

const injectedPrimaryColor = ref('');

onMounted(async () => {
  // Fetch theme
  await fetchTheme();
  
  // Fetch navigation
  await fetchNav();
  
  if (theme.value) {
    // Extract tokens
    const tokens = extractThemeTokens(theme.value);
    
    // Inject CSS variables
    injectThemeTokens(tokens);
    
    // Load fonts
    const fonts = extractGoogleFonts(theme.value);
    if (fonts.length) {
      loadGoogleFonts(fonts);
    }
    
    // Get injected value
    injectedPrimaryColor.value = getCSSVariable('color-primary');
  }
});
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">SESSION 13 Test Page</h1>
    
    <!-- Loading State -->
    <div v-if="loading" class="mb-4">
      <p>Loading theme...</p>
    </div>
    
    <!-- Error State -->
    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded">
      <p>Error: {{ error.message }}</p>
    </div>
    
    <!-- Theme Data -->
    <div v-if="theme" class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Theme Data</h2>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h3 class="font-semibold mb-2">Theme Info</h3>
          <p>Name: {{ theme.name }}</p>
          <p>Version: {{ theme.version }}</p>
          <p>Active: {{ theme.is_active }}</p>
        </div>
        
        <div>
          <h3 class="font-semibold mb-2">Colors</h3>
          <p>Primary: {{ colors.primary }}</p>
          <p>Secondary: {{ colors.secondary }}</p>
          <p>Accent: {{ colors.accent }}</p>
        </div>
        
        <div>
          <h3 class="font-semibold mb-2">Typography</h3>
          <p>Heading: {{ typography.heading }}</p>
          <p>Body: {{ typography.body }}</p>
        </div>
        
        <div>
          <h3 class="font-semibold mb-2">CSS Injection</h3>
          <p>Injected Primary: {{ injectedPrimaryColor }}</p>
          <div 
            class="w-16 h-16 rounded" 
            :style="{ backgroundColor: injectedPrimaryColor }"
          ></div>
        </div>
      </div>
      
      <div class="mt-4">
        <h3 class="font-semibold mb-2">Sections ({{ theme.sections?.length || 0 }})</h3>
        <ul class="list-disc list-inside">
          <li v-for="section in theme.sections" :key="section.id">
            {{ section.section_type }} ({{ section.blocks?.length || 0 }} blocks)
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Navigation Data -->
    <div v-if="menu" class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Navigation Data</h2>
      
      <div>
        <h3 class="font-semibold mb-2">Menu Info</h3>
        <p>Handle: {{ menu.handle }}</p>
        <p>Title: {{ menu.title }}</p>
        <p>Location: {{ menu.location }}</p>
        <p>Items: {{ menu.items?.length || 0 }}</p>
      </div>
      
      <div class="mt-4">
        <h3 class="font-semibold mb-2">Top Level Items</h3>
        <ul class="list-disc list-inside">
          <li v-for="item in topLevelItems" :key="item.id">
            {{ item.label }} → {{ item.url }}
          </li>
        </ul>
      </div>
    </div>
    
    <!-- CSS Variables Test -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">CSS Variables Test</h2>
      <p class="mb-2">These should use the injected theme colors:</p>
      
      <button 
        class="px-4 py-2 rounded"
        style="background-color: var(--color-primary); color: white;"
      >
        Primary Button
      </button>
      
      <button 
        class="px-4 py-2 rounded ml-2"
        style="background-color: var(--color-secondary); color: white;"
      >
        Secondary Button
      </button>
      
      <button 
        class="px-4 py-2 rounded ml-2"
        style="background-color: var(--color-accent); color: white;"
      >
        Accent Button
      </button>
    </div>
    
    <!-- Raw Data (for debugging) -->
    <details class="mb-8">
      <summary class="text-xl font-semibold cursor-pointer">Raw Theme Data (JSON)</summary>
      <pre class="mt-4 p-4 bg-gray-100 rounded overflow-auto text-xs">{{ JSON.stringify(theme, null, 2) }}</pre>
    </details>
    
    <details>
      <summary class="text-xl font-semibold cursor-pointer">Raw Navigation Data (JSON)</summary>
      <pre class="mt-4 p-4 bg-gray-100 rounded overflow-auto text-xs">{{ JSON.stringify(menu, null, 2) }}</pre>
    </details>
  </div>
</template>
```

---

## ✅ Expected Results

### Theme API Call
- ✅ Returns theme data from backend
- ✅ Theme object has `id`, `name`, `version`, `settings`, `sections`
- ✅ Settings contain `colors`, `typography`, `layout`
- ✅ Sections array contains header, footer, etc.
- ✅ Each section has `blocks` array

### Navigation API Call
- ✅ Returns navigation menu data
- ✅ Menu object has `handle`, `title`, `items`
- ✅ Items array contains menu items
- ✅ Top-level items have no `parent_id`

### Token Extraction
- ✅ `extractThemeTokens()` returns object with `--color-*`, `--font-*`, `--layout-*` keys
- ✅ All values are strings
- ✅ Fallback values used if theme data missing

### CSS Injection
- ✅ `injectThemeTokens()` adds CSS variables to `:root`
- ✅ Variables visible in DevTools Elements tab
- ✅ `getCSSVariable()` returns the correct value
- ✅ Styles using `var(--color-primary)` reflect theme colors

### Caching
- ✅ Theme saved to sessionStorage after first fetch
- ✅ sessionStorage key: `store-theme`
- ✅ sessionStorage timestamp: `store-theme-timestamp`
- ✅ Reload page → theme loads from cache (no API call)
- ✅ After 5 minutes → cache expires, refetches from API

---

## 🐛 Troubleshooting

### Theme Not Fetching
- Check backend is running: `curl http://localhost:8000/api/v1/storefront/runtime/theme`
- Check Nuxt proxy is working: `curl http://demo.justshop.test:3000/api/storefront/runtime/theme`
- Check browser console for errors

### CSS Variables Not Applied
- Verify `injectThemeTokens()` was called
- Check DevTools → Elements → `<html>` → element.style
- Verify variables start with `--`
- Check `getCSSVariable('color-primary')` returns a value

### Navigation Not Loading
- Check API: `curl 'http://demo.justshop.test:3000/api/storefront/runtime/navigation?handle=main-menu'`
- Verify menu exists in backend database
- Check handle matches: default is `'main-menu'`

### Cache Issues
- Clear sessionStorage: `sessionStorage.clear()`
- Clear cache via composable: `useStoreTheme().clearCache()`
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## 📝 Manual Tests

### Test 1: Basic Theme Fetch
1. Visit `http://demo.justshop.test:3000/test-theme`
2. Verify theme data displays
3. Check browser console for errors
4. ✅ Pass if theme data appears

### Test 2: CSS Variable Injection
1. Visit test page
2. Open DevTools → Elements
3. Select `<html>` element
4. Check "Styles" panel for CSS variables
5. ✅ Pass if `--color-primary`, `--font-body`, etc. exist

### Test 3: Cache Persistence
1. Visit test page (fresh load)
2. Open DevTools → Application → Session Storage
3. Verify `store-theme` key exists
4. Reload page
5. Check Network tab - should not call theme API again
6. ✅ Pass if no API call on reload

### Test 4: Cache Expiration
1. Visit test page
2. Edit sessionStorage timestamp: set to old value
3. Reload page
4. ✅ Pass if API call happens again

### Test 5: Error Handling
1. Stop backend server
2. Visit test page
3. ✅ Pass if error message displays (not crash)
4. Start backend
5. Click refresh
6. ✅ Pass if theme loads

---

## 🎯 Success Criteria

All tests must pass before proceeding to SESSION 14:

- [ ] Theme API returns data
- [ ] Navigation API returns data
- [ ] Theme composable works
- [ ] Navigation composable works
- [ ] Token extraction produces valid CSS variables
- [ ] CSS injection adds variables to `:root`
- [ ] Google Fonts load dynamically
- [ ] Cache stores theme/nav data
- [ ] Cache loads on page reload
- [ ] Cache expires after 5 minutes
- [ ] Error handling shows errors gracefully
- [ ] No console errors

---

**Once all tests pass, proceed to SESSION 14!** 🚀

