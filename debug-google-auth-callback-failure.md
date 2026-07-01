# Debug Session: google-auth-callback-failure

- **Status**: [OPEN]
- **Symptom**: Google OAuth callback page `http://demo.justshop.test:3000/en/auth/google/callback?status=success` shows "Failed to complete sign-in. Please try again."
- **Reproduction**: 
  1. Click "Sign in with Google" on storefront.
  2. Complete Google OAuth flow.
  3. Redirected to callback URL with `?status=success`.
  4. Page displays error message instead of successful login.
- **Debug Server**: http://127.0.0.1:7777/event
- **Log File**: `.dbg/trae-debug-log-google-auth-callback-failure.ndjson`

## Hypotheses (to verify with instrumentation)
| ID | Hypothesis | Verification point |
|----|------------|--------------------|
| H1 | The callback route (`/en/auth/google/callback`) is missing or incorrectly configured in Nuxt routing. | Check route definition in `app/pages/` or `server/api/`; capture incoming request path + query params. |
| H2 | Backend OAuth validation fails (invalid state token, missing session, mismatched redirect URI). | Instrument Laravel OAuth callback handler; capture validation errors, session state, user lookup result. |
| H3 | Frontend receives success but fails to set auth cookie or redirect to authenticated page. | Instrument frontend callback page; capture API response, cookie setting attempt, redirect logic. |
| H4 | CORS/Sanctum middleware blocks the callback request due to missing credentials or wrong domain. | Check Laravel request headers, Sanctum stateful domains, session cookie presence. |
| H5 | Database user creation/update fails (duplicate email, missing required fields, validation error). | Capture user upsert attempt, SQL errors, validation messages. |

## Plan
1. **Phase A (instrumentation, NO logic change)**: Add collapsible debug logs at:
   - Frontend callback page (`app/pages/auth/google/callback.vue` or similar).
   - Nitro proxy for backend auth endpoints (`server/api/auth/google/callback.get.ts` or similar).
   - Laravel OAuth callback controller (`app/Http/Controllers/Auth/GoogleAuthController.php` or similar).
   - User repository/action handling OAuth user creation/update.
2. **Phase B (evidence)**: Reproduce the Google login flow, collect logs, confirm/reject hypotheses.
3. **Phase C (minimal fix)**: Based on evidence, apply smallest-scoped fix (route, validation, cookie, DB).
4. **Phase D (verification)**: Re-test, compare pre/post logs, confirm with user before cleanup.

## Files To Inspect (read-only first)
- Frontend: `app/pages/auth/google/callback.vue` (or catch-all `[...slug].vue` handling).
- Nitro proxy: `server/api/auth/google/callback.get.ts` (or similar).
- Backend: `app/Http/Controllers/Auth/GoogleAuthController.php` (or `app/Actions/Auth/HandleGoogleCallbackAction.php`).
- Backend: `app/Repositories/User/UserRepository.php` (or similar).
- Backend: `app/Services/Auth/GoogleAuthService.php` (or similar).

## Safety
- During Steps 1–4: no business-logic edits, only additive `#region debug-point` blocks.
- No `console.log`/`print`; report to Debug Server via HTTP POST.
- Clean up only after user confirms A (Fixed) or D (Abort).