# Storefront Theme Integration Plan

**Project**: JustShop Multi-Tenant E-Commerce Platform  
**Phase**: Storefront Dynamic Theme Rendering  
**Status**: 🚀 Ready to Start  
**Prerequisites**: ✅ All 12 backend/dashboard sessions complete

---

## 📋 Overview

Now that the backend theme system and merchant dashboard are complete, we need to integrate dynamic theme rendering into the **justshop-frontend** (Nuxt 3/Vue storefront).

This phase will transform the static storefront into a dynamic, theme-driven experience that reads theme data from the backend API.

---

## 🎯 Objectives

### Primary Goals
1. ✅ Connect storefront to theme API endpoints
2. ✅ Render dynamic header from theme sections/blocks
3. ✅ Render dynamic footer from theme sections/blocks
4. ✅ Apply dynamic theme tokens (colors, fonts)
5. ✅ Render dynamic navigation menus
6. ✅ Display store logo and favicon
7. ✅ Support RTL/LTR based on locale

### Technical Goals
1. ✅ Create Vue composables for theme data
2. ✅ Create dynamic section/block components
3. ✅ Implement theme token CSS injection
4. ✅ Cache theme data client-side
5. ✅ Support SSR with hydration
6. ✅ Maintain performance (no layout shift)

---

## 📊 Implementation Sessions

This phase is divided into **4 sessions**:

| Session | Focus | Duration | Status |
|---------|-------|----------|--------|
| **SESSION 13** | Theme Composables & API Integration | 2-3 hours | ⏳ Pending |
| **SESSION 14** | Dynamic Header Component | 3-4 hours | ⏳ Pending |
| **SESSION 15** | Dynamic Footer Component | 2-3 hours | ⏳ Pending |
| **SESSION 16** | Theme Tokens & CSS Injection | 2-3 hours | ⏳ Pending |

**Total Estimated Time**: 9-13 hours

---

## 📦 SESSION 13: Theme Composables & API Integration

**Duration**: 2-3 hours  
**Priority**: Critical  
**Dependencies**: Backend API complete

### Objectives
1. Create composable for fetching theme data
2. Create composable for fetching navigation data
3. Integrate with Nuxt runtime API
4. Add TypeScript types for theme/navigation
5. Implement client-side caching
6. Add SSR support with state transfer

### Deliverables

#### Files to Create (8 files)

**Composables** (2 files):
- `src/composables/useTheme.ts` - Theme data fetching and management
- `src/composables/useNavigation.ts` - Navigation menu fetching

**Types** (2 files):
- `types/theme.ts` - Theme, Section, Block types
- `types/navigation.ts` - NavigationMenu, MenuItem types

**API Client** (2 files):
- `src/api/theme.ts` - Theme API client functions
- `src/api/navigation.ts` - Navigation API client functions

**Utilities** (2 files):
- `src/utils/themeTokens.ts` - Theme token utilities
- `src/utils/cssInjector.ts` - CSS variable injection

### API Endpoints Used

```typescript
// Theme Runtime API (already implemented in backend)
GET /api/v1/storefront/runtime/theme
GET /api/v1/storefront/runtime/navigation
```

### Composable Signature

```typescript
// useTheme.ts
export const useTheme = () => {
  const theme = ref<Theme | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  const fetchTheme = async () => { /* ... */ }
  const applyThemeTokens = () => { /* ... */ }
  
  return {
    theme,
    loading,
    error,
    fetchTheme,
    applyThemeTokens,
  }
}

// useNavigation.ts
export const useNavigation = (handle: string = 'main-menu') => {
  const menu = ref<NavigationMenu | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  
  const fetchMenu = async () => { /* ... */ }
  
  return {
    menu,
    loading,
    error,
    fetchMenu,
  }
}
```

### Usage Example

```vue
<script setup lang="ts">
const { theme, fetchTheme, applyThemeTokens } = useTheme()
const { menu: mainMenu, fetchMenu } = useNavigation('main-menu')

onMounted(async () => {
  await fetchTheme()
  await fetchMenu('main-menu')
  applyThemeTokens()
})
</script>
```

