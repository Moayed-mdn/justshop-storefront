<template>
  <div>
    <UApp :toaster="toaster" >
      <NuxtLayout>
          <NuxtPage/>
        </NuxtLayout>
    </UApp>
  </div>
</template>



<script setup lang="ts">
import type { ToasterProps } from '@nuxt/ui';
import { useTheme } from '~/composables/useTheme'
import { useStoreTheme } from '~/composables/useStoreTheme'
import { generateFontLinks } from '~/utils/fontLoader'
import { createCacheKey, CacheResources } from '~~/src/core/cache/createCacheKey'
import { useStorefrontContext } from '~~/src/core/tenant/composables'

const { theme } = useTheme()
const { theme: storeTheme, fetchTheme, getThemeCSS } = useStoreTheme()
const storefrontContext = useStorefrontContext()
const { locale } = useI18n()

// Sync i18n locale to storefront context so API calls use the correct locale
watch(locale, (newLocale) => {
  storefrontContext.value.locale = newLocale
})

const head = useLocaleHead({
  // 'addDirAttribute' is now just 'dir'
  dir: true,
  // 'addSeoAttributes' is now just 'seo'
  seo: true 
})

const toaster:ToasterProps = { position: 'top-right'  }

// ✅ CRITICAL FIX: Computed cache key for locale reactivity
// Without computed, createCacheKey returns new object each time → no reactivity
const themeCacheKey = computed(() => createCacheKey({ 
  locale: locale.value,
  tenantId: storefrontContext.value.tenant?.id,
  resource: CacheResources.STORE_THEME 
}))

// Fetch theme during SSR and get the CSS synchronously
const { data: themeData } = await useAsyncData(
  themeCacheKey,  // Pass computed directly (NOT themeCacheKey.value)
  async () => {
    await fetchTheme()
    
    // Generate CSS while we have the theme available
    if (storeTheme.value) {
      const css = await getThemeCSS()
      return {
        theme: storeTheme.value,
        css: css
      }
    }
    
    return null
  }
)

// ✅ FIX BUG 3: Use function for proper reactivity on locale change
useHead(() => ({
  htmlAttrs: {
    lang: head.value.htmlAttrs?.lang,
    dir: head.value.htmlAttrs?.dir as 'ltr' | 'rtl' 
  },
  meta: [
    {
      name: 'theme-color',
      content: theme.value === 'dark' ? '#0b0b0b' : '#ffffff'
    }
  ],
  script: [
    {
      children: `(function () {
        try {
          const saved = localStorage.getItem('theme')
          const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
          const theme = saved || (preferred ? 'dark' : 'light')
          document.documentElement.setAttribute('data-theme', theme)
        } catch (e) {
          document.documentElement.setAttribute('data-theme', 'light')
        }
      })();`
    }
  ]
}))

// Inject theme CSS synchronously using the cached data
useHead(() => {
  if (!themeData.value) {
    return {}
  }
  
  return {
    style: [
      {
        id: 'merchant-theme',
        innerHTML: themeData.value.css
      }
    ],
    link: themeData.value.theme 
      ? generateFontLinks(themeData.value.theme)
      : []
  }
})
</script>
