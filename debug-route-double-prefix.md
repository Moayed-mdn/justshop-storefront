# [OPEN] Route Double Prefix Debug Session

## Session
- ID: `route-double-prefix`
- Symptom: backend requests resolve to paths like `api/v1/users/v1/users/products/...`
- Goal: identify where the duplicated prefix is introduced and fix all affected route mappings safely

## Hypotheses
1. `runtimeConfig.apiBase` already includes `/api/v1/users`, and `EXTERNAL_API_ROUTES` adds `v1/users/...` again.
2. Some composables bypass Nitro and call the Laravel backend directly while still using internal route constants.
3. Nitro proxy handlers are correct, but `useServerApi()` composes URLs incorrectly because of `baseURL` normalization.
4. A subset of routes were renamed to internal `/api/...` endpoints without creating matching Nitro handlers, causing mixed direct/proxy traffic.
5. Some files still use stale hardcoded backend paths and are inconsistent with `shared/utils/routes.ts`.

## Evidence Plan
- Inspect runtime config, route constants, and request composition in server proxy code.
- Add minimal instrumentation to `server/utils/api.ts` to capture `baseURL`, requested path, and final composed target.
- Reproduce a failing product request and compare the logged values against the Laravel route list.

## Status
- Open

## Evidence
- Confirmed H1 with runtime logs:
  - pre-fix: `apiBase=http://127.0.0.1:8000/api/v1/users` and `request=v1/users/products/iphone-14/related`
  - post-fix: `apiBase=http://127.0.0.1:8000/api/v1/users` and `request=products/iphone-14/related`
- Reproduced failure before fix:
  - Nuxt response: `The route api/v1/users/v1/users/products/iphone-14/related could not be found.`
- Reproduced success after fix:
  - `GET /api/products/iphone-14` returns product payload
  - `GET /api/products/iphone-14/related` returns related products payload
  - `GET /api/auth/email/verify/1/test?...` now reaches backend route and returns `403 Forbidden` instead of route-not-found

## Fixes Applied
- Removed duplicated `v1/users` prefix from `EXTERNAL_API_ROUTES`.
- Switched checkout composable calls to internal Nitro routes.
- Added Nitro proxy for email verification and updated verify-email page to use it.
