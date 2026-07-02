# Browser Verification Checklist
## JustShop Frontend Theme System Manual Testing Guide

**Date:** June 9, 2026  
**Purpose:** Manually verify theme color and font application across three test themes  
**Print this document and check off items as you test**

---

## Prerequisites

✅ **Before starting:**
- [ ] Backend API is running
- [ ] Frontend dev server is running (`npm run dev`)
- [ ] You have access to browser DevTools (F12)
- [ ] You can access the merchant dashboard or database to configure themes

---

## Part 1: How to Apply Test Themes

### Option A: Via Database (Recommended)

Each test theme requires updating the `themes` table for your test store (store_id = 1):

**Theme 1 - Blue/Yellow (Light & Bright)**
```sql
UPDATE themes SET
  tokens = JSON_OBJECT(
    'colorPrimary', '#3B82F6',
    'colorSecondary', '#10B981',
    'colorAccent', '#f50aca',
    'colorSurface', '#fbff00',
    'colorText', '#1F2937'
  ),
  fonts = JSON_OBJECT(
    'body', 'Inter',
    'heading', 'Poppins'
  )
WHERE store_id = 1;
```

**Theme 2 - Purple/Dark**
```sql
UPDATE themes SET
  tokens = JSON_OBJECT(
    'colorPrimary', '#8B5CF6',
    'colorSecondary', '#EC4899',
    'colorAccent', '#F59E0B',
    'colorSurface', '#111827',
    'colorText', '#F3F4F6'
  ),
  fonts = JSON_OBJECT(
    'body', 'Roboto',
    'heading', 'Playfair Display'
  )
WHERE store_id = 1;
```

**Theme 3 - Black/White (Minimal)**
```sql
UPDATE themes SET
  tokens = JSON_OBJECT(
    'colorPrimary', '#000000',
    'colorSecondary', '#6B7280',
    'colorAccent', '#EF4444',
    'colorSurface', '#F9FAFB',
    'colorText', '#111827'
  ),
  fonts = JSON_OBJECT(
    'body', 'system-ui',
    'heading', 'Georgia'
  )
WHERE store_id = 1;
```

### Option B: Via API (If merchant dashboard is available)

```bash
# Apply Theme 1
curl -X PUT http://localhost/api/v1/merchant/stores/1/themes/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tokens": {
      "colorPrimary": "#3B82F6",
      "colorSecondary": "#10B981",
      "colorAccent": "#f50aca",
      "colorSurface": "#fbff00",
      "colorText": "#1F2937"
    },
    "fonts": {
      "body": "Inter",
      "heading": "Poppins"
    }
  }'
```

### Clear Cache After Applying Theme

**In browser:**
- [ ] Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- [ ] Clear session storage: DevTools → Application → Session Storage → Delete `store-theme`
- [ ] Clear local storage: DevTools → Application → Local Storage → Delete `theme`

---

## Part 2: Theme 1 Verification (Blue/Yellow)

**Apply Theme 1 using instructions above, then verify:**

### 2.1 Homepage

**URL:** `http://localhost:3000/en`

