<template>
  <component :is="layoutComponent">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import RuntimeCatalogLayout from '../../../app/layouts/catalog.vue'
import RuntimeMarketingLayout from '../../../app/layouts/marketing.vue'
import RuntimeProductLayout from '../../../app/layouts/product.vue'
import RuntimeDefaultLayout from '../../../app/layouts/runtime-default.vue'

const props = defineProps<{
  layout?: string
}>()

type RuntimeLayoutName = 'default' | 'marketing' | 'catalog' | 'product'

const supportedLayouts = new Set<RuntimeLayoutName>([
  'default',
  'marketing',
  'catalog',
  'product',
])

const layoutName = computed<RuntimeLayoutName>(() => {
  const requestedLayout = props.layout || 'default'

  return (supportedLayouts.has(requestedLayout as RuntimeLayoutName)
    ? requestedLayout
    : 'default') as RuntimeLayoutName
})

const layoutComponent = computed(() => {
  switch (layoutName.value) {
    case 'marketing':
      return RuntimeMarketingLayout
    case 'catalog':
      return RuntimeCatalogLayout
    case 'product':
      return RuntimeProductLayout
    default:
      return RuntimeDefaultLayout
  }
})
</script>
