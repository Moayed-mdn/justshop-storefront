<template>
    <div class="bg-white border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav class="flex items-center gap-2 text-sm text-gray-500">
          <NuxtLinkLocale to="/" class="hover:text-[#003D29] transition-colors">
            {{ $t('cart.breadcrumb_home') }}
          </NuxtLinkLocale>
          <span>/</span>
          <span class="text-gray-900 font-medium">{{ $t('cart.breadcrumb_cart') }}</span>
        </nav>
      </div>
    </div>
  </template>