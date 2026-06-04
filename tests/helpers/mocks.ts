/**
 * API Mock Helpers
 *
 * Playwright route interception helpers for mocking backend API responses.
 * Use these in tests that need specific product/cart/auth data without
 * depending on a live backend or seeded database.
 *
 * Usage:
 *   import { mockProductAPI, mockCartAPI, mockAuthAPI } from '../helpers/mocks';
 *
 *   test('my test', async ({ page }) => {
 *     await mockProductAPI(page, basicProduct);
 *     await page.goto('/shop/product/basic-t-shirt');
 *   });
 */

import type { Page, Route } from '@playwright/test';
import type { Product } from './types';
import {
  basicProduct,
  productWithVariants,
  saleProduct,
  outOfStockProduct,
  lowStockProduct,
  detailedProduct,
  testProducts,
} from '../fixtures/products';
import { mockAuthenticatedUser } from '../fixtures/users';

// ---------------------------------------------------------------------------
// Response envelope helpers
// ---------------------------------------------------------------------------

function apiSuccess<T>(data: T, message = 'Success') {
  return { status: true, message, data };
}

function apiPaginated<T>(items: T[], page = 1, perPage = 12) {
  return {
    status: true,
    message: 'Success',
    data: items,
    meta: {
      pagination: {
        total: items.length,
        count: items.length,
        per_page: perPage,
        current_page: page,
        total_pages: Math.ceil(items.length / perPage),
      },
    },
  };
}

function apiError(message: string, errorCode = 'ERROR', status = 422) {
  return { status: false, message, error_code: errorCode, errors: null };
}

// ---------------------------------------------------------------------------
// Product API mocks
// ---------------------------------------------------------------------------

/**
 * Mock GET /api/products/{slug} for a single product detail page.
 * Also mocks GET /api/products/{slug}/related with an empty array.
 *
 * @param page     Playwright page
 * @param product  Product fixture to return (defaults to basicProduct)
 */
export async function mockProductDetailAPI(
  page: Page,
  product: Product = basicProduct,
): Promise<void> {
  // Single product detail
  await page.route(`**/api/products/${product.slug}`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(apiSuccess(product)),
    });
  });

  // Related products — return a few fixture products to avoid empty sections
  await page.route(`**/api/products/${product.slug}/related`, async (route: Route) => {
    const related = testProducts
      .filter((p) => p.slug !== product.slug)
      .slice(0, 4);
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(apiSuccess(related)),
    });
  });
}

/**
 * Mock GET /api/products (listing page) with a fixed set of fixture products.
 * Intercepts all query strings (page, sort, category, etc.).
 *
 * @param page      Playwright page
 * @param products  Array of products to return (defaults to all fixture products)
 */
export async function mockProductListingAPI(
  page: Page,
  products: Product[] = testProducts,
): Promise<void> {
  await page.route('**/api/products*', async (route: Route) => {
    // Don't intercept slug-specific routes — those are handled by mockProductDetailAPI
    const url = route.request().url();
    if (url.match(/\/api\/products\/[^?]+/)) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(apiPaginated(products)),
    });
  });
}

/**
 * Mock GET /api/products/category/{slug} with a fixed set of fixture products.
 *
 * @param page      Playwright page
 * @param slug      Category slug to intercept
 * @param products  Products to return for this category
 */
export async function mockProductCategoryAPI(
  page: Page,
  slug: string,
  products: Product[] = testProducts,
): Promise<void> {
  await page.route(`**/api/products/category/${slug}*`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(apiPaginated(products)),
    });
  });
}

/**
 * Convenience: mock ALL product API routes at once.
 * Use this when a test navigates to both listing and detail pages.
 *
 * @param page    Playwright page
 * @param detail  Product to use for detail routes (defaults to basicProduct)
 */
export async function mockProductAPI(
  page: Page,
  detail: Product = basicProduct,
): Promise<void> {
  await mockProductListingAPI(page);
  await mockProductDetailAPI(page, detail);
}

// ---------------------------------------------------------------------------
// Cart API mocks
// ---------------------------------------------------------------------------

