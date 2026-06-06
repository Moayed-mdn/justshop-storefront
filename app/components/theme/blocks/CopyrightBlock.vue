<!--
  CopyrightBlock.vue
  
  Copyright notice with dynamic year and store name.
  Supports custom templates with variable substitution.
-->

<template>
  <div
    class="copyright-block"
    :class="copyrightClasses"
    :style="copyrightStyles"
    data-theme-block="copyright"
  >
    <p class="copyright-block__text">{{ copyrightText }}</p>
  </div>
</template>

<script setup lang="ts">
import type { ThemeBlock } from '~~/types/theme';

const props = defineProps<{
  block: ThemeBlock;
}>();

const config = useRuntimeConfig();

// Current year
const currentYear = computed(() => new Date().getFullYear());

// Store name
const storeName = computed(() => {
  return props.block.settings?.storeName || config.public.siteName || 'Store';
});

// Template text with variable support
const template = computed(() => {
  return props.block.settings?.text || '© {year} {store_name}. All rights reserved.';
});

// Process template and replace variables
const copyrightText = computed(() => {
  let text = template.value;
  
  // Replace variables
  text = text.replace(/{year}/g, currentYear.value.toString());
  text = text.replace(/{store_name}/g, storeName.value);
  text = text.replace(/{company}/g, storeName.value);
  
  // Additional variables if provided
  if (props.block.settings?.companyName) {
    text = text.replace(/{company_name}/g, props.block.settings.companyName);
  }
  
  return text;
});

// Copyright classes
const copyrightClasses = computed(() => {
  const classes: string[] = [];
  
  const align = props.block.settings?.align || 'left';
  classes.push(`copyright-block--${align}`);
  
  if (props.block.settings?.small) {
    classes.push('copyright-block--small');
  }
  
  return classes;
});

// Copyright styles
const copyrightStyles = computed(() => {
  return {
    color: props.block.settings?.color || 'var(--color-text-secondary, #6b7280)',
    fontSize: props.block.settings?.fontSize || '0.875rem',
    fontWeight: props.block.settings?.fontWeight || '400',
  };
});
</script>

<style scoped>
.copyright-block {
  display: flex;
}

.copyright-block__text {
  margin: 0;
  line-height: 1.5;
}

/* Alignment */
.copyright-block--left {
  justify-content: flex-start;
  text-align: left;
}

.copyright-block--center {
  justify-content: center;
  text-align: center;
}

.copyright-block--right {
  justify-content: flex-end;
  text-align: right;
}

/* Small variant */
.copyright-block--small .copyright-block__text {
  font-size: 0.8125rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .copyright-block {
    justify-content: center;
    text-align: center;
  }
}
</style>
