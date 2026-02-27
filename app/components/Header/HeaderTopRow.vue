<template>
  <div class="flex flex-row h-[var(--header-height)] justify-between items-center gap-4">
      <slot name="start"/>
      <slot name="center"/>
      <slot name="end"/>
  </div>
</template>