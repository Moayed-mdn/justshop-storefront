<!-- app/components/filter/FilterBody.vue -->
<template>
  <div>
    <!-- Mobile close -->
    <button
      class="md:hidden absolute top-(--space-4) right-(--space-4) text-(--text-xl)"
      @click="emit('close')"
    >
      ✕
    </button>

    <div class="p-(--filter-sidebar-padding) space-y-(--filter-sidebar-gap)">
      <!-- Categories -->
      <CategoryFilter
        v-if="backendFilters?.descendants?.length"
        :categories="backendFilters.descendants"
        :selected-slug="filters.categorySlug"
        @select="setCategory"
        @clear="clearCategory"
      />

      <!-- Price -->
      <div>
        <h3 class="font-semibold mb-2">{{ t('filter.price') }}</h3>
        <USlider
          v-model="priceRange"
          :ui="{
            range: 'bg-[var(--color-accent)]',
            thumb: 'bg-[var(--color-accent)] ring-[var(--color-accent)] focus-visible:outline-[var(--color-accent)]/50 shadow-lg shadow-[var(--color-accent)]/50',
            track: 'bg-[var(--color-accent)]/20',
          }"
          :min="numericMinPrice"
          :max="numericMaxPrice"
          :step="1"
          @change="onPriceChange"
          range
        />
        <div class="flex justify-between mt-2 text-sm">
          <span>{{ displayLeft }}</span>
          <span>{{ displayRight }}</span>
        </div>
      </div>

      <!-- Manufacture -->
      <FilterDateSection
        :title="t('filter.manufactured')"
        :options="manufactureOptions"
        v-model="manufacturePreset"
      />

      <!-- Expiry -->
      <FilterDateSection
        :title="t('filter.expiry')"
        :options="expiryOptions"
        v-model="expiryPreset"
      />

      <!-- Reset -->
      <button
        class="w-full border rounded py-(--filter-button-padding-y) text-(--filter-clear-size) hover:bg-(--filter-button-hover-bg)"
        @click="resetFilters"
      >
        {{ t('filter.reset') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { manufactureDateFromPreset, expiryDateFromPreset } from '../../utils/dateFilters'
import type { UIProductListFilters } from '../../../types/api/product'
import type { ProductListFilters } from '~~/types/product';

const { t } = useI18n()
const { locale } = useI18n()
const isRtl = computed(() => locale.value === 'ar')

const props = defineProps<{
  backendFilters: ProductListFilters | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const FiltersData = computed(() => mapToUIFilters(props.backendFilters));

// ✅ Everything comes from the composable now — no local filter state
const {
  filters,
  manufacturePreset,
  expiryPreset,
  resetFilters
} = useProductFilters()

/* Price helpers */
const numericMinPrice = computed(() => Number(FiltersData.value.min_price))
const numericMaxPrice = computed(() => Number(FiltersData.value.max_price))
const numericInitialMin = computed(
  () => filters.value.minPrice ?? numericMinPrice.value
)
const numericInitialMax = computed(
  () => filters.value.maxPrice ?? numericMaxPrice.value
)

// ✅ RTL Fix: Keep internal values always in logical order (min, max)
// Only reverse the visual display in RTL
const priceRange = ref<[number, number]>([
  numericInitialMin.value,
  numericInitialMax.value
])

// Display values - swap positions in RTL for visual correctness
const displayLeft = computed(() => isRtl.value ? priceRange.value[1] : priceRange.value[0])
const displayRight = computed(() => isRtl.value ? priceRange.value[0] : priceRange.value[1])

const onPriceChange = () => {
  // Slider always gives us [left_value, right_value]
  // Store them as min/max (already in correct order in LTR and RTL)
  const [left, right] = priceRange.value
  
  // Always ensure min < max
  filters.value.minPrice = Math.min(left, right)
  filters.value.maxPrice = Math.max(left, right)
}

// ✅ This watcher syncs priceRange when resetFilters() clears minPrice/maxPrice
watch(
  () => [filters.value.minPrice, filters.value.maxPrice],
  ([min, max]) => {
    const newMin = min ?? numericMinPrice.value
    const newMax = max ?? numericMaxPrice.value
    
    // Always keep internal values in logical order (min, max)
    priceRange.value = [newMin, newMax]
  }
)

// Watch locale changes - no need to reverse, just keep logical order
watch(locale, () => {
  const currentMin = filters.value.minPrice ?? numericMinPrice.value
  const currentMax = filters.value.maxPrice ?? numericMaxPrice.value
  
  // Keep values in logical order, display will handle RTL
  priceRange.value = [currentMin, currentMax]
})

/* Category helpers */
const setCategory = (slug: string) => {
  filters.value.categorySlug = slug
}
const clearCategory = () => {
  filters.value.categorySlug = null
}

/* Date watchers */
watch(manufacturePreset, (preset) => {
  filters.value.manufactureFrom = manufactureDateFromPreset(preset)
})
watch(expiryPreset, (preset) => {
  filters.value.expiryTo = expiryDateFromPreset(preset)
})

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
</script>