# Dynamic Theme Header - Usage Guide

**Quick reference for using the new dynamic theme header system**

---

## 🚀 Quick Start

### Replace Static Header

**Option 1: In StorefrontShell.vue**

```vue
<!-- Before -->
<template>
  <div class="storefront-shell">
    <StorefrontShellHeader />
    <main><slot /></main>
    <StorefrontShellFooter />
  </div>
</template>

<!-- After -->
<template>
  <div class="storefront-shell">
    <ThemeHeader />  <!-- ✅ New dynamic header -->
    <main><slot /></main>
    <StorefrontShellFooter />
  </div>
</template>
```

**Option 2: In app.vue**

```vue
<template>
  <NuxtLayout>
    <ThemeHeader />
    <NuxtPage />
  </NuxtLayout>
</template>
```

---

## 📦 Available Block Types

The dynamic header supports 7 block types:

| Block Type | Component | Purpose |
|------------|-----------|---------|
| `logo` | LogoBlock | Store logo or name |
| `navigation_menu` | NavigationMenuBlock | Main navigation |
| `search_bar` | SearchBarBlock | Product search |
| `cart_icon` | CartIconBlock | Cart with badge |
| `language_selector` | LanguageSelectorBlock | Language switcher |
| `text` | TextBlock | Custom text |
| `button` | ButtonBlock | CTA buttons |

---

## 🎨 Backend Configuration Examples

### Example 1: Simple Header with Logo, Nav, and Cart

```json
{
  "section_type": "header",
  "position": 1,
  "is_visible": true,
  "settings": {
    "backgroundColor": "#ffffff",
    "sticky": true,
    "shadow": true
  },
  "blocks": [
    {
      "block_type": "logo",
      "position": 1,
      "is_visible": true,
      "settings": {
        "logoUrl": "/logo.png",
        "width": 120
      }
    },
    {
      "block_type": "navigation_menu",
      "position": 2,
      "is_visible": true,
      "settings": {
        "menuHandle": "main-menu"
      }
    },
    {
      "block_type": "cart_icon",
      "position": 3,
      "is_visible": true,
      "settings": {}
    }
  ]
}
```

---

### Example 2: Full-Featured Header

```json
{
  "section_type": "header",
  "position": 1,
  "is_visible": true,
  "settings": {
    "backgroundColor": "#1f2937",
    "textColor": "#ffffff",
    "sticky": true,
    "shadow": true,
    "containerWidth": "1280px",
    "justifyContent": "space-between",
    "gap": "2rem"
  },
  "blocks": [
    {
      "block_type": "logo",
      "position": 1,
      "is_visible": true,
      "settings": {
        "logoUrl": "/logo-white.png",
        "width": 150,
        "height": 40
      }
    },
    {
      "block_type": "navigation_menu",
      "position": 2,
      "is_visible": true,
      "settings": {
        "menuHandle": "main-menu",
        "orientation": "horizontal",
        "fontSize": "0.875rem"
      }
    },
    {
      "block_type": "search_bar",
      "position": 3,
      "is_visible": true,
      "settings": {
        "placeholder": "Search...",
        "maxWidth": "400px",
        "compact": true
      }
    },
    {
      "block_type": "language_selector",
      "position": 4,
      "is_visible": true,
      "settings": {
        "displayStyle": "buttons",
        "showFlags": true,
        "compact": true
      }
    },
    {
      "block_type": "cart_icon",
      "position": 5,
      "is_visible": true,
      "settings": {
        "showLabel": false
      }
    }
  ]
}
```

---

## ⚙️ Block Settings Reference

### Logo Block Settings

```typescript
{
  logoUrl?: string;        // Logo image URL
  storeName?: string;      // Text fallback
  width?: number;          // Logo width (px)
  height?: number | 'auto'; // Logo height
  maxWidth?: string;       // Max width (CSS)
  fontSize?: string;       // Text size (text-only)
  fontWeight?: string;     // Font weight
  color?: string;          // Text color
  centered?: boolean;      // Center alignment
}
```

---

### Navigation Menu Block Settings

```typescript
{
  menuHandle: string;      // Menu handle (required)
  orientation?: 'horizontal' | 'vertical'; // Default: 'horizontal'
  centered?: boolean;      // Center menu items
  gap?: string;            // Space between items
  fontSize?: string;       // Font size
  fontWeight?: string;     // Font weight
}
```

---

### Search Bar Block Settings

```typescript
{
  placeholder?: string;    // Placeholder text
  fullWidth?: boolean;     // Full width mode
  compact?: boolean;       // Compact mode
  maxWidth?: string;       // Max width
  inputSize?: 'small' | 'medium' | 'large'; // Size variant
  flex?: string;           // Flex grow value
}
```

---

### Cart Icon Block Settings

```typescript
{
  showLabel?: boolean;     // Show "Cart" text
  badgePosition?: string;  // Badge position
  iconSize?: string;       // Icon size (CSS)
  iconColor?: string;      // Icon color
}
```

---

### Language Selector Block Settings

