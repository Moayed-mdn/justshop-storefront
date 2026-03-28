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
  import type { CategoryShopLayout } from '~~/types/api/shopLayout'
  
  const route = useRoute()
  const slug = route.params.slug as string
  
  const { data: rawData, pending } = await useProductByCategory(slug)
  
  provide('pending', pending)
  
  // Extract category info separately
  const categoryInfo = computed(() => {
    const raw = rawData.value as CategoryShopLayout | null
    return raw?.category ?? null
  })
  
  const totalProducts = computed(() => {
    const raw = rawData.value as CategoryShopLayout | null
    return raw?.pagination?.total ?? undefined
  })
  
  // Pass to LayoutShop as ShopLayout (compatible shape)
  const data = computed(() => {
    const raw = rawData.value as CategoryShopLayout | null
    if (!raw) return undefined
  
    return {
      data: raw.data,
      pagination: raw.pagination,
      filters: raw.filters,
    }
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