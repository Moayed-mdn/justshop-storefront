<template>
  <div class="min-h-screen" :style="{ backgroundColor: 'var(--product-page-bg)' }">
    <!-- Breadcrumb -->
    <ProductBreadcrumb :product-name="product?.name || ''" />

    <!-- Loading -->
    <ProductLoadingSkeleton v-if="pending" />

    <!-- Product Content -->
    <div v-else-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        <!-- Left: Images -->
        <div class="lg:sticky lg:top-4 lg:self-start">
          <ProductImageGallery :images="currentImages" />
        </div>

        <!-- Right: Product Info -->
        <div class="space-y-6">
          <!-- Header -->
          <ProductHeader :product="product" />

          <!-- Price -->
          <ProductPrice 
            :price="currentPrice" 
            :show-price-range="priceRange.min !== priceRange.max" 
          />

          <!-- Description -->
          <div class="prose prose-sm max-w-none" :style="{ color: 'var(--product-desc-text)' }">
            {{ product.description }}
          </div>

          <!-- Variant Selector -->
          <ProductVariantSelector
            v-if="hasVariants"
            :attributes="product.attributes"
            :variants="product.variants"
            @change="onVariantChange"
          />

          <!-- Quantity + Actions -->
          <div class="space-y-4 pb-6 border-b" :style="{ borderBottomColor: 'var(--product-divider)' }">
            <ProductQuantitySelector 
              v-model="quantity"
              :max-quantity="maxQuantity"
            />

            <ProductActionButtons
              :can-add-to-cart="canAddToCart"
              :is-adding-to-cart="addingToCart"
              :is-in-cart="isInCart"
              @add-to-cart="handleAddToCart"
              @buy-now="handleBuyNow"
            />

            <!-- Error Message -->
            <div v-if="!selectedVariant && hasVariants" class="text-sm" :style="{ color: 'var(--product-warning)' }">
              {{ t('product.select_options') }}
            </div>
          </div>

          <!-- Specs -->
          <ProductSpecs :variant="selectedVariant" />

          <!-- Share -->
          <ProductShareButton 
            :title="product.name"
            :description="product.description"
          />
        </div>
      </div>

      <!-- Related Products -->
      <ProductRelatedProducts :products="relatedProducts" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ProductDetail, ProductVariant } from '~/../types/productDetail'
import type { ProductRelated } from '~/../types/productRelated'
import { useCheckout } from '~/composables/useCheckout'
import { useCart } from '~/composables/useCart'
import { useI18n, useLocalePath, navigateTo } from '#imports'

const props = defineProps<{
  product: ProductDetail | null
  relatedProducts: ProductRelated[]
  pending?: boolean
}>()

const { t } = useI18n()
const cart = useCart()

// ── State ──
const {
  selectedVariant,
  quantity,
  addingToCart,
  hasVariants,
  currentPrice,
  priceRange,
  currentImages,
  maxQuantity,
  canAddToCart,
  isInCart,
  handleAddToCart,
  handleBuyNow,
} = useProductCommerce(computed(() => props.product))

// ── Methods ──
const onVariantChange = (variant: ProductVariant) => {
  selectedVariant.value = variant
  quantity.value = 1
}
</script>
