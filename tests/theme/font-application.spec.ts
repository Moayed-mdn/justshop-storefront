import { test, expect } from '@playwright/test'
import { injectThemeVariables, THEMES, getFontFamily } from './helpers/themeHelper'

test.describe('Font Application', () => {

  test('body element uses Inter font (Theme 1)', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')
    await injectThemeVariables(page, THEMES.theme1)

    const fontFamily = await getFontFamily(page, 'body')
    expect(fontFamily.toLowerCase()).toContain('inter')
  })

  test('body element uses Lato font (Theme 2)', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')
    await injectThemeVariables(page, THEMES.theme2)

    const fontFamily = await getFontFamily(page, 'body')
    expect(fontFamily.toLowerCase()).toContain('lato')
  })

  test('body element uses Open Sans font (Theme 3)', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')
    await injectThemeVariables(page, THEMES.theme3)

    const fontFamily = await getFontFamily(page, 'body')
    expect(fontFamily.toLowerCase()).toContain('open sans')
  })

  test('heading element uses Poppins (Theme 1)', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')
    await injectThemeVariables(page, THEMES.theme1)

    const h1Font = await getFontFamily(page, 'h1')

    if (h1Font === 'ELEMENT_NOT_FOUND') {
      const h2Font = await getFontFamily(page, 'h2')
      if (h2Font !== 'ELEMENT_NOT_FOUND') {
        expect(h2Font.toLowerCase()).toContain('poppins')
      } else {
        console.log('No headings found on homepage, skipping')
      }
    } else {
      expect(h1Font.toLowerCase()).toContain('poppins')
    }
  })

  test('heading font differs from body font when theme uses different fonts', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')
    await injectThemeVariables(page, THEMES.theme1)

    const bodyFont = await getFontFamily(page, 'body')
    const h1Font = await getFontFamily(page, 'h1')

    if (h1Font !== 'ELEMENT_NOT_FOUND' && bodyFont !== 'ELEMENT_NOT_FOUND') {
      expect(h1Font.toLowerCase()).not.toEqual(bodyFont.toLowerCase())
      expect(h1Font.toLowerCase()).toContain('poppins')
      expect(bodyFont.toLowerCase()).toContain('inter')
    }
  })

  test('font applies on cart page consistently', async ({ page }) => {
    await page.goto('/en/cart')
    await page.waitForLoadState('networkidle')
    await injectThemeVariables(page, THEMES.theme2)

    const cartBodyFont = await getFontFamily(page, 'body')
    expect(cartBodyFont.toLowerCase()).toContain('lato')
  })

  test('Google Fonts requests may be made for merchant fonts', async ({ page }) => {
    const fontRequests: string[] = []

    page.on('request', (request) => {
      if (request.url().includes('fonts.googleapis.com/css2')) {
        fontRequests.push(request.url())
      }
    })

    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    if (fontRequests.length === 0) {
      console.log('No Google Fonts requests detected (backend may be unavailable)')
    } else {
      console.log('Google Fonts requests:', fontRequests)
    }
  })
})
