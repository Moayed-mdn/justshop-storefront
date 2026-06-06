<!--
  LogoBlock.vue
  
  Displays the store logo or name.
  Supports custom sizing, positioning, and styling from block settings.
-->

<template>
  <NuxtLinkLocale
    to="/"
    class="logo-block"
    :class="logoClasses"
    :style="logoStyles"
    data-theme-block="logo"
  >
    <img
      v-if="logoUrl"
      :src="logoUrl"
      :alt="storeName"
      :width="logoWidth"
      :height="logoHeight"
      class="logo-block__image"
      loading="eager"
    />
    <span v-else class="logo-block__text">
      {{ storeName }}
    </span>
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import type { ThemeBlock } from '~~/types/theme';

const props = defineProps<{
  block: ThemeBlock;
}>();

const config = useRuntimeConfig();

// Get store info (you may need to adjust this based on your store management)
const storeName = computed(() => {
  // Get from store context or config
  return props.block.settings?.storeName || config.public.siteName || 'Store';
});

const logoUrl = computed(() => {
  // Priority: block settings > store settings > default
  return props.block.settings?.logoUrl || null;
});

// Logo dimensions
const logoWidth = computed(() => props.block.settings?.width || 150);
const logoHeight = computed(() => props.block.settings?.height || 'auto');

// Logo classes
const logoClasses = computed(() => {
  const classes: string[] = [];
  
  if (props.block.settings?.centered) classes.push('logo-block--centered');
  if (!logoUrl.value) classes.push('logo-block--text-only');
  
  return classes;
});

// Logo styles
const logoStyles = computed(() => {
  return {
    maxWidth: props.block.settings?.maxWidth || '200px',
    fontSize: props.block.settings?.fontSize || '1.5rem',
    fontWeight: props.block.settings?.fontWeight || '600',
    color: props.block.settings?.color || 'var(--color-text)',
  };
});
</script>

<style scoped>
.logo-block {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.logo-block:hover {
  opacity: 0.8;
}

.logo-block__image {
  display: block;
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.logo-block__text {
  font-family: var(--font-heading, inherit);
  white-space: nowrap;
}

.logo-block--centered {
  justify-content: center;
}

.logo-block--text-only {
  font-weight: 700;
}

/* Responsive */
@media (max-width: 768px) {
  .logo-block {
    max-width: 120px;
  }
  
  .logo-block__text {
    font-size: 1.25rem;
  }
}
</style>
