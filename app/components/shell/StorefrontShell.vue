<template>
  <div
    class="flex min-h-screen flex-col bg-[--color-bg-page] text-[--color-text-primary]"
    data-storefront-shell="root"
  >
    <Topbar v-if="shellConfig.showTopbar" />
    <StorefrontShellHeader />
    <main class="flex-1">
      <slot />
    </main>
    <StorefrontShellFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  defaultStorefrontShellConfig,
  provideStorefrontShell,
  type StorefrontShellVariant,
} from '~/composables/useStorefrontShell'

const props = withDefaults(defineProps<{
  variant?: StorefrontShellVariant
}>(), {
  variant: 'full',
})

const shellConfig = computed(() => defaultStorefrontShellConfig(props.variant))

provideStorefrontShell(shellConfig)
</script>
