# Quick Test Guide: SSR Hydration Fix for Gradients

## 🎯 Quick Verification (30 seconds)

### 1. Clear Everything
```bash
# Clear backend cache
cd laratenant-backend
php artisan cache:clear
php artisan config:clear

# Clear frontend cache and rebuild
cd ../justshop-frontend
rm -rf .nuxt .output node_modules/.cache
```

### 2. Restart Dev Server
```bash
cd justshop-frontend
npm run dev
```

### 3. Open Fresh Browser Tab
- Use Incognito/Private mode
- Open: `http://localhost:3000` or your configured URL
- Look for the hero banner gradient

### 4. Expected Result
✅ **Gradient appears IMMEDIATELY on first load**
- Colors: Pink (#ec8d8d) to Purple (#6669cc)
- Smooth diagonal transition
- No flash or delay

## 🔬 Detailed Test Cases

### Test Case 1: SSR Initial Load
**Purpose**: Verify gradient renders on server-side rendered page

1. **Open DevTools** → Network tab
2. **Enable "Disable cache"**
3. **Visit homepage**: `http://localhost:3000`
4. **Look at "Preview" tab** of the HTML response
5. **Check**: HTML should contain inline style with gradient

**Expected in HTML**:
```html
<section ... style="background: linear-gradient(135deg, #ec8d8d, #6669cc); ...">
```

### Test Case 2: Client-Side Navigation
**Purpose**: Verify gradient persists during SPA navigation

1. Visit homepage (`/`)
2. Click "Shop" or navigate to `/shop`
3. Click "Home" or navigate back to `/`
4. **Check**: Gradient still visible

**Pass Criteria**: No flickering, gradient always visible

### Test Case 3: Hard Refresh
**Purpose**: Verify gradient survives cache busting

1. Visit homepage
2. Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
3. **Check**: Gradient appears immediately

**Pass Criteria**: No delay, gradient on first paint

### Test Case 4: JavaScript Disabled
**Purpose**: Verify SSR fallback works

1. Open DevTools → Settings
2. Find "Disable JavaScript"
3. Enable it
4. Refresh page
5. **Check**: Fallback background color appears (not gradient, but not broken)

**Pass Criteria**: Page doesn't crash, shows fallback color

### Test Case 5: Slow Network
**Purpose**: Verify gradient shows before hydration completes

1. Open DevTools → Network tab
2. Throttle to "Slow 3G"
3. Refresh page
4. **Check**: Gradient visible before JavaScript loads

**Pass Criteria**: Visual content appears before interactivity

## 🐛 Debug Commands

### Check Component State (Browser Console)
```javascript
// Find the hero section element
const hero = document.querySelector('section[class*="rounded-3xl"]')

// Check applied styles
console.log('Inline style:', hero?.getAttribute('style'))
console.log('Computed background:', getComputedStyle(hero).background)
console.log('Computed backgroundImage:', getComputedStyle(hero).backgroundImage)
```

**Expected Output**:
```
Inline style: "background: linear-gradient(135deg, rgb(236, 141, 141), rgb(102, 105, 204)); background-image: linear-gradient(135deg, rgb(236, 141, 141), rgb(102, 105, 204));"
Computed background: linear-gradient(135deg, rgb(236, 141, 141), rgb(102, 105, 204))
Computed backgroundImage: linear-gradient(135deg, rgb(236, 141, 141), rgb(102, 105, 204))
```

### Check Vue Devtools
If you have Vue Devtools installed:
1. Open Vue tab in DevTools
2. Find `RuntimeHeroSection` component
3. Check `sectionStyle` computed property
4. Verify it contains gradient values

**Expected**:
```json
{
  "background": "linear-gradient(135deg, #ec8d8d, #6669cc)",
  "backgroundImage": "linear-gradient(135deg, #ec8d8d, #6669cc)"
}
```

### Check Network Response
1. Open Network tab
2. Refresh page
3. Click on the main HTML document
4. Go to "Preview" or "Response" tab
5. Search for "linear-gradient"

**Expected**: Should find gradient style in the HTML

## ❌ Failure Symptoms & Fixes

### Symptom: Still no gradient on first load
**Possible Causes**:
1. Cache not cleared
2. Dev server not restarted
3. Browser cached old JavaScript

**Fix**:
```bash
# Kill all Node processes
pkill -9 node

# Clear everything
cd justshop-frontend
rm -rf .nuxt .output node_modules/.cache

# Rebuild and restart
npm run build
npm run dev
```

### Symptom: Gradient appears after 1-2 seconds delay
**Possible Cause**: Hydration is working, but SSR isn't applying styles

**Fix**:
1. Check if `ref="heroSection"` is in the template
2. Verify `onMounted()` hook exists in script
3. Check browser console for errors

### Symptom: Gradient works in dev but not production
**Possible Cause**: Production build optimization removing styles

**Fix**:
```bash
# Build for production and test
cd justshop-frontend
npm run build
npm run preview
```

Check if issue persists. If it does, check Nuxt config for SSR settings.

### Symptom: Different gradients on SSR vs client
**Possible Cause**: Data mismatch between server and client

**Fix**:
1. Verify API returns same data for SSR and client
2. Check if `props.data.items` is populated during SSR
3. Add logging to computed properties

## 📊 Performance Check

### Lighthouse Audit
1. Open DevTools → Lighthouse tab
2. Select "Performance" + "Desktop"
3. Click "Generate report"
4. **Check**: 
   - First Contentful Paint (FCP) < 1.5s
   - Largest Contentful Paint (LCP) < 2.5s
   - Cumulative Layout Shift (CLS) < 0.1

**Pass Criteria**: Gradient doesn't negatively impact performance scores

### Memory Leak Check
1. Open Performance Monitor in DevTools
2. Navigate between pages 10 times
3. Check memory usage

**Pass Criteria**: Memory should stabilize, not continuously increase

## ✅ Success Checklist

- [ ] Gradient appears on **first** page load
- [ ] Gradient appears on **subsequent** page loads
- [ ] Gradient appears after **hard refresh**
- [ ] Gradient appears after **client-side navigation**
- [ ] Gradient appears in **production build**
- [ ] No console errors
- [ ] No hydration warnings in console
- [ ] Performance scores unchanged
- [ ] Works in Chrome, Firefox, Safari
- [ ] Works on mobile devices

## 🚀 Production Deployment Checklist

Before deploying to production:

- [ ] All tests above pass
- [ ] Run production build locally: `npm run build && npm run preview`
- [ ] Test on staging environment
- [ ] Check with real production data
- [ ] Verify CDN/cache headers don't break SSR
- [ ] Test on real mobile devices
- [ ] Monitor error tracking (Sentry, etc.) after deployment

## 📞 Troubleshooting Support

If issues persist:

1. **Check backend data**:
   ```bash
   cd laratenant-backend
   php artisan tinker
   HeroBanner::find(5)->toArray()
   ```

2. **Check API response**:
   ```bash
   curl -H "X-Tenant-Key: test" \
        -H "X-Locale: en" \
        -H "X-Storefront-Version: 2026-05-28" \
        http://localhost:8000/api/v1/storefront/runtime/page/home | jq '.data.page.sections[0]'
   ```

3. **Enable Nuxt debug mode**:
   ```bash
   export DEBUG=nuxt:*
   npm run dev
   ```

4. **Check component file hasn't been reverted**:
   ```bash
   grep -A 5 "onMounted" justshop-frontend/src/core/rendering/sections/RuntimeHeroSection.vue
   ```

## 🎓 Understanding the Fix

The fix uses a "belt and suspenders" approach:

1. **Belt**: Vue's reactive inline styles (`:style="sectionStyle"`)
2. **Suspenders**: Post-hydration DOM manipulation (`Object.assign(...)`)

If Vue's hydration fails or has timing issues, the manual style application catches it. This ensures gradients always render, regardless of SSR/hydration quirks.

## Status

When all tests pass: 🎉 **SSR Hydration is Fixed!**
