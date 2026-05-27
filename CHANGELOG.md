# Changelog

All notable changes that affect application behavior, contributor workflow, or repository operations should be recorded in this file.

This changelog was initialized during the documentation architecture project. Earlier repository history predates this file and has not been reconstructed into versioned release entries, so use `git log` for older commit-level detail until a formal release baseline is established.

## [Unreleased]

### Added

- Added the repository documentation architecture across the root docs and `docs/` owner files, covering onboarding, configuration, architecture, development, operations, templates, glossary, and FAQ content.
- Added release and operations runbooks for build, deployment, environments, monitoring and logging, performance, SEO, and incident response based on the current repo surfaces.
- Added proposed ADRs for architectural cleanup backlog including request-helper consolidation, API base separation, Google callback ownership, orders protection policy, theme restoration, and naming normalization.

### Fixed

- Resolved the `guestLookup(...)` signature mismatch between `useOrders.ts` and `track.vue`.
- Fixed `OrderListResponse` type in `types/order.ts` to correctly represent paginated array data.
- Fixed `handleReorder` error handling in `orders/index.vue` to prevent crashes when result data is missing.

### Changed

- Implemented ADR-002: Separated public vs server API base in `runtimeConfig` and updated `.env.example`.
- Implemented ADR-003: Consolidated Google callback handling into `auth/google/callback.vue` and removed redundant `google-auth.ts` middleware.
- Implemented ADR-004: Enabled `auth` middleware for the main orders index page.
- Implemented ADR-005: Restored theme behavior by removing hardcoded light-mode overrides in `useTheme.ts`.
- Implemented ADR-006: Normalized component directory casing (`Product` -> `product`) and removed redundant `useUse*` prefixes from composables.
- Updated the documentation hub in `docs/index.md` to track the created documentation set and current implementation-plan progress.
- Backfilled `docs/reference/external-services.md` and `docs/reference/decisions.md` so the approved documentation tree now matches the implementation-plan sequence through Phase 4.
- Recorded the Phase 5 audit-closure baseline, review-required keep decisions, and governance maintenance cadence in the current docs and repository rules.
- Tightened Phase 5 closure wording in the docs hub and decision index so they reflect the completed cleanup batch instead of describing it as in progress.

### Removed

- Deleted the confirmed-removable debug artifacts, IDE metadata files, snapshot and helper artifacts, orphaned icon placeholders, unreferenced logo variants, and the unused experimental `app/composables/test.ts` helper after creating backup branch and archive safeguards.
- Removed the duplicate `app/types/ofetch.d.ts` declaration plus the unreferenced `types/filters.d.ts` and `types/generated.d.ts` files after validating the canonical root type owner and running cleanup verification.
