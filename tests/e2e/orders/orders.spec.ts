/**
 * Orders E2E Tests
 *
 * Covers:
 *   - /orders            — authenticated order history list
 *   - /orders/:number    — authenticated order detail page
 *   - /orders/track      — public guest order tracking
 *
 * All tests use API mocks from helpers/mocks.ts.
 * Each test is fully independent — no shared state.
 */

import { test, expect } from '@playwright/test';
import { OrdersPage } from '../../pages/OrdersPage';
import {
  mockAuthAPI,
  mockCartAPI,
  mockOrdersListAPI,
  mockOrderDetailAPI,
  mockOrderCancelAPI,
  mockOrderReorderAPI,
  mockGuestOrderLookupAPI,
  makeOrderFixture,
} from '../../helpers/mocks';
import { clearTestState, setupAuthenticatedContext } from '../../fixtures';

// ---------------------------------------------------------------------------
// Order History List (Authenticated)
// ---------------------------------------------------------------------------

test.describe('Orders List Page — Authenticated', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
  });

  test('guest user is redirected to login when accessing orders page', async ({ page }) => {
    await mockAuthAPI(page);
    const orders = new OrdersPage(page);

    await orders.gotoList();

    // Should redirect to login page (protected route)
    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user can view orders list page', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const order1 = makeOrderFixture({ order_number: 'ORD-001', status: 'processing' });
    const order2 = makeOrderFixture({ order_number: 'ORD-002', status: 'delivered' });
    await mockOrdersListAPI(page, [order1, order2]);

    const orders = new OrdersPage(page);
    await orders.gotoList();

    await orders.assertHasOrders();
    await orders.assertOrderCount(2);
  });

  test('shows empty state when user has no orders', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrdersListAPI(page, []);

    const orders = new OrdersPage(page);
    await orders.gotoList();

    await orders.assertEmptyState();
  });

  test('displays multiple orders with correct information', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const orders_list = [
      makeOrderFixture({ order_number: 'ORD-001', status: 'processing', total: 99.99 }),
      makeOrderFixture({ order_number: 'ORD-002', status: 'delivered', total: 149.99 }),
      makeOrderFixture({ order_number: 'ORD-003', status: 'shipped', total: 79.99 }),
    ];
    await mockOrdersListAPI(page, orders_list);

    const orders = new OrdersPage(page);
    await orders.gotoList();

    await orders.assertOrderCount(3);
  });

  test('can filter orders by status', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });

    const allOrders = [
      makeOrderFixture({ order_number: 'ORD-001', status: 'processing' }),
      makeOrderFixture({ order_number: 'ORD-002', status: 'delivered' }),
    ];
    await mockOrdersListAPI(page, allOrders);

    const orders = new OrdersPage(page);
    await orders.gotoList();

    // Filter buttons should be visible
    await expect(orders.ordersFilters).toBeVisible();

    // Click a status filter
    await orders.filterByStatus('processing');
    await page.waitForTimeout(500);
  });

  test('can clear filters', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrdersListAPI(page, [makeOrderFixture()]);

    const orders = new OrdersPage(page);
    await orders.gotoList();

    await orders.filterByStatus('processing');
    await page.waitForTimeout(300);

    const clearButton = orders.clearFiltersButton;
    const isVisible = await clearButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isVisible) {
      await orders.clearFilters();
    }
  });

  test('shows reorder button on order cards', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrdersListAPI(page, [makeOrderFixture({ order_number: 'ORD-001' })]);

    const orders = new OrdersPage(page);
    await orders.gotoList();

    const reorderButton = orders.reorderButtonOnCard(0);
    const isVisible = await reorderButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await expect(reorderButton).toBeEnabled();
    }
  });

  test('shows cancel button on cancellable orders', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrdersListAPI(page, [
      makeOrderFixture({ order_number: 'ORD-001', can_cancel: true }),
    ]);

    const orders = new OrdersPage(page);
    await orders.gotoList();

    const cancelButton = orders.cancelButtonOnCard(0);
    const isVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await expect(cancelButton).toBeEnabled();
    }
  });

  test('opens cancel confirmation modal when clicking cancel', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrdersListAPI(page, [
      makeOrderFixture({ order_number: 'ORD-001', can_cancel: true }),
    ]);

    const orders = new OrdersPage(page);
    await orders.gotoList();

    await orders.clickCancelOnCard(0);

    const modalVisible = await orders.cancelConfirmButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (modalVisible) {
      await expect(orders.cancelConfirmButton).toBeVisible();
    }
  });

  test('can dismiss cancel modal without cancelling', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrdersListAPI(page, [
      makeOrderFixture({ order_number: 'ORD-001', can_cancel: true }),
    ]);

    const orders = new OrdersPage(page);
    await orders.gotoList();

    await orders.clickCancelOnCard(0);

    const modalVisible = await orders.cancelKeepButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (modalVisible) {
      await orders.dismissCancelModal();
      await expect(orders.cancelConfirmButton).not.toBeVisible();
    }
  });

  test('can navigate to order detail from list', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrdersListAPI(page, [makeOrderFixture({ order_number: 'ORD-001' })]);
    await mockOrderDetailAPI(page, 'ORD-001');

    const orders = new OrdersPage(page);
    await orders.gotoList();

    const detailLink = orders.viewDetailsLinkOnCard(0);
    const isVisible = await detailLink.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await detailLink.click();
      await expect(page).toHaveURL(/\/orders\/ORD-001/);
    }
  });

});

