# Accessibility

## Purpose

This document describes the current accessibility expectations for the JustShop frontend based on the live component and page patterns.

Code surfaces this file aligns with:

- `app/components/auth/**`
- `app/components/header/**`
- `app/components/ui/**`
- `app/components/profile/**`
- `app/pages/**`
- `i18n/locales/**`

## Current Baseline

The live repo already shows some positive accessibility patterns:

- labeled form inputs in auth and profile flows
- explicit button `type` usage in many interactive controls
- locale-aware text through `i18n`
- token-based focus styling in some shared UI, such as `ThemeToggle`
- screen-reader-only helper text in the header search input

These patterns should be preserved and extended.

## Forms

- Keep each input associated with a visible or programmatic label.
- Preserve field-level error messaging near the input, as seen in `auth/AuthFormInput.vue` and profile form components.
- Keep required fields explicit in auth, profile, and checkout-related form controls.
- Keep keyboard submission behavior predictable and avoid replacing native form semantics with click-only handlers.

## Buttons And Interactive Controls

- Keep interactive elements as real `<button>` or link elements, not clickable `div` wrappers.
- Set `type="button"` for non-submit buttons inside forms.
- Preserve focus-visible behavior when custom styling is added.
- Add accessible names to icon-only controls when the visible text is insufficient.

## Navigation And Search

- Keep locale-aware navigation through `NuxtLinkLocale` and locale path helpers.
- Preserve keyboard interaction for search and dropdown flows, including `Enter`, arrow keys, and `Escape`, as seen in `HeaderSearchInput.vue`.
- Keep search inputs and toggles discoverable to assistive technology with labels or screen-reader-only text.

## Modals, Drawers, And Overlays

- Preserve dismiss behavior for overlays such as `ui/Drawer.vue`.
- Ensure keyboard and focus behavior are considered when adding new drawers, modals, or destructive confirmations.
- Restore background scroll state cleanly when overlays close.

## Localization And Direction

- Keep all new user-facing strings localized when the feature already participates in `i18n/locales/**`.
- Preserve `lang` and `dir` behavior from `useLocaleHead()` in `app/app.vue`.
- Verify UI remains usable in both English and Arabic, especially for navigation, forms, search, cart, orders, and checkout flows.

## High-Risk Flows To Check

These current feature areas deserve explicit accessibility review whenever changed:

- login and register forms
- header search input and autocomplete dropdown
- cart quantity controls and checkout entry
- order tracking and order action buttons
- profile update, password, avatar, and delete-account flows
- language switching and top navigation

## Current Gaps To Track

- Some interactive toggles, such as the language switcher, do not currently expose richer state attributes like `aria-expanded`.
- Some icon-heavy controls may still need clearer accessible names or stronger keyboard-state documentation.
- There is no automated accessibility test tooling visible in the repo.
- Accessibility acceptance is currently manual and reviewer-driven.

## Change Rules

- Update this document when new shared interactive patterns are introduced.
- If accessibility tooling or audits are added later, document the new required checks here and in `testing.md`.
- When a current accessibility gap is fixed, remove the corresponding note here in the same change set.
