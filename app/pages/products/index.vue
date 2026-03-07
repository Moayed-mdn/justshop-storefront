
<template>
  <div>
    <LayoutShop :data="data"  v-if="data" />
  </div>
</template>
  
  
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import type { ProductQuery } from '../../../types/filters'

  const route = useRoute()
  const { locale } = useI18n()

  const query = computed<ProductQuery>(() => {
    const {
      min_price,
      max_price,
      category,
      earliest_manufacture,
      latest_expiry,
      per_page = '10',
      page = '1'
    } = route.query

    return {
      min_price: min_price as string | undefined,
      max_price: max_price as string | undefined,
      category: category as string | undefined,
      earliest_manufacture: earliest_manufacture as string | undefined,
      latest_expiry: latest_expiry as string | undefined,
      per_page: per_page as string,
      page: page as string
    }
  })
    
  
  const { data } = await useAsyncData(
    () => `products-data-${locale.value}`,
    () =>  $fetch('/api/products',{
      query: query.value,
      headers:useRequestHeaders(['cookie'])
    }),
    {
      server:true,
      watch:[query]
    }
   )
  
  </script>