### Exit Criteria
- ✅ 8 files created
- ✅ Theme data fetched from API
- ✅ Navigation data fetched from API
- ✅ TypeScript types defined
- ✅ Composables work with SSR
- ✅ Data cached client-side
- ✅ Error handling implemented

---

## 📦 SESSION 14: Dynamic Header Component

**Duration**: 3-4 hours  
**Priority**: Critical  
**Dependencies**: SESSION 13 complete

### Objectives
1. Create dynamic header component that reads from theme
2. Render header section with blocks
3. Support all header block types (logo, nav, search, cart)
4. Apply dynamic styling from theme settings
5. Support responsive design
6. Support RTL/LTR layouts

### Deliverables

#### Files to Create (9 files)

**Main Component** (1 file):
- `src/components/theme/ThemeHeader.vue` - Dynamic header container

**Section Component** (1 file):
- `src/components/theme/sections/HeaderSection.vue` - Header section renderer

**Block Components** (7 files):
- `src/components/theme/blocks/LogoBlock.vue` - Store logo
- `src/components/theme/blocks/NavigationMenuBlock.vue` - Navigation menu
- `src/components/theme/blocks/SearchBarBlock.vue` - Search input
- `src/components/theme/blocks/CartIconBlock.vue` - Cart icon with count
- `src/components/theme/blocks/LanguageSelectorBlock.vue` - Language switcher
- `src/components/theme/blocks/TextBlock.vue` - Text content
- `src/components/theme/blocks/ButtonBlock.vue` - CTA buttons

#### Files to Modify (1 file)
- `app.vue` or `layouts/default.vue` - Replace static header with `<ThemeHeader />`

### Component Architecture

```vue
<!-- ThemeHeader.vue -->
<template>
  <header v-if="headerSection" :style="headerStyles">
    <HeaderSection :section="headerSection" />
  </header>
</template>

<script setup lang="ts">
const { theme } = useTheme()

const headerSection = computed(() => 
  theme.value?.sections?.find(s => s.section_type === 'header')
)

const headerStyles = computed(() => ({
  backgroundColor: headerSection.value?.settings?.backgroundColor,
  height: headerSection.value?.settings?.height,
  position: headerSection.value?.settings?.sticky ? 'sticky' : 'relative',
  // ... more dynamic styles
}))
</script>
```

```vue
<!-- HeaderSection.vue -->
<template>
  <div class="header-content">
    <component
      v-for="block in section.blocks"
      :key="block.id"
      :is="getBlockComponent(block.block_type)"
      :block="block"
    />
  </div>
</template>

<script setup lang="ts">
const getBlockComponent = (type: string) => {
  const components = {
    logo: LogoBlock,
    navigation_menu: NavigationMenuBlock,
    search_bar: SearchBarBlock,
    cart_icon: CartIconBlock,
    language_selector: LanguageSelectorBlock,
    text: TextBlock,
    button: ButtonBlock,
  }
  return components[type] || TextBlock
}
</script>
```

### Block Component Examples

```vue
<!-- LogoBlock.vue -->
<template>
  <a :href="localePath('/')" class="logo-block">
    <img
      v-if="store.logo_url"
      :src="store.logo_url"
      :alt="store.name"
      :style="logoStyles"
    />
    <span v-else class="store-name">{{ store.name }}</span>
  </a>
</template>

<script setup lang="ts">
const props = defineProps<{ block: ThemeBlock }>()
const { store } = useStore()

const logoStyles = computed(() => ({
  width: props.block.settings?.width || '150px',
  height: props.block.settings?.height || 'auto',
}))
</script>
```

