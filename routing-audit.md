# Nuxt.js Routing Architecture Audit

## Executive Summary

This audit examines the current routing architecture of the Nuxt.js application to prepare for a future migration toward centralized route management. The analysis is based on direct inspection of the codebase structure, navigation patterns, middleware implementations, and component usage.

**Key Findings:**
- File-based routing with 20+ page components across multiple domains
- Heavy reliance on hardcoded path strings (50+ occurrences)
- Three global middleware functions managing auth flows
- Extensive use of `useLocalePath()` for i18n-aware navigation
- No existing route abstractions, constants, or type-safe builders
- Significant duplication of route logic across composables, pages, and components

---

## 1. Current Routing Strategy

### How Routing Works

The application uses **Nuxt 3's file-based routing system** where routes are automatically generated based on the file structure in the `app/pages/` directory. Navigation is handled through a combination of:

1. **Programmatic navigation** using `navigateTo()` and `router.push()`
2. **Declarative navigation** using `<NuxtLink>` and `<NuxtLinkLocale>` components
3. **Middleware guards** for authentication and guest protection
4. **i18n integration** via `@nuxtjs/i18n` with locale prefixing

### File-Based Routing Structure

```
app/pages/
├── index.vue                          # Home page (/)
├── login.vue                          # /login (auth layout, guest middleware)
├── register.vue                       # /register (auth layout, guest middleware)
├── profile.vue                        # /profile (protected, auth middleware)
├── cart.vue                           # /cart (default layout)
├── search.vue                         # /search?q=... (default layout)
├── verify-email/
│   └── [id]/
│       └── [hash].vue                 # /verify-email/:id/:hash (no layout)
├── auth/
│   └── google/
│       └── callback.vue               # /auth/google/callback (auth layout)
├── checkout/
│   ├── cancel.vue                     # /checkout/cancel (default layout)
│   └── success.vue                    # /checkout/success (default layout)
├── orders/
│   ├── index.vue                      # /orders (default layout, auth middleware commented out)
│   ├── track.vue                      # /orders/track (default layout)
│   └── [orderNumber].vue              # /orders/:orderNumber (protected, auth middleware)
└── products/
    ├── index.vue                      # /products (default layout)
    ├── category/
    │   └── [slug].vue                 # /products/category/:slug (default layout)
    └── product/
        └── [slug].vue                 # /products/product/:slug (default layout)
```

### Dynamic Routes

The application implements several dynamic route patterns:

| Route Pattern | File Location | Parameters |
|---------------|---------------|------------|
| `/orders/:orderNumber` | `app/pages/orders/[orderNumber].vue` | `orderNumber` (string) |
| `/products/category/:slug` | `app/pages/products/category/[slug].vue` | `slug` (string) |
| `/products/product/:slug` | `app/pages/products/product/[slug].vue` | `slug` (string) |
| `/verify-email/:id/:hash` | `app/pages/verify-email/[id]/[hash].vue` | `id`, `hash` (strings) |

**Real Example - Order Detail Page:**
```typescript
// app/pages/orders/[orderNumber].vue
const route = useRoute()
const orderNumber = route.params.orderNumber as string

const { order, loading, error, fetchOrder } = useOrder(orderNumber)

onMounted(async () => {
  await fetchOrder()
})
```

### Locale Routing

The application uses **@nuxtjs/i18n** with the following configuration:

```typescript
// nuxt.config.ts
i18n: {
  vueI18n: './i18n.config.ts',
  defaultLocale: 'en',
  strategy: 'prefix_except_default',
  baseUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  locales: [
    { code: 'en', iso: 'en-US', dir: 'ltr', name: 'English' },
    { code: 'ar', iso: 'ar-SA', dir: 'rtl', name: 'Arabic' }
  ],
  // ...
}
```

**Strategy Implications:**
- Default locale (`en`) has no prefix: `/products`, `/login`, `/orders`
- Arabic locale has prefix: `/ar/products`, `/ar/login`, `/ar/orders`
- All navigation must use `useLocalePath()` to generate correct URLs

**Real Example:**
```typescript
const localePath = useLocalePath()
return navigateTo(localePath('/login'))
// Produces: /login (EN) or /ar/login (AR)
```

### Navigation Strategy

Three primary navigation patterns are used throughout the codebase:

#### Pattern 1: `navigateTo()` + `localePath()` (Composables & Middleware)

```typescript
// app/composables/useAuth.ts
export const useAuth = () => {
  const localePath = useLocalePath()
  
  const login = async (credentials: LoginForm) => {
    // ... login logic
    return navigateTo(localePath('/'))
  }
  
  const logout = async () => {
    // ... logout logic
    return navigateTo(localePath('/login'))
  }
}
```

#### Pattern 2: `router.push()` + `localePath()` (Components)

```typescript
// app/components/HeaderSearchInput.vue
const router = useRouter()
const localePath = useLocalePath()

const selectItem = (item: SearchItem) => {
  if (item.type === 'product') {
    router.push(localePath(`/products/product/${item.slug}`))
  } else if (item.type === 'category') {
    router.push(localePath(`/products/category/${item.slug}`))
  }
}
```

#### Pattern 3: `<NuxtLinkLocale>` / `<NuxtLink>` (Templates)

```vue
<!-- app/components/HeaderLinks.vue -->
<template>
  <nav>
    <NuxtLinkLocale to="/" class="nav-link">
      {{ t('header.links.home') }}
    </NuxtLinkLocale>
    <NuxtLinkLocale to="/products" class="nav-link">
      {{ t('header.links.shop') }}
    </NuxtLinkLocale>
  </nav>
</template>

<!-- app/components/ProductCard.vue -->
<template>
  <NuxtLink :to="`/products/product/${product.slug}`">
    <img :src="product.image" :alt="product.name" />
  </NuxtLink>
</template>
```

