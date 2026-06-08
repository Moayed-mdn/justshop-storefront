# Quick Fix Reference Card

## 🚨 Problem
Gradient hero banners don't show on first page load, but appear after navigation.

## ✅ Solution
SSR hydration fix with post-mount style application.

## 📝 What Was Changed

### File 1: Backend Service
**Path**: `/laratenant-backend/app/Services/Storefront/Runtime/StorefrontRuntimeService.php`

**Line**: ~712
```php
'visualType' => $banner->visual_type?->value ?? 'image',
'imageUrl' => $banner->image_url,
'gradientFrom' => $banner->gradient_from,
'gradientTo' => $banner->gradient_to,
```

### File 2: Frontend Component  
**Path**: `/justshop-frontend/src/core/rendering/sections/RuntimeHeroSection.vue`

**Added**:
- Template ref: `ref="heroSection"`
- Hydration tracking: `const isHydrated = ref(false)`
- Post-mount fix: `onMounted()` with `Object.assign()`
- Stabilized styles: String coercion + trim

## 🧪 Quick Test

```bash
# 1. Clear caches
cd laratenant-backend && php artisan cache:clear
cd ../justshop-frontend && rm -rf .nuxt

# 2. Restart
npm run dev

# 3. Open browser in incognito
# Visit http://localhost:3000
# Gradient should appear immediately ✅
```

## 🐛 Debug One-Liner

```javascript
// Paste in browser console
const s = document.querySelector('section[class*="rounded-3xl"]')?.style;
console.log('BG:', s?.background, 'BGI:', s?.backgroundImage)
```

**Expected**: Both should show `linear-gradient(135deg, rgb(236, 141, 141), rgb(102, 105, 204))`

## 📋 Deployment

```bash
# Backend
cd laratenant-backend
git add app/Services/Storefront/Runtime/StorefrontRuntimeService.php
php artisan cache:clear

# Frontend
cd ../justshop-frontend
git add src/core/rendering/sections/RuntimeHeroSection.vue
npm run build
```

## 🆘 If Broken

1. Check file wasn't reverted: `grep "onMounted" RuntimeHeroSection.vue`
2. Clear ALL caches: Backend + Frontend + Browser
3. Check console for errors
4. Verify API returns gradient data: Check network tab

## 📚 Full Docs

- Implementation: `GRADIENT_HERO_BANNER_FIX.md`
- SSR Details: `SSR_HYDRATION_FIX.md`
- Testing: `TEST_SSR_HYDRATION.md`
- Summary: `COMPLETE_FIX_SUMMARY.md`

## ✨ Status: FIXED ✅
Gradients now work on SSR, CSR, and all navigation scenarios!
