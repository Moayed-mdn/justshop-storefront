# ADR-007: Storefront Runtime Contract-First Boundary

## Status

Implemented

## Context

The storefront catch-all route is currently powered by frontend mocks while Laravel already owns tenant, CMS, and commerce source data. The runtime migration plan requires a contract-first phase before backend and frontend implementation can continue.

## Decision

The storefront runtime migration will use a frozen runtime contract package as the boundary between Laravel and Nuxt.

The contract package includes:

- versioned runtime types
- schema files and example payloads
- API contract documentation
- DTO mapping rules
- cache, logging, SEO, and preview specifications
- a local and CI-ready schema validation command

## Consequences

- Phase 2 backend APIs must serialize to the approved contract shapes instead of exposing raw resources directly.
- Phase 3 frontend runtime wiring must consume the approved DTOs instead of extending the existing mock shapes ad hoc.
- Contract changes now require coordinated doc, schema, example, and validation updates.
