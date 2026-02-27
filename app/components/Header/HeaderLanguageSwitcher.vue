<template>
  <div class="relative" ref="wrapper">
    
    <!-- Toggle -->
    <button
      @click="open = !open"
      class="flex items-center gap-1 font-semibold uppercase text-sm hover:text-[var(--color-primary-hover)] transition"
    >
      {{ currentLocale?.code }}
      <svg class="w-3 h-3 transition-transform duration-200"
           :class="open ? 'rotate-180' : ''"
           viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 7l5 5 5-5H5z"/>
      </svg>
    </button>

    <!-- Dropdown -->
    <transition name="fade">
      <div
        v-if="open"
        class="absolute left-0 mt-2 w-40 bg-[var(--color-bg-white)] dropdown-shadow rounded-lg py-2 border border-[var(--color-border-light)] z-[var(--z-dropdown)]"
      >
        <NuxtLink
          v-for="lang in locales"
          :key="lang.code"
          :to="switchLocalePath(lang.code)"
          class="flex justify-between items-center px-3 py-2 text-sm hover:bg-gray-100 transition"
          :class="{
            'bg-blue-50 text-[var(--color-primary-hover)] font-semibold': lang.code === locale
          }"
          @click="open = false"
        >
          <span>{{ lang.name }}</span>
          <span class="uppercase text-xs">{{ lang.code }}</span>
        </NuxtLink>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const open = ref(false)
const wrapper = ref(null)

const currentLocale = computed(() =>
  locales.value.find(l => l.code === locale.value)
)

// click outside
onClickOutside(wrapper, () => open.value = false)
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all .15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>