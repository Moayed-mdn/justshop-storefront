import { EXTERNAL_API_ROUTES } from '~~/shared/utils/routes'
import type { RuntimeSystemTemplate, RuntimeTemplateResponse } from '~/src/core/runtime/contracts/types'

export function useSystemTemplate() {
  const api = useApi()

  async function fetchTemplate(type: string): Promise<RuntimeSystemTemplate | null> {
    const { data, error } = await api<RuntimeTemplateResponse>(
      EXTERNAL_API_ROUTES.storefront.runtime.systemTemplate(type)
    )

    if (error || !data?.data) {
      return null
    }

    return data.data
  }

  return {
    fetchTemplate,
  }
}
