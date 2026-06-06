<!--
  SearchBarBlock.vue
  
  Search input with autocomplete functionality.
  Integrates with the existing HeaderSearchInput component.
-->

<template>
  <div
    class="search-bar-block"
    :class="searchClasses"
    :style="searchStyles"
    data-theme-block="search-bar"
  >
    <!-- Reuse existing HeaderSearchInput component -->
    <HeaderSearchInput
      :placeholder="placeholder"
      :class="inputClasses"
    />
  </div>
</template>

<script setup lang="ts">
import type { ThemeBlock } from '~~/types/theme';

const props = defineProps<{
  block: ThemeBlock;
}>();

const { t } = useI18n();

// Placeholder text
const placeholder = computed(() => {
  return props.block.settings?.placeholder || t('search.placeholder', 'Search products...');
});

// Search classes
const searchClasses = computed(() => {
  const classes: string[] = [];
  
  if (props.block.settings?.fullWidth) {
    classes.push('search-bar-block--full-width');
  }
  
  if (props.block.settings?.compact) {
    classes.push('search-bar-block--compact');
  }
  
  return classes;
});

// Input classes
const inputClasses = computed(() => {
  const classes: string[] = [];
  
  if (props.block.settings?.inputSize) {
    classes.push(`search-input--${props.block.settings.inputSize}`);
  }
  
  return classes;
});

// Search styles
const searchStyles = computed(() => {
  return {
    maxWidth: props.block.settings?.maxWidth || '600px',
    width: props.block.settings?.fullWidth ? '100%' : 'auto',
    flex: props.block.settings?.flex || '1',
  };
});
</script>

<style scoped>
.search-bar-block {
  display: flex;
  align-items: center;
}

.search-bar-block--full-width {
  width: 100%;
  max-width: 100%;
}

.search-bar-block--compact {
  max-width: 400px;
}

/* Size variants */
.search-bar-block :deep(.search-input--small) {
  height: 2rem;
  font-size: 0.875rem;
}

.search-bar-block :deep(.search-input--large) {
  height: 3rem;
  font-size: 1rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .search-bar-block {
    width: 100%;
    max-width: 100%;
  }
}
</style>