/**
 * Mock all cart endpoints:
 *   GET    /api/cart           → empty cart
 *   POST   /api/cart/items     → add item (returns updated cart with 1 item)
 *   PATCH  /api/cart/items/:id → update item
 *   DELETE /api/cart/items/:id → remove item
 *   DELETE /api/cart/clear     → clear cart
 */
export async function mockCartAPI(page: Page): Promise<void> {
  const emptyCart = {
    id: 1,
    items: [],
    total_items: 0,
    total_price: 0,
  };

  const cartWithItem = {
    id: 1,
    items: [
      {
        id: 101,
        quantity: 1,
        name: basicProduct.name,
        image: basicProduct.image,
        price: parseFloat(basicProduct.price),
        max_quantity: basicProduct.stock_quantity,
        product: { id: basicProduct.id, name: basicProduct.name, slug: basicProduct.slug },
        variant: { id: 1, sku: 'TEST-SKU', price: parseFloat(basicProduct.price), stock: 10, image: null, attributes: [] },
        subtotal: parseFloat(basicProduct.price),
      },
    ],
    total_items: 1,
    total_price: parseFloat(basicProduct.price),
  };

  // GET /api/cart — start empty
  await page.route('**/api/cart', async (route: Route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiSuccess(emptyCart)),
      });
    } else {
      await route.continue();
    }
  });

  // POST /api/cart/items — add item
  await page.route('**/api/cart/items', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiSuccess(cartWithItem)),
      });
    } else {
      await route.continue();
    }
  });

  // PATCH /api/cart/items/:id — update item
  await page.route('**/api/cart/items/**', async (route: Route) => {
    if (route.request().method() === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiSuccess(cartWithItem)),
      });
    } else if (route.request().method() === 'DELETE') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiSuccess(emptyCart)),
      });
    } else {
      await route.continue();
    }
  });

  // DELETE /api/cart/clear
  await page.route('**/api/cart/clear', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(apiSuccess(emptyCart)),
    });
  });
}

// ---------------------------------------------------------------------------
// Orders API mocks
// ---------------------------------------------------------------------------

/** Shared order fixture used across mock helpers */
function makeOrder(overrides: Partial<Record<string, any>> = {}): Record<string, any> {
  return {
    id: 1,
    order_number: 'ORD-2024-001',
    status: 'processing',
    payment_status: 'paid',
    subtotal: 89.99,
    tax_amount: 0,
    shipping_amount: 0,
    discount_amount: 0,
    total: 89.99,
    currency: 'USD',
    shipping_method: 'standard',
    tracking_number: null,
    shipping_address_data: {
      name: 'Test User',
      address_line_1: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      postal_code: '62701',
      country: 'US',
      phone: '+1234567890',
    },
    can_cancel: true,
    items_count: 1,
    items: [
      {
        id: 1,
        product_id: 1,
        product_variant_id: 1,
        product_name: 'Basic T-Shirt',
        product_slug: 'basic-t-shirt',
        sku: 'TSH-001',
        image: '/images/products/t-shirt.jpg',
        unit_price: 89.99,
        unit_discount_percentage: 0,
        quantity: 1,
        subtotal: 89.99,
        attributes: [],
        is_available: true,
      },
    ],
    shipped_at: null,
    delivered_at: null,
    created_at: '2024-06-01T10:00:00Z',
    ...overrides,
  };
}

function makeOrderFilters() {
  return [
    { value: null, label: 'all', count: 4 },
    { value: 'pending', label: 'pending', count: 1 },
    { value: 'processing', label: 'processing', count: 1 },
    { value: 'shipped', label: 'shipped', count: 0 },
    { value: 'delivered', label: 'delivered', count: 1 },
    { value: 'cancelled', label: 'cancelled', count: 1 },
  ];
}

/**
 * Mock GET /api/orders (paginated list) and GET /api/orders/filters.
 *
 * @param page    Playwright page
 * @param orders  Array of order objects to return (defaults to one fixture order)
 */
