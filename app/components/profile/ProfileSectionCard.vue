<template>
  <div class="rounded-lg shadow-sm p-6" :class="cardClass" :style="{ backgroundColor: 'var(--profile-card-bg)', borderColor: 'var(--profile-card-border)' }">
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
