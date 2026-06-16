# Search Page Debug Analysis

## Problem
The search page renders heading and breadcrumbs but makes no API calls. No GraphQL requests appear in network log.

## Root Cause Analysis

### Code Review Findings

**File:** `app/pages/search.vue`

```typescript
const { data, pending } = await useAsyncData(
  `search-${searchTerm.value}-${locale.value}`,
  async () => {
    if (!searchTerm.value) return null

    const apollo = useNuxtApp().$apollo  // ⚠️ POTENTIAL ISSUE
    if (!apollo) return null  // ❌ SILENTLY RETURNS NULL

    const { data: searchData } = await apollo.query<SearchResult>({
      query: SEARCH_QUERY,
      variables: {
        query: searchTerm.value,
        locale: locale.value,
        limit: 30,
      },
    })

    return searchData?.search ?? null
  },
  {
    watch: [searchTerm, locale],
    server: true,
  }
)
```

### Potential Issues

1. **Apollo Client Not Available**
   - `useNuxtApp().$apollo` returns `undefined`
   - Silent `return null` prevents any error logging
   - Page renders but no data fetch occurs

2. **Plugin Load Order**
   - Apollo plugin may not be initialized before search page
   - SSR context may not have apollo instance

3. **GraphQL URL Not Set**
   - If `config.public.graphqlUrl` is undefined
   - HttpLink creates broken connection
   - But this should throw error, not silent fail

4. **Dependency Issues**
   - Missing `@apollo/client` package
   - Type mismatch in plugin provide

## Verification Steps

### 1. Check Apollo Client Availability
Add debug logging to search page:

```typescript
const apollo = useNuxtApp().$apollo
console.log('Apollo client available:', !!apollo)
console.log('Apollo client:', apollo)
console.log('GraphQL URL:', useRuntimeConfig().public.graphqlUrl)
```

### 2. Check Plugin Initialization
Add debug logging to apollo plugin:

```typescript
// app/plugins/apollo.ts
export default defineNuxtPlugin((nuxtApp) => {
  console.log('[Apollo Plugin] Initializing...')
  const config = useRuntimeConfig()
  console.log('[Apollo Plugin] GraphQL URL:', config.public.graphqlUrl)
  
  // ... create client ...
  
  console.log('[Apollo Plugin] Client created successfully')
  return {
    provide: {
      apollo: apolloClient,
    },
  }
})
```

### 3. Check Package Installation
```bash
cd justshop-frontend
npm list @apollo/client
npm list graphql-tag
npm list graphql
```

## Most Likely Causes (Ranked)

1. **Apollo plugin not providing client correctly** (90% probability)
   - Nuxt 4 plugin API changes
   - Type mismatch in provide/inject

2. **Missing dependencies** (5% probability)
   - Apollo packages not installed
   - Version conflicts

3. **GraphQL URL misconfiguration** (5% probability)
   - URL not loaded from .env
   - Runtime config issue

## Solution Attempts

### Solution 1: Add Error Handling
Make the silent failure visible:

```typescript
const apollo = useNuxtApp().$apollo
if (!apollo) {
  console.error('[Search] Apollo client not available!')
  throw new Error('Apollo GraphQL client is not initialized')
}
```

### Solution 2: Use Direct Fetch Instead
Replace GraphQL with direct API call:

```typescript
const { data, pending } = await useAsyncData(
  `search-${searchTerm.value}-${locale.value}`,
  async () => {
    if (!searchTerm.value) return null

    const config = useRuntimeConfig()
    const response = await $fetch(`${config.public.graphqlUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant-Id': String(tenantId.value),
        'Accept-Language': locale.value,
      },
      body: {
        query: SEARCH_QUERY.loc.source.body,
        variables: {
          query: searchTerm.value,
          locale: locale.value,
          limit: 30,
        },
      },
    })

    return response?.data?.search ?? null
  }
)
```

### Solution 3: Fix Plugin Provide Syntax
Ensure Nuxt 4 compatibility:

```typescript
// app/plugins/apollo.ts
export default defineNuxtPlugin({
  name: 'apollo',
  enforce: 'pre', // Load before other plugins
  setup(nuxtApp) {
    // ... create client ...
    
    nuxtApp.provide('apollo', apolloClient)
    
    return {
      provide: {
        apollo: apolloClient
      }
    }
  }
})
```