```vue
<!-- NavigationMenuBlock.vue -->
<template>
  <nav class="navigation-menu">
    <ul class="menu-list">
      <li v-for="item in menu?.items" :key="item.id" class="menu-item">
        <NuxtLink :to="item.url">{{ item.label }}</NuxtLink>
        
        <!-- Nested menu (dropdown) -->
        <ul v-if="item.children?.length" class="submenu">
          <li v-for="child in item.children" :key="child.id">
            <NuxtLink :to="child.url">{{ child.label }}</NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{ block: ThemeBlock }>()
const { menu, fetchMenu } = useNavigation()

const menuHandle = props.block.settings?.menu_handle || 'main-menu'

onMounted(() => {
  fetchMenu(menuHandle)
})
</script>
```

### Exit Criteria
- ✅ 9 component files created
- ✅ Dynamic header renders from theme data
- ✅ All block types supported (7 types)
- ✅ Logo displays from store settings
- ✅ Navigation menu displays from database
- ✅ Search bar functional
- ✅ Cart icon shows item count
- ✅ Responsive design works
- ✅ RTL/LTR support working
- ✅ No layout shift on load

---

## 📦 SESSION 15: Dynamic Footer Component

**Duration**: 2-3 hours  
**Priority**: High  
**Dependencies**: SESSION 14 complete

### Objectives
1. Create dynamic footer component that reads from theme
2. Render footer section with blocks
3. Support all footer block types (nav, social, copyright)
4. Apply dynamic styling from theme settings
5. Support multi-column layouts
6. Support RTL/LTR layouts

### Deliverables

#### Files to Create (5 files)

**Main Component** (1 file):
- `src/components/theme/ThemeFooter.vue` - Dynamic footer container

**Section Component** (1 file):
- `src/components/theme/sections/FooterSection.vue` - Footer section renderer

**Block Components** (3 files):
- `src/components/theme/blocks/SocialLinksBlock.vue` - Social media icons
- `src/components/theme/blocks/CopyrightBlock.vue` - Copyright text
- `src/components/theme/blocks/LinkBlock.vue` - Generic link

#### Files to Modify (1 file)
- `app.vue` or `layouts/default.vue` - Replace static footer with `<ThemeFooter />`

### Component Architecture

```vue
<!-- ThemeFooter.vue -->
<template>
  <footer v-if="footerSection" :style="footerStyles">
    <FooterSection :section="footerSection" />
  </footer>
</template>

<script setup lang="ts">
const { theme } = useTheme()

const footerSection = computed(() => 
  theme.value?.sections?.find(s => s.section_type === 'footer')
)

const footerStyles = computed(() => ({
  backgroundColor: footerSection.value?.settings?.backgroundColor,
  color: footerSection.value?.settings?.textColor,
  padding: footerSection.value?.settings?.padding,
}))
</script>
```

### Block Component Examples

```vue
<!-- SocialLinksBlock.vue -->
<template>
  <div class="social-links">
    <a
      v-for="link in socialLinks"
      :key="link.platform"
      :href="link.url"
      :aria-label="link.platform"
      target="_blank"
      rel="noopener"
    >
      <component :is="getIcon(link.platform)" />
    </a>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ block: ThemeBlock }>()

const socialLinks = computed(() => 
  props.block.settings?.links || []
)

const getIcon = (platform: string) => {
  // Return appropriate icon component
  const icons = {
    facebook: IconFacebook,
    twitter: IconTwitter,
    instagram: IconInstagram,
    linkedin: IconLinkedIn,
  }
  return icons[platform] || IconLink
}
</script>
```

```vue
<!-- CopyrightBlock.vue -->
<template>
  <div class="copyright">
    <p>{{ copyrightText }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ block: ThemeBlock }>()
const { store } = useStore()

const copyrightText = computed(() => {
  const template = props.block.settings?.text || '© {year} {store_name}'
  return template
    .replace('{year}', new Date().getFullYear().toString())
    .replace('{store_name}', store.value?.name || '')
})
</script>
```

### Exit Criteria
- ✅ 5 component files created
- ✅ Dynamic footer renders from theme data
- ✅ All block types supported
- ✅ Footer navigation menu displays
- ✅ Social links functional
- ✅ Copyright text with dynamic year
- ✅ Multi-column layout support
- ✅ RTL/LTR support working
- ✅ Responsive design works

