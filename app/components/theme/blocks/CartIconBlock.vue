<!--
  CartIconBlock.vue
  
  Cart icon with item count badge.
  Integrates with the existing cart system.
-->

<template>
  <div
    class="cart-icon-block"
    :style="cartStyles"
    data-theme-block="cart-icon"
  >
    <!-- Reuse existing CartButton component -->
    <CartButton
      :show-label="showLabel"
      :badge-position="badgePosition"
    />
  </div>
</template>

<script setup lang="ts">
import type { ThemeBlock } from '~~/types/theme';

const props = defineProps<{
  block: ThemeBlock;
}>();

// Show label next to icon
const showLabel = computed(() => {
  return props.block.settings?.showLabel ?? false;
});

// Badge position
const badgePosition = computed(() => {
  return props.block.settings?.badgePosition || 'top-right';
});

// Cart styles
const cartStyles = computed(() => {
  return {
    fontSize: props.block.settings?.iconSize || '1.5rem',
    color: props.block.settings?.iconColor || 'var(--color-text)',
  };
});
</script>

<style scoped>
.cart-icon-block {
  display: flex;
  align-items: center;
}

.cart-icon-block :deep(.cart-button) {
  font-size: inherit;
  color: inherit;
}
</style>
