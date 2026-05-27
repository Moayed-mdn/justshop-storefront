# Testing

## Purpose

This document describes the current verification strategy for the JustShop frontend and the testing reality visible in the live repository.

Code surfaces this file aligns with:

- `package.json`
- `docs/getting-started/running-locally.md`
- `app/pages/**`
- `server/api/**`

## Current Reality

The live repo does not currently contain:

- automated unit tests
- integration test files
- end-to-end test files
- npm test scripts
- CI workflows in `.github/`

Current verification is therefore manual and build-oriented.

## Current Available Commands

| Command | Current role |
|---|---|
| `npm run dev` | Manual development verification |
| `npm run build` | Production compilation check |
| `npm run preview` | Local production-preview validation |
| `npm run generate` | Optional static-generation validation |

## Required Current Verification Flow

For meaningful change validation in this repo today:

1. run diagnostics for edited files where practical
2. run `npm run build` for substantive changes
3. manually verify affected routes and flows in the browser
4. confirm docs are updated when the change affects architecture, routes, stores, plugins, env vars, or runtime behavior

## Manual Smoke Coverage

Current high-value smoke checks should cover:

- home page and hero content
- product listing and category listing
- product detail, variant selection, and add-to-cart
- cart behavior for guest and authenticated users
- login and register flows
- profile access and profile update flows
- orders list, order detail, and guest order tracking
- search autocomplete and `/search?q=<term>` results
- checkout success and cancel return pages

## What To Verify By Change Type

### Docs-Only Changes

- diagnostics on edited markdown files
- link and owner-doc consistency

### UI Or Styling Changes

- affected page render and responsive behavior
- focus, button, and form interactions
- hydration-sensitive screens such as cart and search

### Data Or API Changes

- related `server/api` route behavior
- auth and locale header handling
- end-to-end browser flow for the affected feature

### Store Or Persistence Changes

- auth persistence across refresh
- guest cart local storage behavior
- merge-on-login cart behavior

## When To Add Automated Tests

Automated tests would add the most value when changes affect:

- auth or route protection
- cart merge and checkout behavior
- order lookup or reorder flows
- composables with branching business logic
- pure utilities that are hard to verify manually

Until a test framework is introduced, prefer targeted manual checks and `npm run build` over speculative placeholder tests.

## Current Gaps

- No test harness is wired into `package.json`.
- No CI automation is visible in the repo.
- No component preview or visual regression tooling is present.
- Verification evidence depends on local build success and human smoke testing.

## Change Rules

- Update this document when test scripts, test frameworks, or CI workflows are added.
- If a new automated test layer becomes the standard, document which checks remain mandatory manually and which move into automation.
