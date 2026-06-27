<template>
  <section class="runtime-cta-section" :style="getSectionBackgroundStyle()">
    <div class="runtime-cta-section__inner">

      <h2 v-if="title" class="runtime-cta-section__title" :style="{ color: sectionTextColor }">{{ title }}</h2>
      <p v-if="subtitle" class="runtime-cta-section__subtitle" :style="{ color: sectionTextColor }">{{ subtitle }}</p>

      <!-- CTA buttons -->
      <div v-if="ctas.length" class="runtime-cta-section__buttons">
        <a
          v-for="(cta, i) in ctas"
          :key="i"
          :href="cta.url || '/'"
          rel="noopener noreferrer"
          class="runtime-cta-section__btn"
          :class="`runtime-cta-section__btn--${cta.style || 'primary'}`"
          :style="getButtonStyleDirect(cta.style || 'primary')"
        >
          {{ cta.label }}
        </a>
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
import { applyColorScheme, resolveColorSchemeKey } from '../utils/colorScheme'

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

// Resolve color scheme for this section
const colorScheme = computed(() => {
  const schemeKey = resolveColorSchemeKey(props.data.settings)
  return applyColorScheme(props.theme, schemeKey)
})

const sectionTextColor = computed(() => colorScheme.value.color)

const getSectionBackgroundStyle = () => {
  return {
    backgroundColor: colorScheme.value.backgroundColor,
    color: colorScheme.value.color,
  }
}

// Button style configuration
type ButtonStyle = 'primary' | 'secondary' | 'outline'
type ButtonConfig = {
  backgroundColor: string
  textColor: string
  borderColor: string
  borderWidth: number
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'
  paddingX: 'sm' | 'md' | 'lg' | 'xl'
  paddingY: 'sm' | 'md' | 'lg'
  fontSize: 'sm' | 'base' | 'lg'
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold'
  hoverEffect: 'opacity' | 'darken' | 'lift' | 'scale'
}

const borderRadiusMap = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '1rem',
  full: '9999px',
}

const paddingXMap = {
  sm: '1rem',
  md: '1.5rem',
  lg: '1.75rem',
  xl: '2rem',
}

const paddingYMap = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
}

const fontSizeMap = {
  sm: '0.875rem',
  base: '0.9375rem',
  lg: '1rem',
}

const fontWeightMap = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}

const getButtonConfig = (style: ButtonStyle): ButtonConfig => {
  // Access theme directly from props
  const themeSettings = props.theme?.settings as any
  const buttons = themeSettings?.buttons
  
  if (buttons && buttons[style]) {
    return buttons[style] as ButtonConfig
  }
  
  // Return default config if not found in theme
  return {
    backgroundColor: style === 'primary' ? '#3B82F6' : style === 'secondary' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
    textColor: '#FFFFFF',
    borderColor: style === 'primary' ? '#3B82F6' : style === 'secondary' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.6)',
    borderWidth: style === 'outline' ? 2 : style === 'secondary' ? 1 : 0,
    borderRadius: 'full',
    paddingX: 'lg',
    paddingY: 'md',
    fontSize: 'base',
    fontWeight: 'semibold',
    hoverEffect: 'opacity',
  }
}

const getButtonStyleDirect = (style: ButtonStyle) => {
  const config = getButtonConfig(style)
  return {
    backgroundColor: config.backgroundColor,
    color: config.textColor,
    borderColor: config.borderColor,
    borderWidth: `${config.borderWidth}px`,
    borderStyle: config.borderWidth > 0 ? 'solid' : 'none',
    borderRadius: borderRadiusMap[config.borderRadius] || borderRadiusMap.full,
    paddingLeft: paddingXMap[config.paddingX] || paddingXMap.lg,
    paddingRight: paddingXMap[config.paddingX] || paddingXMap.lg,
    paddingTop: paddingYMap[config.paddingY] || paddingYMap.md,
    paddingBottom: paddingYMap[config.paddingY] || paddingYMap.md,
    fontSize: fontSizeMap[config.fontSize] || fontSizeMap.base,
    fontWeight: fontWeightMap[config.fontWeight] || fontWeightMap.semibold,
  }
}
</script>

<style scoped>
.runtime-cta-section {
  width: 100%;
  /* Background and color are now set via inline styles */
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
  /* Color is now set via inline styles */
}

.runtime-cta-section__subtitle {
  margin: 0 0 2.5rem;
  font-size: 1.0625rem;
  line-height: 1.65;
  opacity: 0.85;
  max-width: 36rem;
  margin-left: auto;
  margin-right: auto;
  /* Color is now set via inline styles */
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
  text-decoration: none;
  transition: opacity 0.2s, transform 0.15s;
  white-space: nowrap;
}

.runtime-cta-section__btn:hover {
  opacity: 0.88;
  transform: translateY(-1px);
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
  opacity: 0.8;
  /* Color is inherited from section */
}

.runtime-cta-section__badge-icon {
  font-size: 0.8125rem;
  color: #6ee7b7;
  font-weight: 700;
}
</style>
