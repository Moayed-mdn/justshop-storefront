<template>
    <div v-if="variant" class="space-y-3 text-sm">
      <div v-if="variant.manufacture_date" class="flex justify-between">
        <span class="text-(--color-text-secondary)">{{ $t('product.manufacture_date') }}:</span>
        <span>{{ formatDate(variant.manufacture_date) }}</span>
      </div>
      <div v-if="variant.expiry_date" class="flex justify-between">
        <span class="text-(--color-text-secondary)">{{ $t('product.expiry_date') }}:</span>
        <span>{{ formatDate(variant.expiry_date) }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { formatDate as formatDateUtil } from '../../utils/date'
  import type { ProductVariant } from '~~/types/productDetail'
  
  const props = defineProps<{
    variant: ProductVariant | null | undefined
  }>()
  
  const { locale } = useI18n()
  
  const formatDate = (dateStr: string) =>
    formatDateUtil(dateStr, locale.value, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  </script>