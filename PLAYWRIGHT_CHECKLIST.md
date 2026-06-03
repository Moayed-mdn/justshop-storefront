# Playwright E2E Testing - Implementation Checklist

Use this checklist to track your progress in implementing E2E testing for JustShop Frontend.

## ✅ Phase 1: Initial Setup (COMPLETED)

- [x] Playwright installed in `package.json`
- [x] `playwright.config.ts` created and configured
- [x] `PLAYWRIGHT.md` comprehensive guide created
- [x] `.playwrightrules` testing conventions documented
- [x] Test directory structure created
- [x] Helper functions implemented (auth, cart, types)
- [x] Page Object Models created (LoginPage, ProductPage)
- [x] Test fixtures created (products, users)
- [x] Example tests created (auth, cart, basic)
- [x] npm scripts added to `package.json`
- [x] Documentation created (README, QUICK_START, SUMMARY)

## 📋 Phase 2: Environment Setup (TODO)

- [ ] Install Playwright browsers
  ```bash
  npx playwright install
  ```

- [ ] Create test environment file
  ```bash
  cp tests/.env.test.example tests/.env.test
  ```

- [ ] Configure test environment variables in `tests/.env.test`
  - [ ] `NUXT_PUBLIC_API_BASE` - Backend API URL
  - [ ] `NUXT_PUBLIC_GRAPHQL_URL` - GraphQL endpoint
  - [ ] `NUXT_PUBLIC_SITE_URL` - Frontend URL
  - [ ] `TEST_TENANT_ID` - Test tenant identifier
  - [ ] `TEST_USER_EMAIL` - Test user email
  - [ ] `TEST_USER_PASSWORD` - Test user password
  - [ ] `TEST_API_BASE` - Direct backend API for setup
  - [ ] `TEST_API_TOKEN` - Backend API token (if needed)

- [ ] Verify backend is running
  ```bash
  curl http://localhost:8000/api/v1/health
  ```

- [ ] Verify frontend dev server works
  ```bash
  npm run dev
  ```

- [ ] Run example test to verify setup
  ```bash
  npm run test:e2e tests/e2e/example.spec.ts
  ```

## 🏷️ Phase 3: Add data-testid Attributes (CRITICAL)

**Status**: Currently ZERO `data-testid` attributes exist in codebase

### Priority 1: Authentication Components

- [ ] `app/pages/auth/login.vue`
  - [ ] Email input: `data-testid="email-input"`
  - [ ] Password input: `data-testid="password-input"`
  - [ ] Remember checkbox: `data-testid="remember-checkbox"`
  - [ ] Submit button: `data-testid="login-submit"`
  - [ ] Register link: `data-testid="register-link"`
  - [ ] Forgot password link: `data-testid="forgot-password-link"`
  - [ ] Google OAuth button: `data-testid="google-login-button"`
  - [ ] Error message: `data-testid="error-message"`

- [ ] `app/pages/auth/register.vue`
  - [ ] Name input: `data-testid="name-input"`
  - [ ] Email input: `data-testid="email-input"`
  - [ ] Password input: `data-testid="password-input"`
  - [ ] Confirm password: `data-testid="password-confirmation-input"`
  - [ ] Submit button: `data-testid="register-submit"`
  - [ ] Login link: `data-testid="login-link"`

### Priority 2: Cart Components

- [ ] Cart badge (header): `data-testid="cart-badge"`
- [ ] Cart button (header): `data-testid="cart-button"`
- [ ] Cart drawer/modal: `data-testid="cart-drawer"`
- [ ] Cart item: `data-testid="cart-item"`
- [ ] Cart item quantity: `data-testid="cart-item-quantity"`
- [ ] Remove cart item: `data-testid="remove-cart-item"`
- [ ] Clear cart: `data-testid="clear-cart-button"`
- [ ] Cart success notification: `data-testid="cart-success-notification"`
- [ ] Checkout button: `data-testid="checkout-button"`

### Priority 3: Product Components

