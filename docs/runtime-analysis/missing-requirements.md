# Missing Requirements & Partially Implemented Systems

## 1. Partially Implemented Systems

### **Tenant Resolution (`resolver.ts`)**
- **Status**: Mocked.
- **Requirement**: Must fetch tenant configuration from a database or external API based on the `hostname`.
- **Current State**: Hardcoded for `localhost`.

### **Feature Flags (`feature-flags/index.ts`)**
- **Status**: Skeleton only.
- **Requirement**: Must be populated from the `Tenant` configuration object.
- **Current State**: Returns empty object/default values.

### **Preview Mode (`StorefrontContext`)**
- **Status**: Context exists, logic missing.
- **Requirement**: Must allow viewing draft content from the CMS.
- **Current State**: Flag is hardcoded to `false`.

### **Internationalization (i18n)**
- **Status**: Basic.
- **Requirement**: Full `hreflang` support and dynamic locale switching integrated with the `RouteResolver`.
- **Current State**: Relies on standard `@nuxtjs/i18n` cookies/headers.

## 2. Unsafe Shortcuts & Technical Debt

### **Layout Manager Typing**
- **File**: `src/core/rendering/LayoutManager.vue`
- **Shortcut**: `as any` cast for `layoutName`.
- **Risk**: Passing a non-existent layout name will cause a Nuxt runtime error.

### **DTO Coverage**
- **Status**: Incomplete.
- **Requirement**: 100% of data passed to sections must be normalized.
- **Current State**: Some complex objects in `product_detail` might still use raw types from `~~/types/`.

## 3. Areas Requiring Further Migration

### **Search Page**
- **Status**: Not migrated.
- **Reason**: High complexity of search state and filtering logic.

### **Auth & Checkout**
- **Status**: Not migrated.
- **Reason**: Intentionally left for last to preserve conversion stability during the core refactor.
