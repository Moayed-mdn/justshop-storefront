// middleware/google-auth.ts
import { authRoutes, commonRoutes } from '~/shared/routes';

export default defineNuxtRouteMiddleware(async (to) => {
  const { handleGoogleCallback } = useAuth()
  const { showSuccessToast, showErrorToast } = useAppToast()
  const { goReplace } = useAppNavigation()

  const token = to.query.token
  const errorParam = to.query.error

  // Handle error from Laravel
  if (errorParam) {
    showErrorToast('Could not sign in with Google.')
    return goReplace(authRoutes.login())
  }

  // Handle missing token
  if (!token || typeof token !== 'string') {
    showErrorToast('No authentication token received.')
    return goReplace(authRoutes.login())
  }

  // Process the token
  try {
    await handleGoogleCallback(token)
    showSuccessToast('Signed in with Google successfully.')
    return goReplace(commonRoutes.home())
  }
  catch (err) {
    console.error('Google auth error:', err)
    showErrorToast('Could not complete Google sign-in.')
    return goReplace(authRoutes.login())
  }
})
