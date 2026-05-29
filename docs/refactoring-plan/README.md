# Storefront Runtime Refactoring Plan

## Purpose

This directory contains the planning, execution, rollout, audit, and handoff documents for the storefront runtime transformation program.

Use this folder when you need the runtime-program history for the multi-tenant storefront work. Do not confuse it with `docs/implementation-plan.md`, which is the authoritative roadmap for the broader documentation system.

## Program Hubs

### 1. Storefront Runtime Integration (Complete)
The foundation program that established multi-tenant SSR rendering, runtime contracts, and Laravel-driven page resolution.
- [Execution Plan](file:///home/leader/projects/laravel/tenant/justshop-frontend/docs/refactoring-plan/storefront-runtime-integration-execution-plan.md)
- [Plan Summary](file:///home/leader/projects/laravel/tenant/justshop-frontend/docs/refactoring-plan/PLAN-SUMMARY.md)
- [Phase 8: Operating Guide](file:///home/leader/projects/laravel/tenant/justshop-frontend/docs/refactoring-plan/storefront-runtime-phase-8-operating-guide.md)

### 2. Storefront Commerce Consolidation (Active)
The current program transforming the runtime foundation into a unified, tenant-safe commerce storefront experience.
- [Execution Plan](file:///home/leader/projects/laravel/tenant/justshop-frontend/docs/refactoring-plan/storefront-commerce-consolidation-execution-plan.md)
- [Current Audit](file:///home/leader/projects/laravel/tenant/justshop-frontend/docs/refactoring-plan/audits/storefront-commerce-consolidation-audit.md)

---

## Active Plan Navigation
| Document | Phase | Focus |
|---|---|---|
| [Consolidation Plan](file:///home/leader/projects/laravel/tenant/justshop-frontend/docs/refactoring-plan/storefront-commerce-consolidation-execution-plan.md) | Phase 0 | Guardrails, Canonical Contracts, and Route Consolidation |
| [Runtime Integration](file:///home/leader/projects/laravel/tenant/justshop-frontend/docs/refactoring-plan/storefront-runtime-integration-execution-plan.md) | Phase 8 | Steady-state operations and legacy retirement |


## Archive

Files under `archive/` are earlier concept and master-plan drafts. They remain useful for historical context and architecture intent, but they are superseded by the execution plan and closeout documents in this directory.

| Document | Role |
|---|---|
| `archive/platform-transformation-plan-part-1-foundation.md` | Early platform-foundation vision and architectural rules |
| `archive/platform-transformation-plan-part-2-runtime-architecture.md` | Early runtime architecture and migration target design |
| `archive/platform-transformation-plan-part-3-migration-mapping.md` | Early file-by-file migration mapping |

## Source Of Truth Rules

- Use `storefront-commerce-consolidation-execution-plan.md` for active program sequence and formal phase intent.
- Use `storefront-runtime-integration-execution-plan.md` for historical foundation context.
- Use the Phase 8 documents for steady-state operations and closeout reality.
- Treat `archive/` as historical context, not active implementation authority.
