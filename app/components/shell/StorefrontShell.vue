<template>
  <div
    class="flex min-h-screen flex-col bg-[--color-bg-page] text-[--color-text-primary]"
    data-storefront-shell="root"
  >
    <Topbar v-if="shellConfig.showTopbar" />
    <template v-for="section in layoutOrder" :key="section">
      <StorefrontShellHeader v-if="section === 'header'" />
      <main v-else-if="section === 'content'" class="flex-1">
        <slot />
      </main>
      <StorefrontShellFooter v-else-if="section === 'footer'" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
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

const layoutOrder = inject<string[]>('layoutOrder', ['header', 'content', 'footer'])
</script>
