<template>
  <section class="runtime-content-section" :style="sectionStyle">
    <div class="runtime-content-section__inner">

      <!-- Section header -->
      <header v-if="title || subtitle" class="runtime-content-section__header">
        <h2 v-if="title" class="runtime-content-section__title">{{ title }}</h2>
        <p v-if="subtitle" class="runtime-content-section__subtitle">{{ subtitle }}</p>
      </header>

      <!-- Layout: body text + stats (story section) -->
      <template v-if="body">
        <p class="runtime-content-section__body">{{ body }}</p>
        <ul v-if="stats.length" class="runtime-content-section__stats">
          <li v-for="(stat, i) in stats" :key="i" class="runtime-content-section__stat" :style="cardStyle">
            <span class="runtime-content-section__stat-value">{{ stat.value }}</span>
            <span class="runtime-content-section__stat-label">{{ stat.label }}</span>
          </li>
        </ul>
      </template>

      <!-- Layout: promise/list items -->
      <ul v-if="promises.length" class="runtime-content-section__promises">
        <li v-for="(item, i) in promises" :key="i" class="runtime-content-section__promise" :style="cardStyle">
          <strong class="runtime-content-section__promise-title">{{ item.title }}</strong>
          <p class="runtime-content-section__promise-body">{{ item.body }}</p>
        </li>
      </ul>

      <!-- Layout: metrics (sustainability section) -->
      <template v-if="metrics.length">
        <ul class="runtime-content-section__metrics">
          <li v-for="(m, i) in metrics" :key="i" class="runtime-content-section__metric" :style="cardStyle">
            <span class="runtime-content-section__metric-value" :style="{ color: colorScheme.color }">{{ m.value }}</span>
            <span class="runtime-content-section__metric-label" :style="{ color: colorScheme.color }">{{ m.label }}</span>
            <span v-if="m.note" class="runtime-content-section__metric-note" :style="{ color: colorScheme.color }">{{ m.note }}</span>
          </li>
        </ul>
        <p v-if="disclosure" class="runtime-content-section__disclosure" :style="cardStyle">
          🤖 {{ disclosure }}
        </p>
      </template>

    </div>
  </section>
</template>

<script setup lang="ts">
import type { RuntimeSectionComponentProps } from '../types'
import { applyColorScheme } from '../utils/colorScheme'

const props = defineProps<RuntimeSectionComponentProps>()

// Color scheme support
const colorScheme = computed(() => {
  const schemeKey = (props.data.settings as any)?.color_scheme
  return applyColorScheme(props.theme, schemeKey)
})

const sectionStyle = computed(() => ({
  backgroundColor: colorScheme.value.backgroundColor,
  color: colorScheme.value.color,
}))

const cardStyle = computed(() => ({
  backgroundColor: colorScheme.value.secondaryBackground,
  borderColor: colorScheme.value.borderColor,
  color: colorScheme.value.color,
}))

const title   = computed(() => typeof props.data.title    === 'string' ? props.data.title    : '')
const subtitle = computed(() => typeof props.data.subtitle === 'string' ? props.data.subtitle : '')

const content = computed(() => {
  const c = props.data.content
  return c && typeof c === 'object' && !Array.isArray(c) ? c as Record<string, unknown> : {}
})

const body = computed(() => {
  const v = content.value.body
  return typeof v === 'string' ? v : ''
})

type Stat     = { value: string; label: string }
type Promise_ = { title: string; body: string }
type Metric   = { label: string; value: string; note?: string }

const stats = computed<Stat[]>(() => {
  const arr = content.value.stats
  if (!Array.isArray(arr)) return []
  return arr.filter((s): s is Stat =>
    s && typeof s === 'object' && 'value' in s && 'label' in s)
})

const promises = computed<Promise_[]>(() => {
  const arr = content.value.promises
  if (!Array.isArray(arr)) return []
  return arr.filter((p): p is Promise_ =>
    p && typeof p === 'object' && 'title' in p && 'body' in p)
})

const metrics = computed<Metric[]>(() => {
  const arr = content.value.metrics
  if (!Array.isArray(arr)) return []
  return arr.filter((m): m is Metric =>
    m && typeof m === 'object' && 'value' in m && 'label' in m)
})

const disclosure = computed(() => {
  const v = content.value.disclosure
  return typeof v === 'string' ? v : ''
})
</script>

<style scoped>
.runtime-content-section {
  width: 100%;
  background: var(--color-bg-page, #fff);
}

.runtime-content-section__inner {
  max-width: 56rem;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.runtime-content-section__header { margin-bottom: 1.75rem; }

.runtime-content-section__title {
  margin: 0;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  /* Color inherited from sectionStyle */
}

.runtime-content-section__subtitle {
  margin: 0.5rem 0 0;
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.9;
  /* Color inherited from sectionStyle */
}

.runtime-content-section__body {
  font-size: 1.0625rem;
  line-height: 1.75;
  margin: 0 0 2rem;
  /* Color inherited from sectionStyle */
}

/* Stats row */
.runtime-content-section__stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}
@media (min-width: 640px) {
  .runtime-content-section__stats { grid-template-columns: repeat(4, 1fr); }
}

.runtime-content-section__stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.25rem;
  border-radius: 1rem;
  /* Colors now applied via inline styles from color scheme */
}

.runtime-content-section__stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  /* Color applied via inline styles from cardStyle */
}

.runtime-content-section__stat-label {
  font-size: 0.8125rem;
  opacity: 0.7;
  /* Color applied via inline styles from cardStyle */
}

/* Promise list */
.runtime-content-section__promises {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.runtime-content-section__promise {
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  /* Colors now applied via inline styles from color scheme */
}

.runtime-content-section__promise-title {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.375rem;
  /* Color applied via inline styles from cardStyle */
}

.runtime-content-section__promise-body {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  opacity: 0.8;
  /* Color applied via inline styles from cardStyle */
}

/* Metrics grid */
.runtime-content-section__metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
}
@media (min-width: 640px) {
  .runtime-content-section__metrics { grid-template-columns: repeat(4, 1fr); }
}

.runtime-content-section__metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.25rem;
  border-radius: 1rem;
  border: 1px solid transparent;
  /* Colors now applied via inline styles from color scheme */
}

.runtime-content-section__metric-value {
  font-size: 1.5rem;
  font-weight: 800;
  /* Color applied via inline styles from cardStyle */
}

.runtime-content-section__metric-label {
  font-size: 0.8125rem;
  font-weight: 600;
  /* Color applied via inline styles from cardStyle */
}

.runtime-content-section__metric-note {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.125rem;
  /* Color applied via inline styles from cardStyle */
}

.runtime-content-section__disclosure {
  font-size: 0.875rem;
  line-height: 1.6;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  margin: 0;
  opacity: 0.9;
  /* Colors now applied via inline styles from color scheme */
}
</style>
