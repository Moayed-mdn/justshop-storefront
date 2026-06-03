<template>
  <component :is="layoutComponent">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RuntimeLayout from '../../../app/layouts/runtime.vue'
import CatalogLayout from '../../../app/layouts/catalog.vue'
import MarketingLayout from '../../../app/layouts/marketing.vue'
import ProductLayout from '../../../app/layouts/product.vue'

const props = defineProps<{
  layout?: string
}>()

const layoutComponent = computed(() => {
  switch (props.layout) {
    case 'catalog':
      return CatalogLayout
    case 'marketing':
      return MarketingLayout
    case 'product':
      return ProductLayout
    default:
      return RuntimeLayout
  }
})
</script>
