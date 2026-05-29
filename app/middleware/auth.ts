// middleware/auth.ts
export default defineNuxtRouteMiddleware(async () => {
  const { isLoggedIn, user, fetchUser } = useAuth()

  // Not logged in at all → redirect
  if (!isLoggedIn.value) {
    return navigateTo(useStorefrontRoutes().login())
  }

  // Logged in but user data missing (edge case: plugin hasn't finished yet)
  if (!user.value) {
    await fetchUser()

    // fetchUser failed (token expired) → clearAuth was called inside → redirect
    if (!isLoggedIn.value) {
      return navigateTo(useStorefrontRoutes().login())
    }
  }
})