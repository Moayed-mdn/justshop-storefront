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

const { theme } = useTheme()


const head = useLocaleHead({
  // 'addDirAttribute' is now just 'dir'
  dir: true,
  // 'addSeoAttributes' is now just 'seo'
  seo: true 
})

const toaster:ToasterProps = { position: 'top-right'  }

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
</script>
