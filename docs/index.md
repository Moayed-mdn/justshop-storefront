# Documentation Index

## Purpose

This is the documentation hub for `/home/leader/projects/nuxt/justshop-frontend`.

It links the current owner documents, records what has already been created, and shows what is still planned under the approved implementation roadmap in `docs/implementation-plan.md`.

## Available Now

| Document | Purpose |
|---|---|
| `README.md` | Repository entry point, local setup, scripts, and top-level navigation |
| `AGENTS.md` | Mandatory AI and automation operating rules |
| `CONTRIBUTING.md` | Contributor workflow, review expectations, and doc-update rules |
| `CHANGELOG.md` | Human-readable history for notable repo and workflow changes |
| `.env.example` | Canonical non-secret env placeholder file for active variables |
| `docs/getting-started/overview.md` | Project introduction, feature areas, and onboarding path |
| `docs/getting-started/prerequisites.md` | Tooling, services, and environment requirements |
| `docs/getting-started/installation.md` | Clean installation and first-run setup |
| `docs/getting-started/running-locally.md` | Local runtime commands and smoke checks |
| `docs/getting-started/project-structure.md` | Current repository directory ownership map |
| `docs/configuration/overview.md` | Configuration ownership map |
| `docs/configuration/nuxt-config.md` | Live `nuxt.config.ts` reference |
| `docs/configuration/runtime-config.md` | Public and server runtime config boundaries |
| `docs/configuration/environment-variables.md` | Authoritative env variable catalog |
| `docs/configuration/modules.md` | Active Nuxt module inventory |
| `docs/configuration/plugins.md` | Plugin inventory, order, and runtime mode notes |
| `docs/configuration/feature-flags.md` | Feature flag governance and current no-flags status |
| `docs/architecture/overview.md` | Top-level runtime layer overview |
| `docs/architecture/rendering-strategy.md` | SSR, client-only, and hydration boundaries |
| `docs/architecture/routing-and-navigation.md` | Route families, middleware, and locale routing |
| `docs/architecture/data-fetching.md` | REST proxy and GraphQL data access patterns |
| `docs/architecture/state-management.md` | Pinia store ownership and persistence rules |
| `docs/architecture/auth-and-security.md` | Auth flows, token handling, and protection rules |
| `docs/architecture/api-integration.md` | Internal API proxy model and backend mapping |
| `docs/development/coding-standards.md` | Current repo coding, naming, SSR, and dependency rules |
| `docs/development/components.md` | Component namespaces, ownership boundaries, and current API patterns |
| `docs/development/composables.md` | Composable responsibilities, side-effect rules, and helper overlap notes |
| `docs/development/pages-layouts-middleware.md` | Route-backed page, layout, and middleware ownership rules |
| `docs/development/server-routes.md` | Nitro `server/api` conventions, proxy patterns, and route-family guidance |
| `docs/development/styling-and-ui.md` | Styling stack, CSS token usage, and shared UI composition rules |
| `docs/development/testing.md` | Current manual verification and build-based testing reality |
| `docs/development/accessibility.md` | Accessibility expectations for forms, navigation, and interactive UI |
| `docs/development/troubleshooting.md` | Current setup and runtime troubleshooting guide |
| `docs/reference/faq.md` | Code-backed answers to recurring developer questions |
| `docs/operations/build-and-release.md` | Current build commands, release evidence, and manual release gates |
| `docs/operations/environments.md` | Current local, staging, and production environment model |
| `docs/operations/deployment.md` | Repo-backed deployment prerequisites, smoke checks, and rollback framing |
| `docs/operations/monitoring-and-logging.md` | Current logging reality, observability signals, and monitoring gaps |
| `docs/operations/performance.md` | Current runtime hotspots and performance review expectations |
| `docs/operations/seo.md` | Current metadata, localization, crawl rules, and SEO gaps |
| `docs/operations/incident-playbook.md` | Current incident triage, critical flow checks, and evidence collection |
| `docs/reference/glossary.md` | Shared technical and product terminology |
| `docs/reference/external-services.md` | External backend, GraphQL, and auth-provider integration summary |
| `docs/reference/decisions.md` | Current architecture decision index, audit records, and ADR links |
| `docs/reference/adr-001-request-helper-consolidation.md` | Proposed consolidation boundary for overlapping request helpers |
| `docs/reference/adr-002-api-base-runtime-boundary.md` | Proposed separation between server and public API base config |
| `docs/reference/adr-003-google-callback-owner.md` | Proposed single-owner rule for Google callback handling |
| `docs/templates/adr-template.md` | Standard ADR template |
| `docs/templates/page-doc-template.md` | Standard page documentation template |
| `docs/templates/feature-doc-template.md` | Standard feature documentation template |
| `docs/implementation-plan.md` | Authoritative documentation roadmap and phase order |
| `docs/ai-session-handoff-prompt.md` | Session continuity prompt for future documentation work |

## Current Source Anchors

These code surfaces currently anchor the foundation docs:

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

## Phase Status

| Phase | Status | Notes |
|---|---|---|
| Phase 1: foundation docs | Complete | Root governance, setup, env, and index docs exist |
| Phase 2: onboarding and templates | Complete | Templates, getting-started docs, and glossary now exist |
| Phase 3: architecture and configuration | Complete | Configuration, architecture, and missing reference owner docs now exist |
| Phase 4: development and operations | Complete | Development docs, `docs/reference/faq.md`, operations docs, and `CHANGELOG.md` now exist |
| Phase 5: audit closure and governance maintenance | Complete | Confirmed-removable files were deleted with backup artifacts and build verification, and the review-required type candidates now have executed keep/remove decisions |

## Planned Documentation Tree

The approved target tree is owned by `docs/implementation-plan.md`. The implementation plan phases are complete through Phase 5, and follow-up work now focuses on ADR formalization plus ongoing maintenance updates when code changes.

## Ownership Rules

- Root docs stay concise and point to deeper owner documents.
- Setup and onboarding facts belong in `docs/getting-started/`.
- Runtime flow and system behavior belong in `docs/architecture/`.
- Configuration and env ownership belong in `docs/configuration/`.
- Engineering rules belong in `docs/development/`.
- Release and runtime procedures belong in `docs/operations/`.
- Shared definitions and templates belong in `docs/reference/` and `docs/templates/`.

## Accuracy Rules

- Every new document must be backed by current code or explicit approved decisions.
- If live code and older plan assumptions disagree, update the docs to match live code and record the discrepancy.
- Prefer linking to the owner document instead of duplicating technical detail across files.
