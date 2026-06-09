# Theme Token Quick Reference

A practical guide for developers working with the JustShop theme system.

---

## Quick Token Lookup

### Common Replacements

| Old Tailwind Class | New Token Class | Use Case |
|-------------------|----------------|----------|
| `bg-white` | `bg-(--color-bg-card)` | Cards, panels, surfaces |
| `bg-gray-50` | `bg-(--color-bg-secondary)` | Alternate backgrounds |
| `text-gray-900` | `text-(--color-text-primary)` | Primary text |
| `text-gray-600` | `text-(--color-text-secondary)` | Secondary text |
| `text-gray-500` | `text-(--color-text-secondary)` | Labels, captions |
| `text-gray-400` | `text-(--color-text-tertiary)` | Placeholder, disabled |
| `border-gray-200` | `border-(--color-border-default)` | Standard borders |
| `border-gray-100` | `border-(--color-border-subtle)` | Dividers, light borders |
| `bg-green-600` | `bg-(--color-primary)` | Primary buttons |
| `hover:bg-green-700` | `hover:bg-(--color-primary-hover)` | Button hover |
| `text-white` (on button) | `text-(--color-on-primary)` | Button text (accessible) |

---

## Button Patterns

### Primary Button (Correct Pattern)
```vue
<button class="bg-(--color-primary) hover:bg-(--color-primary-hover) text-(--color-on-primary)">
  Click Me
</button>
```

❌ **DON'T:**
```vue
<button class="bg-green-600 hover:bg-green-950 text-white">
```

### Secondary Button
```vue
<button class="border border-(--color-border-default) text-(--color-text-primary) hover:bg-(--color-bg-hover)">
  Cancel
</button>
```

### Error/Danger Button
```vue
<button class="bg-(--color-error) text-white hover:opacity-90">
  Delete
</button>
```

---

## Card Patterns

### Standard Card
```vue
<div class="bg-(--color-bg-card) border border-(--color-border-default) rounded-lg p-6">
  <h2 class="text-(--color-text-primary) font-semibold mb-2">
    Card Title
  </h2>
  <p class="text-(--color-text-secondary)">
    Card description text
  </p>
</div>
```

### Card with Divider
```vue
<div class="bg-(--color-bg-card) border border-(--color-border-default) rounded-lg overflow-hidden">
  <div class="p-4 border-b border-(--color-border-subtle)">
    <h3 class="font-semibold text-(--color-text-primary)">Header</h3>
  </div>
  <div class="p-4">
    <p class="text-(--color-text-secondary)">Content</p>
  </div>
</div>
```

---

## Status Badge Pattern

### Using Computed Styles (Recommended)
```vue
<template>
  <span 
    class="px-2 py-1 rounded text-xs font-medium"
    :style="statusStyles"
  >
    {{ status }}
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
}>()

const normalizedStatus = computed(() => {
  const map = {
    'in_transit': 'shipped',
    'completed': 'delivered',
    'paid': 'processing',
    'unpaid': 'pending'
  }
  return map[props.status] || props.status
})

const statusStyles = computed(() => ({
  backgroundColor: `var(--status-${normalizedStatus.value}-bg)`,
  color: `var(--status-${normalizedStatus.value}-text)`
}))
</script>
```

---

## Text Hierarchy

```vue
<!-- Page Title -->
<h1 class="text-3xl font-bold text-(--color-text-primary) font-heading">
  Page Title
</h1>

<!-- Section Heading -->
<h2 class="text-xl font-semibold text-(--color-text-primary) font-heading">
  Section Heading
</h2>

<!-- Body Text -->
<p class="text-(--color-text-primary)">
  Main paragraph text
</p>

<!-- Secondary Text -->
<p class="text-sm text-(--color-text-secondary)">
  Helper text, captions, labels
</p>

<!-- De-emphasized Text -->
<p class="text-xs text-(--color-text-tertiary)">
  Timestamps, SKU, metadata
</p>
```

---

## Link Patterns

```vue
<!-- Primary Link -->
<NuxtLink class="text-(--color-primary) hover:underline">
  Learn More
</NuxtLink>

<!-- Breadcrumb Link -->
<NuxtLink class="text-(--color-text-secondary) hover:text-(--color-primary)">
  Home
</NuxtLink>

<!-- Card Link (entire card clickable) -->
<NuxtLink class="block hover:bg-(--color-bg-hover) transition-colors">
  <div class="p-4">
    <h3 class="text-(--color-text-primary)">Product Name</h3>
  </div>
</NuxtLink>
```

