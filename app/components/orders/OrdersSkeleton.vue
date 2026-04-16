<template>
    <div class="min-h-[60vh] bg-gray-50 animate-pulse">
      <!-- Breadcrumb Skeleton -->
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div class="flex items-center gap-2">
            <div class="h-4 w-12 bg-gray-200 rounded"></div>
            <span class="text-gray-300">/</span>
            <div class="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
  
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <!-- Header Skeleton -->
        <div class="flex items-end justify-between mb-6">
          <div>
            <div class="h-8 w-48 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 w-64 bg-gray-200 rounded"></div>
          </div>
          <div class="h-5 w-32 bg-gray-200 rounded"></div>
        </div>
  
        <!-- Filters Skeleton -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex gap-2 flex-1">
              <div v-for="i in 4" :key="i" class="h-8 w-20 bg-gray-200 rounded-full"></div>
            </div>
            <div class="flex gap-2">
              <div class="h-8 w-32 bg-gray-200 rounded"></div>
              <div class="h-8 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
  
        <!-- Orders List Skeleton -->
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white rounded-lg border border-gray-200 p-4">
            <div class="flex justify-between items-start mb-4">
              <div class="space-y-2 flex-1">
                <div class="h-5 w-32 bg-gray-200 rounded"></div>
                <div class="h-4 w-48 bg-gray-200 rounded"></div>
              </div>
              <div class="h-6 w-20 bg-gray-200 rounded-full"></div>
            </div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>