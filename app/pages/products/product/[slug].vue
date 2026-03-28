<!-- pages/products/product/[slug].vue -->
<template>
    <div class="min-h-screen bg-white">
      <!-- Breadcrumb -->
      <div class="bg-gray-50 border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav class="flex items-center gap-2 text-sm text-gray-500">
            <NuxtLinkLocale to="/" class="hover:text-[#003D29]">
              {{ $t('product.breadcrumb_home') }}
            </NuxtLinkLocale>
            <span>/</span>
            <NuxtLinkLocale to="/products" class="hover:text-[#003D29]">
              {{ $t('product.breadcrumb_shop') }}
            </NuxtLinkLocale>
            <span>/</span>
            <span class="text-gray-900 font-medium truncate max-w-[200px]">
              {{ product?.name }}
            </span>
          </nav>
        </div>
      </div>
  
      <!-- Loading -->
      <div v-if="pending" class="max-w-7xl mx-auto px-4 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="aspect-square bg-gray-100 rounded-lg animate-pulse" />
          <div class="space-y-4">
            <div class="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div class="h-6 bg-gray-100 rounded w-1/2 animate-pulse" />
            <div class="h-20 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
  
      <!-- Product Content -->
      <div v-else-if="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
  
          <!-- ═══ Left: Images ═══ -->
          <div class="lg:sticky lg:top-4 lg:self-start">
            <ProductImageGallery :images="currentImages" />
          </div>
  
          <!-- ═══ Right: Product Info ═══ -->
          <div class="space-y-6">
            <!-- Title + Brand/Category -->
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                {{ product.name }}
              </h1>
  
              <div class="flex flex-wrap items-center gap-4 mt-2 text-sm">
                <div v-if="product.brand" class="flex items-center gap-1">
                  <span class="text-gray-500">{{ $t('product.brand') }}:</span>
                  <span class="font-medium text-gray-700">{{ product.brand.name }}</span>
                </div>
  
                <div v-if="product.category" class="flex items-center gap-1">
                  <span class="text-gray-500">{{ $t('product.category') }}:</span>
                  <NuxtLinkLocale
                    :to="`/products/category/${product.category.slug}`"
                    class="font-medium text-[#003D29] hover:underline"
                  >
                    {{ product.category.name }}
                  </NuxtLinkLocale>
                </div>
              </div>
            </div>
  
            <!-- Price -->
            <div>
              <div v-if="priceRange.min !== priceRange.max" class="text-sm text-gray-500">
                {{ $t('product.price_from') }}
              </div>
              <UiPrice
                :price="currentPrice"
                currency="USD"
                integerClass="text-3xl font-bold text-[#003D29]"
              />
            </div>
  
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
  
            <!-- Quantity + Add to Cart -->
            <div class="space-y-4 pb-6 border-b border-gray-200">
              <!-- Quantity Selector -->
              <div class="flex items-center gap-4">
                <label class="text-sm font-medium text-gray-700">
                  {{ $t('product.quantity') }}:
                </label>
                <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    @click="quantity = Math.max(1, quantity - 1)"
                    :disabled="quantity <= 1"
                    class="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
  
                  <input
                    v-model.number="quantity"
                    type="number"
                    min="1"
                    :max="maxQuantity"
                    class="w-16 py-2 text-center border-x border-gray-300 focus:outline-none"
                  >
  
                  <button
                    @click="quantity = Math.min(maxQuantity, quantity + 1)"
                    :disabled="quantity >= maxQuantity"
                    class="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
  
              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-3">
                <button
                  @click="handleAddToCart"
                  :disabled="!canAddToCart || addingToCart"
                  class="flex-1 py-3 px-6 bg-[#003D29] text-white font-semibold rounded-md
                         hover:bg-[#00251C] transition-colors disabled:opacity-50
                         disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg
                    v-if="addingToCart"
                    class="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span v-else-if="isInCart" class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ $t('product.view_cart') }}
                  </span>
                  <span v-else>
                    {{ $t('product.add_to_cart') }}
                  </span>
                </button>
  
                <button
                  @click="handleBuyNow"
                  :disabled="!canAddToCart"
                  class="flex-1 sm:flex-initial py-3 px-6 border-2 border-[#003D29] text-[#003D29]
                         font-semibold rounded-md hover:bg-[#003D29]/5 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {{ $t('product.buy_now') }}
                </button>
              </div>
  
              <!-- Error Message -->
              <div v-if="!selectedVariant && hasVariants" class="text-sm text-amber-600">
                {{ $t('product.select_options') }}
              </div>
            </div>
  
            <!-- Additional Info (Specs) -->
            <div v-if="selectedVariant" class="space-y-3 text-sm">
              <div v-if="selectedVariant.manufacture_date" class="flex justify-between">
                <span class="text-gray-500">{{ $t('product.manufacture_date') }}:</span>
                <span>{{ formatDate(selectedVariant.manufacture_date) }}</span>
              </div>
              <div v-if="selectedVariant.expiry_date" class="flex justify-between">
                <span class="text-gray-500">{{ $t('product.expiry_date') }}:</span>
                <span>{{ formatDate(selectedVariant.expiry_date) }}</span>
              </div>
            </div>
  
            <!-- Share -->
            <div class="flex items-center gap-4 pt-4">
              <button
                @click="handleShare"
                class="flex items-center gap-2 text-sm text-gray-600 hover:text-[#003D29]
                       transition-colors cursor-pointer"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0
                       2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-2.367-2.368m2.367
                       2.368a3 3 0 00-2.367-2.368m0 0a3 3 0 10-4.702
                       0M6.316 10.658a3 3 0 010 2.684" />
                </svg>
                {{ $t('product.share') }}
              </button>
            </div>
          </div>
        </div>
  
        <!-- ═══ Related Products ═══ -->
        <div v-if="relatedProducts?.length" class="mt-16 border-t border-gray-200 pt-12">
          <h2 class="text-xl font-bold text-gray-900 mb-6">
            {{ $t('product.related_products') }}
          </h2>
  
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            <ProductCard
              v-for="related in relatedProducts"
              :key="related.id"
              :product="mapRelatedToCard(related)"
            />
          </div>
        </div>
      </div>
  
      <!-- Error -->
      <div v-else class="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 class="text-2xl font-bold text-gray-900">Product not found</h1>
        <NuxtLinkLocale to="/products" class="mt-4 inline-block text-[#003D29] hover:underline">
          Back to Shop
        </NuxtLinkLocale>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import type { ProductCardDTO } from '~~/types/generated'
  
  const route = useRoute()
  const router = useRouter()
  const { locale, t } = useI18n()
  const { fetchProduct, fetchRelatedProducts } = useProductDetail()
  const cart = useCart()
  const toast = useToast()
  
  // ── State ──
  const slug = route.params.slug as string
  const product = ref<any>(null)
  const relatedProducts = ref<any[]>([])
  const pending = ref(true)
  const selectedVariant = ref<any>(null)
  const quantity = ref(1)
  const addingToCart = ref(false)
  
  // ── Computed ──
  const hasVariants = computed(() => {
    return product.value?.variants?.length > 0
  })
  
  const currentPrice = computed(() => {
    if (selectedVariant.value) {
      return selectedVariant.value.price
    }
    if (product.value?.variants?.length) {
      return product.value.variants[0].price
    }
    return 0
  })
  
  const priceRange = computed(() => {
    if (!product.value?.variants?.length) {
      return { min: 0, max: 0 }
    }
    const prices = product.value.variants.map((v: any) => v.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  })
  
  const currentImages = computed(() => {
    // If variant has images, use them
    if (selectedVariant.value?.images?.length) {
      return selectedVariant.value.images
    }
  
    // Otherwise use first variant's images
    if (product.value?.variants?.[0]?.images?.length) {
      return product.value.variants[0].images
    }
  
    // Fallback: no images
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
      // Simple product without variants
      return true
    }
    // Must have selected variant with stock
    return selectedVariant.value && selectedVariant.value.stock > 0
  })
  
  const isInCart = computed(() => {
    if (!product.value) return false
  
    if (selectedVariant.value) {
      return cart.isInCart(product.value.id, selectedVariant.value.id)
    }
  
    return false
  })
  
  // ── Methods ──
  const onVariantChange = (variant: any) => {
    selectedVariant.value = variant
    quantity.value = 1 // Reset quantity on variant change
  }
  
  const handleAddToCart = async () => {
    if (isInCart.value) {
      // Already in cart — go to cart
      return navigateTo('/cart')
    }
  
    if (!canAddToCart.value) return
  
    addingToCart.value = true
  
    const variantToAdd = selectedVariant.value || product.value.variants?.[0]
  
    if (!variantToAdd) {
      addingToCart.value = false
      return
    }
  
    const result = await cart.addToCart({
      product_id: product.value.id,
      product_variant_id: variantToAdd.id,
      name: product.value.name,
      image: variantToAdd.primary_image?.url || currentImages.value[0]?.url,
      price: variantToAdd.price,
      quantity: quantity.value,
      max_quantity: variantToAdd.stock,
    })
  
    addingToCart.value = false
  
    if (result.success) {
      toast.add({
        title: '',
        description: t('product.added_to_cart'),
        color: 'success',
        icon: 'i-heroicons-check-circle',
      })
    } else {
      toast.add({
        title: '',
        description: result.message,
        color: 'error',
        icon: 'i-heroicons-x-circle',
      })
    }
  }
  
  const handleBuyNow = async () => {
    await handleAddToCart()
    if (isInCart.value) {
      navigateTo('/checkout')
    }
  }
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.value.name,
        text: product.value.description,
        url: window.location.href,
      })
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.add({
        title: '',
        description: t('product.link_copied'),
        color: 'success',
        icon: 'i-heroicons-check-circle',
      })
    }
  }
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale.value, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  
  // Map related product to ProductCard format
  const mapRelatedToCard = (related: any): ProductCardDTO => {
    return {
      product_id: related.id,
      product_variant_id: 0, // Related products don't specify variant
      slug: related.slug,
      category_id: related.category_id,
      primary_image: related.primary_image || '',
      alt_text: related.name,
      product_name: related.name,
      price: String(related.price || 0),
      description: related.description || '',
      total_sold: null,
    }
  }
  
  // ── Load Data ──
  onMounted(async () => {
    try {
      const [productData, relatedData] = await Promise.all([
        fetchProduct(slug),
        fetchRelatedProducts(slug),
      ])
  
      product.value = productData
      relatedProducts.value = relatedData
  
      // Pre-select default variant if specified
      if (product.value.default_variant_id && product.value.variants) {
        const defaultVar = product.value.variants.find(
          (v: any) => v.id === product.value.default_variant_id
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