import type { BestSellerResponse, BestSellerCategory } from '~~/types/homepage';
import { useApi } from '~/composables/useApi';
import { API_ROUTES } from '~~/shared/utils/routes';

export const useBestSellers = () => {
  const { locale } = useI18n();
  const key = computed(() => `best-seller-${locale.value}`)
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