<template>
  <ProfileSectionCard card-class="border">
    <h2 class="text-lg font-semibold mb-1" :style="{ color: 'var(--profile-danger-title)' }">{{ title }}</h2>
    <p class="text-sm mb-4" :style="{ color: 'var(--profile-subtitle)' }">{{ subtitle }}</p>

    <button
      class="px-6 py-2 text-sm font-medium border rounded-md transition-colors hover:bg-(--profile-danger-btn-hover-bg)"
      :style="{ color: 'var(--profile-danger-btn-text)', borderColor: 'var(--profile-danger-btn-border)' }"
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
