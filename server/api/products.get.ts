import { useServerApi } from '../utils/api'
import { EXTERNAL_API_ROUTES } from '../../shared/utils/routes'
import type { ProductApiFilters } from '../../types/api/product'

export default defineEventHandler(async (event) => {
  const tenantId = event.context.tenantId as string
  const rawQuery = getQuery(event)

  const apiFilters: ProductApiFilters = {
    category_slug: rawQuery.category_slug as string | undefined,
    min_price: rawQuery.min_price
      ? Number(rawQuery.min_price as string)
      : undefined,
    max_price: rawQuery.max_price
      ? Number(rawQuery.max_price as string)
      : undefined,
    earliest_manufacture: rawQuery.earliest_manufacture as string | undefined,
    latest_expiry: rawQuery.latest_expiry as string | undefined,
    per_page: rawQuery.per_page
      ? Number(rawQuery.per_page as string)
      : 10,
    page: rawQuery.page ? Number(rawQuery.page as string) : 1
  }

  const api = useServerApi(event)

  const response = await api(EXTERNAL_API_ROUTES.products.index(tenantId), {
    query: apiFilters,
  })

  return response
})