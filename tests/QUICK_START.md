# Playwright E2E Testing - Quick Start Guide

This guide will help you get up and running with Playwright E2E testing for JustShop Frontend.

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Backend API running (or mocked)
- Test environment configured

## Initial Setup

### 1. Install Playwright Browsers

```bash
npx playwright install
```

This downloads the required browser binaries (Chromium, Firefox, WebKit).

### 2. Configure Test Environment

Copy the test environment template:

```bash
cp tests/.env.test.example tests/.env.test
```

Edit `tests/.env.test` and set your values:

```env
# Test environment configuration
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/v1
NUXT_PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql
NUXT_PUBLIC_SITE_URL=http://localhost:3000

# Test tenant (multi-tenant architecture)
TEST_TENANT_ID=demo

# Test user credentials (for authenticated tests)
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=Password123!

# Backend API (for direct API calls in tests)
TEST_API_BASE=http://localhost:8000/api/v1
TEST_API_TOKEN=your-test-api-token-here
```

### 3. Verify Configuration

Check that Playwright config is correct:

```bash
npx playwright test --list
```

This should list all available test files without errors.

## Running Tests

### Run All Tests

```bash
npm run test:e2e
```

Or directly with Playwright:

```bash
npx playwright test
```

### Run Specific Test File

```bash
npx playwright test tests/e2e/auth/login.spec.ts
```

### Run Tests in Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

This opens the Playwright Inspector for step-by-step debugging.

### Run Tests in UI Mode (Interactive)

```bash
npx playwright test --ui
```

This opens an interactive UI to run and debug tests.

### Run Specific Test by Name

```bash
npx playwright test -g "should successfully login"
```

### Run Tests with Specific Tag

```bash
npx playwright test --grep @smoke
```

## Viewing Test Results

### HTML Report

After test run, view the HTML report:

```bash
npx playwright show-report
```

This opens an interactive HTML report in your browser.

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots: `test-results/*/test-failed-*.png`
- Videos: `test-results/*/video.webm`
- Traces: `test-results/*/trace.zip`

### View Traces

Open a trace file for detailed debugging:

```bash
npx playwright show-trace test-results/auth-login-chromium/trace.zip
```

## Writing Your First Test

### Example 1: Simple Page Test

Create `tests/e2e/homepage.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check title
  await expect(page).toHaveTitle(/JustShop/);
  
  // Check header exists
  await expect(page.locator('header')).toBeVisible();
  
  // Check navigation exists
  await expect(page.locator('nav')).toBeVisible();
});
```

### Example 2: Test with Helpers

Create `tests/e2e/auth/quick-login.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { loginViaAPI, assertAuthenticated } from '../../helpers';

test('user can login via API', async ({ page }) => {
  // Login using helper
  await loginViaAPI(
    page,
    'test@example.com',
    'Password123!'
  );
  
  // Navigate to profile
  await page.goto('/profile');
  
  // Assert authenticated
  await assertAuthenticated(page);
  
  // Check profile page loads
  await expect(page.locator('h1')).toContainText('Profile');
});
```

### Example 3: Test with Page Object Model

Create `tests/e2e/products/view-product.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pages';

test('view product details', async ({ page }) => {
  const productPage = new ProductPage(page);
  
  // Navigate to product
  await productPage.goto('basic-t-shirt');
  
  // Assert page loaded
  await productPage.assertPageLoaded();
  
  // Check product details
  await expect(productPage.productName).toHaveText('Basic T-Shirt');
  await expect(productPage.productPrice).toContainText('29.99');
  
  // Check in stock
  await expect(productPage.inStockBadge).toBeVisible();
});
```

## Project Structure

```
tests/
├── e2e/                    # E2E test files
│   ├── auth/              # Authentication tests
│   ├── cart/              # Cart tests
│   ├── checkout/          # Checkout tests
│   ├── products/          # Product tests
│   └── ...
├── helpers/               # Test helper functions
│   ├── auth.ts           # Auth helpers
│   ├── cart.ts           # Cart helpers
│   ├── types.ts          # TypeScript types
│   └── index.ts          # Export all helpers
├── pages/                 # Page Object Models
│   ├── LoginPage.ts
│   ├── ProductPage.ts
│   └── index.ts
├── fixtures/              # Test data/fixtures
│   └── products.ts       # Product fixtures
├── .env.test             # Test environment variables
├── .env.test.example     # Template for test env
└── README.md             # Testing documentation
```

