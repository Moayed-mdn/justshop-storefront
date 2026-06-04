<template>
  <section class="runtime-cta-section">
    <div class="runtime-cta-section__inner">

      <h2 v-if="title" class="runtime-cta-section__title">{{ title }}</h2>
      <p v-if="subtitle" class="runtime-cta-section__subtitle">{{ subtitle }}</p>

      <!-- CTA buttons -->
      <div v-if="ctas.length" class="runtime-cta-section__buttons">
        <NuxtLink
          v-for="(cta, i) in ctas"
          :key="i"
          :to="cta.url || '/'"
          class="runtime-cta-section__btn"
          :class="`runtime-cta-section__btn--${cta.style || 'primary'}`"
        >
          {{ cta.label }}
        </NuxtLink>
      </div>

      <!-- Trust badges -->
      <ul v-if="trustBadges.length" class="runtime-cta-section__badges">
        <li v-for="(badge, i) in trustBadges" :key="i" class="runtime-cta-section__badge">
          <span class="runtime-cta-section__badge-icon">✓</span>
          {{ badge }}
        </li>
      </ul>

    </div>
  </section>
</template>

<script setup lang="ts">
import type { RuntimeSectionComponentProps } from '../types'

const props = defineProps<RuntimeSectionComponentProps>()

const title    = computed(() => typeof props.data.title    === 'string' ? props.data.title    : '')
const subtitle = computed(() => typeof props.data.subtitle === 'string' ? props.data.subtitle : '')

const content = computed(() => {
  const c = props.data.content
  return c && typeof c === 'object' && !Array.isArray(c) ? c as Record<string, unknown> : {}
})

type CtaButton = { label: string; url: string; style?: string }

const ctas = computed<CtaButton[]>(() => {
  const arr = content.value.ctas
  if (!Array.isArray(arr)) return []
  return arr.filter((c): c is CtaButton =>
    c && typeof c === 'object' && 'label' in c)
})

const trustBadges = computed<string[]>(() => {
  const arr = content.value.trust_badges
  if (!Array.isArray(arr)) return []
  return arr.filter((b): b is string => typeof b === 'string')
})
</script>

<style scoped>
.runtime-cta-section {
  width: 100%;
  background: linear-gradient(135deg, var(--color-primary, #003d29) 0%, #005c3e 100%);
  color: #fff;
}

.runtime-cta-section__inner {
  max-width: 48rem;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  text-align: center;
}

.runtime-cta-section__title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #fff;
}

.runtime-cta-section__subtitle {
  margin: 0 0 2.5rem;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: rgba(255,255,255,0.85);
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
}

.runtime-cta-section__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.runtime-cta-section__btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.75rem;
  border-radius: 9999px;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.15s;
  white-space: nowrap;
}
.runtime-cta-section__btn:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}

.runtime-cta-section__btn--primary {
  background: #fff;
  color: var(--color-primary, #003d29);
}

.runtime-cta-section__btn--secondary {
  background: rgba(255,255,255,0.15);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.4);
}

.runtime-cta-section__btn--outline {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255,255,255,0.6);
}

/* Trust badges */
.runtime-cta-section__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.runtime-cta-section__badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: rgba(255,255,255,0.8);
}

.runtime-cta-section__badge-icon {
  font-size: 0.8125rem;
  color: #6ee7b7;
  font-weight: 700;
}
</style>
