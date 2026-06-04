/**
 * OrdersPage — Page Object Model
 *
 * Covers all three order-related routes:
 *   /orders           — authenticated list page
 *   /orders/:number   — authenticated detail page
 *   /orders/track     — public guest lookup page
 *
 * Extends BasePage so all header/auth/locale helpers are available.
 */

import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class OrdersPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async gotoList(): Promise<void> {
    await this.page.goto('/orders');
    await this.page.waitForLoadState('networkidle');
  }

  async gotoDetail(orderNumber: string): Promise<void> {
    await this.page.goto(`/orders/${orderNumber}`);
    await this.page.waitForLoadState('networkidle');
  }

  async gotoTrack(): Promise<void> {
    await this.page.goto('/orders/track');
    await this.page.waitForLoadState('networkidle');
  }

  // ── List page locators ─────────────────────────────────────────────────────

  get ordersList() {
    return this.page.locator('[data-testid="orders-list"]');
  }

  get orderCards() {
    return this.page.locator('[data-testid="order-card"]');
  }

  get ordersEmpty() {
    return this.page.locator('[data-testid="orders-empty"]');
  }

  get ordersFilters() {
    return this.page.locator('[data-testid="orders-filters"]');
  }

  get statusFilterButtons() {
    return this.page.locator('[data-testid="orders-status-filter-button"]');
  }

  get fromDateInput() {
    return this.page.locator('[data-testid="orders-from-date"]');
  }

  get toDateInput() {
    return this.page.locator('[data-testid="orders-to-date"]');
  }

  get clearFiltersButton() {
    return this.page.locator('[data-testid="orders-clear-filters"]');
  }

  get paginationPrev() {
    return this.page.locator('[data-testid="orders-pagination-prev"]');
  }

  get paginationNext() {
    return this.page.locator('[data-testid="orders-pagination-next"]');
  }

  get paginationInfo() {
    return this.page.locator('[data-testid="orders-pagination-info"]');
  }

  // ── Per-card locators (scoped to a specific card index) ───────────────────

  orderCard(index: number) {
    return this.orderCards.nth(index);
  }

  cancelButtonOnCard(index = 0) {
    return this.orderCards.nth(index).locator('[data-testid="order-cancel-button"]');
  }

  reorderButtonOnCard(index = 0) {
    return this.orderCards.nth(index).locator('[data-testid="order-reorder-button"]');
  }

  viewDetailsLinkOnCard(index = 0) {
    return this.orderCards.nth(index).locator('[data-testid="order-view-details-link"]');
  }

  // ── Cancel modal ──────────────────────────────────────────────────────────

  get cancelModal() {
    return this.page.locator('[data-testid="orders-cancel-confirm-button"]').locator('..');
  }

  get cancelConfirmButton() {
    return this.page.locator('[data-testid="orders-cancel-confirm-button"]');
  }

  get cancelKeepButton() {
    return this.page.locator('[data-testid="orders-cancel-keep-button"]');
  }

  // ── Detail page locators ──────────────────────────────────────────────────

  get detailHeader() {
    return this.page.locator('[data-testid="order-detail-header"]');
  }

  get detailOrderNumber() {
    return this.page.locator('[data-testid="order-detail-number"]');
  }

  get detailSummary() {
    return this.page.locator('[data-testid="order-detail-summary"]');
  }

  get detailTotal() {
    return this.page.locator('[data-testid="order-detail-total"]');
  }

  get detailReorderButton() {
    return this.page.locator('[data-testid="order-detail-reorder-button"]');
  }

  get detailCancelButton() {
    return this.page.locator('[data-testid="order-detail-cancel-button"]');
  }

  // ── Guest tracking page locators ──────────────────────────────────────────

  get trackForm() {
    return this.page.locator('[data-testid="track-lookup-form"]');
  }

  get trackOrderNumberInput() {
    return this.page.locator('[data-testid="track-order-number-input"]');
  }

  get trackEmailInput() {
    return this.page.locator('[data-testid="track-email-input"]');
  }

  get trackSubmitButton() {
    return this.page.locator('[data-testid="track-lookup-submit"]');
  }

  get trackLookupError() {
    return this.page.locator('[data-testid="track-lookup-error"]');
  }

  get trackFoundOrder() {
    return this.page.locator('[data-testid="track-found-order"]');
  }

  get trackNewSearchButton() {
    return this.page.locator('[data-testid="track-new-search-button"]');
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async filterByStatus(statusValue: string | null): Promise<void> {
    const btn = statusValue
      ? this.page.locator(`[data-testid="orders-status-filter-button"][data-status="${statusValue}"]`)
      : this.page.locator('[data-testid="orders-status-filter-button"][data-status=""]').first();
    await btn.click();
    await this.page.waitForTimeout(400);
  }

  async clearFilters(): Promise<void> {
    await this.clearFiltersButton.click();
    await this.page.waitForTimeout(400);
  }

  async clickCancelOnCard(index = 0): Promise<void> {
    await this.cancelButtonOnCard(index).click();
  }

  async confirmCancel(): Promise<void> {
    await this.cancelConfirmButton.click();
    await this.page.waitForTimeout(600);
  }

  async dismissCancelModal(): Promise<void> {
    await this.cancelKeepButton.click();
  }

  async lookupGuestOrder(orderNumber: string, email: string): Promise<void> {
    await this.trackOrderNumberInput.fill(orderNumber);
    await this.trackEmailInput.fill(email);
    await this.trackSubmitButton.click();
    await this.page.waitForTimeout(600);
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertHasOrders(): Promise<void> {
    await expect(this.ordersList).toBeVisible();
    const count = await this.orderCards.count();
    expect(count).toBeGreaterThan(0);
  }

  async assertOrderCount(expected: number): Promise<void> {
    await expect(this.orderCards).toHaveCount(expected);
  }

  async assertEmptyState(): Promise<void> {
    await expect(this.ordersEmpty).toBeVisible();
  }

  async assertDetailLoaded(orderNumber: string): Promise<void> {
    await expect(this.detailHeader).toBeVisible();
    const numberText = await this.detailOrderNumber.textContent();
    expect(numberText).toContain(orderNumber);
  }

  async assertTrackFormVisible(): Promise<void> {
    await expect(this.trackForm).toBeVisible();
    await expect(this.trackOrderNumberInput).toBeVisible();
    await expect(this.trackEmailInput).toBeVisible();
    await expect(this.trackSubmitButton).toBeVisible();
  }

  async assertFoundOrderVisible(): Promise<void> {
    await expect(this.trackFoundOrder).toBeVisible();
  }

  async assertTrackError(): Promise<void> {
    await expect(this.trackLookupError).toBeVisible();
  }
}
