<!--
  SocialLinksBlock.vue
  
  Social media links with icons.
  Supports multiple platforms with customizable styling.
-->

<template>
  <div
    class="social-links-block"
    :class="linksClasses"
    :style="linksStyles"
    data-theme-block="social-links"
  >
    <h3 v-if="title" class="social-links-block__title">
      {{ title }}
    </h3>
    
    <div class="social-links-block__links" :style="linksContainerStyles">
      <a
        v-for="link in socialLinks"
        :key="link.platform"
        :href="link.url"
        :aria-label="`${storeName} on ${link.platform}`"
        :title="link.platform"
        class="social-links-block__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon :name="getIcon(link.platform)" class="social-links-block__icon" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ThemeBlock } from '~~/types/theme';

const props = defineProps<{
  block: ThemeBlock;
}>();

const config = useRuntimeConfig();

// Store name for aria labels
const storeName = computed(() => {
  return config.public.siteName || 'Store';
});

// Block title
const title = computed(() => {
  return props.block.settings?.title || '';
});

// Social links from settings
const socialLinks = computed(() => {
  const links = props.block.settings?.links || [];
  
  // Ensure links have required fields
  return links.filter((link: any) => link.platform && link.url);
});

// Icon mapping for social platforms
const iconMap: Record<string, string> = {
  facebook: 'simple-icons:facebook',
  twitter: 'simple-icons:twitter',
  x: 'simple-icons:x',
  instagram: 'simple-icons:instagram',
  linkedin: 'simple-icons:linkedin',
  youtube: 'simple-icons:youtube',
  tiktok: 'simple-icons:tiktok',
  pinterest: 'simple-icons:pinterest',
  snapchat: 'simple-icons:snapchat',
  whatsapp: 'simple-icons:whatsapp',
  telegram: 'simple-icons:telegram',
  github: 'simple-icons:github',
  discord: 'simple-icons:discord',
  reddit: 'simple-icons:reddit',
  // Fallback
  default: 'heroicons:link',
};

// Get icon for platform
const getIcon = (platform: string): string => {
  const normalizedPlatform = platform.toLowerCase().replace(/\s+/g, '');
  return iconMap[normalizedPlatform] || iconMap.default;
};

// Links classes
const linksClasses = computed(() => {
  const classes: string[] = [];
  
  if (props.block.settings?.centered) {
    classes.push('social-links-block--centered');
  }
  
  if (props.block.settings?.vertical) {
    classes.push('social-links-block--vertical');
  }
  
  return classes;
});

// Links styles
const linksStyles = computed(() => {
  return {
    fontSize: props.block.settings?.fontSize || 'inherit',
    color: props.block.settings?.color || 'var(--color-text)',
  };
});

// Links container styles
const linksContainerStyles = computed(() => {
  return {
    gap: props.block.settings?.gap || '1rem',
    justifyContent: props.block.settings?.justifyContent || 'flex-start',
  };
});
</script>

<style scoped>
.social-links-block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.social-links-block__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: inherit;
}

.social-links-block__links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.social-links-block__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  color: inherit;
  text-decoration: none;
  transition: all 0.2s ease;
  background-color: rgba(0, 0, 0, 0.05);
}

.social-links-block__link:hover {
  background-color: var(--color-primary, #3b82f6);
  color: white;
  transform: translateY(-2px);
}

.social-links-block__icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Centered alignment */
.social-links-block--centered {
  align-items: center;
  text-align: center;
}

.social-links-block--centered .social-links-block__links {
  justify-content: center;
}

/* Vertical layout */
.social-links-block--vertical .social-links-block__links {
  flex-direction: column;
  align-items: flex-start;
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .social-links-block__link {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
