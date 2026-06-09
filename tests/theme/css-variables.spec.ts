import { test, expect } from '@playwright/test'
import {
  injectThemeVariables,
  THEMES,
  getCSSVariable,
  expectedOnColor,
} from './helpers/themeHelper'

test.describe('CSS Variable Tokens', () => {

  test.describe('Theme 1 - Blue/Yellow', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/cart')
      await page.waitForLoadState('networkidle')
      await injectThemeVariables(page, THEMES.theme1)
    })

    test('primary color token is set correctly', async ({ page }) => {
      const value = await getCSSVariable(page, '--color-primary')
      expect(value.toLowerCase()).toContain('3b82f6')
    })

    test('background color token is set correctly', async ({ page }) => {
      const value = await getCSSVariable(page, '--color-bg-page')
      expect(value.toLowerCase()).toContain('fbff00')
    })

    test('text color token is set correctly', async ({ page }) => {
      const value = await getCSSVariable(page, '--color-text-primary')
      expect(value.toLowerCase()).toContain('1f2937')
    })

    test('font-body is set to Inter', async ({ page }) => {
      const value = await getCSSVariable(page, '--font-body')
      expect(value.toLowerCase()).toContain('inter')
    })

    test('font-heading is set to Poppins', async ({ page }) => {
      const value = await getCSSVariable(page, '--font-heading')
      expect(value.toLowerCase()).toContain('poppins')
    })

    test('color-on-primary is computed for blue primary', async ({ page }) => {
      const expected = expectedOnColor('#3B82F6')
      const value = await getCSSVariable(page, '--color-on-primary')
      expect(value.toLowerCase().replace(/\s/g, '')).toContain(expected.replace('#', ''))
    })

    test('color-primary-hover is defined', async ({ page }) => {
      const value = await getCSSVariable(page, '--color-primary-hover')
      expect(value).not.toBe('')
      expect(value).not.toBe('initial')
    })

    test('error tokens are defined', async ({ page }) => {
      const errorBg = await getCSSVariable(page, '--color-error-bg')
      const errorHover = await getCSSVariable(page, '--color-error-hover')
      expect(errorBg).not.toBe('')
      expect(errorHover).not.toBe('')
    })
  })

  test.describe('Theme 2 - Purple/Dark', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/cart')
      await page.waitForLoadState('networkidle')
      await injectThemeVariables(page, THEMES.theme2)
    })

    test('primary color is purple', async ({ page }) => {
      const value = await getCSSVariable(page, '--color-primary')
      expect(value.toLowerCase()).toContain('8b5cf6')
    })

    test('background is dark', async ({ page }) => {
      const value = await getCSSVariable(page, '--color-bg-page')
      expect(value.toLowerCase()).toContain('111827')
    })

    test('font-body is set to Lato', async ({ page }) => {
      const value = await getCSSVariable(page, '--font-body')
      expect(value.toLowerCase()).toContain('lato')
    })

    test('font-heading is set to Playfair Display', async ({ page }) => {
      const value = await getCSSVariable(page, '--font-heading')
      expect(value.toLowerCase()).toContain('playfair')
    })

    test('data-merchant-dark-theme attribute is set for dark bg', async ({ page }) => {
      const hasAttr = await page.evaluate(() => {
        return document.documentElement.hasAttribute('data-merchant-dark-theme')
      })
      expect(hasAttr).toBe(true)
    })

    test('color-on-primary uses WCAG-correct contrast for purple primary', async ({ page }) => {
      const value = await getCSSVariable(page, '--color-on-primary')
      // Purple #8B5CF6 has luminance ~0.208 > 0.179, so on-color should be dark (#111827)
      expect(value.toLowerCase().replace(/\s/g, '')).toMatch(/111827|1f2937/)
    })
  })

  test.describe('Theme 3 - Black/White', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/en/cart')
      await page.waitForLoadState('networkidle')
      await injectThemeVariables(page, THEMES.theme3)
    })

    test('primary color is black', async ({ page }) => {
      const value = await getCSSVariable(page, '--color-primary')
      expect(value.toLowerCase().replace(/\s/g, '')).toMatch(/000|000000|black/)
    })

    test('font-body is Open Sans', async ({ page }) => {
      const value = await getCSSVariable(page, '--font-body')
      expect(value.toLowerCase()).toContain('open sans')
    })

    test('font-heading is Montserrat', async ({ page }) => {
      const value = await getCSSVariable(page, '--font-heading')
      expect(value.toLowerCase()).toContain('montserrat')
    })

    test('data-merchant-dark-theme is NOT set for light bg', async ({ page }) => {
      const hasAttr = await page.evaluate(() => {
        return document.documentElement.hasAttribute('data-merchant-dark-theme')
      })
      expect(hasAttr).toBe(false)
    })
  })
})
