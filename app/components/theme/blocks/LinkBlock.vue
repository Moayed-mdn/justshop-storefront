<!--
  LinkBlock.vue
  
  Generic link component for footer links.
  Can be used for individual links or link lists.
-->

<template>
  <div
    class="link-block"
    :class="linkBlockClasses"
    :style="linkBlockStyles"
    data-theme-block="link"
  >
    <!-- Title (if provided) -->
    <h3 v-if="title" class="link-block__title">
      {{ title }}
    </h3>
    
    <!-- Single link mode -->
    <component
      v-if="!isList"
      :is="linkComponent"
      :to="isNuxtLink ? linkUrl : undefined"
      :href="isExternalLink ? linkUrl : undefined"
      :target="linkTarget"
      class="link-block__link"
      :class="linkClasses"
    >
      <Icon v-if="icon" :name="icon" class="link-block__icon" />
      {{ linkText }}
    </component>
    
    <!-- Link list mode -->
    <ul v-else class="link-block__list">
      <li v-for="(link, index) in links" :key="index" class="link-block__item">
        <component
          :is="getLinkComponent(link.url)"
          :to="isInternalLink(link.url) ? link.url : undefined"
          :href="isExternalUrl(link.url) ? link.url : undefined"
          :target="link.target || '_self'"
          class="link-block__link"
        >
          <Icon v-if="link.icon" :name="link.icon" class="link-block__icon" />
          {{ link.text }}
        </component>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { ThemeBlock } from '~~/types/theme';

const props = defineProps<{
  block: ThemeBlock;
}>();

// Title for link group
const title = computed(() => {
  return props.block.settings?.title || '';
});

// Check if this is a list of links
const isList = computed(() => {
  return Array.isArray(props.block.settings?.links) && props.block.settings.links.length > 0;
});

// Links array for list mode
const links = computed(() => {
  return props.block.settings?.links || [];
});

// Single link properties
const linkText = computed(() => {
  return props.block.settings?.text || 'Link';
});

const linkUrl = computed(() => {
  return props.block.settings?.url || '#';
});

const icon = computed(() => {
  return props.block.settings?.icon || null;
});

// Determine link type
const isExternalUrl = (url: string) => {
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
};

const isInternalLink = (url: string) => {
  return !isExternalUrl(url) && url !== '#';
};

const isExternalLink = computed(() => {
  return isExternalUrl(linkUrl.value);
});

const isNuxtLink = computed(() => {
  return isInternalLink(linkUrl.value);
});

const linkComponent = computed(() => {
  if (isNuxtLink.value) return resolveComponent('NuxtLinkLocale');
  if (isExternalLink.value) return 'a';
  return 'button';
});

const getLinkComponent = (url: string) => {
  if (isInternalLink(url)) return resolveComponent('NuxtLinkLocale');
  if (isExternalUrl(url)) return 'a';
  return 'button';
};

const linkTarget = computed(() => {
  return isExternalLink.value ? (props.block.settings?.target || '_blank') : '_self';
});

// Link block classes
const linkBlockClasses = computed(() => {
  const classes: string[] = [];
  
  if (props.block.settings?.centered) {
    classes.push('link-block--centered');
  }
  
  if (isList.value) {
    classes.push('link-block--list');
  }
  
  return classes;
});

// Link classes
const linkClasses = computed(() => {
  const classes: string[] = [];
  
  if (props.block.settings?.underline) {
    classes.push('link-block__link--underline');
  }
  
  if (props.block.settings?.bold) {
    classes.push('link-block__link--bold');
  }
  
  return classes;
});

// Link block styles
const linkBlockStyles = computed(() => {
  return {
    color: props.block.settings?.color || 'inherit',
    fontSize: props.block.settings?.fontSize || '0.875rem',
  };
});
</script>

<style scoped>
.link-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.link-block__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: inherit;
}

.link-block__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link-block__item {
  margin: 0;
}

.link-block__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
}

.link-block__link:hover {
  color: var(--color-primary, #3b82f6);
}

.link-block__link--underline {
  text-decoration: underline;
}

.link-block__link--bold {
  font-weight: 600;
}

.link-block__icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

/* Centered alignment */
.link-block--centered {
  align-items: center;
  text-align: center;
}

.link-block--centered .link-block__list {
  align-items: center;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .link-block {
    align-items: flex-start;
  }
  
  .link-block--list .link-block__list {
    width: 100%;
  }
}
</style>
