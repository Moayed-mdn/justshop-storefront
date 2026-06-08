<template>
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
      <!-- Status Filter -->
      <div class="flex items-center gap-2">
        <label for="status-filter" class="text-sm font-medium text-(--color-text-primary)">
          Status:
        </label>
        <select
          id="status-filter"
          v-model="localFilters.status"
          class="rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          @change="handleFilterChange"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="trashed">Trashed</option>
        </select>
      </div>

      <!-- Search Input -->
      <div class="flex items-center gap-2">
        <label for="search-filter" class="text-sm font-medium text-(--color-text-primary)">
          Search:
        </label>
        <input
          id="search-filter"
          v-model="localFilters.search"
          type="text"
          placeholder="Search by title..."
          class="rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          @input="handleSearchDebounced"
        />
      </div>

      <!-- Clear Filters Button -->
      <button
        v-if="hasActiveFilters"
        type="button"
        class="text-sm text-(--color-primary) hover:text-(--color-primary-hover)"
        @click="clearFilters"
      >
        Clear filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { HeroBannersFilters, BannerStatus } from '~/types/heroBanner'

const props = defineProps<{
  modelValue: HeroBannersFilters
}>()

const emit = defineEmits<{
  'update:modelValue': [filters: HeroBannersFilters]
  'filter-change': [filters: HeroBannersFilters]
}>()

// Local state
const localFilters = ref<HeroBannersFilters>({
  status: props.modelValue.status || 'all',
  search: props.modelValue.search || '',
})

// Debounce timer for search
let searchTimeout: NodeJS.Timeout | null = null

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return localFilters.value.status !== 'all' || !!localFilters.value.search
})

// Handle status filter change
function handleFilterChange() {
  emitFilters()
}

// Handle search with debounce
function handleSearchDebounced() {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    emitFilters()
  }, 500)
}

// Emit filter changes
function emitFilters() {
  const filters: HeroBannersFilters = {
    status: localFilters.value.status === 'all' ? undefined : localFilters.value.status,
    search: localFilters.value.search || undefined,
  }
  
  emit('update:modelValue', filters)
  emit('filter-change', filters)
}

// Clear all filters
function clearFilters() {
  localFilters.value = {
    status: 'all',
    search: '',
  }
  emitFilters()
}

// Watch for external changes
watch(() => props.modelValue, (newFilters) => {
  localFilters.value = {
    status: newFilters.status || 'all',
    search: newFilters.search || '',
  }
}, { deep: true })
</script>
