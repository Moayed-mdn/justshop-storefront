# Page Documentation Template

## Purpose

Use this template when documenting a specific page under the future documentation tree.

Keep examples generic and replace all placeholders before publishing.

## Template

```md
# <Page Name>

## Purpose

Describe the user goal for this page.

## Route

- Route pattern: `<route path>`
- Page file: `app/pages/...`
- Layout: `<layout name or default>`
- Middleware: `<middleware list or none>`

## Code Surfaces

- `app/pages/...`
- `app/components/...`
- `app/composables/...`
- `server/api/...`

## Entry Conditions

- How does a user reach this page?
- Does it require auth, guest-only access, or a query parameter?

## Data Dependencies

| Data source | Client or server | Notes |
|---|---|---|
| `...` | `client` | ... |
| `...` | `server` | ... |

## UI States

- Loading:
- Empty:
- Success:
- Error:

## Actions

| Action | Trigger | Result |
|---|---|---|
| ... | ... | ... |

## Localization

- Translation namespaces:
- Locale-specific routing behavior:

## SEO

- Title behavior:
- Meta description behavior:

## Risks And Edge Cases

- ...

## Related Docs

- `<owner doc>`
- `<adjacent doc>`
```

## Authoring Rules

- Keep the page doc focused on one route family or page.
- Link to the architecture owner docs instead of re-explaining shared systems.
- Name the real page file, layout, middleware, and data entry points.
- Document only behavior visible in current code.
