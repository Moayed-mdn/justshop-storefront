# ⚡ Common Tasks - Quick Reference Guide

**Fast answers for everyday Nuxt 4 development tasks**  
**Last Updated**: June 7, 2026

---

## 🎯 Most Common Tasks

### 1. Start Development
```bash
nvm use              # Use correct Node version
npm install          # First time only
npm run dev          # Start dev server
# → http://localhost:3000
```

### 2. Add a New Page
```typescript
// app/pages/products/[id].vue
<template>
  <div>
    <h1>{{ product.name }}</h1>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const productId = route.params.id

const { data: product } = await useFetch(`/api/products/${productId}`)
</script>
```

### 3. Create a Component
```typescript
// app/components/Product/Card.vue
<template>
  <div class="product-card">
    <h3>{{ product.name }}</h3>
    <p>{{ product.price }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  product: {
    name: string
    price: number
  }
}

const props = defineProps<Props>()
</script>
```

### 4. Use a Composable
```typescript
// app/composables/useProducts.ts
export const useProducts = () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  
  const fetchProducts = async () => {
    loading.value = true
    try {
      const data = await useApi<Product[]>('/api/products')
      products.value = data
    } finally {
      loading.value = false
    }
  }
  
  return {
    products,
    loading,
    fetchProducts
  }
}

// Usage in component
const { products, loading, fetchProducts } = useProducts()
await fetchProducts()
```

### 5. Add a Server Route
```typescript
// server/api/products/[id].get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  // Proxy to backend
  const product = await $fetch(`/api/products/${id}`, {
    baseURL: useRuntimeConfig().public.apiBase,
  })
  
  return product
})
```

---

## 📦 Component Patterns

### Auto-Imported Component
```typescript
// app/components/ui/Button.vue
<template>
  <button :class="variant">
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})
</script>

// Usage (auto-imported):
<UiButton variant="primary">Click me</UiButton>
```

### Client-Only Component
```typescript
// app/components/Cart/Widget.vue
<template>
  <ClientOnly>
    <div class="cart-widget">
      <span>{{ cartStore.itemCount }} items</span>
    </div>
    <template #fallback>
      <div>Loading cart...</div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const cartStore = useCartStore()
</script>
```

---

## 🔄 Data Fetching Patterns

### Server-Side Fetch (SSR)
```typescript
// In page or component
const { data, pending, error, refresh } = await useFetch('/api/products', {
  key: 'products',
  transform: (data) => data.products,
})
```

### Client-Side with useApi Composable
```typescript
// app/composables/useApi.ts usage
const fetchProducts = async () => {
  try {
    const data = await useApi<Product[]>('/api/products')
    products.value = data
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
}
```

### GraphQL Query (Apollo)
```typescript
// In component with Apollo
const { result, loading, error } = useQuery(gql`
  query SearchProducts($query: String!) {
    products(query: $query) {
      id
      name
      price
    }
  }
`, {
  query: searchQuery.value
})
```

### POST/PUT/DELETE Request
```typescript
// Server action
const createProduct = async (productData: ProductInput) => {
  try {
    const result = await $fetch('/api/products', {
      method: 'POST',
      body: productData,
    })
    return result
  } catch (error) {
    console.error('Failed to create product:', error)
    throw error
  }
}
```

---

## 🏪 Pinia Store Patterns

### Define Store
```typescript
// app/stores/products.ts
import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [] as Product[],
    loading: false,
  }),
  
  getters: {
    itemCount: (state) => state.items.length,
  },
  
  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        const data = await useApi<Product[]>('/api/products')
        this.items = data
      } finally {
        this.loading = false
      }
    },
  },
})
```

### Use Store with Persistence
```typescript
// app/stores/cart.ts (persisted)
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  
  actions: {
    addItem(item: CartItem) {
      this.items.push(item)
    },
  },
  
  persist: {
    storage: persistedState.localStorage,
  },
})
```

---

## 🛣️ Routing Patterns

### Programmatic Navigation
```typescript
// Navigate to page
const router = useRouter()
router.push('/products')

// With params
router.push({ 
  name: 'products-id', 
  params: { id: '123' } 
})

// With query
router.push({ 
  path: '/products', 
  query: { category: 'electronics' } 
})
```

### Route Middleware
```typescript
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})

// Use in page:
<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>
```

### Dynamic Routes
```typescript
// app/pages/products/[id].vue
const route = useRoute()
const id = route.params.id

// app/pages/shop/[...slug].vue (catch-all)
const slug = route.params.slug // ['category', 'electronics']
```

---

## 🌍 Internationalization

### Using Translations
```typescript
// In template
<template>
  <h1>{{ $t('products.title') }}</h1>
  <p>{{ $t('products.count', { count: 5 }) }}</p>
</template>

// In script
<script setup lang="ts">
const { t, locale } = useI18n()

const title = t('products.title')
const currentLocale = locale.value // 'en' or 'ar'
</script>
```

### Switch Locale
```typescript
const { locale, setLocale } = useI18n()

const switchLanguage = () => {
  setLocale(locale.value === 'en' ? 'ar' : 'en')
}
```

### Localized Routes
```typescript
// Auto-generated routes:
// /en/products
// /ar/products

// Navigate with locale
const localePath = useLocalePath()
navigateTo(localePath('/products'))
```

---

## 🎨 Styling Patterns

### Component Styling
```vue
<template>
  <div class="product-card">
    <h3>{{ title }}</h3>
  </div>
</template>

<style scoped>
.product-card {
  padding: 1rem;
  border-radius: 8px;
}

/* RTL support */
.product-card {
  padding-inline-start: 1rem;
  padding-inline-end: 1rem;
}
</style>
```

