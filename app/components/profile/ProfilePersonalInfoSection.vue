<template>
  <ProfileSectionCard>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold" :style="{ color: 'var(--profile-title)' }">{{ title }}</h2>
      <ProfileGoogleLinkedBadge v-if="googleLinked" :text="googleLinkedText" />
    </div>

    <form class="space-y-4" @submit.prevent="$emit('submit')">
      <ProfileFormField
        id="name"
        v-model="model.name"
        :label="nameLabel"
        type="text"
        required
        :error="errors?.name?.[0]"
      />

      <ProfileFormField
        id="profile-email"
        v-model="model.email"
        :label="emailLabel"
        type="email"
        required
        :error="errors?.email?.[0]"
      />

      <ProfileFormField
        id="phone"
        v-model="model.phone"
        :label="phoneLabel"
        type="tel"
        :placeholder="phonePlaceholder"
        :error="errors?.phone?.[0]"
      />

      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="loading"
          :style="{ backgroundColor: primary, color: onPrimary }"
          class="px-6 py-2 text-sm font-medium rounded-md disabled:opacity-50 transition-colors hover-primary-btn"
        >
          {{ loading ? savingButtonText : saveButtonText }}
        </button>
      </div>
    </form>
  </ProfileSectionCard>
</template>

<script setup lang="ts">
// Inline theme colors for SSR compatibility
const getCSSVar = (varName: string, fallback: string): string => {
  if (!process.client) return fallback
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
    return value || fallback
  } catch {
    return fallback
  }
}

const primary = computed(() => getCSSVar('--color-primary', '#3b82f6'))
const onPrimary = computed(() => getCSSVar('--color-on-primary', '#ffffff'))

interface Model {
  name: string
  email: string
  phone: string
}

interface Props {
  title: string

  model: Model

  nameLabel: string
  emailLabel: string
  phoneLabel: string
  phonePlaceholder?: string

  saveButtonText: string
  savingButtonText: string

  googleLinked?: boolean
  googleLinkedText?: string

  loading?: boolean
  errors?: Record<string, string[]> | null
}

withDefaults(defineProps<Props>(), {
  phonePlaceholder: undefined,
  googleLinked: false,
  googleLinkedText: '',
  loading: false,
  errors: null,
})

defineEmits<{
  (e: 'submit'): void
}>()
</script>

<style scoped>
.hover-primary-btn:hover:not(:disabled) {
  filter: brightness(0.9);
}
</style>
