<template>
  <section class="runtime-content-section">
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
          <li v-for="(stat, i) in stats" :key="i" class="runtime-content-section__stat">
            <span class="runtime-content-section__stat-value">{{ stat.value }}</span>
            <span class="runtime-content-section__stat-label">{{ stat.label }}</span>
          </li>
        </ul>
      </template>

      <!-- Layout: promise/list items -->
      <ul v-if="promises.length" class="runtime-content-section__promises">
        <li v-for="(item, i) in promises" :key="i" class="runtime-content-section__promise">
          <strong class="runtime-content-section__promise-title">{{ item.title }}</strong>
          <p class="runtime-content-section__promise-body">{{ item.body }}</p>
        </li>
      </ul>

      <!-- Layout: metrics (sustainability section) -->
      <template v-if="metrics.length">
        <ul class="runtime-content-section__metrics">
          <li v-for="(m, i) in metrics" :key="i" class="runtime-content-section__metric">
            <span class="runtime-content-section__metric-value">{{ m.value }}</span>
            <span class="runtime-content-section__metric-label">{{ m.label }}</span>
            <span v-if="m.note" class="runtime-content-section__metric-note">{{ m.note }}</span>
          </li>
        </ul>
        <p v-if="disclosure" class="runtime-content-section__disclosure">
          🤖 {{ disclosure }}
        </p>
      </template>

    </div>
  </section>
</template>

<script setup lang="ts">
import type { RuntimeSectionComponentProps } from '../types'

const props = defineProps<RuntimeSectionComponentProps>()

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
  color: var(--color-text-primary, #231f1e);
}

.runtime-content-section__subtitle {
  margin: 0.5rem 0 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-secondary, #555);
}

.runtime-content-section__body {
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--color-text-primary, #231f1e);
  margin: 0 0 2rem;
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
  background: var(--color-bg-card, #f5f6f6);
  border: 1px solid #e5e7eb;
}

.runtime-content-section__stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary, #003d29);
}

.runtime-content-section__stat-label {
  font-size: 0.8125rem;
  color: var(--color-text-secondary, #555);
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
  background: var(--color-bg-card, #f5f6f6);
  border: 1px solid #e5e7eb;
}

.runtime-content-section__promise-title {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary, #231f1e);
  margin-bottom: 0.375rem;
}

.runtime-content-section__promise-body {
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text-secondary, #555);
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
  background: var(--color-bg-card, #f5f6f6);
  border: 1px solid #e5e7eb;
}

.runtime-content-section__metric-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-primary, #003d29);
}

.runtime-content-section__metric-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-primary, #231f1e);
}

.runtime-content-section__metric-note {
  font-size: 0.75rem;
  color: var(--color-text-secondary, #888);
  margin-top: 0.125rem;
}

.runtime-content-section__disclosure {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-text-secondary, #555);
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  margin: 0;
}
</style>
