# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/logout.spec.ts >> Logout Flow >> should clear authenticated cart after logout
- Location: tests/e2e/auth/logout.spec.ts:117:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('[data-testid="cart-item"]')
Expected: 1
Received: 0
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('[data-testid="cart-item"]')
    13 × locator resolved to 0 elements
       - unexpected value "0"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e6]:
      - link "Call +00 123 456 7890" [ref=e7] [cursor=pointer]:
        - /url: tel:+001234567890
        - img [ref=e9]
        - generic [ref=e11]: Call
        - generic [ref=e12]: +00 123 456 7890
      - generic [ref=e13]:
        - paragraph [ref=e14]: Get 50% Off on Selected Items
        - generic [ref=e15]: "|"
        - paragraph [ref=e16]: Shop Now
      - button "en" [ref=e20]:
        - text: en
        - img [ref=e21]
    - banner [ref=e23]:
      - generic [ref=e24]:
        - link [ref=e26] [cursor=pointer]:
          - /url: /
        - generic [ref=e28]:
          - navigation [ref=e29]:
            - list [ref=e30]:
              - listitem [ref=e31]:
                - link "Home" [ref=e32] [cursor=pointer]:
                  - /url: /
              - listitem [ref=e33]:
                - link "Shop" [ref=e34] [cursor=pointer]:
                  - /url: /shop
              - listitem [ref=e35]: Contact Us
          - generic [ref=e37]:
            - generic [ref=e38] [cursor=pointer]:
              - img [ref=e39]
              - generic [ref=e41]: Search for products...
            - searchbox "Search for products..." [ref=e42]
        - generic [ref=e43]:
          - link "Account" [ref=e44] [cursor=pointer]:
            - /url: /login
            - generic [ref=e45]: Account
          - link "Cart" [ref=e46] [cursor=pointer]:
            - /url: /cart
            - generic [ref=e47]: Cart
          - button "Toggle theme" [ref=e48]:
            - generic [ref=e49]: ☀️
    - main [ref=e50]:
      - generic [ref=e52]:
        - navigation [ref=e55]:
          - link "Home" [ref=e56] [cursor=pointer]:
            - /url: /
          - generic [ref=e57]: /
          - generic [ref=e58]: Shopping Cart
        - generic [ref=e60]:
          - img [ref=e62]
          - heading "Your cart is empty" [level=2] [ref=e64]
          - paragraph [ref=e65]: Looks like you haven't added anything to your cart yet. Start shopping to find great products!
          - link "Continue Shopping" [ref=e66] [cursor=pointer]:
            - /url: /
    - contentinfo [ref=e68]:
      - generic [ref=e69]:
        - generic [ref=e70]:
          - generic [ref=e72]:
            - img [ref=e73]
            - paragraph [ref=e74]: This is a fake description for the English version. It is not the same as the original one.
          - generic [ref=e75]:
            - generic [ref=e76]: Accepted Payments
            - generic [ref=e77]:
              - img [ref=e79]
              - img [ref=e81]
              - img [ref=e83]
              - img [ref=e85]
              - img [ref=e87]
              - img [ref=e89]
              - img [ref=e91]
              - img [ref=e93]
        - generic [ref=e94]:
          - generic [ref=e95]: Department
          - list [ref=e96]:
            - listitem [ref=e97]:
              - link "Fashion" [ref=e98] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e99]:
              - link "Education Product" [ref=e100] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e101]:
              - link "Frozen Food" [ref=e102] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e103]:
              - link "Beverages" [ref=e104] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e105]:
              - link "Organic Grocery" [ref=e106] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e107]:
              - link "Office Supplies" [ref=e108] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e109]:
              - link "Beauty Products" [ref=e110] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e111]:
              - link "Books" [ref=e112] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e113]:
              - link "Electronics & Gadget" [ref=e114] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e115]:
              - link "Travel Accessories" [ref=e116] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e117]:
              - link "Fitness" [ref=e118] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e119]:
              - link "Sneakers" [ref=e120] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e121]:
              - link "Toys" [ref=e122] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e123]:
              - link "Furniture" [ref=e124] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e125]:
          - generic [ref=e126]: About us
          - list [ref=e127]:
            - listitem [ref=e128]:
              - link "About Shopcart" [ref=e129] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e130]:
              - link "Careers" [ref=e131] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e132]:
              - link "News & Blog" [ref=e133] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e134]:
              - link "Help" [ref=e135] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e136]:
              - link "Press Center" [ref=e137] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e138]:
              - link "Shop by location" [ref=e139] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e140]:
              - link "Shopcart brands" [ref=e141] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e142]:
              - link "Affiliate & Partners" [ref=e143] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e144]:
              - link "Ideas & Guides" [ref=e145] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e146]:
          - generic [ref=e147]: Services
          - list [ref=e148]:
            - listitem [ref=e149]:
              - link "Gift Card" [ref=e150] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e151]:
              - link "Mobile App" [ref=e152] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e153]:
              - link "Shipping & Delivery" [ref=e154] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e155]:
              - link "Order Pickup" [ref=e156] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e157]:
              - link "Account Signup" [ref=e158] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e159]:
          - generic [ref=e160]: Help
          - list [ref=e161]:
            - listitem [ref=e162]:
              - link "Shopcart Help" [ref=e163] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e164]:
              - link "Returns" [ref=e165] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e166]:
              - link "Track Orders" [ref=e167] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e168]:
              - link "Contact Us" [ref=e169] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e170]:
              - link "Feedback" [ref=e171] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e172]:
              - link "Security & Fraud" [ref=e173] [cursor=pointer]:
                - /url: "#"
      - generic [ref=e175]:
        - generic [ref=e176]:
          - generic [ref=e177]:
            - img [ref=e178]
            - link "Become Seller" [ref=e179] [cursor=pointer]:
              - /url: "#"
          - generic [ref=e180]:
            - img [ref=e181]
            - link "Gift Cards" [ref=e182] [cursor=pointer]:
              - /url: "#"
          - generic [ref=e183]:
            - img [ref=e184]
            - link "Help Center" [ref=e185] [cursor=pointer]:
              - /url: "#"
        - generic [ref=e186]:
          - link "Terms of Service" [ref=e187] [cursor=pointer]:
            - /url: "#"
          - link "Privacy & Policy" [ref=e188] [cursor=pointer]:
            - /url: "#"
  - generic:
    - img
  - generic:
    - generic:
      - generic:
        - button "Go to parent" [disabled]
        - button "Open in editor"
        - button "Close"
  - generic [ref=e189]:
    - button "Toggle Nuxt DevTools" [ref=e190] [cursor=pointer]:
      - img [ref=e191]
    - generic "Page load time" [ref=e194]:
      - generic [ref=e195]: "334"
      - generic [ref=e196]: ms
    - button "Toggle Component Inspector" [ref=e198] [cursor=pointer]:
      - img [ref=e199]
  - region "Notifications (F8)":
    - list
