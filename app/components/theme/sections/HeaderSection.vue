<!--
  HeaderSection.vue
  
  Renders a header section with its blocks.
  Dynamically loads the appropriate block component based on block_type.
-->

<template>
  <div
    class="header-section"
    :class="sectionClasses"
    :style="sectionStyles"
    data-theme-section="header"
  >
    <div class="header-container" :style="containerStyles">
      <!-- Render blocks -->
      <component
        v-for="block in visibleBlocks"
        :key="block.id"
        :is="getBlockComponent(block.block_type)"
        :block="block"
        :class="`header-block header-block-${block.block_type}`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ThemeSection, ThemeBlock } from '~~/types/theme';

// Import block components
import LogoBlock from '../blocks/LogoBlock.vue';
import NavigationMenuBlock from '../blocks/NavigationMenuBlock.vue';
import SearchBarBlock from '../blocks/SearchBarBlock.vue';
import CartIconBlock from '../blocks/CartIconBlock.vue';
import LanguageSelectorBlock from '../blocks/LanguageSelectorBlock.vue';
import TextBlock from '../blocks/TextBlock.vue';
import ButtonBlock from '../blocks/ButtonBlock.vue';

const props = defineProps<{
  section: ThemeSection;
}>();

// Get visible blocks sorted by position
const visibleBlocks = computed(() => {
  return (props.section.blocks || [])
    .filter((block) => block.is_visible)
    .sort((a, b) => a.position - b.position);
});

// Section classes based on settings
const sectionClasses = computed(() => {
  const settings = props.section.settings || {};
  const classes: string[] = [];
  
  if (settings.fullWidth) classes.push('header-section--full-width');
  if (settings.bordered) classes.push('header-section--bordered');
  if (settings.transparent) classes.push('header-section--transparent');
  
  return classes;
});

// Section styles
const sectionStyles = computed(() => {
  const settings = props.section.settings || {};
  
  return {
    backgroundColor: settings.backgroundColor || 'transparent',
    padding: settings.padding || '1rem 0',
  };
});

// Container styles
const containerStyles = computed(() => {
  const settings = props.section.settings || {};
  
  return {
    maxWidth: settings.containerWidth || 'var(--layout-container-width, 1280px)',
    margin: '0 auto',
    padding: settings.containerPadding || '0 1rem',
    display: 'flex',
    alignItems: settings.alignItems || 'center',
    justifyContent: settings.justifyContent || 'space-between',
    gap: settings.gap || '1rem',
    flexWrap: settings.wrap ? 'wrap' : 'nowrap',
  };
});

// Map block types to components
const blockComponentMap: Record<string, any> = {
  logo: LogoBlock,
  navigation_menu: NavigationMenuBlock,
  search_bar: SearchBarBlock,
  cart_icon: CartIconBlock,
  language_selector: LanguageSelectorBlock,
  text: TextBlock,
  button: ButtonBlock,
};

// Get block component by type
const getBlockComponent = (blockType: string) => {
  return blockComponentMap[blockType] || TextBlock; // Fallback to TextBlock
};
</script>

<style scoped>
.header-section {
  width: 100%;
}

.header-section--full-width .header-container {
  max-width: 100%;
}

.header-section--bordered {
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.header-section--transparent {
  background-color: transparent !important;
}

.header-container {
  position: relative;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-container {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>