**Colors:**
- [ ] Page background is **bright yellow** (#fbff00)
- [ ] Primary CTA buttons are **blue** (#3B82F6)
- [ ] Primary CTA button text is **black** (not white - automatic contrast)
- [ ] Hover on CTA buttons shows **darker blue** (NOT dark green #003D29)
- [ ] Product cards have visible backgrounds (not identical to page)
- [ ] Header navigation links turn blue on hover
- [ ] "Add to Cart" buttons on product cards are blue

**Fonts:**
- [ ] Body text uses **Inter** font
- [ ] Heading text (H1, H2, etc.) uses **Poppins** font
- [ ] Product names in cards use Poppins (headings)

**DevTools Check:**
- [ ] Open DevTools → Elements → Select `<html>` tag
- [ ] In Computed styles, verify:
  - `--color-primary: #3B82F6` (or rgb(59, 130, 246))
  - `--color-bg-page: #fbff00` (or rgb(251, 255, 0))
  - `--font-body: Inter` or `--font-body: "Inter", sans-serif`
  - `--font-heading: Poppins` or `--font-heading: "Poppins", sans-serif`

### 2.2 Product Detail Page

**URL:** `http://localhost:3000/en/products/any-product-slug`

**Colors:**
- [ ] Page background is **bright yellow**
- [ ] "Add to Cart" button is **blue**
- [ ] "Add to Cart" hover is **darker blue** (NOT green)
- [ ] Price is displayed in **black text** (high contrast on yellow)
- [ ] Product description text is readable (dark on yellow)

**Fonts:**
- [ ] Product title uses **Poppins** (heading font)
- [ ] Product description uses **Inter** (body font)
- [ ] "Brand:" and "Category:" labels use Inter

**DevTools Check:**
- [ ] Select product title (H1) → Computed → `font-family` should show Poppins first
- [ ] Select product description → Computed → `font-family` should show Inter first

### 2.3 Cart Page

**URL:** `http://localhost:3000/en/cart`

**Colors:**
- [ ] Page background is **bright yellow**
- [ ] "Proceed to Checkout" button is **blue**
- [ ] Checkout button hover is **darker blue** (NOT green)
- [ ] Cart summary card has a distinct background (slightly different from yellow)
- [ ] "Continue Shopping" link is blue

**Fonts:**
- [ ] "Shopping Cart" heading uses **Poppins**
- [ ] Item names use Poppins (headings)
- [ ] Subtotal/Total labels use Inter (body)

**FOUC Test (Flash of Unstyled Content):**
- [ ] Do a hard refresh (`Ctrl+Shift+R`)
- [ ] Watch for a flash of wrong colors/fonts before theme applies
- [ ] **Expected:** Should see yellow background immediately (no flash)
- [ ] **If you see a flash:** Theme is not SSR-injected (this is a known issue on static pages)

### 2.4 Auth Pages (Login)

**URL:** `http://localhost:3000/en/auth/login`

**Colors:**
- [ ] "Sign In" button is **blue**
- [ ] Button hover is **darker blue** (NOT green)
- [ ] Input focus borders turn blue

**Fonts:**
- [ ] "Welcome Back" heading uses **Poppins**
- [ ] Form labels and input text use **Inter**

### 2.5 Orders Page

**URL:** `http://localhost:3000/en/profile/orders` (requires login)

**Colors:**
- [ ] Order status badges use appropriate colors (not hardcoded)
  - Pending: Yellow/amber badge
  - Processing: Blue badge
  - Delivered: Green badge
  - Cancelled: Red badge
- [ ] "Reorder" or "Buy Again" buttons are blue
- [ ] Button hover is **darker blue**

---

## Part 3: Theme 2 Verification (Purple/Dark)

**Apply Theme 2 using instructions above, then verify:**

### 3.1 Homepage

**URL:** `http://localhost:3000/en`

**Colors:**
- [ ] Page background is **dark gray** (#111827)
- [ ] Text is **light gray/white** (#F3F4F6) - high contrast
- [ ] Primary CTA buttons are **purple** (#8B5CF6)
- [ ] Primary CTA button text is automatically **white** (computed)
- [ ] Hover on CTA buttons shows **darker purple** (NOT dark green)
- [ ] Product cards are **visible** with slightly lighter background than page
- [ ] Card backgrounds are distinct from page background

**Fonts:**
- [ ] Body text uses **Roboto** font
- [ ] Heading text uses **Playfair Display** font (serif)
- [ ] Noticeable difference between heading and body fonts

**Card Visibility Test (Critical):**
- [ ] Product cards do NOT blend into the dark background
- [ ] Cards have a visible border or slightly lighter background
- [ ] Card shadows or elevation are visible

**DevTools Check:**
- [ ] Open DevTools → Elements → `<html>` tag → Computed:
  - `--color-primary: #8B5CF6` (purple)
  - `--color-bg-page: #111827` (dark gray)
  - `--color-bg-card` should be lighter than `--color-bg-page` (e.g., #1a1a1a or #222)
  - `--font-body: Roboto`
  - `--font-heading: "Playfair Display"`

### 3.2 Product Detail Page

**URL:** `http://localhost:3000/en/products/any-product-slug`

**Colors:**
- [ ] Background is **dark gray**
- [ ] Text is **light/white** and readable
- [ ] "Add to Cart" button is **purple**
- [ ] Button hover is **darker purple**

**Fonts:**
- [ ] Product title uses **Playfair Display** (serif, elegant)
- [ ] Product description uses **Roboto** (sans-serif, clean)

### 3.3 Dark Mode Toggle Test

**URL:** Any page

**Test Interaction:**
- [ ] Find the theme toggle button (moon/sun icon, typically in header)
- [ ] Click to toggle to "light mode"
- [ ] **Expected:** Merchant dark theme should remain (#111827 background)
- [ ] **Expected:** Do NOT see a flash to default light theme
- [ ] **Critical:** Merchant-chosen dark theme should NOT be overridden
- [ ] If default light theme appears, this confirms bug: dark mode toggle conflicts with merchant dark theme

**DevTools Check:**
- [ ] With Theme 2 active, check `<html>` attributes:
  - Should have `data-merchant-dark-theme` attribute if merchant theme is dark
  - Should NOT change to `data-theme="light"` when dark theme is merchant-chosen

### 3.4 Price Filter Slider

**URL:** Any category/shop page with filters (e.g., `http://localhost:3000/en/shop`)

**Colors:**
- [ ] Price slider filled range (between thumbs) is **purple** (--color-primary)
- [ ] Slider thumb borders are **purple**
- [ ] Hover states use purple (not blue)

---

## Part 4: Theme 3 Verification (Black/White)

**Apply Theme 3 using instructions above, then verify:**

### 4.1 Homepage

**URL:** `http://localhost:3000/en`

**Colors:**
- [ ] Page background is **very light gray** (#F9FAFB)
- [ ] Text is **very dark gray** (#111827)
- [ ] Primary CTA buttons are **black** (#000000)
- [ ] Primary CTA button text is **white** (computed for contrast)
- [ ] Hover on CTA buttons stays **black** or slightly lighter (NOT green)
- [ ] Minimal, clean aesthetic

**Fonts:**
- [ ] Body text uses **system-ui** (system default font)
- [ ] Heading text uses **Georgia** (serif)
- [ ] Georgia should look classic/elegant

**DevTools Check:**
- [ ] `--color-primary: #000000` (black)
- [ ] `--color-bg-page: #F9FAFB` (very light gray, almost white)
- [ ] `--font-body` should resolve to system font (varies by OS)
- [ ] `--font-heading: Georgia`

### 4.2 Product Detail Page

**Colors:**
- [ ] "Add to Cart" button is **black**
- [ ] Button text is **white**
- [ ] Button hover stays black (or very slightly lighter gray)

**Fonts:**
- [ ] Product title uses **Georgia** (serif)
- [ ] Product description uses **system font** (clean, readable)

### 4.3 Cart Summary

**URL:** `http://localhost:3000/en/cart`

**Colors:**
- [ ] "Proceed to Checkout" button is **black**
- [ ] Hover stays black
- [ ] Error messages (if any) use **red accent** (#EF4444), not hardcoded colors

---

## Part 5: FOUC (Flash of Unstyled Content) Test

**Objective:** Verify if static pages flash wrong colors before theme loads

### 5.1 Cart Page FOUC Test

**URL:** `http://localhost:3000/en/cart`

**Steps:**
1. [ ] Apply Theme 1 (blue/yellow)
2. [ ] Clear cache and session storage
3. [ ] With DevTools Network tab open, do a hard refresh
4. [ ] **Watch the page load carefully**

**What to look for:**
- [ ] **Good:** Page loads with yellow background immediately, no flash
- [ ] **Bad (FOUC):** Page loads with white/default background, then "pops" to yellow after 200-500ms
- [ ] **Timing:** If FOUC occurs, note the delay (usually 200-500ms)

**Network Tab Check:**
- [ ] Find the request to `/api/storefront/runtime/theme`
- [ ] Check timing: When does theme API respond?
- [ ] If theme loads AFTER page renders, FOUC is expected

**View Page Source:**
- [ ] Right-click page → "View Page Source"
- [ ] Search for `<style data-theme-ssr="true">`
- [ ] **If found:** Theme is SSR-injected (good, no FOUC expected)
- [ ] **If NOT found:** Theme is client-only (FOUC expected on first load)

### 5.2 Checkout Success Page FOUC Test

**URL:** `http://localhost:3000/en/checkout/success` (after completing checkout)

**Repeat same test:**
- [ ] Hard refresh and watch for color flash
- [ ] Check Network tab for theme API timing
- [ ] View source for `data-theme-ssr` style tag

### 5.3 Homepage vs Cart FOUC Comparison

**Compare:**
- [ ] Test homepage: `http://localhost:3000/en` (catch-all runtime page)
- [ ] Test cart page: `http://localhost:3000/en/cart` (static page)
- [ ] **Expected difference:** Homepage should have no FOUC, cart may have FOUC
- [ ] **Why:** Homepage uses SSR theme injection, cart uses client-side

---

## Part 6: Font Loading Verification

**Objective:** Confirm Google Fonts are loaded and merchant fonts override defaults

### 6.1 Network Tab Font Check

**Theme 1 (Inter & Poppins):**

**Steps:**
1. [ ] Apply Theme 1
2. [ ] Open DevTools → Network tab
3. [ ] Filter by "Font" or search for "googleapis"
4. [ ] Do a hard refresh

**What to look for:**
- [ ] Request to `fonts.googleapis.com` for Inter
- [ ] Request to `fonts.googleapis.com` for Poppins
- [ ] Both requests return **200 OK**
- [ ] Font files (`.woff2`) are downloaded
- [ ] Check timing: Do fonts load quickly (< 500ms)?

**If fonts don't load:**
- [ ] Check Console for errors
- [ ] Verify `<link>` tag in `<head>` with `href="https://fonts.googleapis.com/css2?family=Inter..."`

### 6.2 Computed Styles Font Check

**On homepage:**

**Steps:**
1. [ ] Open DevTools → Elements
2. [ ] Select the main heading (H1)
3. [ ] Look at Computed styles panel
4. [ ] Find `font-family` property

**What to verify:**
- [ ] **font-family** should show: `Poppins, [fallback fonts]`
- [ ] Poppins should be **first** in the list (not system-ui)
- [ ] If Poppins is crossed out or fallback is used, font failed to load

**For body text:**
- [ ] Select a paragraph or body text
- [ ] Check `font-family` in Computed
- [ ] Should show: `Inter, [fallback fonts]`
- [ ] Inter should be first

### 6.3 Visual Font Comparison

**Compare:**
1. [ ] Apply Theme 1 (Inter/Poppins)
2. [ ] Take a screenshot of product page
3. [ ] Apply Theme 2 (Roboto/Playfair Display)
4. [ ] Take a screenshot of same product page
5. [ ] Compare screenshots side-by-side

**Verify visible differences:**
- [ ] Headings look clearly different (Poppins vs Playfair Display)
- [ ] Body text looks different (Inter vs Roboto)
- [ ] If fonts look identical, merchant fonts are NOT being applied

### 6.4 Font Token Chain Check

**In DevTools Console:**

```javascript
// Check if font tokens are defined
getComputedStyle(document.documentElement).getPropertyValue('--font-body')
// Expected: "Inter" or "Inter, sans-serif"

getComputedStyle(document.documentElement).getPropertyValue('--font-heading')
// Expected: "Poppins" or "Poppins, sans-serif"

getComputedStyle(document.documentElement).getPropertyValue('--font-main')
// Expected: Same as --font-body

// Check if tokens have wrong prefix
getComputedStyle(document.documentElement).getPropertyValue('--theme-font-body')
// If this returns a value but --font-body is empty, token prefix is wrong

getComputedStyle(document.documentElement).getPropertyValue('--runtime-font-body')
// If this returns a value, you're on a runtime page (homepage, product detail)
```

**Interpret results:**
- [ ] If `--font-body` is empty but `--theme-font-body` has a value: **Bug #1 confirmed** (wrong prefix)
- [ ] If `--font-main` is empty: **Bug #1 confirmed** (missing alias)
- [ ] If both `--font-body` and `--runtime-font-body` exist: Dual implementation detected

---

## Part 7: Specific Component Tests

### 7.1 Add to Cart Button

**Page:** Any product detail page

**Test:**
- [ ] Hover over "Add to Cart" button
- [ ] **Theme 1:** Should turn **darker blue** (not green)
- [ ] **Theme 2:** Should turn **darker purple** (not green)
- [ ] **Theme 3:** Should stay **black** or lighten slightly (not green)

**If button turns green on hover:**
- [ ] **Bug confirmed:** `hover:bg-(--green-950)` hardcoded
- [ ] Affects: ProductActionButtons.vue

### 7.2 Auth Submit Button

**Page:** `http://localhost:3000/en/auth/login`

**Test:**
- [ ] Hover over "Sign In" button
- [ ] **Theme 1:** Darker blue (not green)
- [ ] **Theme 2:** Darker purple (not green)
- [ ] **Theme 3:** Black/gray (not green)

### 7.3 Order Status Badges

**Page:** `http://localhost:3000/en/profile/orders` (requires login)

**Test:**
- [ ] Find orders with different statuses
- [ ] Verify badge colors:
  - **Pending:** Yellow/amber background, dark text
  - **Processing:** Blue background
  - **Shipped:** Purple/indigo background
  - **Delivered:** Green background, dark text
  - **Cancelled:** Red background
- [ ] Badge colors should NOT change between themes (they're semantic, not theme-dependent)

**DevTools check:**
- [ ] Select a status badge
- [ ] In Computed, look for:
  - `background-color: var(--status-pending-bg)` or similar
  - Should use `--status-*` tokens, not `--color-primary`

### 7.4 Cart Summary Card

**Page:** `http://localhost:3000/en/cart`

**Test Theme 2 (dark) specifically:**
- [ ] Cart summary card (on right side) is **visible**
- [ ] Card background is **lighter** than page background
- [ ] Card does not blend into page
- [ ] Border or shadow makes card distinct

**If card is nearly invisible:**
- [ ] **Bug confirmed:** Surface color derivation is wrong for dark themes
- [ ] Should lighten surfaces on dark backgrounds, not darken

### 7.5 Error Messages

**Page:** Any form (e.g., checkout with invalid data)

**Test:**
- [ ] Trigger a validation error (e.g., empty required field)
- [ ] Error message should have a **light red background** (--color-error-bg)
- [ ] Error text should be **red** (--color-error)
- [ ] Should NOT be plain text without background

**If error has no background:**
- [ ] **Bug confirmed:** `--color-error-bg` token is undefined

---

## Part 8: DevTools Deep Dive

### 8.1 CSS Variable Inspector

**On any page:**

**Steps:**
1. [ ] Open DevTools → Console
2. [ ] Run this script:

```javascript
// List all CSS variables on :root
const vars = Array.from(document.styleSheets)
  .flatMap(sheet => {
    try {
      return Array.from(sheet.cssRules);
    } catch {
      return [];
    }
  })
  .filter(rule => rule.selectorText === ':root')
  .flatMap(rule => Array.from(rule.style))
  .filter(prop => prop.startsWith('--'));

console.table(vars.map(v => ({
  token: v,
  value: getComputedStyle(document.documentElement).getPropertyValue(v)
})));
```

**What to check:**
- [ ] `--color-primary` is defined
- [ ] `--color-primary-hover` is defined (if not, hover bug confirmed)
- [ ] `--color-error-bg` is defined (if not, error display bug confirmed)
- [ ] `--font-body` is defined
- [ ] `--font-main` is defined (if not, font bug confirmed)
- [ ] Look for duplicate prefixes: `--font-*`, `--theme-font-*`, `--runtime-font-*`

### 8.2 Theme API Response Inspector

**Steps:**
1. [ ] Open DevTools → Network tab
2. [ ] Filter by "Fetch/XHR"
3. [ ] Find request to `/api/storefront/runtime/theme`
4. [ ] Click on request → Response tab

**Verify response structure:**
```json
{
  "data": {
    "tokens": {
      "colorPrimary": "#3B82F6",
      "colorSecondary": "#10B981",
      "colorAccent": "#f50aca",
      "colorSurface": "#fbff00",
      "colorText": "#1F2937"
    },
    "fonts": {
      "body": "Inter",
      "heading": "Poppins"
    }
  }
}
```

**Check:**
- [ ] Response is **200 OK**
- [ ] `tokens` object has all 5 color keys
- [ ] `fonts` object has both `body` and `heading`
- [ ] Values match the theme you applied

### 8.3 SSR vs Client Rendering

**View Page Source vs Inspect Element:**

**Steps:**
1. [ ] Right-click page → "View Page Source"
2. [ ] Search for `<style` tags in source
3. [ ] Look for `data-theme-ssr="true"` attribute

**Compare:**
- [ ] **View Source (SSR):** Shows what server sent
- [ ] **Inspect Element (Live):** Shows after client JS runs

**If `data-theme-ssr` style tag exists in View Source:**
- [ ] Theme is SSR-injected (good)
- [ ] Should see inline CSS like: `:root { --color-primary: #3B82F6; }`

**If NOT in View Source but in Inspect Element:**
- [ ] Theme is client-injected (causes FOUC)
- [ ] Confirms dual theme architecture issue

---

## Part 9: Accessibility Quick Check

### 9.1 Contrast Checker

**Use browser extension or online tool:**
- [ ] Install "WAVE" or "axe DevTools" extension
- [ ] Or use: https://webaim.org/resources/contrastchecker/

**Test Theme 1 (Blue on Yellow):**
- [ ] Check primary button: Blue #3B82F6 with text color
- [ ] Should use **black text** (not white) for accessibility
- [ ] White on blue = 3.0:1 (fails), black on blue = 7.0:1 (passes)

**Test Theme 2 (Purple on Dark):**
- [ ] Check text contrast: #F3F4F6 on #111827
- [ ] Should be 16:1 (excellent)

### 9.2 Keyboard Navigation

**Test:**
- [ ] Tab through interactive elements
- [ ] Focus states should be **visible** with primary color ring
- [ ] Focus ring uses `--color-primary` or `--color-focus-ring`

---

## Part 10: Final Verification Summary

### Checklist of Critical Bugs

**After testing all three themes, mark bugs you observed:**

- [ ] **Bug #1:** Fonts don't change between themes (all look the same)
  - **Root cause:** Font token chain broken
  - **Files affected:** themeTokens.ts, _typography.css, _reset.css

- [ ] **Bug #2:** Button hover turns green regardless of theme
  - **Root cause:** Hardcoded `hover:bg-(--green-950)`
  - **Files affected:** ProductActionButtons.vue, AuthSubmitButton.vue, checkout pages

- [ ] **Bug #3:** Error messages have no background
  - **Root cause:** `--color-error-bg` token undefined
  - **Files affected:** _colors.css

- [ ] **Bug #4:** FOUC on cart/checkout pages
  - **Root cause:** Theme injected client-side only (not SSR)
  - **Files affected:** app.vue, useStoreTheme.ts

- [ ] **Bug #5:** Card backgrounds invisible on Theme 2 (dark)
  - **Root cause:** Surface derivation logic wrong for dark themes
  - **Files affected:** themeTokens.ts

- [ ] **Bug #6:** Dark mode toggle conflicts with Theme 2
  - **Root cause:** `[data-theme="dark"]` overrides merchant dark theme
  - **Files affected:** _colors.css, _theme-dynamic.css

### Sign-Off

**Tester:** ________________________  
**Date:** __________________________  
**Themes Tested:** Theme 1 ☐  Theme 2 ☐  Theme 3 ☐  
**Overall Status:** ☐ All Pass  ☐ Issues Found (see above)

---

## Appendix: Quick Reference

### Theme Color Specs

| Theme | Primary | Secondary | Accent | Background | Text |
|-------|---------|-----------|--------|------------|------|
| Theme 1 | #3B82F6 (Blue) | #10B981 (Green) | #f50aca (Pink) | #fbff00 (Yellow) | #1F2937 (Dark) |
| Theme 2 | #8B5CF6 (Purple) | #EC4899 (Pink) | #F59E0B (Orange) | #111827 (Dark Gray) | #F3F4F6 (Light) |
| Theme 3 | #000000 (Black) | #6B7280 (Gray) | #EF4444 (Red) | #F9FAFB (Light Gray) | #111827 (Dark) |

### Theme Font Specs

| Theme | Body Font | Heading Font |
|-------|-----------|--------------|
| Theme 1 | Inter | Poppins |
| Theme 2 | Roboto | Playfair Display |
| Theme 3 | system-ui | Georgia |

### Key URLs to Test

- Homepage: `http://localhost:3000/en`
- Product: `http://localhost:3000/en/products/[any-slug]`
- Cart: `http://localhost:3000/en/cart`
- Login: `http://localhost:3000/en/auth/login`
- Orders: `http://localhost:3000/en/profile/orders`
- Checkout Success: `http://localhost:3000/en/checkout/success`

### DevTools Console Commands

```javascript
// Check primary color
getComputedStyle(document.documentElement).getPropertyValue('--color-primary')

// Check body font
getComputedStyle(document.documentElement).getPropertyValue('--font-body')

// Check if hover token exists
getComputedStyle(document.documentElement).getPropertyValue('--color-primary-hover')

// Check if error bg exists
getComputedStyle(document.documentElement).getPropertyValue('--color-error-bg')

// List all theme tokens
Object.keys(document.documentElement.style)
  .filter(k => k.startsWith('--color') || k.startsWith('--font'))
```

---

**END OF CHECKLIST**
