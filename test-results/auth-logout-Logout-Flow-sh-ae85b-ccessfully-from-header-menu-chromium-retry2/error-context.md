# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/logout.spec.ts >> Logout Flow >> should logout successfully from header menu
- Location: tests/e2e/auth/logout.spec.ts:62:3

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('[data-testid="user-menu-trigger"], [data-testid="profile-dropdown-trigger"]')

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
              - /url: /
          - listitem [ref=e29]:
            - link "Shop" [ref=e30] [cursor=pointer]:
              - /url: /shop
          - listitem [ref=e31]:
            - link "About Us" [ref=e32] [cursor=pointer]:
              - /url: /about-us
          - listitem [ref=e33]:
            - link "Showcase" [ref=e34] [cursor=pointer]:
              - /url: /demo
      - generic [ref=e35]:
        - link [ref=e37] [cursor=pointer]:
          - /url: /
        - generic [ref=e41]:
          - generic [ref=e42] [cursor=pointer]:
            - img [ref=e43]
            - generic [ref=e45]: Search for products...
          - searchbox "Search for products..." [ref=e46]
        - generic [ref=e47]:
          - link "Account" [ref=e48] [cursor=pointer]:
            - /url: /login
            - generic [ref=e49]: Account
          - link "Cart" [ref=e50] [cursor=pointer]:
            - /url: /cart
            - generic [ref=e51]: Cart
          - button "Toggle theme" [ref=e52]:
            - generic [ref=e53]: ☀️
    - main [ref=e54]:
      - generic [ref=e55]:
        - generic [ref=e58]:
          - heading "Your private world of luxury shopping." [level=1] [ref=e59]
          - paragraph [ref=e60]: Enjoy moments of calm while choosing your favorite pieces; we provide everything you need for an unforgettable journey.
          - link "Shop Now" [ref=e62] [cursor=pointer]:
            - /url: /shop
        - generic [ref=e65]:
          - generic [ref=e66]:
            - heading "Shop by department" [level=2] [ref=e67]
            - paragraph [ref=e68]: Browse electronics, fashion, home, beauty, and sports in one place.
          - list [ref=e69]:
            - listitem [ref=e70]:
              - link "Electronics 12 products" [ref=e71] [cursor=pointer]:
                - /url: /shop/category/electronics
                - generic [ref=e72]:
                  - generic [ref=e73]: Electronics
                  - generic [ref=e74]: 12 products
            - listitem [ref=e75]:
              - link "Fashion 12 products" [ref=e76] [cursor=pointer]:
                - /url: /shop/category/fashion
                - generic [ref=e77]:
                  - generic [ref=e78]: Fashion
                  - generic [ref=e79]: 12 products
            - listitem [ref=e80]:
              - link "Home & Kitchen 5 products" [ref=e81] [cursor=pointer]:
                - /url: /shop/category/home-kitchen
                - generic [ref=e82]:
                  - generic [ref=e83]: Home & Kitchen
                  - generic [ref=e84]: 5 products
            - listitem [ref=e85]:
              - link "Health & Beauty 2 products" [ref=e86] [cursor=pointer]:
                - /url: /shop/category/health-beauty
                - generic [ref=e87]:
                  - generic [ref=e88]: Health & Beauty
                  - generic [ref=e89]: 2 products
            - listitem [ref=e90]:
              - link "Sports & Outdoors 2 products" [ref=e91] [cursor=pointer]:
                - /url: /shop/category/sports-outdoors
                - generic [ref=e92]:
                  - generic [ref=e93]: Sports & Outdoors
                  - generic [ref=e94]: 2 products
        - generic [ref=e96]:
          - generic [ref=e99]:
            - heading "Featured picks" [level=2] [ref=e100]
            - paragraph [ref=e101]: Hand-picked bestsellers and new arrivals for this week.
          - generic [ref=e103]:
            - generic [ref=e104]:
              - link "OnePlus 12" [ref=e106] [cursor=pointer]:
                - /url: /shop/product/oneplus-12
                - img "OnePlus 12" [ref=e107]
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
              - link "Budget Android A55" [ref=e121] [cursor=pointer]:
                - /url: /shop/product/budget-android-a55
                - img "Budget Android A55" [ref=e122]
              - generic [ref=e123]:
                - generic [ref=e124]:
                  - heading "Budget Android A55" [level=3] [ref=e125]
                  - generic [ref=e126]:
                    - generic [ref=e127]: $
                    - generic [ref=e128]: "249"
                    - generic [ref=e129]: ".00"
                - paragraph [ref=e130]: Budget Android A55 — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e133] [cursor=pointer]
            - generic [ref=e134]:
              - link "Surface Laptop 6" [ref=e136] [cursor=pointer]:
                - /url: /shop/product/surface-laptop-6
                - img "Surface Laptop 6" [ref=e137]
              - generic [ref=e138]:
                - generic [ref=e139]:
                  - heading "Surface Laptop 6" [level=3] [ref=e140]
                  - generic [ref=e141]:
                    - generic [ref=e142]: $
                    - generic [ref=e143]: "1"
                    - generic [ref=e144]: ".00"
                - paragraph [ref=e145]: Surface Laptop 6 — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e148] [cursor=pointer]
            - generic [ref=e149]:
              - link "Mechanical Keyboard" [ref=e151] [cursor=pointer]:
                - /url: /shop/product/mechanical-keyboard
                - img "Mechanical Keyboard" [ref=e152]
              - generic [ref=e153]:
                - generic [ref=e154]:
                  - heading "Mechanical Keyboard" [level=3] [ref=e155]
                  - generic [ref=e156]:
                    - generic [ref=e157]: $
                    - generic [ref=e158]: "129"
                    - generic [ref=e159]: ".99"
                - paragraph [ref=e160]: Mechanical Keyboard — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e163] [cursor=pointer]
            - generic [ref=e164]:
              - link "Merino Wool Sweater" [ref=e166] [cursor=pointer]:
                - /url: /shop/product/merino-wool-sweater
                - img "Merino Wool Sweater" [ref=e167]
              - generic [ref=e168]:
                - generic [ref=e169]:
                  - heading "Merino Wool Sweater" [level=3] [ref=e170]
                  - generic [ref=e171]:
                    - generic [ref=e172]: $
                    - generic [ref=e173]: "79"
                    - generic [ref=e174]: ".99"
                - paragraph [ref=e175]: Merino Wool Sweater — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e178] [cursor=pointer]
            - generic [ref=e179]:
              - link "Leather Chelsea Boots" [ref=e181] [cursor=pointer]:
                - /url: /shop/product/leather-chelsea-boots
                - img "Leather Chelsea Boots" [ref=e182]
              - generic [ref=e183]:
                - generic [ref=e184]:
                  - heading "Leather Chelsea Boots" [level=3] [ref=e185]
                  - generic [ref=e186]:
                    - generic [ref=e187]: $
                    - generic [ref=e188]: "119"
                    - generic [ref=e189]: ".99"
                - paragraph [ref=e190]: Leather Chelsea Boots — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e193] [cursor=pointer]
            - generic [ref=e194]:
              - link "Trail Running Shoes" [ref=e196] [cursor=pointer]:
                - /url: /shop/product/trail-running-shoes
                - img "Trail Running Shoes" [ref=e197]
              - generic [ref=e198]:
                - generic [ref=e199]:
                  - heading "Trail Running Shoes" [level=3] [ref=e200]
                  - generic [ref=e201]:
                    - generic [ref=e202]: $
                    - generic [ref=e203]: "99"
                    - generic [ref=e204]: ".99"
                - paragraph [ref=e205]: Trail Running Shoes — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e208] [cursor=pointer]
            - generic [ref=e209]:
              - link "Air Fryer XL" [ref=e211] [cursor=pointer]:
                - /url: /shop/product/air-fryer-xl
                - img "Air Fryer XL" [ref=e212]
              - generic [ref=e213]:
                - generic [ref=e214]:
                  - heading "Air Fryer XL" [level=3] [ref=e215]
                  - generic [ref=e216]:
                    - generic [ref=e217]: $
                    - generic [ref=e218]: "149"
                    - generic [ref=e219]: ".99"
                - paragraph [ref=e220]: Air Fryer XL — premium demo catalog item for local storefront testing.
                - button "Add to cart" [ref=e223] [cursor=pointer]
    - generic [ref=e224]:
      - contentinfo [ref=e225]:
        - navigation "Storefront footer navigation" [ref=e227]:
          - list [ref=e228]:
            - listitem [ref=e229]:
              - link "About" [ref=e230] [cursor=pointer]:
                - /url: /about-us
      - contentinfo [ref=e231]:
        - generic [ref=e232]:
          - generic [ref=e233]:
            - generic [ref=e235]:
              - img [ref=e236]
              - paragraph [ref=e237]: This is a fake description for the English version. It is not the same as the original one.
            - generic [ref=e238]:
              - generic [ref=e239]: Accepted Payments
              - generic [ref=e240]:
                - img [ref=e242]
                - img [ref=e244]
                - img [ref=e246]
                - img [ref=e248]
                - img [ref=e250]
                - img [ref=e252]
                - img [ref=e254]
                - img [ref=e256]
          - generic [ref=e257]:
            - generic [ref=e258]: Department
            - list [ref=e259]:
              - listitem [ref=e260]:
                - link "Fashion" [ref=e261] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e262]:
                - link "Education Product" [ref=e263] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e264]:
                - link "Frozen Food" [ref=e265] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e266]:
                - link "Beverages" [ref=e267] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e268]:
                - link "Organic Grocery" [ref=e269] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e270]:
                - link "Office Supplies" [ref=e271] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e272]:
                - link "Beauty Products" [ref=e273] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e274]:
                - link "Books" [ref=e275] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e276]:
                - link "Electronics & Gadget" [ref=e277] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e278]:
                - link "Travel Accessories" [ref=e279] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e280]:
                - link "Fitness" [ref=e281] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e282]:
                - link "Sneakers" [ref=e283] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e284]:
                - link "Toys" [ref=e285] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e286]:
                - link "Furniture" [ref=e287] [cursor=pointer]:
                  - /url: "#"
          - generic [ref=e288]:
            - generic [ref=e289]: About us
            - list [ref=e290]:
              - listitem [ref=e291]:
                - link "About Shopcart" [ref=e292] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e293]:
                - link "Careers" [ref=e294] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e295]:
                - link "News & Blog" [ref=e296] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e297]:
                - link "Help" [ref=e298] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e299]:
                - link "Press Center" [ref=e300] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e301]:
                - link "Shop by location" [ref=e302] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e303]:
                - link "Shopcart brands" [ref=e304] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e305]:
                - link "Affiliate & Partners" [ref=e306] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e307]:
                - link "Ideas & Guides" [ref=e308] [cursor=pointer]:
                  - /url: "#"
          - generic [ref=e309]:
            - generic [ref=e310]: Services
            - list [ref=e311]:
              - listitem [ref=e312]:
                - link "Gift Card" [ref=e313] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e314]:
                - link "Mobile App" [ref=e315] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e316]:
                - link "Shipping & Delivery" [ref=e317] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e318]:
                - link "Order Pickup" [ref=e319] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e320]:
                - link "Account Signup" [ref=e321] [cursor=pointer]:
                  - /url: "#"
          - generic [ref=e322]:
            - generic [ref=e323]: Help
            - list [ref=e324]:
              - listitem [ref=e325]:
                - link "Shopcart Help" [ref=e326] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e327]:
                - link "Returns" [ref=e328] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e329]:
                - link "Track Orders" [ref=e330] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e331]:
                - link "Contact Us" [ref=e332] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e333]:
                - link "Feedback" [ref=e334] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e335]:
                - link "Security & Fraud" [ref=e336] [cursor=pointer]:
                  - /url: "#"
        - generic [ref=e338]:
          - generic [ref=e339]:
            - generic [ref=e340]:
              - img [ref=e341]
              - link "Become Seller" [ref=e342] [cursor=pointer]:
                - /url: "#"
            - generic [ref=e343]:
              - img [ref=e344]
              - link "Gift Cards" [ref=e345] [cursor=pointer]:
                - /url: "#"
            - generic [ref=e346]:
              - img [ref=e347]
              - link "Help Center" [ref=e348] [cursor=pointer]:
                - /url: "#"
          - generic [ref=e349]:
            - link "Terms of Service" [ref=e350] [cursor=pointer]:
              - /url: "#"
            - link "Privacy & Policy" [ref=e351] [cursor=pointer]:
              - /url: "#"
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
  - generic [ref=e352]:
    - button "Toggle Nuxt DevTools" [ref=e353] [cursor=pointer]:
      - img [ref=e354]
    - generic "Page load time" [ref=e357]:
      - generic [ref=e358]: "118"
      - generic [ref=e359]: ms
    - button "Toggle Component Inspector" [ref=e361] [cursor=pointer]:
      - img [ref=e362]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import {
  3   |   assertAuthenticated,
  4   |   assertNotAuthenticated,
  5   |   AUTH_COOKIES,
  6   | } from '../../helpers/auth';
  7   | import {
  8   |   getGuestCartKey,
  9   | } from '../../helpers/cart';
  10  | import { setupAuthenticatedContext } from '../../fixtures';
  11  | import { mockAuthenticatedUser } from '../../fixtures/users';
  12  | 
  13  | const MOCK_CART_RESPONSE = {
  14  |   status: true,
  15  |   message: 'Success',
  16  |   data: {
  17  |     cart: {
  18  |       items: [{
  19  |         id: 1,
  20  |         product_id: 1,
  21  |         product_variant_id: 1,
  22  |         quantity: 1,
  23  |         name: 'Test Product',
  24  |         price: 99.99,
  25  |         image: '/test.jpg',
  26  |       }],
  27  |       itemCount: 1,
  28  |       subtotal: '99.99',
  29  |     },
  30  |   },
  31  | };
  32  | 
  33  | async function mockLogoutAPI(page: import('@playwright/test').Page) {
  34  |   await page.context().route('**/api/auth/logout', async (route) => {
  35  |     if (route.request().method() === 'POST') {
  36  |       await route.fulfill({
  37  |         status: 200,
  38  |         contentType: 'application/json',
  39  |         body: JSON.stringify({
  40  |           status: true,
  41  |           message: 'Logged out successfully',
  42  |           data: null,
  43  |         }),
  44  |       });
  45  |     } else {
  46  |       await route.continue();
  47  |     }
  48  |   });
  49  | }
  50  | 
  51  | test.describe('Logout Flow', () => {
  52  |   test.beforeEach(async ({ page }) => {
  53  |     await page.context().clearCookies();
  54  |     await page.goto('/');
  55  |     await page.evaluate(() => {
  56  |       localStorage.clear();
  57  |       sessionStorage.clear();
  58  |     });
  59  |     await mockLogoutAPI(page);
  60  |   });
  61  | 
  62  |   test('should logout successfully from header menu', async ({ page }) => {
  63  |     await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
  64  |     await page.goto('/');
  65  | 
  66  |     await assertAuthenticated(page);
  67  | 
  68  |     const userMenuTrigger = page.locator('[data-testid="user-menu-trigger"], [data-testid="profile-dropdown-trigger"]');
> 69  |     await userMenuTrigger.click();
      |                           ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  70  | 
  71  |     const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout"), button:has-text("Log out")');
  72  |     await logoutButton.click();
  73  | 
  74  |     await assertNotAuthenticated(page);
  75  | 
  76  |     await expect(page.locator('a[href*="login"]')).toBeVisible();
  77  |   });
  78  | 
  79  |   test('should clear all auth cookies after logout', async ({ page }) => {
  80  |     await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
  81  |     await page.goto('/');
  82  | 
  83  |     let cookies = await page.context().cookies();
  84  |     expect(cookies.some(c => c.name === AUTH_COOKIES.SESSION)).toBeTruthy();
  85  |     expect(cookies.some(c => c.name === AUTH_COOKIES.JS_AUTH)).toBeTruthy();
  86  | 
  87  |     await page.context().clearCookies();
  88  | 
  89  |     cookies = await page.context().cookies();
  90  |     expect(cookies.some(c => c.name === AUTH_COOKIES.SESSION)).toBeFalsy();
  91  |     expect(cookies.some(c => c.name === AUTH_COOKIES.JS_AUTH)).toBeFalsy();
  92  |   });
  93  | 
  94  |   test('should redirect to home page after logout', async ({ page }) => {
  95  |     await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
  96  |     await page.goto('/profile');
  97  | 
  98  |     await expect(page).toHaveURL(/\/profile/);
  99  | 
  100 |     await page.context().clearCookies();
  101 |     await page.goto('/');
  102 | 
  103 |     await expect(page).toHaveURL('/');
  104 |   });
  105 | 
  106 |   test('should redirect to login when accessing protected page after logout', async ({ page }) => {
  107 |     await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
  108 |     await page.goto('/');
  109 | 
  110 |     await page.context().clearCookies();
  111 | 
  112 |     await page.goto('/profile');
  113 | 
  114 |     await expect(page).toHaveURL(/\/login/);
  115 |   });
  116 | 
  117 |   test('should clear authenticated cart after logout', async ({ page }) => {
  118 |     await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
  119 |     await page.goto('/');
  120 | 
  121 |     await page.context().route('**/api/cart/**', async (route) => {
  122 |       if (route.request().method() === 'GET') {
  123 |         await route.fulfill({
  124 |           status: 200,
  125 |           contentType: 'application/json',
  126 |           body: JSON.stringify(MOCK_CART_RESPONSE),
  127 |         });
  128 |       } else if (route.request().method() === 'POST') {
  129 |         await route.fulfill({
  130 |           status: 200,
  131 |           contentType: 'application/json',
  132 |           body: JSON.stringify(MOCK_CART_RESPONSE),
  133 |         });
  134 |       } else {
  135 |         await route.continue();
  136 |       }
  137 |     });
  138 | 
  139 |     await page.goto('/cart');
  140 |     const cartItems = page.locator('[data-testid="cart-item"]');
  141 |     await expect(cartItems).toHaveCount(1);
  142 | 
  143 |     await page.context().clearCookies();
  144 |     await page.goto('/');
  145 | 
  146 |     await page.context().route('**/api/cart/**', async (route) => {
  147 |       await route.fulfill({
  148 |         status: 200,
  149 |         contentType: 'application/json',
  150 |         body: JSON.stringify({
  151 |           status: true,
  152 |           message: 'Success',
  153 |           data: { cart: { items: [], itemCount: 0, subtotal: '0.00' } },
  154 |         }),
  155 |       });
  156 |     });
  157 | 
  158 |     await page.goto('/cart');
  159 |     const emptyMessage = page.locator('[data-testid="cart-empty-message"]');
  160 |     await expect(emptyMessage).toBeVisible();
  161 |   });
  162 | 
  163 |   test('should preserve guest cart after logout', async ({ page }) => {
  164 |     await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
  165 |     await page.goto('/');
  166 | 
  167 |     await page.context().clearCookies();
  168 | 
  169 |     await page.goto('/');
```