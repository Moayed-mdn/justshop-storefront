// middleware/auth.ts
// Auth rehydration is handled by the app/plugins/01.auth.ts plugin, which runs
// before middleware on every page load (including SSR). On client-side navigation
// the Pinia store retains user data from SSR, so a redundant fetchUser() call here
// is unnecessary. This middleware only guards protected routes.
export default defineNuxtRouteMiddleware(async () => {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn.value) {
    const localePath = useLocalePath()
    return navigateTo(localePath(useStorefrontRoutes().login()))
  }
})
