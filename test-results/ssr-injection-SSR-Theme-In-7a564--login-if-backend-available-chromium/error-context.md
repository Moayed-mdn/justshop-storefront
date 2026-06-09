# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ssr-injection.spec.ts >> SSR Theme Injection >> merchant-theme style tag present on login if backend available
- Location: ssr-injection.spec.ts:69:3

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://demo.justshop.test:3000/en/login", waiting until "load"

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test'
  2   | 
  3   | test.describe('SSR Theme Injection', () => {
  4   | 
  5   |   test('theme CSS variables are present on document root', async ({ page }) => {
  6   |     await page.goto('/en/cart')
  7   |     await page.waitForLoadState('networkidle')
  8   | 
  9   |     const primaryColor = await page.evaluate(() => {
  10  |       return getComputedStyle(document.documentElement)
  11  |         .getPropertyValue('--color-primary')
  12  |         .trim()
  13  |     })
  14  | 
  15  |     expect(primaryColor).not.toBe('')
  16  |     expect(primaryColor).not.toBe('initial')
  17  |   })
  18  | 
  19  |   test('CSS variables defined on both cart and login pages', async ({ page }) => {
  20  |     await page.goto('/en/cart')
  21  |     await page.waitForLoadState('networkidle')
  22  | 
  23  |     const cartVars = await page.evaluate(() => {
  24  |       const root = document.documentElement
  25  |       return {
  26  |         primary: getComputedStyle(root).getPropertyValue('--color-primary').trim(),
  27  |         bg: getComputedStyle(root).getPropertyValue('--color-bg-page').trim(),
  28  |         text: getComputedStyle(root).getPropertyValue('--color-text-primary').trim(),
  29  |         font: getComputedStyle(root).getPropertyValue('--font-body').trim(),
  30  |       }
  31  |     })
  32  | 
  33  |     expect(cartVars.primary).not.toBe('')
  34  |     expect(cartVars.bg).not.toBe('')
  35  |     expect(cartVars.text).not.toBe('')
  36  |     expect(cartVars.font).not.toBe('')
  37  | 
  38  |     await page.goto('/en/login')
  39  |     await page.waitForLoadState('networkidle')
  40  | 
  41  |     const loginVars = await page.evaluate(() => {
  42  |       const root = document.documentElement
  43  |       return {
  44  |         primary: getComputedStyle(root).getPropertyValue('--color-primary').trim(),
  45  |         font: getComputedStyle(root).getPropertyValue('--font-body').trim(),
  46  |       }
  47  |     })
  48  | 
  49  |     expect(loginVars.primary).not.toBe('')
  50  |     expect(loginVars.font).not.toBe('')
  51  |   })
  52  | 
  53  |   test('merchant-theme style tag present if backend available', async ({ page }) => {
  54  |     await page.goto('/en/cart')
  55  |     await page.waitForLoadState('networkidle')
  56  | 
  57  |     const styleTag = page.locator('style#merchant-theme')
  58  |     const count = await styleTag.count()
  59  | 
  60  |     if (count === 0) {
  61  |       console.log('style#merchant-theme not present (backend may be unavailable)')
  62  |     } else {
  63  |       const content = await styleTag.textContent()
  64  |       expect(content).toContain('--color-primary')
  65  |       console.log('style#merchant-theme is present with theme variables')
  66  |     }
  67  |   })
  68  | 
  69  |   test('merchant-theme style tag present on login if backend available', async ({ page }) => {
> 70  |     await page.goto('/en/login')
      |                ^ Error: page.goto: Target page, context or browser has been closed
  71  |     await page.waitForLoadState('networkidle')
  72  | 
  73  |     const styleTag = page.locator('style#merchant-theme')
  74  |     const count = await styleTag.count()
  75  | 
  76  |     if (count > 0) {
  77  |       const content = await styleTag.textContent()
  78  |       expect(content).toContain('--color-primary')
  79  |     } else {
  80  |       console.log('style#merchant-theme not present on login (backend may be unavailable)')
  81  |     }
  82  |   })
  83  | 
  84  |   test('Google Fonts links present if backend available', async ({ page }) => {
  85  |     await page.goto('/en/cart')
  86  |     await page.waitForLoadState('networkidle')
  87  | 
  88  |     const googlePreconnect = page.locator('link[rel="preconnect"][href*="fonts.googleapis.com"]')
  89  |     const gstaticPreconnect = page.locator('link[rel="preconnect"][href*="fonts.gstatic.com"]')
  90  |     const googleStylesheet = page.locator('link[rel="stylesheet"][href*="fonts.googleapis.com/css2"]')
  91  | 
  92  |     const preconnectCount = await googlePreconnect.count()
  93  |     const gstaticCount = await gstaticPreconnect.count()
  94  |     const stylesheetCount = await googleStylesheet.count()
  95  | 
  96  |     console.log(`Google Fonts links: ${preconnectCount} preconnect, ${gstaticCount} gstatic, ${stylesheetCount} stylesheet`)
  97  |   })
  98  | 
  99  |   test('nuxt server rendered the page (SSR is working)', async ({ page }) => {
  100 |     const response = await page.goto('/en/cart')
  101 |     await page.waitForLoadState('networkidle')
  102 | 
  103 |     expect(response?.status()).toBe(200)
  104 | 
  105 |     const html = await response?.text()
  106 |     expect(html).toContain('ssr')
  107 |   })
  108 | 
  109 |   test('full theme token set is available via CSS variables', async ({ page }) => {
  110 |     await page.goto('/en/cart')
  111 |     await page.waitForLoadState('networkidle')
  112 | 
  113 |     const vars = await page.evaluate(() => {
  114 |       const root = document.documentElement
  115 |       const style = getComputedStyle(root)
  116 | 
  117 |       return {
  118 |         '--color-primary': style.getPropertyValue('--color-primary').trim(),
  119 |         '--color-secondary': style.getPropertyValue('--color-secondary').trim(),
  120 |         '--color-accent': style.getPropertyValue('--color-accent').trim(),
  121 |         '--color-bg-page': style.getPropertyValue('--color-bg-page').trim(),
  122 |         '--color-text-primary': style.getPropertyValue('--color-text-primary').trim(),
  123 |         '--font-body': style.getPropertyValue('--font-body').trim(),
  124 |         '--font-heading': style.getPropertyValue('--font-heading').trim(),
  125 |       }
  126 |     })
  127 | 
  128 |     for (const [key, value] of Object.entries(vars)) {
  129 |       expect(value, `${key} should be defined`).not.toBe('')
  130 |     }
  131 | 
  132 |     console.log('Full token set:', JSON.stringify(vars, null, 2))
  133 |   })
  134 | })
  135 | 
```