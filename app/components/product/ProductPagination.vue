<template>
    <div 
        v-if="!pending"
    class="
      flex items-center justify-center md: overflow-x-auto 
      whitespace-nowrap gap-(--pg-gap) bg-(--pg-bg)
       py-(--pg-padding)">
      <!-- Previous -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="btn-pagination px-(--pg-btn-padding-x-md)!"
      >
        < 
      </button>
  
      <!-- Page numbers -->
      <template v-for="(item, index) in pageList" :key="index">
        <!-- Ellipsis -->
        <span v-if="item === '...'" class="px-(--space-3) py-(--pg-btn-padding-y) text-(--pg-ellipsis-text)  md:m-0"> ... </span>
  
        <!-- Page button -->
        <button
          v-else
          @click="goToPage(item)"
          class="  py-(--pg-btn-padding-y) px-(--pg-btn-padding-x-md) rounded-full   font-medium min-w-(--pg-btn-min-width) md:min-w-(--pg-btn-min-width-md) transition cursor-pointer"
          :class="item === currentPage ? 'bg-(--pg-btn-active-bg) text-(--pg-btn-active-text) ' : ' bg-(--pg-btn-bg) hover:bg-(--pg-btn-hover-bg)'"
        >
            {{ item }}
        </button>
      </template>
  
      <!-- Next -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="btn-pagination px-(--pg-btn-padding-x-md)!"
      >
        >
      </button>
    </div>
  </template>
  
  <script setup>
  const route = useRoute()
  const router = useRouter()
  const isMobile = ref(false)

  const pending = inject('pending', ref(false));

  const props = defineProps({
    totalPages: { type: Number, required: true }
  })
  
  
  const currentPage = ref(Number(route.query.page) || 1)
  
  watch(
    () => route.query.page,
    (newPage) => {
      currentPage.value = Number(newPage) || 1
    }
  )
  
  const goToPage = (page) => {
    if (page >= 1 && page <= props.totalPages) {
  
      router.push({
        query: {
          ...route.query,
          page: page
        }
      })
    }
  }

  onMounted(()=>{
    isMobile.value = window.innerWidth <= 640
  })
  const pageList = computed(() => {
  const current = currentPage.value
  const last = props.totalPages
  const range = isMobile.value ? 1 : 2
  const list = [1]

  // Left side
  if (current - range > 2) {
    list.push('...')
  } else if (current - range === 2) {
    list.push(2)
  }

  // Middle
  const start = Math.max(2, current - range)
  const end = Math.min(last - 1, current + range)
  for (let i = start; i <= end; i++) {
    if (!list.includes(i)) list.push(i)
  }

  // Right side
  if (current + range < last - 1) {
    list.push('...')
  } else if (current + range === last - 1) {
    list.push(last - 1)
  }

  if (last > 1) list.push(last)
  return list
})


</script>


<style scoped>

.btn-pagination {
  position: sticky;
  cursor: pointer;
  border-radius: 9999px;
  border: 1px solid var(--pg-btn-border-color); 
  
  padding: var(--pg-btn-padding-y) var(--pg-btn-padding-x);

  background-color: var(--pg-btn-bg);
  color: var(--pg-btn-ctrl-text);
  
  transition: background-color 0.2s, opacity 0.2s; 
}

.btn-pagination:hover:not(:disabled) {
  background-color: var(--pg-btn-hover-bg);
}

.btn-pagination:disabled {
  opacity: var(--pg-disabled-opacity);
  cursor: not-allowed;
}


</style>