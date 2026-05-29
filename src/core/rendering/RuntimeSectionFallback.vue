<template>
  <div class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-slate-600">
    <p class="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
      Section unavailable
    </p>
    <p class="mt-3 text-base">
      The runtime section type `{{ type }}` could not be rendered.
    </p>
    <p v-if="component" class="mt-2 text-sm text-slate-500">
      Requested component: {{ component }}
    </p>
    <p v-if="state !== 'ready'" class="mt-2 text-sm text-slate-500">
      Section state: {{ state }}
    </p>
    <p v-if="reasonLabel" class="mt-2 text-sm text-slate-500">
      Reason: {{ reasonLabel }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  type: string
  component?: string | null
  state?: 'ready' | 'empty' | 'error'
  reason?: 'unknown_component' | 'invalid_props'
}>(), {
  component: null,
  state: 'ready',
})

const reasonLabel = computed(() => {
  switch (props.reason) {
    case 'unknown_component':
      return 'The runtime registry has no matching component entry.'
    case 'invalid_props':
      return 'The section DTO props are missing or invalid for this component.'
    default:
      return ''
  }
})
</script>
