// middleware/guest.ts
import { commonRoutes } from '~/shared/routes';

export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAuth()
  const { go } = useAppNavigation()

  if (isLoggedIn.value) {
    return go(commonRoutes.home())
  }
})
