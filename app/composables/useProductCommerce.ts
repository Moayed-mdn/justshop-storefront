import { ref, computed, watch, type Ref } from 'vue'
import type { ProductDetail, ProductVariant } from '~~/types/productDetail'
import { useCart } from './useCart'
import { useCheckout } from './useCheckout'
import { useStorefrontRoutes } from './useStorefrontRoutes'
import { useI18n } from 'vue-i18n'

export function useProductCommerce(product: Ref<ProductDetail | null>) {
  const cart = useCart()
  const { startCheckout } = useCheckout()
  const { t } = useI18n()

  const selectedVariant = ref<ProductVariant | null>(null)
  const quantity = ref(1)
  const addingToCart = ref(false)

  const hasVariants = computed(() => {
    return (product.value?.variants?.length ?? 0) > 0
  })

  const currentPrice = computed(() => {
    if (selectedVariant.value) {
      return selectedVariant.value.price
    }
    if (product.value?.variants?.[0]) {
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
    if (selectedVariant.value?.images?.length) {
      return selectedVariant.value.images
    }
    if (product.value?.variants?.[0]?.images?.length) {
      return product.value.variants[0].images
    }
    return product.value?.variants?.[0]?.images || []
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

  const handleAddToCart = async () => {
    if (isInCart.value) {
      return navigateTo(useStorefrontRoutes().cart())
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
  watch(product, (newProduct) => {
    if (newProduct?.default_variant_id && newProduct.variants?.length) {
      const defaultVar = newProduct.variants.find(
        (v: any) => v.id === newProduct?.default_variant_id
      )
      if (defaultVar) {
        selectedVariant.value = defaultVar
      }
    } else if (newProduct?.variants?.[0]) {
        selectedVariant.value = newProduct.variants[0]
    }
  }, { immediate: true })

  return {
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
  }
}
