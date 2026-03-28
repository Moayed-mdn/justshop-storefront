<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-(--filter-sidebar-bg) z-(--z-modal) overflow-y-auto thin-scrollbar"
      @click.self="close"
    >
    
      <slot></slot>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const close = () => {
  emit('update:modelValue', false)
}

watch(() => props.modelValue, (isOpen) => {
  if (process.client) {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
}, { immediate: true })

onUnmounted(() => {
  if (process.client) {
    document.body.style.overflow = ''
  }
})
</script>