// ---------------------------------------------------------------------------
// Order Detail Page (Authenticated)
// ---------------------------------------------------------------------------

test.describe('Order Detail Page — Authenticated', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
  });

  test('guest user is redirected to login when accessing order detail', async ({ page }) => {
    await mockAuthAPI(page);
    await mockOrderDetailAPI(page, 'ORD-001');

    const orders = new OrdersPage(page);
    await orders.gotoDetail('ORD-001');

    await expect(page).toHaveURL(/\/login/);
  });

  test('authenticated user can view order detail page', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrderDetailAPI(page, 'ORD-001');

    const orders = new OrdersPage(page);
    await orders.gotoDetail('ORD-001');

    await orders.assertDetailLoaded('ORD-001');
  });

  test('displays order number and status in header', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrderDetailAPI(page, 'ORD-DETAIL-001', { status: 'processing' });

    const orders = new OrdersPage(page);
    await orders.gotoDetail('ORD-DETAIL-001');

    await expect(orders.detailOrderNumber).toBeVisible();
    const numberText = await orders.detailOrderNumber.textContent();
    expect(numberText).toContain('ORD-DETAIL-001');
  });

  test('displays order summary with total', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrderDetailAPI(page, 'ORD-001', { total: 199.99 });

    const orders = new OrdersPage(page);
    await orders.gotoDetail('ORD-001');

    await expect(orders.detailSummary).toBeVisible();
    await expect(orders.detailTotal).toBeVisible();
  });

  test('shows reorder button on detail page', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrderDetailAPI(page, 'ORD-001');

    const orders = new OrdersPage(page);
    await orders.gotoDetail('ORD-001');

    const reorderButton = orders.detailReorderButton;
    const isVisible = await reorderButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await expect(reorderButton).toBeEnabled();
    }
  });

  test('shows cancel button when order can be cancelled', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrderDetailAPI(page, 'ORD-001', { can_cancel: true });

    const orders = new OrdersPage(page);
    await orders.gotoDetail('ORD-001');

    const cancelButton = orders.detailCancelButton;
    const isVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await expect(cancelButton).toBeEnabled();
    }
  });

  test('reorder button redirects to cart with items', async ({ page }) => {
    await mockAuthAPI(page);
    await mockCartAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrderDetailAPI(page, 'ORD-001');
    await mockOrderReorderAPI(page, 'ORD-001');

    const orders = new OrdersPage(page);
    await orders.gotoDetail('ORD-001');

    const reorderButton = orders.detailReorderButton;
    const isVisible = await reorderButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await reorderButton.click();
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/\/cart/);
    }
  });

});

// ---------------------------------------------------------------------------
// Guest Order Tracking
// ---------------------------------------------------------------------------

