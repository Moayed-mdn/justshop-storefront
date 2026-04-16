<template>
    <div class="min-h-[60vh] bg-gray-50 animate-pulse">
      <!-- Breadcrumb Skeleton -->
      <div class="bg-white border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div class="flex items-center gap-2">
            <div class="h-4 w-12 bg-gray-200 rounded"></div>
            <span class="text-gray-300">/</span>
            <div class="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
  
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <!-- Title Skeleton -->
        <div class="flex items-center justify-between mb-6">
          <div class="h-8 w-48 bg-gray-200 rounded"></div>
          <div class="h-5 w-24 bg-gray-200 rounded"></div>
        </div>
  
        <!-- Two Column Layout -->
        <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <!-- Left: Cart Items Skeleton -->
          <div class="flex-1 space-y-3">
            <div v-for="i in 3" :key="i" class="bg-white rounded-lg p-4 border border-gray-200">
              <div class="flex gap-4">
                <div class="w-24 h-24 bg-gray-200 rounded-md flex-shrink-0"></div>
                <div class="flex-1 space-y-3">
                  <div class="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div class="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Right: Summary Skeleton -->
          <div class="w-full lg:w-[380px] flex-shrink-0">
            <div class="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
              <div class="h-6 bg-gray-200 rounded w-32"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded"></div>
              </div>
              <div class="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>