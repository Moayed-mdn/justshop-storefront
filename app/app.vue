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
  }
})
</script>
