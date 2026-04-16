<template>
    <div class="text-center py-16">
      <div class="w-20 h-20 mx-auto mb-4 text-gray-300">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-full h-full">
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="1"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          />
        </svg>
      </div>
      <h2 class="text-lg font-bold text-gray-900">{{ $t('orders.empty_title') }}</h2>
      <p class="text-sm text-gray-500 mt-1">{{ $t('orders.empty_description') }}</p>
      <NuxtLinkLocale
        to="/"
        class="inline-block mt-4 px-6 py-2 text-sm font-medium text-white bg-[#003D29]
               rounded-md hover:bg-[#00251C] transition-colors"
      >
        {{ $t('orders.start_shopping') }}
      </NuxtLinkLocale>
    </div>
  </template>