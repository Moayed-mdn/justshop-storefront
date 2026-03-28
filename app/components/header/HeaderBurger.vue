<template>
  <div
    ref="wrapper" 
    class="absolute w-full bg-(--header-burger-bg) transition duration-(--header-burger-duration)
     inset-s-0 mt-2 z-(--header-burger-z)
     top-(--header-burger-top-mobile) sm:top-(--header-burger-top)
     "
    :class="showLinks? 'translate-y-0': '-translate-y-250'" 
    
    id="header-mobile-nav"
    role="navigation"
    :aria-hidden="showLinks ? 'false' : 'true'"
      >
    <HeaderLinks mobile/>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  showLinks: Boolean,
  burgerButtonRef: {
    type: Object,
    default: null
  }
})
 
const closeMenu = inject('closeMenu') as () => void

const wrapper = ref(null)

onClickOutside(
    wrapper,
    closeMenu,
    {
      ignore: ['#burger-menu-trigger']
    }
)


</script>