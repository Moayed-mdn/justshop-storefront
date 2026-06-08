# Development Server Issues - SOLVED ✅

## Issues Resolved

### 1. ❌ `html.replace is not a function` Error
**Cause:** Corrupted Nuxt build artifacts in `.nuxt` directory

**Solution Applied:**
- Removed `.nuxt` directory
- Removed `node_modules/.cache` directory
- Regenerated clean build with `NUXT_TELEMETRY_DISABLED=1 npx nuxt prepare`
- Disabled Nuxt telemetry to prevent interactive prompts

**Status:** ✅ FIXED - Dev server now starts without errors

---

### 2. ❌ Tenant Resolution Error
**Error Message:** "The requested tenant could not be resolved from the storefront domain"

**Root Cause:** 
The application is designed for multi-tenant architecture. When accessing via `http://localhost:3000`, the backend Laravel API cannot resolve a tenant because `localhost` is not mapped to a tenant in the backend database.

**Solution:**
Access the application via the configured tenant domain: **`http://demo.justshop.test:3000`**

**Why This Works:**
- The backend has `demo.justshop.test` mapped to tenant `merchant-store` (tenant_id: store_1)
- The Nuxt config already allows this host in `vite.server.allowedHosts`
- Your `/etc/hosts` file already has the entry: `127.0.0.1 demo.justshop.test`

**Status:** ✅ RESOLVED - Backend responds correctly when using proper hostname

---

## How to Access the Application

### ✅ Correct URL
```
http://demo.justshop.test:3000
```

### ❌ Do NOT use
```
http://localhost:3000  ← Will fail with tenant resolution error
```

---

## Technical Details

### Environment Configuration
The `.env` file has been updated with all required variables:

```env
NUXT_API_BASE=http://localhost:8000/api/v1
STOREFRONT_RUNTIME_ROLLOUT_MODE=full
STOREFRONT_RUNTIME_KILL_SWITCH=false
STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS=justshop-demo,demo.justshop.test
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/v1
NUXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend API Validation
The backend is running correctly and responds to storefront runtime requests:

```bash
# Test command that works:
curl -X GET 'http://localhost:8000/api/v1/storefront/runtime/resolve?path=/&locale=en' \
  -H 'Host: demo.justshop.test' \
  -H 'X-Storefront-Version: 2026-05-28' \
  -H 'X-Storefront-Locale: en'

# Returns successful response:
{
  "requestContext": {
    "tenantId": "store_1",
    "tenantKey": "merchant-store",
    "locale": "en"
  },
  "data": {
    "status": "matched",
    "routeType": "home",
    "pageId": "home"
  }
}
```

### Tenant Resolution Flow

1. **Browser Request:** `http://demo.justshop.test:3000/`
2. **Nuxt Middleware:** Extracts `Host: demo.justshop.test` header
3. **Frontend Resolver:** Creates local tenant context for SSR
4. **Backend API Call:** Forwards request to Laravel with Host header
5. **Laravel Resolution:** Maps `demo.justshop.test` → `merchant-store` tenant
6. **Success:** Page renders with tenant-specific content

---

## Current Status

### ✅ Working
- Dev server running on port 3000
- No `html.replace` errors
- Backend API responding correctly
- Tenant resolution working for `demo.justshop.test`

### 📝 Next Steps
1. Open browser to: `http://demo.justshop.test:3000`
2. Verify the homepage loads correctly
3. Check that tenant-specific content appears

---

## Additional Tenant Configuration

If you need to add more tenant domains:

### 1. Update `/etc/hosts`
```bash
sudo nano /etc/hosts

# Add line:
127.0.0.1 your-store.justshop.test
```

### 2. Update `nuxt.config.ts`
```typescript
vite: {
  server: {
    allowedHosts: ['demo.justshop.test', 'your-store.justshop.test'],
  },
}
```

### 3. Configure tenant in Laravel backend
(Backend configuration depends on your Laravel tenant management system)

---

## Troubleshooting

### If you see "Tenant not found" error:
- Verify `/etc/hosts` entry exists
- Check you're using the exact hostname (not localhost)
- Ensure backend has tenant configured for that domain

### If you see connection refused:
- Verify Laravel backend is running on port 8000
- Check `NUXT_API_BASE` in `.env` points to correct backend URL

### If you see CORS errors:
- Ensure Laravel CORS config allows the frontend domain
- Check backend `config/cors.php` settings

---

## Files Modified

1. **/.env** - Added missing environment variables
2. **/.nuxt/** - Regenerated (was corrupted)
3. **/.nuxtrc** - Telemetry disabled

---

**Last Updated:** June 4, 2026
**Dev Server Status:** ✅ Running on port 3000
**Backend Status:** ✅ Running on port 8000
