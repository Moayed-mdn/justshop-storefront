<!-- components/layout/CategoryHeader.vue -->
<template>
    <div class="border-b" :style="{ backgroundColor: 'var(--category-header-bg)', borderBottomColor: 'var(--category-header-border)' }">
      <div class="container mx-auto px-4 py-4 sm:py-6">
        <!-- Breadcrumb -->
        <nav
          v-if="breadcrumb?.length"
          class="flex items-center gap-2 text-sm mb-3"
          :style="{ color: 'var(--category-header-crumb)' }"
        >
          <NuxtLinkLocale :to="routes.home()" class="hover:text-(--color-primary) transition-colors">
            {{ $t('product.breadcrumb_home') }}
          </NuxtLinkLocale>
  
          <span>/</span>
  
          <NuxtLinkLocale :to="routes.shop()" class="hover:text-(--color-primary) transition-colors">
            {{ $t('product.breadcrumb_shop') }}
          </NuxtLinkLocale>
  
          <template v-for="(crumb, idx) in breadcrumb" :key="crumb.id">
            <span>/</span>
            <NuxtLinkLocale
              v-if="idx < breadcrumb.length - 1"
              :to="routes.category(crumb.slug)"
              class="hover:text-(--color-primary) transition-colors"
            >
              {{ crumb.name }}
            </NuxtLinkLocale>
            <span v-else class="font-medium" :style="{ color: 'var(--category-header-crumb-current)' }">
              {{ crumb.name }}
            </span>
          </template>
        </nav>
  
        <!-- Category Title -->
        <h1 class="text-xl sm:text-2xl font-bold" :style="{ color: 'var(--category-header-title)' }">
          {{ name }}
        </h1>
  
        <!-- Product Count -->
        <p v-if="totalProducts !== undefined" class="text-sm mt-1" :style="{ color: 'var(--category-header-count)' }">
          {{ totalProducts }} {{ totalProducts === 1 ? $t('cart.item') : $t('cart.items') }}
        </p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
import type { BreadcrumbItem } from '~~/types/product';

  const routes = useStorefrontRoutes()

  defineProps<{
    name: string
    breadcrumb?: BreadcrumbItem[]
    totalProducts?: number
  }>()
  </script>