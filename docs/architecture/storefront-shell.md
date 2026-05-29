# Storefront Shell

## Owner

- Shell wrapper: `app/components/shell/StorefrontShell.vue`
- Header: `app/components/shell/StorefrontShellHeader.vue`
- Footer: `app/components/shell/StorefrontShellFooter.vue`
- Visibility model: `app/composables/useStorefrontShell.ts`

## Layouts

| Layout | Shell variant | Use |
|---|---|---|
| `storefront` | `full` | Canonical legacy commerce pages |
| `default` | `full` | Delegates to `StorefrontShell` |
| `auth` | `minimal` | Login/register (topbar hidden, `FooterAuth`) |
| `runtime-*` | `runtime-bridge` | Runtime pages with commerce affordances |

## Behavior

- **Legacy header/footer** (`Header.vue`, `Footer.vue`) remain in the repo; the shared shell reuses their child components.
- **Runtime navigation** from `useStorefrontContext()` renders when payload navigation exists.
- **Commerce affordances** (search, cart, account) are available on runtime-bridge layouts.
- `RuntimeHeader.vue` / `RuntimeFooter.vue` delegate to the shared shell components during migration.

## SSR

Shell visibility uses `provide`/`inject` from the active layout (SSR-safe). Cart and auth UI remain `ClientOnly` where required inside `HeaderActions`.
