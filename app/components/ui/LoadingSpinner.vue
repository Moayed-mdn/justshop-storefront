<template>
  <div class="flex h-full items-center justify-center bg-(--spinner-container-bg)">
    <div 
      class="animate-spin rounded-full 
      border-(length:--spinner-border-width) 
      border-(--spinner-border-color)
      border-b-(length:--spinner-border-active-width)
      border-b-(--spinner-border-active-color)"
      :class="sizeClass"
    ></div>
    <p v-if="message" class="ml-2 text-(--color-text-secondary)">{{ message }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'small':
      return 'h-(--spinner-size-small) w-(--spinner-size-small)'
    case 'large':
      return 'h-(--spinner-size-large) w-(--spinner-size-large)'
    default:
      return 'h-(--spinner-size-medium) w-(--spinner-size-medium)'
  }
})
</script>

