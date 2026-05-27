import { useApi } from '~/composables/useApi';
import { API_ROUTES } from '~~/shared/utils/routes';
import type { ProductListResponse } from '~~/types/product';

export const useProduct = () => {
  const { locale } = useI18n();
  const route = useRoute();
  const { filters, syncFromUrl, syncToUrl, apiQuery } = useProductFilters();

  onMounted(syncFromUrl);
  watch(filters, syncToUrl, { deep: true });

  const filterApiQuery = computed(() =>
    Object.entries(apiQuery.value)
      .sort()
      .map(([k, v]) => (v ? `${k}:${v}` : ''))
      .join('|'),
  );

  const key = computed(
    () =>
      `products-data-${locale.value}-${route.query.page ?? 1}-${filterApiQuery.value}`,
  );

  const { data, pending, error } =  useLazyAsyncData<ProductListResponse | null>(
    key, // if you write key.value instead of key, you will need to watch it in the options
    async () => {
      const page = Number(route.query.page ?? 1);

      const finalQuery = {
        ...apiQuery.value,
        page,
      };
      const { data: shopLayout, error: apiError } = await useApi<ProductListResponse>(
        API_ROUTES.products.index,
        {
          query: finalQuery,
          headers: useRequestHeaders(['cookie']),
        },
      );

      if (apiError) {
        throw createError({
          statusCode: 500,
          statusMessage: `Failed to fetch products: ${apiError.message}`,
          fatal: true,
        });
      }

      return shopLayout;
    },
    {
      dedupe: 'cancel',
      default: () => null,
      watch: [
        // key   // you don't need it when you pass a compuedref (not key.value as a static string)
      ],
    },
  );
  return {
    data,
    pending,
    error,
  };
};