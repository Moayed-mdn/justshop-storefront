<template>
  <div class="flex px-2 flex-row h-[--header-height] justify-between items-center gap-[--header-gap-base]">
      <slot name="start"/>
      <slot name="center"/>
      <slot name="end"/>
  </div>
</template>