### Middleware Strategy

Three global middleware functions manage route protection:

#### 1. `auth.ts` - Protected Routes

**Location:** `app/middleware/auth.ts`

```typescript
export default defineNuxtRouteMiddleware(async () => {
  const { isLoggedIn, user, fetchUser } = useAuth()
  const localePath = useLocalePath()
  
  const token = useCookie('token')
  
  if (!isLoggedIn.value) {
    if (!token.value) {
      return navigateTo(localePath('/login'))
    }
    
    try {
      await fetchUser()
      if (!isLoggedIn.value) {
        return navigateTo(localePath('/login'))
      }
    } catch (error) {
      return navigateTo(localePath('/login'))
    }
  }
})
```

**Usage:**
```typescript
// app/pages/orders/[orderNumber].vue
definePageMeta({
  middleware: 'auth',
})

// app/pages/profile.vue
definePageMeta({
  middleware: 'auth',
})
```

#### 2. `guest.ts` - Auth Page Protection

**Location:** `app/middleware/guest.ts`

```typescript
export default defineNuxtRouteMiddleware(() => {
  const { isLoggedIn } = useAuth()
  const localePath = useLocalePath()
  
  if (isLoggedIn.value) {
    return navigateTo(localePath('/'))
  }
})
```

**Usage:**
```typescript
// app/pages/login.vue
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})

// app/pages/register.vue
definePageMeta({
  layout: 'auth',
  middleware: 'guest',
})
```

#### 3. `google-auth.ts` - OAuth Callback Handling

**Location:** `app/middleware/google-auth.ts`

```typescript
export default defineNuxtRouteMiddleware(async () => {
  const route = useRoute()
  const { handleGoogleCallback } = useAuth()
  const localePath = useLocalePath()
  
  const code = route.query.code as string
  const state = route.query.state as string
  
  if (!code || !state) {
    return navigateTo(localePath('/login'), { replace: true })
  }
  
  try {
    await handleGoogleCallback(code, state)
    return navigateTo(localePath('/'), { replace: true })
  } catch (error) {
    return navigateTo(localePath('/login'), { replace: true })
  }
})
```

**Usage:**
```typescript
// app/pages/auth/google/callback.vue
definePageMeta({
  layout: 'auth',
  middleware: 'google-auth',
})
```

---

## 2. Existing Route Abstractions

### Current State: NO Centralized Abstractions

After thorough inspection of the entire codebase, **no dedicated route abstraction layers exist**. All routes are represented as hardcoded string literals scattered throughout:

- Composables (7 files)
- Pages (15 files)
- Components (20+ files)
- Middleware (3 files)

### Indirect Navigation Helpers

While no route-specific abstractions exist, the following patterns provide indirect navigation support:

#### i18n Integration (`useLocalePath`)

Every navigation call depends on this composable from `@nuxtjs/i18n`:

```typescript
const localePath = useLocalePath()
return navigateTo(localePath('/login'))
```

**Files using `useLocalePath()`:**
- `app/composables/useAuth.ts`
- `app/composables/useProfile.ts`
- `app/middleware/auth.ts`
- `app/middleware/guest.ts`
- `app/middleware/google-auth.ts`
- `app/pages/login.vue`
- `app/pages/register.vue`
- `app/pages/verify-email/[id]/[hash].vue`
- `app/pages/orders/[orderNumber].vue`
- `app/pages/products/product/[slug].vue`
- `app/components/HeaderLinks.vue`
- `app/components/HeaderSearchInput.vue`
- `app/components/Breadcrumb.vue`
- `app/components/SidebarMenu.vue`
- And 10+ more components

#### Router Instance (`useRouter`)

Used primarily in components for programmatic navigation:

```typescript
const router = useRouter()
router.push(localePath('/products'))
```

**Files using `useRouter()`:**
- `app/components/HeaderSearchInput.vue`
- `app/composables/useProductFilters.ts`

#### Layout System (`definePageMeta`)

Pages define their layout and middleware requirements:

```typescript
definePageMeta({
  layout: 'auth',      // 'auth' | 'default' | false
  middleware: 'guest', // 'auth' | 'guest' | 'google-auth'
})
```

### Missing Abstractions

The following abstractions are **NOT** present but would be beneficial:

| Abstraction Type | Status | Need Level |
|------------------|--------|------------|
| Route constants | ❌ Missing | Critical |
| Route builders | ❌ Missing | Critical |
| Type-safe route params | ❌ Missing | High |
| Navigation composable | ❌ Missing | High |
| Route name enums | ❌ Missing | Medium |
| Middleware redirect config | ❌ Missing | Medium |
| Breadcrumb generators | ❌ Missing | Medium |

---

## 3. Route Usage Patterns

### Hardcoded Path Strings (Most Common Pattern)

#### In Composables

**`app/composables/useAuth.ts`:**
```typescript
export const useAuth = () => {
  const localePath = useLocalePath()
  
  const login = async (credentials: LoginForm) => {
    // ... API call
    return navigateTo(localePath('/'))  // HARDCODED
  }
  
  const logout = async () => {
    // ... API call
    return navigateTo(localePath('/login'))  // HARDCODED
  }
  
  const handleGoogleCallback = async (code: string, state: string) => {
    // ... API call
    return navigateTo(localePath('/'))  // HARDCODED
  }
}
```

**`app/composables/useProfile.ts`:**
```typescript
export const useProfile = () => {
  const localePath = useLocalePath()
  
  const deleteAccount = async () => {
    // ... API call
    return navigateTo(localePath('/login'))  // HARDCODED
  }
}
```

#### In Middleware

