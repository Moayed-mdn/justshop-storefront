<template>
  <div class="flex gap-4 p-4 sm:p-6">
    <!-- Image -->
    <NuxtLinkLocale
      :to="productLink"
      class="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-(--color-bg-secondary)"
    >
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.product_name"
        class="w-full h-full object-contain"
      >
    </NuxtLinkLocale>

    <!-- Details -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2">
        <div>
          <NuxtLinkLocale
            :to="productLink"
            class="text-sm font-semibold text-(--color-text-primary) hover:text-(--color-primary) transition-colors"
          >
            {{ item.product_name }}
          </NuxtLinkLocale>

          <!-- Attributes -->
          <div v-if="item.attributes?.length" class="flex flex-wrap gap-x-3 mt-1">
            <span
              v-for="attr in item.attributes"
              :key="attr.name"
              class="text-xs text-(--color-text-secondary)"
            >
              <span class="font-medium">{{ attr.name }}:</span> {{ attr.value }}
            </span>
          </div>

          <p v-if="item.sku" class="text-xs text-(--color-text-tertiary) mt-1">SKU: {{ item.sku }}</p>

          <!-- Availability badge -->
          <span
            v-if="!item.is_available"
            class="inline-block mt-1 px-2 py-0.5 text-xs bg-(--color-error-bg) text-(--color-error-text) rounded"
          >
            {{ $t('orders.item_unavailable') }}
          </span>
        </div>

        <div class="text-right shrink-0">
          <p class="text-sm font-bold text-(--color-text-primary)">{{ formatPrice(item.subtotal) }}</p>
          <p class="text-xs text-(--color-text-secondary)">
            {{ formatPrice(item.unit_price) }} × {{ item.quantity }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderItem } from '~~/types/order'

const props = defineProps<{
  item: OrderItem
  formatPrice: (price: number) => string
}>()

const routes = useStorefrontRoutes()

const productLink = computed(() =>
  props.item.product_slug ? routes.product(props.item.product_slug) : '#',
)
</script>
