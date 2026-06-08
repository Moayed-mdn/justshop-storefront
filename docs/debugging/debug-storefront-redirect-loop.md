# Debug Session: storefront-redirect-loop [CLOSED]

## Symptom
- `demo.justshop.test` redirects too many times in the browser and ends with `ERR_TOO_MANY_REDIRECTS`.

## Scope
- Runtime storefront routing, tenant/domain resolution, i18n normalization, and catch-all page redirects.

## Hypotheses
1. The runtime resolver returns a redirect target that resolves back to the same route.
2. Tenant or host normalization middleware causes a repeated host/path redirect cycle.
3. Catch-all page redirect logic runs on every render because route state is unstable.
4. i18n or slash normalization redirects between equivalent localized URLs.
5. Combined server-side and client-side redirects create a loop.

## Plan
1. Reproduce the loop with HTTP tracing and inspect redirect hops.
2. Instrument the runtime redirect path and relevant middleware/router boundaries.
3. Collect pre-fix logs and confirm the actual loop source.
4. Apply the smallest fix supported by evidence.
5. Verify with post-fix logs and browser-safe reproduction steps.

## Status
- Session closed after route-contract realignment and HTTP verification.

## Evidence
- `curl -I -L http://demo.justshop.test` returns `302 -> /dashboard/` and then `200` from Apache/XAMPP, not Nuxt.
- `curl -k -L https://demo.justshop.test/dashboard/` serves the XAMPP welcome page.
- Direct Nuxt access with `Host: demo.justshop.test` on `http://127.0.0.1:3000/` returns `200` for English and `302 -> /ar -> 200` for Arabic cookie state, with no redirect loop.
- Debug logs in `.dbg/trae-debug-log-storefront-redirect-loop.ndjson` show the catch-all runtime resolves `/` as `matched` with `pageId: home` and no `redirectTo`.
- `/opt/lampp/etc/httpd.conf` has `Include etc/extra/httpd-vhosts.conf` commented out, so Apache falls back to the default XAMPP document root for `demo.justshop.test`.

## Hypothesis Status
1. Runtime resolver self-redirect loop: rejected for `/`.
2. Tenant/host middleware loop in Nuxt: rejected for `/`.
3. Catch-all page redirect branch loop: rejected for `/`.
4. i18n root redirect loop: rejected in direct Nuxt repro.
5. Host routing / Apache default vhost mismatch: confirmed.

## Proposed Fix
1. Enable Apache virtual hosts in `/opt/lampp/etc/httpd.conf`.
2. Add `demo.justshop.test` vhost entries that proxy to `http://127.0.0.1:3000`.
3. Add matching SSL vhost for `:443` if browser access must stay on `https`.
4. Restart XAMPP Apache and verify `demo.justshop.test` now reaches Nuxt instead of `/dashboard/`.

## Additional Evidence (Port 3000 Loop)

- User-confirmed loop persisted on:
  - `http://demo.justshop.test:3000/products/category/electronics`
  - `http://demo.justshop.test:3000/shop/product/oneplus-12`
- Pre-fix log evidence showed a direct loop for product detail traffic:
  - runtime resolve: `/products/oneplus-12` → `/shop/product/oneplus-12`
  - legacy middleware: `/shop/product/oneplus-12` → `/products/oneplus-12`
- Root cause: frontend canonical-route recovery was ahead of the live Laravel resolver. The frontend treated `/products/**` as canonical while the live resolver still canonicalized category and product detail traffic to `/shop/**`.

## Fix Applied

1. Realigned `shared/utils/storefront-routes.ts` with the live resolver:
   - category canonical: `/shop/category/:slug`
   - product canonical: `/shop/product/:slug`
2. Replaced conflicting `/shop/**` legacy redirects with one-way compatibility redirects:
   - `/products/category/:slug` → `/shop/category/:slug`
   - `/products/:slug` → `/shop/product/:slug`
   - `/products/product/:slug` → `/shop/product/:slug`
3. Updated route owner docs and decision records to mark the previous Wave 1 route assumption as superseded by live runtime evidence.

## Post-Fix Verification

- `curl -I -L -H 'Host: demo.justshop.test:3000' http://127.0.0.1:3100/shop/product/oneplus-12`
  now returns `200 OK` with no redirect loop.
- `curl -I -L -H 'Host: demo.justshop.test:3000' http://127.0.0.1:3100/products/oneplus-12`
  now returns exactly one `301` to `/shop/product/oneplus-12`, then `200 OK`.
- `curl -I -L -H 'Host: demo.justshop.test:3000' http://127.0.0.1:3100/products/category/electronics`
  now returns exactly one `301` to `/shop/category/electronics`, then `200 OK`.

## Discrepancy Noted

- The collected debug stream in `.dbg/trae-debug-log-storefront-redirect-loop.ndjson`
  contains the pre-fix loop evidence but does not contain `post-fix` entries.
- The final verification therefore relies on the rebuilt-server HTTP traces above,
  not on a before/after collector-log diff.
