<template>
    <span
      class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full"
      :class="classes"
    >
      <span class="w-1.5 h-1.5 rounded-full" :class="dotClass"></span>
      {{ label }}
    </span>
  </template>
  
  <script setup lang="ts">
  const props = defineProps<{
    status: string
    type?: 'order' | 'payment'
  }>()
  
  const { t } = useI18n()
  
  const label = computed(() => {
    const prefix = props.type === 'payment' ? 'orders.payment_' : 'orders.status_'
    return t(`${prefix}${props.status}`)
  })
  
  const classes = computed(() => {
    const map: Record<string, string> = {
      pending:    'bg-yellow-50 text-yellow-700',
      processing: 'bg-blue-50 text-blue-700',
      shipped:    'bg-purple-50 text-purple-700',
      delivered:  'bg-green-50 text-green-700',
      cancelled:  'bg-red-50 text-red-700',
      paid:       'bg-green-50 text-green-700',
      failed:     'bg-red-50 text-red-700',
      refunded:   'bg-orange-50 text-orange-700',
    }
    return map[props.status] || 'bg-gray-50 text-gray-700'
  })
  
  const dotClass = computed(() => {
    const map: Record<string, string> = {
      pending:    'bg-yellow-500',
      processing: 'bg-blue-500',
      shipped:    'bg-purple-500',
      delivered:  'bg-green-500',
      cancelled:  'bg-red-500',
      paid:       'bg-green-500',
      failed:     'bg-red-500',
      refunded:   'bg-orange-500',
    }
    return map[props.status] || 'bg-gray-500'
  })
  </script>