export async function mockOrdersListAPI(
  page: Page,
  orders: Record<string, any>[] = [makeOrder()],
): Promise<void> {
  await page.route('**/api/orders/filters', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(apiSuccess(makeOrderFilters())),
    });
  });

  await page.route('**/api/orders*', async (route: Route) => {
    const url = route.request().url();
    // Let slug-specific routes (orders/123, orders/filters, etc.) fall through
    if (url.match(/\/api\/orders\/[^?]+/)) {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        apiPaginated(orders, 1, 10),
      ),
    });
  });
}

/**
 * Mock GET /api/orders/:orderNumber (single order detail).
 *
 * @param page          Playwright page
 * @param orderNumber   Order number to intercept
 * @param overrides     Fields to override on the default fixture
 */
export async function mockOrderDetailAPI(
  page: Page,
  orderNumber = 'ORD-2024-001',
  overrides: Partial<Record<string, any>> = {},
): Promise<void> {
  const order = makeOrder({ order_number: orderNumber, ...overrides });

  await page.route(`**/api/orders/${orderNumber}`, async (route: Route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiSuccess(order)),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock POST /api/orders/:orderNumber/cancel.
 */
export async function mockOrderCancelAPI(
  page: Page,
  orderNumber = 'ORD-2024-001',
): Promise<void> {
  const cancelled = makeOrder({ order_number: orderNumber, status: 'cancelled', can_cancel: false });

  await page.route(`**/api/orders/${orderNumber}/cancel`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(apiSuccess(cancelled, 'Order cancelled successfully')),
    });
  });
}

/**
 * Mock POST /api/orders/:orderNumber/reorder.
 */
export async function mockOrderReorderAPI(
  page: Page,
  orderNumber = 'ORD-2024-001',
): Promise<void> {
  await page.route(`**/api/orders/${orderNumber}/reorder`, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        apiSuccess(
          { added: [{ product_variant_id: 1, quantity: 1 }], failed: [] },
          'Items added to cart',
        ),
      ),
    });
  });
}

/**
 * Mock POST /api/orders/guest/lookup.
 *
 * @param page           Playwright page
 * @param shouldSucceed  true = return a found order; false = return 404
 */
export async function mockGuestOrderLookupAPI(
  page: Page,
  shouldSucceed = true,
): Promise<void> {
  await page.route('**/api/orders/guest/lookup', async (route: Route) => {
    if (!shouldSucceed) {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify(apiError('Order not found.', 'ORDER_NOT_FOUND')),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(apiSuccess(makeOrder())),
    });
  });
}

/** Expose fixture builder so spec files can create custom orders */
export { makeOrder as makeOrderFixture };

// ---------------------------------------------------------------------------
// Checkout API mocks
// ---------------------------------------------------------------------------

/**
 * Mock checkout session creation:
 *   POST /api/checkout/session      → guest checkout session
 *   POST /api/checkout/session/auth → authenticated checkout session
 *
 * Returns a fake session_url pointing to /checkout/cancel so the browser
 * does NOT actually navigate away from the test domain during tests.
 * Tests that verify the redirect itself should check window.location was set.
 *
 * @param page        Playwright page
 * @param sessionUrl  Override the session_url returned (defaults to cancel page
 *                    to keep tests within the app domain)
 */
export async function mockCheckoutSessionAPI(
  page: Page,
  sessionUrl = '/checkout/cancel',
): Promise<void> {
  const body = JSON.stringify(
    apiSuccess({ session_id: 'cs_test_mock123', session_url: sessionUrl }),
  );

  await page.route('**/api/checkout/session/auth', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 200, contentType: 'application/json', body });
    } else {
      await route.continue();
    }
  });

  await page.route('**/api/checkout/session', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 200, contentType: 'application/json', body });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock a failed checkout session (e.g. empty cart, backend error).
 */
export async function mockCheckoutSessionFailure(page: Page, message = 'Checkout failed'): Promise<void> {
  const body = JSON.stringify(apiError(message, 'CHECKOUT_ERROR'));

  await page.route('**/api/checkout/session/auth', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 422, contentType: 'application/json', body });
    } else {
      await route.continue();
    }
  });

  await page.route('**/api/checkout/session', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 422, contentType: 'application/json', body });
    } else {
      await route.continue();
    }
  });
}

