<template>
  <div class="md:h-[90vh] bg-white sticky top-0 overflow-y-auto border rounded">
    <!-- Mobile open button -->
    <button
      class="md:hidden p-4 bg-blue-600 text-white w-full"
      @click="isOpen = true"
    >
      {{ t('filter.open') }}
    </button>

    <!-- Sidebar / Drawer -->
    <div
      class="bg-white z-50 md:block md:static fixed inset-0 overflow-y-auto"
      :class="{ hidden: !isOpen, block: isOpen }"
    >
      <!-- Mobile close -->
      <button
        class="md:hidden absolute top-4 right-4 text-xl"
        @click="isOpen = false"
      >
        ✕
      </button>

      <div class="p-4 space-y-6">
        <!-- Categories -->
        <FilterCategoryFilter
          :categories="backendFilters.descendants"
          :selected-slug="filters.categorySlug"
          @select="setCategory"
          @clear="clearCategory"
        />

        <!-- Price -->
        <FilterPriceFilter
          :min="numericMinPrice"
          :max="numericMaxPrice"
          :initial-min="numericInitialMin"
          :initial-max="numericInitialMax"
          @change="onPriceChange"
        />

        <!-- Manufacture -->
        <section>
          <h3 class="font-semibold mb-2">{{ t('filter.manufactured') }}</h3>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in manufactureOptions"
              :key="opt.label"
              :class="buttonClass(opt.value === manufacturePreset)"
              @click="setManufacture(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </section>

        <!-- Expiry -->
        <section>
          <h3 class="font-semibold mb-2">{{ t('filter.expiry') }}</h3>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="opt in expiryOptions"
              :key="opt.label"
              :class="buttonClass(opt.value === expiryPreset)"
              @click="setExpiry(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </section>

        <!-- Reset -->
        <button
          class="w-full border rounded py-2 text-sm hover:bg-gray-100"
          @click="resetFilters"
        >
          {{ t('filter.reset') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { manufactureDateFromPreset, expiryDateFromPreset } from '../../utils/dateFilters'
import type { BackendFilters } from '../../../types/api/product'
import { useProductFilters } from '../../composables/useProductFilters'

const { t } = useI18n()

const props = defineProps<{
  backendFilters: BackendFilters
}>()

const { filters } = useProductFilters()

const isOpen = ref(false)

/* Price helpers for numeric props (backend may send strings like "63.00") */
const numericMinPrice = computed(() => Number(props.backendFilters.min_price))
const numericMaxPrice = computed(() => Number(props.backendFilters.max_price))
const numericInitialMin = computed(
  () => filters.value.minPrice ?? numericMinPrice.value
)
const numericInitialMax = computed(
  () => filters.value.maxPrice ?? numericMaxPrice.value
)

/* Category helpers */
const setCategory = (slug: string) => {
  filters.value.categorySlug = slug
}

const clearCategory = () => {
  filters.value.categorySlug = null
}

/* Price helpers */
const onPriceChange = (range: { min: number; max: number }) => {
  filters.value.minPrice = range.min
  filters.value.maxPrice = range.max
}

/* Date handling */
const manufacturePreset = ref('all')
const expiryPreset = ref('all')

const manufactureOptions = [
  { label: t('filter.all'), value: 'all' },
  { label: t('filter.last_30_days'), value: '30d' },
  { label: t('filter.last_6_months'), value: '6m' },
  { label: t('filter.last_year'), value: '1y' }
]

const expiryOptions = [
  { label: t('filter.all'), value: 'all' },
  { label: t('filter.month'), value: '1m' },
  { label: t('filter.months3'), value: '3m' },
  { label: t('filter.months6'), value: '6m' },
  { label: t('filter.later_year'), value: '12m' }
]

const setManufacture = (preset: string) => {
  manufacturePreset.value = preset
  filters.value.manufactureFrom = manufactureDateFromPreset(preset)
}

const setExpiry = (preset: string) => {
  expiryPreset.value = preset
  filters.value.expiryTo = expiryDateFromPreset(preset)
}

/* Reset */
const resetFilters = () => {
  filters.value.categorySlug = null
  filters.value.minPrice = null
  filters.value.maxPrice = null
  manufacturePreset.value = 'all'
  expiryPreset.value = 'all'
  filters.value.manufactureFrom = manufactureDateFromPreset('all')
  filters.value.expiryTo = expiryDateFromPreset('all')
}

const buttonClass = (isActive: boolean) => {
  return isActive
    ? 'bg-blue-600 text-white rounded px-2 py-1'
    : 'bg-gray-200 rounded px-2 py-1'
}
</script>