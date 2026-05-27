# Feature Flags

## Purpose

This document reserves the configuration and governance rules for feature flags before any active flag system is added to the JustShop frontend.

## Current Status

There are no active feature flags visible in the current codebase.

The review checks performed for this phase did not find a live flag system in:

- `nuxt.config.ts`
- `app/plugins/**`
- `app/composables/**`
- `app/pages/**`
- `.env.example`

## Governance Rules For Future Flags

When feature flags are added later:

- document each flag in this file
- document its owner, default behavior, and rollout intent
- specify whether it is build-time, runtime, server-only, client-visible, or both
- update `.env.example` if a flag depends on env configuration
- update the owner architecture or configuration doc if the flag changes runtime behavior

## Minimum Future Entry Format

| Flag | Owner | Default | Runtime scope | Related docs |
|---|---|---|---|---|
| `<flag name>` | `<team or file>` | `<on/off>` | `<client/server/both>` | `<docs>` |

## Safety Rule

Do not add undocumented rollout switches, hidden behavior toggles, or environment-based flags without updating this document in the same change set.
