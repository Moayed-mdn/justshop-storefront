# Playwright Tests

This directory contains E2E tests for JustShop Frontend using Playwright.

## 📁 Directory Structure

```
tests/
├── e2e/                    # E2E test specs
│   ├── auth/              # Authentication tests
│   ├── cart/              # Shopping cart tests
│   ├── checkout/          # Checkout & payment tests
│   ├── products/          # Product browsing tests
│   ├── search/            # Search functionality tests
│   ├── orders/            # Order management tests
│   ├── profile/           # User profile tests
│   └── storefront/        # General storefront tests
├── page-objects/          # Page Object Models
├── helpers/               # Test utilities
├── fixtures/              # Test data
└── .env.test             # Test environment variables
```

## 🚀 Getting Started

### 1. Install Playwright

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install
```

### 2. Configure Environment

```bash
# Copy test environment template
cp tests/.env.test.example tests/.env.test

# Edit tests/.env.test with your test environment values
```

### 3. Run Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/e2e/auth/login.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run with UI
npx playwright test --ui
```

## 📚 Documentation

See the main documentation for detailed testing guidelines:
- [PLAYWRIGHT.md](../PLAYWRIGHT.md) - Comprehensive testing guide
- [.playwrightrules](../.playwrightrules) - Testing rules and conventions

## 🔑 Environment Variables

Required environment variables (see `tests/.env.test.example`):

- `NUXT_PUBLIC_API_BASE` - Backend API URL
- `NUXT_PUBLIC_GRAPHQL_URL` - GraphQL endpoint
- `TEST_TENANT_ID` - Tenant ID for multi-tenant requests
- `TEST_CUSTOMER_EMAIL` - Test user email
- `TEST_CUSTOMER_PASSWORD` - Test user password

## 🧪 Test Categories

### Authentication (`auth/`)
- Login/logout
- Registration
- Email verification
- Password reset
- Google OAuth

### Cart (`cart/`)
- Guest cart operations
- Authenticated cart
- Cart merge on login
- Cart persistence

### Checkout (`checkout/`)
- Guest checkout
- Authenticated checkout
- Success/cancel flows

### Products (`products/`)
- Product listing
- Product detail
- Variants selection
- Filtering
- Category browsing

### Search (`search/`)
- Search results
- Autocomplete
- GraphQL integration

### Orders (`orders/`)
- Order history
- Order detail
- Reorder
- Cancel order
- Guest tracking

### Profile (`profile/`)
- Profile updates
- Avatar upload
- Password change
- Account deletion

## 🎯 Best Practices

1. **Use Page Objects** for complex pages
2. **Use API helpers** for setup (loginViaAPI, clearCartViaAPI)
3. **Clean state** between tests (clear cookies, localStorage)
4. **Test both locales** (English and Arabic)
5. **Add data-testid** attributes to components before testing
6. **Mock external services** (Stripe, backend APIs when needed)
7. **Follow naming conventions** from `.playwrightrules`

## 🔧 Debugging

```bash
# Run with trace
npx playwright test --trace on

# Show trace
npx playwright show-trace trace.zip

# Debug specific test
npx playwright test tests/e2e/cart/guest-cart.spec.ts --debug

# Run with headed mode
npx playwright test --headed --project=chromium
```

## 📊 Reports

After running tests:

```bash
# View HTML report
npx playwright show-report
```

Reports are generated in `playwright-report/`.

## 🤝 Contributing

When adding new tests:

1. Follow the structure in `PLAYWRIGHT.md`
2. Follow conventions in `.playwrightrules`
3. Add appropriate data-testid attributes to components
4. Write clear test descriptions
5. Clean up state in `afterEach`
6. Update this README if adding new test categories

## 🐛 Known Issues

- **No data-testid attributes exist yet** - Need to add systematically
- **Stripe integration** - Requires mocking or test mode setup
- **Backend dependency** - Tests require Laravel backend running

## 📝 Notes

This is a **Nuxt 4 + Vue 3** project with:
- Session-based auth (cookies: `ecommerce_session`, `XSRF-TOKEN`, `js_auth`)
- Multi-tenant architecture (requires `X-Tenant-Id` header)
- Dual cart system (guest localStorage + authenticated server)
- i18n support (English default, Arabic RTL)
- GraphQL search via Apollo Client