---

## 📦 SESSION 16: Theme Tokens & CSS Injection

**Duration**: 2-3 hours  
**Priority**: High  
**Dependencies**: SESSION 13, 14, 15 complete

### Objectives
1. Inject theme tokens as CSS variables
2. Apply dynamic colors throughout site
3. Apply dynamic fonts throughout site
4. Update global CSS to use CSS variables
5. Support theme switching without reload
6. Optimize for SSR

### Deliverables

#### Files to Create (2 files)

**Utilities** (2 files):
- `src/utils/themeTokens.ts` - Theme token extraction and formatting
- `src/utils/cssInjector.ts` - CSS variable injection logic

#### Files to Modify (4 files)

**Global Styles** (2 files):
- `assets/css/main.css` - Update to use CSS variables
- `assets/css/typography.css` - Update font definitions

**App Entry** (1 file):
- `app.vue` - Inject CSS variables on mount

**Composable** (1 file):
- `src/composables/useTheme.ts` - Add token injection method

### CSS Variable Structure

```css
/* Injected dynamically from theme settings */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #6366f1;
  --color-accent: #ec4899;
  --color-background: #ffffff;
  --color-text: #1f2937;
  
  /* Typography */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  
  /* Layout (future) */
  --container-width: 1280px;
  --spacing-unit: 8px;
  --border-radius: 8px;
}
```

### Implementation

```typescript
// themeTokens.ts
export const extractThemeTokens = (theme: Theme) => {
  const { settings } = theme
  
  return {
    // Colors
    '--color-primary': settings?.colors?.primary || '#3b82f6',
    '--color-secondary': settings?.colors?.secondary || '#6366f1',
    '--color-accent': settings?.colors?.accent || '#ec4899',
    '--color-background': settings?.colors?.background || '#ffffff',
    '--color-text': settings?.colors?.text || '#1f2937',
    
    // Typography
    '--font-heading': settings?.typography?.heading || 'Inter',
    '--font-body': settings?.typography?.body || 'Inter',
  }
}
```

```typescript
// cssInjector.ts
export const injectThemeTokens = (tokens: Record<string, string>) => {
  if (process.server) return // SSR only on client
  
  const root = document.documentElement
  
  Object.entries(tokens).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
}
```

```typescript
// useTheme.ts (updated)
export const useTheme = () => {
  // ... existing code
  
  const applyThemeTokens = () => {
    if (!theme.value) return
    
    const tokens = extractThemeTokens(theme.value)
    injectThemeTokens(tokens)
    
    // Also load Google Fonts if needed
    loadGoogleFonts([
      tokens['--font-heading'],
      tokens['--font-body'],
    ])
  }
  
  return {
    // ... existing
    applyThemeTokens,
  }
}
```

### Global CSS Updates

```css
/* Before (static) */
.btn-primary {
  background-color: #3b82f6;
  color: white;
}

h1, h2, h3 {
  font-family: 'Inter', sans-serif;
}

/* After (dynamic) */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

h1, h2, h3 {
  font-family: var(--font-heading);
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-background);
}
```

### Google Fonts Loading

```typescript
// utils/fontLoader.ts
export const loadGoogleFonts = (fonts: string[]) => {
  const uniqueFonts = [...new Set(fonts)]
  
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?${
    uniqueFonts.map(f => `family=${f.replace(' ', '+')}`).join('&')
  }&display=swap`
  
  if (!document.head.querySelector(`link[href="${link.href}"]`)) {
    document.head.appendChild(link)
  }
}
```

### Exit Criteria
- ✅ 2 utility files created
- ✅ CSS variables injected on app mount
- ✅ Colors apply throughout site
- ✅ Fonts apply throughout site
- ✅ Global CSS uses CSS variables
- ✅ Google Fonts loaded dynamically
- ✅ Theme switching works without reload
- ✅ SSR compatible (no hydration mismatch)
- ✅ No FOUC (Flash of Unstyled Content)

---

## 🔄 Integration Flow

### Complete Data Flow

```
Storefront Loads
  ↓