```

# Test source

```ts
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
> 141 |     await expect(cartItems).toHaveCount(1);
      |                             ^ Error: expect(locator).toHaveCount(expected) failed
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
  185 |       },
  186 |     });
  187 | 
  188 |     await page.reload();
  189 |     await page.goto('/cart');
  190 | 
  191 |     const cartItems = page.locator('[data-testid="cart-item"]');
  192 |     await expect(cartItems).toHaveCount(1);
  193 |   });
  194 | 
  195 |   test('should not allow logout if already logged out', async ({ page }) => {
  196 |     await assertNotAuthenticated(page);
  197 | 
  198 |     const response = await page.request.post('/api/auth/logout');
  199 | 
  200 |     expect([200, 401, 403]).toContain(response.status());
  201 |   });
  202 | 
  203 |   test('should clear Pinia store state after logout', async ({ page }) => {
  204 |     await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
  205 |     await page.goto('/');
  206 | 
  207 |     await assertAuthenticated(page);
  208 | 
  209 |     await page.context().clearCookies();
  210 | 
  211 |     const cookies = await page.context().cookies();
  212 |     const authCookie = cookies.find(c => c.name === AUTH_COOKIES.JS_AUTH);
  213 |     expect(authCookie).toBeUndefined();
  214 |   });
  215 | 
  216 |   test('should handle logout button click multiple times', async ({ page }) => {
  217 |     await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
  218 |     await page.goto('/');
  219 | 
  220 |     const userMenuTrigger = page.locator('[data-testid="user-menu-trigger"], [data-testid="profile-dropdown-trigger"]');
  221 |     await userMenuTrigger.click();
  222 | 
  223 |     const logoutButton = page.locator('[data-testid="logout-button"], button:has-text("Logout"), button:has-text("Log out")');
  224 |     await logoutButton.click();
  225 | 
  226 |     await page.waitForTimeout(100);
  227 |     if (await logoutButton.isVisible()) {
  228 |       await logoutButton.click();
  229 |     }
  230 | 
  231 |     await assertNotAuthenticated(page);
  232 |   });
  233 | 
  234 |   test('should show login link after logout', async ({ page }) => {
  235 |     await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
  236 |     await page.goto('/');
  237 | 
  238 |     await page.context().clearCookies();
  239 |     await page.goto('/');
  240 | 
  241 |     const loginLink = page.locator('a[href*="login"]');
```