<template>
    <div class="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">{{ $t('orders.title') }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ $t('orders.subtitle') }}</p>
      </div>
  
      <!-- Guest lookup link -->
      <NuxtLinkLocale
        to="/orders/track"
        class="text-sm text-[#003D29] hover:underline font-medium"
      >
        {{ $t('orders.guest_title') }}
      </NuxtLinkLocale>
    </div>
  </template>