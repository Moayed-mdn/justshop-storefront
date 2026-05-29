import { EXTERNAL_API_ROUTES } from '~~/shared/utils/routes'
import { useRuntimeServerApi } from '../../../../utils/api'

export default defineEventHandler(async (event) => {
  const api = useRuntimeServerApi(event)
  const body = await readBody(event)

  return await api(EXTERNAL_API_ROUTES.storefront.runtime.previewValidate, {
    method: 'POST',
    body,
  })
})
