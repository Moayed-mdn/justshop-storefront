# Playwright Quick Reference

**Quick commands for running E2E tests**

---

## 🚀 Running Tests

### Run All Tests
```bash
npm run test:e2e
```

### Run Specific Test Suite
```bash
# Auth tests
npm run test:e2e tests/e2e/auth/

# Cart tests
npm run test:e2e tests/e2e/cart/

# Single test file
npm run test:e2e tests/e2e/auth/login.spec.ts
```

### Run on Specific Browser
```bash
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
npm run test:e2e -- --project="Mobile Chrome"
```

### Interactive Modes
```bash
# Debug mode (step through tests)
npm run test:e2e:debug

# UI mode (interactive browser)
npm run test:e2e:ui

# Headed mode (see browser)
npm run test:e2e:headed
```

### View Test Report
```bash
npm run test:e2e:report
```

---

## 📊 Current Test Coverage

| Suite | Tests | Status |
|-------|-------|--------|
| **auth/login.spec.ts** | 12 | ✅ Complete |
| **auth/register.spec.ts** | 24 | ✅ Complete |
| **auth/logout.spec.ts** | 16 | ✅ Complete |
| **cart/guest-cart.spec.ts** | 13 | ✅ Complete |
| **cart/authenticated-cart.spec.ts** | 24 | ✅ Complete |
| **cart/cart-ui.spec.ts** | 30 | ✅ Complete |
| **example.spec.ts** | 9 | ✅ Complete |
| **TOTAL** | **107** | **✅ Complete** |

---

## 📁 Test File Locations

```
tests/
├── e2e/
│   ├── auth/
│   │   ├── login.spec.ts         (12 tests)
│   │   ├── register.spec.ts      (24 tests)
│   │   └── logout.spec.ts        (16 tests)
│   ├── cart/
│   │   ├── guest-cart.spec.ts    (13 tests)
│   │   ├── authenticated-cart.spec.ts  (24 tests)
│   │   └── cart-ui.spec.ts       (30 tests)
│   └── example.spec.ts           (9 tests)
├── pages/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── ProductPage.ts
│   └── CartPage.ts
├── helpers/
│   ├── auth.ts
│   ├── cart.ts
│   ├── search.ts
│   ├── orders.ts
│   └── profile.ts
└── fixtures/
    ├── users.ts
    └── products.ts
```

---

## 🔧 Common Patterns

### Add data-testid to Components
```vue
<!-- Auth components -->
<input data-testid="login-email-input" />
<button data-testid="login-submit-button" />

<!-- Cart components -->
<button data-testid="cart-button" />
<span data-testid="cart-badge">3</span>
<button data-testid="cart-item-remove" />

<!-- Product components -->
<div data-testid="product-card" />
<button data-testid="product-add-to-cart-button" />
```

### Use in Tests
```typescript
// Locators
await page.locator('[data-testid="login-email-input"]').fill('test@example.com');
await page.locator('[data-testid="cart-button"]').click();

// Assertions
await expect(page.locator('[data-testid="cart-badge"]')).toHaveText('3');
```

### Setup Authenticated Context
```typescript
import { setupAuthenticatedContext } from '../fixtures';

test('authenticated flow', async ({ page }) => {
  await setupAuthenticatedContext(page, testUser);
  // Test logic...
});
```

### Setup Guest Cart
```typescript
import { setupGuestCart } from '../fixtures';

test('guest cart flow', async ({ page }) => {
  await setupGuestCart(page, cartItems);
  // Test logic...
});
```

---

## 🎯 Test Standards

All tests follow these patterns:

✅ Use actual `data-testid` attributes  
✅ Independent execution with `beforeEach` cleanup  
✅ Test both happy path AND error states  
✅ Include security validations  
✅ Support i18n (English + Arabic)  
✅ Multi-tenant awareness  
✅ Proper async/await usage  
✅ TypeScript strict mode  

---

## 📚 Documentation

- **PLAYWRIGHT_CONTEXT.md** - Complete project memory
- **PLAYWRIGHT_COMPLETION_SUMMARY.md** - What's been done
- **PLAYWRIGHT.md** - Comprehensive guide (2,153 lines)
- **.playwrightrules** - Coding rules (1,321 lines)
- **tests/README.md** - Tests directory overview
- **tests/QUICK_START.md** - Beginner guide

---

## 🐛 Troubleshooting

### Tests Failing?

1. **Check backend is running**
   ```bash
   curl http://localhost:8000/api/v1/health
   ```

2. **Check frontend is running**
   ```bash
   curl http://demo.justshop.test:3000
   ```

3. **Clear test state**
   ```bash
   # Restart dev server
   npm run dev
   ```

4. **Check environment variables**
   ```bash
   cat tests/.env.test
   ```

5. **Reinstall Playwright browsers**
   ```bash
   npx playwright install
   ```

### Common Issues

- **"Target closed" error**: Dev server crashed, restart it
- **"Timeout" error**: Backend is slow or not responding
- **"Locator not found"**: data-testid attribute missing or incorrect
- **"Session expired"**: Auth cookies expired, use fresh login

---

## 🎉 Quick Wins

### Run Auth Tests Only (Fast)
```bash
npm run test:e2e tests/e2e/auth/ -- --project=chromium
```

### Run Cart Tests Only (Fast)
```bash
npm run test:e2e tests/e2e/cart/ -- --project=chromium
```

### Debug Specific Test
```bash
npm run test:e2e:debug tests/e2e/auth/login.spec.ts
```

### See Tests in Browser
```bash
npm run test:e2e:ui
```

---

**For detailed information, see PLAYWRIGHT_CONTEXT.md**
