<template>
  <div class="min-h-screen" :style="{ backgroundColor: 'var(--product-page-bg)' }">
    <ProductLoadingSkeleton v-if="!product && pending" />
    <template v-else>
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
          <div class="space-y-8">
            <!-- Header -->
            <ProductHeader :product="product" />

            <!-- Price + Stock -->
            <div class="space-y-3">
              <ProductPrice 
                :price="currentPrice" 
                :show-price-range="priceRange.min !== priceRange.max" 
              />

              <!-- Stock/availability badge -->
              <div v-if="stockLabel" class="flex items-center gap-2">
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                  :class="stockBadgeClass"
                >
                  <span
                    class="inline-block w-1.5 h-1.5 rounded-full"
                    :class="stockDotClass"
                  />
                  {{ stockLabel }}
                </span>
                <span
                  v-if="lowStockCount"
                  class="text-xs font-medium"
                  :class="lowStockClass"
                >
                  {{ t('product.only_x_left', { count: lowStockCount }) }}
                </span>
              </div>
            </div>

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
            <div class="space-y-5 pb-8 border-b" :style="{ borderBottomColor: 'var(--product-divider)' }">
              <ProductQuantitySelector 
                v-model="quantity"
                :max-quantity="maxQuantity"
              />

              <ProductActionButtons
                :can-add-to-cart="canAddToCart"
                :is-adding-to-cart="addingToCart"
                :is-in-cart="isInCart"
                :disabled-reason="disabledReason"
                @add-to-cart="handleAddToCart"
                @buy-now="handleBuyNow"
              />
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

      <!-- Related Products -->
      <ProductRelatedProducts
        v-if="relatedProducts.length > 0"
        :products="relatedProducts"
      />
    </template>

    <!-- Mobile Sticky Add-to-Cart (visible below md breakpoint) -->
    <div
      v-if="product"
      class="fixed bottom-0 left-0 right-0 z-40 border-t bg-white p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg md:hidden"
      :style="{ borderColor: 'var(--product-divider, #e5e7eb)' }"
    >
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-gray-900">{{ product.name }}</p>
          <UiPrice
            :price="currentPrice"
            currency="USD"
            integerClass="text-base font-bold text-(--color-primary)"
          />
        </div>
        <button
          @click="handleAddToCart"
          :disabled="!canAddToCart || addingToCart"
          class="flex-shrink-0 rounded-md bg-(--color-primary) px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-(--green-950) disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          type="button"
        >
          <svg
            v-if="addingToCart"
            class="inline-block h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span v-else-if="isInCart">{{ t('product.view_cart') }}</span>
          <span v-else>{{ t('product.add_to_cart') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from '~/composables/useApi'
import { API_ROUTES } from '~~/shared/utils/routes'
import type { RuntimeSectionComponentProps } from '../types'
import type { ProductDetail, ProductVariant } from '~~/types/productDetail'
import type { ProductRelated } from '~~/types/productRelated'
import type { ProductRelatedResponse } from '~~/types/productRelated'

const props = defineProps<RuntimeSectionComponentProps>()
const { t } = useI18n()
const api = useApi()

const pending = ref(false)

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

const activeVariant = computed(() => {
  if (hasVariants.value && selectedVariant.value) return selectedVariant.value
  if (!hasVariants.value && product.value?.variants?.[0]) return product.value.variants[0]
  return null
})

const stockLabel = computed(() => {
  if (!activeVariant.value) return ''
  if (activeVariant.value.stock > 0) return t('product.in_stock')
  return t('product.out_of_stock')
})

const lowStockCount = computed(() => {
  if (!activeVariant.value) return 0
  if (activeVariant.value.stock > 0 && activeVariant.value.stock <= 5) return activeVariant.value.stock
  return 0
})

const stockBadgeClass = computed(() => {
  if (!activeVariant.value) return 'bg-gray-100 text-gray-500'
  return activeVariant.value.stock > 0
    ? 'bg-green-50 text-green-700'
    : 'bg-red-50 text-red-700'
})

const stockDotClass = computed(() => {
  if (!activeVariant.value) return 'bg-gray-400'
  return activeVariant.value.stock > 0 ? 'bg-green-500' : 'bg-red-500'
})

const lowStockClass = computed(() => {
  return 'text-amber-600'
})

const disabledReason = computed(() => {
  if (hasVariants.value && !selectedVariant.value) {
    return t('product.select_options')
  }
  if (selectedVariant.value && selectedVariant.value.stock <= 0) {
    return t('product.out_of_stock')
  }
  return ''
})

// Related Products — client-side fetch (section is SSR-safe, async data not needed)
const productSlug = computed(() => String(props.data.slug || ''))
const relatedProducts = ref<ProductRelated[]>([])

const fetchRelatedProducts = async () => {
  if (!productSlug.value) return
  try {
    const { data } = await api<ProductRelatedResponse>(
      API_ROUTES.products.related(productSlug.value),
    )
    relatedProducts.value = data?.data ?? []
  } catch {
    // silently fail — related products are non-critical
  }
}

onMounted(() => {
  fetchRelatedProducts()
})

watch(productSlug, () => {
  relatedProducts.value = []
  fetchRelatedProducts()
})
</script>