**`app/middleware/auth.ts`:**
```typescript
export default defineNuxtRouteMiddleware(async () => {
  const localePath = useLocalePath()
  
  if (!isLoggedIn.value) {
    return navigateTo(localePath('/login'))  // HARDCODED
  }
  
  // ... error handling
  return navigateTo(localePath('/login'))  // HARDCODED
})
```

**`app/middleware/guest.ts`:**
```typescript
export default defineNuxtRouteMiddleware(() => {
  const localePath = useLocalePath()
  
  if (isLoggedIn.value) {
    return navigateTo(localePath('/'))  // HARDCODED
  }
})
```

**`app/middleware/google-auth.ts`:**
```typescript
export default defineNuxtRouteMiddleware(async () => {
  const localePath = useLocalePath()
  
  if (!code || !state) {
    return navigateTo(localePath('/login'), { replace: true })  // HARDCODED
  }
  
  // ... success
  return navigateTo(localePath('/'), { replace: true })  // HARDCODED
  
  // ... error
  return navigateTo(localePath('/login'), { replace: true })  // HARDCODED
})
```

#### In Pages

**`app/pages/products/product/[slug].vue`:**
```typescript
const addToCartAndNavigate = async () => {
  // ... add to cart
  return navigateTo(localePath('/cart'))  // HARDCODED
}

const buyNow = async () => {
  // ... add to cart
  return navigateTo(localePath('/checkout'))  // HARDCODED
}
```

**`app/pages/orders/[orderNumber].vue`:**
```typescript
const continueShopping = () => {
  navigateTo(localePath('/cart'))  // HARDCODED
}

const viewAllOrders = () => {
  navigateTo(localePath('/orders'))  // HARDCODED
}
```

**`app/pages/login.vue`:**
```typescript
const submitLogin = async () => {
  await login(formData.value)
  // Redirect happens in useAuth.composable
}
```

#### In Components

**`app/components/HeaderLinks.vue`:**
```typescript
const navLinks = computed(() => [
  { name: t('header.links.home'), path: '/' },           // HARDCODED
  { name: t('header.links.shop'), path: '/products' },   // HARDCODED
  { name: t('header.links.contact'), path: '#' }
])
```

**`app/components/HeaderSearchInput.vue`:**
```typescript
const selectItem = (item: SearchItem) => {
  if (item.type === 'product') {
    router.push(localePath(`/products/product/${item.slug}`))  // TEMPLATE LITERAL
  } else if (item.type === 'category') {
    router.push(localePath(`/products/category/${item.slug}`)) // TEMPLATE LITERAL
  } else if (item.type === 'search') {
    router.push({ path: localePath('/search'), query: { q: query } }) // HARDCODED
  }
}
```

### Template Literal Path Construction

Dynamic paths are constructed using template literals throughout the codebase:

```typescript
// Product paths
localePath(`/products/product/${item.slug}`)      // HeaderSearchInput.vue
localePath(`/products/product/${product.slug}`)   // ProductCard.vue
`/products/product/${product.slug}`               // Multiple components

// Category paths
localePath(`/products/category/${item.slug}`)     // HeaderSearchInput.vue
localePath(`/products/category/${crumb.slug}`)    // Breadcrumb.vue
`/products/category/${category.slug}`             // CategoryCard.vue

// Order paths
`/orders/${order.order_number}`                   // OrderCard.vue
localePath(`/orders/${orderNumber}`)              // Various components

// Account paths
localePath(`/orders/${order.order_number}`)       // OrderHistory.vue
```

### Query Parameter Patterns

#### Filter Synchronization

**`app/composables/useProductFilters.ts`:**
```typescript
export const useProductFilters = () => {
  const router = useRouter()
  const route = useRoute()
  
  const syncFiltersToUrl = () => {
    const query = route.query
    
    router.push({
      query: {
        ...restQuery,
        category: filters.value.categorySlug ?? undefined,
        min_price: filters.value.minPrice?.toString(),
        max_price: filters.value.maxPrice?.toString(),
        earliest_manufacture: filters.value.manufactureFrom ?? undefined,
        latest_expiry: filters.value.expiryTo ?? undefined
      }
    })
  }
}
```

#### Search Queries

**`app/components/HeaderSearchInput.vue`:**
```typescript
const performSearch = async () => {
  if (query.value.trim()) {
    router.push({ 
      path: localePath('/search'), 
      query: { q: query.value } 
    })
  }
}
```

#### Pagination (API-level, not route-level)

**`app/composables/useOrders.ts`:**
```typescript
export const useOrders = () => {
  const fetchOrders = async (filters: OrderFilters = {}) => {
    const response = await $api('/api/orders', {
      query: {
        status: filters.status,
        from_date: filters.fromDate,
        to_date: filters.toDate,
        per_page: filters.perPage,
        page: filters.page
      }
    })
  }
}
```

Note: Pagination is handled at the API level, not reflected in route parameters.

### Route Names vs Paths

The codebase **exclusively uses path-based navigation**. No route names are defined or used:

```typescript
// ❌ NOT USED (no named routes)
router.push({ name: 'products-product-slug', params: { slug: '...' } })

// ✅ USED (path-based)
router.push(localePath(`/products/product/${slug}`))
```

This means:
- No automatic param validation
- No compile-time checking of route existence
- Manual path construction everywhere

### Redirect Patterns

#### Middleware Redirects

| Middleware | Condition | Redirect To | Files |
|------------|-----------|-------------|-------|
| `auth` | Not logged in | `/login` | auth.ts |
| `auth` | Token invalid | `/login` | auth.ts |
| `auth` | Fetch user failed | `/login` | auth.ts |
| `guest` | Already logged in | `/` | guest.ts |
| `google-auth` | Missing code/state | `/login` | google-auth.ts |
| `google-auth` | Success | `/` | google-auth.ts |
| `google-auth` | Error | `/login` | google-auth.ts |

