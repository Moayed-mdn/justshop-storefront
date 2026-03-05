<template>
  <div class="
    w-full flex items-center overflow-hidden transition-all duration-[var(--header-duration)]
    bg-[var(--header-search-bg)]
    border border-[var(--header-search-border)] rounded-[var(--header-search-radius)] px-3
    focus-within:border-[var(--header-search-focus)] focus-within:ring-1 focus-within:ring-[var(--header-search-focus)]
    h-[var(--header-mobile-search-height)] lg:h-10 
  ">
    <label for="header-search" class="cursor-pointer text-[var(--header-search-placeholder)] hover:text-[var(--header-search-text)]">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.33317 3.33317C5.57175 3.33317 3.33317 5.57175 3.33317 8.33317C3.33317 11.0946 5.57175 13.3332 8.33317 13.3332C11.0946 13.3332 13.3332 11.0946 13.3332 8.33317C13.3332 5.57175 11.0946 3.33317 8.33317 3.33317ZM1.6665 8.33317C1.6665 4.65127 4.65127 1.6665 8.33317 1.6665C12.0151 1.6665 14.9998 4.65127 14.9998 8.33317C14.9998 9.87376 14.4773 11.2923 13.5997 12.4212L18.0891 16.9106C18.4145 17.236 18.4145 17.7637 18.0891 18.0891C17.7637 18.4145 17.236 18.4145 16.9106 18.0891L12.4212 13.5997C11.2923 14.4773 9.87376 14.9998 8.33317 14.9998C4.65127 14.9998 1.6665 12.0151 1.6665 8.33317Z" 
          fill="currentColor" />
      </svg>
      <span class="sr-only">{{ $t('header.search_placeholder') }}</span>
    </label>
    
    <input 
      id="header-search" 
      v-model="searchQuery"
      type="search"  
      :placeholder="$t('header.search_placeholder')" 
      class="bg-transparent outline-none border-none flex-1 px-2 text-base lg:text-sm text-[var(--header-search-text)] placeholder:text-[var(--header-search-placeholder)]"
      @keydown.enter="handleSearch"
    >

    <!-- Now this is the ONLY 'X' button -->
    <button 
      v-if="searchQuery" 
      type="button"
      @click="searchQuery = ''"
      class="text-xs text-[var(--header-search-placeholder)] hover:text-[var(--header-search-text)] px-1"
    >
      ✕
    </button>
  </div>
</template>

<script setup>
const searchQuery = ref('')
const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  console.log('Searching for:', searchQuery.value)
}
</script>
