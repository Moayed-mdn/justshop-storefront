<template>
  <div data-storefront-shell="footer">
    <footer
      v-if="shellConfig.showRuntimeNavigation && runtimeFooterItems.length"
      class="border-t border-slate-200 bg-slate-50"
    >
      <div class="mx-auto max-w-7xl px-6 py-6">
        <nav aria-label="Storefront footer navigation">
          <ul class="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
            <li v-for="item in runtimeFooterItems" :key="item.id">
              <component
                :is="item.external ? 'a' : 'NuxtLinkLocale'"
                :href="item.external ? item.path : undefined"
                :to="item.external ? undefined : item.path"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noreferrer noopener' : undefined"
                class="transition-colors hover:text-slate-900"
              >
                {{ item.label }}
              </component>
            </li>
          </ul>
        </nav>
      </div>
    </footer>

    <Footer v-if="shellConfig.showFooter && !isMinimal" />
    <FooterAuth v-else-if="isMinimal" />
  </div>
</template>

<script setup lang="ts">
import { useStorefrontContext } from '~~/src/core/tenant/composables'
import { useStorefrontShell } from '~/composables/useStorefrontShell'

const { config: shellConfig, isMinimal } = useStorefrontShell()
const context = useStorefrontContext()

const runtimeFooterItems = computed(() => context.value.navigation?.footer ?? [])
</script>