### Dynamic Classes
```vue
<template>
  <button :class="buttonClasses">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant: 'primary' | 'secondary'
  disabled?: boolean
}>()

const buttonClasses = computed(() => [
  'btn',
  `btn-${props.variant}`,
  { 'btn-disabled': props.disabled }
])
</script>
```

---

## 🔐 Authentication Patterns

### Check Auth Status
```typescript
// In component
const authStore = useAuthStore()

if (!authStore.isAuthenticated) {
  navigateTo('/login')
}

// User info
const user = authStore.user
```

### Login/Logout
```typescript
const authStore = useAuthStore()

// Login
await authStore.login({
  email: 'user@example.com',
  password: 'password'
})

// Logout
await authStore.logout()
```

---

## 🔧 Server Utilities

### Backend API Proxy
```typescript
// server/utils/api.ts usage
export default defineEventHandler(async (event) => {
  try {
    const data = await backendApi(event, '/products')
    return data
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch products'
    })
  }
})
```

### Request Headers
```typescript
// Get headers
const headers = getRequestHeaders(event)

// Get specific header
const authToken = getHeader(event, 'authorization')

// Set response header
setHeader(event, 'Cache-Control', 'max-age=3600')
```

---

## 🐛 Debugging

### Common Issues

#### 1. Hydration Mismatch
```
Problem: HTML differs between server and client
Solution:
- Use <ClientOnly> for browser-only content
- Check for random/date values in SSR
- Ensure consistent rendering

Debug:
console.log('SSR:', import.meta.server)
console.log('Client:', import.meta.client)
```

#### 2. Module Not Found
```
Problem: Auto-import not working
Solution:
- Run: npx nuxi prepare
- Check file naming: PascalCase for components
- Check directory: app/components/

Debug:
ls -R app/components/
```

#### 3. Store Not Persisted
```
Problem: Store resets on refresh
Solution:
- Check persist config in store
- Verify client-side access only
- Check localStorage availability

Debug:
console.log(localStorage.getItem('cart'))
```

#### 4. API Call Fails
```
Problem: Fetch returns error
Solution:
- Check NUXT_PUBLIC_API_BASE in .env
- Verify backend is running
- Check CORS settings
- Review server/api/ proxy

Debug:
const config = useRuntimeConfig()
console.log(config.public.apiBase)
```

---

## 🚀 Performance Tips

### 1. Lazy Load Components
```typescript
// Lazy import
const LazyModal = defineAsyncComponent(
  () => import('~/components/Modal.vue')
)
```

### 2. Optimize Images
```vue
<template>
  <NuxtImg 
    src="/product.jpg"
    width="400"
    height="300"
    loading="lazy"
    format="webp"
  />
</template>
```

### 3. Use Keep-Alive
```vue
<template>
  <NuxtPage :keepalive="{ max: 5 }" />
</template>
```

### 4. Prefetch Data
```typescript
// Prefetch on hover
const prefetchProducts = () => {
  prefetchComponents('ProductList')
  preloadRouteComponents('/products')
}
```

---

## 📋 Code Quality Checklist

Before committing:

```markdown
[ ] TypeScript types are correct
[ ] No console.log in production code
[ ] Components are properly scoped
[ ] Server-side rendering works
[ ] Translations exist for all text
[ ] RTL tested (Arabic locale)
[ ] Error handling implemented
[ ] Loading states added
[ ] Routes are protected (if needed)
[ ] Environment variables documented
```

---

## 🔧 Useful Commands

### Development
```bash
npm run dev              # Start dev server
npm run dev -- --host    # Expose to network
```

### Quality Checks
```bash
npx nuxi prepare         # Regenerate types
npx nuxi typecheck       # TypeScript validation
npm run lint             # ESLint (if configured)
```

### Build
```bash
npm run build            # Production build
npm run preview          # Preview build locally
npm run generate         # Static generation
```

### Cleanup
```bash
rm -rf .nuxt             # Clear Nuxt cache
rm -rf node_modules      # Clear dependencies
npm install              # Reinstall
```

### Debugging
```bash
NODE_OPTIONS='--inspect' npm run dev  # Debug mode
```

---

## 💡 Pro Tips

### Daily Productivity

1. **Use Auto-Imports**
   - Components, composables, utilities auto-import
   - No need for explicit imports

2. **Leverage TypeScript**
   - Define interfaces for props
   - Use type inference
   - Check with `npx nuxi typecheck`

3. **Use Dev Tools**
   - Vue DevTools for component inspection
   - Nuxt DevTools for route/state debugging
   - Network tab for API calls

4. **Keep Docs Handy**
   - Bookmark this guide
   - Reference architecture docs
   - Check coding standards

---

## 📚 Related Documentation

- **Complete Guide**: [00-START-HERE.md](../00-START-HERE.md)
- **Coding Standards**: [development/coding-standards.md](../development/coding-standards.md)
- **Components**: [development/components.md](../development/components.md)
- **Composables**: [development/composables.md](../development/composables.md)
- **Architecture**: [architecture/overview.md](../architecture/overview.md)
- **Troubleshooting**: [development/troubleshooting.md](../development/troubleshooting.md)

---

**Created**: June 7, 2026  
**Purpose**: Quick reference for Nuxt 4 development  
**Audience**: All developers  
**Status**: Living document

**💡 Tip**: Keep this open while coding!
