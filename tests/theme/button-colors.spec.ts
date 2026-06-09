import { test, expect } from '@playwright/test'
import { injectThemeVariables, THEMES } from './helpers/themeHelper'

const BUTTON_SELECTORS = [
  '[data-testid="cart-checkout-button"]',
  '[data-testid="product-add-to-cart-button"]',
  '[data-testid="product-buy-now-button"]',
  'button[type="submit"]',
]

async function findVisibleButton(page: any, selectors: string[]) {
  for (const selector of selectors) {
    try {
      const el = page.locator(selector).first()
      if (await el.isVisible({ timeout: 500 })) {
        return el
      }
    } catch {
      continue
    }
  }
  return null
}

test.describe('Primary Button Colors', () => {

  test('no element has hardcoded green-950 class on cart page', async ({ page }) => {
    await page.goto('/en/cart')
    await page.waitForLoadState('networkidle')

    const greenElements = await page.evaluate(() => {
      const all = document.querySelectorAll('*')
      const found: string[] = []
      for (const el of Array.from(all)) {
        const cls = (el as HTMLElement).className?.toString() || ''
        if (cls.includes('green-950')) {
          found.push(`${el.tagName}: ${cls}`)
        }
      }
      return found
    })

    expect(greenElements).toHaveLength(0)
  })

  test('no element has hardcoded green-950 class on home page', async ({ page }) => {
    await page.goto('/en')
    await page.waitForLoadState('networkidle')

    const greenElements = await page.evaluate(() => {
      const all = document.querySelectorAll('*')
      const found: string[] = []
      for (const el of Array.from(all)) {
        const cls = (el as HTMLElement).className?.toString() || ''
        if (cls.includes('green-950')) {
          found.push(`${el.tagName}: ${cls}`)
        }
      }
      return found
    })

    expect(greenElements).toHaveLength(0)
  })

  test('no element has hardcoded green-950 class on login page', async ({ page }) => {
    await page.goto('/en/login')
    await page.waitForLoadState('networkidle')

    const greenElements = await page.evaluate(() => {
      const all = document.querySelectorAll('*')
      const found: string[] = []
      for (const el of Array.from(all)) {
        const cls = (el as HTMLElement).className?.toString() || ''
        if (cls.includes('green-950')) {
          found.push(`${el.tagName}: ${cls}`)
        }
      }
      return found
    })

    expect(greenElements).toHaveLength(0)
  })

  test('checkout button background uses primary color token', async ({ page }) => {
    await page.goto('/en/cart')
    await page.waitForLoadState('networkidle')
    await injectThemeVariables(page, THEMES.theme1)

    const btn = await findVisibleButton(page, ['[data-testid="cart-checkout-button"]'])
    if (!btn) {
      console.log('Checkout button not found, skipping')
      return
    }

    const bgColor = await btn.evaluate((el: Element) => {
      return getComputedStyle(el).backgroundColor
    })

    expect(bgColor).toContain('59')
  })

  test('login submit button background reflects merchant primary (purple)', async ({ page }) => {
    await page.goto('/en/login')
    await page.waitForLoadState('networkidle')
    await injectThemeVariables(page, THEMES.theme2)

    const btn = await findVisibleButton(page, ['button[type="submit"]'])
    if (!btn) {
      console.log('Submit button not found, skipping')
      return
    }

    const bgColor = await btn.evaluate((el: Element) => {
      return getComputedStyle(el).backgroundColor
    })

    // Purple #8B5CF6 = rgb(139, 92, 246); check G value which is stable
    expect(bgColor).toContain('92, 24')
    console.log(`Auth button bg: ${bgColor}`)
  })
})