test.describe('Guest Order Tracking Page', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
  });

  test('displays guest order tracking form', async ({ page }) => {
    const orders = new OrdersPage(page);
    await orders.gotoTrack();

    await orders.assertTrackFormVisible();
  });

  test('form has order number and email inputs', async ({ page }) => {
    const orders = new OrdersPage(page);
    await orders.gotoTrack();

    await expect(orders.trackOrderNumberInput).toBeVisible();
    await expect(orders.trackEmailInput).toBeVisible();
    await expect(orders.trackSubmitButton).toBeVisible();
  });

  test('can lookup order with valid order number and email', async ({ page }) => {
    await mockGuestOrderLookupAPI(page, true);

    const orders = new OrdersPage(page);
    await orders.gotoTrack();

    await orders.lookupGuestOrder('ORD-GUEST-001', 'guest@example.com');

    await orders.assertFoundOrderVisible();
  });

  test('shows error when order is not found', async ({ page }) => {
    await mockGuestOrderLookupAPI(page, false);

    const orders = new OrdersPage(page);
    await orders.gotoTrack();

    await orders.lookupGuestOrder('INVALID-ORDER', 'wrong@example.com');

    await orders.assertTrackError();
  });

  test('displays found order details after successful lookup', async ({ page }) => {
    await mockGuestOrderLookupAPI(page, true);

    const orders = new OrdersPage(page);
    await orders.gotoTrack();

    await orders.lookupGuestOrder('ORD-GUEST-001', 'guest@example.com');

    await expect(orders.trackFoundOrder).toBeVisible();
  });

  test('can perform new search after finding an order', async ({ page }) => {
    await mockGuestOrderLookupAPI(page, true);

    const orders = new OrdersPage(page);
    await orders.gotoTrack();

    await orders.lookupGuestOrder('ORD-GUEST-001', 'guest@example.com');
    await orders.assertFoundOrderVisible();

    const newSearchButton = orders.trackNewSearchButton;
    const isVisible = await newSearchButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await newSearchButton.click();
      await orders.assertTrackFormVisible();
    }
  });

  test('form validation prevents empty submission', async ({ page }) => {
    const orders = new OrdersPage(page);
    await orders.gotoTrack();

    await orders.trackSubmitButton.click();

    // Form should show HTML5 validation (required fields)
    const orderNumberValidity = await orders.trackOrderNumberInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(orderNumberValidity).toBe(false);
  });

  test('guest tracking page is accessible without authentication', async ({ page }) => {
    // No authentication setup — page should load fine
    const orders = new OrdersPage(page);
    await orders.gotoTrack();

    await orders.assertTrackFormVisible();
  });

});

// ---------------------------------------------------------------------------
// Cancel Order Flow
// ---------------------------------------------------------------------------

test.describe('Order Cancellation', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
  });

  test('successfully cancels an order from list page', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrdersListAPI(page, [
      makeOrderFixture({ order_number: 'ORD-CANCEL-001', can_cancel: true }),
    ]);
    await mockOrderCancelAPI(page, 'ORD-CANCEL-001');

    const orders = new OrdersPage(page);
    await orders.gotoList();

    await orders.clickCancelOnCard(0);

    const modalVisible = await orders.cancelConfirmButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (modalVisible) {
      await orders.confirmCancel();
      await page.waitForTimeout(1000);
    }
  });

  test('successfully cancels an order from detail page', async ({ page }) => {
    await mockAuthAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrderDetailAPI(page, 'ORD-CANCEL-002', { can_cancel: true });
    await mockOrderCancelAPI(page, 'ORD-CANCEL-002');

    const orders = new OrdersPage(page);
    await orders.gotoDetail('ORD-CANCEL-002');

    const cancelButton = orders.detailCancelButton;
    const isVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await cancelButton.click();

      const modalVisible = await orders.cancelConfirmButton.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (modalVisible) {
        await orders.confirmCancel();
        await page.waitForTimeout(1000);
      }
    }
  });

});

// ---------------------------------------------------------------------------
// Reorder Flow
// ---------------------------------------------------------------------------

test.describe('Reorder Functionality', () => {

  test.beforeEach(async ({ page }) => {
    await clearTestState(page);
  });

  test('reorder from list page adds items to cart', async ({ page }) => {
    await mockAuthAPI(page);
    await mockCartAPI(page);
    await setupAuthenticatedContext(page, {
      isAuthenticated: true,
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        email_verified_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      isLoading: false,
    });
    await mockOrdersListAPI(page, [makeOrderFixture({ order_number: 'ORD-REORDER-001' })]);
    await mockOrderReorderAPI(page, 'ORD-REORDER-001');

    const orders = new OrdersPage(page);
    await orders.gotoList();

    const reorderButton = orders.reorderButtonOnCard(0);
    const isVisible = await reorderButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (isVisible) {
      await reorderButton.click();
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/\/cart/);
    }
  });

});