#### Programmatic Redirects

```typescript
// After successful login
return navigateTo(localePath('/'))  // useAuth.ts

// After successful logout
return navigateTo(localePath('/login'))  // useAuth.ts

// After Google OAuth success
return navigateTo(localePath('/'), { replace: true })  // google-auth.ts

// After account deletion
return navigateTo(localePath('/login'))  // useProfile.ts

// After adding to cart (buy now)
return navigateTo(localePath('/checkout'))  // product/[slug].vue

// After adding to cart (continue shopping)
return navigateTo(localePath('/cart'))  // product/[slug].vue
```

### Auth Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTH NAVIGATION FLOW                      │
└─────────────────────────────────────────────────────────────┘

UNAUTHENTICATED USER:
  ├─ Visits protected route (/orders, /profile)
  │  └─ auth.ts middleware → redirect to /login
  │
  ├─ Visits login/register page
  │  └─ guest.ts allows access
  │
  └─ Completes login
     └─ useAuth.login() → redirect to /

AUTHENTICATED USER:
  ├─ Visits login/register page
  │  └─ guest.ts middleware → redirect to /
  │
  ├─ Visits protected route
  │  └─ auth.ts allows access
  │
  └─ Logs out
     └─ useAuth.logout() → redirect to /login

GOOGLE OAUTH FLOW:
  ├─ User clicks "Login with Google"
  │  └─ Redirects to Google OAuth endpoint
  │
  ├─ Google redirects to /auth/google/callback?code=...&state=...
  │  └─ google-auth.ts processes callback
  │     ├─ Success → redirect to /
  │     └─ Error → redirect to /login
  │
  └─ User is authenticated
```

---

## 4. Risk Analysis

### High-Risk Areas

#### 1. Duplicated Route Logic (CRITICAL)

The same path strings appear in multiple locations throughout the codebase. Changing any route requires updating numerous files.

**Path: `/login`**
Appears in **8+ locations**:
- `app/composables/useAuth.ts` (logout redirect)
- `app/composables/useProfile.ts` (delete account redirect)
- `app/middleware/auth.ts` (unauthorized redirect)
- `app/middleware/guest.ts` - NOT used
- `app/middleware/google-auth.ts` (error redirect, missing params redirect)
- `app/pages/login.vue` - implicit via useAuth
- `app/pages/register.vue` - link to login
- `app/pages/verify-email/[id]/[hash].vue` (expired/invalid redirect)

**Path: `/` (home)**
Appears in **6+ locations**:
- `app/composables/useAuth.ts` (login success)
- `app/composables/useAuth.ts` (Google callback success)
- `app/middleware/guest.ts` (logged-in user redirect)
- `app/middleware/google-auth.ts` (success redirect)
- `app/components/HeaderLinks.vue` (nav link)
- `app/components/Breadcrumb.vue` (home crumb)
- Multiple other components

**Path: `/cart`**
Appears in **5+ locations**:
- `app/pages/products/product/[slug].vue` (add to cart redirect)
- `app/pages/orders/[orderNumber].vue` (continue shopping)
- `app/pages/orders/index.vue` (shop again link)
- `app/pages/checkout/cancel.vue` (back to cart link)
- `app/components/HeaderCartIcon.vue` (cart link)

**Path: `/orders`**
Appears in **4+ locations**:
- `app/pages/orders/[orderNumber].vue` (view all orders)
- `app/components/HeaderProfileDropdown.vue` (dropdown link)
- `app/components/OrderBreadcrumb.vue` (breadcrumb)
- `app/components/SidebarMenu.vue` (menu item)

**Risk Impact:**
- **High maintenance cost**: Single route change requires 5-10 file updates
- **Inconsistency risk**: Developers may miss some occurrences
- **Refactoring blocker**: Makes future route structure changes extremely risky

#### 2. Fragile Path Construction (HIGH)

Template literals are scattered without validation or type safety:

```typescript
// Variation 1: Direct interpolation
localePath(`/products/product/${item.slug}`)      // HeaderSearchInput.vue

// Variation 2: Different parameter name
localePath(`/products/${item.product_slug}`)      // Hypothetical variation

// Variation 3: No localePath (potential bug)
`/products/product/${product.slug}`               // Some components

// Variation 4: Different structure
localePath(`/products/category/${item.slug}`)     // HeaderSearchInput.vue
```

**Risk Impact:**
- Typos in path structures won't be caught at compile time
- Inconsistent patterns make code reviews harder
- No validation that required parameters exist
- RTL/Locale issues if `localePath` is forgotten

#### 3. Hidden Dependencies on i18n (HIGH)

Every navigation call implicitly depends on `useLocalePath()`:

```typescript
const localePath = useLocalePath()  // Called in 15+ files
return navigateTo(localePath('/login'))
```

**Risk Impact:**
- If i18n configuration changes (strategy, default locale), every file needs review
- New developers may forget to wrap paths with `localePath()`
- Testing becomes complex (must test all locale combinations)
- Server-side rendering edge cases if locale context is missing

#### 4. Middleware-Hardcoded Redirects (MEDIUM-HIGH)

Middleware contains hardcoded redirect paths with no configurability:

```typescript
// app/middleware/auth.ts
return navigateTo(localePath('/login'))  // Cannot customize per-page

// app/middleware/guest.ts  
return navigateTo(localePath('/'))  // Always goes home, cannot specify "intended destination"
```

**Risk Impact:**
- Cannot preserve "intended destination" after login
- All protected routes redirect to the same page
- No way to customize redirect behavior per-route
- Poor UX for deep-linking users

#### 5. No Route Type Safety (HIGH)

Routes are plain strings with zero TypeScript validation:

```typescript
// ❌ This compiles fine even though route doesn't exist
navigateTo(localePath('/nonexistent-page'))

