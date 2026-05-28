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
const { startCheckout } = useCheckout()
const localePath = useLocalePath()
const cart = useCart()

// ── State ──
const selectedVariant = ref<ProductVariant | null | undefined>(null)
const quantity = ref(1)
const addingToCart = ref(false)

// ── Computed ──
const hasVariants = computed(() => {
  return (props.product?.variants?.length ?? 0) > 0
})

const currentPrice = computed(() => {
  if (selectedVariant.value) {
    return selectedVariant.value.price
  }
  if (props.product?.variants?.[0]) {
    return props.product.variants[0].price
  }
  return 0
})

const priceRange = computed(() => {
  if (!props.product?.variants?.length) {
    return { min: 0, max: 0 }
  }
  const prices = props.product.variants.map((v: any) => v.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
})

const currentImages = computed(() => {
  if (selectedVariant.value?.images?.length) {
    return selectedVariant.value.images
  }
  if (props.product?.variants?.[0]?.images?.length) {
    return props.product.variants[0].images
  }
  return []
})

const maxQuantity = computed(() => {
  if (selectedVariant.value) {
    return Math.min(10, selectedVariant.value.stock || 10)
  }
  return 10
})

const canAddToCart = computed(() => {
  if (!hasVariants.value) {
    return true
  }
  return Boolean(selectedVariant.value && selectedVariant.value.stock > 0)
})

const isInCart = computed(() => {
  if (!props.product) return false
  if (selectedVariant.value) {
    return cart.isInCart(props.product.id, selectedVariant.value.id)
  }
  return false
})

// ── Methods ──
const onVariantChange = (variant: ProductVariant) => {
  selectedVariant.value = variant
  quantity.value = 1
}

const handleAddToCart = async () => {
  if (isInCart.value) {
    return navigateTo(localePath('/cart'))
  }
  if (!canAddToCart.value || !props.product) return
  addingToCart.value = true
  const variantToAdd = selectedVariant.value || props.product.variants?.[0]
  if (!variantToAdd) {
    addingToCart.value = false
    return
  }
  await cart.addToCart({
    product_id: props.product.id,
    product_variant_id: variantToAdd.id,
    name: props.product.name,
    image: (variantToAdd as any).primary_image?.url || currentImages.value[0]?.url || '',
    price: variantToAdd.price,
    quantity: quantity.value,
    max_quantity: variantToAdd.stock,
  })
  addingToCart.value = false
}

const handleBuyNow = async () => {
  await handleAddToCart()
  await startCheckout()
}

// Pre-select default variant
watch(() => props.product, (newProduct) => {
  if (newProduct?.default_variant_id && newProduct.variants?.length) {
    const defaultVar = newProduct.variants.find(
      (v: any) => v.id === newProduct?.default_variant_id
    )
    if (defaultVar) {
      selectedVariant.value = defaultVar
    }
  }
}, { immediate: true })
</script>
