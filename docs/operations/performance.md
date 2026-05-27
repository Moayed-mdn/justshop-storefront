# Performance

## Purpose

This document records the main performance considerations currently visible in the JustShop frontend.

Code surfaces this file aligns with:

- `app/assets/css/**`
- `app/pages/search.vue`
- `app/components/header/HeaderSearchInput.vue`
- `app/pages/products/**`
- `app/pages/cart.vue`
- `app/plugins/apollo.client.ts`

## Current Hotspots

### Search

- Search and autocomplete use client-side Apollo queries with `fetchPolicy: 'no-cache'`.
- This keeps search results fresh but can increase repeated request volume and perceived latency.

### Product Detail

- Product detail loading currently happens in `onMounted(...)`, which means the main detail experience is client-coordinated after navigation.
- Related products are fetched alongside the main product payload.

### Cart

- Guest cart behavior is hydration-sensitive because it depends on browser storage.
- Cart rendering includes client-only gating and initial loading placeholders to avoid obvious hydration issues.

### CSS And UI

- The app loads a shared CSS bundle composed of tokens, base CSS, component CSS, and page CSS through `app/assets/css/main.css`.
- Performance-sensitive UI areas such as search, cards, skeletons, and layout all participate in that shared styling layer.

### Images And Media

- Product and hero UI depend on image-heavy surfaces.
- No image optimization policy is explicitly documented in the current repo docs yet.

## Current Review Expectations

When a change may affect performance, review:

- additional client-only requests
- repeated GraphQL query behavior
- large new shared CSS additions
- heavy image usage on home, product, and search surfaces
- hydration-sensitive changes in cart, theme, or search

## Current Gaps

- No automated performance budget is visible in the repo.
- No Lighthouse or web-vitals automation is present.
- No caching layer beyond feature-specific app logic is formally documented.

## Change Rules

- Update this document when major fetch patterns, CSS loading strategy, image handling, or client-only behavior changes.
- If formal performance budgets or audits are added later, document them here and link to the owning workflow.
