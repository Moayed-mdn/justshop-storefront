export default defineNuxtRouteMiddleware(async (to) => {
  const { handleGoogleCallback } = useAuth()
  const { showSuccessToast, showErrorToast } = useAppToast()
  const localePath = useLocalePath()

  const token = to.query.token
  const errorParam = to.query.error

  // Handle error from Laravel
  if (errorParam) {
    showErrorToast('Could not sign in with Google.')
    return navigateTo(localePath('/login'), { replace: true })
  }

  // Handle missing token
  if (!token || typeof token !== 'string') {
    showErrorToast('No authentication token received.')
    return navigateTo(localePath('/login'), { replace: true })
  }

  // Process the token
  try {
    await handleGoogleCallback(token)
    showSuccessToast('Signed in with Google successfully.')
    return navigateTo(localePath('/'), { replace: true })
  }
  catch (err) {
    console.error('Google auth error:', err)
    showErrorToast('Could not complete Google sign-in.')
    return navigateTo(localePath('/login'), { replace: true })
  }
})
