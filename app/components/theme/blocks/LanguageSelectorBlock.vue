<!--
  LanguageSelectorBlock.vue
  
  Language/locale switcher.
  Integrates with Nuxt i18n.
-->

<template>
  <div
    class="language-selector-block"
    :class="selectorClasses"
    :style="selectorStyles"
    data-theme-block="language-selector"
  >
    <!-- Dropdown style -->
    <select
      v-if="displayStyle === 'dropdown'"
      v-model="currentLocale"
      class="language-selector-block__select"
      @change="switchLocale"
    >
      <option
        v-for="locale in availableLocales"
        :key="locale.code"
        :value="locale.code"
      >
        {{ showFlags ? locale.flag + ' ' : '' }}{{ locale.name }}
      </option>
    </select>
    
    <!-- Button list style -->
    <div v-else class="language-selector-block__buttons">
      <button
        v-for="locale in availableLocales"
        :key="locale.code"
        type="button"
        class="language-selector-block__button"
        :class="{ 'language-selector-block__button--active': locale.code === currentLocale }"
        @click="setLocale(locale.code)"
      >
        <span v-if="showFlags" class="language-selector-block__flag">{{ locale.flag }}</span>
        <span class="language-selector-block__label">{{ locale.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ThemeBlock } from '~~/types/theme';

const props = defineProps<{
  block: ThemeBlock;
}>();

const { locale, locales, setLocale: setI18nLocale } = useI18n();
const localePath = useLocalePath();
const router = useRouter();

// Current locale
const currentLocale = ref(locale.value);

// Available locales with flags
const availableLocales = computed(() => {
  return (locales.value as any[]).map((loc) => ({
    code: loc.code,
    name: loc.name || loc.code.toUpperCase(),
    flag: getLocaleFlag(loc.code),
  }));
});

// Get flag emoji for locale
function getLocaleFlag(code: string): string {
  const flagMap: Record<string, string> = {
    en: '🇬🇧',
    ar: '🇸🇦',
    es: '🇪🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
    // Add more as needed
  };
  return flagMap[code] || '🌐';
}

// Display style
const displayStyle = computed(() => {
  return props.block.settings?.displayStyle || 'buttons';
});

// Show flags
const showFlags = computed(() => {
  return props.block.settings?.showFlags ?? true;
});

// Selector classes
const selectorClasses = computed(() => {
  const classes: string[] = [];
  
  if (props.block.settings?.compact) {
    classes.push('language-selector-block--compact');
  }
  
  return classes;
});

// Selector styles
const selectorStyles = computed(() => {
  return {
    gap: props.block.settings?.gap || '0.5rem',
  };
});

// Switch locale (for dropdown)
const switchLocale = async () => {
  await setLocale(currentLocale.value);
};

// Set locale
const setLocale = async (code: string) => {
  currentLocale.value = code;
  await setI18nLocale(code);
  
  // Navigate to localized path
  const currentPath = router.currentRoute.value.fullPath;
  const newPath = localePath(currentPath, code);
  await navigateTo(newPath);
};
</script>

<style scoped>
.language-selector-block {
  display: flex;
  align-items: center;
  gap: inherit;
}

/* Dropdown style */
.language-selector-block__select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.375rem;
  background-color: var(--color-background, white);
  color: var(--color-text, inherit);
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.language-selector-block__select:hover {
  border-color: var(--color-primary, #3b82f6);
}

.language-selector-block__select:focus {
  outline: none;
  border-color: var(--color-primary, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Button list style */
.language-selector-block__buttons {
  display: flex;
  gap: 0.5rem;
}

.language-selector-block__button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 0.375rem;
  background-color: var(--color-background, white);
  color: var(--color-text, inherit);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-selector-block__button:hover {
  border-color: var(--color-primary, #3b82f6);
  background-color: rgba(59, 130, 246, 0.05);
}

.language-selector-block__button--active {
  border-color: var(--color-primary, #3b82f6);
  background-color: var(--color-primary, #3b82f6);
  color: white;
}

.language-selector-block__flag {
  font-size: 1.125rem;
  line-height: 1;
}

.language-selector-block__label {
  white-space: nowrap;
}

/* Compact mode */
.language-selector-block--compact .language-selector-block__button,
.language-selector-block--compact .language-selector-block__select {
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
}

.language-selector-block--compact .language-selector-block__flag {
  font-size: 1rem;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .language-selector-block__label {
    display: none;
  }
  
  .language-selector-block__button {
    padding: 0.5rem;
  }
}
</style>
