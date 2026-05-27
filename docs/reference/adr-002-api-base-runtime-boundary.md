# ADR: API Base Runtime Boundary

## Status

Implemented

## Date

2026-05-27

## Context

- `nuxt.config.ts` previously sourced both `runtimeConfig.apiBase` and `runtimeConfig.public.apiBase` from `NUXT_PUBLIC_API_BASE`.
- This coupled the server-side Nitro proxy to a client-visible environment variable and prevented the use of internal network URLs for backend communication.
- The project architecture requires a clear boundary between public client-side config and sensitive or internal server-side config.

## Decision

- **Separate the configurations**: Introduce a server-only `apiBase` in `runtimeConfig` that defaults to `NUXT_API_BASE`.
- **Provide a fallback**: Default the server `apiBase` to `NUXT_PUBLIC_API_BASE` if the server-only variable is missing, ensuring zero-config development remains possible.
- **Isolate the public field**: Keep `runtimeConfig.public.apiBase` sourced strictly from `NUXT_PUBLIC_API_BASE`.
- **Update environment templates**: Include `NUXT_API_BASE` in `.env.example` with clear documentation of its server-only nature.

## Alternatives Considered

| Option | Why it was considered | Why it was not chosen |
|---|---|---|
| Keep mirroring the same public env value | Avoids configuration churn. | Couples server-side paths to client-visible variables and prevents internal networking optimizations. |
| Remove the public field entirely | Forces strict proxy usage. | The codebase still has legitimate client-side needs for the public API base (e.g., avatar URLs, direct links). |

## Consequences

### Benefits

- **Improved Security**: Internal/private backend URLs are no longer leaked to the browser.
- **Improved Performance**: Nitro can use fast internal network paths (e.g., `http://backend:8000`) instead of public routing.
- **Architectural Clarity**: Clearly defines which configuration is safe for the client vs. intended for the server.

### Trade-Offs

- Requires maintaining two environment variables if isolation is desired in production.

### Follow-Up Work

- [x] Update `nuxt.config.ts` to separate the two runtime fields.
- [x] Update `.env.example` to include `NUXT_API_BASE`.
- [x] Audit `server/utils/api.ts` to confirm it uses the server-only `apiBase`.

## Affected Code Surfaces

- `nuxt.config.ts`
- `.env.example`
- `server/utils/api.ts`
- `app/utils/serverApi.ts`

## Documentation Updates Required

- `docs/reference/decisions.md`
- `docs/configuration/runtime-config.md`
- `docs/configuration/environment-variables.md`

## Verification

- [x] Run `npm run build` to verify configuration mapping.
- [x] Verify that `useRuntimeConfig().apiBase` is undefined in the browser console.
- [x] Confirm Nitro requests correctly use `NUXT_API_BASE` when provided.
