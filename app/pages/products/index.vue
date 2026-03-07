
<template>
  <div>
    <LayoutShop :data="data" v-if="data" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n' 
import { useProductFilters } from '~/composables/useProductFilters'

const { locale } = useI18n()
const route = useRoute()
const { filters, syncFromUrl, syncToUrl, apiQuery } = useProductFilters()

onMounted(syncFromUrl)

watch(filters, syncToUrl, { deep: true })

const { data } = await useAsyncData(
  () => `products-data-${locale.value}-${route.query.page ?? 1}`,
  () =>
    $fetch('/api/products', {
      query: {
        ...apiQuery.value,
        page: route.query.page ? Number(route.query.page as string) : 1
      },
      headers: useRequestHeaders(['cookie'])
    }),
  {
    server: true,
    watch: [apiQuery, () => route.query.page]
  }
)
</script>