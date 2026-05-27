# Build And Release

## Purpose

This document describes the current build and release reality for the JustShop frontend.

Code surfaces this file aligns with:

- `package.json`
- `README.md`
- `docs/getting-started/running-locally.md`

## Current Build Commands

| Command | Current use |
|---|---|
| `npm run build` | Primary production compilation check |
| `npm run preview` | Local preview of the built app |
| `npm run generate` | Optional static-generation validation |
| `npm run postinstall` | Runs `nuxt prepare` after install |

## Current Release Reality

The live repo does not currently show:

- CI release workflows
- automated versioning
- deployment manifests
- release-note automation

Release readiness is therefore manual and evidence-based.

## Current Minimum Release Evidence

Before treating a change set as release-ready:

1. ensure required env values are available
2. run `npm run build`
3. run `npm run preview` when local production validation is needed
4. manually smoke-check affected user flows
5. ensure documentation changes are included for any behavior change

## Recommended Manual Smoke Coverage

- homepage and product discovery
- product detail and add-to-cart
- cart and checkout entry
- login, register, and profile
- orders list, order detail, and guest order tracking
- search autocomplete and search results

## Current Gaps

- No release pipeline is visible in the repository.
- No formal release tagging or changelog automation is wired in the current codebase.
- Release quality currently depends on local validation discipline.

## Change Rules

- Update this document if build scripts, release gates, or verification expectations change.
- If release automation is added later, document what becomes automated and what remains manual.
