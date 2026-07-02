<template>
  <div v-if="hasBlocks" class="w-full px-6 py-8">
    <div class="mx-auto max-w-7xl space-y-6">
      <div v-for="block in enabledBlocks" :key="block.id" class="prose max-w-none">
        <!-- HTML -->
        <div v-if="block.type === 'html'" v-html="htmlContent(block)" />
        <!-- Text / Rich Text -->
        <div v-else-if="block.type === 'text' || block.type === 'rich_text'">
          <p class="whitespace-pre-wrap">{{ textContent(block) }}</p>
        </div>
        <!-- Heading -->
        <div v-else-if="block.type === 'heading'">
          <component
            :is="headingTag(block)"
            :class="headingClass(block)"
          >
            {{ textContent(block) }}
          </component>
        </div>
        <!-- Image -->
        <div v-else-if="block.type === 'image'" class="flex justify-center">
          <img
            :src="imageSrc(block)"
            :alt="String(block.settings?.alt ?? '')"
            :class="imageClass(block)"
          >
        </div>
        <!-- Button -->
        <div v-else-if="block.type === 'button'" class="flex justify-center">
          <a
            :href="String(block.settings?.link ?? block.settings?.url ?? '#')"
            :class="buttonClass(block)"
            :target="block.settings?.new_tab ? '_blank' : undefined"
            :rel="block.settings?.new_tab ? 'noopener noreferrer' : undefined"
          >
            {{ block.settings?.text ?? block.content?.text ?? 'Button' }}
          </a>
        </div>
        <!-- Divider -->
        <hr v-else-if="block.type === 'divider'" :class="dividerClass(block)">
        <!-- Spacer -->
        <div v-else-if="block.type === 'spacer'" :style="{ height: spacerHeight(block) }" />
        <!-- Video Embed -->
        <div v-else-if="block.type === 'video'" class="flex justify-center">
          <div class="w-full max-w-3xl aspect-video">
            <iframe
              v-if="videoUrl(block)"
              :src="videoUrl(block)"
              class="w-full h-full rounded-lg"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        </div>
        <!-- Social Links -->
        <div v-else-if="block.type === 'social_links'" class="flex justify-center gap-4">
          <a
            v-for="platform in socialPlatforms(block)"
            :key="platform.name"
            :href="platform.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-(--color-text-secondary) hover:text-(--color-primary) transition-colors"
          >
            <span class="text-sm font-medium">{{ platform.label }}</span>
          </a>
        </div>
        <!-- Link -->
        <div v-else-if="block.type === 'link'" class="flex justify-center">
          <a
            :href="String(block.settings?.url ?? '#')"
            class="text-(--color-primary) hover:underline text-sm font-medium"
            :target="block.settings?.new_tab ? '_blank' : undefined"
          >
            {{ block.settings?.text ?? block.content?.text ?? 'Link' }}
          </a>
        </div>
        <!-- Link Group -->
        <div v-else-if="block.type === 'link_group'" class="flex flex-wrap justify-center gap-3">
          <a
            v-for="(link, li) in linkGroupItems(block)"
            :key="li"
            :href="String(link.url ?? '#')"
            class="text-(--color-text-secondary) hover:text-(--color-primary) hover:underline text-sm"
          >
            {{ link.text ?? 'Link' }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RuntimeTemplateSectionDetail, RuntimeBlockInstance } from '~~/src/core/runtime/contracts/types'

const props = defineProps<{
  section: RuntimeTemplateSectionDetail
}>()
const { resolveMediaUrl } = useMediaUrl()

const enabledBlocks = computed(() =>
  (props.section.blocks ?? []).filter((b: RuntimeBlockInstance) => {
    if (b.is_enabled === false) return false
    const raw = b.settings?.is_enabled ?? b.settings?.enabled
    return raw === undefined || raw === true || raw === 'true'
  })
)

const hasBlocks = computed(() => enabledBlocks.value.length > 0)

function htmlContent(block: RuntimeBlockInstance): string {
  return String(block.settings?.html ?? block.content?.html ?? '')
}

function textContent(block: RuntimeBlockInstance): string {
  return String(block.settings?.text ?? block.content?.text ?? '')
}

function imageSrc(block: RuntimeBlockInstance): string {
  return resolveMediaUrl(
    String(
      block.settings?.src
      ?? block.content?.src
      ?? block.settings?.image_url
      ?? block.content?.image_url
      ?? block.settings?.url
      ?? block.content?.url
      ?? block.settings?.full_url
      ?? block.content?.full_url
      ?? block.settings?.logo_url
      ?? block.content?.logo_url
      ?? '',
    ),
  )
}

function imageClass(block: RuntimeBlockInstance): string {
  const align = String(block.settings?.align ?? 'center')
  return `max-w-full h-auto ${align === 'left' ? 'mr-auto' : align === 'right' ? 'ml-auto' : 'mx-auto'}`
}

function headingTag(block: RuntimeBlockInstance): string {
  return String(block.settings?.tag ?? block.settings?.level ?? 'h2')
}

function headingClass(block: RuntimeBlockInstance): string {
  const size = String(block.settings?.size ?? 'xl')
  return `font-bold ${size === '3xl' ? 'text-4xl' : size === '2xl' ? 'text-3xl' : size === 'xl' ? 'text-2xl' : size === 'lg' ? 'text-xl' : 'text-lg'}`
}

function buttonClass(block: RuntimeBlockInstance): string {
  const variant = String(block.settings?.variant ?? 'primary')
  const base = 'inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium transition-colors'
  if (variant === 'secondary') {
    return `${base} border border-(--color-border-default) text-(--color-text-primary) hover:bg-(--color-bg-elevated)`
  }
  if (variant === 'outline') {
    return `${base} border-2 border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-(--color-on-primary)`
  }
  return `${base} bg-(--color-primary) text-(--color-on-primary) hover:opacity-90`
}

function dividerClass(_block: RuntimeBlockInstance): string {
  return 'border-t border-(--color-border-default) my-8'
}

function spacerHeight(block: RuntimeBlockInstance): string {
  const size = String(block.settings?.size ?? 'md')
  const heights: Record<string, string> = { sm: '1rem', md: '2rem', lg: '4rem', xl: '8rem' }
  return heights[size] ?? '2rem'
}

function videoUrl(block: RuntimeBlockInstance): string {
  const url = String(block.settings?.url ?? block.content?.url ?? '')
  if (!url) return ''
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
  )
  if (ytMatch?.[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch?.[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  return url
}

function socialPlatforms(block: RuntimeBlockInstance): Array<{ name: string; label: string; url: string }> {
  const raw = block.settings?.platforms
  const platforms = Array.isArray(raw) ? raw as Array<Record<string, unknown>> : []
  const labels: Record<string, string> = {
    facebook: 'Facebook',
    twitter: 'Twitter',
    instagram: 'Instagram',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    linkedin: 'LinkedIn',
    pinterest: 'Pinterest',
  }
  return platforms.map((p) => {
    const name = String(p?.name ?? '')
    return {
      name,
      label: labels[name] ?? name,
      url: String(p?.url ?? '#'),
    }
  })
}

function linkGroupItems(block: RuntimeBlockInstance): Array<{ text: string; url: string }> {
  const raw = block.settings?.links
  const links = Array.isArray(raw) ? raw as Array<Record<string, unknown>> : []
  return links.map((l) => ({
    text: String(l?.text ?? 'Link'),
    url: String(l?.url ?? '#'),
  }))
}
</script>