/**
 * Mock GET /api/checkout/status/:sessionId
 *
 * @param page          Playwright page
 * @param paymentStatus 'paid' | 'unpaid' | 'no_payment_required'
 * @param orderNumber   Order number to return
 */
export async function mockCheckoutStatusAPI(
  page: Page,
  paymentStatus: 'paid' | 'unpaid' | 'no_payment_required' = 'paid',
  orderNumber = 'ORD-TEST-001',
): Promise<void> {
  await page.route('**/api/checkout/status/**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        apiSuccess({
          payment_status: paymentStatus,
          order_number: orderNumber,
          order_status: paymentStatus === 'paid' ? 'processing' : 'pending',
          customer_email: 'test@example.com',
        }),
      ),
    });
  });
}

// ---------------------------------------------------------------------------
// Auth API mocks
// ---------------------------------------------------------------------------

/**
 * Mock authentication endpoints:
 *   POST /api/auth/login    → success with mockAuthenticatedUser
 *   POST /api/auth/logout   → success
 *   GET  /api/auth/me       → mockAuthenticatedUser
 *   POST /api/auth/register → success (redirect to login)
 */
export async function mockAuthAPI(page: Page): Promise<void> {
  // POST /api/auth/login
  await page.route('**/api/auth/login', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          apiSuccess({ user: mockAuthenticatedUser }, 'Logged in successfully'),
        ),
      });
    } else {
      await route.continue();
    }
  });

  // POST /api/auth/logout
  await page.route('**/api/auth/logout', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiSuccess(null, 'Logged out successfully')),
      });
    } else {
      await route.continue();
    }
  });

  // GET /api/auth/me
  await page.route('**/api/auth/me', async (route: Route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiSuccess(mockAuthenticatedUser)),
      });
    } else {
      await route.continue();
    }
  });

  // POST /api/auth/register
  await page.route('**/api/auth/register', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(apiSuccess({ user: mockAuthenticatedUser }, 'Registration successful')),
      });
    } else {
      await route.continue();
    }
  });
}

// ---------------------------------------------------------------------------
// Profile API mocks
// ---------------------------------------------------------------------------

/**
 * Mock profile endpoints:
 *   GET    /api/profile         → user profile data
 *   PATCH  /api/profile         → update profile
 *   POST   /api/profile/avatar  → upload avatar
 *   DELETE /api/profile/avatar  → remove avatar
 *   PATCH  /api/profile/password → change password
 *   DELETE /api/profile         → delete account
 */
export async function mockProfileAPI(page: Page): Promise<void> {
  const profileData = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    avatar: null,
    has_password: true,
    has_google_linked: false,
    email_verified_at: '2024-01-01T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  // GET /api/profile
  await page.route('**/api/profile', async (route: Route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiSuccess(profileData)),
      });
    } else if (route.request().method() === 'PATCH') {
      // PATCH /api/profile - update profile
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiSuccess(profileData, 'Profile updated successfully')),
      });
    } else if (route.request().method() === 'DELETE') {
      // DELETE /api/profile - delete account
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiSuccess(null, 'Account deleted successfully')),
      });
    } else {
      await route.continue();
    }
  });

  // POST /api/profile/avatar - upload avatar
  await page.route('**/api/profile/avatar', async (route: Route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiSuccess({ avatar: '/avatars/test-user.jpg' }, 'Avatar uploaded successfully')),
      });
    } else if (route.request().method() === 'DELETE') {
      // DELETE /api/profile/avatar - remove avatar
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiSuccess(null, 'Avatar removed successfully')),
      });
    } else {
      await route.continue();
    }
  });

  // PATCH /api/profile/password - change password
  await page.route('**/api/profile/password', async (route: Route) => {
    if (route.request().method() === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiSuccess(null, 'Password changed successfully')),
      });
    } else {
      await route.continue();
    }
  });
}

// ---------------------------------------------------------------------------
// Re-export fixture products for convenience in tests
// ---------------------------------------------------------------------------
export {
  basicProduct,
  productWithVariants,
  saleProduct,
  outOfStockProduct,
  lowStockProduct,
  detailedProduct,
  testProducts,
};
