<template>
    <div class="flex items-start">
      <span class="text-xs mt-1">{{ parts.currency }}</span>
      <span :class="integerClass">{{ parts.integer }}</span>
      <span class="text-xs mt-1">
        {{ decimalSeparator }}{{ parts.decimal }}
      </span>
    </div>
  </template>
  
  <script setup lang="ts">
  const { locale } = useI18n()
  
  const props = withDefaults(defineProps<{
    price: number | string
    currency?: string
    integerClass?: string
  }>(), {
    currency: 'USD',
    integerClass: 'text-lg'
  })
  
  const parts = computed(() => {
    const value = Number(props.price || 0)
  
    const formatter = new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency: props.currency,
      minimumFractionDigits: 2,
    })
  
    const formattedParts = formatter.formatToParts(value)
  
    return {
      currency: formattedParts.find(p => p.type === 'currency')?.value || '',
      integer: formattedParts.find(p => p.type === 'integer')?.value || '0',
      decimal: formattedParts.find(p => p.type === 'fraction')?.value || '00',
    }
  })
  
  const decimalSeparator = computed(() => {
    const test = new Intl.NumberFormat(locale.value).formatToParts(1.1)
    return test.find(p => p.type === 'decimal')?.value || '.'
  })
  </script>