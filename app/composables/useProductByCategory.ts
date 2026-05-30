// composables/useProductByCategory.ts
import type { ProductListResponse } from '~~/types/product';
import { useApi } from '~/composables/useApi';
import { API_ROUTES } from '~~/shared/utils/routes';

export const useProductByCategory = async (categorySlug: string) => {
  const { locale } = useI18n();
  const route = useRoute();
  const { filters, syncFromUrl, syncToUrl, apiQuery } = useProductFilters();
  const api = useApi();
  
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
      `category-products-${categorySlug}-${locale.value}-${
        route.query.page ?? 1
      }-${filterApiQuery.value}`,
  );

  const { data, pending } = useLazyAsyncData<ProductListResponse | null>(
    key,
    async () => {
      const page = Number(route.query.page ?? 1);
      const finalQuery = {
        ...apiQuery.value,
        page,
        per_page: 15,
      };

      const { data } = await api<ProductListResponse>(
        API_ROUTES.products.category(categorySlug),
        {
          query: finalQuery,
        },
      );
      return data;
    },
    {
      dedupe: 'cancel',
      default: () => null,
    },
  );

  return { data, pending };
};