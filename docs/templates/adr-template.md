# ADR Template

## Purpose

Use this template for architecture decisions recorded under `docs/reference/decisions.md`.

Keep the final ADR project-specific. Replace all placeholders before committing.

## Template

```md
# ADR: <short decision title>

## Status

Proposed | Accepted | Superseded | Rejected

## Date

YYYY-MM-DD

## Context

- What problem or pressure triggered this decision?
- What current code or operational constraint matters?
- Which files, modules, or workflows are affected?

## Decision

- State the chosen approach clearly.
- Name the implementation boundary.
- Name any guardrails or non-goals.

## Alternatives Considered

| Option | Why it was considered | Why it was not chosen |
|---|---|---|
| Option A | ... | ... |
| Option B | ... | ... |

## Consequences

### Benefits

- ...

### Trade-Offs

- ...

### Follow-Up Work

- ...

## Affected Code Surfaces

- `path/to/file`
- `path/to/other-file`

## Documentation Updates Required

- `docs/reference/decisions.md`
- <owner doc to update>

## Verification

- What checks prove the decision is implemented correctly?
- What regression-sensitive areas need review?
```

## Authoring Rules

- Keep ADRs about rationale, not code walkthroughs.
- Reference real files and owner docs.
- Record superseded ADRs instead of deleting them silently.
- Add or update the index entry in `docs/reference/decisions.md` when a new ADR is created.
