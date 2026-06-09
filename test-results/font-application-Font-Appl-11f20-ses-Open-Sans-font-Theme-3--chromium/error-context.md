# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: font-application.spec.ts >> Font Application >> body element uses Open Sans font (Theme 3)
- Location: font-application.spec.ts:24:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e5]:
    - generic [ref=e7]:
      - link "Call +00 123 456 7890" [ref=e8] [cursor=pointer]:
        - /url: tel:+001234567890
        - img [ref=e10]
        - generic [ref=e12]: Call
        - generic [ref=e13]: +00 123 456 7890
      - generic [ref=e14]:
        - paragraph [ref=e15]: Get 50% Off on Selected Items
        - generic [ref=e16]: "|"
        - paragraph [ref=e17]: Shop Now
      - button "en" [ref=e21]:
        - text: en
        - img [ref=e22]
    - banner [ref=e24]:
      - navigation "Storefront primary navigation" [ref=e25]:
        - list [ref=e26]:
          - listitem [ref=e27]:
            - link "Home" [ref=e28] [cursor=pointer]:
              - /url: /en
          - listitem [ref=e29]:
            - link "Shop" [ref=e30] [cursor=pointer]:
              - /url: /en/shop
          - listitem [ref=e31]:
            - link "Categories" [ref=e32] [cursor=pointer]:
              - /url: /en/categories
          - listitem [ref=e33]:
            - link "About" [ref=e34] [cursor=pointer]:
              - /url: /en/about
          - listitem [ref=e35]:
            - link "Contact" [ref=e36] [cursor=pointer]:
              - /url: /en/contact
      - generic [ref=e37]:
        - link [ref=e39] [cursor=pointer]:
          - /url: /en
        - generic [ref=e43]:
          - generic [ref=e44] [cursor=pointer]:
            - img [ref=e45]
            - generic [ref=e47]: Search for products...
          - searchbox "Search for products..." [ref=e48]
        - generic [ref=e49]:
          - link "Account" [ref=e50] [cursor=pointer]:
            - /url: /en/login
            - generic [ref=e51]: Account
          - link "Cart" [ref=e52] [cursor=pointer]:
            - /url: /en/cart
            - generic [ref=e53]: Cart
          - button "Toggle theme" [ref=e54]:
            - generic [ref=e55]: ☀️
    - main [ref=e56]:
      - generic [ref=e57]:
        - generic [ref=e60]:
          - heading "Your private world of luxury shopping." [level=1] [ref=e61]
          - paragraph [ref=e62]: Enjoy moments of calm while choosing your favorite pieces; we provide everything you need for an unforgettable journey.
          - link "Shop Now" [ref=e64] [cursor=pointer]:
            - /url: /shop
        - generic [ref=e67]:
          - generic [ref=e68]:
            - heading "Shop by department" [level=2] [ref=e69]
            - paragraph [ref=e70]: Browse electronics, fashion, home, beauty, and sports in one place.
          - list [ref=e71]:
            - listitem [ref=e72]:
              - link "Electronics 12 products" [ref=e73] [cursor=pointer]:
                - /url: /shop/category/electronics
                - generic [ref=e74]:
                  - generic [ref=e75]: Electronics
                  - generic [ref=e76]: 12 products
            - listitem [ref=e77]:
              - link "Fashion 12 products" [ref=e78] [cursor=pointer]:
                - /url: /shop/category/fashion
                - generic [ref=e79]:
                  - generic [ref=e80]: Fashion
                  - generic [ref=e81]: 12 products
            - listitem [ref=e82]:
              - link "Home & Kitchen 5 products" [ref=e83] [cursor=pointer]:
                - /url: /shop/category/home-kitchen
                - generic [ref=e84]:
                  - generic [ref=e85]: Home & Kitchen
                  - generic [ref=e86]: 5 products
            - listitem [ref=e87]:
              - link "Health & Beauty 2 products" [ref=e88] [cursor=pointer]:
                - /url: /shop/category/health-beauty
                - generic [ref=e89]:
                  - generic [ref=e90]: Health & Beauty
                  - generic [ref=e91]: 2 products
            - listitem [ref=e92]:
              - link "Sports & Outdoors 2 products" [ref=e93] [cursor=pointer]:
                - /url: /shop/category/sports-outdoors
                - generic [ref=e94]:
                  - generic [ref=e95]: Sports & Outdoors
                  - generic [ref=e96]: 2 products
        - generic [ref=e98]:
          - generic [ref=e101]:
            - heading "Featured picks" [level=2] [ref=e102]
            - paragraph [ref=e103]: Hand-picked bestsellers and new arrivals for this week.
          - generic [ref=e105]:
            - generic [ref=e106]:
              - generic [ref=e107]:
                - link "OnePlus 12":
                  - /url: /en/en/shop/product/oneplus-12
                  - img "OnePlus 12"
              - generic [ref=e108]:
                - generic [ref=e109]:
                  - heading "OnePlus 12" [level=3] [ref=e110]
                  - generic [ref=e111]:
                    - generic [ref=e112]: $
                    - generic [ref=e113]: "749"
                    - generic [ref=e114]: ".00"
                - paragraph [ref=e115]: OnePlus 12 — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e118] [cursor=pointer]
            - generic [ref=e119]:
              - generic [ref=e120]:
                - link "Budget Android A55":
                  - /url: /en/en/shop/product/budget-android-a55
                  - img "Budget Android A55"
              - generic [ref=e121]:
                - generic [ref=e122]:
                  - heading "Budget Android A55" [level=3] [ref=e123]
                  - generic [ref=e124]:
                    - generic [ref=e125]: $
                    - generic [ref=e126]: "249"
                    - generic [ref=e127]: ".00"
                - paragraph [ref=e128]: Budget Android A55 — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e131] [cursor=pointer]
            - generic [ref=e132]:
              - generic [ref=e133]:
                - link "USB-C Hub Pro":
                  - /url: /en/en/shop/product/usb-c-hub-pro
                  - img "USB-C Hub Pro"
              - generic [ref=e134]:
                - generic [ref=e135]:
                  - heading "USB-C Hub Pro" [level=3] [ref=e136]
                  - generic [ref=e137]:
                    - generic [ref=e138]: $
                    - generic [ref=e139]: "59"
                    - generic [ref=e140]: ".99"
                - paragraph [ref=e141]: USB-C Hub Pro — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e144] [cursor=pointer]
            - generic [ref=e145]:
              - generic [ref=e146]:
                - link "Mechanical Keyboard":
                  - /url: /en/en/shop/product/mechanical-keyboard
                  - img "Mechanical Keyboard"
              - generic [ref=e147]:
                - generic [ref=e148]:
                  - heading "Mechanical Keyboard" [level=3] [ref=e149]
                  - generic [ref=e150]:
                    - generic [ref=e151]: $
                    - generic [ref=e152]: "129"
                    - generic [ref=e153]: ".99"
                - paragraph [ref=e154]: Mechanical Keyboard — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e157] [cursor=pointer]
            - generic [ref=e158]:
              - generic [ref=e159]:
                - link "High-Rise Wide Leg Pants":
                  - /url: /en/en/shop/product/high-rise-wide-leg-pants
                  - img "High-Rise Wide Leg Pants"
              - generic [ref=e160]:
                - generic [ref=e161]:
                  - heading "High-Rise Wide Leg Pants" [level=3] [ref=e162]
                  - generic [ref=e163]:
                    - generic [ref=e164]: $
                    - generic [ref=e165]: "54"
                    - generic [ref=e166]: ".99"
                - paragraph [ref=e167]: High-Rise Wide Leg Pants — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e170] [cursor=pointer]
            - generic [ref=e171]:
              - generic [ref=e172]:
                - link "Trail Running Shoes":
                  - /url: /en/en/shop/product/trail-running-shoes
                  - img "Trail Running Shoes"
              - generic [ref=e173]:
                - generic [ref=e174]:
                  - heading "Trail Running Shoes" [level=3] [ref=e175]
                  - generic [ref=e176]:
                    - generic [ref=e177]: $
                    - generic [ref=e178]: "99"
                    - generic [ref=e179]: ".99"
                - paragraph [ref=e180]: Trail Running Shoes — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e183] [cursor=pointer]
            - generic [ref=e184]:
              - generic [ref=e185]:
                - link "Air Fryer XL":
                  - /url: /en/en/shop/product/air-fryer-xl
                  - img "Air Fryer XL"
              - generic [ref=e186]:
                - generic [ref=e187]:
                  - heading "Air Fryer XL" [level=3] [ref=e188]
                  - generic [ref=e189]:
                    - generic [ref=e190]: $
                    - generic [ref=e191]: "149"
                    - generic [ref=e192]: ".99"
                - paragraph [ref=e193]: Air Fryer XL — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e196] [cursor=pointer]
            - generic [ref=e197]:
              - generic [ref=e198]:
                - link "Espresso Machine":
                  - /url: /en/en/shop/product/espresso-machine
                  - img "Espresso Machine"
              - generic [ref=e199]:
                - generic [ref=e200]:
                  - heading "Espresso Machine" [level=3] [ref=e201]
                  - generic [ref=e202]:
                    - generic [ref=e203]: $
                    - generic [ref=e204]: "299"
                    - generic [ref=e205]: ".99"
                - paragraph [ref=e206]: Espresso Machine — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e209] [cursor=pointer]
    - contentinfo [ref=e211]:
      - navigation "Storefront footer navigation" [ref=e213]:
        - generic [ref=e215]:
          - heading "Department" [level=3] [ref=e216]
          - list [ref=e217]:
            - listitem [ref=e218]:
              - link "Fashion" [ref=e219] [cursor=pointer]:
                - /url: /en/shop/category/fashion
            - listitem [ref=e220]:
              - link "Education" [ref=e221] [cursor=pointer]:
                - /url: /en/shop/category/education
            - listitem [ref=e222]:
              - link "Frozen Food" [ref=e223] [cursor=pointer]:
                - /url: /en/shop/category/frozen-food
            - listitem [ref=e224]:
              - link "Beverages" [ref=e225] [cursor=pointer]:
                - /url: /en/shop/category/beverages
            - listitem [ref=e226]:
              - link "Organic Grocery" [ref=e227] [cursor=pointer]:
                - /url: /en/shop/category/organic
            - listitem [ref=e228]:
              - link "Office Supplies" [ref=e229] [cursor=pointer]:
                - /url: /en/shop/category/office
            - listitem [ref=e230]:
              - link "Beauty Products" [ref=e231] [cursor=pointer]:
                - /url: /en/shop/category/beauty
            - listitem [ref=e232]:
              - link "Books" [ref=e233] [cursor=pointer]:
                - /url: /en/shop/category/books
            - listitem [ref=e234]:
              - link "Electronics & Gadget" [ref=e235] [cursor=pointer]:
                - /url: /en/shop/category/electronics
            - listitem [ref=e236]:
              - link "Travel Accessories" [ref=e237] [cursor=pointer]:
                - /url: /en/shop/category/travel
            - listitem [ref=e238]:
              - link "Fitness" [ref=e239] [cursor=pointer]:
                - /url: /en/shop/category/fitness
            - listitem [ref=e240]:
              - link "Sneakers" [ref=e241] [cursor=pointer]:
                - /url: /en/shop/category/sneakers
            - listitem [ref=e242]:
              - link "Toys" [ref=e243] [cursor=pointer]:
                - /url: /en/shop/category/toys
            - listitem [ref=e244]:
              - link "Furniture" [ref=e245] [cursor=pointer]:
                - /url: /en/shop/category/furniture
        - generic [ref=e247]:
          - heading "Services" [level=3] [ref=e248]
          - list [ref=e249]:
            - listitem [ref=e250]:
              - link "Gift Card" [ref=e251] [cursor=pointer]:
                - /url: /en/gift-card
            - listitem [ref=e252]:
              - link "Mobile App" [ref=e253] [cursor=pointer]:
                - /url: /en/mobile-app
            - listitem [ref=e254]:
              - link "Shipping & Delivery" [ref=e255] [cursor=pointer]:
                - /url: /en/shipping
            - listitem [ref=e256]:
              - link "Order Pickup" [ref=e257] [cursor=pointer]:
                - /url: /en/pickup
            - listitem [ref=e258]:
              - link "Account Signup" [ref=e259] [cursor=pointer]:
                - /url: /en/register
        - link "About Us" [ref=e262] [cursor=pointer]:
          - /url: /en/about
        - link "Contact" [ref=e265] [cursor=pointer]:
          - /url: /en/contact
        - link "Privacy Policy" [ref=e268] [cursor=pointer]:
          - /url: /en/privacy
        - link "Terms of Service" [ref=e271] [cursor=pointer]:
          - /url: /en/terms
        - link "FAQ" [ref=e274] [cursor=pointer]:
          - /url: /en/faq
        - link "Track Order" [ref=e277] [cursor=pointer]:
          - /url: /en/track-order
  - region "Notifications (F8)":
    - list
  - generic:
    - img
  - generic:
    - generic:
      - generic:
        - button "Go to parent" [disabled]
        - button "Open in editor"
        - button "Close"
  - generic [ref=e278]:
    - button "Toggle Nuxt DevTools" [ref=e279] [cursor=pointer]:
      - img [ref=e280]
    - generic "Page load time" [ref=e283]:
      - generic [ref=e284]: "245"
      - generic [ref=e285]: ms
    - button "Toggle Component Inspector" [ref=e287] [cursor=pointer]:
      - img [ref=e288]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test'
  2  | import { injectThemeVariables, THEMES, getFontFamily } from './helpers/themeHelper'
  3  | 
  4  | test.describe('Font Application', () => {
  5  | 
  6  |   test('body element uses Inter font (Theme 1)', async ({ page }) => {
  7  |     await page.goto('/en')
  8  |     await page.waitForLoadState('networkidle')
  9  |     await injectThemeVariables(page, THEMES.theme1)
  10 | 
  11 |     const fontFamily = await getFontFamily(page, 'body')
  12 |     expect(fontFamily.toLowerCase()).toContain('inter')
  13 |   })
  14 | 
  15 |   test('body element uses Lato font (Theme 2)', async ({ page }) => {
  16 |     await page.goto('/en')
  17 |     await page.waitForLoadState('networkidle')
  18 |     await injectThemeVariables(page, THEMES.theme2)
  19 | 
  20 |     const fontFamily = await getFontFamily(page, 'body')
  21 |     expect(fontFamily.toLowerCase()).toContain('lato')
  22 |   })
  23 | 
  24 |   test('body element uses Open Sans font (Theme 3)', async ({ page }) => {
  25 |     await page.goto('/en')
> 26 |     await page.waitForLoadState('networkidle')
     |                ^ Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
  27 |     await injectThemeVariables(page, THEMES.theme3)
  28 | 
  29 |     const fontFamily = await getFontFamily(page, 'body')
  30 |     expect(fontFamily.toLowerCase()).toContain('open sans')
  31 |   })
  32 | 
  33 |   test('heading element uses Poppins (Theme 1)', async ({ page }) => {
  34 |     await page.goto('/en')
  35 |     await page.waitForLoadState('networkidle')
  36 |     await injectThemeVariables(page, THEMES.theme1)
  37 | 
  38 |     const h1Font = await getFontFamily(page, 'h1')
  39 | 
  40 |     if (h1Font === 'ELEMENT_NOT_FOUND') {
  41 |       const h2Font = await getFontFamily(page, 'h2')
  42 |       if (h2Font !== 'ELEMENT_NOT_FOUND') {
  43 |         expect(h2Font.toLowerCase()).toContain('poppins')
  44 |       } else {
  45 |         console.log('No headings found on homepage, skipping')
  46 |       }
  47 |     } else {
  48 |       expect(h1Font.toLowerCase()).toContain('poppins')
  49 |     }
  50 |   })
  51 | 
  52 |   test('heading font differs from body font when theme uses different fonts', async ({ page }) => {
  53 |     await page.goto('/en')
  54 |     await page.waitForLoadState('networkidle')
  55 |     await injectThemeVariables(page, THEMES.theme1)
  56 | 
  57 |     const bodyFont = await getFontFamily(page, 'body')
  58 |     const h1Font = await getFontFamily(page, 'h1')
  59 | 
  60 |     if (h1Font !== 'ELEMENT_NOT_FOUND' && bodyFont !== 'ELEMENT_NOT_FOUND') {
  61 |       expect(h1Font.toLowerCase()).not.toEqual(bodyFont.toLowerCase())
  62 |       expect(h1Font.toLowerCase()).toContain('poppins')
  63 |       expect(bodyFont.toLowerCase()).toContain('inter')
  64 |     }
  65 |   })
  66 | 
  67 |   test('font applies on cart page consistently', async ({ page }) => {
  68 |     await page.goto('/en/cart')
  69 |     await page.waitForLoadState('networkidle')
  70 |     await injectThemeVariables(page, THEMES.theme2)
  71 | 
  72 |     const cartBodyFont = await getFontFamily(page, 'body')
  73 |     expect(cartBodyFont.toLowerCase()).toContain('lato')
  74 |   })
  75 | 
  76 |   test('Google Fonts requests may be made for merchant fonts', async ({ page }) => {
  77 |     const fontRequests: string[] = []
  78 | 
  79 |     page.on('request', (request) => {
  80 |       if (request.url().includes('fonts.googleapis.com/css2')) {
  81 |         fontRequests.push(request.url())
  82 |       }
  83 |     })
  84 | 
  85 |     await page.goto('/en')
  86 |     await page.waitForLoadState('networkidle')
  87 | 
  88 |     if (fontRequests.length === 0) {
  89 |       console.log('No Google Fonts requests detected (backend may be unavailable)')
  90 |     } else {
  91 |       console.log('Google Fonts requests:', fontRequests)
  92 |     }
  93 |   })
  94 | })
  95 | 
```