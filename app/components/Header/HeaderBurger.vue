<template>
  <div
    ref="wrapper" 
    class="absolute w-full bg-[var(--color-bg-white)] transition duration-500 start-0 mt-2 z-[var(--z-dropdown)]"
    :class="showLinks? 'translate-y-0': 'translate-y-[-1000px]'" 
    :style="{top: burgerTop}"
      >
    <HeaderLinks mobile/>
  </div>
</template>


<script setup lang="ts">
const props = defineProps({
  showLinks: Boolean,
  burgerButtonRef: {  // Add this prop
    type: Object,
    default: null
  }
})
const emit = defineEmits(['update:showLinks'])
const wrapper = ref(null)
const burgerTop = 'var(--header-total-height)'


onClickOutside(
    wrapper,
    () => emit('update:showLinks', false),
    {
      ignore: ['#burger-menu-trigger']
    }
   
)


</script>