- [ ] Product card: `data-testid="product-card"`
- [ ] Product name: `data-testid="product-name"`
- [ ] Product price: `data-testid="product-price"`
- [ ] Sale price: `data-testid="sale-price"`
- [ ] Product image: `data-testid="product-image"`
- [ ] Add to cart button: `data-testid="add-to-cart-button"`
- [ ] Quantity input: `data-testid="quantity-input"`
- [ ] Quantity increase: `data-testid="quantity-increase"`
- [ ] Quantity decrease: `data-testid="quantity-decrease"`
- [ ] Variant select: `data-testid="variant-select"`
- [ ] In stock badge: `data-testid="in-stock-badge"`
- [ ] Out of stock badge: `data-testid="out-of-stock-badge"`

### Priority 4: Navigation Components

- [ ] User menu trigger: `data-testid="user-menu-trigger"`
- [ ] Logout button: `data-testid="logout-button"`
- [ ] Profile link: `data-testid="profile-link"`
- [ ] Main navigation: `data-testid="main-nav"`
- [ ] Category links: `data-testid="category-link"`
- [ ] Search input: `data-testid="search-input"`
- [ ] Search button: `data-testid="search-button"`

### Priority 5: Forms and Inputs

- [ ] All form inputs: `data-testid="{field-name}-input"`
- [ ] All submit buttons: `data-testid="{action}-submit"`
- [ ] All cancel buttons: `data-testid="{action}-cancel"`
- [ ] Error messages: `data-testid="error-message"`
- [ ] Success messages: `data-testid="success-message"`
- [ ] Validation errors: `data-testid="{field-name}-error"`

## 🧪 Phase 4: Write Core Tests (TODO)

### Authentication Tests

- [x] Login flow (`tests/e2e/auth/login.spec.ts`) - DONE
- [ ] Registration flow
- [ ] Email verification
- [ ] Password reset
- [ ] OAuth (Google) login
- [ ] Logout flow

### Cart Tests

- [x] Guest cart (`tests/e2e/cart/guest-cart.spec.ts`) - DONE
- [ ] Authenticated cart
- [ ] Cart merge on login
- [ ] Cart persistence
- [ ] Cart synchronization

### Product Tests

- [ ] Product listing
- [ ] Product detail page
- [ ] Product variants
- [ ] Category browsing
- [ ] Product filters
- [ ] Product search

### Checkout Tests

- [ ] Guest checkout
- [ ] Authenticated checkout
- [ ] Checkout success
- [ ] Checkout cancel
- [ ] Payment integration (Stripe)

### Order Tests

- [ ] Order history
- [ ] Order detail
- [ ] Order tracking
- [ ] Order cancellation
- [ ] Reorder functionality

### Profile Tests

- [ ] Profile view
- [ ] Profile update
- [ ] Avatar upload
- [ ] Password change
- [ ] Account deletion

### Search Tests

- [ ] Search results
- [ ] Search autocomplete
- [ ] Search filters
- [ ] Empty search results

### i18n Tests

- [ ] Language switching
- [ ] Arabic RTL layout
- [ ] Locale-specific content
- [ ] URL prefix handling

## 🚀 Phase 5: Advanced Testing (TODO)

### Performance Tests

- [ ] Page load times
- [ ] API response times
- [ ] Image loading
- [ ] Bundle size impact

### Accessibility Tests

- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] ARIA labels
- [ ] Focus management

### Mobile Tests

- [ ] Touch interactions
- [ ] Mobile viewport
- [ ] Responsive layouts
- [ ] Mobile-specific features

### Error Handling Tests

- [ ] Network failures
- [ ] API errors
- [ ] Validation errors
- [ ] 404 pages
- [ ] 500 errors

### Edge Cases

- [ ] Concurrent users
- [ ] Large datasets
- [ ] Slow networks
- [ ] Browser storage limits
- [ ] Session expiry

## 🔄 Phase 6: CI/CD Integration (TODO)

