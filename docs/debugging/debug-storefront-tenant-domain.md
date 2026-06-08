# Debug Session: storefront-tenant-domain
- **Status**: [OPEN]
- **Issue**: `http://test.justshop.test:3000/` fails with "The requested tenant could not be resolved from the storefront domain." even though `Store::find(2)` exists with slug `test`.
- **Debug Server**: http://127.0.0.1:7777/event
- **Log File**: `.dbg/trae-debug-log-storefront-tenant-domain.ndjson`

## Reproduction Steps
1. Open `http://test.justshop.test:3000/`.
2. Observe the tenant resolution error in the storefront.
3. Compare the requested host with the backend store/tenant lookup rules.

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | Storefront tenant resolution expects `domain`, but store `2` only has `slug`, so host lookup returns no store. | High | Low | Confirmed |
| B | Frontend host parsing sends a different hostname than `test.justshop.test` to the backend resolver. | High | Medium | Rejected |
| C | Backend tenant-resolution logic reads a different field or normalization rule than expected, such as stripping/keeping port or subdomain incorrectly. | Medium | Medium | Rejected |
| D | Local environment/config is missing a base storefront domain such as `justshop.test`, preventing slug-to-domain derivation. | Medium | Low | Partially confirmed |
| E | Store exists, but an `is_active`/status/provisioning guard excludes it from resolution. | Low | Low | Rejected |

## Log Evidence
- `GET /api/storefront/runtime/resolve` through Nuxt on `Host: test.justshop.test:3000` returns `runtime.tenant_not_found`.
- Debug log `resolver received storefront host` captured `host=test.justshop.test`, `normalized_host=test.justshop.test`, `path=/`.
- Debug log `resolver queried store by domain` captured `normalized_host=test.justshop.test`, `store_found=false`.
- Direct DB bootstrap query:
  - `Store::find(2)` => `id=2`, `slug=test`, `domain=null`, `is_active=true`, `status=active`
  - `where LOWER(domain) = 'test.justshop.test'` => `null`
  - `where slug = 'test'` => store `2`
- Code evidence:
  - `RuntimeStoreResolver::resolveByHost()` matches only `LOWER(domain) = ?`
  - `StoreRepository::create()` persists slug but never sets `domain`
  - `CreateStoreDTO` and `CreateStoreRequest` do not include a domain field
- Local config evidence:
  - Backend `.env` uses `SESSION_DOMAIN=localhost`
  - Backend `.env` `SANCTUM_STATEFUL_DOMAINS` does not include `test.justshop.test:3000`
  - Backend `config/cors.php` allows `demo.justshop.test:3000` but not `test.justshop.test:3000`
  - Frontend/backed rollout defaults mention `demo.justshop.test`, not dynamic `<slug>.justshop.test`

## Verification Conclusion
Root cause is a data + provisioning gap, not a host-forwarding bug. The storefront sends the expected host and Laravel receives it unchanged, but the backend runtime resolver only resolves stores by explicit `stores.domain`. Store `2` is active and has slug `test`, yet its `domain` is `null`, so `test.justshop.test` cannot resolve. The store-creation flow currently omits domain assignment, and local auth/CORS config is still centered on `localhost` / `demo.justshop.test`, which will become the next blocker after tenant resolution is fixed.
