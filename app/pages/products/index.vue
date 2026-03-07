
<template>
  <div>
    <LayoutShop :data="data" v-if="data" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductFilters } from '../../composables/useProductFilters'

const { locale } = useI18n()
const { filters, syncFromUrl, syncToUrl, apiQuery } = useProductFilters()

onMounted(syncFromUrl)

watch(filters, syncToUrl, { deep: true })

const { data } = await useAsyncData(
  () => `products-data-${locale.value}`,
  () =>
    $fetch('/api/products', {
      query: apiQuery.value,
      headers: useRequestHeaders(['cookie'])
    }),
  {
    server: true,
    watch: [apiQuery]
  }
)
</script>