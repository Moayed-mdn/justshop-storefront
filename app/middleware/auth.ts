// middleware/auth.ts
export default defineNuxtRouteMiddleware(async () => {
  const { isLoggedIn, user, fetchUser } = useAuth()
  const sessionCookie = useCookie('ecommerce_session')

  // Rehydrate identity when the server session exists but the store is still empty.
  if (!user.value && sessionCookie.value) {
    await fetchUser()
  }

  if (!isLoggedIn.value) {
    return navigateTo(useStorefrontRoutes().login())
  }
})
