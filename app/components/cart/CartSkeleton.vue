<template>
    <div class="min-h-[60vh] bg-(--color-bg-surface) animate-pulse">
      <!-- Breadcrumb Skeleton -->
      <div class="bg-(--color-bg-elevated) border-b border-(--color-border-default)">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div class="flex items-center gap-2">
            <div class="h-4 w-12 bg-(--color-bg-hover) rounded"></div>
            <span class="text-(--color-text-muted)">/</span>
            <div class="h-4 w-16 bg-(--color-bg-hover) rounded"></div>
          </div>
        </div>
      </div>
  
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <!-- Title Skeleton -->
        <div class="flex items-center justify-between mb-6">
          <div class="h-8 w-48 bg-(--color-bg-hover) rounded"></div>
          <div class="h-5 w-24 bg-(--color-bg-hover) rounded"></div>
        </div>
  
        <!-- Two Column Layout -->
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <!-- Left: Cart Items Skeleton -->
          <div class="flex-1 space-y-3">
            <div v-for="i in 3" :key="i" class="bg-(--color-bg-elevated) rounded-lg p-4 border border-(--color-border-default)">
              <div class="flex gap-4">
                <div class="w-24 h-24 bg-(--color-bg-hover) rounded-md flex-shrink-0"></div>
                <div class="flex-1 space-y-3">
                  <div class="h-5 bg-(--color-bg-hover) rounded w-3/4"></div>
                  <div class="h-4 bg-(--color-bg-hover) rounded w-1/2"></div>
                  <div class="h-6 bg-(--color-bg-hover) rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Right: Summary Skeleton -->
          <div class="w-full lg:w-[380px] flex-shrink-0">
            <div class="bg-(--color-bg-elevated) rounded-lg p-6 border border-(--color-border-default) space-y-4">
              <div class="h-6 bg-(--color-bg-hover) rounded w-32"></div>
              <div class="space-y-2">
                <div class="h-4 bg-(--color-bg-hover) rounded"></div>
                <div class="h-4 bg-(--color-bg-hover) rounded"></div>
              </div>
              <div class="h-12 bg-(--color-bg-hover) rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>