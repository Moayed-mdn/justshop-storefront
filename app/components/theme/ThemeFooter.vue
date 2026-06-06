<!--
  ThemeFooter.vue
  
  Dynamic footer component that renders from backend theme data.
  Replaces the static footer with a theme-driven, customizable footer.
-->

<template>
  <footer
    v-if="footerSection"
    class="theme-footer"
    :style="footerStyles"
    data-theme-footer="root"
  >
    <FooterSection :section="footerSection" />
  </footer>
</template>

<script setup lang="ts">
import type { ThemeSection } from '~~/types/theme';

const { theme, getSection, loading, error } = useStoreTheme();

// Get footer section from theme
const footerSection = getSection('footer');

// Compute footer styles from section settings
const footerStyles = computed(() => {
  if (!footerSection.value) return {};
  
  const settings = footerSection.value.settings || {};
  
  return {
    backgroundColor: settings.backgroundColor || 'var(--color-bg-secondary, #f9fafb)',
    color: settings.textColor || 'var(--color-text)',
    padding: settings.padding || '3rem 0',
    borderTop: settings.borderTop ? `1px solid ${settings.borderTopColor || 'var(--color-border)'}` : 'none',
    marginTop: settings.marginTop || 'auto',
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
.theme-footer {
  width: 100%;
  transition: background-color 0.2s ease;
}

/* Ensure footer stays at bottom */
.theme-footer {
  margin-top: auto;
}
</style>
