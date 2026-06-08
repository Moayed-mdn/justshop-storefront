<template>
  <div class="space-y-4">
    <div class="border-b border-(--color-border-default)">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          v-for="locale in locales"
          :key="locale.code"
          type="button"
          :class="[
            activeLocale === locale.code
              ? 'border-(--color-primary) text-(--color-primary)'
              : 'border-transparent text-(--color-text-secondary) hover:border-(--color-border-hover) hover:text-(--color-text-primary)',
            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium'
          ]"
          @click="activeLocale = locale.code"
        >
          {{ locale.label }}
          <span
            v-if="!isLocaleValid(locale.code)"
            class="ml-2 inline-flex items-center rounded-full bg-(--color-error-bg) px-2 py-0.5 text-xs font-medium text-(--color-error)"
          >
            Required
          </span>
        </button>
      </nav>
    </div>

    <!-- English Translation -->
    <div v-show="activeLocale === 'en'" class="space-y-4">
      <div>
        <label for="title-en" class="block text-sm font-medium text-(--color-text-primary) mb-2">
          Title (EN) *
        </label>
        <input
          id="title-en"
          v-model="localTranslations.en.title"
          type="text"
          required
          placeholder="Enter English title"
          class="w-full rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          @input="emitTranslations"
        />
      </div>

      <div>
        <label for="subtitle-en" class="block text-sm font-medium text-(--color-text-primary) mb-2">
          Subtitle (EN)
        </label>
        <textarea
          id="subtitle-en"
          v-model="localTranslations.en.subtitle"
          rows="3"
          placeholder="Enter English subtitle"
          class="w-full rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          @input="emitTranslations"
        />
      </div>

      <div>
        <label for="cta-text-en" class="block text-sm font-medium text-(--color-text-primary) mb-2">
          CTA Text (EN)
        </label>
        <input
          id="cta-text-en"
          v-model="localTranslations.en.cta_text"
          type="text"
          placeholder="e.g., Shop Now"
          class="w-full rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          @input="emitTranslations"
        />
      </div>
    </div>

    <!-- Arabic Translation -->
    <div v-show="activeLocale === 'ar'" class="space-y-4">
      <div>
        <label for="title-ar" class="block text-sm font-medium text-(--color-text-primary) mb-2">
          Title (AR) *
        </label>
        <input
          id="title-ar"
          v-model="localTranslations.ar.title"
          type="text"
          required
          dir="rtl"
          placeholder="أدخل العنوان بالعربية"
          class="w-full rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          @input="emitTranslations"
        />
      </div>

      <div>
        <label for="subtitle-ar" class="block text-sm font-medium text-(--color-text-primary) mb-2">
          Subtitle (AR)
        </label>
        <textarea
          id="subtitle-ar"
          v-model="localTranslations.ar.subtitle"
          rows="3"
          dir="rtl"
          placeholder="أدخل العنوان الفرعي بالعربية"
          class="w-full rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          @input="emitTranslations"
        />
      </div>

      <div>
        <label for="cta-text-ar" class="block text-sm font-medium text-(--color-text-primary) mb-2">
          CTA Text (AR)
        </label>
        <input
          id="cta-text-ar"
          v-model="localTranslations.ar.cta_text"
          type="text"
          dir="rtl"
          placeholder="مثال: تسوق الآن"
          class="w-full rounded-md border border-(--color-border-default) px-3 py-2 text-sm focus:border-(--color-primary) focus:outline-none focus:ring-1 focus:ring-(--color-primary)"
          @input="emitTranslations"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { HeroBannerTranslation } from '~/types/heroBanner'

const props = defineProps<{
  translations: HeroBannerTranslation[]
}>()

const emit = defineEmits<{
  'update:translations': [translations: HeroBannerTranslation[]]
}>()

const locales = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
]

// Active locale tab
const activeLocale = ref<'en' | 'ar'>('en')

// Local translations state
const localTranslations = ref({
  en: {
    locale: 'en',
    title: '',
    subtitle: '',
    cta_text: '',
  },
  ar: {
    locale: 'ar',
    title: '',
    subtitle: '',
    cta_text: '',
  },
})

// Initialize from props
function initializeTranslations() {
  if (props.translations && props.translations.length > 0) {
    props.translations.forEach((translation) => {
      if (translation.locale === 'en') {
        localTranslations.value.en = {
          locale: 'en',
          title: translation.title || '',
          subtitle: translation.subtitle || '',
          cta_text: translation.cta_text || '',
        }
      } else if (translation.locale === 'ar') {
        localTranslations.value.ar = {
          locale: 'ar',
          title: translation.title || '',
          subtitle: translation.subtitle || '',
          cta_text: translation.cta_text || '',
        }
      }
    })
  }
}

// Check if locale has required fields
function isLocaleValid(locale: 'en' | 'ar'): boolean {
  return !!localTranslations.value[locale].title
}

// Emit translations array
function emitTranslations() {
  const translations: HeroBannerTranslation[] = [
    {
      locale: 'en',
      title: localTranslations.value.en.title,
      subtitle: localTranslations.value.en.subtitle || undefined,
      cta_text: localTranslations.value.en.cta_text || undefined,
    },
    {
      locale: 'ar',
      title: localTranslations.value.ar.title,
      subtitle: localTranslations.value.ar.subtitle || undefined,
      cta_text: localTranslations.value.ar.cta_text || undefined,
    },
  ]
  
  emit('update:translations', translations)
}

// Watch for external changes
watch(() => props.translations, () => {
  initializeTranslations()
}, { immediate: true, deep: true })
</script>
