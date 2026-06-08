# 🤖 AI Rules Enforcement System (Storefront)

**Purpose**: Ensure AI assistants strictly follow Nuxt 3/Vue 3 architectural rules  
**Authority**: docs/development/coding-standards.md + docs/architecture/  
**Date**: June 7, 2026

---

## 🎯 Core Principle

**AI MUST follow the rules defined in docs/development/coding-standards.md and docs/architecture/ WITHOUT EXCEPTION.**

---

## 🔥 The 13 Critical Storefront Rules

1. ✅ **SSR-safe code** → Guard window, localStorage, document APIs
2. ❌ **NO direct backend calls** → Use server/api/ proxy layer
3. ✅ **Reuse shared/utils/routes.ts** → NO hardcoded path strings
4. ✅ **Composables use useXxx naming** → Single responsibility per file
5. ✅ **Keep plugins ordered** → 01.auth.client.ts before 02.cart.client.ts
6. ✅ **Client-only code** → Use .client.ts suffix or ClientOnly wrapper
7. ✅ **Keep components thin** → Business logic in composables/stores
8. ✅ **Pinia stores** → Follow auth.ts and cart.ts patterns
9. ✅ **I18n for all text** → Use i18n/locales/ translation files
10. ✅ **Route middleware** → Follow auth.ts, guest.ts patterns
11. ✅ **Nuxt auto-imports** → Don't import ref, computed, watch, etc.
12. ✅ **Type safety** → Use types/ definitions, avoid any
13. ✅ **Update docs** → Same changeset as code changes

---

## Common AI Mistakes & Prevention

### ❌ Mistake 1: Not Guarding Browser APIs

**What AI does wrong:**
```typescript
// ❌ Will break SSR
const token = localStorage.getItem('token')
```

**Prevention prompt:**
```
CRITICAL: Guard ALL browser APIs for SSR.

✅ CORRECT:
if (process.client) {
  const token = localStorage.getItem('token')
}

Or use ClientOnly component for UI that needs browser APIs.
```

---

### ❌ Mistake 2: Direct Backend Calls

**What AI does wrong:**
```typescript
// ❌ Bypasses proxy layer
const response = await fetch('https://backend.api/products')
```

**Prevention prompt:**
```
CRITICAL: NO direct backend calls.

✅ CORRECT:
// App code calls internal API
const { data } = await useApi(API_ROUTES.PRODUCTS)

// Server route proxies to backend
// server/api/products.get.ts
export default defineEventHandler(async (event) => {
  return await apiQuery(EXTERNAL_API_ROUTES.PRODUCTS, event)
})
```

---

### ❌ Mistake 3: Hardcoded Paths

**What AI does wrong:**
```typescript
// ❌ Hardcoded path
navigateTo('/products/123')
```

**Prevention prompt:**
```
CRITICAL: Use shared/utils/routes.ts constants.

✅ CORRECT:
import { APP_ROUTES } from '~/shared/utils/routes'
navigateTo(APP_ROUTES.PRODUCT_DETAIL(productId))
```

---

### ❌ Mistake 4: Wrong Composable Naming

**What AI does wrong:**
```typescript
// ❌ Wrong naming
export const productHelper = () => { }
```

**Prevention prompt:**
```
CRITICAL: Composables MUST use useXxx naming.

✅ CORRECT:
export const useProduct = () => {
  // Single responsibility
}
```

---

### ❌ Mistake 5: Business Logic in Components

**What AI does wrong:**
```vue
<script setup>
// ❌ 50 lines of logic in component
const handleSubmit = async () => {
  // validation, API calls, state updates...
}
</script>
```

**Prevention prompt:**
```
CRITICAL: Components MUST be thin.

✅ CORRECT:
<script setup>
const { submitProduct } = useProduct()

const handleSubmit = () => {
  submitProduct(formData) // Logic in composable
}
</script>
```

---

### ❌ Mistake 6: Hardcoded Text

**What AI does wrong:**
```vue
<template>
  <button>Add to Cart</button> <!-- ❌ Hardcoded -->
</template>
```

**Prevention prompt:**
```
CRITICAL: ALL text MUST use i18n.

✅ CORRECT:
<template>
  <button>{{ $t('product.addToCart') }}</button>
</template>
```

---

### ❌ Mistake 7: Importing Auto-Imports

**What AI does wrong:**
```typescript
// ❌ Unnecessary imports
import { ref, computed, watch } from 'vue'
import { useRoute, navigateTo } from 'nuxt/app'
```

**Prevention prompt:**
```
CRITICAL: Nuxt auto-imports these. Don't import:
- Vue: ref, computed, watch, onMounted, etc.
- Nuxt: useRoute, useRouter, navigateTo, useState, etc.

Only import when needed for type definitions.
```

---

### ❌ Mistake 8: Wrong Plugin Order

**What AI does wrong:**
```typescript
// ❌ Creating 00.cart.client.ts
// This runs before auth!
```

**Prevention prompt:**
```
CRITICAL: Plugin ordering matters.

Current order:
01.auth.client.ts  (runs first)
02.cart.client.ts  (runs second, needs auth)

Don't create 00.xxx plugins without understanding dependencies.
```

---

## Quick Reference Card

Copy this into every AI prompt:

```
🔥 MANDATORY STOREFRONT RULES 🔥

1. SSR-safe code → Guard window, localStorage, document
2. NO direct backend → Use server/api/ proxy
3. Reuse routes.ts → NO hardcoded paths
4. useXxx composables → Single responsibility
5. Plugin order → 01.auth before 02.cart
6. Client-only → .client.ts or ClientOnly
7. Thin components → Logic in composables
8. Pinia stores → auth/cart patterns
9. I18n → Use i18n/locales/
10. Middleware → auth.ts, guest.ts patterns
11. Auto-imports → Don't import Vue/Nuxt basics
12. Type safety → Use types/, avoid any
13. Update docs → Same changeset

NO EXCEPTIONS. FOLLOW STRICTLY.
```

---

## Verification Checklist

After AI provides code:

### SSR Safety
- [ ] No unguarded window, localStorage, document
- [ ] Client-only code has process.client check or ClientOnly
- [ ] Plugin suffixes correct (.client.ts if client-only)

### Architecture
- [ ] Backend calls go through server/api/
- [ ] Paths use shared/utils/routes.ts
- [ ] Composables named useXxx
- [ ] Components are thin
- [ ] Logic in composables/stores

### Standards
- [ ] Text uses i18n
- [ ] Types defined, no any
- [ ] No unnecessary imports
- [ ] Follows existing patterns

---

**Created**: June 7, 2026  
**Authority**: docs/development/coding-standards.md  
**Status**: Active enforcement guide