app.vue onMounted
  ↓
useTheme().fetchTheme()
  ↓
GET /api/v1/storefront/runtime/theme
  ↓
Parse Theme Data
  ↓
Extract Theme Tokens (colors, fonts)
  ↓
Inject CSS Variables (:root)
  ↓
Load Google Fonts (if needed)
  ↓
useNavigation().fetchMenu('main-menu')
  ↓
GET /api/v1/storefront/runtime/navigation
  ↓
Parse Navigation Data
  ↓
Render ThemeHeader
  ↓
Render HeaderSection
  ↓
Render Header Blocks (Logo, Nav, Search, Cart)
  ↓
Render Page Content (existing components)
  ↓
Render ThemeFooter
  ↓
Render FooterSection
  ↓
Render Footer Blocks (Nav, Social, Copyright)
  ↓
Page Fully Rendered with Dynamic Theme
```

---

## 📁 File Structure After Integration

```
justshop-frontend/
├── src/
│   ├── components/
│   │   └── theme/
│   │       ├── ThemeHeader.vue                    # SESSION 14
│   │       ├── ThemeFooter.vue                    # SESSION 15
│   │       ├── sections/
│   │       │   ├── HeaderSection.vue              # SESSION 14
│   │       │   └── FooterSection.vue              # SESSION 15
│   │       └── blocks/
│   │           ├── LogoBlock.vue                  # SESSION 14
│   │           ├── NavigationMenuBlock.vue        # SESSION 14
│   │           ├── SearchBarBlock.vue             # SESSION 14
│   │           ├── CartIconBlock.vue              # SESSION 14
│   │           ├── LanguageSelectorBlock.vue      # SESSION 14
│   │           ├── TextBlock.vue                  # SESSION 14
│   │           ├── ButtonBlock.vue                # SESSION 14
│   │           ├── SocialLinksBlock.vue           # SESSION 15
│   │           ├── CopyrightBlock.vue             # SESSION 15
│   │           └── LinkBlock.vue                  # SESSION 15
│   ├── composables/
│   │   ├── useTheme.ts                            # SESSION 13
│   │   └── useNavigation.ts                       # SESSION 13
│   ├── api/
│   │   ├── theme.ts                               # SESSION 13
│   │   └── navigation.ts                          # SESSION 13
│   └── utils/
│       ├── themeTokens.ts                         # SESSION 13, 16
│       ├── cssInjector.ts                         # SESSION 13, 16
│       └── fontLoader.ts                          # SESSION 16
├── types/
│   ├── theme.ts                                   # SESSION 13
│   └── navigation.ts                              # SESSION 13
├── assets/
│   └── css/
│       ├── main.css                               # Updated SESSION 16
│       └── typography.css                         # Updated SESSION 16
└── app.vue                                        # Modified SESSION 14, 15, 16
```

**Total New Files**: 24  
**Modified Files**: 4

---

## ✅ Success Criteria (Overall)

### After All Sessions Complete

**Functionality**:
- ✅ Storefront loads theme from database
- ✅ Header displays dynamically
- ✅ Footer displays dynamically
- ✅ Navigation menus work
- ✅ Logo displays correctly
- ✅ Colors apply site-wide
- ✅ Fonts apply site-wide
- ✅ Search bar functional
- ✅ Cart icon shows count
- ✅ Social links work
- ✅ Copyright shows current year

**Technical**:
- ✅ SSR compatible
- ✅ No hydration mismatch
- ✅ No FOUC
- ✅ No layout shift
- ✅ Theme cached client-side
- ✅ TypeScript type-safe
- ✅ Performance optimized

**User Experience**:
- ✅ Fast initial load
- ✅ Smooth rendering
- ✅ Responsive design
- ✅ RTL/LTR support
- ✅ Accessible (WCAG AA)

---

## 🚀 How to Execute

### Start with SESSION 13

Simply say to Cursor:

```
Hi, run SESSION 13 from STOREFRONT_INTEGRATION_PLAN.md
```

This will:
1. Create theme and navigation composables
2. Set up API integration
3. Add TypeScript types
4. Prepare for dynamic rendering

Then continue with:
- `SESSION 14` - Dynamic Header
- `SESSION 15` - Dynamic Footer  
- `SESSION 16` - Theme Tokens

---

## 📊 Timeline Estimate

| Week | Sessions | Focus | Hours |
|------|----------|-------|-------|
| **Week 1** | SESSION 13 | API Integration | 2-3 |
| **Week 1** | SESSION 14 | Dynamic Header | 3-4 |
| **Week 2** | SESSION 15 | Dynamic Footer | 2-3 |
| **Week 2** | SESSION 16 | Theme Tokens | 2-3 |
| **TOTAL** | **4 sessions** | **Complete Integration** | **9-13 hours** |

---

## 🔧 Testing Plan

### After SESSION 13
```bash
# Test API calls
curl http://localhost:3000/api/storefront/runtime/theme
curl http://localhost:3000/api/storefront/runtime/navigation

