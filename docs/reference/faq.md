# FAQ

## Purpose

This document answers recurring developer questions using the current JustShop frontend codebase and existing owner docs.

## Questions

### Which request helper should I use for normal app requests?

Use `app/composables/useApi.ts` for normal app-side requests that should hit internal `server/api` routes.

Also note:

- the repo already has overlapping helper surfaces in `useClientApi.ts`, injected `$api`, and `app/utils/serverApi.ts`
- `useApi.ts` is the currently documented primary path

See:

- `docs/architecture/data-fetching.md`
- `docs/development/composables.md`
- `docs/development/server-routes.md`

### Should frontend code call the backend API directly?

No, not for the normal auth, cart, orders, profile, checkout, or product flows currently visible in the repo.

Use the internal Nitro `server/api/**` layer instead.

See:

- `docs/architecture/api-integration.md`
- `docs/development/server-routes.md`

### Where should a new component go?

- put feature-specific components in the relevant `app/components/<feature>/` folder
- put genuinely shared primitives in `app/components/ui/`

See:

- `docs/development/components.md`
- `docs/getting-started/project-structure.md`

### Where should a new reusable workflow go?

Put reusable feature workflows in `app/composables/`. Use Pinia stores only for durable shared state ownership such as auth and cart.

See:

- `docs/development/composables.md`
- `docs/architecture/state-management.md`

### Where should route protection logic live?

Use route middleware for access control and navigation gating. Keep visual rendering logic in pages and components.

See:

- `docs/development/pages-layouts-middleware.md`
- `docs/architecture/auth-and-security.md`

### How do I add a new route family safely?

Add or update the shared contracts in `shared/utils/routes.ts`, then wire the corresponding page, composable, and `server/api` handler changes together.

See:

- `docs/architecture/routing-and-navigation.md`
- `docs/development/server-routes.md`
- `docs/development/coding-standards.md`

### How do I run the app locally?

Current local startup is:

```bash
nvm use
npm install
cp .env.example .env
npm run dev
```

See:

- `README.md`
- `docs/getting-started/installation.md`
- `docs/getting-started/running-locally.md`

### What env vars are currently required?

The live repo currently expects:

- `NUXT_PUBLIC_API_BASE`
- `NUXT_PUBLIC_GRAPHQL_URL`
- `NUXT_PUBLIC_SITE_URL`

See:

- `docs/configuration/environment-variables.md`
- `docs/configuration/runtime-config.md`

### Why does the theme toggle not fully switch themes yet?

Because the current theme infrastructure exists, but `useTheme.ts` still forces light mode in the live implementation.

See:

- `docs/development/styling-and-ui.md`
- `docs/configuration/plugins.md`

### Are automated tests already set up?

No. The live repo currently relies on diagnostics, `npm run build`, and manual smoke testing.

See:

- `docs/development/testing.md`

### What happened to the earlier missing reference-doc sequencing gap?

It has now been backfilled. `docs/reference/external-services.md` and `docs/reference/decisions.md` both exist, so the approved documentation tree is aligned again through the end of Phase 4.

See:

- `docs/implementation-plan.md`
- `docs/reference/external-services.md`
- `docs/reference/decisions.md`
