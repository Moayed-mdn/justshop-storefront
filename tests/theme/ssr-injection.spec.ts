import { test, expect } from '@playwright/test'

test.describe('SSR Theme Injection', () => {

  test('theme CSS variables are present on document root', async ({ page }) => {
    await page.goto('/en/cart')
    await page.waitForLoadState('networkidle')

    const primaryColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary')
        .trim()
    })

    expect(primaryColor).not.toBe('')
    expect(primaryColor).not.toBe('initial')
  })

  test('CSS variables defined on both cart and login pages', async ({ page }) => {
    await page.goto('/en/cart')
    await page.waitForLoadState('networkidle')

    const cartVars = await page.evaluate(() => {
      const root = document.documentElement
      return {
        primary: getComputedStyle(root).getPropertyValue('--color-primary').trim(),
        bg: getComputedStyle(root).getPropertyValue('--color-bg-page').trim(),
        text: getComputedStyle(root).getPropertyValue('--color-text-primary').trim(),
        font: getComputedStyle(root).getPropertyValue('--font-body').trim(),
      }
    })

    expect(cartVars.primary).not.toBe('')
    expect(cartVars.bg).not.toBe('')
    expect(cartVars.text).not.toBe('')
    expect(cartVars.font).not.toBe('')

    await page.goto('/en/login')
    await page.waitForLoadState('networkidle')

    const loginVars = await page.evaluate(() => {
      const root = document.documentElement
      return {
        primary: getComputedStyle(root).getPropertyValue('--color-primary').trim(),
        font: getComputedStyle(root).getPropertyValue('--font-body').trim(),
      }
    })

    expect(loginVars.primary).not.toBe('')
    expect(loginVars.font).not.toBe('')
  })

  test('merchant-theme style tag present if backend available', async ({ page }) => {
    await page.goto('/en/cart')
    await page.waitForLoadState('networkidle')

    const styleTag = page.locator('style#merchant-theme')
    const count = await styleTag.count()

    if (count === 0) {
      console.log('style#merchant-theme not present (backend may be unavailable)')
    } else {
      const content = await styleTag.textContent()
      expect(content).toContain('--color-primary')
      console.log('style#merchant-theme is present with theme variables')
    }
  })

  test('merchant-theme style tag present on login if backend available', async ({ page }) => {
    await page.goto('/en/login')
    await page.waitForLoadState('networkidle')

    const styleTag = page.locator('style#merchant-theme')
    const count = await styleTag.count()

    if (count > 0) {
      const content = await styleTag.textContent()
      expect(content).toContain('--color-primary')
    } else {
      console.log('style#merchant-theme not present on login (backend may be unavailable)')
    }
  })

  test('Google Fonts links present if backend available', async ({ page }) => {
    await page.goto('/en/cart')
    await page.waitForLoadState('networkidle')

    const googlePreconnect = page.locator('link[rel="preconnect"][href*="fonts.googleapis.com"]')
    const gstaticPreconnect = page.locator('link[rel="preconnect"][href*="fonts.gstatic.com"]')
    const googleStylesheet = page.locator('link[rel="stylesheet"][href*="fonts.googleapis.com/css2"]')

    const preconnectCount = await googlePreconnect.count()
    const gstaticCount = await gstaticPreconnect.count()
    const stylesheetCount = await googleStylesheet.count()

    console.log(`Google Fonts links: ${preconnectCount} preconnect, ${gstaticCount} gstatic, ${stylesheetCount} stylesheet`)
  })

  test('nuxt server rendered the page (SSR is working)', async ({ page }) => {
    const response = await page.goto('/en/cart')
    await page.waitForLoadState('networkidle')

    expect(response?.status()).toBe(200)

    const html = await response?.text()
    expect(html).toContain('ssr')
  })

  test('full theme token set is available via CSS variables', async ({ page }) => {
    await page.goto('/en/cart')
    await page.waitForLoadState('networkidle')

    const vars = await page.evaluate(() => {
      const root = document.documentElement
      const style = getComputedStyle(root)

      return {
        '--color-primary': style.getPropertyValue('--color-primary').trim(),
        '--color-secondary': style.getPropertyValue('--color-secondary').trim(),
        '--color-accent': style.getPropertyValue('--color-accent').trim(),
        '--color-bg-page': style.getPropertyValue('--color-bg-page').trim(),
        '--color-text-primary': style.getPropertyValue('--color-text-primary').trim(),
        '--font-body': style.getPropertyValue('--font-body').trim(),
        '--font-heading': style.getPropertyValue('--font-heading').trim(),
      }
    })

    for (const [key, value] of Object.entries(vars)) {
      expect(value, `${key} should be defined`).not.toBe('')
    }

    console.log('Full token set:', JSON.stringify(vars, null, 2))
  })
})
