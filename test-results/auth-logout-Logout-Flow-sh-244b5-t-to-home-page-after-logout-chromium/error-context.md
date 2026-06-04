# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/logout.spec.ts >> Logout Flow >> should redirect to home page after logout
- Location: tests/e2e/auth/logout.spec.ts:94:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/profile/
Received string:  "http://demo.justshop.test:3000/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × unexpected value "http://demo.justshop.test:3000/login"

```

```yaml
- banner:
  - link:
    - /url: /
  - link "Account":
    - /url: /login
  - link "Cart":
    - /url: /cart
  - button "Toggle theme": ☀️
- main:
  - link "Logo":
    - /url: /
    - img "Logo"
  - heading "Log into your account" [level=2]
  - text: Email address
  - textbox "Email address"
  - text: Password
  - textbox "Password": password
  - link "Forgot password?":
    - /url: /forgot-password
  - button "Log in"
  - paragraph:
    - text: Don't have an account?
    - link "Sign Up":
      - /url: /register
- contentinfo:
  - img
  - link "Become Seller":
    - /url: "#"
  - img
  - link "Gift Cards":
    - /url: "#"
  - img
  - link "Help Center":
    - /url: "#"
  - link "Terms of Service":
    - /url: "#"
  - link "Privacy & Policy":
    - /url: "#"
- img
- button "Go to parent" [disabled]
- button "Open in editor"
- button "Close"
- button "Toggle Nuxt DevTools":
  - img
- text: 207 ms
- button "Toggle Component Inspector":
  - img
- region "Notifications (F8)":
  - list
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
> 98  |     await expect(page).toHaveURL(/\/profile/);
      |                        ^ Error: expect(page).toHaveURL(expected) failed
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
```