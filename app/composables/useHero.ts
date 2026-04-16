// composables/useHero.ts
import type { HeroBanner, HeroBannerResponse } from '~~/types/homepage';
import { useApi } from '~/composables/useApi';

export const useHero = () => {
  const { locale } = useI18n();
  const key = computed(() => `hero-banners-${locale.value}`)

  const { data, pending, error } = useAsyncData<HeroBanner[]>(
    key,
    async () => {
      const { data } = await useApi<HeroBannerResponse>('/api/hero');
      return data?.data ?? [];
    },
    {
      server: true,
    },
  );

  return { data, pending, error };
};