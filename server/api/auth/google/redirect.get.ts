import { EXTERNAL_API_ROUTES } from '~~/shared/utils/routes'
import { buildExternalApiUrl } from '../../../utils/api'

export default defineEventHandler((event) => {
  const configuredTarget = buildExternalApiUrl(event, EXTERNAL_API_ROUTES.auth.googleRedirect)
  const targetUrl = configuredTarget.includes('/v1/users/')
    ? configuredTarget.replace('/v1/users/', '/v1/merchant/')
    : configuredTarget.replace('/v1/', '/v1/merchant/')

  return sendRedirect(event, targetUrl)
})
