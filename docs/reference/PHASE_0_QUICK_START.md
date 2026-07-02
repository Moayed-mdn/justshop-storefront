# Phase 0 Critical Bugs - Quick Start Guide

**Priority:** 🔴 URGENT - Fix before any other development  
**Timeline:** Day 1 (6-7 hours)  
**Impact:** Fixes 80% of user-facing issues

---

## 🎯 GOAL

Fix 5 critical bugs that are currently breaking theme functionality for 100% of users:

1. Nobody sees merchant fonts (all users see browser default)
2. Wrong hover color on Add to Cart buttons
3. Production code references undefined CSS variables
4. Checkout pages completely unthemed
5. WCAG accessibility failures

---

## 🔴 BUG #1: Fix Font Token Chain (3 hours)

### Problem
The font token chain is broken at multiple points. Users see Times New Roman or system default instead of merchant-selected fonts.

### Files to Edit
1. `/app/utils/themeTokens.ts`
2. `/app/assets/css/tokens/_typography.css`
3. `/app/assets/css/base/_reset.css`

### Step 1: Fix themeTokens.ts

```typescript
// app/utils/themeTokens.ts

export function extractThemeTokens(theme: Theme): Record<string, string> {
  const tokens: Record<string, string> = {}
  
  // ✅ FIXED: Generate with correct prefix
  tokens['--font-body'] = theme.fonts.body
  tokens['--font-heading'] = theme.fonts.heading
  tokens['--font-main'] = theme.fonts.body  // NEW: Alias for _reset.css
  
  // Also generate runtime prefixes for backward compatibility
  tokens['--runtime-font-body'] = theme.fonts.body
  tokens['--runtime-font-heading'] = theme.fonts.heading
  
  // Keep old prefixes temporarily during migration
  tokens['--theme-font-body'] = theme.fonts.body
  tokens['--theme-font-heading'] = theme.fonts.heading
  
  // ... rest of color tokens
  
  return tokens
}
```

### Step 2: Add typography.css aliases

```css
/* app/assets/css/tokens/_typography.css */

:root {
  /* Fallback chain supporting all three naming conventions */
  --font-body: var(--runtime-font-body, var(--theme-font-body, var(--font-primary)));
  --font-heading: var(--runtime-font-heading, var(--theme-font-heading, var(--font-primary)));
  --font-main: var(--font-body);
}

/* Apply heading font globally */
h1, h2, h3, h4, h5, h6,
.heading {
  font-family: var(--font-heading);
}
```

### Step 3: Verify _reset.css (should already work)

```css
/* app/assets/css/base/_reset.css */
body {
  font-family: var(--font-main);  /* Now properly defined */
}
```

### Testing
```bash
# 1. Select Theme 1 in dashboard
# 2. Load homepage → should see Inter and Poppins
# 3. Load cart page → should see Inter and Poppins
# 4. Select Theme 2 → should see Lato and Playfair Display
# 5. Select Theme 3 → should see Open Sans and Montserrat
```

---

## 🔴 BUG #2: Fix Green Hover Catastrophe (2 hours)

### Problem
5 critical buttons hardcode `hover:bg-(--green-950)` regardless of theme color.

### Files to Edit
1. `/app/utils/themeTokens.ts` (add computed hover)
2. `/app/components/product/ProductActionButtons.vue`
3. `/app/components/auth/AuthSubmitButton.vue`
4. `/app/pages/reset-password.vue`
5. `/app/pages/checkout/success.vue`
6. `/app/pages/checkout/cancel.vue`

### Step 1: Add hover token computation

```typescript
// app/utils/themeTokens.ts

function calculateLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  const [r, g, b] = rgb.map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function derivePrimaryHover(primaryColor: string): string {
  const lum = calculateLuminance(primaryColor)
  if (lum < 0.15) {
    // Dark primary - lighten on hover
    return colorMix(primaryColor, '#ffffff', '15%')
  } else {
    // Light primary - darken on hover
    return colorMix(primaryColor, '#000000', '15%')
  }
}

export function extractThemeTokens(theme: Theme): Record<string, string> {
  // ... fonts from Bug #1
  
  tokens['--color-primary'] = theme.colors.primary
  tokens['--color-primary-hover'] = derivePrimaryHover(theme.colors.primary)  // NEW
  
  // ... rest
}
```

