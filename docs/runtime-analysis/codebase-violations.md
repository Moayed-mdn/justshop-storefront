# Codebase Violations

The following files contain violations of the new platform architecture or TypeScript standards.

### **1. `src/core/rendering/LayoutManager.vue`**
- **Violation**: Use of `as any` type casting.
- **Severity**: Medium.
- **Why it breaks architecture**: Bypasses Type Safety for layout resolution.
- **Recommended Fix**: Define a union type for supported layouts or use `Component` type if layouts are dynamic.

### **2. `src/core/runtime/router/useRouteResolver.ts`**
- **Violation**: Hardcoded Business Logic (Mocking).
- **Severity**: High (for production).
- **Why it breaks architecture**: The runtime should be data-driven, not code-driven.
- **Recommended Fix**: Replace `mockResolve` with a call to `useStorefrontApi`.

### **3. `src/core/rendering/useSectionData.ts`**
- **Violation**: Direct usage of legacy composables (`useProductDetail`, `useProductByCategory`).
- **Severity**: Medium.
- **Why it breaks architecture**: These composables should be refactored into `src/domains/` or `src/core/api/`.
- **Recommended Fix**: Move the fetch logic into the `src/core/api` layer and keep this file as a pure orchestrator.

### **4. `app/pages/[...slug].vue`**
- **Violation**: Watch-based SEO injection.
- **Severity**: Low.
- **Why it breaks architecture**: While functional, a more robust solution would be to integrate with `useServerSeoMeta` for better SSR control.
- **Recommended Fix**: Use `useServerSeoMeta` inside the `useAsyncData` callback.

### **5. `src/core/api/dto/storefront.ts`**
- **Violation**: Loose `any` typing in transformers.
- **Severity**: Medium.
- **Why it breaks architecture**: Reduces the reliability of the DTO layer.
- **Recommended Fix**: Define `RawBackendResponse` interfaces to type the `raw` parameters.
