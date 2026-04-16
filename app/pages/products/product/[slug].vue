<template>
  <div class="min-h-screen bg-white">
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
          <div class="prose prose-sm max-w-none text-gray-600">
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
          <div class="space-y-4 pb-6 border-b border-gray-200">
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
            <div v-if="!selectedVariant && hasVariants" class="text-sm text-amber-600">
              {{ $t('product.select_options') }}
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

    <!-- Error State -->
    <div v-else class="max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ $t('product.not_found') }}
      </h1>
      <NuxtLinkLocale to="/products" class="mt-4 inline-block text-[#003D29] hover:underline">
        {{ $t('product.back_to_shop') }}
      </NuxtLinkLocale>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductDetail, ProductVariant } from '~~/types/productDetail'
import type { ProductRelated } from '~~/types/productRelated'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const { fetchProduct, fetchRelatedProducts } = useProductDetail()
const cart = useCart()

// ── State ──
const slug = route.params.slug as string
const product = ref<ProductDetail | null>(null)
const relatedProducts = ref<ProductRelated[]>([])
const pending = ref(true)
const selectedVariant = ref<ProductVariant | null | undefined>(null)
const quantity = ref(1)
const addingToCart = ref(false)

// ── Computed ──
const hasVariants = computed(() => {
  return (product.value?.variants?.length ?? 0) > 0
})

const currentPrice = computed(() => {
  if (selectedVariant.value) {
    return selectedVariant.value.price
  }
  if (product?.value?.variants[0]) {
    return product.value.variants[0].price
  }

  return 0
})

const priceRange = computed(() => {
  if (!product.value?.variants?.length) {
    return { min: 0, max: 0 }
  }
  const prices = product.value.variants.map((v) => v.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
})

const currentImages = computed(() => {
  if (selectedVariant.value?.images?.length) {
    return selectedVariant.value.images
  }
  if (product.value?.variants?.[0]?.images?.length) {
    return product.value.variants[0].images
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
  if (!product.value) return false
  
  if (selectedVariant.value) {
    return cart.isInCart(product.value.id, selectedVariant.value.id)
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

  if (!canAddToCart.value || !product.value) return

  addingToCart.value = true

  const variantToAdd = selectedVariant.value || product.value.variants?.[0]

  if (!variantToAdd) {
    addingToCart.value = false
    return
  }

  await cart.addToCart({
    product_id: product.value.id,
    product_variant_id: variantToAdd.id,
    name: product.value.name,
    image: variantToAdd.primary_image?.url || currentImages.value[0]?.url || '',
    price: variantToAdd.price,
    quantity: quantity.value,
    max_quantity: variantToAdd.stock,
  })

  addingToCart.value = false
}

const handleBuyNow = async () => {
  await handleAddToCart()
  if (isInCart.value) {
    navigateTo(localePath('/checkout'))
  }
}

// ── Load Data ──
onMounted(async () => {
  try {
    const [productData, relatedData] = await Promise.all([
      fetchProduct(slug),
      fetchRelatedProducts(slug),
    ])

    product.value = productData?.data ?? null
    relatedProducts.value = relatedData?.data ?? []

    // Pre-select default variant
    if (product.value?.default_variant_id && product.value.variants?.length) {
      const defaultVar = product.value.variants.find(
        (v) => v.id === product.value?.default_variant_id
      )
      if (defaultVar) {
        selectedVariant.value = defaultVar
      }
    }
  } catch (err) {
    console.error('Failed to load product:', err)
  } finally {
    pending.value = false
  }
})
</script>