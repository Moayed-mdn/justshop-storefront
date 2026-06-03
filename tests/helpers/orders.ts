/**
 * Orders Testing Helpers
 * 
 * Utilities for orders testing in JustShop Frontend.
 * Based on actual orders implementation:
 * - Orders list page (pages/profile/orders.vue or similar)
 * - Order detail page (pages/profile/orders/[id].vue or similar)
 * - Order tracking (guest order lookup)
 * - Order actions (cancel, reorder)
 */

import { Page, expect } from '@playwright/test';
import type { Order, OrderStatus } from './types';

/**
 * Navigate to orders list page (authenticated)
 */
export async function goToOrdersList(page: Page): Promise<void> {
  await page.goto('/profile/orders');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to specific order detail page
 */
export async function goToOrderDetail(
  page: Page,
  orderId: number | string
): Promise<void> {
  await page.goto(`/profile/orders/${orderId}`);
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to guest order tracking page
 */
export async function goToGuestOrderTracking(page: Page): Promise<void> {
  await page.goto('/track-order');
  await page.waitForLoadState('networkidle');
}

/**
 * Track guest order via order number and email
 */
export async function trackGuestOrder(
  page: Page,
  orderNumber: string,
  email: string
): Promise<void> {
  // Fill tracking form
  await page.fill('[name="order_number"], input[placeholder*="order"]', orderNumber);
  await page.fill('[name="email"], input[type="email"]', email);
  
  // Submit
  await page.click('button[type="submit"]');
  
  await page.waitForLoadState('networkidle');
}

/**
 * Get orders list (returns order numbers)
 */
export async function getOrdersList(page: Page): Promise<string[]> {
  const orderCards = page.locator('[data-order-card], [class*="order-card"]');
  const count = await orderCards.count();
  
  const orders: string[] = [];
  for (let i = 0; i < count; i++) {
    const orderNumber = await orderCards.nth(i).locator('[data-order-number], [class*="order-number"]').textContent();
    if (orderNumber) {
      orders.push(orderNumber.trim());
    }
  }
  
  return orders;
}

/**
 * Get order status
 */
export async function getOrderStatus(page: Page): Promise<string> {
  const statusElement = page.locator('[data-order-status], [class*="order-status"]').first();
  const status = await statusElement.textContent();
  return status?.trim().toLowerCase() || '';
}

/**
 * Get order total
 */
export async function getOrderTotal(page: Page): Promise<string> {
  const totalElement = page.locator('[data-order-total], [class*="order-total"]').first();
  const total = await totalElement.textContent();
  return total?.trim() || '';
}

/**
 * Get order items count
 */
export async function getOrderItemsCount(page: Page): Promise<number> {
  const items = page.locator('[data-order-item], [class*="order-item"]');
  return await items.count();
}

/**
 * Get order items (product names)
 */
export async function getOrderItems(page: Page): Promise<string[]> {
  const items = page.locator('[data-order-item], [class*="order-item"]');
  const count = await items.count();
  
  const products: string[] = [];
  for (let i = 0; i < count; i++) {
    const name = await items.nth(i).locator('[data-product-name], h3, h4').textContent();
    if (name) {
      products.push(name.trim());
    }
  }
  
  return products;
}

/**
 * Click on order in list to view details
 */
export async function clickOrder(
  page: Page,
  orderNumber: string
): Promise<void> {
  const orderCard = page.locator(`[data-order-card]:has-text("${orderNumber}"), [class*="order-card"]:has-text("${orderNumber}")`).first();
  await orderCard.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Cancel order
 */
export async function cancelOrder(page: Page): Promise<void> {
  // Find cancel button
  const cancelButton = page.locator('[data-action="cancel-order"], button:has-text("Cancel")').first();
  await cancelButton.click();
  
  // Confirm cancellation if there's a confirmation dialog
  const confirmButton = page.locator('[data-confirm="cancel"], button:has-text("Confirm"), button:has-text("Yes")').first();
  
  if (await confirmButton.isVisible({ timeout: 2000 })) {
    await confirmButton.click();
  }
  
  await page.waitForLoadState('networkidle');
}

/**
 * Reorder (add all items from previous order to cart)
 */
export async function reorder(page: Page): Promise<void> {
  const reorderButton = page.locator('[data-action="reorder"], button:has-text("Reorder"), button:has-text("Order Again")').first();
  await reorderButton.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Download invoice/receipt
 */
export async function downloadInvoice(page: Page): Promise<void> {
  const invoiceButton = page.locator('[data-action="download-invoice"], a:has-text("Invoice"), button:has-text("Download")').first();
  
  // Start waiting for download before clicking
  const downloadPromise = page.waitForEvent('download');
  await invoiceButton.click();
  const download = await downloadPromise;
  
  // Optionally save the download
  await download.saveAs(`test-results/downloads/${download.suggestedFilename()}`);
}

/**
 * Filter orders by status
 */
export async function filterOrdersByStatus(
  page: Page,
  status: OrderStatus
): Promise<void> {
  // Look for status filter tabs or dropdown
  const statusFilter = page.locator(`[data-status-filter="${status}"], button:has-text("${status}")`).first();
  await statusFilter.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Search orders
 */
export async function searchOrders(
  page: Page,
  query: string
): Promise<void> {
  const searchInput = page.locator('[data-orders-search], input[placeholder*="Search"]').first();
  await searchInput.fill(query);
  await page.waitForLoadState('networkidle');
}

/**
 * Sort orders
 */
export async function sortOrders(
  page: Page,
  sortBy: 'date-desc' | 'date-asc' | 'total-desc' | 'total-asc'
): Promise<void> {
  const sortSelect = page.locator('[data-orders-sort], select[name="sort"]').first();
  await sortSelect.selectOption(sortBy);
  await page.waitForLoadState('networkidle');
}

/**
 * Load more orders (pagination)
 */
export async function loadMoreOrders(page: Page): Promise<void> {
  const loadMoreButton = page.locator('[data-action="load-more"], button:has-text("Load More")').first();
  
  if (await loadMoreButton.isVisible()) {
    await loadMoreButton.click();
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Navigate to next page of orders
 */
export async function goToNextOrdersPage(page: Page): Promise<void> {
  const nextButton = page.locator('[data-pagination="next"], button:has-text("Next"), a[rel="next"]').first();
  await nextButton.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to previous page of orders
 */
export async function goToPreviousOrdersPage(page: Page): Promise<void> {
  const prevButton = page.locator('[data-pagination="prev"], button:has-text("Previous"), a[rel="prev"]').first();
  await prevButton.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Get shipping address from order detail
 */
export async function getShippingAddress(page: Page): Promise<string> {
  const addressElement = page.locator('[data-shipping-address], [class*="shipping-address"]').first();
  const address = await addressElement.textContent();
  return address?.trim() || '';
}

/**
 * Get billing address from order detail
 */
export async function getBillingAddress(page: Page): Promise<string> {
  const addressElement = page.locator('[data-billing-address], [class*="billing-address"]').first();
  const address = await addressElement.textContent();
  return address?.trim() || '';
}

/**
 * Get payment method from order detail
 */
export async function getPaymentMethod(page: Page): Promise<string> {
  const paymentElement = page.locator('[data-payment-method], [class*="payment-method"]').first();
  const method = await paymentElement.textContent();
  return method?.trim() || '';
}

/**
 * Wait for order status update
 */
export async function waitForStatusUpdate(
  page: Page,
  expectedStatus: OrderStatus,
  timeout = 10000
): Promise<void> {
  await page.waitForFunction(
    (status) => {
      const statusElement = document.querySelector('[data-order-status], [class*="order-status"]');
      if (!statusElement) return false;
      const currentStatus = statusElement.textContent?.trim().toLowerCase() || '';
      return currentStatus.includes(status.toLowerCase());
    },
    expectedStatus,
    { timeout }
  );
}

/**
 * Assert orders list has orders
 */
export async function assertHasOrders(page: Page): Promise<void> {
  const orders = await getOrdersList(page);
  expect(orders.length).toBeGreaterThan(0);
}

/**
 * Assert orders list is empty
 */
export async function assertNoOrders(page: Page): Promise<void> {
  const emptyMessage = page.locator('text=/no orders|no order history/i').first();
  await expect(emptyMessage).toBeVisible();
}

/**
 * Assert order has specific status
 */
export async function assertOrderStatus(
  page: Page,
  expectedStatus: OrderStatus
): Promise<void> {
  const status = await getOrderStatus(page);
  expect(status).toContain(expectedStatus.toLowerCase());
}

/**
 * Assert order contains specific item
 */
export async function assertOrderContainsItem(
  page: Page,
  productName: string
): Promise<void> {
  const items = await getOrderItems(page);
  const hasItem = items.some((item) =>
    item.toLowerCase().includes(productName.toLowerCase())
  );
  expect(hasItem).toBe(true);
}

/**
 * Assert order total matches expected
 */
export async function assertOrderTotal(
  page: Page,
  expectedTotal: string | RegExp
): Promise<void> {
  const total = await getOrderTotal(page);
  
  if (typeof expectedTotal === 'string') {
    expect(total).toContain(expectedTotal);
  } else {
    expect(total).toMatch(expectedTotal);
  }
}

/**
 * Assert cancel button is visible
 */
export async function assertCanCancel(page: Page): Promise<void> {
  const cancelButton = page.locator('[data-action="cancel-order"], button:has-text("Cancel")').first();
  await expect(cancelButton).toBeVisible();
  await expect(cancelButton).toBeEnabled();
}

/**
 * Assert cancel button is NOT visible
 */
export async function assertCannotCancel(page: Page): Promise<void> {
  const cancelButton = page.locator('[data-action="cancel-order"], button:has-text("Cancel")').first();
  await expect(cancelButton).not.toBeVisible();
}

/**
 * Assert reorder button is visible
 */
export async function assertCanReorder(page: Page): Promise<void> {
  const reorderButton = page.locator('[data-action="reorder"], button:has-text("Reorder")').first();
  await expect(reorderButton).toBeVisible();
  await expect(reorderButton).toBeEnabled();
}
