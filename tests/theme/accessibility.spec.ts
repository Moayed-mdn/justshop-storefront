import { test, expect } from '@playwright/test'
import {
  injectThemeVariables,
  THEMES,
  getCSSVariable,
  getContrastRatio,
  expectedOnColor,
} from './helpers/themeHelper'

test.describe('WCAG Computed Token Accessibility', () => {

  test('Theme 1: color-on-primary provides accessible text on blue', async ({ page }) => {
    await page.goto('/en/cart')
    await page.waitForLoadState('networkidle')
    await injectThemeVariables(page, THEMES.theme1)

    const primary = '#3B82F6'
    const onPrimary = expectedOnColor(primary)
    const ratio = getContrastRatio(primary, onPrimary)

    expect(ratio).toBeGreaterThanOrEqual(3.0)

    const actualOnPrimary = await getCSSVariable(page, '--color-on-primary')
    expect(actualOnPrimary.toLowerCase().replace(/\s/g, '')).toContain(onPrimary.replace('#', ''))

    console.log(`Theme 1 contrast ratio: ${ratio.toFixed(2)}:1`)
  })

  test('Theme 2: color-on-primary provides accessible text on purple', async ({ page }) => {
    await page.goto('/en/cart')
    await page.waitForLoadState('networkidle')
    await injectThemeVariables(page, THEMES.theme2)

    const primary = '#8B5CF6'
    const onPrimary = expectedOnColor(primary)
    const ratio = getContrastRatio(primary, onPrimary)

    expect(ratio).toBeGreaterThanOrEqual(3.0)
    console.log(`Theme 2 contrast ratio: ${ratio.toFixed(2)}:1`)
  })

  test('Theme 3: color-on-primary is white on black', async ({ page }) => {
    await page.goto('/en/cart')
    await page.waitForLoadState('networkidle')
    await injectThemeVariables(page, THEMES.theme3)

    const primary = '#000000'
    const onPrimary = expectedOnColor(primary)
    const ratio = getContrastRatio(primary, onPrimary)

    expect(onPrimary).toBe('#ffffff')
    expect(ratio).toBeGreaterThanOrEqual(20)
    console.log(`Theme 3 contrast ratio: ${ratio.toFixed(2)}:1`)
  })

  test('all three themes have text/bg meeting WCAG AA (4.5:1)', async ({ page }) => {
    for (const [, theme] of Object.entries(THEMES)) {
      const ratio = getContrastRatio(theme.colors.text, theme.colors.background)
      console.log(`${theme.name} text/bg ratio: ${ratio.toFixed(2)}:1`)
      expect(ratio).toBeGreaterThanOrEqual(4.5)
    }
  })

  test('focus ring token is defined', async ({ page }) => {
    await page.goto('/en/login')
    await page.waitForLoadState('networkidle')
    await injectThemeVariables(page, THEMES.theme1)

    const focusRing = await getCSSVariable(page, '--color-focus-ring')
    expect(focusRing).not.toBe('')
  })
})
