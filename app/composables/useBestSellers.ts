import type { BestSellerDTO } from '~~/types/generated';
export const useUseBestSellers = () => {


  const { locale } = useI18n();

  const { data : categories , pending , error } =  useLazyAsyncData(
          `best-seller-${locale.value}`,
          ()=> $fetch<ApiResponse<BestSellerDTO[]>>('/api/best_seller',{
              headers:useRequestHeaders(['cookie'])
          }),
          {
              server:true,
              transform:(res)=> res.data,
          }
  )

  return {
        categories,
        pending,
        error,
  }
}
