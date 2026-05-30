# Debug Session: nuxt-composable-error

Status: OPEN
Started: 2026-05-31

## Symptom

- Runtime `H3Error` reports: "A composable that requires access to the Nuxt instance was called outside of a plugin, Nuxt hook, Nuxt middleware, or Vue setup function."
- Stack points to `app/pages/[...slug].vue`, especially `toRuntimePageError()` and setup flow around lines `90`, `132`, `145`, and `148`.

## Hypotheses

1. `toRuntimePageError()` calls a Nuxt composable after async context has been lost.
2. An imported helper used by `[...slug].vue` calls a Nuxt composable from a non-setup context.
3. An async callback path wraps an error after `await`, outside the active Nuxt context.
4. A secondary error path still uses composable-driven error construction.
5. Error normalization mixes runtime-safe and Nuxt-context-only helpers.

## Evidence Log

- Pending inspection of `app/pages/[...slug].vue` and related helpers.

## Next Step

- Inspect the failing page and all helpers used in its error normalization path.
