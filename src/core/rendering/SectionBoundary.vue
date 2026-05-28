<template>
  <div :data-section-id="sectionId" :data-section-type="sectionType" class="section-boundary">
    <NuxtErrorBoundary @error="handleError">
      <slot />
      <template #error="{ error }">
        <div class="section-error p-4 bg-red-50 text-red-600 border border-red-200 rounded">
          <p class="font-bold">Error rendering section: {{ sectionType }}</p>
          <p class="text-sm">{{ error }}</p>
          <button @click="recover(error)" class="mt-2 text-xs underline">Retry</button>
        </div>
      </template>
    </NuxtErrorBoundary>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  sectionId: string | number
  sectionType: string
}>()

const handleError = (error: any) => {
  console.error(`[SectionBoundary] Error in section ${props.sectionType}:`, error)
  // TODO: Log to telemetry
}

const recover = (error: any) => {
  error.value = null
}
</script>
