# Storefront Runtime Phase 7 Evidence

## Local verification

- Date: `2026-05-28`
- Frontend repo: `/home/leader/projects/laravel/tenant/justshop-frontend`
- Backend repo: `/home/leader/projects/laravel/tenant/laratenant-backend`
- Scope: local-only verification for Phase 7 rollout controls, rollback behavior, and legacy-route regression

## Commands run

### Backend automated suite

```bash
cd /home/leader/projects/laravel/tenant/laratenant-backend
php artisan test tests/Feature/Storefront/StorefrontRuntimeTest.php tests/Unit/Storefront/RuntimeSupportTest.php tests/Unit/Storefront/RuntimeServicesTest.php
```

Result:

- `26` tests passed
- Included rollout checks for internal allowlist, pilot allowlist, and kill switch

### Frontend production build

```bash
cd /home/leader/projects/laravel/tenant/justshop-frontend
npm run build
```

Result:

- Build passed

### Full-mode SSR smoke

```bash
cd /home/leader/projects/laravel/tenant/laratenant-backend
STOREFRONT_RUNTIME_ROLLOUT_MODE=full STOREFRONT_RUNTIME_KILL_SWITCH=false php artisan serve --host=127.0.0.1 --port=8001

cd /home/leader/projects/laravel/tenant/justshop-frontend
NUXT_API_BASE=http://127.0.0.1:8001/api/v1 \
NUXT_PUBLIC_API_BASE=http://127.0.0.1:8001/api/v1 \
STOREFRONT_RUNTIME_ROLLOUT_MODE=full \
STOREFRONT_RUNTIME_KILL_SWITCH=false \
NUXT_STOREFRONT_RUNTIME_ROLLOUT_MODE=full \
NUXT_STOREFRONT_RUNTIME_KILL_SWITCH=false \
PORT=3100 node .output/server/index.mjs

cd /home/leader/projects/laravel/tenant/justshop-frontend
RUNTIME_VERIFY_HOST=demo.justshop.test RUNTIME_VERIFY_HOSTNAME=127.0.0.1 RUNTIME_VERIFY_PORT=3100 npm run runtime:verify:phase6
```

Result:

- SSR smoke passed for `/`, `/about-us`, `/products/category/electronics`, `/products/running-sneakers`
- Verified runtime shell markers, navigation/footer markers, canonical, JSON-LD, and absence of `legacy-shell`

### Internal-mode rollout smoke

Local tenant keys used:

- allowlisted tenant: `merchant-store`, `demo.justshop.test`
- blocked tenant: `blocked.justshop.test`

```bash
cd /home/leader/projects/laravel/tenant/laratenant-backend
STOREFRONT_RUNTIME_ROLLOUT_MODE=internal \
STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS=merchant-store,demo.justshop.test \
STOREFRONT_RUNTIME_KILL_SWITCH=false \
php artisan serve --host=127.0.0.1 --port=8001

cd /home/leader/projects/laravel/tenant/justshop-frontend
NUXT_API_BASE=http://127.0.0.1:8001/api/v1 \
NUXT_PUBLIC_API_BASE=http://127.0.0.1:8001/api/v1 \
STOREFRONT_RUNTIME_ROLLOUT_MODE=internal \
STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS=merchant-store,demo.justshop.test \
STOREFRONT_RUNTIME_KILL_SWITCH=false \
NUXT_STOREFRONT_RUNTIME_ROLLOUT_MODE=internal \
NUXT_STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS=merchant-store,demo.justshop.test \
NUXT_STOREFRONT_RUNTIME_KILL_SWITCH=false \
PORT=3100 node .output/server/index.mjs

cd /home/leader/projects/laravel/tenant/justshop-frontend
RUNTIME_PHASE7_MODE=internal \
RUNTIME_VERIFY_HOST=demo.justshop.test \
RUNTIME_VERIFY_BLOCKED_HOST=blocked.justshop.test \
RUNTIME_VERIFY_HOSTNAME=127.0.0.1 \
RUNTIME_VERIFY_PORT=3100 \
RUNTIME_VERIFY_API_HOSTNAME=127.0.0.1 \
RUNTIME_VERIFY_API_PORT=8001 \
npm run runtime:verify:phase7
```

Result:

- Allowlisted host returned `200` with runtime markers
- Blocked backend runtime resolve returned `403` with `runtime.rollout_disabled`
- Blocked frontend catch-all returned `404`

### Internal-mode SSR smoke and legacy-route regression

