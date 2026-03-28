import type { HeroBannerDTO } from '~~/types/generated'

export const useUseHero = () => {
  const { locale } = useI18n()
  const { data, pending, error } =  useLazyAsyncData(
    `hero-data-${locale.value}`,
    // Type the $fetch return, Nuxt does the rest!
    () => $fetch<ApiResponse<HeroBannerDTO[]>>('/api/hero',{
      headers:useRequestHeaders(['cookie']) 
    }), 
    {
      server: true,
      watch: [locale],
      transform: (res) => res.data 
    },
  )


  return {
    data,
    pending,
    error
  }
}
