import { EXTERNAL_API_ROUTES } from '~~/shared/utils/routes'
import type { RuntimeSectionGroupResponse } from '~/src/core/runtime/contracts/types'

export function useSectionGroups() {
  const api = useApi()

  async function fetchSectionGroups(): Promise<{
    header: RuntimeSectionGroupResponse['data']['header'] | null
    footer: RuntimeSectionGroupResponse['data']['footer'] | null
  }> {
    const { data, error } = await api<RuntimeSectionGroupResponse>(
      EXTERNAL_API_ROUTES.storefront.runtime.sectionGroups
    )

    if (error || !data?.data) {
      return { header: null, footer: null }
    }

    return data.data
  }

  return {
    fetchSectionGroups,
  }
}
