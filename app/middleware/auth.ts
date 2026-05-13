// middleware/auth.ts
import { authRoutes } from '~/shared/routes';

export default defineNuxtRouteMiddleware(async () => {
  const { isLoggedIn, user, fetchUser } = useAuth()
  const { go } = useAppNavigation()

  // Not logged in at all → redirect
  if (!isLoggedIn.value) {
    return go(authRoutes.login())
  }

  // Logged in but user data missing (edge case: plugin hasn't finished yet)
  if (!user.value) {
    await fetchUser()

    // fetchUser failed (token expired) → clearAuth was called inside → redirect
    if (!isLoggedIn.value) {
      return go(authRoutes.login())
    }
  }
})
