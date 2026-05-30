<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    @click.self="$emit('cancel')"
  >
    <div class="rounded-lg p-6 max-w-sm w-full shadow-xl" :style="{ backgroundColor: 'var(--profile-card-bg)', borderColor: 'var(--profile-card-border)' }">
      <h3 class="text-lg font-bold" :style="{ color: 'var(--profile-title)' }">{{ title }}</h3>
      <p class="text-sm mt-2" :style="{ color: 'var(--profile-subtitle)' }">{{ message }}</p>
      <div v-if="requirePassword" class="mt-4">
        <input
          v-model="password"
          type="password"
          :placeholder="passwordPlaceholder"
          class="w-full px-3 py-2 text-sm border rounded-md"
          :style="{ color: 'var(--profile-text)', backgroundColor: 'var(--profile-input-bg)', borderColor: 'var(--profile-input-border)' }"
          @keyup.enter="handleConfirm"
        />
      </div>
      <div class="flex justify-end gap-3 mt-6">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium border rounded-md"
          :style="{ color: 'var(--profile-label)', borderColor: 'var(--profile-card-border)', backgroundColor: 'var(--profile-card-bg)' }"
          @click="$emit('cancel')"
        >
          {{ cancelText }}
        </button>
        <button
          type="button"
          :disabled="loading || (requirePassword && !password)"
          class="px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50"
          :style="{ color: 'var(--color-text-inverse)', backgroundColor: 'var(--color-error)' }"
          @click="handleConfirm"
        >
          {{ loading ? loadingText : confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  open: boolean
  title: string
  message: string
  cancelText: string
  confirmText: string
  loadingText: string
  loading: boolean
  requirePassword?: boolean
  passwordPlaceholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  requirePassword: false,
  passwordPlaceholder: 'Current password',
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
  (e: 'confirmWithPassword', password: string): void
}>()

const password = ref('')

const handleConfirm = () => {
  if (props.requirePassword) {
    emit('confirmWithPassword', password.value)
  } else {
    emit('confirm')
  }
}
</script>