## Common Test Patterns

### Pattern 1: Setup and Cleanup

```typescript
test.describe('Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    // Cleanup after each test
    await clearCartViaAPI(page);
  });

  test('test something', async ({ page }) => {
    // Your test
  });
});
```

### Pattern 2: Authenticated Tests

```typescript
test.describe('Authenticated Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginViaAPI(page, TEST_USER.email, TEST_USER.password);
  });

  test('authenticated action', async ({ page }) => {
    // Test as authenticated user
    await page.goto('/profile');
    // ...
  });
});
```

### Pattern 3: Data-Driven Tests

```typescript
const testCases = [
  { email: 'invalid', password: 'test', expected: 'Invalid email' },
  { email: 'test@test.com', password: '123', expected: 'Password too short' },
];

for (const testCase of testCases) {
  test(`validates ${testCase.email}`, async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('[name="email"]', testCase.email);
    await page.fill('[name="password"]', testCase.password);
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error')).toContainText(testCase.expected);
  });
}
```

## Adding data-testid Attributes

Before writing extensive tests, add `data-testid` attributes to your components for reliable selectors.

### Example: Button Component

```vue
<template>
  <button
    data-testid="add-to-cart-button"
    @click="handleClick"
  >
    Add to Cart
  </button>
</template>
```

### Example: Input Component

```vue
<template>
  <input
    data-testid="email-input"
    name="email"
    type="email"
    v-model="email"
  />
</template>
```

### Priority Order for data-testid:

1. **Interactive elements**: Buttons, links, inputs, selects
2. **Navigation**: Menu items, breadcrumbs, pagination
3. **Key content**: Product cards, cart items, order items
4. **Status indicators**: Badges, notifications, loading states
5. **Forms**: Form fields, validation messages, submit buttons

## Troubleshooting

### Tests Are Flaky

- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Use `waitFor` on elements: `await element.waitFor({ state: 'visible' })`
- Increase timeouts if needed: `{ timeout: 10000 }`

### Backend Not Responding

- Ensure backend is running: Check `NUXT_PUBLIC_API_BASE`
- Check CORS settings on backend
- Verify `X-Tenant-Id` header is set correctly

### Selectors Not Found

- Use `--debug` mode to inspect the page
- Check if `data-testid` attributes exist
- Use more specific selectors
- Wait for element before interacting

### Tests Pass Locally But Fail in CI

- Use headless mode locally: `npx playwright test --headed`
- Check CI environment variables
- Increase timeouts in CI
- Use retries in CI (already configured in `playwright.config.ts`)

## Best Practices

1. **Use helpers and page objects** - Don't repeat code
2. **Add data-testid attributes** - More reliable than CSS selectors
3. **Test user flows, not implementation** - Test what users do
4. **Keep tests independent** - Each test should work in isolation
5. **Use API for setup** - Faster than UI interactions
6. **Write descriptive test names** - Clear what's being tested
7. **Avoid hardcoded waits** - Use `waitFor` instead of `setTimeout`
8. **Clean up after tests** - Clear carts, logout, etc.

## Next Steps

1. ✅ Read the full documentation: `PLAYWRIGHT.md`
2. ✅ Review testing rules: `.playwrightrules`
3. ✅ Add `data-testid` attributes to components
4. ✅ Write tests for critical user flows
5. ✅ Set up CI/CD integration
6. ✅ Review test coverage regularly

## Useful Commands

```bash
# List all available tests
npx playwright test --list

# Run tests matching pattern
npx playwright test auth

# Run in specific browser
npx playwright test --project=chromium

# Run in headed mode (see browser)
npx playwright test --headed

# Debug mode (step through tests)
npx playwright test --debug

# UI mode (interactive testing)
npx playwright test --ui

# View last test report
npx playwright show-report

# Generate types from config
npx playwright test --list --reporter=list

# Update snapshots
npx playwright test --update-snapshots
```

## Getting Help

- **Playwright Docs**: https://playwright.dev
- **Project Documentation**: `PLAYWRIGHT.md`
- **Testing Rules**: `.playwrightrules`
- **Tests Directory README**: `tests/README.md`

Happy Testing! 🎭
