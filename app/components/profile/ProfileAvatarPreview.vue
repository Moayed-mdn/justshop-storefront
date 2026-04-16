<template>
  <div class="relative group">
    <div class="w-20 h-20 rounded-full overflow-hidden bg-[#003D29] flex items-center justify-center">
      <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="w-full h-full object-cover">
      <span v-else class="text-white text-2xl font-bold">{{ initials }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  avatarUrl?: string | null
  initials: string
}

withDefaults(defineProps<Props>(), {
  avatarUrl: null,
})
</script>
