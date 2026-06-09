import { test, expect } from '@playwright/test'
import { injectThemeVariables, THEMES } from './helpers/themeHelper'

test.describe('Page Background Colors', () => {

  for (const [themeKey, theme] of Object.entries(THEMES)) {
    test(`body background reflects theme for ${theme.name}`, async ({ page }) => {
      await page.goto('/en/cart')
      await page.waitForLoadState('networkidle')
      await injectThemeVariables(page, theme)

      const bodyBg = await page.evaluate(() => {
        return getComputedStyle(document.body).backgroundColor
      })

      expect(bodyBg).not.toBe('rgba(0, 0, 0, 0)')
      expect(bodyBg).not.toBe('transparent')
      console.log(`${theme.name} body background: ${bodyBg}`)
    })
  }

  test('Theme 2 dark background is applied to body', async ({ page }) => {
    await page.goto('/en/cart')
    await page.waitForLoadState('networkidle')
    await injectThemeVariables(page, THEMES.theme2)

    const bodyBg = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor
    })

    expect(bodyBg).toContain('17')
  })
})

test.describe('Screenshots - Visual Comparison', () => {

  const pages = [
    { name: 'cart', url: '/cart' },
    { name: 'login', url: '/en/login' },
    { name: 'home', url: '/en' },
  ]

  for (const [themeKey, theme] of Object.entries(THEMES)) {
    for (const pageConfig of pages) {
      test(`screenshot - ${theme.name} - ${pageConfig.name}`, async ({ page }) => {
        await page.goto(pageConfig.url)
        await page.waitForLoadState('networkidle')
        await injectThemeVariables(page, theme)
        await page.waitForTimeout(1000)

        await page.screenshot({
          path: `test-results/screenshots/${themeKey}-${pageConfig.name}.png`,
          fullPage: true,
        })

        const title = await page.title()
        expect(title).not.toContain('Error')
        expect(title).not.toContain('404')
      })
    }
  }
})
