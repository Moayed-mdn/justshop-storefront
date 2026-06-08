# Gradient Hero Banner Fix - COMPLETED

## Problem
Gradients were not displaying on the storefront. Only `#231F1E` color and image URLs were showing.

## Root Causes Identified and Fixed

### Issue 1: Missing Gradient Fields in API Response ✅ FIXED
**Problem**: `StorefrontRuntimeService.php` was NOT mapping the gradient fields (`visual_type`, `gradient_from`, `gradient_to`) to the API response.

**Solution**: Added three missing fields to the hero banner mapping (lines 706-715):

```php
'items' => $heroBanners->map(fn (HeroBanner $banner): array => [
    'id' => (string) $banner->id,
    'headline' => (string) ($banner->getTranslation($locale)?->title ?? ''),
    'subheadline' => (string) ($banner->getTranslation($locale)?->subtitle ?? ''),
    'ctaText' => (string) ($banner->getTranslation($locale)?->cta_text ?? ''),
    'ctaUrl' => $banner->link_url ?? $banner->cat_url,
    'visualType' => $banner->visual_type?->value ?? 'image',  // ✅ ADDED
    'imageUrl' => $banner->image_url,
    'gradientFrom' => $banner->gradient_from,                  // ✅ ADDED
    'gradientTo' => $banner->gradient_to,                      // ✅ ADDED
])->values()->all(),
```

### Issue 2: Image URLs Using Tenant Domain Instead of Backend URL ✅ FIXED
**Problem**: Multi-tenant setup with:
- Multiple tenant domains: `demo.justshop.test`, `test.justshop.test`, `test1.justshop.test`
- One backend: `localhost:8000`
- Laravel's `asset()` helper was using the incoming request's `Host` header, generating:
  - `http://demo.justshop.test/storage/...` (doesn't serve Laravel)
  - Instead of `http://localhost:8000/storage/...` (correct backend URL)

**Root Cause**: When Nuxt SSR makes API requests with `Host: demo.justshop.test` header, Laravel's `asset()` helper respects that host instead of `APP_URL`.

**Solution**: Modified `HeroBanner` model's `getImageUrlAttribute()` to explicitly use `APP_URL`:

```php
public function getImageUrlAttribute(){
    if (!$this->image_path) {
        return null;
    }
    
    // Use APP_URL for multi-tenant setups to ensure assets are served from backend
    $appUrl = rtrim(config('app.url'), '/');
    return $appUrl . '/storage/' . $this->image_path;
}
```

**Files Modified**:
1. `laratenant-backend/app/Services/Storefront/Runtime/StorefrontRuntimeService.php` (lines 706-715)
2. `laratenant-backend/app/Models/HeroBanner.php` (getImageUrlAttribute method)

### Cache Cleared
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

## Verification Results

### Test Data in Database
**Banner #3 (Store 1)**:
- `visual_type: "gradient"`
- `gradient_from: "#0F2027"`
- `gradient_to: "#2C5364"`
- `image_path: null`

**Banner #5 (Store 2)**:
- `visual_type: "gradient"`
- `gradient_from: "#ff004c"`
- `gradient_to: "#0d15e7"`
- `image_path: null`

### API Response (After Fix) ✅
**Store 1 - Banner with Image**:
```json
{
  "id": "1",
  "headline": "Your private world of luxury shopping.",
  "imageUrl": "http://localhost:8000/storage/hero/hero-banner.jpg",
  "visualType": "image",
  "gradientFrom": null,
  "gradientTo": null
}
```

**Store 1 - Banner with Gradient**:
```json
{
  "id": "3",
  "headline": "Powerful Laptops",
  "visualType": "gradient",
  "imageUrl": null,
  "gradientFrom": "#0F2027",
  "gradientTo": "#2C5364"
}
```

**Store 2 - Banner with Gradient**:
```json
{
  "id": "5",
  "headline": "test2",
  "visualType": "gradient",
  "imageUrl": null,
  "gradientFrom": "#ff004c",
  "gradientTo": "#0d15e7"
}
```

### Frontend Support
The frontend component `RuntimeHeroSection.vue` already has complete gradient support:
- Detects `visualType === 'gradient'`
- Applies `linear-gradient(135deg, {gradientFrom}, {gradientTo})`
- Includes SSR hydration fixes

## Multi-Tenant Architecture Notes

### Why APP_URL is Used for Assets
In a multi-tenant SaaS setup:
- **Frontend domains**: `demo.justshop.test`, `test.justshop.test`, etc. (multiple tenant storefronts)
- **Backend domain**: `localhost:8000` (single Laravel API)
- **Storage location**: All assets are stored on the backend server
- **Requirement**: Asset URLs must point to backend, not tenant domains

### Laravel's Default Behavior (Before Fix)
```php
asset('storage/file.jpg')  // Returns: http://{request-host}/storage/file.jpg
// With Host: demo.justshop.test → http://demo.justshop.test/storage/file.jpg ❌
```

### Fixed Behavior (After Fix)
```php
config('app.url') . '/storage/file.jpg'  // Returns: http://localhost:8000/storage/file.jpg ✅
// Always uses APP_URL, ignoring request host
```

## Testing Instructions

1. **Visit Store 1**: http://demo.justshop.test:3000/en
   - Should see gradient banner #3 with blue gradient (#0F2027 → #2C5364)
   - Image banners should load from `http://localhost:8000/storage/...`

2. **Visit Store 2**: http://test.justshop.test:3000/en
   - Should see gradient banner #5 with red-blue gradient (#ff004c → #0d15e7)

3. **Verify API Response**: 
   ```bash
   # Store 1
   curl 'http://localhost:8000/api/v1/storefront/runtime/page/home?path=/en' \
     -H 'X-Storefront-Version: 2026-05-28' \
     -H 'Host: demo.justshop.test'
   
   # Store 2
   curl 'http://localhost:8000/api/v1/storefront/runtime/page/home?path=/en' \
     -H 'X-Storefront-Version: 2026-05-28' \
     -H 'Host: test.justshop.test'
   ```

4. **Check Browser Network Tab**:
   - All `/storage/*` requests should go to `localhost:8000`
   - Not to tenant subdomains like `demo.justshop.test`

## Status
✅ **FULLY FIXED** - All gradient fields properly mapped AND asset URLs correctly point to backend
