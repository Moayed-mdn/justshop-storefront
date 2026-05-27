import { EXTERNAL_API_ROUTES } from '~~/shared/utils/routes'
import { buildExternalApiUrl } from '../../../utils/api'

export default defineEventHandler((event) => {
  const targetUrl = buildExternalApiUrl(event, EXTERNAL_API_ROUTES.auth.googleRedirect)

  return sendRedirect(event, targetUrl)
})
