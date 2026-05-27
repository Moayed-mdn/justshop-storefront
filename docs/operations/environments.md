# Environments

## Purpose

This document describes the current environment model for the JustShop frontend.

Code surfaces this file aligns with:

- `nuxt.config.ts`
- `.env.example`
- `docs/configuration/environment-variables.md`
- `docs/configuration/runtime-config.md`

## Current Environment Inputs

The live repo currently documents and reads:

- `NUXT_PUBLIC_API_BASE`
- `NUXT_PUBLIC_GRAPHQL_URL`
- `NUXT_PUBLIC_SITE_URL`

## Current Environment Differences

The repository does not define separate environment files for staging or production. The practical differences between environments currently come from the values injected into those variables.

### Local

- typically uses local backend and GraphQL endpoints
- commonly uses `http://localhost:3000` as site URL
- used for development, debugging, and manual smoke testing

### Staging

- should point to staging backend and GraphQL services
- should use the staging site URL for i18n `baseUrl`
- should be used for pre-release smoke testing

### Production

- should point to production backend and GraphQL services
- should use the production site URL for i18n `baseUrl`
- should be treated as user-facing and incident-sensitive

## Current Boundary Rules

- All active env vars are `NUXT_PUBLIC_*`, so they are client-visible.
- The server-side `runtimeConfig.apiBase` field is currently sourced from the same public API base value.
- Do not treat the current implementation detail as proof that server-only secrets are unnecessary in future architecture changes.

## Operational Checks Per Environment

- backend API must be reachable for internal `server/api` proxy routes
- GraphQL endpoint must be reachable for search
- locale-aware routing and `baseUrl` behavior must match the deployed site URL
- cookie behavior must allow auth persistence and locale selection

## Current Gaps

- No environment-specific deployment config files are visible in the repo.
- No server-only runtime config variables are currently defined.
- Server and public API base configuration are not truly separated today.

## Change Rules

- Update this document when env variables, runtime config boundaries, or environment-specific deployment behavior changes.
- Keep this file aligned with `.env.example` and the configuration docs in the same change set.