// ❌ Typos aren't caught
navigateTo(localePath('/logn'))  // Typo!

// ❌ Missing parameters aren't validated
const slug = undefined
navigateTo(localePath(`/products/product/${slug}`))  // Produces /products/product/undefined
```

**Risk Impact:**
- Runtime errors only discovered during testing or production
- No autocomplete support in IDEs
- Refactoring tools can't track route usage
- Broken links slip through code review

#### 6. Commented-Out Middleware (MEDIUM)

Security inconsistency detected:

```typescript
// app/pages/orders/index.vue
definePageMeta({
  // middleware: 'auth',  // COMMENTED OUT!
})
```

**Risk Impact:**
- Orders list may be accessible without authentication
- Inconsistent security model across order-related pages
- Potential data exposure
- Unclear intent (temporary debug? intentional?)

#### 7. Mixed Navigation Patterns (LOW-MEDIUM)

Multiple navigation methods create inconsistency:

```typescript
// Method 1: navigateTo (composables, middleware)
return navigateTo(localePath('/login'))

// Method 2: router.push (components)
router.push(localePath('/products'))

// Method 3: NuxtLinkLocale (templates)
<NuxtLinkLocale to="/cart">Cart</NuxtLinkLocale>

// Method 4: NuxtLink without locale (potential bug)
<NuxtLink :to="`/products/${slug}`">Product</NuxtLink>
```

**Risk Impact:**
- Inconsistent code style
- Some methods may behave differently in edge cases
- Harder to implement global navigation logging/analytics
- Confusing for new developers

### Risk Summary Matrix

| Risk | Severity | Frequency | Files Affected | Mitigation Difficulty |
|------|----------|-----------|----------------|----------------------|
| Duplicated route logic | Critical | Very High | 30+ | Medium |
| Fragile path construction | High | High | 20+ | Medium |
| i18n dependency coupling | High | Very High | 25+ | Low |
| Middleware hardcoded redirects | Medium-High | Medium | 3 | Low |
| No type safety | High | Very High | All | Medium |
| Commented-out middleware | Medium | Low | 1 | Low |
| Mixed navigation patterns | Low-Medium | High | 20+ | Low |

---

## 5. Recommended Future Architecture

### Proposed Folder Structure

```
shared/
└── routes/
    ├── index.ts              # Re-exports all domain routes and types
    ├── types.ts              # TypeScript types and interfaces for routes
    ├── constants.ts          # Base path constants
    ├── useNavigation.ts      # Centralized navigation composable
    ├── builders/             # Route builder functions by domain
    │   ├── product.ts        # Product-related route builders
    │   ├── order.ts          # Order-related route builders
    │   ├── auth.ts           # Authentication route builders
    │   ├── checkout.ts       # Checkout flow route builders
    │   └── account.ts        # User account route builders
    └── domains/              # Domain-specific route definitions
        ├── auth.ts           # Authentication routes configuration
        ├── products.ts       # Product/catalog routes configuration
        ├── orders.ts         # Order management routes configuration
        ├── checkout.ts       # Checkout flow routes configuration
        ├── account.ts        # User account routes configuration
        └── common.ts         # Common routes (home, search, etc.)
```

### Naming Conventions

#### Constants (UPPER_SNAKE_CASE)

```typescript
// shared/routes/constants.ts
export const ROUTES = {
  // Common
  HOME: '/',
  SEARCH: '/search',
  
  // Authentication
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  GOOGLE_CALLBACK: '/auth/google/callback',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/product',
  CATEGORY: '/products/category',
  
  // Orders
  ORDERS: '/orders',
  ORDER_TRACK: '/orders/track',
  
  // Cart & Checkout
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_SUCCESS: '/checkout/success',
  CHECKOUT_CANCEL: '/checkout/cancel',
  
  // Account
  PROFILE: '/profile',
} as const

export type RouteConstant = typeof ROUTES[keyof typeof ROUTES]
```

#### Route Builders (camelCase functions)

```typescript
// shared/routes/builders/product.ts
import { ROUTES } from '../constants'

export const productRoutes = {
  /** List all products */
  list: (): string => ROUTES.PRODUCTS,
  
  /** Product detail page */
  detail: (slug: string): string => `${ROUTES.PRODUCT_DETAIL}/${slug}`,
  
  /** Category listing */
  category: (slug: string): string => `${ROUTES.CATEGORY}/${slug}`,
  
  /** Validate slug parameter */
  isValidDetail: (path: string): path is `/products/product/${string}` => {
    return path.startsWith(`${ROUTES.PRODUCT_DETAIL}/`)
  },
  
  /** Extract slug from detail path */
  extractSlug: (path: string): string | null => {
    const match = path.match(/^\/products\/product\/([^/]+)$/)
    return match?.[1] ?? null
  }
} as const

// Usage:
// const url = productRoutes.detail('my-product-slug')
// → "/products/product/my-product-slug"
```

```typescript
// shared/routes/builders/order.ts
import { ROUTES } from '../constants'

export const orderRoutes = {
  /** Order history/list */
  list: (): string => ROUTES.ORDERS,
  
  /** Specific order detail */
  detail: (orderNumber: string): string => `${ROUTES.ORDERS}/${orderNumber}`,
  
  /** Order tracking page */
  track: (): string => ROUTES.ORDER_TRACK,
  
  /** Validate order number format */
  isValidOrderNumber: (orderNumber: string): boolean => {
    return /^ORD-\d{6,}$/.test(orderNumber)
  }
} as const
```

```typescript
// shared/routes/builders/auth.ts
import { ROUTES } from '../constants'

