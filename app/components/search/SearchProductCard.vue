<!-- app/components/search/SearchProductCard.vue -->

<template>
    <NuxtLinkLocale :to="routes.product(product.slug)" class="group w-full block">
      <!-- Image -->
      <div class="
        bg-(--card-bg-light) rounded-(--radius-md) flex items-center justify-center
        h-(--card-img-height-mobile) lg:h-(--card-img-height-desktop) overflow-hidden
      ">
        <img
          v-if="product.image_url"
          :src="product.image_url"
          :alt="product.name"
          class="max-h-full object-contain transition-transform duration-(--card-transition-speed) group-hover:scale-110"
        />
        <svg
          v-else
          class="w-16 h-16 text-(--gray-400)"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
        </svg>
      </div>
  
      <!-- Info -->
      <div class="flex flex-col px-2 mt-3">
        <!-- Name & Price -->
        <div class="flex justify-between items-start w-full mb-1">
          <h3 class="font-bold text-(--card-title) line-clamp-1 flex-1">{{ product.name }}</h3>
          <span v-if="product.price" class="font-bold text-(--card-title) whitespace-nowrap ms-2">
            ${{ product.price.toFixed(2) }}
          </span>
        </div>
  
        <!-- Rating -->
        <div class="flex items-center gap-1.5 mb-1">
          <div class="flex items-center gap-0.5">
            <span
              v-for="star in 5"
              :key="star"
              class="text-sm leading-none"
              :class="star <= Math.round(product.avg_rating || 0) ? 'text-(--search-star-filled)' : 'text-(--search-star-empty)'"
            >★</span>
          </div>
          <span v-if="product.avg_rating" class="text-xs text-(--color-text-secondary)">
            {{ product.avg_rating }}
          </span>
          <span class="text-xs text-(--color-text-secondary)">
            ({{ product.reviews_count }} {{ $t('search.reviews') }})
          </span>
        </div>
  
        <!-- Meta Labels -->
        <div class="flex flex-wrap gap-1.5 mt-1">
          <span
            v-if="product.category_name"
            class="text-[11px] px-2 py-0.5 rounded-full bg-(--search-badge-category-bg) text-(--search-badge-category-text)"
          >
            {{ product.category_name }}
          </span>
          <span
            v-if="product.brand_name"
            class="text-[11px] px-2 py-0.5 rounded-full bg-(--search-badge-brand-bg) text-(--search-badge-brand-text)"
          >
            {{ product.brand_name }}
          </span>
        </div>
  
        <!-- Description -->
        <p class="text-sm text-(--card-description) line-clamp-2 mt-2">
          {{ product.description }}
        </p>

        <!-- ── Commerce Action ──────────────── -->
        <div class="mt-4">
          <ClientOnly>
            <UiCartButton
              :product-id="Number(product.id)"
              :product-variant-id="Number(product.product_variant_id || product.id)"
              :name="product.name"
              :price="String(product.price)"
              :image="product.image_url"
              :max-quantity="product.max_quantity || undefined"
            />
            <template #fallback>
              <div class="h-10 bg-(--gray-100) rounded-full animate-pulse" />
            </template>
          </ClientOnly>
        </div>
      </div>
    </NuxtLinkLocale>
  </template>
  
  <script setup lang="ts">
  import type { ProductSearchResult } from '~~/types/search'

  const routes = useStorefrontRoutes()
  
  defineProps<{
    product: ProductSearchResult
  }>()
  </script>