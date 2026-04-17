<template>
    <div class="min-h-[60vh] animate-pulse" :style="{ background: 'var(--color-bg-surface)' }">
      <!-- Breadcrumb Skeleton -->
      <div
        class="border-b"
        :style="{ background: 'var(--color-bg-page)', borderColor: 'var(--color-border-default)' }"
      >
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div class="flex items-center gap-2">
            <div class="h-4 w-12 rounded" :style="{ background: 'var(--color-bg-card)' }"></div>
            <span :style="{ color: 'var(--color-text-muted)' }">/</span>
            <div class="h-4 w-20 rounded" :style="{ background: 'var(--color-bg-card)' }"></div>
          </div>
        </div>
      </div>
  
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <!-- Header Skeleton -->
        <div class="flex items-end justify-between mb-6">
          <div>
            <div class="h-8 w-48 rounded mb-2" :style="{ background: 'var(--color-bg-card)' }"></div>
            <div class="h-4 w-64 rounded" :style="{ background: 'var(--color-bg-card)' }"></div>
          </div>
          <div class="h-5 w-32 rounded" :style="{ background: 'var(--color-bg-card)' }"></div>
        </div>
  
        <!-- Filters Skeleton -->
        <div
          class="rounded-lg border p-4 mb-6"
          :style="{ background: 'var(--color-bg-page)', borderColor: 'var(--color-border-default)' }"
        >
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex gap-2 flex-1">
              <div v-for="i in 4" :key="i" class="h-8 w-20 rounded-full" :style="{ background: 'var(--color-bg-card)' }"></div>
            </div>
            <div class="flex gap-2">
              <div class="h-8 w-32 rounded" :style="{ background: 'var(--color-bg-card)' }"></div>
              <div class="h-8 w-32 rounded" :style="{ background: 'var(--color-bg-card)' }"></div>
            </div>
          </div>
        </div>
  
        <!-- Orders List Skeleton -->
        <div class="space-y-4">
          <div
            v-for="i in 3"
            :key="i"
            class="rounded-lg border p-4"
            :style="{ background: 'var(--color-bg-page)', borderColor: 'var(--color-border-default)' }"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="space-y-2 flex-1">
                <div class="h-5 w-32 rounded" :style="{ background: 'var(--color-bg-card)' }"></div>
                <div class="h-4 w-48 rounded" :style="{ background: 'var(--color-bg-card)' }"></div>
              </div>
              <div class="h-6 w-20 rounded-full" :style="{ background: 'var(--color-bg-card)' }"></div>
            </div>
            <div class="space-y-2">
              <div class="h-4 rounded w-full" :style="{ background: 'var(--color-bg-card)' }"></div>
              <div class="h-4 rounded w-3/4" :style="{ background: 'var(--color-bg-card)' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>