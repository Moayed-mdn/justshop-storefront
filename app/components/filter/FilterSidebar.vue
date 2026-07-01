<template>
  <div>
    <!-- Mobile open button -->
    <button
      :style="{ backgroundColor: accent, color: onAccent }"
      class="md:hidden cursor-pointer p-(--space-4) w-full hover-accent-btn"
      @click="isOpen = true"
    >
      {{ t('filter.open') }}
    </button>

    <!-- Desktop sidebar -->
    <div class="hidden md:block md:h-(--filter-sidebar-height) bg-(--filter-sidebar-bg) sticky top-0 overflow-y-auto rounded thin-scrollbar">
      <FilterBody :backend-filters="backendFilters" :filter-config="filterConfig" />
    </div>

    <!-- Mobile drawer -->
    <UiDrawer v-model="isOpen">
      <FilterBody :backend-filters="backendFilters" :filter-config="filterConfig" @close="isOpen = false" />
    </UiDrawer>
  </div>
</template>

<script setup lang="ts">
import type { ProductListFilters } from '~~/types/product'
import type { ProductFilterConfig } from '~~/app/composables/useFilterConfig'

// Inline theme colors for SSR compatibility
const getCSSVar = (varName: string, fallback: string): string => {
  if (!process.client) return fallback
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
    return value || fallback
  } catch {
    return fallback
  }
}

const accent = computed(() => getCSSVar('--color-accent', '#FF7006'))
const onAccent = computed(() => getCSSVar('--color-text-inverse', '#ffffff'))

const { t } = useI18n()

defineProps<{
  backendFilters: ProductListFilters | null
  filterConfig?: ProductFilterConfig | null
}>()

const isOpen = ref(false)
const isMobile = useMediaQuery('(min-width: 768px)')

watch(isMobile, (val) => {
  if (val) isOpen.value = false
})

</script>

<style scoped>
.thin-scrollbar::-webkit-scrollbar {
  width: 3px;
}

.thin-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.thin-scrollbar::-webkit-scrollbar-thumb {
  border-radius: var(--radius-xl);
}

.thin-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--text-secondary);
}

.hover-accent-btn:hover:not(:disabled) {
  filter: brightness(0.9);
}
</style>