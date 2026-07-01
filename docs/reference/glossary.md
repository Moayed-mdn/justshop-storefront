# Glossary

## Purpose

This glossary defines the shared technical and product terms used across the JustShop frontend documentation.

Code surfaces this file aligns with:

- `nuxt.config.ts`
- `shared/utils/routes.ts`
- `app/pages/**`
- `app/stores/**`
- `server/api/**`
- `i18n/locales/**`

## Terms

| Term | Definition |
|---|---|
| Apollo client | The client-side GraphQL client provided by `app/plugins/apollo.client.ts` and used by the search page. |
| APP_ROUTES | The frontend route constants exported from `shared/utils/routes.ts`. |
| auth store | The Pinia store in `app/stores/auth.ts` that holds the current token and user state. |
| backend API | The external service reached through the Nitro proxy layer using the configured API base URL. |
| cart store | The Pinia store in `app/stores/cart.ts` that manages authenticated and guest cart behavior. |
| checkout session | The checkout payload created before redirecting the user to hosted payment flow. |
| composable | A Nuxt or Vue composition helper under `app/composables/`, such as `useAuth`, `useCart`, or `useCheckout`. |
| docs owner file | The primary documentation file responsible for one topic area, as defined by the implementation plan. |
| guest cart | Cart state stored client-side for users who are not logged in. |
| locale cookie | The `i18n_redirected` cookie used by the current locale detection setup. |
| middleware | Nuxt route middleware under `app/middleware/` such as `auth` and `guest`. |
| Nitro | Nuxt's server runtime used here for `server/api` handlers and server middleware. |
| page route | A route generated from a file in `app/pages/`. |
| persisted auth | The current auth token persistence behavior configured through the Pinia persisted-state integration. |
| plugin | A Nuxt plugin in `app/plugins/` that runs during app initialization or injects shared runtime behavior. |
| runtimeConfig | Nuxt runtime configuration defined in `nuxt.config.ts` and accessed with `useRuntimeConfig()`. |
| search query | The GraphQL query used by the search experience in `app/graphql/queries/search.ts`. |
| server/api | The internal Nitro route layer that the frontend calls for most application data flows. |
| shared routes | The centralized route definitions in `shared/utils/routes.ts` for app, internal API, and external backend paths. |
| store | A Pinia state container under `app/stores/`. |
| useApi | The current app-side request helper in `app/composables/useApi.ts`. |

## Terminology Rules

- Use Nuxt terms exactly: `pages`, `layouts`, `middleware`, `plugins`, `composables`, `server/api`, and `runtimeConfig`.
- Prefer the shared route names from `shared/utils/routes.ts` over ad hoc path wording when discussing concrete routes.
- Distinguish internal `server/api` routes from external backend API routes.
