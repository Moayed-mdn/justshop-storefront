<template>
    <div class="bg-(--color-bg-elevated) border-b border-(--color-border-default)">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <nav class="flex items-center gap-2 text-sm text-(--color-text-secondary)">
          <NuxtLinkLocale to="/" class="hover:text-(--color-primary) transition-colors">
            {{ $t('cart.breadcrumb_home') }}
          </NuxtLinkLocale>
          <span>/</span>
          <span class="text-(--color-text-primary) font-medium">{{ $t('cart.breadcrumb_cart') }}</span>
        </nav>
      </div>
    </div>
  </template>