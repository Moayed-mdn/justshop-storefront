<!--
  NavigationMenuBlock.vue
  
  Renders a navigation menu from the backend.
  Supports multi-level menus with dropdowns.
-->

<template>
  <nav
    v-if="menu"
    class="navigation-menu-block"
    :class="menuClasses"
    :style="menuStyles"
    data-theme-block="navigation-menu"
    :aria-label="menu.title"
  >
    <ul class="navigation-menu-block__list">
      <li
        v-for="item in topLevelItems"
        :key="item.id"
        class="navigation-menu-block__item"
        :class="{ 'has-children': hasChildren(item) }"
      >
        <NuxtLinkLocale
          v-if="!item.children?.length"
          :to="item.url"
          :target="item.target"
          class="navigation-menu-block__link"
          active-class="navigation-menu-block__link--active"
        >
          {{ item.label }}
        </NuxtLinkLocale>
        
        <!-- Item with dropdown -->
        <template v-else>
          <button
            type="button"
            class="navigation-menu-block__link navigation-menu-block__link--dropdown"
            @click="toggleDropdown(item.id)"
          >
            {{ item.label }}
            <Icon name="heroicons:chevron-down" class="navigation-menu-block__icon" />
          </button>
          
          <!-- Submenu -->
          <ul
            v-if="isDropdownOpen(item.id)"
            class="navigation-menu-block__submenu"
          >
            <li v-for="child in item.children" :key="child.id">
              <NuxtLinkLocale
                :to="child.url"
                :target="child.target"
                class="navigation-menu-block__sublink"
                @click="closeAllDropdowns"
              >
                {{ child.label }}
              </NuxtLinkLocale>
            </li>
          </ul>
        </template>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { ThemeBlock } from '~~/types/theme';
import type { NavigationMenuItem } from '~~/types/navigation';

const props = defineProps<{
  block: ThemeBlock;
}>();

// Get menu handle from block settings
const menuHandle = computed(() => props.block.settings?.menuHandle || 'main-menu');

// Fetch navigation menu
const { menu, fetchMenu, topLevelItems } = useStoreNavigation(menuHandle.value);

// Dropdown state
const openDropdowns = ref<Set<number>>(new Set());

onMounted(async () => {
  await fetchMenu();
});

// Check if item has children
const hasChildren = (item: NavigationMenuItem) => {
  return (item.children?.length || 0) > 0;
};

// Dropdown management
const toggleDropdown = (itemId: number) => {
  if (openDropdowns.value.has(itemId)) {
    openDropdowns.value.delete(itemId);
  } else {
    openDropdowns.value.add(itemId);
  }
};

const isDropdownOpen = (itemId: number) => {
  return openDropdowns.value.has(itemId);
};

const closeAllDropdowns = () => {
  openDropdowns.value.clear();
};

// Menu classes
const menuClasses = computed(() => {
  const classes: string[] = [];
  const orientation = props.block.settings?.orientation || 'horizontal';
  
  classes.push(`navigation-menu-block--${orientation}`);
  
  if (props.block.settings?.centered) {
    classes.push('navigation-menu-block--centered');
  }
  
  return classes;
});

// Menu styles
const menuStyles = computed(() => {
  return {
    gap: props.block.settings?.gap || '1rem',
    fontSize: props.block.settings?.fontSize || '0.875rem',
    fontWeight: props.block.settings?.fontWeight || '500',
  };
});
</script>

<style scoped>
.navigation-menu-block {
  display: flex;
}

.navigation-menu-block__list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: inherit;
}

.navigation-menu-block__item {
  position: relative;
}

.navigation-menu-block__link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  color: var(--color-text, inherit);
  text-decoration: none;
  transition: color 0.2s ease;
  white-space: nowrap;
  border: none;
  background: none;
  cursor: pointer;
  font-size: inherit;
  font-weight: inherit;
  font-family: inherit;
}

.navigation-menu-block__link:hover {
  color: var(--color-primary, #3b82f6);
}

.navigation-menu-block__link--active {
  color: var(--color-primary, #3b82f6);
  font-weight: 600;
}

.navigation-menu-block__link--dropdown {
  cursor: pointer;
}

.navigation-menu-block__icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;
}

.navigation-menu-block__item:hover .navigation-menu-block__icon {
  transform: rotate(180deg);
}

.navigation-menu-block__submenu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: var(--color-background, white);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 0.25rem 0 0;
  padding: 0.5rem 0;
  z-index: 50;
}

.navigation-menu-block__sublink {
  display: block;
  padding: 0.5rem 1rem;
  color: var(--color-text, inherit);
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.navigation-menu-block__sublink:hover {
  background-color: var(--color-bg-secondary, #f3f4f6);
  color: var(--color-primary, #3b82f6);
}

/* Vertical orientation */
.navigation-menu-block--vertical .navigation-menu-block__list {
  flex-direction: column;
  align-items: flex-start;
}

.navigation-menu-block--vertical .navigation-menu-block__submenu {
  position: static;
  margin-left: 1rem;
  margin-top: 0.5rem;
  box-shadow: none;
  border: none;
  border-left: 2px solid var(--color-border, #e5e7eb);
}

/* Centered */
.navigation-menu-block--centered .navigation-menu-block__list {
  justify-content: center;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .navigation-menu-block {
    display: none; /* Hide on mobile by default */
  }
}
</style>
