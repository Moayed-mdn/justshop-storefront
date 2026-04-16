import type { BestSellerResponse, BestSellerCategory } from '~~/types/homepage';
import { useApi } from '~/composables/useApi';

export const useUseBestSellers = () => {
  const { locale } = useI18n();
  const key = computed(() => `best-seller-${locale.value}`)
  const {
    data: categories,
    pending,
    error,
  } = useAsyncData<BestSellerCategory[]>(
    key,
    async () => {
      const { data } = await useApi<BestSellerResponse>('/api/best_seller');
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