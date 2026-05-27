# Feature Documentation Template

## Purpose

Use this template for cross-cutting feature documentation that spans pages, components, composables, stores, plugins, or server routes.

Keep the finished document project-specific and remove every placeholder.

## Template

```md
# <Feature Name>

## Summary

Describe what the feature does and who uses it.

## User Flows

1. <primary flow>
2. <secondary flow>

## Entry Points

- Pages: `app/pages/...`
- Components: `app/components/...`
- Composables: `app/composables/...`
- Stores: `app/stores/...`
- Server routes: `server/api/...`

## Dependencies

| Surface | Purpose |
|---|---|
| `...` | ... |

## State And Persistence

- What state exists?
- Is it persisted?
- Is it client-only, server-only, or both?

## Data Flow

1. Trigger:
2. Request path:
3. Response handling:
4. UI update:

## Error Handling

- Validation errors:
- Network or backend errors:
- Empty states:

## Security And Access

- Auth requirements:
- Sensitive data handling:
- Runtime boundary notes:

## Localization

- Translation files:
- Locale-aware routes or content:

## Verification Checklist

- [ ] Happy path works
- [ ] Error state is handled
- [ ] SSR and client boundaries are respected
- [ ] Docs owner files are updated

## Related Docs

- `<owner doc>`
- `<operational doc>`
```

## Authoring Rules

- Use this for feature-level behavior, not one-off page details.
- Reference real implementation files and runtime boundaries.
- Keep shared rules in the owner docs instead of duplicating them here.
