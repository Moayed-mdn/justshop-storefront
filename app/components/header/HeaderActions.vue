<template>
  <div class="flex items-center gap-(--header-gap-wide)">

    <!-- ══ NOT LOGGED IN ═══ -->
    <NuxtLinkLocale
      v-if="!isLoggedIn"
      :to="routes.login()"
      class="group flex font-semibold gap-(--header-gap-tight) items-center transition-all duration-(--header-duration) hover:text-(--color-accent) cursor-pointer"
    >
      <img class="w-4 sm:w-6" src="~/assets/icons/user.png" alt="">
      <span class="hidden sm:block group-hover:opacity-(--header-opacity)">
        {{ $t('header.account') }}
      </span>
    </NuxtLinkLocale>

    <!-- ═══ LOGGED IN — Profile Dropdown ═══ -->
    <HeaderProfileDropdown v-else />

    <!-- ═══ CART ═══ -->
    <NuxtLinkLocale
      class="relative group flex font-semibold gap-(--header-gap-tight) items-center transition-all duration-(--header-duration) hover:text-(--color-accent) cursor-pointer"
      :to="routes.cart()"
    >
      <img class="w-5 sm:w-6" src="~/assets/icons/cart.png" alt="">
      <span class="hidden sm:block group-hover:opacity-(--header-opacity)">{{ $t('header.cart') }}</span>
      <client-only>
      <div
        v-if="cart.itemsCount.value > 0"
        class="absolute -top-1 sm:-top-2 -right-1 sm:right-8 bg-(--color-accent) rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs"
        :style="{ color: 'var(--color-text-inverse)' }"
      >
        {{ cart.itemsCount.value }}
      </div>
      </client-only>
    </NuxtLinkLocale>
  </div>
</template>

<script setup lang="ts">
// ThemeToggle import removed - dark mode disabled

const cart = useCart()
const { isLoggedIn } = useAuth()
const routes = useStorefrontRoutes()
</script>
