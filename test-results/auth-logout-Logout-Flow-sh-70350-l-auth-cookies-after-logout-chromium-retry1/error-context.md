# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/logout.spec.ts >> Logout Flow >> should clear all auth cookies after logout
- Location: tests/e2e/auth/logout.spec.ts:79:3

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Page snapshot

```yaml
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
              - heading "OnePlus 12" [level=3] [ref=e110]
              - paragraph [ref=e111]: OnePlus 12 — premium demo catalog item for local storefront testing.
          - generic [ref=e114]:
            - link "Budget Android A55" [ref=e116] [cursor=pointer]:
              - /url: /shop/product/budget-android-a55
              - img "Budget Android A55" [ref=e117]
            - generic [ref=e118]:
              - heading "Budget Android A55" [level=3] [ref=e120]
              - paragraph [ref=e121]: Budget Android A55 — premium demo catalog item for local storefront testing.
          - generic [ref=e124]:
            - link "Surface Laptop 6" [ref=e126] [cursor=pointer]:
              - /url: /shop/product/surface-laptop-6
              - img "Surface Laptop 6" [ref=e127]
            - generic [ref=e128]:
              - heading "Surface Laptop 6" [level=3] [ref=e130]
              - paragraph [ref=e131]: Surface Laptop 6 — premium demo catalog item for local storefront testing.
          - generic [ref=e134]:
            - link "Mechanical Keyboard" [ref=e136] [cursor=pointer]:
              - /url: /shop/product/mechanical-keyboard
              - img "Mechanical Keyboard" [ref=e137]
            - generic [ref=e138]:
              - heading "Mechanical Keyboard" [level=3] [ref=e140]
              - paragraph [ref=e141]: Mechanical Keyboard — premium demo catalog item for local storefront testing.
          - generic [ref=e144]:
            - link "Merino Wool Sweater" [ref=e146] [cursor=pointer]:
              - /url: /shop/product/merino-wool-sweater
              - img "Merino Wool Sweater" [ref=e147]
            - generic [ref=e148]:
              - heading "Merino Wool Sweater" [level=3] [ref=e150]
              - paragraph [ref=e151]: Merino Wool Sweater — premium demo catalog item for local storefront testing.
          - generic [ref=e154]:
            - link "Leather Chelsea Boots" [ref=e156] [cursor=pointer]:
              - /url: /shop/product/leather-chelsea-boots
              - img "Leather Chelsea Boots" [ref=e157]
            - generic [ref=e158]:
              - heading "Leather Chelsea Boots" [level=3] [ref=e160]
              - paragraph [ref=e161]: Leather Chelsea Boots — premium demo catalog item for local storefront testing.
          - generic [ref=e164]:
            - link "Trail Running Shoes" [ref=e166] [cursor=pointer]:
              - /url: /shop/product/trail-running-shoes
              - img "Trail Running Shoes" [ref=e167]
            - generic [ref=e168]:
              - heading "Trail Running Shoes" [level=3] [ref=e170]
              - paragraph [ref=e171]: Trail Running Shoes — premium demo catalog item for local storefront testing.
          - generic [ref=e174]:
            - link "Air Fryer XL" [ref=e176] [cursor=pointer]:
              - /url: /shop/product/air-fryer-xl
              - img "Air Fryer XL" [ref=e177]
            - generic [ref=e178]:
              - heading "Air Fryer XL" [level=3] [ref=e180]
              - paragraph [ref=e181]: Air Fryer XL — premium demo catalog item for local storefront testing.
  - generic [ref=e184]:
    - contentinfo [ref=e185]:
      - navigation "Storefront footer navigation" [ref=e187]:
        - list [ref=e188]:
          - listitem [ref=e189]:
            - link "About" [ref=e190] [cursor=pointer]:
              - /url: /about-us
    - contentinfo [ref=e191]:
      - generic [ref=e192]:
        - generic [ref=e193]:
          - generic [ref=e195]:
            - img [ref=e196]
            - paragraph [ref=e197]: This is a fake description for the English version. It is not the same as the original one.
          - generic [ref=e198]:
            - generic [ref=e199]: Accepted Payments
            - generic [ref=e200]:
              - img [ref=e202]
              - img [ref=e204]
              - img [ref=e206]
              - img [ref=e208]
              - img [ref=e210]
              - img [ref=e212]
              - img [ref=e214]
              - img [ref=e216]
        - generic [ref=e217]:
          - generic [ref=e218]: Department
          - list [ref=e219]:
            - listitem [ref=e220]:
              - link "Fashion" [ref=e221] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e222]:
              - link "Education Product" [ref=e223] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e224]:
              - link "Frozen Food" [ref=e225] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e226]:
              - link "Beverages" [ref=e227] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e228]:
              - link "Organic Grocery" [ref=e229] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e230]:
              - link "Office Supplies" [ref=e231] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e232]:
              - link "Beauty Products" [ref=e233] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e234]:
              - link "Books" [ref=e235] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e236]:
              - link "Electronics & Gadget" [ref=e237] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e238]:
              - link "Travel Accessories" [ref=e239] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e240]:
              - link "Fitness" [ref=e241] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e242]:
              - link "Sneakers" [ref=e243] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e244]:
              - link "Toys" [ref=e245] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e246]:
              - link "Furniture" [ref=e247] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e248]:
          - generic [ref=e249]: About us
          - list [ref=e250]:
            - listitem [ref=e251]:
              - link "About Shopcart" [ref=e252] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e253]:
              - link "Careers" [ref=e254] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e255]:
              - link "News & Blog" [ref=e256] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e257]:
              - link "Help" [ref=e258] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e259]:
              - link "Press Center" [ref=e260] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e261]:
              - link "Shop by location" [ref=e262] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e263]:
              - link "Shopcart brands" [ref=e264] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e265]:
              - link "Affiliate & Partners" [ref=e266] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e267]:
              - link "Ideas & Guides" [ref=e268] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e269]:
          - generic [ref=e270]: Services
          - list [ref=e271]:
            - listitem [ref=e272]:
              - link "Gift Card" [ref=e273] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e274]:
              - link "Mobile App" [ref=e275] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e276]:
              - link "Shipping & Delivery" [ref=e277] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e278]:
              - link "Order Pickup" [ref=e279] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e280]:
              - link "Account Signup" [ref=e281] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e282]:
          - generic [ref=e283]: Help
          - list [ref=e284]:
            - listitem [ref=e285]:
              - link "Shopcart Help" [ref=e286] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e287]:
              - link "Returns" [ref=e288] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e289]:
              - link "Track Orders" [ref=e290] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e291]:
              - link "Contact Us" [ref=e292] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e293]:
              - link "Feedback" [ref=e294] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e295]:
              - link "Security & Fraud" [ref=e296] [cursor=pointer]:
                - /url: "#"
      - generic [ref=e298]:
        - generic [ref=e299]:
          - generic [ref=e300]:
            - img [ref=e301]
            - link "Become Seller" [ref=e302] [cursor=pointer]:
              - /url: "#"
          - generic [ref=e303]:
            - img [ref=e304]
            - link "Gift Cards" [ref=e305] [cursor=pointer]:
              - /url: "#"
          - generic [ref=e306]:
            - img [ref=e307]
            - link "Help Center" [ref=e308] [cursor=pointer]:
              - /url: "#"
        - generic [ref=e309]:
          - link "Terms of Service" [ref=e310] [cursor=pointer]:
            - /url: "#"
          - link "Privacy & Policy" [ref=e311] [cursor=pointer]:
            - /url: "#"
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
  69  |     await userMenuTrigger.click();
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
> 84  |     expect(cookies.some(c => c.name === AUTH_COOKIES.SESSION)).toBeTruthy();
      |                                                                ^ Error: expect(received).toBeTruthy()
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
  170 | 
  171 |     await page.evaluate(({ key, data }) => {
  172 |       localStorage.setItem(key, JSON.stringify(data));
  173 |     }, {
  174 |       key: getGuestCartKey(),
  175 |       data: {
  176 |         items: [{
  177 |           id: 'local_123',
  178 |           product_id: 1,
  179 |           product_variant_id: 1,
  180 |           quantity: 1,
  181 |           name: 'Guest Cart Item',
  182 |           price: 49.99,
  183 |           image: '/test.jpg',
  184 |         }],
```