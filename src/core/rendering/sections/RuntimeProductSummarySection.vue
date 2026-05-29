<template>
  <div class="min-h-screen" :style="{ backgroundColor: 'var(--product-page-bg)' }">
    <!-- Breadcrumb -->
    <ProductBreadcrumb :product-name="product?.name || ''" />

    <!-- Product Content -->
    <div v-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RuntimeSectionComponentProps } from '../types'
import type { ProductDetail, ProductVariant } from '~~/types/productDetail'

const props = defineProps<RuntimeSectionComponentProps>()
const { t } = useI18n()

const product = computed<ProductDetail | null>(() => {
  if (!props.data.productId) return null
  
  return {
    id: Number(props.data.productId),
    name: String(props.data.name || ''),
    slug: String(props.data.slug || ''),
    description: String(props.data.description || ''),
    default_variant_id: Number(props.data.productVariantId || 0),
    category: {
      id: 0,
      name: '',
      slug: '',
    },
    brand: {
      id: 0,
      name: String(props.data.brand_name || ''),
    },
    attributes: (props.data.attributes as Record<string, string[]>) || {},
    variants: (props.data.variants as any[])?.map(v => ({
        ...v,
        images: v.images || [],
        primary_image: v.images?.[0] || null
    })) || [],
  } as ProductDetail
})

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
} = useProductCommerce(product)

const onVariantChange = (variant: ProductVariant) => {
  selectedVariant.value = variant
  quantity.value = 1
}
</script>
