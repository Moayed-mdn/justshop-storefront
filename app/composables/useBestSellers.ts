import type { BestSellerResponse, BestSellerCategory } from '~~/types/homepage';
import { useApi } from '~/composables/useApi';
import { API_ROUTES } from '~~/shared/utils/routes';
import { createTenantCacheKey } from '~/../src/core/cache/createTenantCacheKey';

export const useBestSellers = () => {
  const key = computed(() => createTenantCacheKey('best-sellers'))
  const {
    data: categories,
    pending,
    error,
  } = useAsyncData<BestSellerCategory[]>(
    key,
    async () => {
      const { data } = await useApi<BestSellerResponse>(API_ROUTES.products.bestSeller);
      return data?.data ?? [];
    },
    {
      server: true,
    },
  );

  return {
    categories,
    pending,
    error,
  };
};