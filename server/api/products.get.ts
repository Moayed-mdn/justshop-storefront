import { $api } from '../../app/utils/api'
import type { ProductApiFilters, ProductQuery } from '../../types/filters'

export default defineEventHandler(async (event) => {
  const rawQuery = getQuery(event)

  const query: ProductQuery = {
    category: rawQuery.category as string | undefined,
    min_price: rawQuery.min_price as string | undefined,
    max_price: rawQuery.max_price as string | undefined,
    earliest_manufacture: rawQuery.earliest_manufacture as string | undefined,
    latest_expiry: rawQuery.latest_expiry as string | undefined,
    per_page: (rawQuery.per_page as string | undefined) ?? '10',
    page: (rawQuery.page as string | undefined) ?? '1'
  }

  const apiFilters: ProductApiFilters = {
    category_slug: query.category,
    min_price: query.min_price ? Number(query.min_price) : undefined,
    max_price: query.max_price ? Number(query.max_price) : undefined,
    earliest_manufacture: query.earliest_manufacture,
    latest_expiry: query.latest_expiry,
    per_page: Number(query.per_page || '10'),
    page: Number(query.page || '1')
  }

  const response = await $api(event, 'products', {
    query: apiFilters
  })

  return response
})
