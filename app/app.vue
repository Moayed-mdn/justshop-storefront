<template>
  <div>
      <NuxtLayout>
        <NuxtPage/>
      </NuxtLayout>
  </div>
</template>


<script setup lang="ts">
const head = useLocaleHead({
  // 'addDirAttribute' is now just 'dir'
  dir: true,
  // 'addSeoAttributes' is now just 'seo'
  seo: true 
})

useHead({
  htmlAttrs: {
    lang: () => head.value.htmlAttrs?.lang,
    dir: () => head.value.htmlAttrs?.dir as 'ltr' | 'rtl' 
  }
})
</script>
