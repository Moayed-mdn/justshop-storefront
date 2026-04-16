<template>
  <div class="bg-white rounded-lg shadow-sm p-6" :class="cardClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  cardClass?: string
}

withDefaults(defineProps<Props>(), {
  cardClass: '',
})
</script>
