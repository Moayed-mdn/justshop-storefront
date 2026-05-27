# Prerequisites

## Purpose

This document lists the required tools and external dependencies needed before installing or running the JustShop frontend locally.

Code surfaces this file aligns with:

- `.nvmrc`
- `package.json`
- `nuxt.config.ts`
- `server/api/**`
- `app/plugins/apollo.client.ts`

## Required Tooling

| Requirement | Current value | Why it is needed |
|---|---|---|
| Node.js | `22.12.0` | Matches `.nvmrc` and local development expectations |
| Package manager | `npm` | The repo includes `package-lock.json` and npm scripts only |
| Browser | modern Chromium, Firefox, or Safari | Needed to exercise locale routing, auth, cart, and search flows |

## Required External Services

| Dependency | Why it is required | Where it is used |
|---|---|---|
| Backend API base URL | Internal Nitro routes proxy application requests to it | `server/api/**`, `server/utils/api.ts` |
| GraphQL endpoint | Search page sends client-side GraphQL queries to it | `app/plugins/apollo.client.ts`, `app/pages/search.vue` |

## Required Environment Preparation

Before first run, you need a local `.env` file with placeholders from `.env.example`:

- `NUXT_PUBLIC_API_BASE`
- `NUXT_PUBLIC_GRAPHQL_URL`
- `NUXT_PUBLIC_SITE_URL`

These are the active env variables currently visible in the codebase.

## Recommended Local Setup

```bash
nvm use
npm install
cp .env.example .env
```

Then set the `.env` values so they point to a working local or shared development backend and GraphQL service.

## Before You Continue

Confirm all of the following:

- Node `22.12.0` is active
- `npm install` succeeds
- `.env` exists
- the backend API is reachable from your machine
- the GraphQL endpoint is reachable from your machine

If those prerequisites are not ready, stop here and resolve them before moving to installation and local runtime validation.
