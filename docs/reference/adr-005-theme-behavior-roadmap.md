# ADR: Theme Behavior Roadmap

## Status

Implemented

## Date

2026-05-27

## Context

- The project has infrastructure for both light and dark themes, including CSS tokens in `app/assets/css/tokens/**`.
- However, the current implementation in `app/composables/useTheme.ts` explicitly forces light mode by overriding any saved preference or system setting with `'light'`.
- This was likely a temporary measure to stabilize the UI, but it leaves the dark mode tokens and theme-toggle logic inactive.

## Decision

- **Restore theme toggle capability**: Remove the hardcoded `'light'` overrides in `useTheme.ts`.
- **Implement system preference detection**: Re-enable the `matchMedia` logic to honor the user's OS-level theme preference when no local override exists.
- **Persist user choice**: Correctly use `localStorage` to remember the user's manual theme selection.
- **Safe SSR hydration**: Ensure the theme is applied correctly during hydration to avoid "flashes" of the wrong theme.

## Alternatives Considered

| Option | Why it was considered | Why it was not chosen |
|---|---|---|
| Stay on light mode only | Simplest approach; reduces UI testing surface. | Ignores existing dark-theme assets and limits accessibility/user preference. |
| Use a 3rd party theme module | Might provide more robust handling. | The project already has a custom implementation that only needs "unblocking." |

## Consequences

### Benefits

- Better user experience by honoring system preferences and manual choices.
- Utilizes existing dark-mode CSS tokens.
- Improves accessibility for users who prefer dark interfaces.

### Trade-Offs

- Requires a UI audit to ensure all components look correct in dark mode.
- Increases the testing surface for styling changes.

### Follow-Up Work

- [x] Refactor `app/composables/useTheme.ts` to remove hardcoded `'light'` values.
- [x] Audit `app/assets/css/main.css` and component-level styles for dark-mode compatibility.
- [x] Verify theme persistence and system preference detection.

## Affected Code Surfaces

- `app/composables/useTheme.ts`
- `app/plugins/theme.client.ts`
- `app/assets/css/tokens/**`

## Documentation Updates Required

- `docs/reference/decisions.md`
- `docs/development/styling-and-ui.md`
- `docs/configuration/plugins.md`

## Verification

- [x] Change system theme to dark; the app should automatically switch to dark mode (if no local preference is set).
- [x] Manually toggle the theme in the app; the choice should persist after a page reload.
- [x] Verify that `document.documentElement` has the correct `data-theme` attribute.
