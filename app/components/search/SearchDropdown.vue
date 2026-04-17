<!-- app/components/search/SearchDropdown.vue -->

<template>
    <Transition name="search-dropdown">
      <div
        v-if="visible"
        class="
          absolute top-full inset-x-0 mt-1
          bg-(--search-dropdown-bg) border border-(--search-dropdown-border)
          rounded-xl shadow-(--search-dropdown-shadow)
          overflow-hidden
        "
        :style="{ zIndex: 'var(--z-dropdown)', maxHeight: 'var(--search-dropdown-max-height)' }"
      >
        <div class="overflow-y-auto" style="max-height: var(--search-dropdown-max-height)">
  
          <!-- ── Loading Skeleton ──────────────── -->
          <div v-if="loading && suggestions.length === 0" class="p-3 space-y-2">
            <div v-for="i in 4" :key="i" class="flex items-center gap-3 py-2 px-2">
              <div class="w-7 h-7 bg-(--gray-200) rounded animate-pulse shrink-0" />
              <div class="flex-1 h-4 bg-(--gray-200) rounded animate-pulse" />
              <div class="w-14 h-4 bg-(--gray-200) rounded animate-pulse shrink-0" />
            </div>
          </div>
  
          <!-- ── No Results ────────────────────── -->
          <div
            v-else-if="!loading && suggestions.length === 0"
            class="px-4 py-6 text-center text-(--search-item-secondary) text-sm"
          >
            {{ $t('search.no_suggestions') }}
          </div>
  
          <!-- ── Grouped Suggestions ───────────── -->
          <template v-else>
            <!-- Products -->
            <SearchDropdownGroup
              v-if="grouped.PRODUCT.length"
              :label="$t('search.products')"
              :items="grouped.PRODUCT"
              type="PRODUCT"
              :highlighted-index="highlightedIndex"
              :index-offset="0"
              @select="(item) => $emit('select', item)"
            />
  
            <!-- Categories -->
            <SearchDropdownGroup
              v-if="grouped.CATEGORY.length"
              :label="$t('search.categories')"
              :items="grouped.CATEGORY"
              type="CATEGORY"
              :highlighted-index="highlightedIndex"
              :index-offset="grouped.PRODUCT.length"
              @select="(item) => $emit('select', item)"
            />
  
            <!-- Brands -->
            <SearchDropdownGroup
              v-if="grouped.BRAND.length"
              :label="$t('search.brands')"
              :items="grouped.BRAND"
              type="BRAND"
              :highlighted-index="highlightedIndex"
              :index-offset="grouped.PRODUCT.length + grouped.CATEGORY.length"
              @select="(item) => $emit('select', item)"
            />
          </template>
        </div>
  
        <!-- ── Footer: See All ─────────────────── -->
        <button
          v-if="query.length >= 2"
          type="button"
          class="
            w-full px-4 py-3 text-sm font-medium
            text-(--color-primary) bg-(--color-bg-page)
            hover:bg-(--gray-200) transition-colors
            border-t border-(--search-dropdown-border)
            cursor-pointer text-center
          "
          @mousedown.prevent="$emit('seeAll')"
        >
          {{ $t('search.see_all') }} "<span class="font-semibold">{{ query }}</span>"
          <span class="inline-block rtl:rotate-180">&rarr;</span>
        </button>
      </div>
    </Transition>
  </template>
  
  <script setup lang="ts">
  import type { Suggestion } from '~~/types/search'
  
  const props = defineProps<{
    suggestions: Suggestion[]
    loading: boolean
    query: string
    highlightedIndex: number
    visible: boolean
  }>()
  
  defineEmits<{
    select: [item: Suggestion]
    seeAll: []
  }>()
  
  const grouped = computed(() => {
    const groups: { PRODUCT: Suggestion[], CATEGORY: Suggestion[], BRAND: Suggestion[] } = {
      PRODUCT: [],
      CATEGORY: [],
      BRAND: [],
    }
  
    props.suggestions.forEach((s) => {
      groups[s.type]?.push(s)
    })
  
    return groups
  })
  </script>