# Test composables in component
console.log(useTheme())
```

### After SESSION 14
```bash
# Test header rendering
Visit: http://localhost:3000
# Verify:
# - Header displays
# - Logo shows
# - Navigation menu works
# - Search bar functional
# - Cart icon displays
```

### After SESSION 15
```bash
# Test footer rendering
Visit: http://localhost:3000
# Verify:
# - Footer displays
# - Footer navigation works
# - Social links work
# - Copyright shows correct year
```

### After SESSION 16
```bash
# Test theme tokens
Visit: http://localhost:3000
# Open DevTools Console:
getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
# Should show theme's primary color

# Change theme colors in dashboard
# Verify colors update in storefront
```

---

## 🎯 Deliverable Summary

| Category | Count | Status |
|----------|-------|--------|
| **Composables** | 2 | ⏳ Pending |
| **API Clients** | 2 | ⏳ Pending |
| **Type Definitions** | 2 | ⏳ Pending |
| **Utilities** | 3 | ⏳ Pending |
| **Main Components** | 2 | ⏳ Pending |
| **Section Components** | 2 | ⏳ Pending |
| **Block Components** | 10 | ⏳ Pending |
| **CSS Files** | 2 | ⏳ Modified |
| **App Entry** | 1 | ⏳ Modified |
| **TOTAL** | **26 files** | **⏳ Ready** |

---

## 📝 Notes

### Important Considerations

1. **SSR Compatibility**: All code must work with Nuxt SSR
2. **Performance**: Theme data should be cached to avoid repeated API calls
3. **Fallback**: Provide sensible defaults if API fails
4. **Responsive**: All components must be mobile-friendly
5. **Accessibility**: Use semantic HTML and ARIA labels
6. **RTL Support**: Components must work in both LTR and RTL modes

### Optional Enhancements (Post-MVP)

- [ ] Theme preview mode (iframe in dashboard)
- [ ] A/B testing themes
- [ ] Theme analytics
- [ ] Advanced section types (hero, products, testimonials)
- [ ] Dynamic page templates
- [ ] Theme marketplace

---

## 📚 Related Documentation

- **THEME_SYSTEM_SESSION_PLAN.md** - Original 12-session plan
- **THEME_SYSTEM_MASTER_REPORT.md** - Backend/dashboard completion report
- **SESSION_13_COMPLETE.md** - Will be created after SESSION 13
- **SESSION_14_COMPLETE.md** - Will be created after SESSION 14
- **SESSION_15_COMPLETE.md** - Will be created after SESSION 15
- **SESSION_16_COMPLETE.md** - Will be created after SESSION 16

---

**Ready to Start?**

```
Hi, run SESSION 13 from STOREFRONT_INTEGRATION_PLAN.md
```

This will begin the storefront integration phase and transform your static frontend into a dynamic, theme-driven experience! 🚀
