# JustShop Frontend

Nuxt 4 storefront frontend for the `justshop-frontend` repository.

The application uses:

- Nuxt 4, Vue 3, and TypeScript
- Pinia with persisted auth state and cart state
- `@nuxtjs/i18n` with English and Arabic locale bundles
- Nitro `server/api` routes that proxy application traffic to an external backend API
- Apollo client for search GraphQL queries

## Quick Start

### Prerequisites

- Node.js `22.12.0` from `.nvmrc`
- npm
- backend API access for the REST proxy routes
- GraphQL endpoint access for search

### Install

```bash
nvm use
npm install
cp .env.example .env
```

Update `.env` with values for your local backend and site URL before starting the app.

### Run Locally

```bash
npm run dev
```

The app runs on `http://localhost:3000` by default.

## Environment Variables

Current active env variables:

| Variable | Purpose |
|---|---|
| `NUXT_PUBLIC_API_BASE` | Base URL used by runtime config for backend API access |
| `NUXT_PUBLIC_GRAPHQL_URL` | GraphQL endpoint used by `app/plugins/apollo.client.ts` |
| `NUXT_PUBLIC_SITE_URL` | Site base URL used by the i18n configuration |

See `.env.example` for safe placeholder values.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Nuxt development server |
| `npm run build` | Build the production app |
| `npm run preview` | Preview the production build locally |
| `npm run generate` | Generate static output if needed for validation |
| `npm run postinstall` | Run `nuxt prepare` after install |

## Project Highlights

Important code surfaces in the current repository:

- `nuxt.config.ts` for modules, i18n, CSS, and runtime config
- `app/plugins/` for app boot logic, including auth bootstrap, cart bootstrap, shared API behavior, theme setup, and Apollo
- `app/stores/auth.ts` and `app/stores/cart.ts` for persisted auth and cart state
- `app/composables/useApi.ts` for app-side request behavior
- `server/api/` for Nitro route handlers
- `server/utils/api.ts` for server-side backend proxy requests
- `shared/utils/routes.ts` for internal API routes, external backend route mappings, and frontend route constants

## Repository Structure

```text
app/         Nuxt application code: pages, components, composables, stores, plugins
server/      Nitro server routes, middleware, and backend proxy utilities
shared/      Shared route constants and reusable utilities
types/       Shared TypeScript types
i18n/        Locale JSON bundles
docs/        Project documentation and implementation roadmap
public/      Static web assets
```

## Documentation

Current documentation entry points:

- `docs/index.md` for the documentation hub
- `docs/getting-started/overview.md` for project onboarding
- `docs/getting-started/running-locally.md` for local startup and smoke checks
- `docs/implementation-plan.md` for the approved documentation roadmap
- `AGENTS.md` for AI and automation operating rules
- `CONTRIBUTING.md` for contributor workflow and review expectations

The deeper `docs/` sections are being built in phase order from the implementation plan. Until those files exist, treat `nuxt.config.ts`, `package.json`, `shared/utils/routes.ts`, `app/stores/`, `app/plugins/`, `app/composables/useApi.ts`, and `server/api/` as the source of truth.

## Working Rules

- Keep documentation updates in the same change set as code changes that alter behavior.
- Do not bypass the internal `server/api` layer for auth or backend-integrated app flows unless architecture is explicitly changed.
- Do not add real secrets to the repository or to `.env.example`.
