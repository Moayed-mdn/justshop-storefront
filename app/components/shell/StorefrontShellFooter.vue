<template>
  <div data-storefront-shell="footer">
    <!-- Runtime footer (from DB) - supports both flat links and grouped sections -->
    <footer
      v-if="shellConfig.showRuntimeNavigation && runtimeFooterItems.length"
      class="border-t"
      :style="{
        borderColor: 'var(--color-border, #e5e7eb)',
        backgroundColor: 'var(--color-bg-secondary, #f9fafb)'
      }"
    >
      <div class="mx-auto max-w-7xl px-6 py-12">
        <nav 
          aria-label="Storefront footer navigation"
          class="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6"
        >
          <!-- Iterate over all root items - can be groups or flat links -->
          <div v-for="item in runtimeFooterItems" :key="item.id">
            
            <!-- GROUP: Has children - render as section with header -->
            <div v-if="item.children?.length > 0" class="space-y-4">
              <h3 class="font-bold" :style="{ color: 'var(--color-text, #1f2937)' }">{{ item.label }}</h3>
              <ul class="space-y-2">
                <li v-for="child in item.children" :key="child.id">
                  <a
                    v-if="child.external"
                    :href="child.path"
                    target="_blank"
                    rel="noreferrer noopener"
                    class="footer-link text-sm transition-colors"
                    :style="{ color: 'var(--color-text-secondary, #6b7280)' }"
                  >
                    {{ child.label }}
                  </a>
                  <NuxtLinkLocale
                    v-else
                    :to="child.path"
                    class="footer-link text-sm transition-colors"
                    :style="{ color: 'var(--color-text-secondary, #6b7280)' }"
                  >
                    {{ child.label }}
                  </NuxtLinkLocale>
                </li>
              </ul>
            </div>
            
            <!-- FLAT: No children - render as single link -->
            <div v-else class="space-y-4">
              <a
                v-if="item.external"
                :href="item.path"
                target="_blank"
                rel="noreferrer noopener"
                class="footer-heading font-medium transition-colors"
                :style="{ color: 'var(--color-text, #1f2937)' }"
              >
                {{ item.label }}
              </a>
              <NuxtLinkLocale
                v-else
                :to="item.path"
                class="footer-heading font-medium transition-colors"
                :style="{ color: 'var(--color-text, #1f2937)' }"
              >
                {{ item.label }}
              </NuxtLinkLocale>
            </div>
            
          </div>
        </nav>
      </div>
    </footer>

    <!-- Static hardcoded Footer - fallback when no runtime navigation -->
    <Footer v-else-if="shellConfig.showFooter && !isMinimal && !isAuthTemplate" />
    <FooterAuth v-else-if="isMinimal || isAuthTemplate" />
  </div>
</template>

<script setup lang="ts">
import { useStorefrontContext } from '~~/src/core/tenant/composables'
import { useStorefrontShell } from '~/composables/useStorefrontShell'

const { config: shellConfig, isMinimal, isAuthTemplate } = useStorefrontShell()
const context = useStorefrontContext()

const runtimeFooterItems = computed(() => context.value.navigation?.footer ?? [])

// #region debug-point D:footer-render-state
watchEffect(() => {
  fetch('http://127.0.0.1:7777/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: 'storefront-footer-nav', runId: 'pre-fix', hypothesisId: 'D', location: 'app/components/shell/StorefrontShellFooter.vue', msg: '[DEBUG] storefront shell footer render state', data: { showRuntimeNavigation: shellConfig.value.showRuntimeNavigation, showFooter: shellConfig.value.showFooter, isMinimal: isMinimal.value, runtimeFooterCount: runtimeFooterItems.value.length, runtimeFooterLabels: runtimeFooterItems.value.map(item => item.label) }, ts: Date.now() }) }).catch(() => {})
})
// #endregion
</script>

<style scoped>
.footer-link:hover,
.footer-heading:hover {
  color: var(--color-accent, #ec4899) !important;
}
</style>

<style>
/* Active state for footer navigation links - unscoped for SSR compatibility */
nav[aria-label="Storefront footer navigation"] a.router-link-active,
nav[aria-label="Storefront footer navigation"] a.router-link-exact-active {
  color: var(--color-primary, #3b82f6) !important;
  font-weight: 600 !important;
}
</style>
