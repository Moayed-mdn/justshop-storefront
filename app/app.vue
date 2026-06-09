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

const { theme } = useTheme()
const { theme: storeTheme, fetchTheme, getThemeCSS } = useStoreTheme()

const head = useLocaleHead({
  // 'addDirAttribute' is now just 'dir'
  dir: true,
  // 'addSeoAttributes' is now just 'seo'
  seo: true 
})

const toaster:ToasterProps = { position: 'top-right'  }

// Fetch theme during SSR and get the CSS synchronously
const { data: themeData } = await useAsyncData('store-theme', async () => {
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
})

useHead({
  htmlAttrs: {
    lang: () => head.value.htmlAttrs?.lang,
    dir: () => head.value.htmlAttrs?.dir as 'ltr' | 'rtl' 
  },
  meta: [
    {
      name: 'theme-color',
      content: () => theme.value === 'dark' ? '#0b0b0b' : '#ffffff'
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
})

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
