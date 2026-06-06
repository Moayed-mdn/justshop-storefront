<!--
  FooterSection.vue
  
  Renders a footer section with its blocks.
  Supports multi-column layouts for footer content.
-->

<template>
  <div
    class="footer-section"
    :class="sectionClasses"
    :style="sectionStyles"
    data-theme-section="footer"
  >
    <div class="footer-container" :style="containerStyles">
      <!-- Render blocks in columns or rows -->
      <div v-if="layout === 'columns'" class="footer-columns" :style="columnsStyles">
        <div
          v-for="column in columns"
          :key="column"
          class="footer-column"
        >
          <component
            v-for="block in getColumnBlocks(column)"
            :key="block.id"
            :is="getBlockComponent(block.block_type)"
            :block="block"
            :class="`footer-block footer-block-${block.block_type}`"
          />
        </div>
      </div>
      
      <!-- Single row layout -->
      <div v-else class="footer-row" :style="rowStyles">
        <component
          v-for="block in visibleBlocks"
          :key="block.id"
          :is="getBlockComponent(block.block_type)"
          :block="block"
          :class="`footer-block footer-block-${block.block_type}`"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ThemeSection, ThemeBlock } from '~~/types/theme';

// Import block components
import NavigationMenuBlock from '../blocks/NavigationMenuBlock.vue';
import SocialLinksBlock from '../blocks/SocialLinksBlock.vue';
import CopyrightBlock from '../blocks/CopyrightBlock.vue';
import LinkBlock from '../blocks/LinkBlock.vue';
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

// Layout type (columns or row)
const layout = computed(() => {
  return props.section.settings?.layout || 'columns';
});

// Number of columns
const columnCount = computed(() => {
  return props.section.settings?.columns || 3;
});

// Generate column numbers
const columns = computed(() => {
  return Array.from({ length: columnCount.value }, (_, i) => i + 1);
});

// Get blocks for a specific column
const getColumnBlocks = (columnNumber: number) => {
  return visibleBlocks.value.filter((block) => {
    const blockColumn = block.settings?.column || 1;
    return blockColumn === columnNumber;
  });
};

// Section classes
const sectionClasses = computed(() => {
  const settings = props.section.settings || {};
  const classes: string[] = [];
  
  if (settings.fullWidth) classes.push('footer-section--full-width');
  if (settings.centered) classes.push('footer-section--centered');
  
  return classes;
});

// Section styles
const sectionStyles = computed(() => {
  const settings = props.section.settings || {};
  
  return {
    backgroundColor: settings.backgroundColor || 'transparent',
    padding: settings.padding || '0',
  };
});

// Container styles
const containerStyles = computed(() => {
  const settings = props.section.settings || {};
  
  return {
    maxWidth: settings.containerWidth || 'var(--layout-container-width, 1280px)',
    margin: '0 auto',
    padding: settings.containerPadding || '0 1rem',
  };
});

// Columns layout styles
const columnsStyles = computed(() => {
  const settings = props.section.settings || {};
  
  return {
    display: 'grid',
    gridTemplateColumns: settings.gridTemplateColumns || `repeat(${columnCount.value}, 1fr)`,
    gap: settings.gap || '2rem',
    alignItems: settings.alignItems || 'start',
  };
});

// Row layout styles
const rowStyles = computed(() => {
  const settings = props.section.settings || {};
  
  return {
    display: 'flex',
    flexWrap: settings.wrap ? 'wrap' : 'nowrap',
    justifyContent: settings.justifyContent || 'space-between',
    alignItems: settings.alignItems || 'center',
    gap: settings.gap || '1rem',
  };
});

// Map block types to components
const blockComponentMap: Record<string, any> = {
  navigation_menu: NavigationMenuBlock,
  social_links: SocialLinksBlock,
  copyright: CopyrightBlock,
  link: LinkBlock,
  text: TextBlock,
  button: ButtonBlock,
};

// Get block component by type
const getBlockComponent = (blockType: string) => {
  return blockComponentMap[blockType] || TextBlock; // Fallback to TextBlock
};
</script>

<style scoped>
.footer-section {
  width: 100%;
}

.footer-section--full-width .footer-container {
  max-width: 100%;
}

.footer-section--centered {
  text-align: center;
}

.footer-container {
  position: relative;
}

.footer-columns {
  width: 100%;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-row {
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .footer-columns {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 768px) {
  .footer-columns {
    grid-template-columns: 1fr !important;
    gap: 2rem;
  }
  
  .footer-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
}
</style>
