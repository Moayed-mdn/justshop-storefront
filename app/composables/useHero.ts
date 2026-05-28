// composables/useHero.ts
import type { HeroBanner, HeroBannerResponse } from '~~/types/homepage';
import { useApi } from '~/composables/useApi';
import { API_ROUTES } from '~~/shared/utils/routes';
import { createTenantCacheKey } from '~/../src/core/cache/createTenantCacheKey';

export const useHero = () => {
  const key = computed(() => createTenantCacheKey('hero-banners'))

  const { data, pending, error } = useAsyncData<HeroBanner[]>(
    key,
    async () => {
      const { data } = await useApi<HeroBannerResponse>(API_ROUTES.products.hero);
      return data?.data ?? [];
    },
    {
      server: true,
    },
  );

  return { data, pending, error };
};