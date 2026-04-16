<!-- pages/products/category/[slug].vue -->
<template>
    <div>
      <LayoutShop :data="data">
        <template #header>
          <LayoutCategoryHeader
            v-if="categoryInfo"
            :name="categoryInfo.name"
            :breadcrumb="categoryInfo.breadcrumb"
            :total-products="totalProducts"
          />
        </template>
      </LayoutShop>
    </div>
  </template>
  
  <script setup lang="ts">
import type { ProductListCategoryMeta } from '~~/types/product'

  
  const route = useRoute()
  const slug = route.params.slug as string
  
  const { data, pending } = await useProductByCategory(slug)
  
  provide('pending', pending)
  
  // Extract category info separately
  const categoryInfo = computed(():ProductListCategoryMeta | undefined => {
    return data.value?.meta?.category
  })
  
  const totalProducts = computed(():number | undefined  => {
    return data.value?.meta.pagination.total
  })
  

  
  // Update page title
  const { t } = useI18n()
  useHead({
    title: computed(() =>
      categoryInfo.value
        ? `${categoryInfo.value.name} — ${t('product.breadcrumb_shop')}`
        : t('product.breadcrumb_shop')
    ),
  })
  </script>