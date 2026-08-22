// middleware/guest.ts
// Auth rehydration is handled by the app/plugins/01.auth.ts plugin, which runs
// before middleware. This middleware only redirects authenticated users away
// from login/register pages.
export default defineNuxtRouteMiddleware(async () => {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn.value) {
    const localePath = useLocalePath()
    return navigateTo(localePath(useStorefrontRoutes().home()))
  }
})