export const authRoutes = {
  /** Login page */
  login: (): string => ROUTES.LOGIN,
  
  /** Registration page */
  register: (): string => ROUTES.REGISTER,
  
  /** Email verification */
  verifyEmail: (id: string, hash: string): string => 
    `${ROUTES.VERIFY_EMAIL}/${id}/${hash}`,
  
  /** Google OAuth callback */
  googleCallback: (): string => ROUTES.GOOGLE_CALLBACK,
  
  /** Build Google OAuth URL */
  buildGoogleOAuthUrl: (state: string): string => 
    `/api/auth/google?state=${encodeURIComponent(state)}`,
  
  /** Post-logout redirect */
  postLogout: (): string => ROUTES.LOGIN,
  
  /** Post-login redirect (default) */
  postLogin: (): string => ROUTES.HOME,
} as const
```

#### Domain Modules (structured exports)

```typescript
// shared/routes/domains/auth.ts
import { ROUTES } from '../constants'
import { authRoutes } from '../builders/auth'

export { authRoutes }

export const authMiddlewareConfig = {
  /** Where to redirect when auth middleware blocks access */
  unauthorizedRedirect: authRoutes.login,
  
  /** Where to redirect when guest middleware blocks access */
  authenticatedRedirect: authRoutes.postLogin,
  
  /** Routes that require authentication */
  protectedRoutes: [
    ROUTES.PROFILE,
    ROUTES.ORDERS,
    `${ROUTES.ORDERS}/`,  // All sub-routes
  ],
  
  /** Routes that should redirect if already authenticated */
  guestRoutes: [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
  ],
} as const

export type AuthRoute = keyof typeof authRoutes
```

```typescript
// shared/routes/domains/products.ts
import { ROUTES } from '../constants'
import { productRoutes } from '../builders/product'

export { productRoutes }

export const productNavigation = {
  /** Main navigation links for products section */
  navLinks: [
    { key: 'all-products', path: productRoutes.list(), translationKey: 'nav.products.all' },
    { key: 'categories', path: ROUTES.PRODUCTS, translationKey: 'nav.products.categories' },
  ],
  
  /** Breadcrumb generator for product pages */
  breadcrumbs: {
    productDetail: (product: { name: string; slug: string }) => [
      { label: 'Home', path: ROUTES.HOME },
      { label: 'Products', path: productRoutes.list() },
      { label: product.name, path: productRoutes.detail(product.slug) },
    ],
    category: (category: { name: string; slug: string }) => [
      { label: 'Home', path: ROUTES.HOME },
      { label: 'Products', path: productRoutes.list() },
      { label: category.name, path: productRoutes.category(category.slug) },
    ],
  },
} as const
```

### Route Helper Architecture

#### Centralized Navigation Composable

```typescript
// shared/routes/useNavigation.ts
import { navigateTo as _navigateTo, NavigateToOptions } from '#app'
import { useLocalePath } from '#i18n'
import { useRouter } from '#imports'
import { productRoutes } from './builders/product'
import { orderRoutes } from './builders/order'
import { authRoutes } from './builders/auth'
import { ROUTES } from './constants'

export const useNavigation = () => {
  const localePath = useLocalePath()
  const router = useRouter()
  
  /**
   * Navigate to a localized path
   */
  const navigateTo = (path: string, options?: NavigateToOptions) => {
    return _navigateTo(localePath(path), options)
  }
  
  /**
   * Push to router history with localized path
   */
  const push = (path: string) => {
    return router.push(localePath(path))
  }
  
  /**
   * Replace router history with localized path
   */
  const replace = (path: string) => {
    return router.replace(localePath(path))
  }
  
  // Domain-specific navigation helpers
  
  const toProducts = () => navigateTo(productRoutes.list())
  const toProduct = (slug: string) => navigateTo(productRoutes.detail(slug))
  const toCategory = (slug: string) => navigateTo(productRoutes.category(slug))
  
  const toOrders = () => navigateTo(orderRoutes.list())
  const toOrder = (orderNumber: string) => navigateTo(orderRoutes.detail(orderNumber))
  const toTrackOrder = () => navigateTo(orderRoutes.track())
  
  const toLogin = () => navigateTo(authRoutes.login())
  const toRegister = () => navigateTo(authRoutes.register())
  const toProfile = () => navigateTo(ROUTES.PROFILE)
  const toCart = () => navigateTo(ROUTES.CART)
  const toCheckout = () => navigateTo(ROUTES.CHECKOUT)
  const toHome = () => navigateTo(ROUTES.HOME)
  const toSearch = (query?: string) => {
    const path = ROUTES.SEARCH
    return query 
      ? _navigateTo(localePath(path), { query: { q: query } })
      : navigateTo(path)
  }
  
  /**
   * Navigate after successful authentication
   * Preserves intended destination if available
   */
  const afterLogin = (intendedPath?: string) => {
    const destination = intendedPath || authRoutes.postLogin()
    return navigateTo(destination)
  }
  
  /**
   * Navigate after logout
   */
  const afterLogout = () => {
    return navigateTo(authRoutes.postLogout())
  }
  
  return {
    // Generic
    navigateTo,
    push,
    replace,
    
    // Products
    toProducts,
    toProduct,
    toCategory,
    
    // Orders
    toOrders,
    toOrder,
    toTrackOrder,
    
    // Auth
    toLogin,
    toRegister,
    toProfile,
    afterLogin,
    afterLogout,
    
    // Common
    toCart,
    toCheckout,
    toHome,
    toSearch,
  }
}
```

#### Typed Route Parameters

```typescript
// shared/routes/types.ts

/**
 * Map of route patterns to their parameter types
 */
export interface RouteParamsMap {
  '/products/product/[slug]': { slug: string }
  '/products/category/[slug]': { slug: string }
  '/orders/[orderNumber]': { orderNumber: string }
  '/verify-email/[id]/[hash]': { id: string; hash: string }
}

/**
 * All valid route paths (static + dynamic patterns)
 */
