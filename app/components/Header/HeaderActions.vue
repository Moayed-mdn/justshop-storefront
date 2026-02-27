<template>
    <div class="flex items-center gap-6">
      <HeaderLanguageSwitcher/>
  
      <NuxtLink class="flex gap-2 items-center   transition-all duration-300  hover:scale-105 hover:text-[var(--color-primary-hover)]" to="#">
        <img class="w-4 sm:w-6" src="~/assets/icons/user.png" alt="">
        <span class="hidden sm:block">{{ $t('header.account') }}</span>
      </NuxtLink>
  
      <NuxtLink class="flex gap-2 items-center transition-all duration-300  hover:scale-105 hover:text-[var(--color-primary-hover)]" to="#">
        <img class="w-4 sm:w-6" src="~/assets/icons/cart.png" alt="">
        <span class="hidden sm:block ">{{ $t('header.cart') }}</span>
      </NuxtLink> 
  
      <div
        @click="emit('openMenu')"
        class="lg:hidden hover:opacity-60 cursor-pointer"
        id="burger-menu-trigger"
      >
        =
      </div>
    </div>
</template>
  
<script setup lang="ts">
const emit = defineEmits(['openMenu'])


</script>
