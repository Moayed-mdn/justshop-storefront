<template>
  <div class="flex items-center gap-[var(--header-gap-wide)]">
    <NuxtLink class="group flex font-semibold  gap-[var(--header-gap-tight)] items-center transition-all duration-[var(--header-duration)]  hover:text-[var(--header-action-hover-color)] " to="#">
      <img class="w-4 sm:w-6" src="~/assets/icons/user.png" alt="">
      <span class="hidden sm:block group-hover:opacity-[var(--header-opacity)] ">{{ $t('header.account') }}</span>
    </NuxtLink>

    <NuxtLink class="group flex font-semibold  gap-[var(--header-gap-tight)] items-center transition-all duration-[var(--header-duration)]  hover:text-[var(--header-action-hover-color)] " to="#">
      <img class="w-4 sm:w-6" src="~/assets/icons/cart.png" alt="">
      <span class="hidden sm:block group-hover:opacity-[var(--header-opacity)]  ">{{ $t('header.cart') }}</span>
    </NuxtLink> 

    <button
      @click="emit('openMenu')"
      class="lg:hidden hover:opacity-[var(--header-opacity)] cursor-pointer"
      id="burger-menu-trigger"
      type="button"
      aria-controls="header-mobile-nav"
      :aria-expanded="menuOpen ? 'true' : 'false'"
      aria-label="Open menu"
    >
      <div class="text-2xl leading-none ">
        ☰
      </div>
        
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ menuOpen?: boolean }>()
const emit = defineEmits(['openMenu'])
</script>