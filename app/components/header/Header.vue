<template>
  <header class="relative px-(--site-gutter) w-full z-(--header-z) bg-(--header-bg) shadow-(--header-shadow) ">

    <HeaderTopRow>
      <template #start>
          <HeaderLogo/>
      </template>
      
      <!-- Center (Desktop only) -->
      <template #center>
          <div class="hidden lg:flex flex-1 items-center justify-center gap-(--header-gap-wide)">
              <HeaderLinks/>
              <HeaderSearchInput class="max-w-md hidden lg:flex" />
          </div>
      </template>

      <template #end>
          <HeaderActions  
            @open-menu="showLinks = !showLinks"
            :menu-open="showLinks"
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
    @update:showLinks="showLinks = false"
  />
</template>

<script setup>
const showLinks = ref(false)

const isDesktop = useMediaQuery('(min-width: 1024px)')

provide('closeMenu',() => {
  console.log('i am here')
  showLinks.value = false;
})

watch(isDesktop,(val)=>{
    if(val) showLinks.value = false
})

</script>
