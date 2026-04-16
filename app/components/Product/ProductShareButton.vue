<template>
    <div class="flex items-center gap-4 pt-4">
      <button
        @click="handleShare"
        class="flex items-center gap-2 text-sm text-gray-600 hover:text-[#003D29]
               transition-colors cursor-pointer"
        type="button"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0
               2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-2.367-2.368m2.367
               2.368a3 3 0 00-2.367-2.368m0 0a3 3 0 10-4.702
               0M6.316 10.658a3 3 0 010 2.684" />
        </svg>
        {{ $t('product.share') }}
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    title: string
    description: string
  }>()
  
  const { t } = useI18n()
  const { showSuccessToast } = useAppToast()
  
  const handleShare = async () => {
    const url = window.location.href
  
    if (navigator.share) {
      try {
        await navigator.share({
          title: props.title,
          text: props.description,
          url,
        })
      } catch (err) {
        // User cancelled share
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        showSuccessToast(t('product.link_copied'))
      } catch (err) {
        console.error('Failed to copy link:', err)
      }
    }
  }
  </script>