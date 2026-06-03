<template>
  <section class="runtime-category-grid">
    <div class="runtime-category-grid__inner">
      <header v-if="title || subtitle" class="runtime-category-grid__header">
        <h2 v-if="title" class="runtime-category-grid__title">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="runtime-category-grid__subtitle">
          {{ subtitle }}
        </p>
      </header>

      <ul v-if="categories.length" class="runtime-category-grid__list">
        <li v-for="category in categories" :key="category.id">
          <NuxtLink :to="category.path" class="runtime-category-grid__card" :class="{ 'runtime-category-grid__card--has-image': !!category.image }">
            <img
              v-if="category.image"
              :src="category.image"
              :alt="category.name"
              class="runtime-category-grid__card-image"
            />
            <div class="runtime-category-grid__card-body">
              <span class="runtime-category-grid__card-label">{{ category.name }}</span>
              <span v-if="category.productCount !== null" class="runtime-category-grid__card-meta">
                {{ category.productCount }} {{ category.productCount === 1 ? 'product' : 'products' }}
              </span>
            </div>
          </NuxtLink>
        </li>
      </ul>

      <div v-else class="runtime-category-grid__empty">
        <p class="runtime-category-grid__empty-text">No categories available.</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { RuntimeSectionComponentProps } from '../types'

type CategoryCard = {
  id: string | number
  name: string
  path: string
  productCount: number | null
  image: string | null
}

const props = defineProps<RuntimeSectionComponentProps>()

const title = computed(() => typeof props.data.title === 'string' ? props.data.title : '')
const subtitle = computed(() => typeof props.data.subtitle === 'string' ? props.data.subtitle : '')

const categories = computed<CategoryCard[]>(() => {
  if (!Array.isArray(props.data.categories)) {
    return []
  }

  return props.data.categories
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object' && !Array.isArray(item))
    .map((item) => ({
      id: (item.id as string | number) ?? item.slug ?? item.name,
      name: typeof item.name === 'string' ? item.name : 'Category',
      path: typeof item.path === 'string' ? item.path : '#',
      productCount: typeof item.productCount === 'number' ? item.productCount : null,
      image: typeof item.image === 'string' ? item.image
        : (typeof item.primary_image === 'string' ? item.primary_image
          : (typeof item.thumbnail === 'string' ? item.thumbnail : null)),
    }))
})
</script>

<style scoped>
.runtime-category-grid {
  width: 100%;
  background: var(--color-bg-page, #ffffff);
}

.runtime-category-grid__inner {
  max-width: 80rem;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 3rem;
}

@media (min-width: 768px) {
  .runtime-category-grid__inner {
    padding: 3rem 2.5rem 4rem;
  }
}

.runtime-category-grid__header {
  margin-bottom: 1.75rem;
}

.runtime-category-grid__title {
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text-primary, #231f1e);
}

.runtime-category-grid__subtitle {
  margin: 0.75rem 0 0;
  max-width: 40rem;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-secondary, #333333);
}

.runtime-category-grid__list {
  display: grid;
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 640px) {
  .runtime-category-grid__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .runtime-category-grid__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.runtime-category-grid__card {
  display: flex;
  min-height: 7.5rem;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--gray-300, #e5e7eb);
  border-radius: 1rem;
  background: linear-gradient(145deg, #ffffff 0%, var(--color-bg-card, #f5f6f6) 100%);
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.runtime-category-grid__card:hover {
  transform: translateY(-2px);
  border-color: var(--color-primary, #003d29);
  box-shadow: 0 14px 30px rgba(0, 61, 41, 0.12);
}

.runtime-category-grid__card--has-image {
  padding: 0;
  overflow: hidden;
}

.runtime-category-grid__card--has-image .runtime-category-grid__card-body {
  padding: 1rem 1.25rem 1.25rem;
}

.runtime-category-grid__card-image {
  width: 100%;
  height: 10rem;
  object-fit: cover;
}

.runtime-category-grid__card-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.runtime-category-grid__card-label {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary, #231f1e);
}

.runtime-category-grid__card-meta {
  font-size: 0.875rem;
  color: var(--color-text-secondary, #333333);
}

.runtime-category-grid__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 6rem;
  border: 1px dashed var(--gray-300, #e5e7eb);
  border-radius: 1rem;
  background: var(--color-bg-card, #f5f6f6);
}

.runtime-category-grid__empty-text {
  font-size: 0.95rem;
  color: var(--color-text-secondary, #333333);
}
</style>
