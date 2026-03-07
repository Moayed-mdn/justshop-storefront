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
          :selected-slug="categorySlug"
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
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { manufactureDateFromPreset, expiryDateFromPreset } from '../../utils/dateFilters'
import type { BackendFilters, ShopFilters } from '../../../types/filters'

const { t } = useI18n()


const props = defineProps<{
  backendFilters: BackendFilters
}>()

/* Emits */
const emit = defineEmits<{
  (e: 'updateFilters', filters: ShopFilters): void
}>()

const route = useRoute()
const isOpen = ref(false)

/* State (initialized from URL or backend defaults) */
const categorySlug = ref<string | null>((route.query.category as string) || null)
const minPrice = ref<number | null>(route.query.min_price ? Number(route.query.min_price) : null)
const maxPrice = ref<number | null>(route.query.max_price ? Number(route.query.max_price) : null)
const manufactureFrom = ref<string | null>(
  (route.query.earliest_manufacture as string) || null
)
const expiryTo = ref<string | null>((route.query.latest_expiry as string) || null)

/* Price helpers for numeric props (backend may send strings like \"63.00\") */
const numericMinPrice = computed(() => Number(props.backendFilters.min_price))
const numericMaxPrice = computed(() => Number(props.backendFilters.max_price))
const numericInitialMin = computed(() =>
  minPrice.value != null ? minPrice.value : numericMinPrice.value
)
const numericInitialMax = computed(() =>
  maxPrice.value != null ? maxPrice.value : numericMaxPrice.value
)

/* Derived filters */
const filters = computed<ShopFilters>(() => ({
  categorySlug: categorySlug.value,
  minPrice: minPrice.value,
  maxPrice: maxPrice.value,
  manufactureFrom: manufactureFrom.value,
  expiryTo: expiryTo.value
}))

const applyFilters = () => {
  emit('updateFilters', filters.value)
}

/* Category helpers */
const setCategory = (slug: string) => {
  categorySlug.value = slug
}

const clearCategory = () => {
  categorySlug.value = null
}

/* Price helpers */
const onPriceChange = (range: { min: number; max: number }) => {
  minPrice.value = range.min
  maxPrice.value = range.max
  applyFilters()
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
  manufactureFrom.value = manufactureDateFromPreset(preset)
}

const setExpiry = (preset: string) => {
  expiryPreset.value = preset
  expiryTo.value = expiryDateFromPreset(preset)
}

/* Reset */
const resetFilters = () => {
  categorySlug.value = null
  minPrice.value = null
  maxPrice.value = null
  manufacturePreset.value = 'all'
  expiryPreset.value = 'all'
  manufactureFrom.value = manufactureDateFromPreset('all')
  expiryTo.value = expiryDateFromPreset('all')

  applyFilters()
}

const buttonClass = (isActive: boolean) => {
  return isActive
    ? 'bg-blue-600 text-white rounded px-2 py-1'
    : 'bg-gray-200 rounded px-2 py-1'
}

watch(
  () => [filters.value.categorySlug, filters.value.manufactureFrom, filters.value.expiryTo],
  applyFilters,
  { deep: true }
)
</script>