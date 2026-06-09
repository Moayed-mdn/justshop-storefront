import { Page } from '@playwright/test'

export interface ThemeConfig {
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
}

export const THEMES: Record<string, ThemeConfig> = {
  theme1: {
    name: 'Blue/Yellow',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#f50aca',
      background: '#fbff00',
      text: '#1F2937',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter',
    },
  },
  theme2: {
    name: 'Purple/Dark',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#111827',
      text: '#F3F4F6',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Lato',
    },
  },
  theme3: {
    name: 'Black/White',
    colors: {
      primary: '#000000',
      secondary: '#6B7280',
      accent: '#EF4444',
      background: '#F9FAFB',
      text: '#111827',
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Open Sans',
    },
  },
}

/**
 * Inject theme CSS variables directly into the page.
 * Uses addStyleTag (:root CSS rule) instead of inline style.setProperty,
 * because Chromium's var() resolution doesn't properly recalc descendant
 * element styles when custom properties are set via inline style.
 */
export async function injectThemeVariables(page: Page, theme: ThemeConfig): Promise<void> {
  const bgLuminance = calculateLuminance(theme.colors.background)
  const isDark = bgLuminance < 0.15

  const luminance = (hex: string): number => {
    const c = hex.replace('#', '')
    const r = parseInt(c.substring(0, 2), 16)
    const g = parseInt(c.substring(2, 4), 16)
    const b = parseInt(c.substring(4, 6), 16)
    const [rs, gs, bs] = [r, g, b].map(v => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const onPrimary = luminance(theme.colors.primary) < 0.179 ? '#ffffff' : '#111827'

  const cssVars = `
    --color-primary: ${theme.colors.primary};
    --color-secondary: ${theme.colors.secondary};
    --color-accent: ${theme.colors.accent};
    --color-bg-page: ${theme.colors.background};
    --color-background: ${theme.colors.background};
    --color-text: ${theme.colors.text};
    --color-text-primary: ${theme.colors.text};
    --color-text-secondary: ${theme.colors.text};
    --color-text-muted: ${theme.colors.text};
    --font-body: "${theme.fonts.body}", sans-serif;
    --font-main: "${theme.fonts.body}", sans-serif;
    --font-heading: "${theme.fonts.heading}", sans-serif;
    --color-on-primary: ${onPrimary};
    --color-primary-hover: color-mix(in srgb, ${theme.colors.primary} 85%, black);
  `

  await page.addStyleTag({
    content: `:root { ${cssVars} }`,
  })

  if (isDark) {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-merchant-dark-theme', '')
    })
  } else {
    await page.evaluate(() => {
      document.documentElement.removeAttribute('data-merchant-dark-theme')
    })
  }
}

export async function getCSSVariable(page: Page, variableName: string): Promise<string> {
  return page.evaluate((varName) => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim()
    return value
  }, variableName)
}

export async function getFontFamily(page: Page, selector: string): Promise<string> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel)
    if (!el) return 'ELEMENT_NOT_FOUND'
    return getComputedStyle(el).fontFamily
  }, selector)
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null
}

export function calculateLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = calculateLuminance(hex1)
  const l2 = calculateLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function expectedOnColor(bgHex: string): string {
  const luminance = calculateLuminance(bgHex)
  return luminance < 0.179 ? '#ffffff' : '#111827'
}
