# Components

## Purpose

This document describes how the current component layer is organized in the JustShop frontend and how new components should fit into it.

Code surfaces this file aligns with:

- `app/components/**`
- `app/pages/**`
- `app/assets/css/**`
- `i18n/locales/**`

## Current Component Structure

The component layer is feature-scoped rather than flat. Current top-level namespaces in `app/components/` include:

- `auth`
- `cart`
- `filter`
- `footer`
- `header`
- `hero`
- `layout`
- `order`
- `orders`
- `product`
- `Product`
- `profile`
- `search`
- `topbar`
- `ui`

## Current Ownership Pattern

The live repo uses three main component roles:

| Component role | Current examples | Responsibility |
|---|---|---|
| Feature shell or section component | `auth/AuthCard.vue`, `profile/ProfilePersonalInfoSection.vue`, `orders/OrdersList.vue` | Groups related UI for one feature area |
| Reusable view fragment | `header/HeaderLogo.vue`, `footer/FooterInfo.vue`, `product/ProductCard.vue` | Encapsulates a repeated part of a feature UI |
| Shared UI primitive | `ui/CartButton.vue`, `ui/LoadingSpinner.vue`, `ui/Drawer.vue`, `ui/ThemeToggle.vue` | Exposes a small reusable interface used by multiple features |

## Current Design Rules

- Keep components feature-scoped by default. If a component only serves one area such as orders, profile, auth, or cart, keep it under that feature folder.
- Move a component into `app/components/ui/` only when it is genuinely reusable across multiple feature areas.
- Keep page files thin by composing them from feature components rather than placing large amounts of visual markup directly in the page.
- Prefer small component APIs built around props, emitted events, and slots rather than direct store mutation inside every child component.

## Current API Patterns

The live repo shows a few recurring component interface styles:

### Props-Driven Feature Components

Examples such as `profile/ProfilePersonalInfoSection.vue` and `orders/OrdersList.vue`:

- receive typed props
- render feature-specific markup
- emit actions such as `submit`, `reorder`, `cancel`, or `update:page`
- leave data fetching and business logic in the page or composable layer

This is the preferred pattern for new feature components.

### Slot-Based Shell Components

Examples such as `auth/AuthCard.vue` and `layout/LayoutShop.vue`:

- wrap common layout structure
- expose slots for page-specific content
- keep the shell generic enough to be reused inside the same feature family

Use this pattern when multiple pages share the same framing but not the same exact content.

### Stateful Shared UI Components

`ui/CartButton.vue` is the clearest current example of a shared UI component that still owns interaction state:

- it accepts a small prop API
- it derives current cart state through `useCart()`
- it handles loading transitions and add/increment/decrement behavior

Use this pattern carefully. Shared UI components can own local interaction state, but feature-wide workflows still belong in composables and stores.

## Styling Expectations

- Reuse the current token and CSS structure under `app/assets/css/**`.
- Continue using utility classes and CSS variables together, which is the pattern visible across the current component set.
- Keep component-scoped styles small and local, as seen in `ui/CartButton.vue` and `product/ProductCard.vue`.
- Put broad feature styling in the shared CSS files rather than duplicating large style blocks across many components.

## Localization Expectations

- Keep user-facing text localized when the feature already has locale bundles in `i18n/locales/**`.
- Prefer `$t(...)` in components that render feature text already backed by locale files, such as auth, cart, checkout, orders, product, profile, header, and footer surfaces.
- Do not introduce new hardcoded English copy in shared or feature components when that feature already participates in localization.

## What Belongs In Components

- visual structure
- prop validation and typed component contracts
- local UI state such as open or closed state, small transitions, or field-level interactions
- emitted events that bubble feature actions upward

## What Should Stay Out Of Components

- direct backend integration logic
- duplicated route literal definitions when `shared/utils/routes.ts` already owns them
- cross-page auth, cart, checkout, or profile workflows that belong in composables or stores
- large, repeated data-fetching flows better handled in pages, composables, or `useAsyncData`

## Current Inconsistencies To Preserve As Debt

The repo is not fully uniform yet. New component work should follow the preferred pattern without copying these inconsistencies:

- `app/components/Product/**` and `app/components/product/**` currently use mixed directory casing.
- Some components build route targets inline, such as product and category links, instead of reusing shared route constants.
- Some shared UI components contain significant business interaction logic, so reuse decisions should be made carefully rather than assuming everything under `ui/` is purely presentational.

## Change Rules

- Update this document when a new top-level component namespace is introduced or when a reusable pattern changes materially.
- If a feature is refactored from page-heavy markup to component composition, keep this file aligned with the new ownership boundary.
- If a component is promoted from feature-specific to shared UI, document that boundary change here.
