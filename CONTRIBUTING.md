# Contributing

## Purpose

This repository is a Nuxt 4 storefront frontend with internal `server/api` proxy routes, localized routing, Pinia state, and Apollo-powered search.

This file defines the contributor workflow for code and documentation changes. Automation and AI agents must follow the same rules described here and in `AGENTS.md`.

## Local Prerequisites

- Node.js `22.12.0` from `.nvmrc`
- npm as the active package manager
- a reachable backend API base URL for Nitro proxy routes
- a reachable GraphQL endpoint for search

Install dependencies with:

```bash
nvm use
npm install
```

## Required Workflow

1. Read the live files that own the behavior you are changing.
2. Keep changes scoped and easy to review.
3. Update code and documentation in the same change set.
4. Run the relevant verification steps before handoff or review.
5. Call out assumptions, gaps, and code-vs-doc discrepancies clearly.

## Maintenance Cadence

- For every change set, update the owner docs, `.env.example`, and governance files that the change affects before review.
- For every major architectural or governance decision, update `docs/reference/decisions.md` in the same change set and add a standalone ADR if durable rationale is needed.
- For file-cleanup work, re-run the removal workflow from `docs/implementation-plan.md`, document review-required keep/remove outcomes in `docs/reference/decisions.md`, and update `CHANGELOG.md` when deletions affect contributor workflow or repository structure.
- Before closing a cleanup batch, verify diagnostics and rerun `npm run build` when the removed files could affect runtime, typing, or build behavior.

## Documentation Update Rules

Update documentation whenever you change one of these surfaces:

| Change type | Required documentation update |
|---|---|
| Environment variables or `runtimeConfig` | Update `.env.example`, `README.md` if setup changes, and the relevant configuration docs once they exist |
| Nuxt modules, plugins, or app boot sequence | Update `README.md`, `AGENTS.md`, and the future configuration docs |
| Routes, middleware, or navigation behavior | Update the owning architecture docs once they exist |
| Stores, auth flow, cart flow, or persisted state behavior | Update the owning architecture docs once they exist |
| Server proxy routes or backend integration behavior | Update the owning architecture and development docs once they exist |
| Dependency additions or removals | Update `package.json`, `README.md` if setup changes, and the relevant docs owner file |
| Repository workflow or governance rules | Update both `CONTRIBUTING.md` and `AGENTS.md` |

Do not leave a code change merged with missing documentation follow-up.

## Review Checklist

Before requesting review, verify the items that apply:

- `npm run dev` starts successfully
- the changed user flow works locally
- `npm run build` succeeds for config, runtime, dependency, route, or server changes
- no new environment variable is undocumented
- no new plugin, module, route family, or store is left without an owner document
- edited markdown matches the current codebase

## Change-Specific Expectations

### Environment And Config Changes

- Keep `.env.example` synchronized with live env usage.
- Use placeholder values only.
- Distinguish client-visible `NUXT_PUBLIC_*` values from server-only configuration.
- Do not document client access to server-only runtime values.

### Data And API Changes

- Frontend application data should continue to use the internal `server/api` layer for backend integration unless architecture is explicitly changed.
- Reuse `shared/utils/routes.ts` when a shared route constant already exists.
- Keep request and auth behavior aligned with `app/composables/useApi.ts`, `app/plugins/api.ts`, and `server/utils/api.ts`.

### Auth And Cart Changes

- Treat auth and cart changes as regression-sensitive.
- Verify login, logout, persisted auth behavior, guest cart behavior, and merge-on-login behavior when affected.
- Preserve SSR-safe handling around cookies and browser-only storage.

### Dependency Changes

Any new dependency requires explicit review justification covering:

- business reason
- alternatives considered
- SSR compatibility
- bundle or runtime impact
- security and maintenance posture

## Pull Request Notes

Use a clear PR summary that includes:

- what changed
- why it changed
- how it was verified
- what docs were updated
- any follow-up work or open questions

## Removal Safety

- Do not remove files purely from import-scan results when Nuxt may auto-load them.
- Follow the removal workflow in `docs/implementation-plan.md` for confirmed removable files.
- Get explicit approval before destructive cleanup work.
