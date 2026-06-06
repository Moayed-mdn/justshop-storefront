<!--
  ThemeHeader.vue
  
  Dynamic header component that renders from backend theme data.
  Replaces the static header with a theme-driven, customizable header.
-->

<template>
  <header
    v-if="headerSection"
    class="theme-header"
    :style="headerStyles"
    data-theme-header="root"
  >
    <HeaderSection :section="headerSection" />
  </header>
</template>

<script setup lang="ts">
import type { ThemeSection } from '~~/types/theme';

const { theme, getSection, loading, error } = useStoreTheme();

// Get header section from theme
const headerSection = getSection('header');

// Compute header styles from section settings
const headerStyles = computed(() => {
  if (!headerSection.value) return {};
  
  const settings = headerSection.value.settings || {};
  
  return {
    backgroundColor: settings.backgroundColor || 'var(--color-background)',
    color: settings.textColor || 'var(--color-text)',
    padding: settings.padding || '0',
    height: settings.height || 'auto',
    position: settings.sticky ? 'sticky' : 'relative',
    top: settings.sticky ? '0' : 'auto',
    zIndex: settings.sticky ? '50' : 'auto',
    boxShadow: settings.shadow ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
    borderBottom: settings.borderBottom ? `1px solid ${settings.borderBottomColor || 'var(--color-border)'}` : 'none',
  };
});

// Fetch theme on mount (if not already loaded)
onMounted(async () => {
  if (!theme.value && !loading.value && !error.value) {
    const { fetchTheme } = useStoreTheme();
    await fetchTheme();
  }
});
</script>

<style scoped>
.theme-header {
  width: 100%;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

/* Sticky header enhancement */
.theme-header[style*="position: sticky"] {
  backdrop-filter: blur(8px);
}
</style>