### Step 2: Fix all 5 button components

**Search and replace in all 5 files:**

```vue
<!-- BEFORE -->
class="bg-(--color-primary) text-white hover:bg-(--green-950)"

<!-- AFTER -->
class="bg-(--color-primary) text-(--color-on-primary) hover:bg-(--color-primary-hover)"
```

**Files:**
- `/app/components/product/ProductActionButtons.vue` (Add to Cart button)
- `/app/components/auth/AuthSubmitButton.vue` (Login/Register)
- `/app/pages/reset-password.vue` (Reset button)
- `/app/pages/checkout/success.vue` (View Orders button)
- `/app/pages/checkout/cancel.vue` (Return to Cart button)

### Testing
```bash
# Test with Theme 1 (blue #3B82F6):
# - Normal: Blue button
# - Hover: Darker blue (not green!)

# Test with Theme 2 (purple #8B5CF6):
# - Normal: Purple button
# - Hover: Darker purple (not green!)

# Test with Theme 3 (black #000000):
# - Normal: Black button
# - Hover: Slightly lighter (not green!)
```

---

## 🔴 BUG #3: Define Missing Tokens (1.5 hours)

### Problem
Production code references 8+ undefined CSS variables.

### File to Edit
`/app/assets/css/tokens/_colors.css`

### Add to _colors.css

```css
/* app/assets/css/tokens/_colors.css */

:root {
  /* ... existing tokens ... */
  
  /* ===== PHASE 0 BUG FIX: Add missing tokens ===== */
  
  /* Hover states */
  --color-primary-hover: /* Set by themeTokens.ts */;
  --color-border-hover: color-mix(in srgb, var(--color-border-default) 150%, black);
  
  /* Error states */
  --color-error-bg: #fee2e2;
  --color-error-hover: #dc2626;
  
  /* Info states */
  --color-info-bg: #dbeafe;
  --color-info-text: #1e40af;
  --color-info-border: #93c5fd;
  
  /* Warning states */
  --color-warning-bg: #fef3c7;
  --color-warning-text: #92400e;
  
  /* Border variants */
  --color-border-subtle: color-mix(in srgb, var(--color-text) 10%, transparent);
  
  /* Surface variants */
  --color-surface: var(--color-bg-elevated);
  --color-surface-hover: color-mix(in srgb, var(--color-bg-elevated) 95%, black);
  
  /* On-color text (computed by themeTokens.ts) */
  --color-on-primary: #ffffff;
  --color-on-secondary: #ffffff;
  --color-on-accent: #ffffff;
  
  /* Status badges - Light mode */
  --status-pending-bg: #fef3c7;
  --status-pending-text: #92400e;
  --status-processing-bg: #dbeafe;
  --status-processing-text: #1e40af;
  --status-shipped-bg: #e0e7ff;
  --status-shipped-text: #4c1d95;
  --status-delivered-bg: #d1fae5;
  --status-delivered-text: #065f46;
  --status-cancelled-bg: #fee2e2;
  --status-cancelled-text: #991b1b;
  --status-refunded-bg: #ffedd5;
  --status-refunded-text: #7c2d12;
  
  /* Overlays (fixed, not merchant-configurable) */
  --color-overlay-light: rgba(0, 0, 0, 0.3);
  --color-overlay-medium: rgba(0, 0, 0, 0.5);
  --color-overlay-heavy: rgba(0, 0, 0, 0.7);
  --color-overlay-backdrop: rgba(0, 0, 0, 0.4);
  --color-on-overlay: #ffffff;
}

/* Dark mode - Invert status badges */
[data-theme="dark"] {
  --color-error-bg: #7f1d1d;
  --color-info-bg: #1e3a8a;
  --color-warning-bg: #78350f;
  
  --status-pending-bg: #78350f;
  --status-pending-text: #fef3c7;
  --status-processing-bg: #1e3a8a;
  --status-processing-text: #dbeafe;
  --status-shipped-bg: #4c1d95;
  --status-shipped-text: #ede9fe;
  --status-delivered-bg: #14532d;
  --status-delivered-text: #dcfce7;
  --status-cancelled-bg: #7f1d1d;
  --status-cancelled-text: #fee2e2;
  --status-refunded-bg: #7c2d12;
  --status-refunded-text: #ffedd5;
  
  /* Darker overlays on dark themes */
  --color-overlay-light: rgba(0, 0, 0, 0.4);
  --color-overlay-medium: rgba(0, 0, 0, 0.6);
  --color-overlay-heavy: rgba(0, 0, 0, 0.8);
  --color-overlay-backdrop: rgba(0, 0, 0, 0.7);
}
```