---

## List & Divider Patterns

```vue
<!-- List with Dividers -->
<div class="divide-y divide-(--color-border-subtle)">
  <div class="py-4">Item 1</div>
  <div class="py-4">Item 2</div>
  <div class="py-4">Item 3</div>
</div>

<!-- Horizontal Rule -->
<hr class="border-t border-(--color-border-subtle)">
```

---

## Form Patterns

```vue
<!-- Input Field -->
<input 
  type="text"
  class="w-full px-3 py-2 
         border border-(--color-border-default)
         bg-(--color-bg-card)
         text-(--color-text-primary)
         rounded-md
         focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary)"
>

<!-- Label -->
<label class="block text-sm font-medium text-(--color-text-primary) mb-1">
  Email Address
</label>

<!-- Helper Text -->
<p class="mt-1 text-xs text-(--color-text-secondary)">
  We'll never share your email
</p>

<!-- Error Message -->
<p class="mt-1 text-xs text-(--color-error-text)">
  This field is required
</p>
```

---

## Overlay Patterns

### Modal Overlay
```vue
<div :style="{ backgroundColor: 'var(--color-overlay-backdrop)' }">
  <!-- Modal content -->
</div>
```

### Image Overlay
```vue
<div 
  class="absolute inset-0"
  :style="{ backgroundColor: 'var(--color-overlay-medium)' }"
>
</div>
```

❌ **DON'T use Tailwind opacity modifiers for overlays:**
```vue
<!-- Avoid this - may not respect theme -->
<div class="bg-black/40">
```

---

## Empty State Pattern

```vue
<div class="text-center py-12">
  <div class="mb-4 text-5xl">📦</div>
  <h3 class="text-lg font-semibold text-(--color-text-primary) mb-2 font-heading">
    No Items Yet
  </h3>
  <p class="text-(--color-text-secondary) mb-6">
    Your cart is empty. Start shopping to add items.
  </p>
  <NuxtLink 
    class="inline-block px-6 py-2 
           bg-(--color-primary) 
           text-(--color-on-primary)
           rounded-md
           hover:bg-(--color-primary-hover)
           transition-colors"
  >
    Start Shopping
  </NuxtLink>
</div>
```

---

## Alert/Banner Patterns

### Info Banner
```vue
<div class="bg-(--color-info-bg) border-l-4 border-(--color-primary) p-4">
  <p class="text-(--color-info-text)">
    ℹ️ Your order has been confirmed
  </p>
</div>
```

### Error Banner
```vue
<div class="bg-(--color-error-bg) border-l-4 border-(--color-error) p-4">
  <p class="text-(--color-error-text)">
    ⚠️ Payment failed. Please try again.
  </p>
</div>
```

### Success Banner
```vue
<div class="bg-(--color-success-bg) border-l-4 border-(--color-success) p-4">
  <p class="text-(--color-success-text)">
    ✅ Changes saved successfully
  </p>
</div>
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Hardcoded Colors
```vue
<!-- BAD -->
<button class="bg-green-600 text-white">
```
```vue
<!-- GOOD -->
<button class="bg-(--color-primary) text-(--color-on-primary)">
```

### ❌ Mistake 2: text-white on Theme Buttons
```vue
<!-- BAD - text won't be readable on all theme colors -->
<button class="bg-(--color-primary) text-white">
```
```vue
<!-- GOOD - automatically adjusts for contrast -->
<button class="bg-(--color-primary) text-(--color-on-primary)">
```

### ❌ Mistake 3: Using gray-100 for subtle borders
```vue
<!-- BAD -->
<div class="border-b border-gray-100">
```
```vue
<!-- GOOD -->
<div class="border-b border-(--color-border-subtle)">
```

### ❌ Mistake 4: Missing Hover States
```vue
<!-- BAD - no hover feedback -->
<button class="bg-(--color-primary)">
```
```vue
<!-- GOOD - proper hover state -->
<button class="bg-(--color-primary) hover:bg-(--color-primary-hover)">
```

---

## When to Use Inline Styles

Use inline styles with CSS variables for:

1. **Dynamic Computed Values**
   ```vue
   <div :style="{ backgroundColor: `var(--status-${status}-bg)` }">
   ```

2. **Overlay Colors** (compatibility with older Tailwind)
   ```vue
   <div :style="{ backgroundColor: 'var(--color-overlay-medium)' }">
   ```

3. **Complex Color Combinations**
   ```vue
   <div :style="{ 
     backgroundColor: 'var(--color-bg-card)',
     borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border-default)'
   }">
   ```

---

## Dark Mode Considerations

All tokens automatically support dark mode. No special handling needed:

```vue
<!-- This works in both light and dark mode -->
<div class="bg-(--color-bg-card) text-(--color-text-primary)">
  Content adapts automatically
