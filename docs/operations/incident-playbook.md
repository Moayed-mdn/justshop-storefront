# Incident Playbook

## Purpose

This document provides the current incident response workflow that can be supported by the JustShop frontend repository itself.

Code surfaces this file aligns with:

- `app/pages/**`
- `app/stores/auth.ts`
- `app/stores/cart.ts`
- `app/composables/**`
- `server/api/**`
- `server/middleware/log.ts`

## First Response

When an incident is reported:

1. identify the affected route, locale, and user state
2. determine whether the issue affects guests, authenticated users, or both
3. reproduce the issue locally or in the affected environment if possible
4. gather browser console output and server logs
5. decide whether the incident is frontend-only, proxy-related, backend-related, or GraphQL-search-related

## Critical Flow Checklist

Use these flows as the current minimum validation set during a significant incident:

- `/` homepage
- `/products`
- `/products/category/<slug>`
- `/products/product/<slug>`
- `/search?q=<term>`
- `/cart`
- `/login`
- `/register`
- `/profile`
- `/orders`
- `/orders/<orderNumber>`
- `/orders/track`
- `/checkout/success`
- `/checkout/cancel`

## Feature-Specific Triage

### Auth

Check:

- login and register page access
- persisted auth cookie behavior
- `/api/auth/me` flow through Nitro
- Google auth callback behavior

### Cart And Checkout

Check:

- guest cart persistence in browser storage
- merge-on-login behavior
- add, update, and remove item flows
- checkout session creation
- checkout return pages

### Products And Search

Check:

- product list and category filters
- product detail fetch and related products
- search autocomplete
- `/search` GraphQL result loading

### Orders And Profile

Check:

- orders list and order detail access
- guest order lookup
- profile fetch and profile update flows
- avatar upload and password update where relevant

## Evidence To Collect

- affected URL and locale
- whether the user was authenticated
- browser console errors
- server log output
- relevant env or service reachability symptoms
- whether the failure reproduces in `npm run preview` or only in dev

## Rollback Reality

The repository does not define a built-in rollback command or deployment automation. Rollback must use the hosting platform’s external process and then repeat the critical flow checklist.

## Current Gaps

- Logging is limited and mostly console-based.
- No alerting or dashboard configuration is visible in the repo.
- No platform-owned runbook is encoded here for restarts or rollbacks.

## Change Rules

- Update this document when critical user flows, deployment procedures, or logging capabilities change.
- If incident ownership expands with external tooling, keep this file limited to what the repository can actually support or point clearly to the external owner process.
