# Rendering Strategy

## Purpose

This document explains the current server, client, and hydration boundaries visible in the JustShop frontend.

Code surfaces this file aligns with:

- `app/app.vue`
- `app/layouts/**`
- `app/plugins/**`
- `app/middleware/**`
- `app/stores/cart.ts`
- `app/pages/search.vue`

## Current Runtime Boundaries

| Surface | Current boundary | Why |
|---|---|---|
| `app/plugins/01.auth.client.ts` | client only | Reads persisted auth state and fetches the user after hydration |
| `app/plugins/02.cart.client.ts` | client only | Initializes cart state and guest cart behavior |
| `app/plugins/theme.client.ts` | client only | Touches browser theme state |
| `app/plugins/apollo.client.ts` | client only | Injects Apollo for browser-side search usage |
| `app/plugins/api.ts` | both | Injects shared fetch behavior for server and client contexts |
| `app/pages/search.vue` | hybrid page with client-only search execution | Calls `$apollo` inside `onMounted` and watches client locale/query changes |
| `app/stores/cart.ts` guest storage helpers | client only when touching `localStorage` | Uses `import.meta.server` guards |

## SSR And Hydration Notes

- `app/app.vue` uses `useLocaleHead()` and `useHead()` to set locale-aware HTML attributes and a theme-color meta tag.
- `app/app.vue` also injects an inline script that reads `localStorage` and `window.matchMedia` before the app hydrates.
- Cart and orders pages use hydration gates such as skeleton UIs before client state is ready.
- Guest cart persistence relies on browser storage and must stay guarded from server execution.

## Client-Only Behavior To Preserve

- direct `localStorage` access in cart and theme code
- `window.location.href` redirects used by Google auth and checkout flows
- Apollo search queries performed through the client-only plugin
- any plugin file ending in `.client.ts`

## Current Observation

The theme path is currently client-only, but `useTheme.ts` forces light mode instead of preserving a full dark/light preference flow. Document that as current behavior, not intended future behavior.

## Safety Rules

- Keep browser-only APIs behind client guards or client-only plugin files.
- Do not move GraphQL Apollo usage into server code without updating the architecture docs.
- When changing plugin suffixes, update the plugin and rendering docs in the same change set.
