<template>
  <ProfileSectionCard>
    <h2 class="text-lg font-semibold text-gray-900 mb-1">{{ title }}</h2>
    <p class="text-sm text-gray-500 mb-4">{{ subtitle }}</p>

    <form class="space-y-4" @submit.prevent="$emit('submit')">
      <ProfileFormField
        v-if="showCurrentPassword"
        id="current_password"
        v-model="model.current_password"
        :label="currentPasswordLabel"
        type="password"
        required
        :error="errors?.current_password?.[0]"
      />

      <ProfileFormField
        id="new_password"
        v-model="model.password"
        :label="newPasswordLabel"
        type="password"
        required
        :error="errors?.password?.[0]"
      />

      <ProfileFormField
        id="password_confirmation"
        v-model="model.password_confirmation"
        :label="confirmPasswordLabel"
        type="password"
        required
      />

      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 text-sm font-medium text-white bg-[#003D29] rounded-md hover:bg-[#00251C] disabled:opacity-50 transition-colors"
        >
          {{ loading ? savingButtonText : submitButtonText }}
        </button>
      </div>
    </form>
  </ProfileSectionCard>
</template>

<script setup lang="ts">
interface Model {
  current_password: string
  password: string
  password_confirmation: string
}

interface Props {
  title: string
  subtitle: string

  model: Model
  showCurrentPassword: boolean

  currentPasswordLabel: string
  newPasswordLabel: string
  confirmPasswordLabel: string

  submitButtonText: string
  savingButtonText: string

  loading?: boolean
  errors?: Record<string, string[]> | null
}

withDefaults(defineProps<Props>(), {
  loading: false,
  errors: null,
})

defineEmits<{
  (e: 'submit'): void
}>()
</script>
