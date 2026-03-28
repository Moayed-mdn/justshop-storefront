<template>
  <div class="relative" ref="wrapper">
    
    <!-- Toggle -->
    <button
      @click="open = !open"
      class="flex items-center gap-(--lang-switcher-gap) font-semibold uppercase text-(--lang-switcher-text-size) hover:text-(--lang-switcher-text-hover)"
      :style="{ color: 'var(--lang-switcher-text-color)' }"
    >
      {{ currentLocale?.code }}
      <svg class="w-(--lang-switcher-icon-size) h-(--lang-switcher-icon-size) transition-transform duration-(--lang-switcher-transition-duration)"
           :class="open ? 'rotate-180' : ''"
           viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 7l5 5 5-5H5z"/>
      </svg>
    </button>
    
    <!-- Dropdown -->
    <transition name="fade">
      <div
        v-if="open"
        class="absolute end-0 mt-2 w-(--lang-switcher-dropdown-width) bg-(--lang-switcher-dropdown-bg) [box-shadow:var(--lang-switcher-dropdown-shadow)] rounded-(--lang-switcher-dropdown-radius) py-(--lang-switcher-dropdown-padding) border border-(--lang-switcher-dropdown-border) z-(--lang-switcher-dropdown-z)"
      >
        <NuxtLink
          v-for="lang in locales"
          :key="lang.code"
          :to="switchLocalePath(lang.code)"
          class="flex justify-between items-center px-(--space-3) py-(--space-2) text-sm text-(--color-text-secondary)   transition duration-(--lang-switcher-transition-duration)"
          :class="{
            'bg-(--lang-switcher-item-active-bg) text-(--lang-switcher-item-active-text) font-semibold': lang.code === locale
          }"
          @click="open = false"
        >
         <Icon v-if="lang.icon" :name="lang.icon as string " class="text-xl" />
          <span>{{ lang.name }}</span>
          <span class="uppercase text-xs">{{ lang.code }}</span>
        </NuxtLink>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
// declare module '@nuxtjs/i18n' {
//   interface LocaleObject {
//     icon: string
//   }
// }

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const open = ref(false)
const wrapper = ref(null)

const currentLocale = computed(() =>
  locales.value.find(l => l.code === locale.value)
)

onClickOutside(wrapper, () => open.value = false)
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all var(--lang-switcher-fade-duration) var(--lang-switcher-fade-ease);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(var(--lang-switcher-fade-offset));
}
</style>