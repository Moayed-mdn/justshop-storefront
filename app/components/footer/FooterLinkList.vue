<script setup>
const { t } = useI18n();

defineProps({
  title: {
    type: String,
    required: true,
  },
  links: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="text-center">
    <div class="font-bold text-[var(--footer-heading)]">{{ t(title) }}</div>
    <ul class="mt-4 space-y-2">
      <li v-for="link in links" :key="link.key">
        <a :href="link.href || '#'" class="text-[var(--footer-link)] hover:text-[var(--footer-link-hover)] font-medium relative left-0 hover:left-2 transition-all">
          {{ t(link.key) }}
        </a>
      </li>
    </ul>
  </div>
</template>