</div>
```

The system automatically applies the correct colors based on:
1. Merchant theme settings (priority 1)
2. User dark mode preference (priority 2, only if no merchant theme)

---

## Testing Your Changes

### Visual Check
1. Switch between different merchant themes
2. Toggle dark mode
3. Check hover states on all buttons
4. Verify text is readable on all backgrounds

### Quick Test Commands
```bash
# Check for hardcoded green colors
grep -r "green-950\|green-600" components/ pages/

# Check for text-white on themed buttons
grep -r "text-white.*bg-\(--color-primary\)" components/ pages/

# Check for hardcoded gray colors (should be minimal)
grep -r "text-gray-900\|bg-gray-50" components/ pages/
```

---

## Getting Help

### Where Tokens Are Defined

1. **Color Tokens:** `app/assets/css/tokens/_colors.css`
2. **Computed Tokens:** `app/utils/themeTokens.ts`
3. **Typography:** `app/assets/css/tokens/_typography.css`
4. **Component Tokens:** `app/assets/css/components/_*.css`

### Common Issues

**Issue:** "Token not defined" error  
**Solution:** Check if token exists in `_colors.css` or is computed in `themeTokens.ts`

**Issue:** "Text not readable on button"  
**Solution:** Use `text-(--color-on-primary)` instead of `text-white`

**Issue:** "Hover state not working"  
**Solution:** Add `hover:bg-(--color-primary-hover)` class

**Issue:** "Dark mode overriding merchant theme"  
**Solution:** Ensure selector uses `:root:not([data-merchant-dark-theme])[data-theme="dark"]`

---

## Reference: All Available Tokens

### Background
- `--color-bg-primary`
- `--color-bg-secondary`
- `--color-bg-card`
- `--color-bg-hover`
- `--color-bg-elevated`

### Text
- `--color-text-primary`
- `--color-text-secondary`
- `--color-text-tertiary`
- `--color-text-inverse`
- `--color-text-link`

### Border
- `--color-border-default`
- `--color-border-subtle`
- `--color-border-strong`
- `--color-border-hover`

### Interactive
- `--color-primary`
- `--color-primary-hover`
- `--color-secondary`
- `--color-accent`
- `--color-accent-hover`
- `--color-on-primary` (computed)
- `--color-on-secondary` (computed)
- `--color-on-accent` (computed)

### Status (6 statuses × 2 = 12 tokens)
- `--status-pending-bg` / `--status-pending-text`
- `--status-processing-bg` / `--status-processing-text`
- `--status-shipped-bg` / `--status-shipped-text`
- `--status-delivered-bg` / `--status-delivered-text`
- `--status-cancelled-bg` / `--status-cancelled-text`
- `--status-refunded-bg` / `--status-refunded-text`

### State
- `--color-error` / `--color-error-bg` / `--color-error-text`
- `--color-info` / `--color-info-bg` / `--color-info-text`
- `--color-warning` / `--color-warning-bg` / `--color-warning-text`
- `--color-success` / `--color-success-bg` / `--color-success-text`

### Overlay
- `--color-overlay-medium` (40% opacity)
- `--color-overlay-heavy` (60% opacity)
- `--color-overlay-backdrop` (50% opacity)

### Typography
- `--font-heading` (for h1-h6)
- `--font-body` (for body text)

---

## Pro Tips

1. **Use semantic names:** Choose tokens based on purpose, not color  
   ✅ `text-(--color-text-secondary)` not `text-gray-600`

2. **Buttons need accessible text:** Always use `--color-on-primary` for button text

3. **Overlays prefer inline styles:** Better compatibility across Tailwind versions

4. **Status badges use computed styles:** Dynamic status values need style binding

5. **Test with extreme themes:** Try very light and very dark primary colors to ensure contrast

6. **Font tokens apply automatically:** h1-h6 use `--font-heading` globally

---

**Last Updated:** June 9, 2026  
**Version:** 1.0  
**Maintained by:** Development Team