```typescript
{
  displayStyle?: 'dropdown' | 'buttons'; // Default: 'buttons'
  showFlags?: boolean;     // Show flag emojis (default: true)
  gap?: string;            // Space between buttons
  compact?: boolean;       // Compact mode
}
```

---

### Text Block Settings

```typescript
{
  tag?: string;            // HTML tag (h1, p, div, etc.)
  content: string;         // Text content (required)
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: string;          // Text color
  fontSize?: string;       // Font size
  fontWeight?: string;     // Font weight
  lineHeight?: string;     // Line height
  letterSpacing?: string;  // Letter spacing
  bold?: boolean;          // Bold text
  italic?: boolean;        // Italic text
  uppercase?: boolean;     // Uppercase text
}
```

---

### Button Block Settings

```typescript
{
  text: string;            // Button text (required)
  url?: string;            // Button URL
  target?: '_self' | '_blank'; // Link target
  linkType?: 'link' | 'button'; // Element type
  buttonType?: 'button' | 'submit' | 'reset'; // Button type
  variant?: 'primary' | 'secondary'; // Color variant
  size?: 'small' | 'medium' | 'large'; // Size
  fullWidth?: boolean;     // Full width button
  outlined?: boolean;      // Outlined style
  icon?: string;           // Icon name (Heroicons)
  iconPosition?: 'left' | 'right'; // Icon position
  backgroundColor?: string; // Background color
  textColor?: string;      // Text color
  borderColor?: string;    // Border color
  borderRadius?: string;   // Border radius
  fontSize?: string;       // Font size
  fontWeight?: string;     // Font weight
}
```

---

## 🎯 Common Use Cases

### Use Case 1: Multi-Brand Storefront

Different logos and colors per store:

```json
{
  "blocks": [
    {
      "block_type": "logo",
      "settings": {
        "logoUrl": "/logos/store-a-logo.png"
      }
    }
  ],
  "settings": {
    "backgroundColor": "#ff6b6b"  // Brand color
  }
}
```

---

### Use Case 2: Promotional Header

Add a promotional button:

```json
{
  "blocks": [
    {
      "block_type": "button",
      "position": 10,
      "settings": {
        "text": "50% OFF Sale!",
        "url": "/sale",
        "variant": "primary",
        "icon": "heroicons:sparkles"
      }
    }
  ]
}
```

---

### Use Case 3: Minimal Header

Just logo and cart:

```json
{
  "blocks": [
    {
      "block_type": "logo",
      "position": 1,
      "settings": { "width": 100 }
    },
    {
      "block_type": "cart_icon",
      "position": 2,
      "settings": {}
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Header Not Showing

**Check**:
1. Theme data exists in database
2. Header section exists with `section_type: "header"`
3. Section `is_visible: true`
4. At least one block `is_visible: true`

**Debug**:
```vue
<script setup>
const { theme, getSection } = useStoreTheme();
await fetchTheme();

console.log('Theme:', theme.value);
console.log('Header Section:', getSection('header').value);
</script>
```

---

### Navigation Menu Not Loading

**Check**:
1. Navigation menu exists with correct handle
2. Menu has items
3. Items are visible (`is_visible: true`)
4. Menu is active (`is_active: true`)

**Test API**:
```bash
curl 'http://demo.justshop.test:3000/api/storefront/runtime/navigation?handle=main-menu'
```

---

### Blocks Not Rendering

**Check**:
1. Block `block_type` matches supported types
2. Block `is_visible: true`
3. Block has valid `position` value
4. No console errors

**Supported Types**:
- `logo`
- `navigation_menu`
- `search_bar`
- `cart_icon`
- `language_selector`
- `text`
- `button`

---

## 📝 Best Practices

### 1. Use Position Values with Gaps

Leave gaps between position values for future insertions:

```
✅ Good: 10, 20, 30, 40
❌ Bad: 1, 2, 3, 4
```

### 2. Keep Headers Simple

Limit to 5-7 blocks for best UX.

### 3. Mobile Considerations

- Navigation menu auto-hides on mobile
- Consider mobile-specific blocks
- Use `fullWidth` for search on mobile

### 4. Consistent Styling

Use theme colors instead of hardcoded values:

```json
{
  "backgroundColor": "var(--color-background)"  // ✅ Uses theme
}
```

### 5. Test Multiple Locales

Ensure header works in all supported languages.

---

## 🚀 Next Steps

1. **Test the header**: Create a test theme in the backend
2. **Add blocks**: Start with logo, nav, and cart
3. **Customize styling**: Adjust colors and spacing
4. **Test responsive**: Check mobile and tablet views
5. **Add language support**: Enable locale switching

---

## 📚 Related Documentation

- `SESSION_14_COMPLETE.md` - Implementation details
- `SESSION_13_COMPLETE.md` - Theme system foundation
- `THEME_INTEGRATION_README.md` - Complete integration guide
- `types/theme.ts` - Type definitions

---

**Created**: June 6, 2026  
**Status**: SESSION 14 Complete ✅

