<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen"
    :style="{ background: 'var(--color-bg-surface)' }"
  >
    <div
      class="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md"
      :style="{ background: 'var(--color-bg-page)' }"
    >
      <slot />
    </div>
  </div>
</template>
