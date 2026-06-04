<template>
    <div class="space-y-6" data-testid="product-variant-selector">
      <!-- Attribute Selectors -->
      <div
        v-for="(values, attrName) in attributes"
        :key="attrName"
        class="space-y-2"
      >
        <label class="block text-sm font-medium text-gray-700">
          {{ attrName }}
        </label>
  
        <div class="flex flex-wrap gap-2">
          <button
            v-for="value in values"
            :key="value"
            data-testid="product-variant-option"
            @click="selectAttribute(attrName as string, value)"
            :disabled="!isValueAvailable(attrName as string, value)"
            class="px-4 py-2 border-2 rounded-md text-sm font-medium transition-all cursor-pointer"
            :class="getButtonClass(attrName as string, value)"
          >
            {{ value }}
          </button>
        </div>
      </div>
  
      <!-- Variant Info -->
      <div v-if="selectedVariant" class="space-y-2 text-sm">
        <div v-if="selectedVariant.sku" class="flex items-center gap-2" data-testid="product-sku">
          <span class="text-gray-500">{{ $t('product.sku') }}:</span>
          <span class="font-mono">{{ selectedVariant.sku }}</span>
        </div>
  
        <div class="flex items-center gap-2" data-testid="product-stock-status">
          <span
            v-if="selectedVariant.stock > 0"
            class="text-green-600 font-medium"
          >
            {{ $t('product.in_stock') }}
          </span>
          <span
            v-else
            class="text-red-600 font-medium"
          >
            {{ $t('product.out_of_stock') }}
          </span>
  
          <span
            v-if="selectedVariant.stock > 0 && selectedVariant.stock <= 5"
            class="text-amber-600 text-xs"
            data-testid="product-stock-warning"
          >
            ({{ $t('product.only_x_left', { count: selectedVariant.stock }) }})
          </span>
        </div>
      </div>
  
      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md"
        data-testid="product-variant-error"
      >
        {{ errorMessage }}
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
import type { ProductVariant } from '~~/types/productDetail';

  const props = defineProps<{
    attributes: Record<string, string[]>
    variants:ProductVariant[]
  }>()
  
  const emit = defineEmits<{
    (e: 'change', variant: any | null): void
  }>()
  
  const { t } = useI18n()
  
  const selectedAttributes = ref<Record<string, string>>({})
  const errorMessage = ref<string | null>(null)
  
  // Find matching variant based on selected attributes
  const selectedVariant = computed(() => {
    const attrCount = Object.keys(props.attributes).length
    const selectedCount = Object.keys(selectedAttributes.value).length
  
    if (selectedCount !== attrCount) {
      return null
    }
  
    return props.variants.find(v =>
      v.is_active &&
      Object.entries(selectedAttributes.value).every(
        ([key, val]) => v.attribute_map[key] === val
      )
    )
  })
  
  // Check if a value is available (has at least one active variant)
  const isValueAvailable = (attrName: string, value: string) => {
    return props.variants.some(v =>
      v.is_active &&
      v.stock > 0 &&
      v.attribute_map[attrName] === value
    )
  }
  
  // Get button styling based on state
  const getButtonClass = (attrName: string, value: string) => {
    const isSelected = selectedAttributes.value[attrName] === value
    const isAvailable = isValueAvailable(attrName, value)
  
    if (!isAvailable) {
      return 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
    }
  
    if (isSelected) {
      return 'border-(--color-primary) bg-(--color-primary) text-white'
    }
  
    return 'border-gray-300 text-gray-700 hover:border-(--color-primary)'
  }
  
  // Handle attribute selection
  const selectAttribute = (attrName: string, value: string) => {
    if (!isValueAvailable(attrName, value)) {
      return
    }
  
    selectedAttributes.value = {
      ...selectedAttributes.value,
      [attrName]: value,
    }
  
    errorMessage.value = null
  }
  
  // Pre-select default variant
  const preselectDefault = () => {
    // Try to find the first available variant
    const defaultVariant = props.variants.find(v => v.is_active && v.stock > 0)
  
    if (defaultVariant) {
      selectedAttributes.value = { ...defaultVariant.attribute_map }
    }
  }
  
  // Emit changes
  watch(selectedVariant, (newVariant) => {
    if (newVariant && !newVariant.is_active) {
      errorMessage.value = t('product.variant_unavailable')
      emit('change', null)
    } else if (newVariant && newVariant.stock === 0) {
      errorMessage.value = t('product.out_of_stock')
      emit('change', null)
    } else {
      errorMessage.value = null
      emit('change', newVariant)
    }
  })
  
  onMounted(() => {
    preselectDefault()
  })
  </script>