<template>
  <ProfileSectionCard card-class="border border-red-200">
    <h2 class="text-lg font-semibold text-red-600 mb-1">{{ title }}</h2>
    <p class="text-sm text-gray-500 mb-4">{{ subtitle }}</p>

    <button
      class="px-6 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
      @click="$emit('requestDelete')"
    >
      {{ deleteButtonText }}
    </button>

    <ProfileConfirmModal
      :open="confirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      :cancel-text="cancelText"
      :confirm-text="confirmText"
      :loading-text="loadingText"
      :loading="loading"
      @cancel="$emit('cancelDelete')"
      @confirm="$emit('confirmDelete')"
    />
  </ProfileSectionCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle: string

  deleteButtonText: string

  confirmOpen: boolean
  confirmTitle: string
  confirmMessage: string
  cancelText: string
  confirmText: string
  loadingText: string

  loading: boolean
}

defineProps<Props>()

defineEmits<{
  (e: 'requestDelete'): void
  (e: 'cancelDelete'): void
  (e: 'confirmDelete'): void
}>()
</script>