### Also add to themeTokens.ts

```typescript
// app/utils/themeTokens.ts

function getAccessibleTextColor(bgColor: string): '#FFFFFF' | '#111827' {
  const luminance = calculateLuminance(bgColor)
  // WCAG threshold: 0.179
  return luminance < 0.179 ? '#FFFFFF' : '#111827'
}

export function extractThemeTokens(theme: Theme): Record<string, string> {
  // ... existing tokens
  
  // Compute on-color tokens for WCAG compliance
  tokens['--color-on-primary'] = getAccessibleTextColor(theme.colors.primary)
  tokens['--color-on-secondary'] = getAccessibleTextColor(theme.colors.secondary)
  tokens['--color-on-accent'] = getAccessibleTextColor(theme.colors.accent)
  
  return tokens
}
```

### Testing
```bash
# 1. Load cart page → trigger validation error
#    → Error should have red background (#fee2e2)

# 2. Navigate to orders page
#    → Pagination hover should work

# 3. View order details
#    → Status badges should render with colors

# 4. Open modal/drawer
#    → Overlay should display correctly

# 5. Check browser console
#    → No warnings about undefined CSS variables
```

---

## ✅ VERIFICATION CHECKLIST

After completing all 3 bugs:

### Fonts
- [ ] Select Theme 1 → See Inter and Poppins
- [ ] Select Theme 2 → See Lato and Playfair Display  
- [ ] Select Theme 3 → See Open Sans and Montserrat
- [ ] Fonts persist on cart/checkout pages
- [ ] Headings use heading font

### Button Hovers
- [ ] Theme 1: Blue button → darker blue hover (not green)
- [ ] Theme 2: Purple button → darker purple hover (not green)
- [ ] Theme 3: Black button → lighter hover (not green)
- [ ] Test all 5 buttons: Add to Cart, Login, Register, Reset, View Orders, Return to Cart

### Tokens
- [ ] Error messages show red backgrounds
- [ ] Pagination hover states work
- [ ] Status badges render correctly
- [ ] Modal/drawer overlays display
- [ ] No console errors about undefined CSS variables

### WCAG
- [ ] Button text is black on Theme 1 colors
- [ ] Button text is readable on all themes
- [ ] Status badges readable in both light/dark mode

---

## 🚀 NEXT STEPS AFTER PHASE 0

Once Phase 0 is complete and verified:

1. **Checkout pages** (3.5 hours)
   - Fix `checkout/success.vue` (18 colors)
   - Fix `checkout/cancel.vue` (12 colors)

2. **Product components** (3.5 hours)
   - Fix `ProductHeader.vue` (most visible text)
   - Fix `ProductImageGallery.vue` (12 colors)

3. **Architecture** (2-3 days)
   - Unify dual theme entry points
   - Eliminate FOUC on static pages

See full migration plan in `THEME_COLOR_ARCHITECTURE_AUDIT_ENHANCED.md` Section 10.

---

## 📚 REFERENCE DOCUMENTS

- **Full Audit:** `THEME_COLOR_ARCHITECTURE_AUDIT_ENHANCED.md` (4,524 lines)
- **Summary:** `THEME_AUDIT_SUMMARY_ENHANCED.md` (418 lines)
- **Completion Report:** `ENHANCED_AUDIT_COMPLETION.md`

---

**Priority:** 🔴 DO THIS FIRST  
**Timeline:** Day 1 (6-7 hours)  
**Impact:** Fixes 80% of user-facing theme issues

**DO NOT proceed with other development until Phase 0 is complete and verified.**