export type RoutePath = 
  | '/'
  | '/login'
  | '/register'
  | '/profile'
  | '/cart'
  | '/search'
  | '/products'
  | '/products/category/[slug]'
  | '/products/product/[slug]'
  | '/orders'
  | '/orders/track'
  | '/orders/[orderNumber]'
  | '/checkout'
  | '/checkout/success'
  | '/checkout/cancel'
  | '/verify-email/[id]/[hash]'
  | '/auth/google/callback'

/**
 * Extract route name from path
 */
export type RouteName = 
  | 'home'
  | 'login'
  | 'register'
  | 'profile'
  | 'cart'
  | 'search'
  | 'products'
  | 'products-category'
  | 'products-product'
  | 'orders'
  | 'orders-track'
  | 'orders-detail'
  | 'checkout'
  | 'checkout-success'
  | 'checkout-cancel'
  | 'verify-email'
  | 'auth-google-callback'

/**
 * Get parameters type for a given route
 */
export type ParamsForRoute<T extends RoutePath> = 
  T extends keyof RouteParamsMap 
    ? RouteParamsMap[T] 
    : Record<string, never>

/**
 * Safe navigation function with type checking
 */
export type SafeNavigate = <T extends RoutePath>(
  path: T,
  params?: ParamsForRoute<T>
) => ReturnType<typeof navigateTo>
```

#### Middleware Configuration

```typescript
// shared/routes/middleware-config.ts
import { authRoutes } from './builders/auth'
import { ROUTES } from './constants'

/**
 * Centralized middleware redirect configuration
 * Allows per-environment or per-page customization
 */
export const middlewareRedirects = {
  auth: {
    /** Where to redirect when user is not authenticated */
    unauthorized: authRoutes.login,
    
    /** Optional: custom redirect per route */
    customRedirects: {
      // '/orders': () => authRoutes.login(),
      // '/profile': () => authRoutes.login(),
    } as Record<string, () => string>,
  },
  
  guest: {
    /** Where to redirect when authenticated user visits guest route */
    authenticated: authRoutes.postLogin,
  },
  
  googleAuth: {
    /** Redirect when OAuth callback is missing params */
    missingParams: authRoutes.login,
    
    /** Redirect on OAuth success */
    success: authRoutes.postLogin,
    
    /** Redirect on OAuth error */
    error: authRoutes.login,
  },
} as const

/**
 * Intended destination storage key
 */
export const INTENDED_DESTINATION_KEY = 'intended_destination'
```

### Domain Splitting Recommendations

Based on the current codebase structure and business logic separation:

| Domain | Routes | Associated Composables | Middleware | Priority |
|--------|--------|----------------------|------------|----------|
| **Authentication** | `/login`, `/register`, `/verify-email/*`, `/auth/google/*` | `useAuth` | `guest`, `google-auth` | P0 |
| **Products** | `/products`, `/products/category/*`, `/products/product/*`, `/search` | `useProduct`, `useProductFilters`, `useProducts` | None | P0 |
| **Orders** | `/orders`, `/orders/*`, `/orders/track` | `useOrder`, `useOrders` | `auth` (enable commented) | P1 |
| **Checkout** | `/cart`, `/checkout/*` | `useCart`, `useCheckout` | None | P1 |
| **Account** | `/profile` | `useProfile` | `auth` | P2 |
| **Common** | `/` | None | None | P3 |

#### Domain Boundaries

**Authentication Domain:**
- Entry points: login, register, email verification, OAuth callbacks
- Exits: successful login → home/profile, logout → login
- Shared state: authentication status, user object, tokens

**Products Domain:**
- Entry points: product listing, category browsing, product detail, search
- Exits: add to cart → cart page, buy now → checkout
- Shared state: filters, sorting, pagination

**Orders Domain:**
- Entry points: order history, order detail, order tracking
- Exits: continue shopping → cart/products
- Shared state: order filters, date ranges

**Checkout Domain:**
- Entry points: cart review, checkout flow
- Exits: success → order detail, cancel → cart
- Shared state: cart items, shipping info, payment method

### Migration Strategy

#### Phase 1: Foundation (Low Risk, 1-2 days)

1. Create `shared/routes/constants.ts` with all base paths
2. Create `shared/routes/types.ts` with TypeScript definitions
3. Create basic route builders for most-used domains (auth, products)
4. Export from `shared/routes/index.ts`

**Files to update:** None yet (parallel implementation)

#### Phase 2: Composables Migration (Medium Risk, 2-3 days)

1. Create `shared/routes/useNavigation.ts` composable
2. Update `useAuth.ts` to use route constants/builders
3. Update `useProfile.ts` to use route constants
4. Update `useOrders.ts` if it has navigation logic
5. Update `useProductFilters.ts` to use route builders

**Files to update:**
- `app/composables/useAuth.ts`
- `app/composables/useProfile.ts`
- `app/composables/useProductFilters.ts`

#### Phase 3: Middleware Migration (Medium Risk, 1 day)

1. Update middleware to use route constants
2. Implement intended destination preservation
3. Enable commented-out auth middleware on `/orders`

**Files to update:**
- `app/middleware/auth.ts`
- `app/middleware/guest.ts`
- `app/middleware/google-auth.ts`
- `app/pages/orders/index.vue` (enable middleware)

#### Phase 4: Page Migration (Low-Medium Risk, 2-3 days)

1. Update all page-level navigation calls
2. Replace hardcoded paths with route builders
3. Add type annotations where beneficial

**Files to update:**
- All `app/pages/**/*.vue` files with navigation logic

#### Phase 5: Component Migration (Medium Risk, 3-4 days)

1. Update navigation in header/footer components
2. Update product cards, order cards, etc.
3. Update breadcrumb components
4. Update sidebar/menu components

**Files to update:**
- `app/components/Header*.vue`
- `app/components/Product*.vue`
- `app/components/Order*.vue`
- `app/components/Breadcrumb.vue`
- `app/components/Sidebar*.vue`
- All other components with navigation

#### Phase 6: Advanced Features (Optional, 2-3 days)

1. Implement route change logging/analytics
2. Add route permissions/roles system
3. Create route documentation generator
4. Implement route prefetching optimization

### Success Metrics

After migration, the codebase should have:

- ✅ Zero hardcoded path strings (all use constants/builders)
- ✅ 100% of navigation goes through `useNavigation()` or route builders
- ✅ TypeScript catches invalid routes at compile time
- ✅ Single source of truth for each route path
- ✅ Middleware redirects are configurable
- ✅ Intended destination is preserved across login
- ✅ Route changes require updating only 1-2 files
- ✅ Full test coverage for route builders

### Anti-Patterns to Avoid

```typescript
// ❌ DON'T: Mix constants and builders inconsistently
const path = ROUTES.PRODUCTS + '/' + slug

