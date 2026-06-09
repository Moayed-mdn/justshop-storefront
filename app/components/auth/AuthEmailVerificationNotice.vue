<template>
  <div
    class="space-y-3 p-4 border-l-4 border-(--color-primary) rounded-r-md"
    :style="{ background: 'var(--color-bg-surface)' }"
    role="status"
    aria-live="polite"
  >
    <div class="text-sm" :style="{ color: 'var(--color-text-primary)' }">
      <slot name="content" />
    </div>

    <button
      type="button"
      @click="onResend"
      :disabled="loading || !email"
      class="w-full px-4 py-2 text-sm font-medium text-(--color-on-primary)
             bg-(--color-primary) border border-transparent rounded-md
             hover:bg-(--color-primary-hover) focus:outline-none focus:ring-2
             focus:ring-(--color-primary)/30 disabled:opacity-50 transition-colors"
    >
      {{ loading ? sendingText : resendText }}
    </button>

    <p v-if="message" class="text-xs text-(--color-primary) font-medium" role="status">
      {{ message }}
    </p>

    <p v-if="error" class="text-xs" role="alert" :style="{ color: 'var(--color-error)' }">
      {{ error }}
    </p>

    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import type { ApiError } from '~~/types/api'

const props = defineProps<{
  email: string
  sendingText: string
  resendText: string
  resend: (email: string) => Promise<{ message?: string }>
  alreadyVerifiedTitle?: string
}>()

const loading = ref(false)
const message = ref('')
const error = ref('')

const toast = useToast()

const onResend = async () => {
  if (!props.email) return

  loading.value = true
  message.value = ''
  error.value = ''

  try {
    const result = await props.resend(props.email)
    message.value = result.message || ''

    if (message.value) {
      useAppToast().showSuccessToast(message.value)
    }
  } catch (err: any) {
    const apiMessage: string | undefined = err?.data?.message

    if (apiMessage?.toLowerCase?.().includes('already verified')) {
      message.value = apiMessage
      toast.add({
        title: props.alreadyVerifiedTitle || 'Info',
        description: apiMessage,
        color: 'info',
        icon: 'i-heroicons-information-circle',
        duration: 5000,
      })
      return
    }

    const errorPayload = err as Error & { data: ApiError }
    error.value = errorPayload.data?.message || apiMessage || ''
  } finally {
    loading.value = false
  }
}
</script>
