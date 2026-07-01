import { useServerApi } from '../utils/api'
import { transformResponseUrls } from '../utils/transformImageUrls'
import { EXTERNAL_API_ROUTES } from '../../shared/utils/routes'
import type { ProductApiFilters } from '../../types/api/product'

export default defineEventHandler(async (event) => {
  const tenantSlug = event.context.tenantSlug as string
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
    brand_slugs: (rawQuery['brand_slugs[]'] as string[] | undefined)
      ?? (rawQuery.brand_slugs
        ? (Array.isArray(rawQuery.brand_slugs) ? rawQuery.brand_slugs : [rawQuery.brand_slugs])
        : undefined),
    min_rating: rawQuery.min_rating
      ? Number(rawQuery.min_rating as string)
      : undefined,
    per_page: rawQuery.per_page
      ? Number(rawQuery.per_page as string)
      : 10,
    page: rawQuery.page ? Number(rawQuery.page as string) : 1
  }

  const api = useServerApi(event)

  const response = await api(EXTERNAL_API_ROUTES.products.index(tenantSlug), {
    query: apiFilters,
  })

  // Transform all image URLs from backend domain to frontend domain
  return transformResponseUrls(event, response)
})