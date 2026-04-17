<template>
  <ProfileSectionCard>
    <h2 class="text-lg font-semibold mb-4" :style="{ color: 'var(--profile-title)' }">{{ title }}</h2>

    <div class="flex items-center gap-6">
      <ProfileAvatarPreview :avatar-url="avatarUrl" :initials="initials" />

      <ProfileAvatarFileInput
        :button-text="buttonText"
        :hint="hint"
        @change="(file) => $emit('change', file)"
      />
    </div>
  </ProfileSectionCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  avatarUrl?: string | null
  initials: string
  buttonText: string
  hint?: string
}

withDefaults(defineProps<Props>(), {
  avatarUrl: null,
  hint: undefined,
})

defineEmits<{
  (e: 'change', file: File): void
}>()
</script>