```bash
cd /home/leader/projects/laravel/tenant/laratenant-backend
STOREFRONT_RUNTIME_ROLLOUT_MODE=internal \
STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS=merchant-store,demo.justshop.test \
STOREFRONT_RUNTIME_KILL_SWITCH=false \
php artisan serve --host=127.0.0.1 --port=8002

cd /home/leader/projects/laravel/tenant/justshop-frontend
NUXT_API_BASE=http://127.0.0.1:8002/api/v1 \
NUXT_PUBLIC_API_BASE=http://127.0.0.1:8002/api/v1 \
STOREFRONT_RUNTIME_ROLLOUT_MODE=internal \
STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS=merchant-store,demo.justshop.test \
STOREFRONT_RUNTIME_KILL_SWITCH=false \
NUXT_STOREFRONT_RUNTIME_ROLLOUT_MODE=internal \
NUXT_STOREFRONT_RUNTIME_INTERNAL_TENANT_KEYS=merchant-store,demo.justshop.test \
NUXT_STOREFRONT_RUNTIME_KILL_SWITCH=false \
PORT=3101 node .output/server/index.mjs

cd /home/leader/projects/laravel/tenant/justshop-frontend
RUNTIME_VERIFY_HOST=demo.justshop.test RUNTIME_VERIFY_HOSTNAME=127.0.0.1 RUNTIME_VERIFY_PORT=3101 npm run runtime:verify:phase6

cd /home/leader/projects/laravel/tenant/justshop-frontend
python3 - <<'PY'
import urllib.request
from urllib.error import HTTPError

for path in ['/login', '/cart', '/checkout/cancel', '/profile', '/orders']:
    req = urllib.request.Request(
        f'http://127.0.0.1:3101{path}',
        headers={'Host': 'demo.justshop.test'},
    )
    try:
        with urllib.request.urlopen(req) as res:
            print(path, res.status)
    except HTTPError as exc:
        print(path, exc.code)
PY
```

Result:

- Internal-mode `runtime:verify:phase6` passed for `/`, `/about-us`, `/products/category/electronics`, `/products/running-sneakers`
- Internal-mode legacy routes returned `200` for `/login`, `/cart`, `/checkout/cancel`, `/profile`, `/orders`

### Kill-switch rollback smoke

```bash
cd /home/leader/projects/laravel/tenant/laratenant-backend
STOREFRONT_RUNTIME_ROLLOUT_MODE=full STOREFRONT_RUNTIME_KILL_SWITCH=true php artisan serve --host=127.0.0.1 --port=8001

cd /home/leader/projects/laravel/tenant/justshop-frontend
NUXT_API_BASE=http://127.0.0.1:8001/api/v1 \
NUXT_PUBLIC_API_BASE=http://127.0.0.1:8001/api/v1 \
STOREFRONT_RUNTIME_ROLLOUT_MODE=full \
STOREFRONT_RUNTIME_KILL_SWITCH=true \
NUXT_STOREFRONT_RUNTIME_ROLLOUT_MODE=full \
NUXT_STOREFRONT_RUNTIME_KILL_SWITCH=true \
PORT=3100 node .output/server/index.mjs

cd /home/leader/projects/laravel/tenant/justshop-frontend
RUNTIME_PHASE7_MODE=kill-switch \
RUNTIME_VERIFY_HOST=demo.justshop.test \
RUNTIME_VERIFY_HOSTNAME=127.0.0.1 \
RUNTIME_VERIFY_PORT=3100 \
RUNTIME_VERIFY_API_HOSTNAME=127.0.0.1 \
RUNTIME_VERIFY_API_PORT=8001 \
npm run runtime:verify:phase7
```

Result:

- Backend runtime resolve returned `403` with `runtime.rollout_disabled`
- Frontend catch-all CMS path returned `404`
- Legacy routes stayed available: `/login`, `/cart`, `/checkout/cancel`, `/profile`, `/orders`

### Legacy-route regression smoke in restored full mode

```bash
cd /home/leader/projects/laravel/tenant/justshop-frontend
python3 - <<'PY'
import urllib.request
from urllib.error import HTTPError

for path in ['/login', '/cart', '/checkout/cancel', '/profile', '/orders']:
    req = urllib.request.Request(
        f'http://127.0.0.1:3100{path}',
        headers={'Host': 'demo.justshop.test'},
    )
    try:
        with urllib.request.urlopen(req) as res:
            print(path, res.status)
    except HTTPError as exc:
        print(path, exc.code)
PY
```

Result:

- `/login 200`
- `/cart 200`
- `/checkout/cancel 200`
- `/profile 200`
- `/orders 200`

## Pending / human-owned

- `48h` internal monitoring in a deployed environment
- Pilot merchant UAT and one business-cycle observation
- Production deployment package execution
- `7 consecutive days` of stable production operation
- Formal go/no-go and sign-off from Product, QA, DevOps/SRE, and release owners
