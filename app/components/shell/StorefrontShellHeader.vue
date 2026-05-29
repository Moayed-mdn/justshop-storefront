<template>
  <header
    class="relative w-full bg-[--header-bg] px-[--site-gutter] shadow-[--header-shadow] z-[--header-z]"
    data-storefront-shell="header"
  >
    <nav
      v-if="shellConfig.showRuntimeNavigation && runtimeHeaderItems.length"
      aria-label="Storefront primary navigation"
      class="border-b border-[--color-border-default] py-2"
    >
      <ul class="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-[--color-text-secondary]">
        <li v-for="item in runtimeHeaderItems" :key="item.id">
          <component
            :is="item.external ? 'a' : 'NuxtLinkLocale'"
            :href="item.external ? item.path : undefined"
            :to="item.external ? undefined : item.path"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noreferrer noopener' : undefined"
            class="transition-colors hover:text-[--color-primary]"
          >
            {{ item.label }}
          </component>
        </li>
      </ul>
    </nav>

    <HeaderTopRow>
      <template #start>
        <HeaderLogo />
      </template>

      <template #center>
        <div
          v-if="!isMinimal"
          class="hidden lg:flex flex-1 items-center justify-center gap-[--header-gap-wide]"
        >
          <HeaderLinks v-if="!runtimeHeaderItems.length" />
          <HeaderSearchInput
            v-if="shellConfig.showSearch"
            class="max-w-md hidden lg:flex"
          />
        </div>
      </template>

      <template #end>
        <HeaderActions
          v-if="shellConfig.showCart || shellConfig.showAccount || !isMinimal"
          :menu-open="showLinks"
          @open-menu="showLinks = !showLinks"
        />
      </template>
    </HeaderTopRow>

    <div
      v-if="shellConfig.showSearch && !isMinimal"
      class="mb-2 w-full lg:hidden"
    >
      <HeaderSearchInput />
    </div>
  </header>

  <HeaderBurger
    v-if="!isMinimal"
    v-model:show-links="showLinks"
    class="lg:hidden"
  />
</template>

<script setup lang="ts">
import { useStorefrontContext } from '~~/src/core/tenant/composables'
import { useStorefrontShell } from '~/composables/useStorefrontShell'

const { config: shellConfig, isMinimal } = useStorefrontShell()
const context = useStorefrontContext()

const runtimeHeaderItems = computed(() => context.value.navigation?.header ?? [])

const showLinks = ref(false)
const isDesktop = useMediaQuery('(min-width: 1024px)')

provide('closeMenu', () => {
  showLinks.value = false
})

watch(isDesktop, (val) => {
  if (val) {
    showLinks.value = false
  }
})
</script>