- [ ] Add Playwright to CI pipeline
  ```yaml
  # Example GitHub Actions
  - name: Install Playwright
    run: npx playwright install --with-deps
  
  - name: Run E2E tests
    run: npm run test:e2e
  
  - name: Upload test results
    uses: actions/upload-artifact@v3
    if: always()
    with:
      name: playwright-report
      path: playwright-report/
  ```

- [ ] Configure test environment in CI
- [ ] Set up test database/backend for CI
- [ ] Configure retry and timeout for CI
- [ ] Set up test result reporting
- [ ] Configure artifact uploads (screenshots, videos, traces)

## 📊 Phase 7: Monitoring & Maintenance (TODO)

- [ ] Track test execution time
- [ ] Monitor flaky tests
- [ ] Review test coverage regularly
- [ ] Update tests when features change
- [ ] Document known issues
- [ ] Create test maintenance schedule
- [ ] Set up test result dashboard

## 📈 Test Coverage Goals

| Area | Goal | Current | Status |
|------|------|---------|--------|
| Authentication | 15 tests | 3 | 🟡 In Progress |
| Cart | 20 tests | 12 | 🟡 In Progress |
| Products | 15 tests | 0 | 🔴 Not Started |
| Checkout | 10 tests | 0 | 🔴 Not Started |
| Orders | 10 tests | 0 | 🔴 Not Started |
| Profile | 8 tests | 0 | 🔴 Not Started |
| Search | 5 tests | 0 | 🔴 Not Started |
| i18n | 5 tests | 2 | 🟡 In Progress |
| **TOTAL** | **88 tests** | **17** | **19% Complete** |

## 🎯 Quick Wins (Start Here)

These are the easiest tests to implement first:

1. [ ] **Homepage test** - Verify homepage loads
2. [ ] **Navigation test** - Click through main navigation
3. [ ] **Product listing test** - Load product list page
4. [ ] **Product detail test** - View a product detail page
5. [ ] **Add to cart test** - Add product to cart via UI
6. [ ] **View cart test** - Open cart page and verify items
7. [ ] **Language switch test** - Switch to Arabic and verify RTL
8. [ ] **Search test** - Perform a basic search

## 🐛 Known Issues to Address

- [ ] No `data-testid` attributes exist (CRITICAL)
- [ ] Test users need to be created in backend
- [ ] Backend API might need CORS configuration for tests
- [ ] Some selectors may need adjustment based on actual component structure
- [ ] OAuth testing requires special setup or mocking
- [ ] Stripe integration testing requires test keys

## 📚 Resources Created

- ✅ `PLAYWRIGHT.md` (2,152 lines) - Comprehensive guide
- ✅ `.playwrightrules` (1,321 lines) - Testing conventions
- ✅ `playwright.config.ts` (202 lines) - Configuration
- ✅ `PLAYWRIGHT_SETUP_SUMMARY.md` - Complete setup summary
- ✅ `tests/QUICK_START.md` - Quick start guide
- ✅ `tests/README.md` (186 lines) - Tests directory docs
- ✅ Helper functions (auth, cart, types)
- ✅ Page Object Models (LoginPage, ProductPage)
- ✅ Test fixtures (products, users)
- ✅ Example tests (auth, cart, basic)

**Total Lines Created**: 7,074+ lines of testing infrastructure!

## 🎉 Success Criteria

You'll know the testing implementation is successful when:

- [ ] All tests pass consistently
- [ ] Tests run in < 5 minutes
- [ ] Test coverage > 80% of critical flows
- [ ] CI/CD pipeline includes E2E tests
- [ ] Flaky test rate < 5%
- [ ] New features include E2E tests
- [ ] Team uses tests for debugging
- [ ] Bugs caught before production

## 📞 Need Help?

- Review `PLAYWRIGHT.md` for detailed guidance
- Check `tests/QUICK_START.md` for setup help
- Read `.playwrightrules` for conventions
- Look at example tests for patterns
- Playwright docs: https://playwright.dev

---

**Start with**: Phase 2 (Environment Setup) → Phase 3 (Add data-testid) → Phase 4 (Write Tests)

**Current Status**: Phase 1 Complete ✅ | Ready for Phase 2 🚀
