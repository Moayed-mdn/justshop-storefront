<template>
  <div>
    <!-- Mobile open button -->
    <button
      
      class="md:hidden cursor-pointer hover:bg-(--color-accent-hover) p-(--space-4) bg-(--color-accent) text-(--filter-button-active-text) w-full"
      @click="isOpen = true"
    >
      {{ t('filter.open') }}
    </button>

    <!-- Desktop sidebar -->
    <div class="hidden md:block md:h-(--filter-sidebar-height) bg-(--filter-sidebar-bg) sticky top-0 overflow-y-auto rounded thin-scrollbar">
      <FilterBody :backend-filters="backendFilters" />
    </div>

    <!-- Mobile drawer -->
    <UiDrawer v-model="isOpen">
      <FilterBody :backend-filters="backendFilters" @close="isOpen = false" />
    </UiDrawer>
  </div>
</template>

<script setup lang="ts">
import type { ProductListFilters } from '~~/types/product'

const { t } = useI18n()

defineProps<{
  backendFilters: ProductListFilters
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


</style>