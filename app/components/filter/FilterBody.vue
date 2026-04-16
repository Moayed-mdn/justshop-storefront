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
      <FilterCategoryFilter
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
          <span>{{ priceRange[0] }}</span>
          <span>{{ priceRange[1] }}</span>
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

const props = defineProps<{
  backendFilters: ProductListFilters /// ProductListFilters
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const FiltersData = mapToUIFilters(props.backendFilters);

// ✅ Everything comes from the composable now — no local filter state
const {
  filters,
  manufacturePreset,
  expiryPreset,
  resetFilters
} = useProductFilters()

/* Price helpers */
const numericMinPrice = computed(() => Number(FiltersData.min_price))
const numericMaxPrice = computed(() => Number(FiltersData.max_price))
const numericInitialMin = computed(
  () => filters.value.minPrice ?? numericMinPrice.value
)
const numericInitialMax = computed(
  () => filters.value.maxPrice ?? numericMaxPrice.value
)

const priceRange = ref<[number, number]>([
  numericInitialMin.value,
  numericInitialMax.value
])

const onPriceChange = () => {
  const [min, max] = priceRange.value
  filters.value.minPrice = min
  filters.value.maxPrice = max
}

// ✅ This watcher syncs priceRange when resetFilters() clears minPrice/maxPrice
watch(
  () => [filters.value.minPrice, filters.value.maxPrice],
  ([min, max]) => {
    priceRange.value = [
      min ?? numericMinPrice.value,
      max ?? numericMaxPrice.value
    ]
  }
)

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