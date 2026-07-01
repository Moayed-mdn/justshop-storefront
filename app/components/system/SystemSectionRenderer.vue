<template>
  <template v-for="sectionId in orderedWithFallbacks" :key="`${sectionId}-${locale}`">
    <StorefrontShellHeader v-if="sectionId === '__header__'" />
    <main v-else-if="sectionId === '__content__'" class="flex-1">
      <slot />
    </main>
    <StorefrontShellFooter v-else-if="sectionId === '__footer__'" />
    <SystemSectionAnnouncementBar
      v-else-if="sectionMap[sectionId]?.type === 'announcement_bar'"
      :section="sectionMap[sectionId]"
    />
    <SystemSectionCopyrightBar
      v-else-if="sectionMap[sectionId]?.type === 'copyright_bar'"
      :section="sectionMap[sectionId]"
    />
    <div
      v-else-if="sectionId === '__cart_wrapper__'"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      <div class="lg:grid lg:grid-cols-3 lg:gap-8">
        <div class="lg:col-span-2">
          <SystemSectionCartItems />
        </div>
        <div>
          <SystemSectionCartSummary :section="cartSummarySection" />
        </div>
      </div>
    </div>
    <SystemSectionCartItems
      v-else-if="sectionMap[sectionId]?.type === 'cart_items' && !hasCartGroup"
    />
    <SystemSectionCartSummary
      v-else-if="sectionMap[sectionId]?.type === 'cart_summary' && !hasCartGroup"
      :section="sectionMap[sectionId]"
    />
    <SystemSectionCartEmpty
      v-else-if="sectionMap[sectionId]?.type === 'cart_empty'"
      :section="sectionMap[sectionId]"
    />
    <template v-else-if="sectionMap[sectionId]">
      <StorefrontShellHeader v-if="sectionMap[sectionId].type === 'header'" :header-section="sectionMap[sectionId]" />
      <main v-else-if="sectionMap[sectionId].type === 'content'" class="flex-1">
        <SystemSectionContent :section="sectionMap[sectionId]" />
        <slot />
      </main>
      <StorefrontShellFooter v-else-if="sectionMap[sectionId].type === 'footer'" />
      <SystemSectionContent
        v-else
        :section="sectionMap[sectionId]"
      />
    </template>
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RuntimeTemplateSectionDetail } from '~~/src/core/runtime/contracts/types'

const props = defineProps<{
  sectionOrder: string[]
  sectionMap: Record<string, RuntimeTemplateSectionDetail>
  noShellFallbacks?: boolean
}>()

const { locale } = useI18n()
const hasCartGroup = computed(() => {
  const types = orderedWithoutFallbacks.value.map(id => props.sectionMap[id]?.type)
  const cartIdx = types.indexOf('cart_items')
  return cartIdx >= 0 && types[cartIdx + 1] === 'cart_summary'
})

const cartSummarySection = computed(() => {
  return Object.values(props.sectionMap).find(s => s.type === 'cart_summary') ?? null
})

const orderedWithoutFallbacks = computed(() => {
  return props.sectionOrder.filter(id =>
    props.sectionMap[id]?.enabled !== false
  )
})

const orderedWithFallbacks = computed(() => {
  const enabledOrder = props.sectionOrder.filter(id =>
    props.sectionMap[id]?.enabled !== false
  )
  const typesInOrder = enabledOrder.map(id => ({
    id,
    type: props.sectionMap[id]?.type ?? null,
  }))

  const hasContent = typesInOrder.some(t => t.type === 'content')

  const result: string[] = []

  for (let i = 0; i < typesInOrder.length; i++) {
    const { id, type } = typesInOrder[i]

    if (type === 'cart_items' && typesInOrder[i + 1]?.type === 'cart_summary') {
      result.push('__cart_wrapper__')
      i++
      continue
    }

    result.push(id)
  }

  if (!hasContent) {
    const footerTypes = new Set(['footer', 'footer_minimal', 'copyright_bar'])
    const firstFooterIdx = result.findIndex(id =>
      footerTypes.has(props.sectionMap[id]?.type ?? '')
    )

    if (firstFooterIdx >= 0) {
      result.splice(firstFooterIdx, 0, '__content__')
    } else {
      result.push('__content__')
    }
  }

  if (!props.noShellFallbacks) {
    const hasHeader = typesInOrder.some(t => t.type === 'header')
    const hasFooter = typesInOrder.some(t => t.type === 'footer')
    const footerDisabled = !hasFooter && Object.values(props.sectionMap).some(s => s.type === 'footer')

    if (!hasHeader && result.length === 0) {
      result.unshift('__header__')
    }

    if (!hasFooter && !footerDisabled) {
      const postFooterTypes = new Set(['copyright_bar'])
      const firstPostFooterIdx = result.findIndex(id =>
        postFooterTypes.has(props.sectionMap[id]?.type ?? '')
      )
      if (firstPostFooterIdx >= 0) {
        result.splice(firstPostFooterIdx, 0, '__footer__')
      } else {
        result.push('__footer__')
      }
    }
  }

  return result
})
</script>
