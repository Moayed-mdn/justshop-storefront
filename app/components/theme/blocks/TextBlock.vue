<!--
  TextBlock.vue
  
  Generic text content block.
  Supports headings, paragraphs, and custom styling.
-->

<template>
  <component
    :is="tagName"
    class="text-block"
    :class="textClasses"
    :style="textStyles"
    data-theme-block="text"
    v-html="sanitizedContent"
  />
</template>

<script setup lang="ts">
import type { ThemeBlock } from '~~/types/theme';

const props = defineProps<{
  block: ThemeBlock;
}>();

// HTML tag to use
const tagName = computed(() => {
  return props.block.settings?.tag || 'div';
});

// Content to display
const content = computed(() => {
  return props.block.settings?.content || '';
});

// Sanitize HTML content (basic sanitization)
const sanitizedContent = computed(() => {
  // In production, use a proper sanitization library like DOMPurify
  // For now, basic escaping
  const div = document.createElement('div');
  div.textContent = content.value;
  return div.innerHTML;
});

// Text classes
const textClasses = computed(() => {
  const classes: string[] = [];
  
  if (props.block.settings?.align) {
    classes.push(`text-${props.block.settings.align}`);
  }
  
  if (props.block.settings?.bold) {
    classes.push('font-bold');
  }
  
  if (props.block.settings?.italic) {
    classes.push('italic');
  }
  
  if (props.block.settings?.uppercase) {
    classes.push('uppercase');
  }
  
  return classes;
});

// Text styles
const textStyles = computed(() => {
  return {
    color: props.block.settings?.color || 'inherit',
    fontSize: props.block.settings?.fontSize || 'inherit',
    fontWeight: props.block.settings?.fontWeight || 'inherit',
    lineHeight: props.block.settings?.lineHeight || 'inherit',
    letterSpacing: props.block.settings?.letterSpacing || 'normal',
    textTransform: props.block.settings?.textTransform || 'none',
    whiteSpace: props.block.settings?.whiteSpace || 'normal',
  };
});
</script>

<style scoped>
.text-block {
  margin: 0;
}

/* Alignment utilities */
.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-justify {
  text-align: justify;
}

/* Font weight utilities */
.font-bold {
  font-weight: 700;
}

/* Text transform utilities */
.uppercase {
  text-transform: uppercase;
}

/* Font style utilities */
.italic {
  font-style: italic;
}
</style>
