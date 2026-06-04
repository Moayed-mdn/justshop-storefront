/**
 * ProfilePage — Page Object Model
 *
 * Covers the user profile page at /profile (protected route, requires authentication).
 * Includes:
 *   - Personal information (name, email, phone)
 *   - Avatar upload/removal
 *   - Password change
 *   - Account deletion
 *
 * Extends BasePage so all header/auth/locale helpers are available.
 */

import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.page.goto('/profile');
    await this.page.waitForLoadState('networkidle');
  }

  // ── Page Header ───────────────────────────────────────────────────────────

  get pageHeader() {
    return this.page.locator('h1, [role="heading"]:has-text("Profile"), [role="heading"]:has-text("Account")').first();
  }

  get pageSubtitle() {
    return this.page.locator('p, [class*="subtitle"]').first();
  }

  // ── Avatar Section ────────────────────────────────────────────────────────

  get avatarSection() {
    return this.page.locator('[class*="avatar-section"], section:has([alt*="avatar"])').first();
  }

  get avatarImage() {
    return this.page.locator('img[alt*="avatar"], img[alt*="profile"]').first();
  }

  get avatarInitials() {
    return this.page.locator('[class*="initials"], div:has-text(/^[A-Z]{1,2}$/)').first();
  }

  get avatarChangeButton() {
    return this.page.locator('button:has-text("Change"), label:has-text("Change")').first();
  }

  get avatarFileInput() {
    return this.page.locator('input[type="file"][accept*="image"]').first();
  }

  get avatarRemoveButton() {
    return this.page.locator('button:has-text("Remove")').first();
  }

  // ── Personal Information Section ──────────────────────────────────────────

  get personalInfoSection() {
    return this.page.locator('form:has(#name), section:has(#name)').first();
  }

  get nameInput() {
    return this.page.locator('input[id="name"], input[name="name"]');
  }

  get emailInput() {
    return this.page.locator('input[id="profile-email"], input[name="email"]');
  }

  get phoneInput() {
    return this.page.locator('input[id="phone"], input[name="phone"]');
  }

  get googleLinkedBadge() {
    return this.page.locator('[class*="google-linked"], text=/Google/i').first();
  }

  get saveInfoButton() {
    return this.personalInfoSection.locator('button[type="submit"]');
  }

  get infoErrorMessage() {
    return this.personalInfoSection.locator('[class*="error"], [role="alert"]').first();
  }

  // ── Password Section ──────────────────────────────────────────────────────

  get passwordSection() {
    return this.page.locator('form:has([name="password"]), section:has([name="password"])').first();
  }

  get currentPasswordInput() {
    return this.page.locator('input[id="current_password"], input[name="current_password"]');
  }

  get newPasswordInput() {
    return this.page.locator('input[id="password"], input[name="password"]').first();
  }

  get confirmPasswordInput() {
    return this.page.locator('input[id="password_confirmation"], input[name="password_confirmation"]');
  }

  get updatePasswordButton() {
    return this.passwordSection.locator('button[type="submit"]');
  }

  get passwordErrorMessage() {
    return this.passwordSection.locator('[class*="error"], [role="alert"]').first();
  }

  // ── Danger Zone Section (Account Deletion) ────────────────────────────────

  get dangerZoneSection() {
    return this.page.locator('section:has-text("Delete Account"), section:has-text("Danger Zone")').first();
  }

  get deleteAccountButton() {
    return this.page.locator('button:has-text("Delete Account"), button:has-text("Delete My Account")').first();
  }

  get deleteConfirmModal() {
    return this.page.locator('[role="dialog"], [class*="modal"]:has-text("Delete")').first();
  }

  get deletePasswordInput() {
    return this.deleteConfirmModal.locator('input[type="password"]');
  }

  get deleteConfirmButton() {
    return this.deleteConfirmModal.locator('button:has-text("Delete"), button:has-text("Confirm")').first();
  }

  get deleteCancelButton() {
    return this.deleteConfirmModal.locator('button:has-text("Cancel"), button:has-text("Keep")').first();
  }

  // ── Success/Error Messages ────────────────────────────────────────────────

  get successToast() {
    return this.page.locator('[role="status"], [class*="toast"]:has-text("success")').first();
  }

  get errorToast() {
    return this.page.locator('[role="alert"], [class*="toast"]:has-text("error")').first();
  }

  // ── Actions ───────────────────────────────────────────────────────────────

  async getProfileData(): Promise<{
    name: string;
    email: string;
    phone: string;
  }> {
    const name = await this.nameInput.inputValue();
    const email = await this.emailInput.inputValue();
    const phone = await this.phoneInput.inputValue();

    return {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };
  }

  async updateProfile(data: {
    name?: string;
    email?: string;
    phone?: string;
  }): Promise<void> {
    if (data.name !== undefined) {
      await this.nameInput.fill(data.name);
    }

    if (data.email !== undefined) {
      await this.emailInput.fill(data.email);
    }

    if (data.phone !== undefined) {
      await this.phoneInput.fill(data.phone);
    }

    await this.saveInfoButton.click();
    await this.page.waitForTimeout(600);
  }

  async uploadAvatar(filePath: string): Promise<void> {
    // Trigger file input (may need to click button first if hidden)
    const isInputVisible = await this.avatarFileInput.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (!isInputVisible) {
      await this.avatarChangeButton.click();
      await this.page.waitForTimeout(300);
    }

    await this.avatarFileInput.setInputFiles(filePath);
    await this.page.waitForTimeout(1000); // Wait for upload
  }

  async removeAvatar(): Promise<void> {
    await this.avatarRemoveButton.click();
    
    // Check for confirmation modal
    const confirmButton = this.page.locator('button:has-text("Confirm"), button:has-text("Yes")').first();
    const isVisible = await confirmButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isVisible) {
      await confirmButton.click();
    }

    await this.page.waitForTimeout(600);
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword?: string;
  }): Promise<void> {
    // Scroll to password section if needed
    await this.passwordSection.scrollIntoViewIfNeeded();

    await this.currentPasswordInput.fill(data.currentPassword);
    await this.newPasswordInput.fill(data.newPassword);
    await this.confirmPasswordInput.fill(data.confirmPassword || data.newPassword);

    await this.updatePasswordButton.click();
    await this.page.waitForTimeout(600);
  }

  async setPassword(data: {
    newPassword: string;
    confirmPassword?: string;
  }): Promise<void> {
    // For users without a password (e.g., Google-only accounts)
    await this.passwordSection.scrollIntoViewIfNeeded();

    await this.newPasswordInput.fill(data.newPassword);
    await this.confirmPasswordInput.fill(data.confirmPassword || data.newPassword);

    await this.updatePasswordButton.click();
    await this.page.waitForTimeout(600);
  }

  async deleteAccount(password?: string): Promise<void> {
    await this.dangerZoneSection.scrollIntoViewIfNeeded();
    await this.deleteAccountButton.click();

    // Wait for modal
    await expect(this.deleteConfirmModal).toBeVisible({ timeout: 3000 });

    if (password) {
      await this.deletePasswordInput.fill(password);
    }

    await this.deleteConfirmButton.click();

    // Wait for redirect (usually to home or login)
    await this.page.waitForURL(/\/(login|$)/, { timeout: 5000 });
  }

  async cancelDeleteAccount(): Promise<void> {
    await this.deleteCancelButton.click();
    await expect(this.deleteConfirmModal).not.toBeVisible();
  }

  async getAvatarUrl(): Promise<string | null> {
    return await this.avatarImage.getAttribute('src');
  }

  async hasGoogleLinked(): Promise<boolean> {
    return await this.googleLinkedBadge.isVisible({ timeout: 1000 }).catch(() => false);
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async assertPageLoaded(): Promise<void> {
    await expect(this.pageHeader).toBeVisible();
    await expect(this.personalInfoSection).toBeVisible();
  }

  async assertProfileData(expected: {
    name?: string;
    email?: string;
    phone?: string;
  }): Promise<void> {
    const actual = await this.getProfileData();

    if (expected.name !== undefined) {
      expect(actual.name).toBe(expected.name);
    }

    if (expected.email !== undefined) {
      expect(actual.email).toBe(expected.email);
    }

    if (expected.phone !== undefined) {
      expect(actual.phone).toBe(expected.phone);
    }
  }

  async assertProfileUpdateSuccess(): Promise<void> {
    await expect(this.successToast).toBeVisible({ timeout: 5000 });
  }

  async assertProfileUpdateError(errorText?: string): Promise<void> {
    await expect(this.infoErrorMessage).toBeVisible();

    if (errorText) {
      await expect(this.infoErrorMessage).toContainText(errorText);
    }
  }

  async assertAvatarDisplayed(): Promise<void> {
    await expect(this.avatarImage).toBeVisible();
    
    const src = await this.getAvatarUrl();
    expect(src).toBeTruthy();
    expect(src).not.toContain('placeholder');
  }

  async assertAvatarInitialsDisplayed(): Promise<void> {
    await expect(this.avatarInitials).toBeVisible();
  }

  async assertPasswordChangeSuccess(): Promise<void> {
    await expect(this.successToast).toBeVisible({ timeout: 5000 });
  }

  async assertPasswordChangeError(errorText?: string): Promise<void> {
    await expect(this.passwordErrorMessage).toBeVisible();

    if (errorText) {
      await expect(this.passwordErrorMessage).toContainText(errorText);
    }
  }

  async assertDeleteModalVisible(): Promise<void> {
    await expect(this.deleteConfirmModal).toBeVisible();
  }

  async assertGoogleLinked(): Promise<void> {
    await expect(this.googleLinkedBadge).toBeVisible();
  }

  async assertHasPasswordField(): Promise<void> {
    await expect(this.currentPasswordInput).toBeVisible();
  }

  async assertNoPasswordField(): Promise<void> {
    const isVisible = await this.currentPasswordInput.isVisible({ timeout: 1000 }).catch(() => false);
    expect(isVisible).toBe(false);
  }
}
