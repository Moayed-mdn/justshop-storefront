<!--
  ButtonBlock.vue
  
  Call-to-action button block.
  Supports links, custom styling, and various button styles.
-->

<template>
  <component
    :is="buttonComponent"
    :to="isNuxtLink ? buttonUrl : undefined"
    :href="isExternalLink ? buttonUrl : undefined"
    :target="buttonTarget"
    :type="isButton ? buttonType : undefined"
    class="button-block"
    :class="buttonClasses"
    :style="buttonStyles"
    data-theme-block="button"
    @click="handleClick"
  >
    <Icon
      v-if="icon && iconPosition === 'left'"
      :name="icon"
      class="button-block__icon button-block__icon--left"
    />
    
    <span class="button-block__text">{{ buttonText }}</span>
    
    <Icon
      v-if="icon && iconPosition === 'right'"
      :name="icon"
      class="button-block__icon button-block__icon--right"
    />
  </component>
</template>

<script setup lang="ts">
import type { ThemeBlock } from '~~/types/theme';

const props = defineProps<{
  block: ThemeBlock;
}>();

// Button text
const buttonText = computed(() => {
  return props.block.settings?.text || 'Button';
});

// Button URL
const buttonUrl = computed(() => {
  return props.block.settings?.url || '#';
});

// Button type (for button elements)
const buttonType = computed(() => {
  return props.block.settings?.buttonType || 'button';
});

// Icon
const icon = computed(() => {
  return props.block.settings?.icon || null;
});

// Icon position
const iconPosition = computed(() => {
  return props.block.settings?.iconPosition || 'left';
});

// Determine component type
const isExternalLink = computed(() => {
  const url = buttonUrl.value;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
});

const isNuxtLink = computed(() => {
  return !isExternalLink.value && buttonUrl.value !== '#' && props.block.settings?.linkType !== 'button';
});

const isButton = computed(() => {
  return buttonUrl.value === '#' || props.block.settings?.linkType === 'button';
});

const buttonComponent = computed(() => {
  if (isNuxtLink.value) return resolveComponent('NuxtLinkLocale');
  if (isExternalLink.value) return 'a';
  return 'button';
});

// Button target
const buttonTarget = computed(() => {
  return isExternalLink.value ? (props.block.settings?.target || '_blank') : undefined;
});

// Button variant
const variant = computed(() => {
  return props.block.settings?.variant || 'primary';
});

// Button size
const size = computed(() => {
  return props.block.settings?.size || 'medium';
});

// Button classes
const buttonClasses = computed(() => {
  const classes: string[] = [];
  
  classes.push(`button-block--${variant.value}`);
  classes.push(`button-block--${size.value}`);
  
  if (props.block.settings?.fullWidth) {
    classes.push('button-block--full-width');
  }
  
  if (props.block.settings?.outlined) {
    classes.push('button-block--outlined');
  }
  
  if (icon.value) {
    classes.push('button-block--with-icon');
  }
  
  return classes;
});

// Button styles
const buttonStyles = computed(() => {
  return {
    backgroundColor: props.block.settings?.backgroundColor || undefined,
    color: props.block.settings?.textColor || undefined,
    borderColor: props.block.settings?.borderColor || undefined,
    borderRadius: props.block.settings?.borderRadius || '0.375rem',
    fontSize: props.block.settings?.fontSize || undefined,
    fontWeight: props.block.settings?.fontWeight || '500',
    padding: props.block.settings?.padding || undefined,
  };
});

// Handle click (for custom actions)
const handleClick = (event: MouseEvent) => {
  if (props.block.settings?.onClick) {
    // Custom click handler if needed
    console.log('Button clicked:', buttonText.value);
  }
};
</script>

<style scoped>
.button-block {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

/* Primary variant */
.button-block--primary {
  background-color: var(--color-primary, #3b82f6);
  color: white;
}

.button-block--primary:hover {
  background-color: var(--color-primary-dark, #2563eb);
}

/* Secondary variant */
.button-block--secondary {
  background-color: var(--color-secondary, #6366f1);
  color: white;
}

.button-block--secondary:hover {
  background-color: var(--color-secondary-dark, #4f46e5);
}

/* Outlined variant */
.button-block--outlined {
  background-color: transparent;
  border-color: currentColor;
}

.button-block--outlined.button-block--primary {
  color: var(--color-primary, #3b82f6);
}

.button-block--outlined.button-block--secondary {
  color: var(--color-secondary, #6366f1);
}

.button-block--outlined:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

/* Size variants */
.button-block--small {
  padding: 0.375rem 0.875rem;
  font-size: 0.8125rem;
}

.button-block--medium {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
}

.button-block--large {
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
}

/* Full width */
.button-block--full-width {
  width: 100%;
}

/* Icon */
.button-block__icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.button-block--small .button-block__icon {
  width: 1rem;
  height: 1rem;
}

.button-block--large .button-block__icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Disabled state */
.button-block:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
