# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth/logout.spec.ts >> Logout Security >> should not be able to make authenticated requests after logout
- Location: tests/e2e/auth/logout.spec.ts:324:3

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  257 |   });
  258 | 
  259 |   test('should convert authenticated cart to guest cart after logout', async ({ page }) => {
  260 |     await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
  261 |     await page.goto('/');
  262 | 
  263 |     await page.context().route('**/api/cart/**', async (route) => {
  264 |       if (route.request().method() === 'POST') {
  265 |         await route.fulfill({
  266 |           status: 200,
  267 |           contentType: 'application/json',
  268 |           body: JSON.stringify(MOCK_CART_RESPONSE),
  269 |         });
  270 |       } else if (route.request().method() === 'GET') {
  271 |         await route.fulfill({
  272 |           status: 200,
  273 |           contentType: 'application/json',
  274 |           body: JSON.stringify(MOCK_CART_RESPONSE),
  275 |         });
  276 |       } else {
  277 |         await route.continue();
  278 |       }
  279 |     });
  280 | 
  281 |     await page.goto('/cart');
  282 |     let cartItems = page.locator('[data-testid="cart-item"]');
  283 |     await expect(cartItems).toHaveCount(1);
  284 | 
  285 |     await page.context().clearCookies();
  286 |     await page.goto('/cart');
  287 | 
  288 |     const emptyMessage = page.locator('[data-testid="cart-empty-message"]');
  289 |     const hasItems = await cartItems.count() > 0;
  290 |     const isEmpty = await emptyMessage.isVisible();
  291 | 
  292 |     expect(hasItems || isEmpty).toBeTruthy();
  293 |   });
  294 | 
  295 |   test('should keep cart badge count at zero after logout with no guest items', async ({ page }) => {
  296 |     await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
  297 |     await page.goto('/');
  298 | 
  299 |     await page.context().clearCookies();
  300 |     await page.goto('/');
  301 | 
  302 |     const cartBadge = page.locator('[data-testid="cart-badge"]');
  303 |     if (await cartBadge.isVisible()) {
  304 |       await expect(cartBadge).toHaveText('0');
  305 |     }
  306 |   });
  307 | });
  308 | 
  309 | test.describe('Logout Security', () => {
  310 |   test('should invalidate session token after logout', async ({ page }) => {
  311 |     await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
  312 | 
  313 |     let cookies = await page.context().cookies();
  314 |     const sessionBefore = cookies.find(c => c.name === AUTH_COOKIES.SESSION);
  315 |     expect(sessionBefore).toBeDefined();
  316 | 
  317 |     await page.context().clearCookies();
  318 | 
  319 |     cookies = await page.context().cookies();
  320 |     const sessionAfter = cookies.find(c => c.name === AUTH_COOKIES.SESSION);
  321 |     expect(sessionAfter).toBeUndefined();
  322 |   });
  323 | 
  324 |   test('should not be able to make authenticated requests after logout', async ({ page }) => {
  325 |     await setupAuthenticatedContext(page, { user: mockAuthenticatedUser });
  326 | 
  327 |     await page.context().route('**/api/profile', async (route) => {
  328 |       if (route.request().method() === 'GET') {
  329 |         const cookies = await page.context().cookies();
  330 |         const hasSession = cookies.some(c => c.name === AUTH_COOKIES.SESSION);
  331 |         if (hasSession) {
  332 |           await route.fulfill({
  333 |             status: 200,
  334 |             contentType: 'application/json',
  335 |             body: JSON.stringify({
  336 |               status: true,
  337 |               message: 'Success',
  338 |               data: mockAuthenticatedUser,
  339 |             }),
  340 |           });
  341 |         } else {
  342 |           await route.fulfill({
  343 |             status: 401,
  344 |             contentType: 'application/json',
  345 |             body: JSON.stringify({
  346 |               status: false,
  347 |               message: 'Unauthenticated',
  348 |             }),
  349 |           });
  350 |         }
  351 |       } else {
  352 |         await route.continue();
  353 |       }
  354 |     });
  355 | 
  356 |     let response = await page.request.get('/api/profile');
> 357 |     expect(response.ok()).toBeTruthy();
      |                           ^ Error: expect(received).toBeTruthy()
  358 | 
  359 |     await page.context().clearCookies();
  360 | 
  361 |     response = await page.request.get('/api/profile');
  362 |     expect(response.ok()).toBeFalsy();
  363 |     expect([401, 403]).toContain(response.status());
  364 |   });
  365 | });
  366 | 
```