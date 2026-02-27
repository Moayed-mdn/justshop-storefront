<template>
  <header class="relative px-4 w-full z-[var(--z-header)] bg-[var(--color-bg-page)] header-shadow">

    <HeaderTopRow>
      <template #start>
          <HeaderLogo/>
      </template>
      
      <!-- Center (Desktop only) -->
      <template #center>
          <div class="hidden lg:flex flex-1 items-center justify-center gap-6">
              <HeaderLinks/>
              <HeaderSearchInput class="max-w-md hidden lg:flex" />
          </div>
      </template>

      <template #end>
          <HeaderActions  
            @open-menu="showLinks = !showLinks"
            />
      </template>

    </HeaderTopRow>

    <div class="w-full mb-2 lg:hidden">
      <HeaderSearchInput/>
    </div>
  </header>


  <HeaderBurger
    class="lg:hidden"
    v-model:showLinks="showLinks"
  />
 
 
</template>

<script setup>
const showLinks = ref(false)

// const isDesktop = useMediaQuery('(min-width: 1024px)')

// watch(isDesktop,(val)=>{
//     if(val) showLinks.value = false
// })
//npx nuxt@latest module add vueuse
</script>