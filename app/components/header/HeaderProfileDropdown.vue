<!-- components/HeaderProfileDropdown.vue -->
<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      data-testid="user-menu-trigger"
      class="group flex font-semibold gap-(--header-gap-tight) items-center transition-all duration-(--header-duration) hover:text-(--header-action-hover-color) cursor-pointer"
    >
      <!-- Avatar or Initials -->
      <div class="w-5 h-5 sm:w-7 sm:h-7 rounded-full overflow-hidden bg-(--color-primary) flex items-center justify-center flex-shrink-0">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt=""
          class="w-full h-full object-cover"
        >
        <span v-else class="text-white text-[10px] sm:text-xs font-bold">
          {{ initials }}
        </span>
      </div>

      <span class="hidden sm:block group-hover:opacity-(--header-opacity) max-w-[100px] truncate">
        {{ user?.name?.split(' ')[0] || $t('header.profile') }}
      </span>

      <!-- Chevron -->
      <svg
        class="w-3 h-3 hidden sm:block transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-1"
    >
      <div
        v-if="isOpen"
        data-testid="profile-dropdown-trigger"
        class="header-profile-dropdown absolute ltr:right-0 rtl:left-0 mt-2 w-56 rounded-lg shadow-lg z-(--z-dropdown) py-1"
        :style="{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-default)' }"
      >
        <!-- User Info Header -->
        <div class="px-4 py-3 border-b" :style="{ borderColor: 'var(--color-border-default)' }">
          <p class="text-sm font-semibold truncate" :style="{ color: 'var(--color-text-primary)' }">{{ user?.name }}</p>
          <p class="text-xs truncate" :style="{ color: 'var(--color-text-muted)' }">{{ user?.email }}</p>
          <div v-if="user?.has_google_linked" class="flex items-center gap-1 mt-1">
            <img class="w-3 h-3" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="">
            <span class="text-xs" :style="{ color: 'var(--color-text-muted)' }">{{ $t('header.dropdown.google_linked') }}</span>
          </div>
        </div>

        <!-- Menu Items -->
    <NuxtLinkLocale
      :to="routes.profile()"
      class="header-profile-item flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
      :style="{ color: 'var(--color-text-secondary)' }"
    >
      <svg class="w-4 h-4" :style="{ color: 'var(--color-text-muted)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      {{ $t('header.dropdown.my_profile') }}
    </NuxtLinkLocale>

    <NuxtLinkLocale
      :to="routes.orders()"
      class="header-profile-item flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
      :style="{ color: 'var(--color-text-secondary)' }"
    >
      <svg class="w-4 h-4" :style="{ color: 'var(--color-text-muted)' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      {{ $t('header.dropdown.my_orders') }}
    </NuxtLinkLocale>

        <!-- Divider -->
        <div class="border-t my-1" :style="{ borderColor: 'var(--color-border-default)' }"></div>

        <button
          @click="handleLogout"
          data-testid="logout-button"
          class="header-profile-logout flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors cursor-pointer"
          :style="{ color: 'var(--color-error)' }"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {{ $t('header.dropdown.logout') }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const routes = useStorefrontRoutes()
const { user, logout } = useAuth()
const { getAvatarUrl, getInitials } = useAvatar()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const avatarUrl = computed(() => getAvatarUrl(user.value?.avatar))
const initials = computed(() => getInitials(user.value?.name))

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleLogout = async () => {
  isOpen.value = false
  await logout()
}

const onClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<style scoped>
.header-profile-item:hover {
  background: var(--color-bg-hover) !important;
}

.header-profile-logout:hover {
  background: color-mix(in srgb, var(--color-error) 12%, transparent) !important;
}
</style>