// ✅ DO: Use builder functions
const path = productRoutes.detail(slug)

// ❌ DON'T: Create route strings in templates
<NuxtLink :to="`/products/${slug}`">

// ✅ DO: Use builders in computed properties
const productUrl = computed(() => productRoutes.detail(product.value.slug))
<NuxtLink :to="productUrl">

// ❌ DON'T: Hardcode redirects in middleware
return navigateTo(localePath('/login'))

// ✅ DO: Use configuration
return navigateTo(middlewareRedirects.auth.unauthorized())

// ❌ DON'T: Forget localePath
router.push('/products')

// ✅ DO: Always localize
const { push } = useNavigation()
push('/products')  // useNavigation handles localization
```

---

## Appendix A: Complete File Inventory

### Files with Navigation Logic

#### Composables (7 files)
- `app/composables/useAuth.ts` - Login/logout/Google OAuth navigation
- `app/composables/useProfile.ts` - Account deletion navigation
- `app/composables/useProductFilters.ts` - Filter sync navigation
- `app/composables/useProducts.ts` - Product fetching (no navigation)
- `app/composables/useProduct.ts` - Single product (no navigation)
- `app/composables/useOrders.ts` - Order fetching (no navigation)
- `app/composables/useOrder.ts` - Single order (no navigation)

#### Middleware (3 files)
- `app/middleware/auth.ts` - Auth protection redirects
- `app/middleware/guest.ts` - Guest protection redirects
- `app/middleware/google-auth.ts` - OAuth callback handling

#### Pages (15 files)
- `app/pages/index.vue` - Home (no navigation)
- `app/pages/login.vue` - Login form
- `app/pages/register.vue` - Registration form
- `app/pages/profile.vue` - User profile
- `app/pages/cart.vue` - Shopping cart
- `app/pages/search.vue` - Search results
- `app/pages/verify-email/[id]/[hash].vue` - Email verification
- `app/pages/auth/google/callback.vue` - OAuth callback
- `app/pages/checkout/cancel.vue` - Checkout cancelled
- `app/pages/checkout/success.vue` - Checkout success
- `app/pages/orders/index.vue` - Order history
- `app/pages/orders/track.vue` - Order tracking
- `app/pages/orders/[orderNumber].vue` - Order detail
- `app/pages/products/index.vue` - Products listing
- `app/pages/products/category/[slug].vue` - Category page
- `app/pages/products/product/[slug].vue` - Product detail

#### Components (20+ files with navigation)
- `app/components/HeaderLinks.vue` - Main navigation
- `app/components/HeaderSearchInput.vue` - Search navigation
- `app/components/HeaderProfileDropdown.vue` - Profile menu
- `app/components/HeaderCartIcon.vue` - Cart link
- `app/components/Breadcrumb.vue` - Breadcrumb generation
- `app/components/SidebarMenu.vue` - Sidebar navigation
- `app/components/ProductCard.vue` - Product links
- `app/components/CategoryCard.vue` - Category links
- `app/components/OrderCard.vue` - Order links
- `app/components/OrderItem.vue` - Order item links
- `app/components/ProductBreadcrumb.vue` - Product breadcrumbs
- `app/components/OrderBreadcrumb.vue` - Order breadcrumbs
- And 10+ more components

### Total Occurrences by Path

| Path | Approximate Count | Files |
|------|------------------|-------|
| `/` | 10+ | 8 files |
| `/login` | 12+ | 9 files |
| `/products` | 8+ | 6 files |
| `/products/product/*` | 15+ | 10 files |
| `/products/category/*` | 8+ | 6 files |
| `/cart` | 8+ | 6 files |
| `/orders` | 6+ | 5 files |
| `/orders/*` | 8+ | 5 files |
| `/checkout` | 4+ | 3 files |
| `/profile` | 4+ | 3 files |
| `/search` | 3+ | 2 files |

**Total hardcoded path occurrences: ~86+**

---

## Appendix B: Quick Reference

### Current Pain Points

1. **86+ hardcoded path strings** across the codebase
2. **Zero type safety** for routes
3. **No single source of truth** for route paths
4. **Duplicated redirect logic** in middleware
5. **No intended destination** preservation
6. **Commented-out security middleware** on orders page

### Immediate Actions Required

1. Enable `middleware: 'auth'` on `app/pages/orders/index.vue`
2. Audit all `/login` redirects for consistency
3. Ensure all navigation uses `localePath()`
4. Document current route structure before migration

### Long-Term Goals

1. Centralize all route definitions
2. Add TypeScript type safety
3. Implement intended destination tracking
4. Create comprehensive route documentation
5. Add route change analytics

---

*Audit completed based on repository inspection. All findings are based on actual code examination.*
