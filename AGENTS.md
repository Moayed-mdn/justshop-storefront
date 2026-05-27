# AGENTS.md

## Purpose

This file defines the mandatory operating rules for AI agents and automation working in `/home/leader/projects/nuxt/justshop-frontend`.

Use this file together with:

- `CONTRIBUTING.md` for shared contributor workflow
- `docs/implementation-plan.md` for the authoritative documentation roadmap
- `README.md` for repository entry points and setup commands

## Repository Facts You Must Preserve

Current code-backed project surfaces:

- Nuxt 4 with Vue 3 and TypeScript
- Pinia stores in `app/stores/` with persisted auth state and cart state
- `@nuxtjs/i18n` with English and Arabic locale bundles in `i18n/locales/`
- Nitro server routes under `server/api/`
- Server-side backend proxy helpers in `server/utils/api.ts`
- Shared route contracts in `shared/utils/routes.ts`
- Apollo client search integration in `app/plugins/apollo.client.ts`

Important files to inspect before documenting related behavior:

- `nuxt.config.ts`
- `package.json`
- `shared/utils/routes.ts`
- `app/stores/auth.ts`
- `app/stores/cart.ts`
- `app/composables/useApi.ts`
- `server/utils/api.ts`
- `app/plugins/01.auth.client.ts`
- `app/plugins/02.cart.client.ts`
- `app/plugins/api.ts`
- `app/plugins/apollo.client.ts`

## Required Workflow

1. Inspect before editing.
2. Read the live source files that own the behavior you are about to change or document.
3. Treat `docs/implementation-plan.md` as the controlling roadmap for documentation sequencing unless the user explicitly changes scope.
4. Follow the documented phase order. Do not skip ahead when an upstream owner document is missing.
5. Update documentation in the same change set whenever you modify:
   - environment variables
   - routes or route families
   - stores
   - plugins
   - modules
   - deployment or runtime behavior
   - external integrations
6. Keep root docs concise and navigational. Put deep technical detail in `docs/`.
7. Run diagnostics after substantive edits and fix issues you introduced when practical.

## Maintenance Cadence

- On every change set, update the owner docs, `.env.example`, and governance files that the change affects before handoff.
- On every major architectural or governance decision, update `docs/reference/decisions.md` in the same change set and add a standalone ADR when durable rationale or supersession tracking is needed.
- For file-cleanup work, re-run the removal workflow from `docs/implementation-plan.md`, record review-required keep/remove outcomes in `docs/reference/decisions.md`, and update `CHANGELOG.md` when deletions affect contributor workflow or repository structure.
- Before closing a cleanup batch, verify diagnostics and rerun `npm run build` when removed files could affect runtime, typing, or build behavior.

## Accuracy Rules

- Do not present guesses as facts.
- Prefer current code over stale plan assumptions when they conflict, and record the discrepancy.
- Link or point to the owner document instead of duplicating long explanations.
- Keep Nuxt terminology exact: `pages`, `layouts`, `middleware`, `plugins`, `composables`, `server/api`, `runtimeConfig`.
- Document runtime boundaries clearly: client, server, or both.

## Security Rules

- Never add real secrets, tokens, keys, or production credentials to the repository.
- Never put real values in `.env.example`.
- Do not expose server-only guidance as client-safe behavior.
- Do not bypass the internal `server/api` proxy layer for backend auth or application data flows unless the user explicitly changes architecture.
- Treat auth, cart, profile, checkout, and external API integration as sensitive areas that require code-backed wording.

## Implementation Rules For This Repo

- Reuse `shared/utils/routes.ts` instead of introducing duplicate route literals where a shared constant already exists.
- Preserve SSR-safe guards around browser-only APIs such as `localStorage`, `window`, and `document`.
- Respect plugin mode and ordering semantics already visible in `app/plugins/`, especially `01.auth.client.ts` and `02.cart.client.ts`.
- Keep auth persistence behavior aligned with `app/stores/auth.ts` and the persisted cookie storage currently configured there.
- Keep guest cart behavior aligned with `app/stores/cart.ts`, including client-only local storage handling and merge-on-login behavior.

## File Removal And Cleanup

- Do not delete files only because they appear unreferenced. Nuxt auto-load conventions apply to `app/pages/`, `app/layouts/`, `app/middleware/`, `app/plugins/`, `app/stores/`, and `server/api/`.
- Follow the unused-file workflow in `docs/implementation-plan.md` before deleting confirmed removable files.
- Do not perform destructive cleanup without explicit user approval when deletion is involved.

## Handoff Requirements

When you finish a task, provide:

- files created or updated
- any unresolved questions
- any discrepancy found between live code and existing docs or plan assumptions
- the next recommended documentation files in phase order
